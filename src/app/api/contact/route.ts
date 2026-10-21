import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSiteEcole } from "@/server/dal/site-ecole";
import { envoyerMessageContact } from "@/server/services/site-ecole.service";

const schema = z.object({
  ecole: z.string().trim().max(40).optional(),
  prenom: z.string().trim().min(1, "Votre prénom est requis.").max(80),
  nom: z.string().trim().min(1, "Votre nom est requis.").max(80),
  email: z.email("Adresse e-mail invalide."),
  telephone: z.string().trim().max(30).optional(),
  sujet: z.string().trim().min(1, "Choisissez un sujet.").max(120),
  message: z.string().trim().min(5, "Votre message est trop court.").max(5000),
  // Champ piège invisible : rempli uniquement par les robots.
  siteWeb: z.string().optional(),
});

/**
 * @swagger
 * /api/contact:
 *   post:
 *     summary: Envoyer un message depuis le formulaire de contact
 *     description: Transmet le message par e-mail à l'école (paramètre `ecole`) ou à l'équipe SAIMO. Aucun auth requis.
 *     tags: [Site public]
 *     responses:
 *       200:
 *         description: Message transmis
 *       400:
 *         description: Données invalides
 *       502:
 *         description: L'e-mail n'a pas pu être envoyé
 */
export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ erreur: "Requête invalide." }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ erreur: parsed.error.issues[0]?.message ?? "Données invalides." }, { status: 400 });
  }
  const d = parsed.data;
  if (d.siteWeb) return NextResponse.json({ ok: true });

  let etablissementId: string | undefined;
  if (d.ecole) {
    const ecole = await getSiteEcole(d.ecole);
    if (!ecole) return NextResponse.json({ erreur: "École introuvable." }, { status: 404 });
    etablissementId = ecole.etablissementId;
  }

  try {
    const envoye = await envoyerMessageContact({
      etablissementId,
      prenom: d.prenom,
      nom: d.nom,
      email: d.email,
      telephone: d.telephone || undefined,
      sujet: d.sujet,
      message: d.message,
    });
    if (!envoye) {
      return NextResponse.json(
        { erreur: "Votre message n'a pas pu être transmis. Réessayez plus tard ou appelez-nous directement." },
        { status: 502 },
      );
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { erreur: "Votre message n'a pas pu être transmis. Réessayez plus tard ou appelez-nous directement." },
      { status: 500 },
    );
  }
}
