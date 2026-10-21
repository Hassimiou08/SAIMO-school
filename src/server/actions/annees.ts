"use server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireContext, requirePermission } from "@/server/context";
import { messageErreur as msg } from "@/server/errors";
import {
  activerAnneeScolaire,
  creerAnneeScolaire,
  reinscrireEleves,
} from "@/server/services/annee.service";
import type { ActionResult } from "./eleves";

const schemaAnnee = z.object({
  libelle: z.string().trim().regex(/^\d{4}-\d{4}$/, "Libellé attendu au format 2026-2027"),
  dateDebut: z.coerce.date({ error: "Date de début invalide" }),
  dateFin: z.coerce.date({ error: "Date de fin invalide" }),
});

/** Crée une année scolaire (inactive), en reprenant si demandé les classes de l'année active. */
export async function actionCreerAnneeScolaire(
  formData: FormData,
): Promise<ActionResult<{ classes: number; affectations: number }>> {
  try {
    const ctx = await requireContext();
    requirePermission(ctx.role, "parametres:manage");
    const p = schemaAnnee.safeParse({
      libelle: formData.get("libelle"),
      dateDebut: formData.get("dateDebut"),
      dateFin: formData.get("dateFin"),
    });
    if (!p.success) return { succes: false, erreur: p.error.issues[0]?.message ?? "Données invalides" };

    const r = await creerAnneeScolaire({
      etablissementId: ctx.etablissementId,
      ...p.data,
      sourceAnneeId: formData.get("reprendreClasses") === "on" ? ctx.anneeScolaireId : undefined,
      reprendreAffectations: formData.get("reprendreAffectations") === "on",
      utilisateurId: ctx.utilisateurId,
    });
    revalidatePath("/portail/parametres");
    return { succes: true, data: { classes: r.classes, affectations: r.affectations } };
  } catch (e) {
    return { succes: false, erreur: msg(e) };
  }
}

/** Bascule l'établissement sur une autre année scolaire. */
export async function actionActiverAnneeScolaire(anneeId: string): Promise<ActionResult> {
  try {
    const ctx = await requireContext();
    requirePermission(ctx.role, "parametres:manage");
    await activerAnneeScolaire({ etablissementId: ctx.etablissementId, anneeId, utilisateurId: ctx.utilisateurId });
    revalidatePath("/portail", "layout");
    revalidatePath("/compta", "layout");
    return { succes: true, data: undefined };
  } catch (e) {
    return { succes: false, erreur: msg(e) };
  }
}

/** Réinscrit des élèves d'une année précédente dans une classe de l'année active. */
export async function actionReinscrireEleves(
  classeId: string,
  eleveIds: string[],
): Promise<ActionResult<{ reinscrits: number; dejaInscrits: number }>> {
  try {
    const ctx = await requireContext();
    requirePermission(ctx.role, "inscription:create");
    if (!classeId) return { succes: false, erreur: "Choisissez la classe de destination." };
    if (eleveIds.length === 0) return { succes: false, erreur: "Sélectionnez au moins un élève." };

    const r = await reinscrireEleves({
      etablissementId: ctx.etablissementId,
      anneeScolaireId: ctx.anneeScolaireId,
      classeId,
      eleveIds,
      inscritParId: ctx.utilisateurId,
    });
    revalidatePath("/portail/reinscriptions");
    revalidatePath("/portail/eleves");
    return { succes: true, data: r };
  } catch (e) {
    return { succes: false, erreur: msg(e) };
  }
}
