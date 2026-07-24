import { prisma } from "@/lib/prisma";

interface AuditParams {
  utilisateurId?: string;
  etablissementId?: string;
  action: string;
  entite: string;
  entiteId?: string;
  avant?: unknown;
  apres?: unknown;
  ipAdresse?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Enregistre une entrée dans le journal d'audit.
 * RM-14 : Toute opération sensible est inscrite dans le journal.
 */
export async function audit(params: AuditParams): Promise<void> {
  try {
    await prisma.journalAudit.create({
      data: {
        utilisateurId: params.utilisateurId,
        etablissementId: params.etablissementId,
        action: params.action,
        entite: params.entite,
        entiteId: params.entiteId,
        avant: params.avant ? JSON.parse(JSON.stringify(params.avant)) : undefined,
        apres: params.apres ? JSON.parse(JSON.stringify(params.apres)) : undefined,
        ipAdresse: params.ipAdresse,
        metadata: params.metadata,
      },
    });
  } catch (error) {
    // L'audit ne doit jamais bloquer l'opération principale
    console.error("[AUDIT ERROR]", error);
  }
}

// Actions standard
export const AuditAction = {
  CREATE: "CREATE",
  UPDATE: "UPDATE",
  DELETE: "DELETE",
  ARCHIVE: "ARCHIVE",
  LOGIN: "LOGIN",
  LOGOUT: "LOGOUT",
  VALIDATE: "VALIDATE",
  LOCK: "LOCK",
  UNLOCK: "UNLOCK",
  PAYMENT: "PAYMENT",
  CANCEL_PAYMENT: "CANCEL_PAYMENT",
  SEND_EMAIL: "SEND_EMAIL",
  GENERATE_PDF: "GENERATE_PDF",
  IMPORT: "IMPORT",
  EXPORT: "EXPORT",
  ROLE_CHANGE: "ROLE_CHANGE",
  PASSWORD_RESET: "PASSWORD_RESET",
  INVITE: "INVITE",
} as const;

// Entités standard
export const AuditEntite = {
  UTILISATEUR: "Utilisateur",
  ELEVE: "Eleve",
  INSCRIPTION: "Inscription",
  NOTE: "Note",
  EVALUATION: "Evaluation",
  BULLETIN: "Bulletin",
  PAIEMENT: "Paiement",
  FRAIS_ELEVE: "FraisEleve",
  CLASSE: "Classe",
  ETABLISSEMENT: "Etablissement",
  PRESENCE: "Presence",
  ANNONCE: "Annonce",
  DEMANDE_IA: "DemandeIA",
} as const;
