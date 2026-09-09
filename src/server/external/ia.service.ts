import { prisma } from "@/lib/prisma";
import { demandeGrok, type TypeActionIA } from "@/lib/grok";
import { audit, AuditAction, AuditEntite } from "@/server/logs/audit";

// ─── Soumettre une demande IA ─────────────────────────────────

export async function soumettreDemandeIA(input: {
  utilisateurId: string;
  etablissementId: string;
  typeAction: TypeActionIA;
  prompt: string;
  contexte?: Record<string, unknown>;
}): Promise<{ id: string; reponse?: string; succes: boolean; motifEchec?: string }> {
  // Créer la demande en base
  const demande = await prisma.demandeIA.create({
    data: {
      utilisateurId: input.utilisateurId,
      etablissementId: input.etablissementId,
      typeAction: input.typeAction,
      prompt: input.prompt,
      contexte: JSON.parse(JSON.stringify(input.contexte ?? {})),
      statut: "en_attente",
    },
  });

  // RM-14 : tracer les demandes IA sensibles
  await audit({
    utilisateurId: input.utilisateurId,
    etablissementId: input.etablissementId,
    action: AuditAction.CREATE,
    entite: AuditEntite.DEMANDE_IA,
    entiteId: demande.id,
    apres: { typeAction: input.typeAction },
  });

  // Appel au service Grok (RM-14 : l'indisponibilité ne bloque pas)
  const resultat = await demandeGrok(
    input.typeAction,
    input.prompt,
    input.contexte
  );

  // Mettre à jour la demande avec la réponse
  await prisma.demandeIA.update({
    where: { id: demande.id },
    data: {
      reponse: resultat.reponse,
      statut: resultat.success ? "repondu" : "en_attente",
    },
  });

  return {
    id: demande.id,
    reponse: resultat.reponse,
    succes: resultat.success,
    motifEchec: resultat.motifEchec,
  };
}

// ─── Valider une réponse IA (humain requis) ───────────────────

export async function validerReponseIA(input: {
  demandeId: string;
  valideParId: string;
  etablissementId: string;
}): Promise<void> {
  // RM-15 : toute production IA requiert validation humaine
  await prisma.demandeIA.update({
    where: { id: input.demandeId },
    data: {
      statut: "valide",
      valideParId: input.valideParId,
      dateValidation: new Date(),
      utilise: true,
    },
  });

  await audit({
    utilisateurId: input.valideParId,
    etablissementId: input.etablissementId,
    action: AuditAction.VALIDATE,
    entite: AuditEntite.DEMANDE_IA,
    entiteId: input.demandeId,
  });
}

// ─── Rejeter une réponse IA ───────────────────────────────────

export async function rejeterReponseIA(demandeId: string): Promise<void> {
  await prisma.demandeIA.update({
    where: { id: demandeId },
    data: { statut: "rejete" },
  });
}
