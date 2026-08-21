import { NextRequest, NextResponse } from "next/server";
import { saisirNotes, validerEvaluation } from "@/server/services/notes.service";
import { auth } from "@/lib/auth";

/**
 * @swagger
 * /api/evaluations/{id}/notes:
 *   post:
 *     summary: Saisir les notes d'une évaluation
 *     description: Permet d'enregistrer les notes (valeur, absent, dispense) pour les élèves.
 *     tags:
 *       - Evaluations
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'évaluation
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               properties:
 *                 eleveId:
 *                   type: string
 *                 valeur:
 *                   type: number
 *                 absent:
 *                   type: boolean
 *                 dispense:
 *                   type: boolean
 *                 observations:
 *                   type: string
 *     responses:
 *       200:
 *         description: Notes enregistrées avec succès
 *       400:
 *         description: Erreur de barème ou évaluation verrouillée
 *       401:
 *         description: Non authentifié
 */
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    if (!session?.user?.etablissementId) {
      return NextResponse.json({ erreur: "Non authentifié" }, { status: 401 });
    }

    const body = await request.json();
    await saisirNotes(params.id, body, session.user.id, session.user.etablissementId);

    return NextResponse.json({ succes: true });
  } catch (error) {
    return NextResponse.json(
      { erreur: error instanceof Error ? error.message : "Erreur serveur" },
      { status: 400 }
    );
  }
}

/**
 * @swagger
 * /api/evaluations/{id}/notes:
 *   patch:
 *     summary: Verrouiller/Valider une évaluation
 *     description: Valide définitivement l'évaluation, bloquant les modifications de notes. Requiert des permissions élevées.
 *     tags:
 *       - Evaluations
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'évaluation
 *     responses:
 *       200:
 *         description: Évaluation verrouillée avec succès
 *       401:
 *         description: Non authentifié
 */
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    if (!session?.user?.etablissementId) {
      return NextResponse.json({ erreur: "Non authentifié" }, { status: 401 });
    }

    await validerEvaluation(params.id, session.user.id, session.user.etablissementId);

    return NextResponse.json({ succes: true });
  } catch (error) {
    return NextResponse.json(
      { erreur: error instanceof Error ? error.message : "Erreur serveur" },
      { status: 400 }
    );
  }
}
