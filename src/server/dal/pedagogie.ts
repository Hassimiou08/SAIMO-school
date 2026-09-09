import "server-only";

import { cache } from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireContext, requirePermission } from "@/server/context";

// ─────────────────────────────────────────────────────────────
// Cycles & Niveaux
// ─────────────────────────────────────────────────────────────

export interface NiveauDTO {
  id: string;
  nom: string;
  ordre: number;
  nbClasses: number;
}
export interface CycleDTO {
  id: string;
  nom: string;
  ordre: number;
  niveaux: NiveauDTO[];
}

export async function listerCyclesNiveaux(): Promise<CycleDTO[]> {
  const { etablissementId, anneeScolaireId, role } = await requireContext();
  requirePermission(role, "classe:view");

  const cycles = await prisma.cycle.findMany({
    where: { etablissementId },
    orderBy: { ordre: "asc" },
    include: {
      niveaux: {
        orderBy: { ordre: "asc" },
        include: {
          _count: {
            select: { classes: { where: { anneeScolaireId } } },
          },
        },
      },
    },
  });

  return cycles.map((c) => ({
    id: c.id,
    nom: c.nom,
    ordre: c.ordre,
    niveaux: c.niveaux.map((n) => ({
      id: n.id,
      nom: n.nom,
      ordre: n.ordre,
      nbClasses: n._count.classes,
    })),
  }));
}

export interface NiveauOption {
  id: string;
  nom: string;
  cycle: string;
}
export async function listerNiveauxOptions(): Promise<NiveauOption[]> {
  const { etablissementId, role } = await requireContext();
  requirePermission(role, "classe:view");
  const niveaux = await prisma.niveau.findMany({
    where: { cycle: { etablissementId } },
    include: { cycle: true },
    orderBy: [{ cycle: { ordre: "asc" } }, { ordre: "asc" }],
  });
  return niveaux.map((n) => ({ id: n.id, nom: n.nom, cycle: n.cycle.nom }));
}

// ─────────────────────────────────────────────────────────────
// Matières
// ─────────────────────────────────────────────────────────────

export interface MatiereDTO {
  id: string;
  nom: string;
  code: string | null;
  actif: boolean;
  niveaux: string[];
  niveauIds: string[];
  coefficient: number | null;
}

export async function listerMatieres(): Promise<MatiereDTO[]> {
  const { etablissementId, role } = await requireContext();
  requirePermission(role, "classe:view");

  const matieres = await prisma.matiere.findMany({
    where: { etablissementId },
    orderBy: { nom: "asc" },
    include: { niveaux: { include: { niveau: true } } },
  });

  return matieres.map((m) => ({
    id: m.id,
    nom: m.nom,
    code: m.code,
    actif: m.actif,
    niveaux: m.niveaux.map((mn) => mn.niveau.nom),
    niveauIds: m.niveaux.map((mn) => mn.niveauId),
    coefficient: m.niveaux[0] ? Number(m.niveaux[0].coefficient) : null,
  }));
}

export interface MatiereOption {
  id: string;
  nom: string;
  /** Niveaux où cette matière est enseignée (via MatiereNiveau) — pour filtrer classe ↔ matière. */
  niveauIds: string[];
}
export async function listerMatieresOptions(): Promise<MatiereOption[]> {
  const { etablissementId, role } = await requireContext();
  requirePermission(role, "classe:view");
  const matieres = await prisma.matiere.findMany({
    where: { etablissementId, actif: true },
    orderBy: { nom: "asc" },
    select: { id: true, nom: true, niveaux: { select: { niveauId: true } } },
  });
  return matieres.map((m) => ({
    id: m.id,
    nom: m.nom,
    niveauIds: m.niveaux.map((n) => n.niveauId),
  }));
}

// ─────────────────────────────────────────────────────────────
// Classes
// ─────────────────────────────────────────────────────────────

export interface ClasseDTO {
  id: string;
  nom: string;
  cycle: string;
  niveau: string;
  effectif: number;
  capacite: number | null;
  salle: string | null;
  profPrincipal: string | null;
}

export async function listerClassesDetail(): Promise<ClasseDTO[]> {
  const { etablissementId, anneeScolaireId, role } = await requireContext();
  requirePermission(role, "classe:view");

  const classes = await prisma.classe.findMany({
    where: { etablissementId, anneeScolaireId },
    include: {
      niveau: { include: { cycle: true } },
      _count: { select: { inscriptions: { where: { statut: "active" } } } },
      affectationsEnseignants: {
        where: { estProfPrincipal: true, anneeScolaireId },
        include: {
          enseignant: { include: { utilisateur: true } },
        },
        take: 1,
      },
    },
    orderBy: [
      { niveau: { cycle: { ordre: "asc" } } },
      { niveau: { ordre: "asc" } },
      { nom: "asc" },
    ],
  });

  return classes.map((c) => {
    const pp = c.affectationsEnseignants[0]?.enseignant.utilisateur;
    return {
      id: c.id,
      nom: c.nom,
      cycle: c.niveau.cycle.nom,
      niveau: c.niveau.nom,
      effectif: c._count.inscriptions,
      capacite: c.capacite,
      salle: c.salle,
      profPrincipal: pp ? `${pp.prenom} ${pp.nom}` : null,
    };
  });
}

export interface ClasseDetailDTO extends ClasseDTO {
  anneeScolaireId: string;
  eleves: {
    id: string;
    matricule: string;
    prenom: string;
    nom: string;
    sexe: string | null;
  }[];
  equipe: {
    id: string;
    enseignant: string;
    matiere: string;
    profPrincipal: boolean;
  }[];
  emploi: {
    id: string;
    jour: number;
    heureDebut: string;
    heureFin: string;
    matiere: string;
    enseignant: string | null;
    salle: string | null;
  }[];
}

export const getClasseDetail = cache(
  async (id: string): Promise<ClasseDetailDTO> => {
    const { etablissementId, anneeScolaireId, role } = await requireContext();
    requirePermission(role, "classe:view");

    const c = await prisma.classe.findFirst({
      where: { id, etablissementId },
      include: {
        niveau: { include: { cycle: true } },
        inscriptions: {
          where: { statut: "active" },
          include: { eleve: true },
          orderBy: { eleve: { nom: "asc" } },
        },
        affectationsEnseignants: {
          where: { anneeScolaireId },
          include: {
            enseignant: { include: { utilisateur: true } },
            matiere: true,
          },
        },
        creneaux: {
          include: {
            matiere: true,
            enseignant: { include: { utilisateur: true } },
          },
          orderBy: [{ jour: "asc" }, { heureDebut: "asc" }],
        },
      },
    });
    if (!c) notFound();

    const pp = c.affectationsEnseignants.find((a) => a.estProfPrincipal)
      ?.enseignant.utilisateur;

    return {
      id: c.id,
      nom: c.nom,
      cycle: c.niveau.cycle.nom,
      niveau: c.niveau.nom,
      anneeScolaireId,
      effectif: c.inscriptions.length,
      capacite: c.capacite,
      salle: c.salle,
      profPrincipal: pp ? `${pp.prenom} ${pp.nom}` : null,
      eleves: c.inscriptions.map((i) => ({
        id: i.eleve.id,
        matricule: i.eleve.matricule,
        prenom: i.eleve.prenom,
        nom: i.eleve.nom,
        sexe: i.eleve.sexe,
      })),
      equipe: c.affectationsEnseignants.map((a) => ({
        id: a.id,
        enseignant: `${a.enseignant.utilisateur.prenom} ${a.enseignant.utilisateur.nom}`,
        matiere: a.matiere.nom,
        profPrincipal: a.estProfPrincipal,
      })),
      emploi: c.creneaux.map((cr) => ({
        id: cr.id,
        jour: cr.jour,
        heureDebut: cr.heureDebut,
        heureFin: cr.heureFin,
        matiere: cr.matiere.nom,
        enseignant: cr.enseignant
          ? `${cr.enseignant.utilisateur.prenom} ${cr.enseignant.utilisateur.nom}`
          : null,
        salle: cr.salle,
      })),
    };
  },
);

export interface EleveClasseOption {
  id: string;
  nom: string;
  classeId: string;
}
export async function listerElevesParClasse(): Promise<EleveClasseOption[]> {
  const { etablissementId, anneeScolaireId, role } = await requireContext();
  requirePermission(role, "eleve:view");
  const inscriptions = await prisma.inscription.findMany({
    where: { etablissementId, anneeScolaireId, statut: "active" },
    include: { eleve: true },
    orderBy: { eleve: { nom: "asc" } },
  });
  return inscriptions.map((i) => ({
    id: i.eleveId,
    nom: `${i.eleve.prenom} ${i.eleve.nom}`,
    classeId: i.classeId,
  }));
}

export interface ClasseOption {
  id: string;
  nom: string;
  niveauId: string;
}
export async function listerClassesOptions(): Promise<ClasseOption[]> {
  const { etablissementId, anneeScolaireId, role } = await requireContext();
  requirePermission(role, "classe:view");
  const classes = await prisma.classe.findMany({
    where: { etablissementId, anneeScolaireId },
    select: { id: true, nom: true, niveauId: true },
    orderBy: { nom: "asc" },
  });
  return classes;
}

// ─────────────────────────────────────────────────────────────
// Enseignants
// ─────────────────────────────────────────────────────────────

export interface EnseignantDTO {
  id: string;
  matricule: string | null;
  firstName: string;
  lastName: string;
  email: string;
  telephone: string | null;
  specialite: string | null;
  statut: "Actif" | "Inactif";
  matieres: string[];
  classes: string[];
  nbAffectations: number;
}

export async function listerEnseignants(): Promise<EnseignantDTO[]> {
  const { etablissementId, anneeScolaireId, role } = await requireContext();
  requirePermission(role, "enseignant:view");

  const enseignants = await prisma.enseignant.findMany({
    where: { etablissementId },
    include: {
      utilisateur: true,
      affectations: {
        where: { anneeScolaireId },
        include: { matiere: true, classe: true },
      },
    },
    orderBy: { utilisateur: { nom: "asc" } },
  });

  return enseignants.map((e) => ({
    id: e.id,
    matricule: e.matricule,
    firstName: e.utilisateur.prenom,
    lastName: e.utilisateur.nom,
    email: e.utilisateur.email,
    telephone: e.utilisateur.telephone,
    specialite: e.specialite,
    statut: e.utilisateur.actif ? "Actif" : "Inactif",
    matieres: [...new Set(e.affectations.map((a) => a.matiere.nom))],
    classes: [...new Set(e.affectations.map((a) => a.classe.nom))],
    nbAffectations: e.affectations.length,
  }));
}

export const getEnseignantDetail = cache(async (id: string) => {
  const { etablissementId, anneeScolaireId, role } = await requireContext();
  requirePermission(role, "enseignant:view");

  const e = await prisma.enseignant.findFirst({
    where: { id, etablissementId },
    include: {
      utilisateur: true,
      affectations: {
        where: { anneeScolaireId },
        include: { matiere: true, classe: true },
      },
    },
  });
  if (!e) notFound();

  return {
    id: e.id,
    matricule: e.matricule,
    firstName: e.utilisateur.prenom,
    lastName: e.utilisateur.nom,
    email: e.utilisateur.email,
    telephone: e.utilisateur.telephone,
    specialite: e.specialite,
    statut: (e.utilisateur.actif ? "Actif" : "Inactif") as "Actif" | "Inactif",
    derniereConnexion: e.utilisateur.derniereConnexion?.toISOString() ?? null,
    affectations: e.affectations.map((a) => ({
      id: a.id,
      matiere: a.matiere.nom,
      classe: a.classe.nom,
      profPrincipal: a.estProfPrincipal,
    })),
  };
});

export interface EnseignantOption {
  id: string;
  nom: string;
}
export async function listerEnseignantsOptions(): Promise<EnseignantOption[]> {
  const { etablissementId, role } = await requireContext();
  requirePermission(role, "enseignant:view");
  const ens = await prisma.enseignant.findMany({
    where: { etablissementId, utilisateur: { actif: true } },
    include: { utilisateur: true },
    orderBy: { utilisateur: { nom: "asc" } },
  });
  return ens.map((e) => ({
    id: e.id,
    nom: `${e.utilisateur.prenom} ${e.utilisateur.nom}`,
  }));
}

// ─────────────────────────────────────────────────────────────
// Affectations
// ─────────────────────────────────────────────────────────────

export interface AffectationDTO {
  id: string;
  enseignant: string;
  specialite: string | null;
  matiere: string;
  classe: string;
  profPrincipal: boolean;
}

export async function listerAffectations(): Promise<AffectationDTO[]> {
  const { etablissementId, anneeScolaireId, role } = await requireContext();
  requirePermission(role, "enseignant:view");

  const affs = await prisma.affectationEnseignant.findMany({
    where: { anneeScolaireId, classe: { etablissementId } },
    include: {
      enseignant: { include: { utilisateur: true } },
      matiere: true,
      classe: true,
    },
    orderBy: [{ classe: { nom: "asc" } }, { matiere: { nom: "asc" } }],
  });

  return affs.map((a) => ({
    id: a.id,
    enseignant: `${a.enseignant.utilisateur.prenom} ${a.enseignant.utilisateur.nom}`,
    specialite: a.enseignant.specialite,
    matiere: a.matiere.nom,
    classe: a.classe.nom,
    profPrincipal: a.estProfPrincipal,
  }));
}

// ─────────────────────────────────────────────────────────────
// Emploi du temps
// ─────────────────────────────────────────────────────────────

export interface CreneauDTO {
  id: string;
  classeId: string;
  classe: string;
  jour: number;
  heureDebut: string;
  heureFin: string;
  matiere: string;
  matiereId: string;
  enseignant: string | null;
  enseignantId: string | null;
  salle: string | null;
}

export async function listerCreneaux(
  classeId?: string,
  enseignantId?: string,
): Promise<CreneauDTO[]> {
  const { etablissementId, anneeScolaireId, role } = await requireContext();
  requirePermission(role, "classe:view");

  const creneaux = await prisma.creneauCours.findMany({
    where: {
      anneeScolaireId,
      classe: { etablissementId },
      ...(classeId ? { classeId } : {}),
      ...(enseignantId ? { enseignantId } : {}),
    },
    include: {
      classe: true,
      matiere: true,
      enseignant: { include: { utilisateur: true } },
    },
    orderBy: [{ jour: "asc" }, { heureDebut: "asc" }],
  });

  return creneaux.map((c) => ({
    id: c.id,
    classeId: c.classeId,
    classe: c.classe.nom,
    jour: c.jour,
    heureDebut: c.heureDebut,
    heureFin: c.heureFin,
    matiere: c.matiere.nom,
    matiereId: c.matiereId,
    enseignantId: c.enseignantId,
    enseignant: c.enseignant
      ? `${c.enseignant.utilisateur.prenom} ${c.enseignant.utilisateur.nom}`
      : null,
    salle: c.salle,
  }));
}
