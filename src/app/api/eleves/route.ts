import { NextRequest, NextResponse } from "next/server";
import { trouverEleves } from "@/server/repositories/eleve.repo";
import { creerNouvelEleve, type CreerEleveInput } from "@/server/services/eleve.service";
import { auth } from "@/lib/auth";

/**
 * @swagger
 * /api/eleves:
 *   get:
 *     summary: Liste les élèves
 *     description: Retourne la liste des élèves avec support de la pagination et filtrage. Uniquement les élèves de l'établissement de l'utilisateur connecté sont retournés.
 *     tags:
 *       - Eleves
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Numéro de page
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Recherche par nom, prénom ou matricule
 *     responses:
 *       200:
 *         description: Liste des élèves récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       matricule:
 *                         type: string
 *                       prenom:
 *                         type: string
 *                       nom:
 *                         type: string
 *                       statut:
 *                         type: string
 *                 total:
 *                   type: integer
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès refusé
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.etablissementId) {
      return NextResponse.json({ erreur: "Non authentifié ou établissement non défini" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const q = searchParams.get("q") || undefined;

    const resultats = await trouverEleves({
      etablissementId: session.user.etablissementId,
      page,
      recherche: q,
    });

    return NextResponse.json(resultats);
  } catch (error) {
    return NextResponse.json({ erreur: "Erreur serveur" }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/eleves:
 *   post:
 *     summary: Créer un nouvel élève
 *     description: Inscrit un nouvel élève et l'affecte à une classe.
 *     tags:
 *       - Eleves
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - prenom
 *               - nom
 *               - anneeScolaireId
 *               - classeId
 *             properties:
 *               prenom:
 *                 type: string
 *               nom:
 *                 type: string
 *               dateNaissance:
 *                 type: string
 *                 format: date-time
 *               sexe:
 *                 type: string
 *                 enum: [M, F]
 *               anneeScolaireId:
 *                 type: string
 *               classeId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Élève créé avec succès
 *       400:
 *         description: Données invalides (doublon, etc.)
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
    const input: CreerEleveInput = {
      ...body,
      etablissementId: session.user.etablissementId,
      inscritParId: session.user.id,
    };

    const resultat = await creerNouvelEleve(input);

    return NextResponse.json(resultat, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { erreur: error instanceof Error ? error.message : "Erreur serveur" },
      { status: 400 }
    );
  }
}
