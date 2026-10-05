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
//
// Formule retenue (système ouest-africain francophone) :
//   moyenne devoirs = moyenne arithmétique des notes de cours (tout type
//                      d'évaluation hors "Composition" : devoirs, interros, examens)
//   moyenne matière  = (moyenne devoirs × 2 + note de composition) / 3
// Tant qu'aucune composition n'est verrouillée pour la matière/période,
// la moyenne devoirs seule est utilisée (marquée `provisoire`).

export interface MoyenneCalculee {
  eleveId: string;
  moyenneMatiere: number | null;
  totalPoints: number;
  totalCoefficients: number;
}

// ─── Détail des moyennes par matière (pour les bulletins et le tableau général) ────

export interface DetailMatiereEleve {
  matiereId: string;
  coefficient: number;
  moyenne: number | null;
  moyenneDevoirs: number | null;
  moyenneComposition: number | null;
  /** true tant qu'aucune composition n'est encore verrouillée pour cette matière/période. */
  provisoire: boolean;
}

async function recupererEvaluationsClasse(
  classeId: string,
  periodeId: string,
  etablissementId: string,
) {
  return prisma.evaluation.findMany({
    where: { classeId, periodeId, etablissementId, statut: "verrouillee" },
    include: {
      notes: true,
      typeEvaluation: true,
      matiere: {
        include: {
          niveaux: {
            include: { niveau: { include: { classes: { where: { id: classeId } } } } },
          },
        },
      },
    },
  });
}

/**
 * Pour chaque élève de la classe, la moyenne /20 par matière (pondération
 * devoirs/composition ci-dessus), calculée sur les évaluations verrouillées
 * de la période.
 */
export async function calculerDetailParMatiere(
  classeId: string,
  periodeId: string,
  etablissementId: string,
): Promise<Map<string, DetailMatiereEleve[]>> {
  const evaluations = await recupererEvaluationsClasse(classeId, periodeId, etablissementId);

  // eleveId -> matiereId -> { devoirs: {somme,nb}, compositions: {somme,nb}, coef }
  const parEleve = new Map<
    string,
    Map<
      string,
      {
        devoirsSomme: number; devoirsNb: number;
        composSomme: number; composNb: number;
        coef: number;
      }
    >
  >();

  for (const evaluation of evaluations) {
    const mnClasse =
      evaluation.matiere.niveaux.find((mn) => mn.niveau.classes.length > 0) ??
      evaluation.matiere.niveaux[0];
    const coef = Number(mnClasse?.coefficient ?? 1);
    const matiereId = evaluation.matiereId;
    const estComposition = evaluation.typeEvaluation.nom === "Composition";

    for (const note of evaluation.notes) {
      if (note.dispense || note.absent || note.valeur === null) continue;
      const sur20 = (Number(note.valeur) / Number(evaluation.noteMaximale)) * 20;

      const matMap = parEleve.get(note.eleveId) ?? new Map();
      const cur = matMap.get(matiereId) ?? {
        devoirsSomme: 0, devoirsNb: 0, composSomme: 0, composNb: 0, coef,
      };
      if (estComposition) {
        cur.composSomme += sur20;
        cur.composNb += 1;
      } else {
        cur.devoirsSomme += sur20;
        cur.devoirsNb += 1;
      }
      matMap.set(matiereId, cur);
      parEleve.set(note.eleveId, matMap);
    }
  }

  const resultat = new Map<string, DetailMatiereEleve[]>();
  for (const [eleveId, matMap] of parEleve) {
    resultat.set(
      eleveId,
      [...matMap.entries()].map(([matiereId, v]) => {
        const moyenneDevoirs = v.devoirsNb ? v.devoirsSomme / v.devoirsNb : null;
        const moyenneComposition = v.composNb ? v.composSomme / v.composNb : null;

        let moyenne: number | null;
        if (moyenneDevoirs !== null && moyenneComposition !== null) {
          moyenne = (moyenneDevoirs * 2 + moyenneComposition) / 3;
        } else if (moyenneDevoirs !== null) {
          moyenne = moyenneDevoirs;
        } else {
          moyenne = moyenneComposition;
        }

        return {
          matiereId,
          coefficient: v.coef,
          moyenne: moyenne !== null ? Math.round(moyenne * 100) / 100 : null,
          moyenneDevoirs: moyenneDevoirs !== null ? Math.round(moyenneDevoirs * 100) / 100 : null,
          moyenneComposition:
            moyenneComposition !== null ? Math.round(moyenneComposition * 100) / 100 : null,
          provisoire: moyenneComposition === null,
        };
      }),
    );
  }
  return resultat;
}

/**
 * Moyenne générale par élève (pondérée par coefficient de chaque matière),
 * dérivée de {@link calculerDetailParMatiere} pour rester cohérente avec le
 * détail par matière affiché aux bulletins et au tableau général.
 */
export async function calculerMoyennesClasse(
  classeId: string,
  periodeId: string,
  etablissementId: string
): Promise<MoyenneCalculee[]> {
  const detailParEleve = await calculerDetailParMatiere(classeId, periodeId, etablissementId);

  return Array.from(detailParEleve.entries()).map(([eleveId, matieres]) => {
    let points = 0;
    let coeff = 0;
    for (const m of matieres) {
      if (m.moyenne === null) continue;
      points += m.moyenne * m.coefficient;
      coeff += m.coefficient;
    }
    return {
      eleveId,
      moyenneMatiere: coeff > 0 ? Math.round((points / coeff) * 100) / 100 : null,
      totalPoints: points,
      totalCoefficients: coeff,
    };
  });
}
