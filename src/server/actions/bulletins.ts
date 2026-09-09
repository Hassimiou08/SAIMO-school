"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireContext, requirePermission } from "@/server/context";
import { audit, AuditAction } from "@/server/logs/audit";
import {
  genererBulletinsClasse,
  validerBulletin,
} from "@/server/services/bulletin.service";
import type { ActionResult } from "./eleves";

import { messageErreur as msg } from "@/server/errors";

/** Notifie par email les parents des élèves dont le bulletin vient d'être publié. */
async function notifierParentsBulletins(bulletinIds: string[], etablissementId: string) {
  if (bulletinIds.length === 0) return;
  try {
    const [{ contactsParentsEleve, envoyerNotifBulletin }, { appUrl }, bulletins] =
      await Promise.all([
        import("@/server/external/email.service"),
        import("@/lib/url"),
        prisma.bulletin.findMany({
          where: { id: { in: bulletinIds } },
          include: { eleve: { select: { prenom: true, nom: true } }, periode: { select: { nom: true } } },
        }),
      ]);
    for (const b of bulletins) {
      const contacts = await contactsParentsEleve(b.eleveId);
      for (const c of contacts) {
        await envoyerNotifBulletin({
          email: c.email,
          prenomParent: c.prenom,
          prenomEleve: b.eleve.prenom,
          nomEleve: b.eleve.nom,
          periode: b.periode.nom,
          lienBulletin: appUrl(`/parent`),
          etablissementId,
        });
      }
    }
  } catch (e) {
    console.error("[email notif bulletin]", e);
  }
}

export async function actionGenererBulletins(
  classeId: string,
  periodeId: string,
): Promise<ActionResult<{ nombre: number }>> {
  try {
    const ctx = await requireContext();
    requirePermission(ctx.role, "bulletin:generer");
    const res = await genererBulletinsClasse(
      classeId,
      periodeId,
      ctx.anneeScolaireId,
      ctx.etablissementId,
      ctx.utilisateurId,
    );
    revalidatePath("/portail/bulletins");
    return { succes: true, data: { nombre: res.length } };
  } catch (e) {
    return { succes: false, erreur: msg(e) };
  }
}

// ─── Appréciations & mention ───────────────────────────────────

export async function actionMajAppreciationsBulletin(
  bulletinId: string,
  data: {
    appreciation?: string | null;
    mention?: string | null; // null / "" => mention automatique
    parMatiere?: {
      matiereId: string;
      appreciation: string | null;
      coefficient?: number;
      moyenne?: number | null;
    }[];
  },
): Promise<ActionResult> {
  try {
    const ctx = await requireContext();
    requirePermission(ctx.role, "bulletin:generer");

    const b = await prisma.bulletin.findFirst({
      where: { id: bulletinId, classe: { etablissementId: ctx.etablissementId } },
      select: { id: true },
    });
    if (!b) return { succes: false, erreur: "Bulletin introuvable" };

    const clean = (v?: string | null) => {
      const t = (v ?? "").trim();
      return t === "" ? null : t.slice(0, 500);
    };

    await prisma.bulletin.update({
      where: { id: bulletinId },
      data: {
        appreciation: clean(data.appreciation),
        mentionHonneur: clean(data.mention),
      },
    });

    for (const m of data.parMatiere ?? []) {
      await prisma.moyenneMatiere.upsert({
        where: { bulletinId_matiereId: { bulletinId, matiereId: m.matiereId } },
        create: {
          bulletinId,
          matiereId: m.matiereId,
          coefficient: m.coefficient ?? 1,
          moyenne: m.moyenne ?? null,
          appreciation: clean(m.appreciation),
        },
        update: { appreciation: clean(m.appreciation) },
      });
    }

    await audit({
      utilisateurId: ctx.utilisateurId,
      etablissementId: ctx.etablissementId,
      action: AuditAction.UPDATE,
      entite: "Bulletin",
      entiteId: bulletinId,
      apres: { appreciation: clean(data.appreciation), mention: clean(data.mention) },
    });

    revalidatePath("/portail/bulletins");
    revalidatePath(`/portail/bulletins/${bulletinId}`);
    return { succes: true, data: undefined };
  } catch (e) {
    return { succes: false, erreur: msg(e) };
  }
}

export async function actionValiderBulletin(bulletinId: string): Promise<ActionResult> {
  try {
    const ctx = await requireContext();
    requirePermission(ctx.role, "bulletin:valider");
    await validerBulletin(bulletinId, ctx.utilisateurId, ctx.etablissementId);
    revalidatePath("/portail/bulletins");
    revalidatePath(`/portail/bulletins/${bulletinId}`);
    return { succes: true, data: undefined };
  } catch (e) {
    return { succes: false, erreur: msg(e) };
  }
}

export async function actionPublierBulletin(bulletinId: string): Promise<ActionResult> {
  try {
    const ctx = await requireContext();
    requirePermission(ctx.role, "bulletin:publier");

    const b = await prisma.bulletin.findFirst({
      where: { id: bulletinId, classe: { etablissementId: ctx.etablissementId } },
    });
    if (!b) return { succes: false, erreur: "Bulletin introuvable" };
    if (b.statut !== "valide") {
      return { succes: false, erreur: "Le bulletin doit d'abord être validé" };
    }

    await prisma.bulletin.update({
      where: { id: bulletinId },
      data: { statut: "publie" },
    });
    await audit({
      utilisateurId: ctx.utilisateurId,
      etablissementId: ctx.etablissementId,
      action: AuditAction.VALIDATE,
      entite: "Bulletin",
      entiteId: bulletinId,
      apres: { statut: "publie" },
    });
    await notifierParentsBulletins([bulletinId], ctx.etablissementId);
    revalidatePath("/portail/bulletins");
    revalidatePath(`/portail/bulletins/${bulletinId}`);
    return { succes: true, data: undefined };
  } catch (e) {
    return { succes: false, erreur: msg(e) };
  }
}

export async function actionPublierBulletinsClasse(
  classeId?: string,
  periodeId?: string,
): Promise<ActionResult<{ nombre: number }>> {
  try {
    const ctx = await requireContext();
    requirePermission(ctx.role, "bulletin:publier");

    const aPublier = await prisma.bulletin.findMany({
      where: {
        anneeScolaireId: ctx.anneeScolaireId,
        statut: "valide",
        classe: { etablissementId: ctx.etablissementId },
        ...(classeId ? { classeId } : {}),
        ...(periodeId ? { periodeId } : {}),
      },
      select: { id: true },
    });
    if (aPublier.length === 0) {
      return { succes: false, erreur: "Aucun bulletin validé à publier." };
    }
    const ids = aPublier.map((b) => b.id);

    await prisma.bulletin.updateMany({
      where: { id: { in: ids } },
      data: { statut: "publie" },
    });
    await audit({
      utilisateurId: ctx.utilisateurId,
      etablissementId: ctx.etablissementId,
      action: AuditAction.VALIDATE,
      entite: "Bulletin",
      apres: { statut: "publie", nombre: ids.length, classeId, periodeId },
    });
    await notifierParentsBulletins(ids, ctx.etablissementId);
    revalidatePath("/portail/bulletins");
    return { succes: true, data: { nombre: ids.length } };
  } catch (e) {
    return { succes: false, erreur: msg(e) };
  }
}
