// Opérations utilisables hors connexion : partagées entre le client (file
// d'attente) et le serveur (route /api/sync). Fichier sans dépendance serveur.

import type { SaisieNote } from "@/server/services/notes.service";

/** Contenu d'un formulaire sérialisé (FormData → paires clé/valeur). */
export type Entrees = [string, string][];

export interface PayloadsOperation {
  "notes.saisir": { evaluationId: string; notes: SaisieNote[] };
  "evaluation.creer": { form: Entrees };
  "absence.enregistrer": { form: Entrees };
  "absence.justifier": { presenceId: string; motif: string };
  "paiement.enregistrer": { form: Entrees };
  "eleve.inscrire": { form: Entrees };
  "eleve.modifier": { eleveId: string; form: Entrees };
  "depense.creer": { form: Entrees };
  "depense.payer": { depenseId: string; mode: string };
}

export type TypeOperation = keyof PayloadsOperation;

export const TYPES_OPERATION: TypeOperation[] = [
  "notes.saisir",
  "evaluation.creer",
  "absence.enregistrer",
  "absence.justifier",
  "paiement.enregistrer",
  "eleve.inscrire",
  "eleve.modifier",
  "depense.creer",
  "depense.payer",
];

/** Opération telle qu'envoyée au serveur. */
export interface OperationEnvoyee<K extends TypeOperation = TypeOperation> {
  id: string; // UUID généré sur l'appareil
  type: K;
  payload: PayloadsOperation[K];
  saisieLe: string; // ISO
}

export type ResultatOperation =
  | { id: string; succes: true; data: unknown }
  | { id: string; succes: false; erreur: string };

export function versEntrees(fd: FormData): Entrees {
  const entrees: Entrees = [];
  fd.forEach((v, k) => {
    // Les fichiers ne voyagent pas hors ligne ; aucun formulaire concerné n'en a.
    if (typeof v === "string") entrees.push([k, v]);
  });
  return entrees;
}

export function versFormData(entrees: Entrees): FormData {
  const fd = new FormData();
  for (const [k, v] of entrees) fd.append(k, v);
  return fd;
}
