import { NextRequest, NextResponse } from "next/server";
import {
  creerPreInscription,
  getConfigPreInscriptionPublique,
} from "@/server/services/inscription.service";

/**
 * @swagger
 * /api/pre-inscriptions:
 *   get:
 *     summary: Configuration publique du tunnel de pré-inscription
 *     description: Établissement, année scolaire active et niveaux proposés. Aucun auth requis.
 *     tags: [Scolarité]
 *     responses:
 *       200:
 *         description: Configuration récupérée
 */
export async function GET() {
  const config = await getConfigPreInscriptionPublique();
  if (!config) {
    return NextResponse.json(
      { erreur: "Aucun établissement ouvert aux pré-inscriptions" },
      { status: 404 },
    );
  }
  return NextResponse.json(config);
}

/**
 * @swagger
 * /api/pre-inscriptions:
 *   post:
 *     summary: Soumettre une pré-inscription en ligne
 *     description: Enregistre une demande de pré-inscription (visiteur non connecté).
 *     tags: [Scolarité]
 *     responses:
 *       201:
 *         description: Demande enregistrée, retourne une référence
 *       400:
 *         description: Données incomplètes
 */
export async function POST(request: NextRequest) {
  try {
    let body: Record<string, unknown>;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ erreur: "JSON invalide" }, { status: 400 });
    }

    const prenomEleve = String(body.prenomEleve ?? "").trim();
    const nomEleve = String(body.nomEleve ?? "").trim();
    const telephone = String(body.telephone ?? "").trim();
    const etablissementId = String(body.etablissementId ?? "").trim();
    const anneeScolaireId = String(body.anneeScolaireId ?? "").trim();

    if (!prenomEleve || !nomEleve || !telephone || !etablissementId || !anneeScolaireId) {
      return NextResponse.json(
        { erreur: "Prénom, nom de l'élève, téléphone et établissement sont requis." },
        { status: 400 },
      );
    }

    const config = await getConfigPreInscriptionPublique();
    if (!config || config.etablissementId !== etablissementId) {
      return NextResponse.json({ erreur: "Établissement invalide" }, { status: 400 });
    }

    const dn = body.dateNaissance ? new Date(String(body.dateNaissance)) : undefined;

    const { reference } = await creerPreInscription({
      etablissementId,
      anneeScolaireId,
      niveauId: body.niveauId ? String(body.niveauId) : undefined,
      niveauSouhaite: body.niveauSouhaite ? String(body.niveauSouhaite) : undefined,
      prenomEleve,
      nomEleve,
      dateNaissance: dn && !Number.isNaN(dn.getTime()) ? dn : undefined,
      sexe: body.sexe ? String(body.sexe) : undefined,
      prenomTuteur: body.prenomTuteur ? String(body.prenomTuteur) : undefined,
      nomTuteur: body.nomTuteur ? String(body.nomTuteur) : undefined,
      telephone,
      email: body.email ? String(body.email) : undefined,
      message: body.message ? String(body.message) : undefined,
    });

    return NextResponse.json(
      {
        message:
          "Pré-inscription enregistrée. L'administration vous contactera pour finaliser le dossier.",
        reference,
      },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { erreur: error instanceof Error ? error.message : "Erreur serveur" },
      { status: 500 },
    );
  }
}
