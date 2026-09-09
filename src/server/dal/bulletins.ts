import "server-only";

import { cache } from "react";
import { notFound } from "next/navigation";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireContext, requirePermission } from "@/server/context";
import { formatDateLongue } from "@/lib/format";
import { mentionAuto } from "@/lib/bulletin";

export interface BulletinRowDTO {
  id: string;
  eleve: string;
  eleveId: string;
  classe: string;
  periode: string;
  moyenne: number | null;
  rang: number | null;
  effectif: number | null;
  statut: string;
}

export async function listerBulletins(params: {
  classeId?: string;
  periodeId?: string;
}): Promise<BulletinRowDTO[]> {
  const { etablissementId, anneeScolaireId, role } = await requireContext();
  requirePermission(role, "bulletin:view");

  const bulletins = await prisma.bulletin.findMany({
    where: {
      anneeScolaireId,
      classe: { etablissementId },
      ...(params.classeId ? { classeId: params.classeId } : {}),
      ...(params.periodeId ? { periodeId: params.periodeId } : {}),
    },
    include: { eleve: true, classe: true, periode: true },
    orderBy: [{ classe: { nom: "asc" } }, { rang: "asc" }],
  });

  return bulletins.map((b) => ({
    id: b.id,
    eleve: `${b.eleve.prenom} ${b.eleve.nom}`,
    eleveId: b.eleveId,
    classe: b.classe.nom,
    periode: b.periode.nom,
    moyenne: b.moyenneGenerale != null ? Number(b.moyenneGenerale) : null,
    rang: b.rang,
    effectif: b.effectifClasse,
    statut: b.statut,
  }));
}

export interface EtatPreparationBulletins {
  evaluationsTotal: number;
  evaluationsVerrouillees: number;
  evaluationsNoteesNonVerrouillees: number;
  elevesClasse: number;
  elevesAvecNote: number;
  bulletinsExistants: number;
}

/**
 * Diagnostic « suis-je prêt à générer ? » pour une classe + période données.
 * Sert à guider l'utilisateur sur la page Bulletins.
 */
export async function etatPreparationBulletins(
  classeId: string,
  periodeId: string,
): Promise<EtatPreparationBulletins> {
  const { etablissementId, anneeScolaireId, role } = await requireContext();
  requirePermission(role, "bulletin:view");

  const [evaluations, elevesClasse, bulletinsExistants] = await Promise.all([
    prisma.evaluation.findMany({
      where: { classeId, periodeId, etablissementId },
      select: { statut: true, _count: { select: { notes: true } } },
    }),
    prisma.inscription.count({
      where: { classeId, anneeScolaireId, statut: "active" },
    }),
    prisma.bulletin.count({ where: { classeId, periodeId, anneeScolaireId } }),
  ]);

  const verrouillees = evaluations.filter((e) => e.statut === "verrouillee");

  const notesVerrouillees = verrouillees.length
    ? await prisma.note.findMany({
        where: {
          evaluation: { classeId, periodeId, etablissementId, statut: "verrouillee" },
          absent: false,
          dispense: false,
          valeur: { not: null },
        },
        select: { eleveId: true },
        distinct: ["eleveId"],
      })
    : [];

  return {
    evaluationsTotal: evaluations.length,
    evaluationsVerrouillees: verrouillees.length,
    evaluationsNoteesNonVerrouillees: evaluations.filter(
      (e) => e.statut !== "verrouillee" && e._count.notes > 0,
    ).length,
    elevesClasse,
    elevesAvecNote: notesVerrouillees.length,
    bulletinsExistants,
  };
}

export interface BulletinMatiereLigne {
  matiereId: string;
  matiere: string;
  coefficient: number;
  moyenne: number | null;
  rang: number | null;
  appreciation: string | null;
}

export interface BulletinDetail {
  id: string;
  etablissement: string;
  eleve: string;
  matricule: string | null;
  classe: string;
  cycle: string;
  periode: string;
  statut: string;
  moyenneGenerale: number | null;
  rang: number | null;
  effectifClasse: number | null;
  appreciation: string | null;
  /** Mention affichée = manuelle si définie, sinon calculée depuis la moyenne. */
  mention: string;
  /** Mention calculée automatiquement (pour l'éditeur). */
  mentionAuto: string;
  /** true si la mention vient d'une saisie manuelle. */
  mentionManuelle: boolean;
  dateValidation: string | null;
  matieres: BulletinMatiereLigne[];
  profPrincipalNom: string | null;
  directionNom: string | null;
  signatureProfPrincipal: string | null;
  signatureDirection: string | null;
}

type BulletinAvecRelations = Prisma.BulletinGetPayload<{
  include: {
    eleve: true;
    classe: { include: { niveau: { include: { cycle: true } }; etablissement: true } };
    periode: true;
    detailsMatieres: { include: { matiere: true } };
  };
}>;

/** Lignes par matière : depuis le snapshot si présent, sinon recalcul à la volée. */
async function matieresBulletin(b: BulletinAvecRelations): Promise<BulletinMatiereLigne[]> {
  const depuisSnapshot = b.detailsMatieres.map((d) => ({
    matiereId: d.matiereId,
    matiere: d.matiere.nom,
    coefficient: Number(d.coefficient),
    moyenne: d.moyenne != null ? Number(d.moyenne) : null,
    rang: d.rang,
    appreciation: d.appreciation,
  }));
  if (depuisSnapshot.length > 0) {
    return depuisSnapshot.sort((a, b) => a.matiere.localeCompare(b.matiere));
  }

  const notes = await prisma.note.findMany({
    where: {
      eleveId: b.eleveId,
      evaluation: {
        classeId: b.classeId,
        periodeId: b.periodeId,
        statut: "verrouillee",
      },
    },
    include: { evaluation: { include: { matiere: { include: { niveaux: true } } } } },
  });
  const parMat = new Map<
    string,
    { nom: string; somme: number; nb: number; coef: number }
  >();
  for (const n of notes) {
    if (n.valeur == null || n.absent || n.dispense) continue;
    const bareme = Number(n.evaluation.noteMaximale) || 20;
    const sur20 = (Number(n.valeur) / bareme) * 20;
    const id = n.evaluation.matiereId;
    const coef = Number(n.evaluation.matiere.niveaux[0]?.coefficient ?? 1);
    const cur = parMat.get(id) ?? { nom: n.evaluation.matiere.nom, somme: 0, nb: 0, coef };
    cur.somme += sur20;
    cur.nb += 1;
    parMat.set(id, cur);
  }
  return [...parMat.entries()]
    .map(([matiereId, v]) => ({
      matiereId,
      matiere: v.nom,
      coefficient: v.coef,
      moyenne: v.nb ? Math.round((v.somme / v.nb) * 100) / 100 : null,
      rang: null,
      appreciation: null,
    }))
    .sort((a, b) => a.matiere.localeCompare(b.matiere));
}

async function signatairesBulletin(b: BulletinAvecRelations): Promise<{
  profPrincipalNom: string | null;
  directionNom: string | null;
  signatureProfPrincipal: string | null;
  signatureDirection: string | null;
}> {
  const [affPP, direction] = await Promise.all([
    prisma.affectationEnseignant.findFirst({
      where: {
        classeId: b.classeId,
        anneeScolaireId: b.anneeScolaireId,
        estProfPrincipal: true,
      },
      include: { enseignant: { include: { utilisateur: true } } },
    }),
    b.valideParId
      ? prisma.utilisateur.findUnique({ where: { id: b.valideParId } })
      : Promise.resolve(null),
  ]);

  const pp = affPP?.enseignant.utilisateur ?? null;
  return {
    profPrincipalNom: pp ? `${pp.prenom} ${pp.nom}` : null,
    directionNom: direction ? `${direction.prenom} ${direction.nom}` : null,
    signatureProfPrincipal: pp?.signature ?? null,
    signatureDirection: direction?.signature ?? null,
  };
}

async function toBulletinDetail(
  b: BulletinAvecRelations,
  matieres: BulletinMatiereLigne[],
): Promise<BulletinDetail> {
  const moyenne = b.moyenneGenerale != null ? Number(b.moyenneGenerale) : null;
  const auto = mentionAuto(moyenne);
  const sign = await signatairesBulletin(b);
  return {
    id: b.id,
    etablissement: b.classe.etablissement.nom,
    eleve: `${b.eleve.prenom} ${b.eleve.nom}`,
    matricule: b.eleve.matricule,
    classe: b.classe.nom,
    cycle: b.classe.niveau.cycle.nom,
    periode: b.periode.nom,
    statut: b.statut,
    moyenneGenerale: moyenne,
    rang: b.rang,
    effectifClasse: b.effectifClasse,
    appreciation: b.appreciation,
    mention: b.mentionHonneur ?? auto,
    mentionAuto: auto,
    mentionManuelle: b.mentionHonneur != null,
    dateValidation: b.dateValidation ? formatDateLongue(b.dateValidation) : null,
    matieres,
    ...sign,
  };
}

const INCLUDE_BULLETIN = {
  eleve: true,
  classe: { include: { niveau: { include: { cycle: true } }, etablissement: true } },
  periode: true,
  detailsMatieres: { include: { matiere: true } },
} as const;

export const getBulletinDetail = cache(async (id: string): Promise<BulletinDetail> => {
  const { etablissementId, role } = await requireContext();
  requirePermission(role, "bulletin:view");

  const b = await prisma.bulletin.findFirst({
    where: { id, classe: { etablissementId } },
    include: INCLUDE_BULLETIN,
  });
  if (!b) notFound();

  return toBulletinDetail(b, await matieresBulletin(b));
});

/** Tous les bulletins d'une classe + période, détaillés, pour l'impression groupée. */
export async function listerBulletinsClasseImpression(
  classeId: string,
  periodeId: string,
): Promise<BulletinDetail[]> {
  const { etablissementId, anneeScolaireId, role } = await requireContext();
  requirePermission(role, "bulletin:view");

  const bulletins = await prisma.bulletin.findMany({
    where: { classeId, periodeId, anneeScolaireId, classe: { etablissementId } },
    include: INCLUDE_BULLETIN,
    orderBy: [{ rang: "asc" }, { eleve: { nom: "asc" } }],
  });

  return Promise.all(
    bulletins.map(async (b) => toBulletinDetail(b, await matieresBulletin(b))),
  );
}
