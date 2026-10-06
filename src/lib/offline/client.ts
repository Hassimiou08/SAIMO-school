"use client";

// Moteur hors ligne côté navigateur.
//
// Toute opération « hors ligne » passe par /api/sync, connexion ou pas :
//  - en ligne, elle est envoyée tout de suite ;
//  - hors ligne (ou si le réseau lâche en cours de route), elle est mise en
//    file d'attente (IndexedDB) et renvoyée plus tard avec le même id.
// Le serveur n'applique jamais deux fois le même id : un envoi interrompu
// puis rejoué ne crée pas de doublon (ex. : double encaissement).

import { useCallback } from "react";
import { toast } from "sonner";
import type { ActionResult } from "@/server/actions/eleves";
import { versEntrees } from "./operations";
import {
  LIBELLES_ACTIONS,
  type ActionsHorsLigne,
  type ArgSerialise,
  type NomActionHorsLigne,
} from "./actions-hors-ligne";
import { useCurrentUserOptional } from "@/components/providers/UserProvider";
import type { OperationEnvoyee, PayloadsOperation, ResultatOperation, TypeOperation } from "./operations";
import {
  ajouterOperation,
  listerOperations,
  marquerErreur,
  supprimerOperation,
  type OperationLocale,
} from "./outbox";

export type ResultatHorsLigne<T> =
  | { succes: true; enAttente: false; data: T }
  | { succes: true; enAttente: true }
  | { succes: false; erreur: string };

/** Événement émis à chaque changement de la file (ajout, synchro, suppression). */
export const EVENEMENT_FILE = "saimo-hors-ligne";

const DELAI_ENVOI_MS = 20_000;
const TAILLE_LOT = 20;

export const MESSAGE_CONNEXION_REQUISE =
  "Cette action nécessite une connexion internet. Réessayez une fois connecté.";

/** Pour les actions qui restent réservées au mode connecté. */
export function estHorsLigne(): boolean {
  return typeof navigator !== "undefined" && !navigator.onLine;
}

export function notifierChangement(detail?: { appliquees?: number; erreurs?: number }) {
  window.dispatchEvent(new CustomEvent(EVENEMENT_FILE, { detail }));
}

class ErreurReseau extends Error {}
class SessionExpiree extends Error {}

async function envoyer(ops: OperationEnvoyee[]): Promise<ResultatOperation[]> {
  const ctrl = new AbortController();
  const minuteur = setTimeout(() => ctrl.abort(), DELAI_ENVOI_MS);
  let res: Response;
  try {
    res = await fetch("/api/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ operations: ops }),
      signal: ctrl.signal,
    });
  } catch {
    throw new ErreurReseau();
  } finally {
    clearTimeout(minuteur);
  }
  if (res.status === 401) throw new SessionExpiree();
  // Erreur serveur passagère : on retentera plus tard.
  if (!res.ok) throw new ErreurReseau();
  const corps = (await res.json()) as { resultats: ResultatOperation[] };
  return corps.resultats;
}

const versEnvoi = (op: OperationLocale): OperationEnvoyee => ({
  id: op.id,
  type: op.type,
  payload: op.payload,
  saisieLe: op.saisieLe,
});

export async function executerOperation<K extends TypeOperation, T = unknown>(
  utilisateurId: string,
  type: K,
  payload: PayloadsOperation[K],
  libelle: string,
): Promise<ResultatHorsLigne<T>> {
  const op: OperationLocale<K> = {
    id: crypto.randomUUID(),
    type,
    payload,
    libelle,
    utilisateurId,
    saisieLe: new Date().toISOString(),
    statut: "en_attente",
  };

  const mettreEnFile = async (): Promise<ResultatHorsLigne<T>> => {
    await ajouterOperation(op);
    notifierChangement();
    if (navigator.onLine) void synchroniser(utilisateurId);
    return { succes: true, enAttente: true };
  };

  // Hors ligne, ou des opérations plus anciennes attendent encore :
  // on respecte l'ordre de saisie.
  if (!navigator.onLine) return mettreEnFile();
  const enAttente = (await listerOperations(utilisateurId)).some((o) => o.statut === "en_attente");
  if (enAttente) return mettreEnFile();

  try {
    const [r] = await envoyer([versEnvoi(op)]);
    if (!r) return mettreEnFile();
    return r.succes
      ? { succes: true, enAttente: false, data: r.data as T }
      : { succes: false, erreur: r.erreur };
  } catch (e) {
    if (e instanceof SessionExpiree) {
      return { succes: false, erreur: "Votre session a expiré : reconnectez-vous." };
    }
    return mettreEnFile();
  }
}

// Lots limités en nombre et en taille (logos, signatures… en data URI) pour
// rester sous la limite de taille des requêtes de l'hébergeur.
const TAILLE_LOT_MAX_OCTETS = 2_500_000;

function decouperEnLots(ops: OperationLocale[]): OperationLocale[][] {
  const lots: OperationLocale[][] = [];
  let lot: OperationLocale[] = [];
  let taille = 0;
  for (const op of ops) {
    const t = JSON.stringify(op.payload).length;
    if (lot.length && (lot.length >= TAILLE_LOT || taille + t > TAILLE_LOT_MAX_OCTETS)) {
      lots.push(lot);
      lot = [];
      taille = 0;
    }
    lot.push(op);
    taille += t;
  }
  if (lot.length) lots.push(lot);
  return lots;
}

let synchroEnCours: Promise<EtatSynchro> | null = null;

export type EtatSynchro = "ok" | "hors_ligne" | "session_expiree";

/** Envoie les opérations en attente, dans l'ordre. Un seul envoi à la fois. */
export function synchroniser(utilisateurId: string): Promise<EtatSynchro> {
  if (synchroEnCours) return synchroEnCours;
  const lancer = () => synchroniserMaintenant(utilisateurId);
  // Verrou partagé entre les onglets quand le navigateur le permet.
  const verrou: Promise<EtatSynchro> = navigator.locks
    ? navigator.locks.request("saimo-synchro", lancer).then((r) => r)
    : lancer();
  const enCours = verrou.finally(() => {
    synchroEnCours = null;
  });
  synchroEnCours = enCours;
  return enCours;
}

async function synchroniserMaintenant(utilisateurId: string): Promise<EtatSynchro> {
  if (!navigator.onLine) return "hors_ligne";
  const ops = (await listerOperations(utilisateurId)).filter((o) => o.statut === "en_attente");
  let appliquees = 0;
  let erreurs = 0;
  try {
    for (const lot of decouperEnLots(ops)) {
      const resultats = await envoyer(lot.map(versEnvoi));
      for (const op of lot) {
        const r = resultats.find((x) => x.id === op.id);
        if (!r) continue; // non traité : reste en attente
        if (r.succes) {
          await supprimerOperation(op.id);
          appliquees++;
        } else {
          await marquerErreur(op, r.erreur);
          erreurs++;
        }
      }
    }
    return "ok";
  } catch (e) {
    return e instanceof SessionExpiree ? "session_expiree" : "hors_ligne";
  } finally {
    if (ops.length) notifierChangement({ appliquees, erreurs });
  }
}

/** Version liée à l'utilisateur connecté, pour les composants. */
export function useExecuterOperation() {
  const user = useCurrentUserOptional();
  const utilisateurId = user?.id;
  return useCallback(
    async <K extends TypeOperation, T = unknown>(
      type: K,
      payload: PayloadsOperation[K],
      libelle: string,
    ): Promise<ResultatHorsLigne<T>> => {
      if (!utilisateurId) return { succes: false, erreur: "Utilisateur non identifié." };
      return executerOperation<K, T>(utilisateurId, type, payload, libelle);
    },
    [utilisateurId],
  );
}

// ─── Étape 2 : actions de la liste blanche ─────────────────────────────

let utilisateurCourant: string | null = null;

/** Appelé par SyncHorsLigne (présent dans tous les espaces connectés). */
export function definirUtilisateurHorsLigne(id: string | null) {
  utilisateurCourant = id;
}

type DonneesAction<K extends NomActionHorsLigne> = Extract<
  Awaited<ReturnType<ActionsHorsLigne[K]>>,
  { succes: true }
>["data"];

/**
 * Résultat d'une action : celui de la Server Action, ou « en attente » quand
 * elle a été gardée sur l'appareil (un message l'indique déjà à l'utilisateur).
 */
export type ResultatAction<T> =
  | (ActionResult<T> & { enAttente?: false })
  | { succes: true; enAttente: true; data?: undefined };

function serialiser(a: unknown): ArgSerialise {
  if (a instanceof FormData) return { t: "fd", v: versEntrees(a) };
  if (a === undefined) return { t: "undef" };
  return { t: "json", v: a };
}

function precisionAuto(args: unknown[]): string | undefined {
  for (const a of args) {
    if (!(a instanceof FormData)) continue;
    for (const champ of ["nom", "titre", "libelle", "beneficiaire", "objet", "code"]) {
      const v = a.get(champ);
      if (typeof v === "string" && v.trim()) return v.trim().slice(0, 60);
    }
  }
  return undefined;
}

/**
 * Appelle une Server Action de la liste blanche, avec ou sans connexion.
 * À utiliser à la place de l'appel direct : `executerAction("pedagogie.creerMatiere", [fd])`.
 */
export async function executerAction<K extends NomActionHorsLigne>(
  nom: K,
  args: Parameters<ActionsHorsLigne[K]>,
  precision?: string,
): Promise<ResultatAction<DonneesAction<K>>> {
  if (!utilisateurCourant) {
    return { succes: false, erreur: "Utilisateur non identifié : rechargez la page." };
  }
  const detail = precision ?? precisionAuto(args);
  const libelle = detail ? `${LIBELLES_ACTIONS[nom]} — ${detail}` : LIBELLES_ACTIONS[nom];
  const r = await executerOperation<"action", DonneesAction<K>>(
    utilisateurCourant,
    "action",
    { nom, args: args.map(serialiser) },
    libelle,
  );
  if (!r.succes) return { succes: false, erreur: r.erreur };
  if (r.enAttente) {
    toast.info(`${libelle} : enregistré sur cet appareil, envoi au retour de la connexion.`);
    return { succes: true, enAttente: true };
  }
  return { succes: true, data: r.data };
}

/** Message de succès, sauf si l'opération a été mise en attente (déjà signalé). */
export function toastSucces(r: { enAttente?: boolean }, message: string) {
  if (!r.enAttente) toast.success(message);
}
