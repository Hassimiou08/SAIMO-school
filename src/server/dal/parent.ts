import "server-only";

import { cache } from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireContext } from "@/server/context";
import { formatDateLongue, formatDateCourte } from "@/lib/format";
import { mentionAuto } from "@/lib/bulletin";

// ─── Contexte ───────────────────────────────────────────────

export const getContexteParent = cache(async () => {
  const ctx = await requireContext();
  return { ...ctx, estEleve: ctx.role === "ELEVE" };
});

export interface EnfantResume {
  id: string;
  prenom: string;
  nom: string;
  nomComplet: string;
  matricule: string;
  classe: string;
  cycle: string;
  niveau: string;
  anneeScolaire: string;
  profPrincipal: string | null;
  photo: string | null;
}

export const mesEnfants = cache(async (): Promise<EnfantResume[]> => {
  const { utilisateurId, role, etablissementId, anneeScolaireId } = await getContexteParent();

  let eleveIds: string[] = [];
  if (role === "ELEVE") {
    const e = await prisma.eleve.findUnique({
      where: { compteUtilisateurId: utilisateurId },
      select: { id: true },
    });
    eleveIds = e ? [e.id] : [];
  } else {
    const parent = await prisma.parent.findUnique({
      where: { utilisateurId },
      include: { enfants: { orderBy: { principal: "desc" } } },
    });
    eleveIds = parent ? parent.enfants.map((r) => r.eleveId) : [];
  }
  if (eleveIds.length === 0) return [];

  const inscriptions = await prisma.inscription.findMany({
    where: { eleveId: { in: eleveIds }, anneeScolaireId, etablissementId, statut: "active" },
    include: {
      eleve: true,
      anneeScolaire: true,
      classe: {
        include: {
          niveau: { include: { cycle: true } },
          affectationsEnseignants: {
            where: { estProfPrincipal: true, anneeScolaireId },
            include: { enseignant: { include: { utilisateur: true } } },
          },
        },
      },
    },
    orderBy: { eleve: { prenom: "asc" } },
  });

  return inscriptions.map((i) => {
    const pp = i.classe.affectationsEnseignants[0]?.enseignant.utilisateur;
    return {
      id: i.eleveId,
      prenom: i.eleve.prenom,
      nom: i.eleve.nom,
      nomComplet: `${i.eleve.prenom} ${i.eleve.nom}`,
      matricule: i.eleve.matricule,
      classe: i.classe.nom,
      cycle: i.classe.niveau.cycle.nom,
      niveau: i.classe.niveau.nom,
      anneeScolaire: i.anneeScolaire.libelle,
      profPrincipal: pp ? `${pp.prenom} ${pp.nom}` : null,
      photo: i.eleve.photo,
    };
  });
});

async function verifierEnfant(eleveId: string) {
  const enfants = await mesEnfants();
  if (!enfants.some((e) => e.id === eleveId)) notFound();
}

export const resoudreEnfant = cache(
  async (demande?: string): Promise<EnfantResume | null> => {
    const enfants = await mesEnfants();
    if (enfants.length === 0) return null;
    if (demande) return enfants.find((e) => e.id === demande) ?? enfants[0];
    return enfants[0];
  },
);

async function periodeCourante(anneeScolaireId: string) {
  return (
    (await prisma.periode.findFirst({ where: { anneeScolaireId, active: true } })) ??
    (await prisma.periode.findFirst({
      where: { anneeScolaireId },
      orderBy: { ordre: "desc" },
    }))
  );
}

// ─── Notes (période courante) ──────────────────────────────

export interface NoteMatiereParent {
  matiere: string;
  coefficient: number;
  notes: number[];
  moyenne: number | null;
  appreciation: string | null;
}
export interface NotesEnfant {
  periode: string | null;
  matieres: NoteMatiereParent[];
  moyenneGenerale: number | null;
  totalCoef: number;
}

export const getNotesEnfant = cache(async (eleveId: string): Promise<NotesEnfant> => {
  await verifierEnfant(eleveId);
  const { anneeScolaireId, etablissementId } = await getContexteParent();
  const periode = await periodeCourante(anneeScolaireId);
  if (!periode) return { periode: null, matieres: [], moyenneGenerale: null, totalCoef: 0 };

  const insc = await prisma.inscription.findFirst({
    where: { eleveId, anneeScolaireId, statut: "active" },
    select: { classeId: true },
  });
  if (!insc) return { periode: periode.nom, matieres: [], moyenneGenerale: null, totalCoef: 0 };

  const notes = await prisma.note.findMany({
    where: {
      eleveId,
      evaluation: {
        classeId: insc.classeId,
        periodeId: periode.id,
        etablissementId,
        statut: "verrouillee",
      },
    },
    include: {
      evaluation: { include: { matiere: { include: { niveaux: true } } } },
    },
  });

  const parMat = new Map<
    string,
    { matiere: string; coef: number; somme: number; nb: number; valeurs: number[] }
  >();
  for (const n of notes) {
    if (n.valeur == null || n.absent || n.dispense) continue;
    const bareme = Number(n.evaluation.noteMaximale) || 20;
    const sur20 = Math.round((Number(n.valeur) / bareme) * 20 * 100) / 100;
    const key = n.evaluation.matiereId;
    const coef = Number(n.evaluation.matiere.niveaux[0]?.coefficient ?? 1);
    const cur = parMat.get(key) ?? {
      matiere: n.evaluation.matiere.nom,
      coef,
      somme: 0,
      nb: 0,
      valeurs: [],
    };
    cur.somme += sur20;
    cur.nb += 1;
    cur.valeurs.push(sur20);
    parMat.set(key, cur);
  }

  const matieres: NoteMatiereParent[] = [...parMat.values()]
    .map((m) => ({
      matiere: m.matiere,
      coefficient: m.coef,
      notes: m.valeurs,
      moyenne: m.nb ? Math.round((m.somme / m.nb) * 100) / 100 : null,
      appreciation: null,
    }))
    .sort((a, b) => a.matiere.localeCompare(b.matiere));

  const totalCoef = matieres.reduce((s, m) => s + m.coefficient, 0);
  const pond = matieres.reduce(
    (s, m) => s + (m.moyenne ?? 0) * m.coefficient,
    0,
  );
  const avecNote = matieres.filter((m) => m.moyenne != null);
  const coefAvecNote = avecNote.reduce((s, m) => s + m.coefficient, 0);
  const moyenneGenerale = coefAvecNote
    ? Math.round((pond / coefAvecNote) * 100) / 100
    : null;

  return { periode: periode.nom, matieres, moyenneGenerale, totalCoef };
});

// ─── Bulletins publiés ────────────────────────────────────

export interface BulletinParentLigne {
  id: string;
  periode: string;
  annee: string;
  moyenneGenerale: number | null;
  rang: number | null;
  effectif: number | null;
  mention: string;
  date: string | null;
}

export const getBulletinsEnfant = cache(
  async (eleveId: string): Promise<BulletinParentLigne[]> => {
    await verifierEnfant(eleveId);
    const bulletins = await prisma.bulletin.findMany({
      where: { eleveId, statut: "publie" },
      include: { periode: true },
      orderBy: [{ createdAt: "desc" }, { periode: { ordre: "asc" } }],
    });
    const anneeIds = [...new Set(bulletins.map((b) => b.anneeScolaireId))];
    const annees = anneeIds.length
      ? await prisma.anneeScolaire.findMany({
          where: { id: { in: anneeIds } },
          select: { id: true, libelle: true },
        })
      : [];
    const libelleAnnee = new Map(annees.map((a) => [a.id, a.libelle]));

    return bulletins.map((b) => {
      const moy = b.moyenneGenerale != null ? Number(b.moyenneGenerale) : null;
      return {
        id: b.id,
        periode: b.periode.nom,
        annee: libelleAnnee.get(b.anneeScolaireId) ?? "",
        moyenneGenerale: moy,
        rang: b.rang,
        effectif: b.effectifClasse,
        mention: b.mentionHonneur ?? mentionAuto(moy),
        date: b.dateValidation ? formatDateLongue(b.dateValidation) : null,
      };
    });
  },
);

/** Vérifie qu'un bulletin publié appartient bien à un enfant du parent. */
export async function bulletinPublieDeMonEnfant(bulletinId: string): Promise<boolean> {
  const b = await prisma.bulletin.findUnique({
    where: { id: bulletinId },
    select: { eleveId: true, statut: true },
  });
  if (!b || b.statut !== "publie") return false;
  const enfants = await mesEnfants();
  return enfants.some((e) => e.id === b.eleveId);
}

// ─── Absences ─────────────────────────────────────────────

export interface AbsenceParentLigne {
  id: string;
  date: string;
  statut: "Absent" | "Retard";
  justifiee: boolean;
  motif: string;
}

export const getAbsencesEnfant = cache(
  async (eleveId: string): Promise<AbsenceParentLigne[]> => {
    await verifierEnfant(eleveId);
    const presences = await prisma.presence.findMany({
      where: { eleveId, statut: { in: ["absent", "retard"] } },
      include: { seance: true },
      orderBy: { createdAt: "desc" },
    });
    return presences.map((p) => ({
      id: p.id,
      date: p.seance?.date
        ? formatDateLongue(p.seance.date)
        : formatDateLongue(p.createdAt),
      statut: p.statut === "retard" ? "Retard" : "Absent",
      justifiee: p.justifie,
      motif: p.motif || "—",
    }));
  },
);

// ─── Paiements ────────────────────────────────────────────

export interface PaiementParentLigne {
  id: string; // fraisEleveId
  libelle: string;
  montantDu: number;
  montantPaye: number;
  solde: number;
  statut: "Soldé" | "Partiel" | "Impayé";
  echeanceDate: string | null;
}

export const getPaiementsEnfant = cache(
  async (eleveId: string): Promise<PaiementParentLigne[]> => {
    await verifierEnfant(eleveId);
    const { anneeScolaireId, etablissementId } = await getContexteParent();
    const frais = await prisma.fraisEleve.findMany({
      where: {
        inscription: { eleveId, anneeScolaireId, etablissementId },
        statut: { not: "annule" },
      },
      include: {
        echeance: { include: { typeFrais: true } },
        remises: true,
      },
      orderBy: { echeance: { dateEcheance: "asc" } },
    });
    return frais.map((f) => {
      const remises = f.remises.reduce((s, r) => s + Number(r.montant), 0);
      const du = Number(f.montantDu) - remises;
      const paye = Number(f.montantPaye);
      const solde = Math.max(0, du - paye);
      return {
        id: f.id,
        libelle: f.echeance.libelle ?? f.echeance.typeFrais.nom,
        montantDu: du,
        montantPaye: paye,
        solde,
        statut: solde <= 0 ? "Soldé" : paye > 0 ? "Partiel" : "Impayé",
        echeanceDate: f.echeance.dateEcheance
          ? formatDateCourte(f.echeance.dateEcheance)
          : null,
      };
    });
  },
);

// ─── Notifications (flux calculé) ─────────────────────────

export interface NotifParentItem {
  id: string;
  type: "note" | "absence" | "paiement" | "bulletin";
  message: string;
  date: string;
}

export const getNotificationsEnfant = cache(
  async (eleveId: string): Promise<NotifParentItem[]> => {
    await verifierEnfant(eleveId);
    const enfant = (await mesEnfants()).find((e) => e.id === eleveId)!;
    const ilya30j = new Date(Date.now() - 30 * 864e5);

    const [notesRecentes, absencesNJ, fraisEnRetard, bulletinsRecents] =
      await Promise.all([
        prisma.note.findMany({
          where: {
            eleveId,
            valeur: { not: null },
            createdAt: { gte: ilya30j },
            evaluation: { statut: "verrouillee" },
          },
          include: { evaluation: { include: { matiere: true } } },
          orderBy: { createdAt: "desc" },
          take: 10,
        }),
        prisma.presence.findMany({
          where: { eleveId, statut: { in: ["absent", "retard"] }, justifie: false },
          include: { seance: true },
          orderBy: { createdAt: "desc" },
          take: 10,
        }),
        prisma.fraisEleve.findMany({
          where: {
            inscription: { eleveId },
            statut: { in: ["impaye", "partiel"] },
            echeance: { dateEcheance: { lt: new Date() } },
          },
          include: { echeance: { include: { typeFrais: true } } },
        }),
        prisma.bulletin.findMany({
          where: { eleveId, statut: "publie", updatedAt: { gte: ilya30j } },
          include: { periode: true },
          orderBy: { updatedAt: "desc" },
        }),
      ]);

    const items: NotifParentItem[] = [];
    for (const n of notesRecentes) {
      items.push({
        id: `note-${n.id}`,
        type: "note",
        message: `Nouvelle note en ${n.evaluation.matiere.nom} : ${Number(n.valeur)}/${Number(n.evaluation.noteMaximale)}`,
        date: formatDateLongue(n.createdAt),
      });
    }
    for (const a of absencesNJ) {
      items.push({
        id: `abs-${a.id}`,
        type: "absence",
        message: `Absence non justifiée le ${formatDateCourte(a.seance?.date ?? a.createdAt)}`,
        date: formatDateLongue(a.seance?.date ?? a.createdAt),
      });
    }
    for (const f of fraisEnRetard) {
      items.push({
        id: `frais-${f.id}`,
        type: "paiement",
        message: `${f.echeance.libelle ?? f.echeance.typeFrais.nom} : échéance dépassée`,
        date: f.echeance.dateEcheance ? formatDateLongue(f.echeance.dateEcheance) : "—",
      });
    }
    for (const b of bulletinsRecents) {
      items.push({
        id: `bul-${b.id}`,
        type: "bulletin",
        message: `Bulletin ${b.periode.nom} de ${enfant.prenom} disponible`,
        date: b.dateValidation ? formatDateLongue(b.dateValidation) : formatDateLongue(b.updatedAt),
      });
    }
    return items;
  },
);

// ─── Tableau de bord ──────────────────────────────────────

export const getDashboardEnfant = cache(async (eleveId: string) => {
  await verifierEnfant(eleveId);
  const [notes, bulletins, absences, paiements, notifs] = await Promise.all([
    getNotesEnfant(eleveId),
    getBulletinsEnfant(eleveId),
    getAbsencesEnfant(eleveId),
    getPaiementsEnfant(eleveId),
    getNotificationsEnfant(eleveId),
  ]);

  const dernierBulletin = bulletins[0] ?? null;
  const soldeTotal = paiements.reduce((s, p) => s + p.solde, 0);
  const duTotal = paiements.reduce((s, p) => s + p.montantDu, 0);
  const payeTotal = paiements.reduce((s, p) => s + p.montantPaye, 0);

  return {
    moyenneGenerale: notes.moyenneGenerale ?? dernierBulletin?.moyenneGenerale ?? null,
    periodeNotes: notes.periode,
    absencesTotal: absences.length,
    absencesNonJustifiees: absences.filter((a) => !a.justifiee).length,
    soldeTotal,
    duTotal,
    payeTotal,
    nbNotifs: notifs.length,
    meilleureMatiere: [...notes.matieres]
      .filter((m) => m.moyenne != null)
      .sort((a, b) => (b.moyenne ?? 0) - (a.moyenne ?? 0))[0] ?? null,
    matiereAmelioree: [...notes.matieres]
      .filter((m) => m.moyenne != null)
      .sort((a, b) => (a.moyenne ?? 0) - (b.moyenne ?? 0))[0] ?? null,
    matieres: notes.matieres,
    dernierBulletin,
    paiements,
  };
});
