import "server-only";

import { prisma } from "@/lib/prisma";
import { requireContext, requirePermission } from "@/server/context";
import { formatDateCourte } from "@/lib/format";

// ─────────────────────────────────────────────────────────────
// Helpers dates
// ─────────────────────────────────────────────────────────────

function moisKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

/** Étiquette courte du mois ("oct.", "nov."...). */
const nfMois = new Intl.DateTimeFormat("fr-FR", { month: "short" });

function debutDeMois(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}
function finDeMois(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);
}

// ─────────────────────────────────────────────────────────────
// Tableau de bord
// ─────────────────────────────────────────────────────────────

export interface FluxMois {
  mois: string; // "oct."
  recettes: number;
  depenses: number;
}
export interface CategorieDepense {
  categorie: string;
  montant: number;
}
export interface TableauBordCompta {
  tresorerie: number;
  recettesMois: number;
  depensesMois: number;
  impayes: number;
  flux: FluxMois[];
  parCategorie: CategorieDepense[];
  fraisImpayes: {
    id: string; // fraisEleveId
    eleve: string;
    classe: string;
    motif: string;
    solde: number;
  }[];
  dernieresDepenses: {
    id: string;
    beneficiaire: string;
    categorie: string;
    montant: number;
    statut: string;
  }[];
}

export async function getTableauBordCompta(): Promise<TableauBordCompta> {
  const { etablissementId, anneeScolaireId, role } = await requireContext();
  requirePermission(role, "rapport:financier");

  const now = new Date();
  const debutFenetre = debutDeMois(
    new Date(now.getFullYear(), now.getMonth() - 5, 1),
  );

  const [paiements, depenses, salaires, fraisEleves] = await Promise.all([
    prisma.paiement.findMany({
      where: {
        statut: "valide",
        fraisEleve: { inscription: { etablissementId } },
      },
      select: { montant: true, modePaiement: true, createdAt: true },
    }),
    prisma.depense.findMany({
      where: { etablissementId },
      select: {
        id: true,
        montant: true,
        categorie: true,
        statut: true,
        beneficiaire: true,
        date: true,
        datePaiement: true,
        createdAt: true,
      },
      orderBy: { date: "desc" },
    }),
    prisma.salaire.findMany({
      where: { etablissementId },
      select: { netAPayer: true, statut: true, datePaiement: true },
    }),
    prisma.fraisEleve.findMany({
      where: {
        inscription: { etablissementId, anneeScolaireId },
        statut: { not: "annule" },
      },
      include: {
        remises: { select: { montant: true } },
        echeance: { include: { typeFrais: { select: { nom: true } } } },
        inscription: {
          include: {
            eleve: { select: { prenom: true, nom: true } },
            classe: { select: { nom: true } },
          },
        },
      },
    }),
  ]);

  const totalPaiements = paiements.reduce((s, p) => s + Number(p.montant), 0);
  const totalDepensesPayees = depenses
    .filter((d) => d.statut === "paye")
    .reduce((s, d) => s + Number(d.montant), 0);
  const totalSalairesPayes = salaires
    .filter((x) => x.statut === "paye")
    .reduce((s, x) => s + Number(x.netAPayer), 0);

  const tresorerie = totalPaiements - totalDepensesPayees - totalSalairesPayes;

  const dm = debutDeMois(now);
  const fm = finDeMois(now);
  const recettesMois = paiements
    .filter((p) => p.createdAt >= dm && p.createdAt <= fm)
    .reduce((s, p) => s + Number(p.montant), 0);
  const depensesMois = depenses
    .filter((d) => {
      const ref = d.datePaiement ?? d.date;
      return d.statut === "paye" && ref >= dm && ref <= fm;
    })
    .reduce((s, d) => s + Number(d.montant), 0);

  // Soldes impayés
  const fraisAvecSolde = fraisEleves
    .map((f) => {
      const remises = f.remises.reduce((s, r) => s + Number(r.montant), 0);
      const solde = Math.max(
        0,
        Number(f.montantDu) - Number(f.montantPaye) - remises,
      );
      return {
        id: f.id,
        eleve: `${f.inscription.eleve.prenom} ${f.inscription.eleve.nom}`,
        classe: f.inscription.classe.nom,
        motif: f.echeance.libelle ?? f.echeance.typeFrais.nom,
        solde,
      };
    })
    .filter((f) => f.solde > 0);
  const impayes = fraisAvecSolde.reduce((s, f) => s + f.solde, 0);

  // Flux 6 derniers mois
  const buckets = new Map<string, { recettes: number; depenses: number }>();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    buckets.set(moisKey(d), { recettes: 0, depenses: 0 });
  }
  for (const p of paiements) {
    if (p.createdAt < debutFenetre) continue;
    const b = buckets.get(moisKey(p.createdAt));
    if (b) b.recettes += Number(p.montant);
  }
  for (const d of depenses) {
    if (d.statut !== "paye") continue;
    const ref = d.datePaiement ?? d.date;
    if (ref < debutFenetre) continue;
    const b = buckets.get(moisKey(ref));
    if (b) b.depenses += Number(d.montant);
  }
  const flux: FluxMois[] = [...buckets.entries()].map(([key, v]) => {
    const [y, m] = key.split("-").map(Number);
    return { mois: nfMois.format(new Date(y, m - 1, 1)), ...v };
  });

  // Répartition par catégorie (dépenses payées + poste Salaires)
  const parCat = new Map<string, number>();
  for (const d of depenses) {
    if (d.statut !== "paye") continue;
    parCat.set(d.categorie, (parCat.get(d.categorie) ?? 0) + Number(d.montant));
  }
  if (totalSalairesPayes > 0) {
    parCat.set("Salaires", (parCat.get("Salaires") ?? 0) + totalSalairesPayes);
  }
  const parCategorie: CategorieDepense[] = [...parCat.entries()]
    .map(([categorie, montant]) => ({ categorie, montant }))
    .sort((a, b) => b.montant - a.montant);

  return {
    tresorerie,
    recettesMois,
    depensesMois,
    impayes,
    flux,
    parCategorie,
    fraisImpayes: fraisAvecSolde
      .sort((a, b) => b.solde - a.solde)
      .slice(0, 6),
    dernieresDepenses: depenses.slice(0, 6).map((d) => ({
      id: d.id,
      beneficiaire: d.beneficiaire,
      categorie: d.categorie,
      montant: Number(d.montant),
      statut: d.statut,
    })),
  };
}

// ─────────────────────────────────────────────────────────────
// Recettes (vue sur les paiements réels)
// ─────────────────────────────────────────────────────────────

export interface RecetteRow {
  id: string; // paiementId
  date: string;
  eleve: string;
  classe: string;
  motif: string;
  montant: number;
  methode: string;
  reference: string;
  numeroRecu: string;
  statut: "valide" | "annule";
}

export async function listerRecettes(params: {
  q?: string;
  mois?: string; // "YYYY-MM"
} = {}): Promise<RecetteRow[]> {
  const { etablissementId, role } = await requireContext();
  requirePermission(role, "paiement:view");

  let dateFilter: { gte: Date; lte: Date } | undefined;
  if (params.mois && /^\d{4}-\d{2}$/.test(params.mois)) {
    const [y, m] = params.mois.split("-").map(Number);
    dateFilter = {
      gte: new Date(y, m - 1, 1),
      lte: new Date(y, m, 0, 23, 59, 59, 999),
    };
  }

  const paiements = await prisma.paiement.findMany({
    where: {
      fraisEleve: { inscription: { etablissementId } },
      ...(dateFilter ? { createdAt: dateFilter } : {}),
    },
    include: {
      fraisEleve: {
        include: {
          echeance: { include: { typeFrais: { select: { nom: true } } } },
          inscription: {
            include: {
              eleve: { select: { prenom: true, nom: true } },
              classe: { select: { nom: true } },
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const filtre = params.q?.toLowerCase().trim();
  return paiements
    .map((p) => ({
      id: p.id,
      date: formatDateCourte(p.createdAt),
      eleve: `${p.fraisEleve.inscription.eleve.prenom} ${p.fraisEleve.inscription.eleve.nom}`,
      classe: p.fraisEleve.inscription.classe.nom,
      motif:
        p.fraisEleve.echeance.libelle ?? p.fraisEleve.echeance.typeFrais.nom,
      montant: Number(p.montant),
      methode: p.modePaiement,
      reference: p.reference ?? "",
      numeroRecu: p.numeroRecu,
      statut: p.statut === "annule" ? ("annule" as const) : ("valide" as const),
    }))
    .filter(
      (r) =>
        !filtre ||
        r.eleve.toLowerCase().includes(filtre) ||
        r.numeroRecu.toLowerCase().includes(filtre) ||
        r.reference.toLowerCase().includes(filtre),
    );
}

// ─────────────────────────────────────────────────────────────
// Dépenses
// ─────────────────────────────────────────────────────────────

export interface DepenseRow {
  id: string;
  date: string;
  categorie: string;
  description: string;
  montant: number;
  beneficiaire: string;
  statut: "planifie" | "paye";
  modePaiement: string | null;
}

export async function listerDepenses(params: {
  q?: string;
  statut?: string;
} = {}): Promise<DepenseRow[]> {
  const { etablissementId, role } = await requireContext();
  requirePermission(role, "depense:gerer");

  const depenses = await prisma.depense.findMany({
    where: {
      etablissementId,
      ...(params.statut ? { statut: params.statut } : {}),
    },
    orderBy: { date: "desc" },
  });

  const filtre = params.q?.toLowerCase().trim();
  return depenses
    .map((d) => ({
      id: d.id,
      date: formatDateCourte(d.date),
      categorie: d.categorie,
      description: d.description,
      montant: Number(d.montant),
      beneficiaire: d.beneficiaire,
      statut: d.statut === "paye" ? ("paye" as const) : ("planifie" as const),
      modePaiement: d.modePaiement,
    }))
    .filter(
      (d) =>
        !filtre ||
        d.beneficiaire.toLowerCase().includes(filtre) ||
        d.categorie.toLowerCase().includes(filtre) ||
        d.description.toLowerCase().includes(filtre),
    );
}

// ─────────────────────────────────────────────────────────────
// Salaires
// ─────────────────────────────────────────────────────────────

export interface SalaireRow {
  id: string;
  mois: string;
  employeNom: string;
  role: string;
  typeContrat: "fixe" | "horaire";
  heures: number | null;
  tauxHoraire: number | null;
  salaireBase: number | null;
  primes: number;
  retenues: number;
  netAPayer: number;
  statut: "attente" | "paye";
}

export interface ListeSalaires {
  mois: string;
  moisDisponibles: string[];
  lignes: SalaireRow[];
  totalNet: number;
  totalEnAttente: number;
  nbEnAttente: number;
}

function moisCourant(): string {
  return moisKey(new Date());
}

export async function listerSalaires(params: {
  mois?: string;
  q?: string;
} = {}): Promise<ListeSalaires> {
  const { etablissementId, role } = await requireContext();
  requirePermission(role, "salaire:gerer");

  const tousMois = await prisma.salaire.findMany({
    where: { etablissementId },
    select: { mois: true },
    distinct: ["mois"],
    orderBy: { mois: "desc" },
  });
  const moisDisponibles = tousMois.map((m) => m.mois);
  const mois =
    params.mois && moisDisponibles.includes(params.mois)
      ? params.mois
      : moisDisponibles[0] ?? moisCourant();

  const salaires = await prisma.salaire.findMany({
    where: { etablissementId, mois },
    orderBy: [{ statut: "asc" }, { employeNom: "asc" }],
  });

  const filtre = params.q?.toLowerCase().trim();
  const lignes: SalaireRow[] = salaires
    .map((s) => ({
      id: s.id,
      mois: s.mois,
      employeNom: s.employeNom,
      role: s.role,
      typeContrat:
        s.typeContrat === "horaire" ? ("horaire" as const) : ("fixe" as const),
      heures: s.heures != null ? Number(s.heures) : null,
      tauxHoraire: s.tauxHoraire != null ? Number(s.tauxHoraire) : null,
      salaireBase: s.salaireBase != null ? Number(s.salaireBase) : null,
      primes: Number(s.primes),
      retenues: Number(s.retenues),
      netAPayer: Number(s.netAPayer),
      statut: s.statut === "paye" ? ("paye" as const) : ("attente" as const),
    }))
    .filter(
      (s) =>
        !filtre ||
        s.employeNom.toLowerCase().includes(filtre) ||
        s.role.toLowerCase().includes(filtre),
    );

  return {
    mois,
    moisDisponibles,
    lignes,
    totalNet: lignes.reduce((s, l) => s + l.netAPayer, 0),
    totalEnAttente: lignes
      .filter((l) => l.statut === "attente")
      .reduce((s, l) => s + l.netAPayer, 0),
    nbEnAttente: lignes.filter((l) => l.statut === "attente").length,
  };
}

// ─────────────────────────────────────────────────────────────
// Stats impayés (pour la relance)
// ─────────────────────────────────────────────────────────────

export async function getStatsImpayes(): Promise<{
  nbParents: number;
  totalDu: number;
}> {
  const { etablissementId, anneeScolaireId, role } = await requireContext();
  requirePermission(role, "rapport:financier");

  const frais = await prisma.fraisEleve.findMany({
    where: {
      inscription: { etablissementId, anneeScolaireId },
      statut: { not: "annule" },
    },
    include: {
      remises: { select: { montant: true } },
      inscription: {
        include: {
          eleve: {
            include: {
              parents: { where: { principal: true }, include: { parent: true } },
            },
          },
        },
      },
    },
  });

  const emails = new Set<string>();
  let totalDu = 0;
  for (const f of frais) {
    const remises = f.remises.reduce((s, r) => s + Number(r.montant), 0);
    const solde = Math.max(
      0,
      Number(f.montantDu) - Number(f.montantPaye) - remises,
    );
    if (solde <= 0) continue;
    totalDu += solde;
    const email = f.inscription.eleve.parents[0]?.parent?.email;
    if (email) emails.add(email);
  }
  return { nbParents: emails.size, totalDu };
}

// ─────────────────────────────────────────────────────────────
// Rapports — synthèse chiffrée
// ─────────────────────────────────────────────────────────────

export interface SyntheseRapports {
  mois: string; // libellé "septembre 2026"
  recettesMois: number;
  depensesMois: number;
  resultatMois: number;
  recettesAnnee: number;
  depensesAnnee: number;
  resultatAnnee: number;
  anneeLibelle: string;
}

export async function getSyntheseRapports(): Promise<SyntheseRapports> {
  const { etablissementId, anneeScolaireId, role } = await requireContext();
  requirePermission(role, "rapport:financier");

  const annee = await prisma.anneeScolaire.findUnique({
    where: { id: anneeScolaireId },
    select: { libelle: true, dateDebut: true, dateFin: true },
  });
  const debutAnnee = annee?.dateDebut ?? new Date(new Date().getFullYear(), 0, 1);
  const finAnnee = annee?.dateFin ?? new Date();

  const now = new Date();
  const dm = debutDeMois(now);
  const fm = finDeMois(now);

  const [paiements, depenses, salaires] = await Promise.all([
    prisma.paiement.findMany({
      where: {
        statut: "valide",
        fraisEleve: { inscription: { etablissementId } },
        createdAt: { gte: debutAnnee, lte: finAnnee },
      },
      select: { montant: true, createdAt: true },
    }),
    prisma.depense.findMany({
      where: { etablissementId, statut: "paye" },
      select: { montant: true, date: true, datePaiement: true },
    }),
    prisma.salaire.findMany({
      where: { etablissementId, statut: "paye" },
      select: { netAPayer: true, datePaiement: true, createdAt: true },
    }),
  ]);

  const inRange = (d: Date, a: Date, b: Date) => d >= a && d <= b;

  const recettesAnnee = paiements.reduce((s, p) => s + Number(p.montant), 0);
  const recettesMois = paiements
    .filter((p) => inRange(p.createdAt, dm, fm))
    .reduce((s, p) => s + Number(p.montant), 0);

  const depRefAnnee = depenses.filter((d) =>
    inRange(d.datePaiement ?? d.date, debutAnnee, finAnnee),
  );
  const salRefAnnee = salaires.filter((x) =>
    inRange(x.datePaiement ?? x.createdAt, debutAnnee, finAnnee),
  );
  const depensesAnnee =
    depRefAnnee.reduce((s, d) => s + Number(d.montant), 0) +
    salRefAnnee.reduce((s, x) => s + Number(x.netAPayer), 0);

  const depensesMois =
    depenses
      .filter((d) => inRange(d.datePaiement ?? d.date, dm, fm))
      .reduce((s, d) => s + Number(d.montant), 0) +
    salaires
      .filter((x) => inRange(x.datePaiement ?? x.createdAt, dm, fm))
      .reduce((s, x) => s + Number(x.netAPayer), 0);

  const nfMoisLong = new Intl.DateTimeFormat("fr-FR", {
    month: "long",
    year: "numeric",
  });

  return {
    mois: nfMoisLong.format(now),
    recettesMois,
    depensesMois,
    resultatMois: recettesMois - depensesMois,
    recettesAnnee,
    depensesAnnee,
    resultatAnnee: recettesAnnee - depensesAnnee,
    anneeLibelle: annee?.libelle ?? "",
  };
}
