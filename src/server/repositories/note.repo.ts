import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export interface FiltresNote {
  evaluationId: string;
}

export async function trouverNotesParEvaluation(evaluationId: string) {
  return prisma.note.findMany({
    where: { evaluationId },
    include: { eleve: true },
    orderBy: [{ eleve: { nom: "asc" } }],
  });
}

export async function upsertNote(data: {
  evaluationId: string;
  eleveId: string;
  valeur?: number | null;
  absent?: boolean;
  dispense?: boolean;
  observations?: string;
  saisieParId?: string;
}) {
  return prisma.note.upsert({
    where: {
      evaluationId_eleveId: {
        evaluationId: data.evaluationId,
        eleveId: data.eleveId,
      },
    },
    create: {
      evaluationId: data.evaluationId,
      eleveId: data.eleveId,
      valeur: data.valeur,
      absent: data.absent ?? false,
      dispense: data.dispense ?? false,
      observations: data.observations,
      saisieParId: data.saisieParId,
    },
    update: {
      valeur: data.valeur,
      absent: data.absent,
      dispense: data.dispense,
      observations: data.observations,
      modifieParId: data.saisieParId,
      dateModif: new Date(),
    },
  });
}

export async function trouverEvaluationParId(id: string) {
  return prisma.evaluation.findUnique({
    where: { id },
    include: {
      classe: true,
      matiere: true,
      periode: true,
      typeEvaluation: true,
    },
  });
}

export async function verrouillerEvaluation(
  id: string,
  valideParId: string
) {
  return prisma.evaluation.update({
    where: { id },
    data: {
      statut: "verrouillee",
      valideePar: valideParId,
      dateValidation: new Date(),
    },
  });
}
