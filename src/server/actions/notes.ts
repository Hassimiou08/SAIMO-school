"use server";

import { autoriser } from "@/server/permissions/can";
import {
  saisirNotes,
  validerEvaluation,
  calculerMoyennesClasse,
  type SaisieNote,
} from "@/server/services/notes.service";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import type { ActionResult } from "./eleves";

// ─── Action : Saisir les notes ────────────────────────────────

const schemaSaisieNote = z.object({
  eleveId: z.string(),
  valeur: z.number().nullable().optional(),
  absent: z.boolean().optional(),
  dispense: z.boolean().optional(),
  observations: z.string().optional(),
});

export async function actionSaisirNotes(
  utilisateurId: string,
  etablissementId: string,
  evaluationId: string,
  notes: SaisieNote[]
): Promise<ActionResult> {
  try {
    // RM-06 : enseignant ne saisit que ses classes/matières (vérifié dans le service)
    await autoriser(utilisateurId, etablissementId, "note:saisir");

    const notesParsees = z.array(schemaSaisieNote).parse(notes);
    await saisirNotes(evaluationId, notesParsees, utilisateurId, etablissementId);

    revalidatePath("/evaluations");
    return { succes: true, data: undefined };
  } catch (error) {
    return {
      succes: false,
      erreur: error instanceof Error ? error.message : "Erreur inattendue",
    };
  }
}

// ─── Action : Valider une évaluation ─────────────────────────

export async function actionValiderEvaluation(
  utilisateurId: string,
  etablissementId: string,
  evaluationId: string
): Promise<ActionResult> {
  try {
    await autoriser(utilisateurId, etablissementId, "evaluation:validate");
    await validerEvaluation(evaluationId, utilisateurId, etablissementId);
    revalidatePath("/evaluations");
    return { succes: true, data: undefined };
  } catch (error) {
    return {
      succes: false,
      erreur: error instanceof Error ? error.message : "Erreur inattendue",
    };
  }
}

// ─── Action : Calculer les moyennes ──────────────────────────

export async function actionCalculerMoyennes(
  utilisateurId: string,
  etablissementId: string,
  classeId: string,
  periodeId: string
): Promise<ActionResult<Awaited<ReturnType<typeof calculerMoyennesClasse>>>> {
  try {
    await autoriser(utilisateurId, etablissementId, "bulletin:generer");
    const moyennes = await calculerMoyennesClasse(classeId, periodeId, etablissementId);
    return { succes: true, data: moyennes };
  } catch (error) {
    return {
      succes: false,
      erreur: error instanceof Error ? error.message : "Erreur inattendue",
    };
  }
}
