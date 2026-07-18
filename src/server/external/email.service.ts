import { sendEmail } from "@/lib/brevo";
import { prisma } from "@/lib/prisma";

export type TypeEmail =
  | "invitation_compte"
  | "reinitialisation_mdp"
  | "confirmation_inscription"
  | "recu_paiement"
  | "rappel_echeance"
  | "bulletin_disponible"
  | "annonce_administrative"
  | "rapport_direction";

// ─── Templates HTML intégrés ──────────────────────────────────

function templateBase(contenu: string, titre: string): string {
  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><title>${titre}</title>
<style>
  body { font-family: Arial, sans-serif; background: #f5f5f5; margin: 0; padding: 0; }
  .container { max-width: 600px; margin: 32px auto; background: #fff; border-radius: 8px; overflow: hidden; }
  .header { background: #1a3a5c; color: #fff; padding: 24px 32px; }
  .header h1 { margin: 0; font-size: 22px; }
  .body { padding: 32px; color: #333; line-height: 1.6; }
  .footer { background: #f5f5f5; padding: 16px 32px; font-size: 12px; color: #666; text-align: center; }
  .btn { display: inline-block; background: #1a3a5c; color: #fff; padding: 12px 24px; border-radius: 6px; text-decoration: none; margin: 16px 0; }
</style>
</head>
<body>
<div class="container">
  <div class="header"><h1>SAIMO Ecole</h1></div>
  <div class="body">${contenu}</div>
  <div class="footer">© ${new Date().getFullYear()} SAIMO Ecole — Communication automatique</div>
</div>
</body>
</html>`;
}

// ─── Envoi d'email avec suivi en base ────────────────────────

export async function envoyerEmail(params: {
  type: TypeEmail;
  destinataireEmail: string;
  destinataireNom?: string;
  sujet: string;
  htmlContent: string;
  etablissementId?: string;
}): Promise<void> {
  // Créer la notification en base (statut: en_attente)
  const notification = await prisma.notification.create({
    data: {
      etablissementId: params.etablissementId,
      type: "email",
      destinataireEmail: params.destinataireEmail,
      sujet: params.sujet,
      contenu: params.htmlContent,
      statut: "en_attente",
    },
  });

  const resultat = await sendEmail({
    to: [{ email: params.destinataireEmail, name: params.destinataireNom }],
    subject: params.sujet,
    htmlContent: params.htmlContent,
    tags: [params.type],
  });

  // RM-18 : suivre le statut sans dupliquer l'opération métier
  await prisma.notification.update({
    where: { id: notification.id },
    data: {
      statut: resultat.success ? "envoye" : "echoue",
      idExterne: resultat.idExterne,
      motifEchec: resultat.motifEchec,
      dateEnvoi: resultat.success ? new Date() : undefined,
      tentatives: 1,
    },
  });
}

// ─── Emails spécialisés ───────────────────────────────────────

export async function envoyerInvitation(params: {
  email: string;
  prenom: string;
  etablissementNom: string;
  lienInvitation: string;
  etablissementId: string;
}) {
  const html = templateBase(
    `<p>Bonjour <strong>${params.prenom}</strong>,</p>
     <p>Vous êtes invité(e) à rejoindre <strong>${params.etablissementNom}</strong> sur SAIMO Ecole.</p>
     <a href="${params.lienInvitation}" class="btn">Accepter l'invitation</a>
     <p>Ce lien est valable 48 heures.</p>`,
    "Invitation SAIMO Ecole"
  );
  await envoyerEmail({
    type: "invitation_compte",
    destinataireEmail: params.email,
    destinataireNom: params.prenom,
    sujet: `Invitation à rejoindre ${params.etablissementNom} — SAIMO Ecole`,
    htmlContent: html,
    etablissementId: params.etablissementId,
  });
}

export async function envoyerRecuPaiement(params: {
  email: string;
  prenomParent: string;
  prenomEleve: string;
  nomEleve: string;
  numeroRecu: string;
  montant: number;
  devise: string;
  etablissementId: string;
}) {
  const html = templateBase(
    `<p>Bonjour <strong>${params.prenomParent}</strong>,</p>
     <p>Nous confirmons la réception de votre paiement pour <strong>${params.prenomEleve} ${params.nomEleve}</strong>.</p>
     <table style="width:100%;border-collapse:collapse;margin:16px 0">
       <tr><td style="padding:8px;border:1px solid #ddd"><strong>N° Reçu</strong></td><td style="padding:8px;border:1px solid #ddd">${params.numeroRecu}</td></tr>
       <tr><td style="padding:8px;border:1px solid #ddd"><strong>Montant</strong></td><td style="padding:8px;border:1px solid #ddd">${params.montant.toLocaleString("fr-FR")} ${params.devise}</td></tr>
     </table>
     <p>Conservez ce reçu comme justificatif.</p>`,
    "Reçu de paiement"
  );
  await envoyerEmail({
    type: "recu_paiement",
    destinataireEmail: params.email,
    destinataireNom: params.prenomParent,
    sujet: `Reçu de paiement N° ${params.numeroRecu} — SAIMO Ecole`,
    htmlContent: html,
    etablissementId: params.etablissementId,
  });
}

export async function envoyerNotifBulletin(params: {
  email: string;
  prenomParent: string;
  prenomEleve: string;
  nomEleve: string;
  periode: string;
  lienBulletin: string;
  etablissementId: string;
}) {
  const html = templateBase(
    `<p>Bonjour <strong>${params.prenomParent}</strong>,</p>
     <p>Le bulletin de <strong>${params.prenomEleve} ${params.nomEleve}</strong> pour la période <strong>${params.periode}</strong> est maintenant disponible.</p>
     <a href="${params.lienBulletin}" class="btn">Consulter le bulletin</a>`,
    "Bulletin disponible"
  );
  await envoyerEmail({
    type: "bulletin_disponible",
    destinataireEmail: params.email,
    destinataireNom: params.prenomParent,
    sujet: `Bulletin de ${params.prenomEleve} ${params.nomEleve} disponible — ${params.periode}`,
    htmlContent: html,
    etablissementId: params.etablissementId,
  });
}
