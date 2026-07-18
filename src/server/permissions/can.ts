import { prisma } from "@/lib/prisma";
import { peutFaire, type Permission } from "./roles";
import type { RoleUtilisateur } from "@prisma/client";

export interface SessionUtilisateur {
  utilisateurId: string;
  etablissementId: string;
  role: RoleUtilisateur;
}

/**
 * Erreur levée lorsqu'un utilisateur tente une action non autorisée.
 */
export class NonAutorise extends Error {
  constructor(message = "Accès non autorisé") {
    super(message);
    this.name = "NonAutorise";
  }
}

/**
 * Vérifie la permission et lève NonAutorise si elle est refusée.
 */
export function exigerPermission(
  session: SessionUtilisateur,
  permission: Permission
): void {
  if (!peutFaire(session.role, permission)) {
    throw new NonAutorise(
      `Le rôle ${session.role} ne dispose pas de la permission "${permission}"`
    );
  }
}

/**
 * Vérifie que l'utilisateur appartient bien à l'établissement demandé.
 * RM-16 : Un établissement ne peut consulter les données d'un autre.
 */
export async function exigerAppartenance(
  utilisateurId: string,
  etablissementId: string
): Promise<SessionUtilisateur> {
  const lien = await prisma.utilisateurEtablissement.findFirst({
    where: {
      utilisateurId,
      etablissementId,
      actif: true,
    },
  });

  if (!lien) {
    throw new NonAutorise(
      "Vous n'avez pas accès à cet établissement"
    );
  }

  return {
    utilisateurId,
    etablissementId,
    role: lien.role,
  };
}

/**
 * Vérifie appartenance ET permission en une seule étape.
 */
export async function autoriser(
  utilisateurId: string,
  etablissementId: string,
  permission: Permission
): Promise<SessionUtilisateur> {
  const session = await exigerAppartenance(utilisateurId, etablissementId);
  exigerPermission(session, permission);
  return session;
}
