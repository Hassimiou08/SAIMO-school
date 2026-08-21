import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

/**
 * @swagger
 * /api/echeances:
 *   get:
 *     summary: Liste les échéances financières
 *     description: Récupère les configurations des frais (Scolarité, Cantine, Inscription) exigibles pour une année scolaire.
 *     tags:
 *       - Finance
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
 *         description: Liste des échéances
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

    if (!anneeScolaireId) {
      return NextResponse.json({ erreur: "L'année scolaire est requise" }, { status: 400 });
    }

    const echeances = await prisma.echeance.findMany({
      where: {
        anneeScolaireId,
        typeFrais: {
          etablissementId: session.user.etablissementId,
        }
      },
      include: {
        typeFrais: true,
        niveau: true,
      },
      orderBy: { dateEcheance: "asc" }
    });

    return NextResponse.json(echeances);
  } catch (error) {
    return NextResponse.json({ erreur: "Erreur serveur" }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/echeances:
 *   post:
 *     summary: Créer une échéance
 *     description: Configure un nouveau frais pour un niveau spécifique (ex: Frais de Scolarité 6ème).
 *     tags:
 *       - Finance
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - typeFraisId
 *               - anneeScolaireId
 *               - montant
 *             properties:
 *               typeFraisId:
 *                 type: string
 *               anneeScolaireId:
 *                 type: string
 *               niveauId:
 *                 type: string
 *               montant:
 *                 type: number
 *               dateEcheance:
 *                 type: string
 *                 format: date-time
 *               libelle:
 *                 type: string
 *     responses:
 *       201:
 *         description: Échéance créée avec succès
 *       401:
 *         description: Non authentifié
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.etablissementId) {
      return NextResponse.json({ erreur: "Non authentifié" }, { status: 401 });
    }

    const body = await request.json();
    
    // Vérifier que le typeFrais appartient bien à cet établissement
    const typeFrais = await prisma.typeFrais.findUnique({
      where: { id: body.typeFraisId }
    });

    if (!typeFrais || typeFrais.etablissementId !== session.user.etablissementId) {
      return NextResponse.json({ erreur: "Type de frais invalide" }, { status: 403 });
    }

    const echeance = await prisma.echeance.create({
      data: body,
    });

    return NextResponse.json(echeance, { status: 201 });
  } catch (error) {
    return NextResponse.json({ erreur: "Erreur serveur" }, { status: 500 });
  }
}
