import "server-only";

import { prisma } from "@/lib/prisma";
import { requireContext, requirePermission } from "@/server/context";
import { formatDateLongue } from "@/lib/format";

export interface AbsenceDTO {
  id: string;
  eleve: string;
  eleveId: string;
  classe: string;
  date: string;
  statut: "Absent" | "Retard";
  justifie: boolean;
  motif: string;
}

export async function listerAbsences(params: {
  classeId?: string;
  eleveId?: string;
  justifie?: boolean;
}): Promise<AbsenceDTO[]> {
  const { etablissementId, anneeScolaireId, role } = await requireContext();
  requirePermission(role, "presence:view");

  const presences = await prisma.presence.findMany({
    where: {
      classe: { etablissementId, anneeScolaireId },
      statut: { in: ["absent", "retard"] },
      ...(params.classeId ? { classeId: params.classeId } : {}),
      ...(params.eleveId ? { eleveId: params.eleveId } : {}),
      ...(params.justifie != null ? { justifie: params.justifie } : {}),
    },
    include: { eleve: true, classe: true, seance: true },
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  return presences.map((p) => ({
    id: p.id,
    eleve: `${p.eleve.prenom} ${p.eleve.nom}`,
    eleveId: p.eleveId,
    classe: p.classe.nom,
    date: p.seance?.date
      ? formatDateLongue(p.seance.date)
      : formatDateLongue(p.createdAt),
    statut: p.statut === "retard" ? "Retard" : "Absent",
    justifie: p.justifie,
    motif: p.motif ?? "",
  }));
}

export interface StatsAbsences {
  total: number;
  justifiees: number;
  nonJustifiees: number;
}
export async function getStatsAbsences(): Promise<StatsAbsences> {
  const { etablissementId, anneeScolaireId, role } = await requireContext();
  requirePermission(role, "presence:view");
  const rows = await prisma.presence.groupBy({
    by: ["justifie"],
    where: {
      classe: { etablissementId, anneeScolaireId },
      statut: { in: ["absent", "retard"] },
    },
    _count: { _all: true },
  });
  const justifiees = rows.find((r) => r.justifie)?._count._all ?? 0;
  const nonJustifiees = rows.find((r) => !r.justifie)?._count._all ?? 0;
  return { total: justifiees + nonJustifiees, justifiees, nonJustifiees };
}
