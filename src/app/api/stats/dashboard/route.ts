import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

/**
 * @swagger
 * /api/stats/dashboard:
 *   get:
 *     summary: Statistiques globales du tableau de bord
 *     description: Récupère les indicateurs clés (nombre d'élèves, recettes, évaluations en cours) pour le tableau de bord de l'établissement.
 *     tags:
 *       - Statistiques
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: anneeScolaireId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'année scolaire en cours
 *     responses:
 *       200:
 *         description: Statistiques récupérées avec succès
 *       400:
 *         description: Paramètre manquant
 *       401:
 *         description: Non authentifié
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.etablissementId) {
      return NextResponse.json({ erreur: "Non authentifié" }, { status: 401 });
    }

    const etablissementId = session.user.etablissementId;
    const { searchParams } = new URL(request.url);
    const anneeScolaireId = searchParams.get("anneeScolaireId");

    if (!anneeScolaireId) {
      return NextResponse.json({ erreur: "L'année scolaire est requise" }, { status: 400 });
    }

    // 1. Total des élèves inscrits cette année
    const totalEleves = await prisma.inscription.count({
      where: {
        etablissementId,
        anneeScolaireId,
        statut: "active",
      },
    });

    // 2. Chiffre d'affaires de l'année (Paiements valides)
    const paiements = await prisma.paiement.aggregate({
      _sum: { montant: true },
      where: {
        statut: "valide",
        fraisEleve: {
          inscription: {
            etablissementId,
            anneeScolaireId,
          },
        },
      },
    });

    // 3. Montant total des impayés (Échéances dépassées)
    const maintenant = new Date();
    const impayes = await prisma.fraisEleve.findMany({
      where: {
        statut: { in: ["impaye", "partiel"] },
        echeance: {
          anneeScolaireId,
          dateEcheance: { lt: maintenant },
        },
        inscription: { etablissementId },
      },
    });

    const totalImpayes = impayes.reduce((acc, f) => {
      return acc + (Number(f.montantDu) - Number(f.montantPaye));
    }, 0);

    // 4. Évaluations non verrouillées
    const evaluationsEnAttente = await prisma.evaluation.count({
      where: {
        etablissementId,
        statut: { not: "verrouillee" },
        classe: { anneeScolaireId },
      },
    });

    // 5. Professeurs actifs
    const totalEnseignants = await prisma.enseignant.count({
      where: {
        etablissementId,
        affectations: {
          some: { anneeScolaireId },
        },
      },
    });

    return NextResponse.json({
      elevesActifs: totalEleves,
      recettesTotales: Number(paiements._sum.montant || 0),
      montantImpayes: totalImpayes,
      evaluationsEnAttente,
      enseignantsActifs: totalEnseignants,
    });
  } catch (error) {
    return NextResponse.json({ erreur: "Erreur serveur" }, { status: 500 });
  }
}
