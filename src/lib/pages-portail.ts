import type { Permission } from "@/server/permissions/roles";

/**
 * Pages du portail et droit requis pour les voir (null : tout le personnel).
 * Sert au menu (Sidebar) et à la préparation du mode hors ligne.
 */
export const PERMISSION_PAGE_PORTAIL: Record<string, Permission | null> = {
  "/portail": null,
  "/portail/eleves": "eleve:view",
  "/portail/preinscriptions": "inscription:view",
  "/portail/enseignants": "enseignant:view",
  "/portail/classes": "classe:view",
  "/portail/matieres": "classe:view",
  "/portail/cycles": "classe:view",
  "/portail/emploi-du-temps": "classe:view",
  "/portail/affectations": "enseignant:view",
  "/portail/notes": "classe:view",
  "/portail/notes/tableau": "classe:view",
  "/portail/absences": "presence:view",
  "/portail/bulletins": "bulletin:view",
  "/portail/paiements": "paiement:view",
  "/portail/echeances": "paiement:view",
  "/portail/recus": "recu:view",
  "/portail/remises": "paiement:view",
  "/compta": "rapport:financier",
  "/portail/messagerie": null,
  "/portail/annonces": "annonce:view",
  "/portail/ia": "ia:utiliser",
  "/portail/rapports": "rapport:view",
  "/portail/utilisateurs": "utilisateur:view",
  "/portail/audit": "audit:view",
  "/portail/profil": null,
  "/portail/parametres": "parametres:view",
};
