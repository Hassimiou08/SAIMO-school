import "server-only";

import { cache } from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireContext } from "@/server/context";
import { formatDateLongue } from "@/lib/format";

// ─── Contexte enseignant ────────────────────────────────────

export const getEnseignantContexte = cache(async () => {
  const { utilisateurId, etablissementId, anneeScolaireId, role } = await requireContext();
  const ens = await prisma.enseignant.findUnique({
    where: { utilisateurId },
    include: { utilisateur: { select: { prenom: true, nom: true } } },
  });
  if (!ens) notFound();
  return {
    enseignantId: ens.id,
    etablissementId,
    anneeScolaireId,
    role,
    nom: `${ens.utilisateur.prenom} ${ens.utilisateur.nom}`,
    prenom: ens.utilisateur.prenom,
  };
});

export interface MonAffectation {
  id: string;
  classeId: string;
  classe: string;
  niveauId: string;
  matiereId: string;
  matiere: string;
  estProfPrincipal: boolean;
}

export const mesAffectations = cache(async (): Promise<MonAffectation[]> => {
  const { enseignantId, anneeScolaireId } = await getEnseignantContexte();
  const affs = await prisma.affectationEnseignant.findMany({
    where: { enseignantId, anneeScolaireId },
    include: { classe: true, matiere: true },
    orderBy: [{ classe: { nom: "asc" } }, { matiere: { nom: "asc" } }],
  });
  return affs.map((a) => ({
    id: a.id,
    classeId: a.classeId,
    classe: a.classe.nom,
    niveauId: a.classe.niveauId,
    matiereId: a.matiereId,
    matiere: a.matiere.nom,
    estProfPrincipal: a.estProfPrincipal,
  }));
});

const dedupe = (arr: { id: string; nom: string }[]) => {
  const m = new Map<string, { id: string; nom: string }>();
  arr.forEach((x) => m.set(x.id, x));
  return [...m.values()].sort((a, b) => a.nom.localeCompare(b.nom));
};

export const mesClassesOptions = cache(async () => {
  const affs = await mesAffectations();
  const m = new Map<string, { id: string; nom: string; niveauId: string }>();
  affs.forEach((a) => m.set(a.classeId, { id: a.classeId, nom: a.classe, niveauId: a.niveauId }));
  return [...m.values()].sort((a, b) => a.nom.localeCompare(b.nom));
});

export const mesMatieresOptions = cache(async () => {
  const affs = await mesAffectations();
  return dedupe(affs.map((a) => ({ id: a.matiereId, nom: a.matiere })));
});

export const mesClassesProfPrincipal = cache(async () => {
  const affs = await mesAffectations();
  return dedupe(
    affs.filter((a) => a.estProfPrincipal).map((a) => ({ id: a.classeId, nom: a.classe })),
  );
});

async function mesClasseIds() {
  return [...new Set((await mesAffectations()).map((a) => a.classeId))];
}
async function mesPaires() {
  return (await mesAffectations()).map((a) => ({
    classeId: a.classeId,
    matiereId: a.matiereId,
  }));
}

// ─── Emploi du temps ────────────────────────────────────────

export interface MonCreneau {
  id: string;
  jour: number;
  heureDebut: string;
  heureFin: string;
  salle: string | null;
  classe: string;
  matiere: string;
}

export const mesCreneaux = cache(async (): Promise<MonCreneau[]> => {
  const { enseignantId } = await getEnseignantContexte();
  const cr = await prisma.creneauCours.findMany({
    where: { enseignantId },
    include: { classe: true, matiere: true },
    orderBy: [{ jour: "asc" }, { heureDebut: "asc" }],
  });
  return cr.map((c) => ({
    id: c.id,
    jour: c.jour,
    heureDebut: c.heureDebut,
    heureFin: c.heureFin,
    salle: c.salle,
    classe: c.classe.nom,
    matiere: c.matiere.nom,
  }));
});

// ─── Évaluations de l'enseignant ────────────────────────────

export interface MonEvaluation {
  id: string;
  titre: string;
  matiere: string;
  classe: string;
  periode: string;
  date: string | null;
  noteMaximale: number;
  statut: string;
  nbNotes: number;
  effectif: number;
}

export const mesEvaluations = cache(async (): Promise<MonEvaluation[]> => {
  const { etablissementId } = await getEnseignantContexte();
  const paires = await mesPaires();
  if (paires.length === 0) return [];

  const evals = await prisma.evaluation.findMany({
    where: {
      etablissementId,
      OR: paires.map((p) => ({ classeId: p.classeId, matiereId: p.matiereId })),
    },
    include: {
      matiere: true,
      typeEvaluation: true,
      classe: {
        include: {
          _count: { select: { inscriptions: { where: { statut: "active" } } } },
        },
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
    classe: e.classe.nom,
    periode: e.periode.nom,
    date: e.dateEvaluation ? e.dateEvaluation.toISOString().slice(0, 10) : null,
    noteMaximale: Number(e.noteMaximale),
    statut: e.statut,
    nbNotes: e._count.notes,
    effectif: e.classe._count.inscriptions,
  }));
});

/** Vérifie qu'une évaluation appartient bien à une paire classe+matière de l'enseignant. */
export async function evaluationEstAMoi(evaluationId: string): Promise<boolean> {
  const { etablissementId } = await getEnseignantContexte();
  const paires = await mesPaires();
  const ev = await prisma.evaluation.findFirst({
    where: { id: evaluationId, etablissementId },
    select: { classeId: true, matiereId: true },
  });
  if (!ev) return false;
  return paires.some(
    (p) => p.classeId === ev.classeId && p.matiereId === ev.matiereId,
  );
}

// ─── Absences de mes classes ────────────────────────────────

export interface MonAbsenceLigne {
  id: string;
  eleve: string;
  eleveId: string;
  classe: string;
  date: string;
  statut: "Absent" | "Retard";
  justifie: boolean;
  motif: string;
}

export const mesAbsences = cache(async (): Promise<MonAbsenceLigne[]> => {
  const classeIds = await mesClasseIds();
  if (classeIds.length === 0) return [];
  const presences = await prisma.presence.findMany({
    where: { classeId: { in: classeIds }, statut: { in: ["absent", "retard"] } },
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
});

export const mesElevesParClasse = cache(async () => {
  const { anneeScolaireId } = await getEnseignantContexte();
  const classeIds = await mesClasseIds();
  if (classeIds.length === 0) return [];
  const inscriptions = await prisma.inscription.findMany({
    where: { classeId: { in: classeIds }, anneeScolaireId, statut: "active" },
    include: { eleve: true },
    orderBy: { eleve: { nom: "asc" } },
  });
  return inscriptions.map((i) => ({
    id: i.eleveId,
    nom: `${i.eleve.prenom} ${i.eleve.nom}`,
    classeId: i.classeId,
  }));
});

// ─── Bulletins des classes dont je suis professeur principal ───────

export interface MonBulletinLigne {
  id: string;
  eleve: string;
  classe: string;
  periode: string;
  moyenne: number | null;
  rang: number | null;
  effectif: number | null;
  statut: string;
}

async function mesClasseIdsPP() {
  return (await mesClassesProfPrincipal()).map((c) => c.id);
}

export const mesBulletins = cache(
  async (classeId?: string, periodeId?: string): Promise<MonBulletinLigne[]> => {
    const { anneeScolaireId } = await getEnseignantContexte();
    const ppIds = await mesClasseIdsPP();
    if (ppIds.length === 0) return [];
    const bulletins = await prisma.bulletin.findMany({
      where: {
        anneeScolaireId,
        classeId: classeId && ppIds.includes(classeId) ? classeId : { in: ppIds },
        ...(periodeId ? { periodeId } : {}),
      },
      include: { eleve: true, classe: true, periode: true },
      orderBy: [{ classe: { nom: "asc" } }, { rang: "asc" }],
    });
    return bulletins.map((b) => ({
      id: b.id,
      eleve: `${b.eleve.prenom} ${b.eleve.nom}`,
      classe: b.classe.nom,
      periode: b.periode.nom,
      moyenne: b.moyenneGenerale != null ? Number(b.moyenneGenerale) : null,
      rang: b.rang,
      effectif: b.effectifClasse,
      statut: b.statut,
    }));
  },
);

export async function bulletinEstDeMaClassePP(bulletinId: string): Promise<boolean> {
  const ppIds = await mesClasseIdsPP();
  if (ppIds.length === 0) return false;
  const b = await prisma.bulletin.findUnique({
    where: { id: bulletinId },
    select: { classeId: true },
  });
  return !!b && ppIds.includes(b.classeId);
}

// ─── Contexte IA restreint à l'enseignant ─────────────────────────

export async function getContexteIAEnseignant(): Promise<string> {
  const { nom } = await getEnseignantContexte();
  const [affs, evals, absences] = await Promise.all([
    mesAffectations(),
    mesEvaluations(),
    mesAbsences(),
  ]);
  const classes = [...new Set(affs.map((a) => `${a.classe} (${a.matiere})`))];
  const nonVerr = evals.filter((e) => e.statut !== "verrouillee").length;
  return [
    `Tu assistes ${nom}, enseignant(e).`,
    `Ses classes / matières : ${classes.join(", ") || "aucune"}.`,
    `Évaluations : ${evals.length} au total, dont ${nonVerr} non verrouillée(s).`,
    `Absences enregistrées dans ses classes : ${absences.length}, dont ${absences.filter((a) => !a.justifie).length} non justifiée(s).`,
    `Ne divulgue aucune information financière ni administrative de l'établissement : tu n'y as pas accès.`,
  ].join("\n");
}

// ─── Tableau de bord ────────────────────────────────────────

const JOURS = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];

export const getTableauBordEnseignant = cache(async () => {
  const { enseignantId, anneeScolaireId } = await getEnseignantContexte();
  const affs = await mesAffectations();
  const classeIds = [...new Set(affs.map((a) => a.classeId))];

  const jsJour = new Date().getDay(); // 0=dim..6=sam
  const jourGrille = jsJour === 0 ? 7 : jsJour; // 1=lundi..7=dim (créneaux: 1..6)

  const [effectif, coursDuJour, evalsOuvertes, absencesNJ] = await Promise.all([
    classeIds.length
      ? prisma.inscription.count({
          where: { classeId: { in: classeIds }, anneeScolaireId, statut: "active" },
        })
      : Promise.resolve(0),
    prisma.creneauCours.findMany({
      where: { enseignantId, jour: jourGrille },
      include: { classe: true, matiere: true },
      orderBy: { heureDebut: "asc" },
    }),
    prisma.evaluation.count({
      where: {
        statut: { in: ["ouverte", "en_cours"] },
        OR: affs.map((a) => ({ classeId: a.classeId, matiereId: a.matiereId })),
      },
    }),
    classeIds.length
      ? prisma.presence.count({
          where: {
            classeId: { in: classeIds },
            statut: { in: ["absent", "retard"] },
            justifie: false,
          },
        })
      : Promise.resolve(0),
  ]);

  return {
    nom: (await getEnseignantContexte()).prenom,
    jourLabel: JOURS[jsJour],
    nbClasses: classeIds.length,
    nbMatieres: new Set(affs.map((a) => a.matiereId)).size,
    nbEleves: effectif,
    estProfPrincipal: affs.some((a) => a.estProfPrincipal),
    evalsOuvertes,
    absencesNonJustifiees: absencesNJ,
    coursDuJour: coursDuJour.map((c) => ({
      id: c.id,
      heureDebut: c.heureDebut,
      heureFin: c.heureFin,
      salle: c.salle,
      classe: c.classe.nom,
      matiere: c.matiere.nom,
    })),
    classes: affs.map((a) => ({
      classeId: a.classeId,
      classe: a.classe,
      matiere: a.matiere,
      estProfPrincipal: a.estProfPrincipal,
    })),
  };
});
