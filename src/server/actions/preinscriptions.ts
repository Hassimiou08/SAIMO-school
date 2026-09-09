"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireContext, requirePermission } from "@/server/context";
import { convertirPreInscription } from "@/server/services/inscription.service";
import type { ActionResult } from "./eleves";

import { messageErreur as msg } from "@/server/errors";

const STATUTS = ["nouvelle", "contactee", "acceptee", "refusee"] as const;

export async function actionMarquerPreInscription(
  id: string,
  statut: (typeof STATUTS)[number],
): Promise<ActionResult> {
  try {
    const ctx = await requireContext();
    requirePermission(ctx.role, "inscription:update");
    if (!STATUTS.includes(statut)) return { succes: false, erreur: "Statut invalide" };

    const pre = await prisma.preInscription.findFirst({
      where: { id, etablissementId: ctx.etablissementId },
    });
    if (!pre) return { succes: false, erreur: "Pré-inscription introuvable" };
    if (pre.statut === "convertie") return { succes: false, erreur: "Déjà convertie" };

    await prisma.preInscription.update({
      where: { id },
      data: { statut, traiteeParId: ctx.utilisateurId },
    });
    revalidatePath("/portail/preinscriptions");
    return { succes: true, data: undefined };
  } catch (e) {
    return { succes: false, erreur: msg(e) };
  }
}

export async function actionConvertirPreInscription(
  id: string,
  classeId: string,
): Promise<ActionResult<{ eleveId: string; matricule: string }>> {
  try {
    const ctx = await requireContext();
    requirePermission(ctx.role, "inscription:create");
    if (!classeId) return { succes: false, erreur: "Choisissez une classe" };

    const classe = await prisma.classe.findFirst({
      where: { id: classeId, etablissementId: ctx.etablissementId },
    });
    if (!classe) return { succes: false, erreur: "Classe invalide" };

    const { eleve } = await convertirPreInscription({
      preInscriptionId: id,
      classeId,
      etablissementId: ctx.etablissementId,
      valideParId: ctx.utilisateurId,
    });

    revalidatePath("/portail/preinscriptions");
    revalidatePath("/portail/eleves");
    return { succes: true, data: { eleveId: eleve.id, matricule: eleve.matricule } };
  } catch (e) {
    return { succes: false, erreur: msg(e) };
  }
}
