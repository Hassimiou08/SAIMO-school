import "server-only";

import { prisma } from "@/lib/prisma";
import { requireContext, requirePermission } from "@/server/context";

export interface ClasseOptionDTO {
  id: string;
  nom: string;
  niveau: string;
  cycle: string;
  /** false si aucune échéance (frais) n'est configurée pour ce niveau cette année. */
  aFrais: boolean;
}

/** Classes de l'année active, pour les listes déroulantes des formulaires. */
export async function listerClassesDTO(): Promise<ClasseOptionDTO[]> {
  const ctx = await requireContext();
  requirePermission(ctx.role, "classe:view");

  const [classes, echeances] = await Promise.all([
    prisma.classe.findMany({
      where: {
        etablissementId: ctx.etablissementId,
        anneeScolaireId: ctx.anneeScolaireId,
      },
      include: { niveau: { include: { cycle: true } } },
      orderBy: [
        { niveau: { cycle: { ordre: "asc" } } },
        { niveau: { ordre: "asc" } },
        { nom: "asc" },
      ],
    }),
    prisma.echeance.findMany({
      where: {
        anneeScolaireId: ctx.anneeScolaireId,
        typeFrais: { etablissementId: ctx.etablissementId },
      },
      select: { niveauId: true },
    }),
  ]);

  const niveauxAvecFrais = new Set(
    echeances.filter((e) => e.niveauId).map((e) => e.niveauId as string),
  );
  const fraisTousNiveaux = echeances.some((e) => e.niveauId === null);

  return classes.map((c) => ({
    id: c.id,
    nom: c.nom,
    niveau: c.niveau.nom,
    cycle: c.niveau.cycle.nom,
    aFrais: fraisTousNiveaux || niveauxAvecFrais.has(c.niveauId),
  }));
}
