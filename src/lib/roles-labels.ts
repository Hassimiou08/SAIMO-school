import type { RoleUtilisateur } from "@prisma/client";

const ROLE_LABELS: Record<RoleUtilisateur, string> = {
  SUPER_ADMIN_SAIMO: "Super Admin",
  ADMIN_ETABLISSEMENT: "Administrateur",
  DIRECTEUR: "Direction",
  SECRETAIRE: "Secrétariat",
  COMPTABLE: "Comptabilité",
  ENSEIGNANT: "Enseignant",
  PROF_PRINCIPAL: "Professeur principal",
  PARENT: "Parent",
  ELEVE: "Élève",
};

export function libelleRole(role: RoleUtilisateur): string {
  return ROLE_LABELS[role] ?? role;
}

export function initiales(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}
