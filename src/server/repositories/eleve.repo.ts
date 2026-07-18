import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export type EleveAvecRelations = Prisma.EleveGetPayload<{
  include: {
    parents: { include: { parent: true } };
    inscriptions: { include: { classe: true; anneeScolaire: true } };
  };
}>;

export interface FiltresEleve {
  etablissementId: string;
  recherche?: string;    // nom, prenom, matricule
  statut?: string;
  classeId?: string;
  anneeScolaireId?: string;
  page?: number;
  limite?: number;
}

export async function trouverEleves(filtres: FiltresEleve) {
  const { etablissementId, recherche, statut, classeId, anneeScolaireId } =
    filtres;
  const page = filtres.page ?? 1;
  const limite = filtres.limite ?? 20;
  const skip = (page - 1) * limite;

  const where: Prisma.EleveWhereInput = {
    etablissementId,
    ...(statut && { statut }),
    ...(recherche && {
      OR: [
        { prenom: { contains: recherche, mode: "insensitive" } },
        { nom: { contains: recherche, mode: "insensitive" } },
        { matricule: { contains: recherche, mode: "insensitive" } },
      ],
    }),
    ...(classeId && {
      inscriptions: { some: { classeId } },
    }),
    ...(anneeScolaireId && {
      inscriptions: { some: { anneeScolaireId } },
    }),
  };

  const [eleves, total] = await Promise.all([
    prisma.eleve.findMany({
      where,
      include: {
        parents: { include: { parent: true } },
        inscriptions: {
          include: { classe: true, anneeScolaire: true },
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
      skip,
      take: limite,
      orderBy: [{ nom: "asc" }, { prenom: "asc" }],
    }),
    prisma.eleve.count({ where }),
  ]);

  return { eleves, total, page, limite, pages: Math.ceil(total / limite) };
}

export async function trouverEleveParId(
  id: string,
  etablissementId: string
): Promise<EleveAvecRelations | null> {
  return prisma.eleve.findFirst({
    where: { id, etablissementId },
    include: {
      parents: { include: { parent: true } },
      inscriptions: {
        include: { classe: true; anneeScolaire: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });
}

export async function trouverEleveParMatricule(
  matricule: string,
  etablissementId: string
) {
  return prisma.eleve.findUnique({
    where: { etablissementId_matricule: { etablissementId, matricule } },
  });
}

export async function creerEleve(
  data: Prisma.EleveCreateInput
) {
  return prisma.eleve.create({ data });
}

export async function mettreAJourEleve(
  id: string,
  etablissementId: string,
  data: Prisma.EleveUpdateInput
) {
  return prisma.eleve.update({
    where: { id },
    data,
  });
}

export async function archiverEleve(id: string, etablissementId: string) {
  return prisma.eleve.update({
    where: { id },
    data: { statut: "archive", updatedAt: new Date() },
  });
}
