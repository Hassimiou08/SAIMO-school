import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

/**
 * @swagger
 * /api/annonces:
 *   get:
 *     summary: Liste les annonces
 *     description: Récupère les annonces (communiqués) de l'établissement.
 *     tags:
 *       - Communication
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des annonces
 *       401:
 *         description: Non authentifié
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.etablissementId) {
      return NextResponse.json({ erreur: "Non authentifié" }, { status: 401 });
    }

    const annonces = await prisma.annonce.findMany({
      where: {
        etablissementId: session.user.etablissementId,
        publie: true,
      },
      orderBy: { datePublication: "desc" },
    });

    return NextResponse.json(annonces);
  } catch (error) {
    return NextResponse.json({ erreur: "Erreur serveur" }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/annonces:
 *   post:
 *     summary: Créer une annonce
 *     description: Diffuse une nouvelle annonce à destination des parents, élèves ou professeurs.
 *     tags:
 *       - Communication
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - titre
 *               - contenu
 *             properties:
 *               titre:
 *                 type: string
 *               contenu:
 *                 type: string
 *               rolesVises:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Annonce créée
 *       401:
 *         description: Non authentifié
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.etablissementId) {
      return NextResponse.json({ erreur: "Non authentifié" }, { status: 401 });
    }

    let body;
    try {
      body = await request.json();
    } catch (e) {
      return NextResponse.json({ erreur: "Le format JSON de la requête est invalide." }, { status: 400 });
    }
    
    const annonce = await prisma.annonce.create({
      data: {
        ...body,
        etablissementId: session.user.etablissementId,
        creePar: session.user.id,
        publie: true,
        datePublication: new Date(),
      },
    });

    return NextResponse.json(annonce, { status: 201 });
  } catch (error) {
    return NextResponse.json({ erreur: "Erreur serveur" }, { status: 500 });
  }
}
