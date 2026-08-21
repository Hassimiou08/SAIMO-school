import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/webhooks/brevo
 * Reçoit les événements de statut Brevo (livraison, échec, rebond…)
 * RM-18 : suivi des envois sans dupliquer les opérations métier
 */
export async function POST(request: NextRequest) {
  try {
    const events = await request.json();
    const eventList = Array.isArray(events) ? events : [events];

    for (const event of eventList) {
      const { MessageId, event: type, reason } = event;
      if (!MessageId) continue;

      const statut = mapBrevoStatut(type);

      await prisma.notification.updateMany({
        where: { idExterne: MessageId },
        data: {
          statut,
          motifEchec: reason ?? undefined,
        },
      });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ erreur: "Traitement échoué" }, { status: 500 });
  }
}

function mapBrevoStatut(brevoEvent: string): string {
  switch (brevoEvent) {
    case "delivered":
      return "distribue";
    case "sent":
      return "envoye";
    case "hard_bounce":
    case "soft_bounce":
    case "blocked":
      return "rejete";
    case "error":
    case "invalid_email":
      return "echoue";
    default:
      return "envoye";
  }
}
