import * as brevo from "@getbrevo/brevo";

const apiInstance = new brevo.TransactionalEmailsApi();
apiInstance.setApiKey(
  brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY!
);

export const senderDefault = {
  email: process.env.BREVO_SENDER_EMAIL!,
  name: process.env.BREVO_SENDER_NAME ?? "SAIMO Ecole",
};

/**
 * Envoie un email transactionnel via Brevo.
 * Retourne l'ID externe du message ou null en cas d'échec.
 */
export async function sendEmail(params: {
  to: { email: string; name?: string }[];
  subject: string;
  htmlContent: string;
  replyTo?: { email: string; name?: string };
  tags?: string[];
}): Promise<{ success: boolean; idExterne?: string; motifEchec?: string }> {
  try {
    const sendSmtpEmail = new brevo.SendSmtpEmail();
    sendSmtpEmail.sender = senderDefault;
    sendSmtpEmail.to = params.to;
    sendSmtpEmail.subject = params.subject;
    sendSmtpEmail.htmlContent = params.htmlContent;
    if (params.replyTo) sendSmtpEmail.replyTo = params.replyTo;
    if (params.tags) sendSmtpEmail.tags = params.tags;

    const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
    return { success: true, idExterne: result.body?.messageId };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return { success: false, motifEchec: message };
  }
}

export { apiInstance as brevoClient };
