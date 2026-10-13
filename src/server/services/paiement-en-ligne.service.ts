import "server-only";
import { prisma } from "@/lib/prisma";
import { audit, AuditAction } from "@/server/logs/audit";
import { enregistrerPaiement } from "@/server/services/paiement.service";
import {
  demanderPaiement,
  consulterPaiement,
  nomPasserelle,
  estSimulation,
  LIBELLE_OPERATEUR,
  DELAI_VALIDATION_MS,
  type Operateur,
} from "@/server/external/paiement-en-ligne";

/**
 * Cycle de vie d'un paiement mobile initié par un parent :
 *
 *   en_attente ──► reussie   (Paiement + reçu créés, une seule fois)
 *              ├─► echouee   (refus de l'opérateur)
 *              ├─► expiree   (le parent n'a pas validé à temps)
 *              └─► a_verifier (argent reçu mais encaissement impossible,
 *                              ex. échéance soldée entre-temps à la caisse)
 *
 * Le passage hors de « en_attente » se fait par une mise à jour conditionnelle
 * (updateMany sur statut = en_attente) : deux vérifications simultanées ne
 * peuvent jamais créer deux paiements pour la même transaction.
 */

export type StatutTransaction = "en_attente" | "reussie" | "echouee" | "expiree" | "a_verifier";

export interface EtatTransaction {
  id: string;
  statut: StatutTransaction;
  montant: number;
  operateur: Operateur;
  numeroRecu: string | null;
  motif: string | null;
}

/** Numéro guinéen : 9 chiffres commençant par 6 (indicatif +224 accepté). */
export function normaliserTelephone(brut: string): string | null {
  let n = brut.replace(/[\s.\-()]/g, "");
  if (n.startsWith("+224")) n = n.slice(4);
  else if (n.startsWith("00224")) n = n.slice(5);
  return /^6\d{8}$/.test(n) ? n : null;
}

async function soldeFrais(fraisEleveId: string) {
  const frais = await prisma.fraisEleve.findUnique({
    where: { id: fraisEleveId },
    include: { remises: true, echeance: { include: { typeFrais: true } } },
  });
  if (!frais || frais.statut === "annule") return null;
  const remises = frais.remises.reduce((s, r) => s + Number(r.montant), 0);
  return {
    frais,
    solde: Math.max(0, Number(frais.montantDu) - remises - Number(frais.montantPaye)),
    libelle: frais.echeance.libelle ?? frais.echeance.typeFrais.nom,
  };
}

async function etat(id: string): Promise<EtatTransaction> {
  const t = await prisma.transactionEnLigne.findUniqueOrThrow({
    where: { id },
    include: { paiement: { select: { numeroRecu: true } } },
  });
  return {
    id: t.id,
    statut: t.statut as StatutTransaction,
    montant: Number(t.montant),
    operateur: t.operateur as Operateur,
    numeroRecu: t.paiement?.numeroRecu ?? null,
    motif: t.motifEchec,
  };
}

// ─── Lancer un paiement ──────────────────────────────────────

export async function initierPaiementEnLigne(input: {
  etablissementId: string;
  fraisEleveId: string;
  utilisateurId: string;
  operateur: Operateur;
  telephone: string;
}): Promise<EtatTransaction> {
  // Une demande déjà en cours sur cette échéance est reprise, jamais doublée.
  const enCours = await prisma.transactionEnLigne.findFirst({
    where: { fraisEleveId: input.fraisEleveId, statut: "en_attente" },
    orderBy: { createdAt: "desc" },
  });
  if (enCours) {
    const e = await actualiserTransaction(enCours.id);
    if (e.statut === "en_attente") return e;
  }

  const s = await soldeFrais(input.fraisEleveId);
  if (!s) throw new Error("Échéance introuvable");
  if (s.solde <= 0) throw new Error("Cette échéance est déjà soldée.");

  const { referenceOperateur } = await demanderPaiement({
    operateur: input.operateur,
    telephone: input.telephone,
    montant: s.solde,
    libelle: s.libelle,
  });

  const t = await prisma.transactionEnLigne.create({
    data: {
      etablissementId: input.etablissementId,
      fraisEleveId: input.fraisEleveId,
      initieeParId: input.utilisateurId,
      montant: s.solde,
      operateur: input.operateur,
      telephone: input.telephone,
      referenceOperateur,
      passerelle: nomPasserelle(),
    },
  });

  await audit({
    utilisateurId: input.utilisateurId,
    etablissementId: input.etablissementId,
    action: AuditAction.CREATE,
    entite: "TransactionEnLigne",
    entiteId: t.id,
    apres: { montant: s.solde, operateur: input.operateur, reference: referenceOperateur },
  });

  return etat(t.id);
}

// ─── Suivre un paiement ──────────────────────────────────────

/** Interroge l'opérateur et fait avancer la transaction si son sort est connu. */
export async function actualiserTransaction(id: string): Promise<EtatTransaction> {
  const t = await prisma.transactionEnLigne.findUnique({ where: { id } });
  if (!t) throw new Error("Transaction introuvable");
  if (t.statut !== "en_attente") return etat(id);

  const terminer = (statut: StatutTransaction, motifEchec?: string) =>
    prisma.transactionEnLigne.updateMany({
      where: { id, statut: "en_attente" },
      data: { statut, motifEchec, termineeLe: new Date() },
    });

  const resultat = await consulterPaiement(t);

  if (resultat.statut === "en_attente") {
    if (Date.now() - t.createdAt.getTime() > DELAI_VALIDATION_MS) {
      await terminer("expiree", "Le paiement n'a pas été validé sur le téléphone à temps.");
    }
    return etat(id);
  }

  if (resultat.statut === "echouee") {
    await terminer("echouee", resultat.motif);
    return etat(id);
  }

  // Réussie : seul l'appel qui fait passer la transaction hors « en_attente »
  // crée le paiement.
  const { count } = await terminer("reussie");
  if (count === 1) await encaisser(t);
  return etat(id);
}

async function encaisser(t: {
  id: string;
  etablissementId: string;
  fraisEleveId: string;
  initieeParId: string;
  montant: unknown;
  operateur: string;
  referenceOperateur: string;
}) {
  const montant = Number(t.montant);
  const operateur = LIBELLE_OPERATEUR[t.operateur as Operateur] ?? t.operateur;
  const aVerifier = (motif: string) =>
    prisma.transactionEnLigne.update({
      where: { id: t.id },
      data: { statut: "a_verifier", motifEchec: motif },
    });

  const s = await soldeFrais(t.fraisEleveId);
  if (!s || s.solde < montant) {
    await aVerifier(
      `Montant reçu (${montant}) supérieur au solde restant (${s?.solde ?? 0}) : échéance réglée entre-temps. À rembourser ou réaffecter.`,
    );
    return;
  }

  let paiement;
  try {
    ({ paiement } = await enregistrerPaiement({
      fraisEleveId: t.fraisEleveId,
      montant,
      modePaiement: "mobile",
      reference: `${operateur} · ${t.referenceOperateur}`,
      observation: estSimulation()
        ? "Paiement en ligne (espace parent) — simulation, aucun débit réel"
        : "Paiement en ligne (espace parent)",
      encaisseParId: t.initieeParId,
      etablissementId: t.etablissementId,
    }));
  } catch (e) {
    await aVerifier(`Encaissement impossible : ${e instanceof Error ? e.message : String(e)}`);
    return;
  }

  await prisma.transactionEnLigne.update({
    where: { id: t.id },
    data: { paiementId: paiement.id },
  });

  // Reçu par e-mail au parent qui a payé (sans bloquer l'encaissement).
  try {
    const [parent, etab] = await Promise.all([
      prisma.utilisateur.findUnique({
        where: { id: t.initieeParId },
        select: { email: true, prenom: true },
      }),
      prisma.etablissement.findUnique({
        where: { id: t.etablissementId },
        select: { devise: true },
      }),
    ]);
    const eleve = s.frais.inscriptionId
      ? await prisma.inscription.findUnique({
          where: { id: s.frais.inscriptionId },
          select: { eleve: { select: { prenom: true, nom: true } } },
        })
      : null;
    if (parent?.email && eleve) {
      const { envoyerRecuPaiement } = await import("@/server/external/email.service");
      await envoyerRecuPaiement({
        email: parent.email,
        prenomParent: parent.prenom,
        prenomEleve: eleve.eleve.prenom,
        nomEleve: eleve.eleve.nom,
        numeroRecu: paiement.numeroRecu,
        montant,
        devise: etab?.devise ?? "GNF",
        etablissementId: t.etablissementId,
      });
      await prisma.recu.update({
        where: { paiementId: paiement.id },
        data: { envoiEmail: true, dateEnvoi: new Date() },
      });
    }
  } catch (e) {
    console.error("[email reçu paiement en ligne]", e);
  }
}

/**
 * Fait avancer les transactions restées en attente (parent qui a fermé la
 * page avant la confirmation). Appelé à l'affichage des pages de paiement
 * côté parent et côté école ; avec une API réelle, le webhook de l'opérateur
 * jouera ce rôle.
 */
export async function resoudreTransactionsEnAttente(where: {
  etablissementId: string;
  eleveId?: string;
}) {
  const enAttente = await prisma.transactionEnLigne.findMany({
    where: {
      etablissementId: where.etablissementId,
      statut: "en_attente",
      ...(where.eleveId ? { fraisEleve: { inscription: { eleveId: where.eleveId } } } : {}),
    },
    select: { id: true },
    take: 50,
  });
  for (const t of enAttente) {
    try {
      await actualiserTransaction(t.id);
    } catch (e) {
      console.error("[paiement en ligne] actualisation", t.id, e);
    }
  }
}
