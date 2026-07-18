import { NextRequest, NextResponse } from "next/server";
import { soumettreDemandeIA, validerReponseIA } from "@/server/external/ia.service";
import { prisma } from "@/lib/prisma";
import type { TypeActionIA } from "@/lib/grok";

/**
 * POST /api/ia
 * Soumettre une demande à l'assistant Grok
 * RM-15 : l'IA ne prend aucune décision définitive
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { utilisateurId, etablissementId, typeAction, prompt, contexte } = body;

    if (!utilisateurId || !etablissementId || !typeAction || !prompt) {
      return NextResponse.json(
        { erreur: "Paramètres manquants" },
        { status: 400 }
      );
    }

    const resultat = await soumettreDemandeIA({
      utilisateurId,
      etablissementId,
      typeAction: typeAction as TypeActionIA,
      prompt,
      contexte,
    });

    return NextResponse.json({
      succes: resultat.succes,
      demandeId: resultat.id,
      reponse: resultat.reponse,
      // Rappel explicite que la réponse est une proposition
      avertissement: "Cette réponse est une PROPOSITION. Elle doit être validée par un responsable avant tout usage officiel.",
    });
  } catch {
    return NextResponse.json({ erreur: "Erreur serveur" }, { status: 500 });
  }
}

/**
 * PATCH /api/ia
 * Valider ou rejeter une réponse IA
 */
export async function PATCH(request: NextRequest) {
  try {
    const { demandeId, action, valideParId, etablissementId } =
      await request.json();

    if (action === "valider") {
      await validerReponseIA({ demandeId, valideParId, etablissementId });
    } else if (action === "rejeter") {
      await prisma.demandeIA.update({
        where: { id: demandeId },
        data: { statut: "rejete" },
      });
    } else {
      return NextResponse.json({ erreur: "Action invalide" }, { status: 400 });
    }

    return NextResponse.json({ succes: true });
  } catch {
    return NextResponse.json({ erreur: "Erreur serveur" }, { status: 500 });
  }
}
