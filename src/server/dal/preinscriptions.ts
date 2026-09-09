import "server-only";

import { prisma } from "@/lib/prisma";
import { requireContext, requirePermission } from "@/server/context";
import { formatDateLongue } from "@/lib/format";

export interface PreInscriptionDTO {
  id: string;
  reference: string;
  eleve: string;
  dateNaissance: string | null;
  sexe: string | null;
  niveau: string | null;
  tuteur: string | null;
  telephone: string;
  email: string | null;
  message: string | null;
  statut: string;
  eleveId: string | null;
  date: string;
}

export async function listerPreInscriptions(statut?: string): Promise<PreInscriptionDTO[]> {
  const { etablissementId, role } = await requireContext();
  requirePermission(role, "inscription:view");

  const rows = await prisma.preInscription.findMany({
    where: { etablissementId, ...(statut ? { statut } : {}) },
    orderBy: { createdAt: "desc" },
  });

  const niveauIds = [...new Set(rows.map((r) => r.niveauId).filter(Boolean))] as string[];
  const niveaux = niveauIds.length
    ? await prisma.niveau.findMany({ where: { id: { in: niveauIds } }, select: { id: true, nom: true } })
    : [];
  const nomNiveau = new Map(niveaux.map((n) => [n.id, n.nom]));

  return rows.map((r) => ({
    id: r.id,
    reference: r.reference,
    eleve: `${r.prenomEleve} ${r.nomEleve}`,
    dateNaissance: r.dateNaissance ? formatDateLongue(r.dateNaissance) : null,
    sexe: r.sexe,
    niveau: r.niveauId ? nomNiveau.get(r.niveauId) ?? null : r.niveauSouhaite,
    tuteur: r.prenomTuteur && r.nomTuteur ? `${r.prenomTuteur} ${r.nomTuteur}` : null,
    telephone: r.telephone,
    email: r.email,
    message: r.message,
    statut: r.statut,
    eleveId: r.eleveId,
    date: formatDateLongue(r.createdAt),
  }));
}

export interface StatsPreInscriptions {
  nouvelle: number;
  contactee: number;
  acceptee: number;
  convertie: number;
  refusee: number;
}
export async function getStatsPreInscriptions(): Promise<StatsPreInscriptions> {
  const { etablissementId, role } = await requireContext();
  requirePermission(role, "inscription:view");
  const rows = await prisma.preInscription.groupBy({
    by: ["statut"],
    where: { etablissementId },
    _count: { _all: true },
  });
  const g = (s: string) => rows.find((r) => r.statut === s)?._count._all ?? 0;
  return {
    nouvelle: g("nouvelle"),
    contactee: g("contactee"),
    acceptee: g("acceptee"),
    convertie: g("convertie"),
    refusee: g("refusee"),
  };
}
