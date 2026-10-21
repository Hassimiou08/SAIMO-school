"use server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireContext, requirePermission } from "@/server/context";
import { audit, AuditAction } from "@/server/logs/audit";
import { messageErreur as msg } from "@/server/errors";
import { CLE_SITE, CLE_SLUG, siteEcoleSchema } from "@/lib/site-ecole";
import type { ActionResult } from "./eleves";

/** Enregistre le contenu du site public de l'établissement courant. */
export async function actionMajSiteEcole(contenu: unknown): Promise<ActionResult<{ slug: string }>> {
  try {
    const ctx = await requireContext();
    requirePermission(ctx.role, "parametres:manage");

    const parsed = siteEcoleSchema.safeParse(contenu);
    if (!parsed.success) {
      return { succes: false, erreur: parsed.error.issues[0]?.message ?? "Contenu invalide" };
    }
    const site = parsed.data;

    const pris = await prisma.parametre.findFirst({
      where: { cle: CLE_SLUG, valeur: site.slug, NOT: { etablissementId: ctx.etablissementId } },
      select: { id: true },
    });
    if (pris) {
      return { succes: false, erreur: `L'adresse « ${site.slug} » est déjà utilisée par une autre école.` };
    }

    const ancienSlug = await prisma.parametre.findUnique({
      where: { etablissementId_cle: { etablissementId: ctx.etablissementId, cle: CLE_SLUG } },
      select: { valeur: true },
    });

    const cle = (c: string) => ({ etablissementId_cle: { etablissementId: ctx.etablissementId, cle: c } });
    await prisma.$transaction([
      prisma.parametre.upsert({
        where: cle(CLE_SITE),
        create: { etablissementId: ctx.etablissementId, cle: CLE_SITE, valeur: JSON.stringify(site), description: "Contenu du site public" },
        update: { valeur: JSON.stringify(site) },
      }),
      prisma.parametre.upsert({
        where: cle(CLE_SLUG),
        create: { etablissementId: ctx.etablissementId, cle: CLE_SLUG, valeur: site.slug, description: "Adresse du site public" },
        update: { valeur: site.slug },
      }),
    ]);

    await audit({
      utilisateurId: ctx.utilisateurId,
      etablissementId: ctx.etablissementId,
      action: AuditAction.UPDATE,
      entite: "SitePublic",
      entiteId: ctx.etablissementId,
      metadata: { slug: site.slug, publie: site.publie },
    });

    revalidatePath(`/ecoles/${site.slug}`, "layout");
    if (ancienSlug && ancienSlug.valeur !== site.slug) revalidatePath(`/ecoles/${ancienSlug.valeur}`, "layout");
    revalidatePath("/portail/parametres/site-public");
    return { succes: true, data: { slug: site.slug } };
  } catch (e) {
    return { succes: false, erreur: msg(e) };
  }
}
