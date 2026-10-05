import "server-only";

import { prisma } from "@/lib/prisma";
import { requireContext, requirePermission } from "@/server/context";
import { calculerDetailParMatiere, calculerMoyennesClasse } from "@/server/services/notes.service";

export interface MatiereColonne {
  id: string;
  nom: string;
  coefficient: number;
}

export interface NoteDetailLigne {
  evaluationId: string;
  titre: string;
  type: string;
  date: string | null;
  valeur: number | null;
  noteMaximale: number;
  absent: boolean;
  dispense: boolean;
}

export interface CelluleMatiere {
  moyenne: number | null;
  moyenneDevoirs: number | null;
  moyenneComposition: number | null;
  /** true tant qu'aucune composition n'est encore verrouillée pour cette matière. */
  provisoire: boolean;
  notes: NoteDetailLigne[];
}

export interface LigneEleveTableau {
  eleveId: string;
  nom: string;
  prenom: string;
  matricule: string;
  /** Cellule par matière, indexée par matiereId. */
  matieres: Record<string, CelluleMatiere>;
  moyenneGenerale: number | null;
  rang: number | null;
}

export interface TableauGeneralDTO {
  classe: string;
  periode: string;
  effectif: number;
  matieres: MatiereColonne[];
  lignes: LigneEleveTableau[];
}

/**
 * Tableau général des notes : élèves (lignes) × matières (colonnes), avec
 * la moyenne pondérée devoirs/composition par matière et le détail des
 * notes brutes de chaque évaluation verrouillée. Classe + période requises.
 */
export async function getTableauGeneralClasse(
  classeId: string,
  periodeId: string,
): Promise<TableauGeneralDTO> {
  const { etablissementId, anneeScolaireId, role } = await requireContext();
  requirePermission(role, "classe:view");

  const classe = await prisma.classe.findFirst({
    where: { id: classeId, etablissementId },
    select: { nom: true, niveauId: true },
  });
  if (!classe) throw new Error("Classe introuvable");

  const periode = await prisma.periode.findFirst({
    where: { id: periodeId, anneeScolaireId },
    select: { nom: true },
  });
  if (!periode) throw new Error("Période introuvable");

  const [matieresNiveau, inscriptions, detailParEleve, moyennes, evaluations] = await Promise.all([
    prisma.matiere.findMany({
      where: { etablissementId, actif: true, niveaux: { some: { niveauId: classe.niveauId } } },
      include: { niveaux: { where: { niveauId: classe.niveauId } } },
      orderBy: { nom: "asc" },
    }),
    prisma.inscription.findMany({
      where: { classeId, anneeScolaireId, statut: "active" },
      include: { eleve: true },
      orderBy: { eleve: { nom: "asc" } },
    }),
    calculerDetailParMatiere(classeId, periodeId, etablissementId),
    calculerMoyennesClasse(classeId, periodeId, etablissementId),
    prisma.evaluation.findMany({
      where: { classeId, periodeId, etablissementId, statut: "verrouillee" },
      include: { notes: true, typeEvaluation: true, matiere: true },
    }),
  ]);

  const matieres: MatiereColonne[] = matieresNiveau.map((m) => ({
    id: m.id,
    nom: m.nom,
    coefficient: Number(m.niveaux[0]?.coefficient ?? 1),
  }));

  // Classement général (sur la moyenne pondérée par coefficient de matière).
  const classement = moyennes
    .filter((m) => m.moyenneMatiere !== null)
    .sort((a, b) => b.moyenneMatiere! - a.moyenneMatiere!);
  const rangParEleve = new Map(classement.map((m, i) => [m.eleveId, i + 1]));
  const moyenneGeneraleParEleve = new Map(moyennes.map((m) => [m.eleveId, m.moyenneMatiere]));

  // Détail des notes brutes, regroupées par élève puis par matière.
  const notesParEleveMatiere = new Map<string, Map<string, NoteDetailLigne[]>>();
  for (const ev of evaluations) {
    for (const n of ev.notes) {
      const matMap = notesParEleveMatiere.get(n.eleveId) ?? new Map<string, NoteDetailLigne[]>();
      const arr = matMap.get(ev.matiereId) ?? [];
      arr.push({
        evaluationId: ev.id,
        titre: ev.titre ?? `${ev.typeEvaluation.nom} — ${ev.matiere.nom}`,
        type: ev.typeEvaluation.nom,
        date: ev.dateEvaluation ? ev.dateEvaluation.toISOString().slice(0, 10) : null,
        valeur: n.valeur != null ? Number(n.valeur) : null,
        noteMaximale: Number(ev.noteMaximale),
        absent: n.absent,
        dispense: n.dispense,
      });
      matMap.set(ev.matiereId, arr);
      notesParEleveMatiere.set(n.eleveId, matMap);
    }
  }

  const lignes: LigneEleveTableau[] = inscriptions.map((insc) => {
    const detailMatieres = detailParEleve.get(insc.eleveId) ?? [];
    const detailParMatiereId = new Map(detailMatieres.map((d) => [d.matiereId, d]));
    const notesMatieres = notesParEleveMatiere.get(insc.eleveId);

    const matieresCell: Record<string, CelluleMatiere> = {};
    for (const m of matieres) {
      const d = detailParMatiereId.get(m.id);
      matieresCell[m.id] = {
        moyenne: d?.moyenne ?? null,
        moyenneDevoirs: d?.moyenneDevoirs ?? null,
        moyenneComposition: d?.moyenneComposition ?? null,
        provisoire: d?.provisoire ?? true,
        notes: notesMatieres?.get(m.id) ?? [],
      };
    }

    return {
      eleveId: insc.eleveId,
      nom: insc.eleve.nom,
      prenom: insc.eleve.prenom,
      matricule: insc.eleve.matricule,
      matieres: matieresCell,
      moyenneGenerale: moyenneGeneraleParEleve.get(insc.eleveId) ?? null,
      rang: rangParEleve.get(insc.eleveId) ?? null,
    };
  });

  return { classe: classe.nom, periode: periode.nom, effectif: lignes.length, matieres, lignes };
}
