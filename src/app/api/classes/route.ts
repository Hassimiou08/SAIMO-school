import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

/**
 * @swagger
 * /api/classes:
 *   get:
 *     summary: Liste les classes
 *     description: Récupère la liste des classes pour une année scolaire donnée.
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
 *         description: Liste des classes
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

    const classes = await prisma.classe.findMany({
      where: {
        etablissementId: session.user.etablissementId,
        anneeScolaireId,
      },
      include: {
        niveau: { include: { cycle: true } },
        _count: { select: { inscriptions: { where: { statut: "active" } } } }
      },
      orderBy: [
        { niveau: { cycle: { ordre: "asc" } } },
        { niveau: { ordre: "asc" } },
        { nom: "asc" },
      ]
    });

    return NextResponse.json(classes);
  } catch (error) {
    return NextResponse.json({ erreur: "Erreur serveur" }, { status: 500 });
  }
}
