"use server";

import { prisma } from "@/lib/prisma";
import { autoriser } from "@/server/permissions/can";
import {
  creerNouvelEleve,
  reinscription,
  archiverUnEleve,
  type CreerEleveInput,
} from "@/server/services/eleve.service";
import { trouverEleves, type FiltresEleve } from "@/server/repositories/eleve.repo";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// ─── Validation Zod ───────────────────────────────────────────

const schemaCreerEleve = z.object({
  utilisateurId: z.string().min(1),
  etablissementId: z.string().min(1),
  prenom: z.string().min(1, "Le prénom est requis").max(100),
  nom: z.string().min(1, "Le nom est requis").max(100),
  dateNaissance: z.string().optional().transform((v) => v ? new Date(v) : undefined),
  lieuNaissance: z.string().optional(),
  sexe: z.enum(["M", "F"]).optional(),
  nationalite: z.string().optional(),
  adresse: z.string().optional(),
  anneeScolaireId: z.string().min(1, "L'année scolaire est requise"),
  classeId: z.string().min(1, "La classe est requise"),
});

const schemaReinscription = z.object({
  utilisateurId: z.string().min(1),
  etablissementId: z.string().min(1),
  eleveId: z.string().min(1),
  anneeScolaireId: z.string().min(1),
  classeId: z.string().min(1),
});

export type ActionResult<T = void> =
  | { succes: true; data: T }
  | { succes: false; erreur: string };

// ─── Action : Créer un élève ──────────────────────────────────

export async function actionCreerEleve(
  formData: FormData
): Promise<ActionResult<{ eleveId: string; matricule: string }>> {
  try {
    const parsed = schemaCreerEleve.safeParse(Object.fromEntries(formData));
    if (!parsed.success) {
      return { succes: false, erreur: parsed.error.errors[0].message };
    }

    const { utilisateurId, etablissementId, ...donnees } = parsed.data;

    // Vérifier permission
    await autoriser(utilisateurId, etablissementId, "eleve:create");

    const { eleve } = await creerNouvelEleve({
      etablissementId,
      inscritParId: utilisateurId,
      ...donnees,
    } as CreerEleveInput);

    revalidatePath("/eleves");
    return { succes: true, data: { eleveId: eleve.id, matricule: eleve.matricule } };
  } catch (error) {
    return {
      succes: false,
      erreur: error instanceof Error ? error.message : "Erreur inattendue",
    };
  }
}

// ─── Action : Lister les élèves ───────────────────────────────

export async function actionListerEleves(
  filtres: FiltresEleve & { utilisateurId: string }
): Promise<ActionResult<Awaited<ReturnType<typeof trouverEleves>>>> {
  try {
    const { utilisateurId, ...restFiltres } = filtres;
    await autoriser(utilisateurId, filtres.etablissementId, "eleve:view");
    const resultat = await trouverEleves(restFiltres);
    return { succes: true, data: resultat };
  } catch (error) {
    return {
      succes: false,
      erreur: error instanceof Error ? error.message : "Erreur inattendue",
    };
  }
}

// ─── Action : Réinscrire un élève ────────────────────────────

export async function actionReinscription(
  formData: FormData
): Promise<ActionResult<{ inscriptionId: string }>> {
  try {
    const parsed = schemaReinscription.safeParse(Object.fromEntries(formData));
    if (!parsed.success) {
      return { succes: false, erreur: parsed.error.errors[0].message };
    }

    const { utilisateurId, etablissementId, ...data } = parsed.data;
    await autoriser(utilisateurId, etablissementId, "inscription:create");

    const inscription = await reinscription({
      ...data,
      etablissementId,
      inscritParId: utilisateurId,
    });

    revalidatePath("/eleves");
    return { succes: true, data: { inscriptionId: inscription.id } };
  } catch (error) {
    return {
      succes: false,
      erreur: error instanceof Error ? error.message : "Erreur inattendue",
    };
  }
}

// ─── Action : Archiver un élève ───────────────────────────────

export async function actionArchiverEleve(
  utilisateurId: string,
  eleveId: string,
  etablissementId: string
): Promise<ActionResult> {
  try {
    await autoriser(utilisateurId, etablissementId, "eleve:archive");
    await archiverUnEleve(eleveId, etablissementId, utilisateurId);
    revalidatePath("/eleves");
    return { succes: true, data: undefined };
  } catch (error) {
    return {
      succes: false,
      erreur: error instanceof Error ? error.message : "Erreur inattendue",
    };
  }
}
