import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

/**
 * @swagger
 * /api/bulletins:
 *   get:
 *     summary: Liste les bulletins d'une classe
 *     description: Récupère les bulletins générés pour une classe et une période.
 *     tags:
 *       - Bulletins
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: classeId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: periodeId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Liste des bulletins récupérée
 *       400:
 *         description: Paramètres manquants
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
    const classeId = searchParams.get("classeId");
    const periodeId = searchParams.get("periodeId");

    if (!classeId || !periodeId) {
      return NextResponse.json({ erreur: "classeId et periodeId requis" }, { status: 400 });
    }

    const bulletins = await prisma.bulletin.findMany({
      where: {
        classeId,
        periodeId,
        classe: { etablissementId: session.user.etablissementId },
      },
      include: {
        eleve: true,
      },
      orderBy: { rang: "asc" },
    });

    return NextResponse.json(bulletins);
  } catch (error) {
    return NextResponse.json({ erreur: "Erreur serveur" }, { status: 500 });
  }
}
