import "server-only";

import { prisma } from "@/lib/prisma";
import { requireContext } from "@/server/context";

export interface StatsDashboard {
  elevesActifs: number;
  enseignantsActifs: number;
  classes: number;
  bulletinsGeneres: number;
  tauxPresence: number; // %
  tauxRecouvrement: number; // % montant encaissé / dû
  recettesTotales: number;
  montantImpayes: number;
  evaluationsEnAttente: number;
}

export async function getStatsDashboard(): Promise<StatsDashboard> {
  const { etablissementId, anneeScolaireId } = await requireContext();

  const [
    elevesActifs,
    enseignantsActifs,
    classes,
    bulletinsGeneres,
    presences,
    fraisAgg,
    paiementsAgg,
    evaluationsEnAttente,
  ] = await Promise.all([
    prisma.inscription.count({
      where: { etablissementId, anneeScolaireId, statut: "active" },
    }),
    prisma.enseignant.count({
      where: { etablissementId, affectations: { some: { anneeScolaireId } } },
    }),
    prisma.classe.count({ where: { etablissementId, anneeScolaireId } }),
    prisma.bulletin.count({
      where: { anneeScolaireId, classe: { etablissementId } },
    }),
    prisma.presence.groupBy({
      by: ["statut"],
      where: { classe: { etablissementId, anneeScolaireId } },
      _count: { _all: true },
    }),
    prisma.fraisEleve.aggregate({
      where: { inscription: { etablissementId, anneeScolaireId } },
      _sum: { montantDu: true, montantPaye: true },
    }),
    prisma.paiement.aggregate({
      where: {
        statut: "valide",
        fraisEleve: { inscription: { etablissementId, anneeScolaireId } },
      },
      _sum: { montant: true },
    }),
    prisma.evaluation.count({
      where: {
        etablissementId,
        statut: { not: "verrouillee" },
        classe: { anneeScolaireId },
      },
    }),
  ]);

  const totalPresences = presences.reduce((n, p) => n + p._count._all, 0);
  const presents =
    presences.find((p) => p.statut === "present")?._count._all ?? 0;
  const tauxPresence = totalPresences
    ? Math.round((presents / totalPresences) * 100)
    : 100;

  const du = Number(fraisAgg._sum.montantDu ?? 0);
  const paye = Number(fraisAgg._sum.montantPaye ?? 0);
  const tauxRecouvrement = du ? Math.round((paye / du) * 100) : 0;

  return {
    elevesActifs,
    enseignantsActifs,
    classes,
    bulletinsGeneres,
    tauxPresence,
    tauxRecouvrement,
    recettesTotales: Number(paiementsAgg._sum.montant ?? 0),
    montantImpayes: Math.max(0, du - paye),
    evaluationsEnAttente,
  };
}

export interface MoyenneClasse {
  nom: string;
  value: number | null;
  effectif: number;
}

export async function getMoyennesParClasse(): Promise<{
  classes: MoyenneClasse[];
  moyenneGenerale: number | null;
}> {
  const { etablissementId, anneeScolaireId } = await requireContext();

  const classes = await prisma.classe.findMany({
    where: { etablissementId, anneeScolaireId },
    include: {
      niveau: { include: { cycle: true } },
      _count: { select: { inscriptions: { where: { statut: "active" } } } },
      bulletins: {
        where: { anneeScolaireId },
        select: { moyenneGenerale: true },
      },
    },
    orderBy: [
      { niveau: { cycle: { ordre: "asc" } } },
      { niveau: { ordre: "asc" } },
      { nom: "asc" },
    ],
  });

  let sommeGlobale = 0;
  let nbGlobal = 0;

  const result: MoyenneClasse[] = classes.map((c) => {
    const notes = c.bulletins
      .map((b) => (b.moyenneGenerale != null ? Number(b.moyenneGenerale) : null))
      .filter((n): n is number => n != null);
    const moy = notes.length
      ? Math.round((notes.reduce((s, n) => s + n, 0) / notes.length) * 10) / 10
      : null;
    if (moy != null) {
      sommeGlobale += moy;
      nbGlobal += 1;
    }
    return { nom: c.nom, value: moy, effectif: c._count.inscriptions };
  });

  return {
    classes: result,
    moyenneGenerale: nbGlobal
      ? Math.round((sommeGlobale / nbGlobal) * 10) / 10
      : null,
  };
}

export interface ActiviteItem {
  id: string;
  action: string;
  entite: string;
  detail: string;
  who: string;
  when: string;
}

export async function getActiviteRecente(limit = 6): Promise<ActiviteItem[]> {
  const { etablissementId } = await requireContext();

  const logs = await prisma.journalAudit.findMany({
    where: { etablissementId },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: { utilisateur: { select: { prenom: true, nom: true } } },
  });

  const rtf = new Intl.RelativeTimeFormat("fr", { numeric: "auto" });
  const relatif = (d: Date) => {
    const diff = Date.now() - d.getTime();
    const min = Math.round(diff / 60000);
    if (min < 60) return rtf.format(-min, "minute");
    const h = Math.round(min / 60);
    if (h < 24) return rtf.format(-h, "hour");
    return rtf.format(-Math.round(h / 24), "day");
  };

  return logs.map((l) => ({
    id: l.id,
    action: l.action,
    entite: l.entite,
    detail:
      (l.apres as { titre?: string; matricule?: string; numeroRecu?: string } | null)
        ?.titre ??
      (l.apres as { matricule?: string } | null)?.matricule ??
      l.entiteId ??
      "",
    who: l.utilisateur ? `${l.utilisateur.prenom} ${l.utilisateur.nom}` : "Système",
    when: relatif(l.createdAt),
  }));
}
