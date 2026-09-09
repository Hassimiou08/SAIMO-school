"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireContext, requirePermission } from "@/server/context";
import { saisirNotes, validerEvaluation, type SaisieNote } from "@/server/services/notes.service";
import type { ActionResult } from "./eleves";

import { messageErreur as msg } from "@/server/errors";
const s = (v: FormDataEntryValue | null) => {
  const t = typeof v === "string" ? v.trim() : "";
  return t === "" ? undefined : t;
};

// ─── Créer une évaluation ────────────────────────────────────

const schema = z.object({
  classeId: z.string().min(1),
  periodeId: z.string().min(1),
  matiereId: z.string().min(1),
  typeEvaluationId: z.string().min(1),
  titre: z.string().max(160).optional(),
  dateEvaluation: z.string().optional(),
  noteMaximale: z.coerce.number().positive().max(100).default(20),
});

export async function actionCreerEvaluation(
  formData: FormData,
): Promise<ActionResult<{ id: string }>> {
  try {
    const ctx = await requireContext();
    requirePermission(ctx.role, "evaluation:create");

    const parsed = schema.safeParse({
      classeId: formData.get("classeId"),
      periodeId: formData.get("periodeId"),
      matiereId: formData.get("matiereId"),
      typeEvaluationId: formData.get("typeEvaluationId"),
      titre: s(formData.get("titre")),
      dateEvaluation: s(formData.get("dateEvaluation")),
      noteMaximale: formData.get("noteMaximale") ?? 20,
    });
    if (!parsed.success) {
      return { succes: false, erreur: parsed.error.issues[0]?.message ?? "Données invalides" };
    }

    const classe = await prisma.classe.findFirst({
      where: { id: parsed.data.classeId, etablissementId: ctx.etablissementId },
    });
    if (!classe) return { succes: false, erreur: "Classe invalide" };

    // Un enseignant ne peut créer une évaluation que pour une de ses affectations.
    if (ctx.role === "ENSEIGNANT" || ctx.role === "PROF_PRINCIPAL") {
      const affectation = await prisma.affectationEnseignant.findFirst({
        where: {
          classeId: parsed.data.classeId,
          matiereId: parsed.data.matiereId,
          anneeScolaireId: ctx.anneeScolaireId,
          enseignant: { utilisateurId: ctx.utilisateurId },
        },
        select: { id: true },
      });
      if (!affectation) {
        return {
          succes: false,
          erreur: "Vous n'êtes pas affecté à cette matière dans cette classe.",
        };
      }
    }

    const evaluation = await prisma.evaluation.create({
      data: {
        etablissementId: ctx.etablissementId,
        classeId: parsed.data.classeId,
        periodeId: parsed.data.periodeId,
        matiereId: parsed.data.matiereId,
        typeEvaluationId: parsed.data.typeEvaluationId,
        titre: parsed.data.titre,
        dateEvaluation: parsed.data.dateEvaluation ? new Date(parsed.data.dateEvaluation) : undefined,
        noteMaximale: parsed.data.noteMaximale,
        statut: "ouverte",
        creePar: ctx.utilisateurId,
      },
    });

    revalidatePath("/portail/notes");
    return { succes: true, data: { id: evaluation.id } };
  } catch (e) {
    return { succes: false, erreur: msg(e) };
  }
}

// ─── Saisir les notes ───────────────────────────────────────

export async function actionSaisirNotes(
  evaluationId: string,
  notes: SaisieNote[],
): Promise<ActionResult> {
  try {
    const ctx = await requireContext();
    requirePermission(ctx.role, "note:saisir");
    await saisirNotes(evaluationId, notes, ctx.utilisateurId, ctx.etablissementId);
    revalidatePath("/portail/notes");
    revalidatePath(`/portail/notes/${evaluationId}`);
    return { succes: true, data: undefined };
  } catch (e) {
    return { succes: false, erreur: msg(e) };
  }
}

// ─── Verrouiller une évaluation ─────────────────────────────

export async function actionValiderEvaluation(evaluationId: string): Promise<ActionResult> {
  try {
    const ctx = await requireContext();
    requirePermission(ctx.role, "evaluation:validate");
    await validerEvaluation(evaluationId, ctx.utilisateurId, ctx.etablissementId);
    revalidatePath("/portail/notes");
    return { succes: true, data: undefined };
  } catch (e) {
    return { succes: false, erreur: msg(e) };
  }
}

// ─── Déverrouiller une évaluation (correction après verrouillage) ────

export async function actionDeverrouillerEvaluation(
  evaluationId: string,
): Promise<ActionResult> {
  try {
    const ctx = await requireContext();
    // Droit spécial : correction d'une note verrouillée (RM-08).
    requirePermission(ctx.role, "note:corriger");

    const evaluation = await prisma.evaluation.findFirst({
      where: { id: evaluationId, etablissementId: ctx.etablissementId },
      select: { id: true, statut: true },
    });
    if (!evaluation) return { succes: false, erreur: "Évaluation introuvable" };
    if (evaluation.statut !== "verrouillee") {
      return { succes: false, erreur: "Cette évaluation n'est pas verrouillée." };
    }

    await prisma.evaluation.update({
      where: { id: evaluationId },
      data: { statut: "ouverte", valideePar: null, dateValidation: null },
    });

    const { audit, AuditAction } = await import("@/server/logs/audit");
    await audit({
      utilisateurId: ctx.utilisateurId,
      etablissementId: ctx.etablissementId,
      action: AuditAction.UNLOCK,
      entite: "Evaluation",
      entiteId: evaluationId,
      apres: { statut: "ouverte" },
    });

    revalidatePath("/portail/notes");
    revalidatePath(`/portail/notes/${evaluationId}`);
    return { succes: true, data: undefined };
  } catch (e) {
    return { succes: false, erreur: msg(e) };
  }
}
