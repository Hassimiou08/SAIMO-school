import "server-only";
import { randomBytes } from "crypto";

/**
 * Passerelle de paiement mobile (Orange Money, MTN Mobile Money).
 *
 * Le parcours est celui d'une vraie API « push » : on demande le paiement à
 * l'opérateur, le parent valide sur son téléphone, puis on interroge
 * l'opérateur jusqu'à obtenir le résultat. Seule la passerelle change le jour
 * où une API réelle est branchée : le reste (transaction, paiement, reçu,
 * statuts) ne bouge pas.
 *
 * Aucune API n'est encore branchée : la passerelle « simulation » est
 * utilisée. Elle ne débite rien. Numéros de test :
 *   - se terminant par 000 → refusé par l'opérateur (solde insuffisant)
 *   - se terminant par 111 → le parent ne valide jamais (expiration)
 *   - tout autre numéro    → validé après quelques secondes
 */

export type Operateur = "orange" | "mtn";

export const LIBELLE_OPERATEUR: Record<Operateur, string> = {
  orange: "Orange Money",
  mtn: "MTN Mobile Money",
};

export type ResultatOperateur =
  | { statut: "en_attente" }
  | { statut: "reussie" }
  | { statut: "echouee"; motif: string };

/** Délai laissé au parent pour valider sur son téléphone. */
export const DELAI_VALIDATION_MS = 3 * 60 * 1000;

const DELAI_SIMULATION_MS = 6 * 1000;

export function nomPasserelle(): string {
  return "simulation";
}

export function estSimulation(): boolean {
  return nomPasserelle() === "simulation";
}

/** Envoie la demande de paiement au téléphone du parent. */
export async function demanderPaiement(demande: {
  operateur: Operateur;
  telephone: string;
  montant: number;
  libelle: string;
}): Promise<{ referenceOperateur: string }> {
  const prefixe = demande.operateur === "orange" ? "OM" : "MOMO";
  return { referenceOperateur: `SIM-${prefixe}-${randomBytes(6).toString("hex").toUpperCase()}` };
}

/** Interroge l'opérateur sur l'état d'une demande. */
export async function consulterPaiement(transaction: {
  telephone: string;
  createdAt: Date;
}): Promise<ResultatOperateur> {
  const ecoule = Date.now() - transaction.createdAt.getTime();
  if (ecoule < DELAI_SIMULATION_MS) return { statut: "en_attente" };
  if (transaction.telephone.endsWith("000")) {
    return { statut: "echouee", motif: "Paiement refusé par l'opérateur : solde insuffisant." };
  }
  if (transaction.telephone.endsWith("111")) return { statut: "en_attente" };
  return { statut: "reussie" };
}
