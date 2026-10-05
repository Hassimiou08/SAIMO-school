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
    for (let i = 0; i < ops.length; i += TAILLE_LOT) {
      const lot = ops.slice(i, i + TAILLE_LOT);
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
