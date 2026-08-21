import { NextRequest, NextResponse } from "next/server";
import { creerPreInscription } from "@/server/services/inscription.service";

/**
 * @swagger
 * /api/pre-inscriptions:
 *   post:
 *     summary: Soumettre une pré-inscription en ligne
 *     description: Permet à un parent ou un élève de faire une demande d'inscription sans être connecté.
 *     tags:
 *       - Scolarité
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - etablissementId
 *               - prenom
 *               - nom
 *               - niveauSouhaiteId
 *               - anneeScolaireId
 *             properties:
 *               etablissementId:
 *                 type: string
 *               prenom:
 *                 type: string
 *               nom:
 *                 type: string
 *               telephoneContact:
 *                 type: string
 *               niveauSouhaiteId:
 *                 type: string
 *               anneeScolaireId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Demande de pré-inscription envoyée
 *       400:
 *         description: Erreur dans la demande
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body.etablissementId || !body.prenom || !body.nom || !body.niveauSouhaiteId || !body.anneeScolaireId) {
      return NextResponse.json({ erreur: "Données incomplètes" }, { status: 400 });
    }

    const resultat = await creerPreInscription(body);

    return NextResponse.json({ 
      message: "Pré-inscription enregistrée avec succès. L'administration vous contactera.",
      reference: resultat.reference
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ erreur: "Erreur serveur" }, { status: 500 });
  }
}
