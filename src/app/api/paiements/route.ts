import { NextRequest, NextResponse } from "next/server";
import { enregistrerPaiement, rapportCaisse } from "@/server/services/paiement.service";
import { auth } from "@/lib/auth";

/**
 * @swagger
 * /api/paiements:
 *   get:
 *     summary: Rapport de caisse
 *     description: Retourne la liste des paiements encaissés sur une période donnée pour l'établissement de l'utilisateur connecté.
 *     tags:
 *       - Finance
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: debut
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Date de début (YYYY-MM-DD)
 *       - in: query
 *         name: fin
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Date de fin (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Rapport de caisse généré avec succès
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
    const debut = searchParams.get("debut");
    const fin = searchParams.get("fin");

    if (!debut || !fin) {
      return NextResponse.json({ erreur: "Dates de début et fin requises" }, { status: 400 });
    }

    const rapport = await rapportCaisse(
      session.user.etablissementId,
      new Date(debut),
      new Date(fin)
    );

    return NextResponse.json(rapport);
  } catch (error) {
    return NextResponse.json({ erreur: "Erreur serveur" }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/paiements:
 *   post:
 *     summary: Enregistrer un paiement
 *     description: Enregistre un nouveau paiement pour les frais d'un élève.
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
 *               - fraisEleveId
 *               - montant
 *               - modePaiement
 *             properties:
 *               fraisEleveId:
 *                 type: string
 *               montant:
 *                 type: number
 *               modePaiement:
 *                 type: string
 *                 enum: [especes, cheque, virement, mobile]
 *               reference:
 *                 type: string
 *               observation:
 *                 type: string
 *     responses:
 *       201:
 *         description: Paiement enregistré avec succès, retourne le numéro de reçu
 *       400:
 *         description: Données invalides ou solde insuffisant
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
    const { paiement, recu } = await enregistrerPaiement({
      ...body,
      etablissementId: session.user.etablissementId,
      encaisseParId: session.user.id,
    });

    return NextResponse.json({ paiementId: paiement.id, numeroRecu: paiement.numeroRecu, recuUrl: recu.urlPdf }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { erreur: error instanceof Error ? error.message : "Erreur serveur" },
      { status: 400 }
    );
  }
}
