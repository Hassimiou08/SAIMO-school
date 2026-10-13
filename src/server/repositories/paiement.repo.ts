import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

/**
 * Recalcule le montant payé et le statut d'une ligne de frais à partir des
 * paiements valides ET des remises. Seule source de vérité du statut :
 * appelée après chaque paiement, annulation ou remise.
 */
export async function recalculerFraisEleve(
  tx: Prisma.TransactionClient,
  fraisEleveId: string,
) {
  const [paiements, remises, frais] = await Promise.all([
    tx.paiement.aggregate({
      where: { fraisEleveId, statut: "valide" },
      _sum: { montant: true },
    }),
    tx.remise.aggregate({ where: { fraisEleveId }, _sum: { montant: true } }),
    tx.fraisEleve.findUnique({ where: { id: fraisEleveId }, select: { montantDu: true, statut: true } }),
  ]);
  if (!frais || frais.statut === "annule") return;

  const montantPaye = Number(paiements._sum.montant ?? 0);
  const du = Number(frais.montantDu) - Number(remises._sum.montant ?? 0);
  const statut = montantPaye >= du ? "solde" : montantPaye > 0 ? "partiel" : "impaye";

  await tx.fraisEleve.update({
    where: { id: fraisEleveId },
    data: { montantPaye, statut },
  });
}

export async function trouverFraisEleve(inscriptionId: string) {
  return prisma.fraisEleve.findMany({
    where: { inscriptionId },
    include: { echeance: { include: { typeFrais: true } }, paiements: true, remises: true },
    orderBy: { echeance: { dateEcheance: "asc" } },
  });
}

export async function trouverPaiementsEleve(eleveId: string, etablissementId: string) {
  return prisma.paiement.findMany({
    where: {
      fraisEleve: {
        inscription: { eleveId, etablissementId },
      },
    },
    include: { fraisEleve: { include: { echeance: { include: { typeFrais: true } } } }, recu: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function genererNumeroRecu(etablissementId: string): Promise<string> {
  const annee = new Date().getFullYear();
  const [count, etablissement] = await Promise.all([
    prisma.paiement.count({
      where: {
        fraisEleve: {
          inscription: { etablissementId },
        },
        createdAt: {
          gte: new Date(`${annee}-01-01`),
        },
      },
    }),
    prisma.etablissement.findUnique({ where: { id: etablissementId }, select: { code: true } }),
  ]);
  const seq = String(count + 1).padStart(5, "0");
  // Le code établissement rend le numéro globalement unique entre écoles clientes
  // (Paiement.numeroRecu n'est pas unique par établissement mais sur toute la
  // plateforme) — sans ça, le tout premier reçu de chaque nouvelle école entre
  // en collision avec celui d'une autre.
  return `REC-${etablissement?.code ?? etablissementId}-${annee}-${seq}`;
}

export async function creerPaiement(data: {
  fraisEleveId: string;
  numeroRecu: string;
  montant: number;
  modePaiement: string;
  reference?: string;
  observation?: string;
  encaisseParId?: string;
  date?: Date;
}) {
  return prisma.$transaction(async (tx) => {
    const paiement = await tx.paiement.create({
      data: {
        fraisEleveId: data.fraisEleveId,
        numeroRecu: data.numeroRecu,
        montant: data.montant,
        modePaiement: data.modePaiement,
        reference: data.reference,
        observation: data.observation,
        encaisseParId: data.encaisseParId,
        ...(data.date ? { createdAt: data.date } : {}),
        statut: "valide",
      },
    });

    await recalculerFraisEleve(tx, data.fraisEleveId);

    return paiement;
  });
}

export async function annulerPaiement(
  paiementId: string,
  motif: string,
  annuleParId: string
) {
  // RM-12 : annulation conservée en historique, jamais supprimée
  return prisma.$transaction(async (tx) => {
    const paiement = await tx.paiement.update({
      where: { id: paiementId },
      data: {
        statut: "annule",
        motifAnnulation: motif,
        annuleParId,
        dateAnnulation: new Date(),
      },
    });

    await recalculerFraisEleve(tx, paiement.fraisEleveId);

    return paiement;
  });
}
