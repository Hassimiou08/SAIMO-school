import { Prisma } from "@prisma/client";
import { NonAutorise } from "@/server/permissions/can";

const CHAMPS_LISIBLES: Record<string, string> = {
  nom: "ce nom",
  email: "cet email",
  matricule: "ce matricule",
  code: "ce code",
  numeroRecu: "ce numéro de reçu",
  reference: "cette référence",
  libelle: "ce libellé",
};

/**
 * Convertit une erreur serveur en message court et lisible pour l'utilisateur.
 * Traduit les erreurs Prisma connues (contrainte unique, FK, introuvable…).
 */
export function messageErreur(e: unknown): string {
  if (e instanceof NonAutorise) return e.message;

  if (e instanceof Prisma.PrismaClientKnownRequestError) {
    const cible = Array.isArray(e.meta?.target)
      ? (e.meta.target as string[])
      : typeof e.meta?.target === "string"
        ? [e.meta.target]
        : [];
    switch (e.code) {
      case "P2002": {
        const champ = cible.map((c) => CHAMPS_LISIBLES[c] ?? c).pop() ?? "cette valeur";
        return `Un enregistrement avec ${champ} existe déjà.`;
      }
      case "P2003":
        return "Référence liée invalide (élément parent introuvable).";
      case "P2025":
        return "L'élément demandé est introuvable.";
      case "P2011":
      case "P2012":
        return "Un champ obligatoire est manquant.";
      default:
        return "Opération impossible (contrainte de base de données).";
    }
  }

  if (e instanceof Prisma.PrismaClientValidationError) {
    return "Données invalides pour cette opération.";
  }

  return e instanceof Error ? e.message : "Erreur inattendue";
}
