"use server";

import { autoriser } from "@/server/permissions/can";
import { genererBulletinsClasse, validerBulletin } from "@/server/services/bulletin.service";
import { revalidatePath } from "next/cache";
import type { ActionResult } from "./eleves";

// ─── Action : Générer bulletins de la classe ─────────────────

export async function actionGenererBulletins(
  utilisateurId: string,
  etablissementId: string,
  classeId: string,
  periodeId: string,
  anneeScolaireId: string
): Promise<ActionResult> {
  try {
    await autoriser(utilisateurId, etablissementId, "bulletin:generer");
    await genererBulletinsClasse(classeId, periodeId, anneeScolaireId, etablissementId, utilisateurId);
    
    revalidatePath("/bulletins");
    return { succes: true, data: undefined };
  } catch (error) {
    return {
      succes: false,
      erreur: error instanceof Error ? error.message : "Erreur inattendue",
    };
  }
}

// ─── Action : Valider un bulletin ────────────────────────────

export async function actionValiderBulletin(
  utilisateurId: string,
  etablissementId: string,
  bulletinId: string
): Promise<ActionResult> {
  try {
    await autoriser(utilisateurId, etablissementId, "bulletin:valider");
    await validerBulletin(bulletinId, utilisateurId, etablissementId);
    
    revalidatePath("/bulletins");
    return { succes: true, data: undefined };
  } catch (error) {
    return {
      succes: false,
      erreur: error instanceof Error ? error.message : "Erreur inattendue",
    };
  }
}
