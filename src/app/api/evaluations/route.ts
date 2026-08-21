import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

/**
 * @swagger
 * /api/evaluations:
 *   get:
 *     summary: Liste les évaluations
 *     description: Récupère la liste des évaluations pour une classe et une période donnée.
 *     tags:
 *       - Evaluations
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: classeId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la classe
 *       - in: query
 *         name: periodeId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la période
 *     responses:
 *       200:
 *         description: Liste récupérée avec succès
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
      return NextResponse.json({ erreur: "Paramètres classeId et periodeId requis" }, { status: 400 });
    }

    const evaluations = await prisma.evaluation.findMany({
      where: {
        etablissementId: session.user.etablissementId,
        classeId,
        periodeId,
      },
      include: {
        matiere: true,
        typeEvaluation: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(evaluations);
  } catch (error) {
    return NextResponse.json({ erreur: "Erreur serveur" }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/evaluations:
 *   post:
 *     summary: Créer une nouvelle évaluation
 *     description: Prépare une nouvelle évaluation pour une matière.
 *     tags:
 *       - Evaluations
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - periodeId
 *               - classeId
 *               - matiereId
 *               - typeEvaluationId
 *             properties:
 *               periodeId:
 *                 type: string
 *               classeId:
 *                 type: string
 *               matiereId:
 *                 type: string
 *               typeEvaluationId:
 *                 type: string
 *               titre:
 *                 type: string
 *               dateEvaluation:
 *                 type: string
 *                 format: date-time
 *               noteMaximale:
 *                 type: number
 *     responses:
 *       201:
 *         description: Évaluation créée avec succès
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
    
    const evaluation = await prisma.evaluation.create({
      data: {
        ...body,
        etablissementId: session.user.etablissementId,
        creePar: session.user.id,
      },
    });

    return NextResponse.json(evaluation, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { erreur: error instanceof Error ? error.message : "Erreur serveur" },
      { status: 400 }
    );
  }
}
