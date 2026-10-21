import "server-only";
import { prisma } from "@/lib/prisma";
import { envoyerEmail, templateBase } from "@/server/external/email.service";
import { CLE_SITE, siteEcoleSchema } from "@/lib/site-ecole";

const echapper = (v: string) =>
  v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const ligne = (libelle: string, valeur?: string | null) =>
  valeur ? `<p style="margin:4px 0"><strong>${libelle} :</strong> ${echapper(valeur)}</p>` : "";

/**
 * Adresse qui reçoit les demandes envoyées depuis le site d'une école :
 * l'e-mail de réception du site public, sinon celui de l'établissement.
 */
async function destinataireEcole(etablissementId: string) {
  const [etab, contenu] = await Promise.all([
    prisma.etablissement.findUnique({ where: { id: etablissementId }, select: { nom: true, email: true } }),
    prisma.parametre.findUnique({
      where: { etablissementId_cle: { etablissementId, cle: CLE_SITE } },
      select: { valeur: true },
    }),
  ]);
  let site = null;
  try {
    const r = contenu ? siteEcoleSchema.safeParse(JSON.parse(contenu.valeur)) : null;
    site = r?.success ? r.data : null;
  } catch {
    site = null;
  }
  return {
    email: site?.email || etab?.email || null,
    nom: site?.nomComplet || etab?.nom || "Établissement",
    nomCourt: site?.nomCourt || etab?.nom || "Établissement",
  };
}

/** Prévient l'école qu'une demande de préinscription vient d'arriver. N'échoue jamais. */
export async function notifierPreinscription(params: {
  etablissementId: string;
  enfants: { reference: string; nom: string; niveau?: string }[];
  tuteur?: string;
  telephone: string;
  email?: string;
  message?: string;
}): Promise<void> {
  try {
    const dest = await destinataireEcole(params.etablissementId);
    if (!dest.email) return;
    const n = params.enfants.length;
    const lignesEnfants = params.enfants
      .map(
        (e) =>
          `<tr><td style="padding:6px 10px;border-bottom:1px solid #eee"><strong>${echapper(e.nom)}</strong></td>` +
          `<td style="padding:6px 10px;border-bottom:1px solid #eee">${echapper(e.niveau ?? "Niveau non précisé")}</td>` +
          `<td style="padding:6px 10px;border-bottom:1px solid #eee;font-family:monospace">${echapper(e.reference)}</td></tr>`,
      )
      .join("");
    const html = templateBase(
      `<p>Une nouvelle demande de préinscription a été déposée en ligne${n > 1 ? ` pour <strong>${n} enfants</strong>` : ""}.</p>
       <table style="border-collapse:collapse;width:100%;margin:12px 0">${lignesEnfants}</table>
       ${ligne("Responsable", params.tuteur)}
       ${ligne("Téléphone", params.telephone)}
       ${ligne("E-mail", params.email)}
       ${params.message ? `<p style="margin-top:12px"><strong>Message :</strong><br>${echapper(params.message).replace(/\n/g, "<br>")}</p>` : ""}
       <p style="margin-top:16px">La demande est disponible dans le portail, rubrique <strong>Pré-inscriptions</strong>.</p>`,
      "Nouvelle préinscription",
      dest.nom,
    );
    await envoyerEmail({
      type: "notification_preinscription",
      destinataireEmail: dest.email,
      destinataireNom: dest.nom,
      sujet:
        n > 1
          ? `Nouvelle préinscription — ${n} enfants (${params.enfants.map((e) => e.nom).join(", ")})`
          : `Nouvelle préinscription — ${params.enfants[0]?.nom} (${params.enfants[0]?.reference})`,
      htmlContent: html,
      etablissementId: params.etablissementId,
      expediteurNom: dest.nomCourt,
      replyTo: params.email ? { email: params.email, name: params.tuteur } : undefined,
    });
  } catch {
    // RM-14 : la notification ne doit jamais bloquer l'enregistrement de la demande.
  }
}

/**
 * Transmet un message du formulaire de contact.
 * Sans établissement, le message part à l'équipe SAIMO. Renvoie false si l'envoi a échoué.
 */
export async function envoyerMessageContact(params: {
  etablissementId?: string;
  prenom: string;
  nom: string;
  email: string;
  telephone?: string;
  sujet: string;
  message: string;
}): Promise<boolean> {
  const dest = params.etablissementId
    ? await destinataireEcole(params.etablissementId)
    : { email: process.env.SAIMO_ADMIN_EMAIL || null, nom: "SAIMO", nomCourt: "SAIMO" };
  if (!dest.email) return false;

  const auteur = `${params.prenom} ${params.nom}`.trim();
  const html = templateBase(
    `<p>Nouveau message reçu depuis le formulaire de contact du site.</p>
     ${ligne("Nom", auteur)}
     ${ligne("E-mail", params.email)}
     ${ligne("Téléphone", params.telephone)}
     ${ligne("Sujet", params.sujet)}
     <p style="margin-top:12px"><strong>Message :</strong><br>${echapper(params.message).replace(/\n/g, "<br>")}</p>
     <p style="margin-top:16px;color:#666">Répondez directement à cet e-mail pour écrire à ${echapper(auteur)}.</p>`,
    "Message du site",
    dest.nom,
  );
  return envoyerEmail({
    type: "message_contact",
    destinataireEmail: dest.email,
    destinataireNom: dest.nom,
    sujet: `[Site] ${params.sujet} — ${auteur}`,
    htmlContent: html,
    etablissementId: params.etablissementId,
    expediteurNom: dest.nomCourt,
    replyTo: { email: params.email, name: auteur },
  });
}
