import { prisma } from "@/lib/prisma";

export async function obtenirDashboardEnseignant(utilisateurId: string) {
  const enseignant = await prisma.enseignant.findUnique({
    where: { utilisateurId },
    include: {
      affectations: {
        include: { classe: true, matiere: true },
      },
    },
  });
  return enseignant?.affectations || [];
}

export async function obtenirDashboardEleve(utilisateurId: string) {
  const eleve = await prisma.eleve.findUnique({
    where: { compteUtilisateurId: utilisateurId },
    include: {
      inscriptions: { include: { classe: true, fraisEleves: true } },
      bulletins: true,
      presences: { where: { statut: { in: ["absent", "retard"] } } },
    },
  });
  return {
    scolarite: eleve?.inscriptions || [],
    absences: eleve?.presences || [],
    bulletins: eleve?.bulletins || [],
  };
}

export async function obtenirDashboardParent(utilisateurId: string) {
  const parent = await prisma.parent.findUnique({
    where: { utilisateurId },
    include: {
      enfants: {
        include: {
          eleve: {
            include: {
              inscriptions: { include: { fraisEleves: true } },
              bulletins: true,
            },
          },
        },
      },
    },
  });
  return parent?.enfants || [];
}

export async function obtenirDashboardComptable(etablissementId: string) {
  const paiementsAujourdhui = await prisma.paiement.aggregate({
    _sum: { montant: true },
    where: {
      createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
      statut: "valide",
      fraisEleve: { inscription: { etablissementId } },
    },
  });
  
  // Impayés globaux
  const impayes = await prisma.fraisEleve.aggregate({
    _sum: { montantDu: true, montantPaye: true },
    where: {
      statut: { in: ["impaye", "partiel"] },
      inscription: { etablissementId },
      echeance: { dateEcheance: { lt: new Date() } }
    }
  });

  const totalImpayes = (Number(impayes._sum.montantDu) || 0) - (Number(impayes._sum.montantPaye) || 0);

  return {
    caisseJour: Number(paiementsAujourdhui._sum.montant || 0),
    totalImpayes,
  };
}
