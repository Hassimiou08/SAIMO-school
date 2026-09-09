import { BrevoClient } from "@getbrevo/brevo";

const apiKey = process.env.BREVO_API_KEY ?? "";

export const brevoClient = new BrevoClient({ apiKey });

export const senderDefault = {
  email: process.env.BREVO_SENDER_EMAIL ?? "no-reply@saimo-ecole.gn",
  name: process.env.BREVO_SENDER_NAME ?? "SAIMO Ecole",
};

/**
 * Envoie un email transactionnel via Brevo.
 * RM-14 : l'indisponibilité de Brevo ne bloque jamais l'opération métier.
 */
export async function sendEmail(params: {
  to: { email: string; name?: string }[];
  subject: string;
  htmlContent: string;
  replyTo?: { email: string; name?: string };
  tags?: string[];
}): Promise<{ success: boolean; idExterne?: string; motifEchec?: string }> {
  if (!apiKey) {
    return { success: false, motifEchec: "BREVO_API_KEY non configurée" };
  }

  try {
    const res = await brevoClient.transactionalEmails.sendTransacEmail({
      sender: senderDefault,
      to: params.to,
      subject: params.subject,
      htmlContent: params.htmlContent,
      replyTo: params.replyTo,
      tags: params.tags,
    });
    return { success: true, idExterne: res.messageId };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return { success: false, motifEchec: message };
  }
}
