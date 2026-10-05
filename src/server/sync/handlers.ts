import "server-only";

import { z } from "zod";
import type { ActionResult } from "@/server/actions/eleves";
import { actionSaisirNotes, actionCreerEvaluation } from "@/server/actions/evaluations";
import { actionEnregistrerAbsence, actionJustifierAbsence } from "@/server/actions/absences";
import { actionInscrireEleveComplet, actionModifierEleve } from "@/server/actions/eleves";
import { actionCreerDepense, actionMarquerDepensePayee } from "@/server/actions/compta";
import { encaisserDepuisFormulaire } from "@/server/services/encaissement.service";
import {
  versFormData,
  type PayloadsOperation,
  type TypeOperation,
} from "@/lib/offline/operations";

// Chaque opération hors ligne réutilise la même logique que l'écran en ligne
// (validation, permissions, audit) : rien n'est dupliqué ici.

const entrees = z.array(z.tuple([z.string().max(100), z.string().max(5000)])).max(200);
const id = z.string().min(1).max(64);

const schemas: { [K in TypeOperation]: z.ZodType<PayloadsOperation[K]> } = {
  "notes.saisir": z.object({
    evaluationId: id,
    notes: z
      .array(
        z.object({
          eleveId: id,
          valeur: z.number().nullable().optional(),
          absent: z.boolean().optional(),
          dispense: z.boolean().optional(),
          observations: z.string().max(500).optional(),
        }),
      )
      .max(500),
  }),
  "evaluation.creer": z.object({ form: entrees }),
  "absence.enregistrer": z.object({ form: entrees }),
  "absence.justifier": z.object({ presenceId: id, motif: z.string().max(500) }),
  "paiement.enregistrer": z.object({ form: entrees }),
  "eleve.inscrire": z.object({ form: entrees }),
  "eleve.modifier": z.object({ eleveId: id, form: entrees }),
  "depense.creer": z.object({ form: entrees }),
  "depense.payer": z.object({ depenseId: id, mode: z.string().max(30) }),
};

type Handler<K extends TypeOperation> = (
  payload: PayloadsOperation[K],
  saisieLe: Date,
) => Promise<ActionResult<unknown>>;

const handlers: { [K in TypeOperation]: Handler<K> } = {
  "notes.saisir": (p) => actionSaisirNotes(p.evaluationId, p.notes),
  "evaluation.creer": (p) => actionCreerEvaluation(versFormData(p.form)),
  "absence.enregistrer": (p) => actionEnregistrerAbsence(versFormData(p.form)),
  "absence.justifier": (p) => actionJustifierAbsence(p.presenceId, p.motif),
  // Le paiement garde la date réelle d'encaissement (caisse du bon jour).
  "paiement.enregistrer": (p, saisieLe) =>
    encaisserDepuisFormulaire(versFormData(p.form), saisieLe),
  "eleve.inscrire": (p) => actionInscrireEleveComplet(versFormData(p.form)),
  "eleve.modifier": (p) => actionModifierEleve(p.eleveId, versFormData(p.form)),
  "depense.creer": (p) => actionCreerDepense(versFormData(p.form)),
  "depense.payer": (p) => actionMarquerDepensePayee(p.depenseId, p.mode),
};

export function estTypeOperation(t: string): t is TypeOperation {
  return Object.prototype.hasOwnProperty.call(handlers, t);
}

export async function executerHandler(
  type: TypeOperation,
  payload: unknown,
  saisieLe: Date,
): Promise<ActionResult<unknown>> {
  const parsed = schemas[type].safeParse(payload);
  if (!parsed.success) return { succes: false, erreur: "Opération invalide." };
  const handler = handlers[type] as Handler<TypeOperation>;
  return handler(parsed.data as PayloadsOperation[TypeOperation], saisieLe);
}
