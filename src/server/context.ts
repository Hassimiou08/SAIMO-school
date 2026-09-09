import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";
import type { RoleUtilisateur } from "@prisma/client";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { homeForRole } from "@/auth.config";
import { peutFaire, type Permission } from "@/server/permissions/roles";
import { NonAutorise } from "@/server/permissions/can";

export interface SessionContext {
  utilisateurId: string;
  role: RoleUtilisateur;
  etablissementId: string;
  anneeScolaireId: string;
}

/** Session courante, mémoïsée pour la durée de la requête. */
export const getSession = cache(async () => auth());

/**
 * Utilisateur authentifié rattaché à un établissement actif.
 * Redirige vers /connexion sinon.
 */
export const requireUser = cache(async () => {
  const session = await getSession();
  if (!session?.user?.id) redirect("/connexion");

  const { id, role, etablissementId } = session.user;
  if (!role || !etablissementId) {
    // Compte sans rattachement établissement actif : rien à afficher.
    redirect("/connexion?erreur=compte-incomplet");
  }

  return { utilisateurId: id, role, etablissementId };
});

/** Année scolaire active de l'établissement (mémoïsée). */
export const getAnneeScolaireActive = cache(async (etablissementId: string) => {
  const annee = await prisma.anneeScolaire.findFirst({
    where: { etablissementId, active: true },
    orderBy: { dateDebut: "desc" },
  });
  return annee;
});

/**
 * Contexte standard consommé par la couche DAL et les pages :
 * utilisateur + établissement + année scolaire active.
 */
export const requireContext = cache(async (): Promise<SessionContext> => {
  const { utilisateurId, role, etablissementId } = await requireUser();
  const annee = await getAnneeScolaireActive(etablissementId);
  if (!annee) {
    throw new Error(
      "Aucune année scolaire active n'est configurée pour cet établissement.",
    );
  }
  return { utilisateurId, role, etablissementId, anneeScolaireId: annee.id };
});

/** Vue sérialisable de l'utilisateur connecté, pour le chrome (Topbar/Sidebar). */
export const getCurrentUserView = cache(async () => {
  const { utilisateurId, role, etablissementId } = await requireUser();
  const [u, e] = await Promise.all([
    prisma.utilisateur.findUnique({
      where: { id: utilisateurId },
      select: { prenom: true, nom: true, email: true, photo: true },
    }),
    prisma.etablissement.findUnique({
      where: { id: etablissementId },
      select: { nom: true },
    }),
  ]);
  return {
    id: utilisateurId,
    name: u ? `${u.prenom} ${u.nom}` : "Utilisateur",
    email: u?.email ?? "",
    photo: u?.photo ?? null,
    role,
    etablissementNom: e?.nom ?? null,
  };
});

/** Lève NonAutorise si le rôle ne dispose pas de la permission. */
export function requirePermission(role: RoleUtilisateur, permission: Permission): void {
  if (!peutFaire(role, permission)) {
    throw new NonAutorise(
      `Le rôle ${role} ne dispose pas de la permission « ${permission} ».`,
    );
  }
}

export { homeForRole };
