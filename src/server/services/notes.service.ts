import { prisma } from "@/lib/prisma";
import { audit, AuditAction, AuditEntite } from "@/server/logs/audit";
import {
  trouverNotesParEvaluation,
  trouverEvaluationParId,
  verrouillerEvaluation,
} from "@/server/repositories/note.repo";

// ─── Saisir les notes d'une évaluation ───────────────────────

export interface SaisieNote {
  eleveId: string;
  valeur?: number | null;
  absent?: boolean;
  dispense?: boolean;
  observations?: string;
}

export async function saisirNotes(
  evaluationId: string,
  notes: SaisieNote[],
  saisieParId: string,
  etablissementId: string
) {
  const evaluation = await trouverEvaluationParId(evaluationId);

  if (!evaluation) throw new Error("Évaluation introuvable");

  // RM-08 : note validée ne peut être modifiée sans permission spéciale
  if (evaluation.statut === "verrouillee") {
    throw new Error(
      "Cette évaluation est verrouillée. Une correction nécessite une permission spéciale."
    );
  }

  // RM-07 : vérifier les barèmes
  for (const note of notes) {
    if (
      note.valeur !== null &&
      note.valeur !== undefined &&
      !note.absent &&
      !note.dispense
    ) {
      if (note.valeur < 0) throw new Error("Une note ne peut être négative");
      if (note.valeur > Number(evaluation.noteMaximale)) {
        throw new Error(
          `La note ${note.valeur} dépasse le barème maximum (${evaluation.noteMaximale})`
        );
      }
    }
  }

  // Sauvegarder en transaction
  await prisma.$transaction(
    notes.map((note) =>
      prisma.note.upsert({
        where: {
          evaluationId_eleveId: { evaluationId, eleveId: note.eleveId },
        },
        create: {
          evaluationId,
          eleveId: note.eleveId,
          valeur: note.valeur,
          absent: note.absent ?? false,
          dispense: note.dispense ?? false,
          observations: note.observations,
          saisieParId,
        },
        update: {
          valeur: note.valeur,
          absent: note.absent ?? false,
          dispense: note.dispense ?? false,
          observations: note.observations,
          modifieParId: saisieParId,
          dateModif: new Date(),
        },
      })
    )
  );

  await audit({
    utilisateurId: saisieParId,
    etablissementId,
    action: AuditAction.UPDATE,
    entite: AuditEntite.NOTE,
    entiteId: evaluationId,
    apres: { nombreNotes: notes.length },
  });
}

// ─── Valider et verrouiller une évaluation ───────────────────

export async function validerEvaluation(
  evaluationId: string,
  valideParId: string,
  etablissementId: string
) {
  const evaluation = await trouverEvaluationParId(evaluationId);
  if (!evaluation) throw new Error("Évaluation introuvable");
  if (evaluation.statut === "verrouillee") {
    throw new Error("Cette évaluation est déjà verrouillée");
  }

  await verrouillerEvaluation(evaluationId, valideParId);

  // RM-14 : audit obligatoire pour verrouillage
  await audit({
    utilisateurId: valideParId,
    etablissementId,
    action: AuditAction.LOCK,
    entite: AuditEntite.EVALUATION,
    entiteId: evaluationId,
    apres: { statut: "verrouillee", valideParId },
  });
}

// ─── Calcul des moyennes ─────────────────────────────────────

export interface MoyenneCalculee {
  eleveId: string;
  moyenneMatiere: number | null;
  totalPoints: number;
  totalCoefficients: number;
}

export async function calculerMoyennesClasse(
  classeId: string,
  periodeId: string,
  etablissementId: string
): Promise<MoyenneCalculee[]> {
  // Récupérer toutes les évaluations validées de la période
  const evaluations = await prisma.evaluation.findMany({
    where: {
      classeId,
      periodeId,
      etablissementId,
      statut: "verrouillee",
    },
    include: {
      notes: true,
      matiere: {
        include: {
          niveaux: {
            include: { niveau: { include: { classes: { where: { id: classeId } } } } },
          },
        },
      },
    },
  });

  // Regrouper par élève
  const parEleve = new Map<string, { points: number; coeff: number }>();

  for (const evaluation of evaluations) {
    const coefficient = Number(
      evaluation.matiere.niveaux[0]?.coefficient ?? 1
    );

    for (const note of evaluation.notes) {
      if (note.dispense) continue;

      const current = parEleve.get(note.eleveId) ?? { points: 0, coeff: 0 };

      if (!note.absent && note.valeur !== null) {
        const noteRamenee =
          (Number(note.valeur) / Number(evaluation.noteMaximale)) * 20;
        current.points += noteRamenee * coefficient;
        current.coeff += coefficient;
      }

      parEleve.set(note.eleveId, current);
    }
  }

  return Array.from(parEleve.entries()).map(([eleveId, { points, coeff }]) => ({
    eleveId,
    moyenneMatiere: coeff > 0 ? Math.round((points / coeff) * 100) / 100 : null,
    totalPoints: points,
    totalCoefficients: coeff,
  }));
}
