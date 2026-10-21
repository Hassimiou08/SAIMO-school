import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  creerPreInscriptions,
  getConfigPreInscriptionPublique,
} from "@/server/services/inscription.service";
import { getSiteEcole } from "@/server/dal/site-ecole";
import { notifierPreinscription } from "@/server/services/site-ecole.service";
import { MAX_ENFANTS_PREINSCRIPTION } from "@/lib/site-ecole";

/** École visée (adresse de son site), si elle accepte les préinscriptions en ligne. */
async function ecoleOuverte(slug: string | null | undefined) {
  const s = (slug ?? "").trim();
  if (!s) return null;
  const ecole = await getSiteEcole(s);
  return ecole?.site.preinscriptionsOuvertes ? ecole : null;
}

const texte = (max: number) => z.string().trim().max(max).optional().transform((v) => v || undefined);

const enfantSchema = z.object({
  prenomEleve: z.string().trim().min(1, "Le prénom de chaque enfant est requis.").max(80),
  nomEleve: z.string().trim().min(1, "Le nom de chaque enfant est requis.").max(80),
  dateNaissance: texte(10),
  sexe: z.enum(["M", "F"]).optional(),
  niveauId: texte(40),
});

const demandeSchema = z.object({
  ecole: z.string().trim().min(1, "Choisissez une école."),
  etablissementId: z.string().trim().min(1),
  anneeScolaireId: z.string().trim().min(1),
  enfants: z
    .array(enfantSchema)
    .min(1, "Ajoutez au moins un enfant.")
    .max(MAX_ENFANTS_PREINSCRIPTION, `${MAX_ENFANTS_PREINSCRIPTION} enfants au maximum par demande.`),
  prenomTuteur: texte(80),
  nomTuteur: texte(80),
  telephone: z.string().trim().min(6, "Le téléphone du responsable est requis.").max(30),
  email: z.union([z.literal(""), z.email("Adresse e-mail invalide.")]).optional().transform((v) => v || undefined),
  message: texte(2000),
});

/**
 * @swagger
 * /api/pre-inscriptions:
 *   get:
 *     summary: Configuration publique du tunnel de pré-inscription d'une école
 *     description: Année scolaire active et niveaux proposés par l'école `ecole` (adresse de son site). Aucun auth requis.
 *     tags: [Scolarité]
 *     parameters:
 *       - in: query
 *         name: ecole
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Configuration récupérée
 *       404:
 *         description: École inconnue ou préinscriptions fermées
 */
export async function GET(request: NextRequest) {
  const ecole = await ecoleOuverte(request.nextUrl.searchParams.get("ecole"));
  const config = ecole ? await getConfigPreInscriptionPublique(ecole.etablissementId) : null;
  if (!ecole || !config) {
    return NextResponse.json(
      { erreur: "Cette école n'accepte pas de préinscriptions en ligne pour le moment." },
      { status: 404 },
    );
  }
  return NextResponse.json({ ...config, etablissementNom: ecole.site.nomComplet });
}

/**
 * @swagger
 * /api/pre-inscriptions:
 *   post:
 *     summary: Soumettre une demande de pré-inscription (un ou plusieurs enfants)
 *     description: Enregistre une pré-inscription par enfant pour l'école `ecole` et la prévient par e-mail. Aucun auth requis.
 *     tags: [Scolarité]
 *     responses:
 *       201:
 *         description: Demande enregistrée, retourne les références
 *       400:
 *         description: Données incomplètes ou école invalide
 */
export async function POST(request: NextRequest) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ erreur: "JSON invalide" }, { status: 400 });
    }

    const parsed = demandeSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ erreur: parsed.error.issues[0]?.message ?? "Données invalides." }, { status: 400 });
    }
    const d = parsed.data;

    const ecole = await ecoleOuverte(d.ecole);
    const config = ecole ? await getConfigPreInscriptionPublique(ecole.etablissementId) : null;
    if (!config || config.etablissementId !== d.etablissementId || config.anneeScolaireId !== d.anneeScolaireId) {
      return NextResponse.json(
        { erreur: "Cette école n'accepte pas de préinscriptions en ligne pour le moment." },
        { status: 400 },
      );
    }

    const enfants = d.enfants.map((e) => {
      const niveau = config.niveaux.find((n) => n.id === e.niveauId);
      const dn = e.dateNaissance ? new Date(e.dateNaissance) : undefined;
      return {
        prenomEleve: e.prenomEleve,
        nomEleve: e.nomEleve,
        dateNaissance: dn && !Number.isNaN(dn.getTime()) ? dn : undefined,
        sexe: e.sexe,
        niveauId: niveau?.id,
        niveauSouhaite: niveau?.nom,
      };
    });

    const { reference, references } = await creerPreInscriptions({
      etablissementId: config.etablissementId,
      anneeScolaireId: config.anneeScolaireId,
      enfants,
      prenomTuteur: d.prenomTuteur,
      nomTuteur: d.nomTuteur,
      telephone: d.telephone,
      email: d.email,
      message: d.message,
    });

    await notifierPreinscription({
      etablissementId: config.etablissementId,
      enfants: enfants.map((e, i) => ({
        reference: references[i],
        nom: `${e.prenomEleve} ${e.nomEleve}`,
        niveau: e.niveauSouhaite,
      })),
      tuteur: [d.prenomTuteur, d.nomTuteur].filter(Boolean).join(" ") || undefined,
      telephone: d.telephone,
      email: d.email,
      message: d.message,
    });

    return NextResponse.json(
      {
        message:
          "Pré-inscription enregistrée. L'administration vous contactera pour finaliser le dossier.",
        reference,
        references,
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
