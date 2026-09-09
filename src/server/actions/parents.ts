"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireContext, requirePermission } from "@/server/context";
import { audit, AuditAction } from "@/server/logs/audit";
import { messageErreur as msg } from "@/server/errors";
import type { ActionResult } from "./eleves";

/**
 * Crée le compte de connexion (rôle PARENT) d'un tuteur déjà enregistré,
 * et lui envoie ses identifiants par e-mail. Un même tuteur avec plusieurs
 * enfants n'a besoin que d'un seul compte : il voit tous ses enfants dans
 * le sélecteur de l'espace parent.
 */
export async function actionCreerAccesParent(
  parentId: string,
  eleveId?: string,
): Promise<ActionResult<{ email: string }>> {
  try {
    const ctx = await requireContext();
    requirePermission(ctx.role, "utilisateur:manage");

    const parent = await prisma.parent.findUnique({ where: { id: parentId } });
    if (!parent) return { succes: false, erreur: "Tuteur introuvable" };
    if (parent.utilisateurId) {
      return { succes: false, erreur: "Ce tuteur a déjà un accès à l'espace parent." };
    }
    if (!parent.email) {
      return {
        succes: false,
        erreur: "Cette fiche tuteur n'a pas d'e-mail. Ajoutez-en un avant de créer l'accès.",
      };
    }

    const email = parent.email.trim().toLowerCase();
    const existant = await prisma.utilisateur.findUnique({ where: { email } });
    if (existant) {
      return {
        succes: false,
        erreur: "Cet e-mail est déjà utilisé par un autre compte.",
      };
    }

    const bcrypt = (await import("bcryptjs")).default;
    const motDePasse = "Bienvenue123!";
    const motDePasseHash = await bcrypt.hash(motDePasse, 10);

    await prisma.$transaction(async (tx) => {
      const u = await tx.utilisateur.create({
        data: {
          email,
          prenom: parent.prenom,
          nom: parent.nom,
          telephone: parent.telephone,
          motDePasseHash,
          etablissements: {
            create: { etablissementId: ctx.etablissementId, role: "PARENT" },
          },
        },
      });
      await tx.parent.update({ where: { id: parentId }, data: { utilisateurId: u.id } });
    });

    try {
      const [etab, { envoyerIdentifiantsCompte }, { appUrl }] = await Promise.all([
        prisma.etablissement.findUnique({
          where: { id: ctx.etablissementId },
          select: { nom: true },
        }),
        import("@/server/external/email.service"),
        import("@/lib/url"),
      ]);
      await envoyerIdentifiantsCompte({
        email,
        prenom: parent.prenom,
        motDePasse,
        roleLibelle: "Parent",
        etablissementNom: etab?.nom ?? "SAIMO Ecole",
        lienConnexion: appUrl("/connexion"),
        etablissementId: ctx.etablissementId,
      });
    } catch (e) {
      console.error("[email identifiants parent]", e);
    }

    await audit({
      utilisateurId: ctx.utilisateurId,
      etablissementId: ctx.etablissementId,
      action: AuditAction.CREATE,
      entite: "Utilisateur",
      apres: { email, role: "PARENT", parentId },
    });

    if (eleveId) revalidatePath(`/portail/eleves/${eleveId}`);
    revalidatePath("/portail/utilisateurs");
    return { succes: true, data: { email } };
  } catch (e) {
    return { succes: false, erreur: msg(e) };
  }
}
