import "server-only";

import { cache } from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireContext, requirePermission } from "@/server/context";

export interface PeriodeOption {
  id: string;
  nom: string;
  ordre: number;
  active: boolean;
}

export async function listerPeriodes(): Promise<PeriodeOption[]> {
  const { anneeScolaireId, role } = await requireContext();
  requirePermission(role, "classe:view");
  const periodes = await prisma.periode.findMany({
    where: { anneeScolaireId },
    orderBy: { ordre: "asc" },
    select: { id: true, nom: true, ordre: true, active: true },
  });
  return periodes;
}

export interface TypeEvaluationOption {
  id: string;
  nom: string;
  noteMaximale: number;
}
export async function listerTypesEvaluation(): Promise<TypeEvaluationOption[]> {
  const { etablissementId, role } = await requireContext();
  requirePermission(role, "classe:view");
  const types = await prisma.typeEvaluation.findMany({
    where: { etablissementId },
    orderBy: { nom: "asc" },
  });
  return types.map((t) => ({
    id: t.id,
    nom: t.nom,
    noteMaximale: Number(t.noteMaximale),
  }));
}

export interface EvaluationDTO {
  id: string;
  titre: string;
  matiere: string;
  type: string;
  classe: string;
  periode: string;
  date: string | null;
  noteMaximale: number;
  statut: string;
  nbNotes: number;
  effectif: number;
}

export async function listerEvaluations(params: {
  classeId?: string;
  periodeId?: string;
}): Promise<EvaluationDTO[]> {
  const { etablissementId, role } = await requireContext();
  requirePermission(role, "classe:view");

  const evals = await prisma.evaluation.findMany({
    where: {
      etablissementId,
      ...(params.classeId ? { classeId: params.classeId } : {}),
      ...(params.periodeId ? { periodeId: params.periodeId } : {}),
    },
    include: {
      matiere: true,
      typeEvaluation: true,
      classe: {
        include: { _count: { select: { inscriptions: { where: { statut: "active" } } } } },
      },
      periode: true,
      _count: { select: { notes: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return evals.map((e) => ({
    id: e.id,
    titre: e.titre ?? `${e.typeEvaluation.nom} — ${e.matiere.nom}`,
    matiere: e.matiere.nom,
    type: e.typeEvaluation.nom,
    classe: e.classe.nom,
    periode: e.periode.nom,
    date: e.dateEvaluation ? e.dateEvaluation.toISOString().slice(0, 10) : null,
    noteMaximale: Number(e.noteMaximale),
    statut: e.statut,
    nbNotes: e._count.notes,
    effectif: e.classe._count.inscriptions,
  }));
}

export interface SaisieNoteLigne {
  eleveId: string;
  prenom: string;
  nom: string;
  matricule: string;
  valeur: number | null;
  absent: boolean;
  dispense: boolean;
  observations: string;
}

export const getEvaluationSaisie = cache(async (id: string) => {
  const { etablissementId, role } = await requireContext();
  requirePermission(role, "classe:view");

  const evaluation = await prisma.evaluation.findFirst({
    where: { id, etablissementId },
    include: {
      matiere: true,
      typeEvaluation: true,
      classe: true,
      periode: true,
      notes: true,
    },
  });
  if (!evaluation) notFound();

  const inscriptions = await prisma.inscription.findMany({
    where: { classeId: evaluation.classeId, statut: "active" },
    include: { eleve: true },
    orderBy: { eleve: { nom: "asc" } },
  });

  const notesMap = new Map(evaluation.notes.map((n) => [n.eleveId, n]));

  const lignes: SaisieNoteLigne[] = inscriptions.map((i) => {
    const n = notesMap.get(i.eleveId);
    return {
      eleveId: i.eleveId,
      prenom: i.eleve.prenom,
      nom: i.eleve.nom,
      matricule: i.eleve.matricule,
      valeur: n?.valeur != null ? Number(n.valeur) : null,
      absent: n?.absent ?? false,
      dispense: n?.dispense ?? false,
      observations: n?.observations ?? "",
    };
  });

  return {
    id: evaluation.id,
    titre: evaluation.titre ?? `${evaluation.typeEvaluation.nom} — ${evaluation.matiere.nom}`,
    matiere: evaluation.matiere.nom,
    classe: evaluation.classe.nom,
    periode: evaluation.periode.nom,
    noteMaximale: Number(evaluation.noteMaximale),
    statut: evaluation.statut,
    verrouillee: evaluation.statut === "verrouillee",
    lignes,
  };
});
