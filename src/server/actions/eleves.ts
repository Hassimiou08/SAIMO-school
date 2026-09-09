"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireContext, requirePermission } from "@/server/context";
import {
  creerNouvelEleve,
  inscrireEleveComplet,
  reinscription,
  archiverUnEleve,
} from "@/server/services/eleve.service";
import { mettreAJourEleve } from "@/server/repositories/eleve.repo";
import { messageErreur } from "@/server/errors";

export type ActionResult<T = void> =
  | { succes: true; data: T }
  | { succes: false; erreur: string };

const optionnel = (v: FormDataEntryValue | null) => {
  const s = typeof v === "string" ? v.trim() : "";
  return s === "" ? undefined : s;
};

// ─── Créer un élève (+ inscription) ───────────────────────────

const schemaCreerEleve = z.object({
  prenom: z.string().min(1, "Le prénom est requis").max(100),
  nom: z.string().min(1, "Le nom est requis").max(100),
  dateNaissance: z
    .string()
    .optional()
    .transform((v) => (v ? new Date(v) : undefined)),
  lieuNaissance: z.string().max(120).optional(),
  sexe: z.enum(["M", "F"]).optional(),
  nationalite: z.string().max(60).optional(),
  adresse: z.string().max(200).optional(),
  classeId: z.string().min(1, "La classe est requise"),
});

export async function actionCreerEleve(
  formData: FormData,
): Promise<ActionResult<{ eleveId: string; matricule: string }>> {
  try {
    const ctx = await requireContext();
    requirePermission(ctx.role, "eleve:create");

    const parsed = schemaCreerEleve.safeParse({
      prenom: formData.get("prenom"),
      nom: formData.get("nom"),
      dateNaissance: optionnel(formData.get("dateNaissance")),
      lieuNaissance: optionnel(formData.get("lieuNaissance")),
      sexe: optionnel(formData.get("sexe")),
      nationalite: optionnel(formData.get("nationalite")),
      adresse: optionnel(formData.get("adresse")),
      classeId: formData.get("classeId"),
    });
    if (!parsed.success) {
      return { succes: false, erreur: parsed.error.issues[0]?.message ?? "Données invalides" };
    }

    const { eleve } = await creerNouvelEleve({
      ...parsed.data,
      etablissementId: ctx.etablissementId,
      anneeScolaireId: ctx.anneeScolaireId,
      inscritParId: ctx.utilisateurId,
    });

    revalidatePath("/portail/eleves");
    return { succes: true, data: { eleveId: eleve.id, matricule: eleve.matricule } };
  } catch (error) {
    return { succes: false, erreur: messageErreur(error) };
  }
}

// ─── Inscription complète (élève + tuteur + frais) ──────────

const schemaInscriptionComplete = schemaCreerEleve.extend({
  tuteurPrenom: z.string().max(80).optional(),
  tuteurNom: z.string().max(80).optional(),
  tuteurTelephone: z.string().max(30).optional(),
  tuteurEmail: z.string().email().optional().or(z.literal("")).transform((v) => v || undefined),
  tuteurLien: z.enum(["pere", "mere", "tuteur", "autre"]).optional(),
});

export async function actionInscrireEleveComplet(
  formData: FormData,
): Promise<
  ActionResult<{
    eleveId: string;
    matricule: string;
    frais: { id: string; libelle: string; montantDu: number }[];
  }>
> {
  try {
    const ctx = await requireContext();
    requirePermission(ctx.role, "eleve:create");
    requirePermission(ctx.role, "inscription:create");

    const parsed = schemaInscriptionComplete.safeParse({
      prenom: formData.get("prenom"),
      nom: formData.get("nom"),
      dateNaissance: optionnel(formData.get("dateNaissance")),
      lieuNaissance: optionnel(formData.get("lieuNaissance")),
      sexe: optionnel(formData.get("sexe")),
      nationalite: optionnel(formData.get("nationalite")),
      adresse: optionnel(formData.get("adresse")),
      classeId: formData.get("classeId"),
      tuteurPrenom: optionnel(formData.get("tuteurPrenom")),
      tuteurNom: optionnel(formData.get("tuteurNom")),
      tuteurTelephone: optionnel(formData.get("tuteurTelephone")),
      tuteurEmail: (formData.get("tuteurEmail") as string) ?? "",
      tuteurLien: optionnel(formData.get("tuteurLien")),
    });
    if (!parsed.success) {
      return { succes: false, erreur: parsed.error.issues[0]?.message ?? "Données invalides" };
    }

    const { eleve, frais } = await inscrireEleveComplet({
      ...parsed.data,
      etablissementId: ctx.etablissementId,
      anneeScolaireId: ctx.anneeScolaireId,
      inscritParId: ctx.utilisateurId,
    });

    revalidatePath("/portail/eleves");
    revalidatePath("/portail/paiements");
    return {
      succes: true,
      data: { eleveId: eleve.id, matricule: eleve.matricule, frais },
    };
  } catch (error) {
    return { succes: false, erreur: messageErreur(error) };
  }
}

// ─── Modifier la fiche d'un élève ────────────────────────────

const schemaModifierEleve = z.object({
  prenom: z.string().min(1).max(100),
  nom: z.string().min(1).max(100),
  dateNaissance: z
    .string()
    .optional()
    .transform((v) => (v ? new Date(v) : undefined)),
  lieuNaissance: z.string().max(120).optional(),
  sexe: z.enum(["M", "F"]).optional(),
  nationalite: z.string().max(60).optional(),
  adresse: z.string().max(200).optional(),
});

export async function actionModifierEleve(
  eleveId: string,
  formData: FormData,
): Promise<ActionResult> {
  try {
    const ctx = await requireContext();
    requirePermission(ctx.role, "eleve:update");

    const parsed = schemaModifierEleve.safeParse({
      prenom: formData.get("prenom"),
      nom: formData.get("nom"),
      dateNaissance: optionnel(formData.get("dateNaissance")),
      lieuNaissance: optionnel(formData.get("lieuNaissance")),
      sexe: optionnel(formData.get("sexe")),
      nationalite: optionnel(formData.get("nationalite")),
      adresse: optionnel(formData.get("adresse")),
    });
    if (!parsed.success) {
      return { succes: false, erreur: parsed.error.issues[0]?.message ?? "Données invalides" };
    }

    await mettreAJourEleve(eleveId, ctx.etablissementId, parsed.data);

    revalidatePath("/portail/eleves");
    revalidatePath(`/portail/eleves/${eleveId}`);
    return { succes: true, data: undefined };
  } catch (error) {
    return { succes: false, erreur: messageErreur(error) };
  }
}

// ─── Réinscription ───────────────────────────────────────────

const schemaReinscription = z.object({
  eleveId: z.string().min(1),
  classeId: z.string().min(1),
});

export async function actionReinscription(
  formData: FormData,
): Promise<ActionResult<{ inscriptionId: string }>> {
  try {
    const ctx = await requireContext();
    requirePermission(ctx.role, "inscription:create");

    const parsed = schemaReinscription.safeParse({
      eleveId: formData.get("eleveId"),
      classeId: formData.get("classeId"),
    });
    if (!parsed.success) {
      return { succes: false, erreur: parsed.error.issues[0]?.message ?? "Données invalides" };
    }

    const inscription = await reinscription({
      ...parsed.data,
      etablissementId: ctx.etablissementId,
      anneeScolaireId: ctx.anneeScolaireId,
      inscritParId: ctx.utilisateurId,
    });

    revalidatePath("/portail/eleves");
    return { succes: true, data: { inscriptionId: inscription.id } };
  } catch (error) {
    return { succes: false, erreur: messageErreur(error) };
  }
}

// ─── Archiver (suppression logique) ─────────────────────────

export async function actionArchiverEleve(eleveId: string): Promise<ActionResult> {
  try {
    const ctx = await requireContext();
    requirePermission(ctx.role, "eleve:archive");

    await archiverUnEleve(eleveId, ctx.etablissementId, ctx.utilisateurId);

    revalidatePath("/portail/eleves");
    return { succes: true, data: undefined };
  } catch (error) {
    return { succes: false, erreur: messageErreur(error) };
  }
}
