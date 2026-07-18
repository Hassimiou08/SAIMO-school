import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

/**
 * @swagger
 * /api/enseignants:
 *   get:
 *     summary: Liste les enseignants
 *     description: Récupère le personnel enseignant de l'établissement avec leurs affectations pour l'année en cours.
 *     tags:
 *       - Pédagogie
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: anneeScolaireId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Liste des enseignants
 *       401:
 *         description: Non authentifié
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.etablissementId) {
      return NextResponse.json({ erreur: "Non authentifié" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const anneeScolaireId = searchParams.get("anneeScolaireId");

    const enseignants = await prisma.enseignant.findMany({
      where: { etablissementId: session.user.etablissementId },
      include: {
        utilisateur: {
          select: { prenom: true, nom: true, email: true, telephone: true }
        },
        affectations: anneeScolaireId ? {
          where: { anneeScolaireId },
          include: { classe: true, matiere: true }
        } : false,
      }
    });

    return NextResponse.json(enseignants);
  } catch (error) {
    return NextResponse.json({ erreur: "Erreur serveur" }, { status: 500 });
  }
}
