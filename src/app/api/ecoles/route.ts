import { NextResponse } from "next/server";
import { listerEcolesPreinscription } from "@/server/dal/site-ecole";

/**
 * @swagger
 * /api/ecoles:
 *   get:
 *     summary: Écoles ouvertes aux préinscriptions en ligne
 *     description: Écoles dont le site public est publié et qui acceptent les préinscriptions en ligne. Aucun auth requis.
 *     tags: [Site public]
 *     responses:
 *       200:
 *         description: Liste des écoles (adresse du site, nom, localisation)
 */
export async function GET() {
  return NextResponse.json({ ecoles: await listerEcolesPreinscription() });
}
