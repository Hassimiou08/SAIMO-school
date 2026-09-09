import { RoleUtilisateur } from "@prisma/client";

// ─── Définition des permissions ────────────────────────────────

export type Permission =
  // Établissements
  | "etablissement:create"
  | "etablissement:update"
  | "etablissement:suspend"
  // Utilisateurs
  | "utilisateur:invite"
  | "utilisateur:manage"
  | "utilisateur:view"
  // Élèves
  | "eleve:create"
  | "eleve:update"
  | "eleve:view"
  | "eleve:archive"
  // Inscriptions
  | "inscription:create"
  | "inscription:update"
  | "inscription:view"
  // Classes & Matières
  | "classe:manage"
  | "classe:view"
  | "matiere:manage"
  // Enseignants
  | "enseignant:manage"
  | "enseignant:view"
  // Évaluations & Notes
  | "evaluation:create"
  | "evaluation:update"
  | "evaluation:validate"
  | "note:saisir"
  | "note:valider"
  | "note:corriger" // correction après verrouillage (droit spécial)
  // Bulletins
  | "bulletin:generer"
  | "bulletin:valider"
  | "bulletin:publier"
  | "bulletin:view"
  // Présences
  | "presence:saisir"
  | "presence:view"
  | "presence:justifier"
  // Finance
  | "frais:configure"
  | "paiement:enregistrer"
  | "paiement:annuler"
  | "paiement:view"
  | "recu:generer"
  | "rapport:financier"
  | "depense:gerer"
  | "salaire:gerer"
  // Rapports & Tableaux de bord
  | "rapport:view"
  | "rapport:export"
  // Communication
  | "email:envoyer"
  | "annonce:create"
  | "annonce:view"
  // IA
  | "ia:utiliser"
  | "ia:valider"
  // Audit
  | "audit:view"
  // Paramètres
  | "parametres:manage";

// ─── Matrice des permissions par rôle ──────────────────────────

const permissionsParRole: Record<RoleUtilisateur, Permission[]> = {
  SUPER_ADMIN_SAIMO: [
    "etablissement:create",
    "etablissement:update",
    "etablissement:suspend",
    "utilisateur:invite",
    "utilisateur:manage",
    "utilisateur:view",
    "rapport:view",
    "rapport:export",
    "audit:view",
  ],

  ADMIN_ETABLISSEMENT: [
    "utilisateur:invite",
    "utilisateur:manage",
    "utilisateur:view",
    "eleve:create",
    "eleve:update",
    "eleve:view",
    "eleve:archive",
    "inscription:create",
    "inscription:update",
    "inscription:view",
    "classe:manage",
    "classe:view",
    "matiere:manage",
    "enseignant:manage",
    "enseignant:view",
    "evaluation:create",
    "evaluation:update",
    "evaluation:validate",
    "note:saisir",
    "note:valider",
    "note:corriger",
    "bulletin:generer",
    "bulletin:valider",
    "bulletin:publier",
    "bulletin:view",
    "presence:saisir",
    "presence:view",
    "presence:justifier",
    "frais:configure",
    "paiement:enregistrer",
    "paiement:annuler",
    "paiement:view",
    "recu:generer",
    "rapport:financier",
    "depense:gerer",
    "salaire:gerer",
    "rapport:view",
    "rapport:export",
    "email:envoyer",
    "annonce:create",
    "annonce:view",
    "ia:utiliser",
    "ia:valider",
    "audit:view",
    "parametres:manage",
  ],

  DIRECTEUR: [
    "utilisateur:view",
    "eleve:view",
    "inscription:view",
    "classe:view",
    "enseignant:view",
    "evaluation:validate",
    "note:saisir",
    "note:valider",
    "note:corriger",
    "bulletin:valider",
    "bulletin:publier",
    "bulletin:view",
    "presence:saisir",
    "presence:view",
    "presence:justifier",
    "paiement:view",
    "rapport:financier",
    "depense:gerer",
    "salaire:gerer",
    "rapport:view",
    "rapport:export",
    "email:envoyer",
    "annonce:create",
    "annonce:view",
    "ia:utiliser",
    "ia:valider",
    "audit:view",
  ],

  SECRETAIRE: [
    "eleve:create",
    "eleve:update",
    "eleve:view",
    "eleve:archive",
    "inscription:create",
    "inscription:update",
    "inscription:view",
    "classe:view",
    "enseignant:view",
    "bulletin:view",
    "presence:view",
    "paiement:view",
    "rapport:view",
    "annonce:view",
  ],

  COMPTABLE: [
    "eleve:view",
    "inscription:view",
    "frais:configure",
    "paiement:enregistrer",
    "paiement:annuler",
    "paiement:view",
    "recu:generer",
    "rapport:financier",
    "depense:gerer",
    "salaire:gerer",
    "rapport:view",
    "rapport:export",
    "email:envoyer",
    "annonce:create",
    "annonce:view",
  ],

  ENSEIGNANT: [
    "eleve:view",
    "classe:view",
    "evaluation:create",
    "evaluation:update",
    "note:saisir",
    "bulletin:view",
    "presence:saisir",
    "presence:view",
    "annonce:view",
    "ia:utiliser",
  ],

  PROF_PRINCIPAL: [
    "eleve:view",
    "classe:view",
    "evaluation:create",
    "evaluation:update",
    "note:saisir",
    "bulletin:generer",
    "bulletin:view",
    "presence:saisir",
    "presence:view",
    "annonce:view",
    "ia:utiliser",
  ],

  PARENT: [
    "bulletin:view",
    "presence:view",
    "paiement:view",
    "annonce:view",
  ],

  ELEVE: [
    "bulletin:view",
    "presence:view",
    "annonce:view",
  ],
};

// ─── Fonctions utilitaires ──────────────────────────────────────

/**
 * Vérifie si un rôle possède une permission donnée.
 */
export function peutFaire(
  role: RoleUtilisateur,
  permission: Permission
): boolean {
  return permissionsParRole[role]?.includes(permission) ?? false;
}

/**
 * Vérifie plusieurs permissions (toutes requises).
 */
export function peutFaireTout(
  role: RoleUtilisateur,
  permissions: Permission[]
): boolean {
  return permissions.every((p) => peutFaire(role, p));
}

/**
 * Vérifie au moins une permission.
 */
export function peutFaireUn(
  role: RoleUtilisateur,
  permissions: Permission[]
): boolean {
  return permissions.some((p) => peutFaire(role, p));
}

/**
 * Retourne toutes les permissions d'un rôle.
 */
export function permissionsDeRole(role: RoleUtilisateur): Permission[] {
  return permissionsParRole[role] ?? [];
}
