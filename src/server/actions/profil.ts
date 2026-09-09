"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireContext } from "@/server/context";
import { audit, AuditAction } from "@/server/logs/audit";
import type { ActionResult } from "./eleves";

import { messageErreur as msg } from "@/server/errors";

const s = (v: FormDataEntryValue | null) => {
  const t = typeof v === "string" ? v.trim() : "";
  return t === "" ? undefined : t;
};

// ─── Informations personnelles ──────────────────────────────

// Photo : soit une URL http(s), soit une image encodée en data URI (upload fichier).
const PHOTO_MAX = 900_000; // ~900 Ko encodés (image redimensionnée côté client)
const photoSchema = z
  .string()
  .max(PHOTO_MAX, "Image trop lourde (redimensionnez-la)")
  .refine(
    (v) => /^https?:\/\//.test(v) || /^data:image\/(png|jpe?g|webp|gif);base64,/.test(v),
    "Format d'image non pris en charge",
  )
  .optional();

const SIGNATURE_MAX = 400_000; // ~400 Ko (petit PNG transparent)
const signatureSchema = z
  .string()
  .max(SIGNATURE_MAX, "Signature trop lourde")
  .refine(
    (v) => /^data:image\/png;base64,/.test(v),
    "La signature doit être une image PNG",
  )
  .optional();

const schemaProfil = z.object({
  prenom: z.string().min(1, "Prénom requis").max(80),
  nom: z.string().min(1, "Nom requis").max(80),
  email: z.string().email("E-mail invalide").max(160),
  telephone: z.string().max(30).optional(),
  photo: photoSchema,
  signature: signatureSchema,
});

export async function actionMajProfil(formData: FormData): Promise<ActionResult> {
  try {
    const ctx = await requireContext();

    const parsed = schemaProfil.safeParse({
      prenom: formData.get("prenom"),
      nom: formData.get("nom"),
      email: formData.get("email"),
      telephone: s(formData.get("telephone")),
      photo: s(formData.get("photo")),
      signature: s(formData.get("signature")),
    });
    if (!parsed.success) {
      return { succes: false, erreur: parsed.error.issues[0]?.message ?? "Données invalides" };
    }

    const email = parsed.data.email.trim().toLowerCase();

    // Unicité de l'e-mail (sur un autre compte).
    const conflit = await prisma.utilisateur.findFirst({
      where: { email, id: { not: ctx.utilisateurId } },
      select: { id: true },
    });
    if (conflit) {
      return { succes: false, erreur: "Cet e-mail est déjà utilisé par un autre compte" };
    }

    await prisma.utilisateur.update({
      where: { id: ctx.utilisateurId },
      data: {
        prenom: parsed.data.prenom,
        nom: parsed.data.nom,
        email,
        telephone: parsed.data.telephone ?? null,
        photo: parsed.data.photo ?? null,
        signature: parsed.data.signature ?? null,
      },
    });

    await audit({
      utilisateurId: ctx.utilisateurId,
      etablissementId: ctx.etablissementId,
      action: AuditAction.UPDATE,
      entite: "Utilisateur",
      entiteId: ctx.utilisateurId,
      apres: { prenom: parsed.data.prenom, nom: parsed.data.nom, email },
    });

    revalidatePath("/portail/profil");
    revalidatePath("/portail", "layout");
    return { succes: true, data: undefined };
  } catch (e) {
    return { succes: false, erreur: msg(e) };
  }
}

// ─── Mot de passe ───────────────────────────────────────────

const schemaMdp = z
  .object({
    actuel: z.string().min(1, "Mot de passe actuel requis"),
    nouveau: z
      .string()
      .min(8, "8 caractères minimum")
      .regex(/[A-Z]/, "Au moins une majuscule")
      .regex(/[a-z]/, "Au moins une minuscule")
      .regex(/[0-9]/, "Au moins un chiffre"),
    confirmation: z.string().min(1),
  })
  .refine((d) => d.nouveau === d.confirmation, {
    message: "La confirmation ne correspond pas",
    path: ["confirmation"],
  });

export async function actionChangerMotDePasse(formData: FormData): Promise<ActionResult> {
  try {
    const ctx = await requireContext();

    const parsed = schemaMdp.safeParse({
      actuel: formData.get("actuel"),
      nouveau: formData.get("nouveau"),
      confirmation: formData.get("confirmation"),
    });
    if (!parsed.success) {
      return { succes: false, erreur: parsed.error.issues[0]?.message ?? "Données invalides" };
    }

    const user = await prisma.utilisateur.findUnique({
      where: { id: ctx.utilisateurId },
      select: { motDePasseHash: true },
    });
    if (!user?.motDePasseHash) {
      return { succes: false, erreur: "Aucun mot de passe défini sur ce compte" };
    }

    const bcrypt = (await import("bcryptjs")).default;
    const ok = await bcrypt.compare(parsed.data.actuel, user.motDePasseHash);
    if (!ok) return { succes: false, erreur: "Mot de passe actuel incorrect" };

    const hash = await bcrypt.hash(parsed.data.nouveau, 10);
    await prisma.utilisateur.update({
      where: { id: ctx.utilisateurId },
      data: { motDePasseHash: hash },
    });

    await audit({
      utilisateurId: ctx.utilisateurId,
      etablissementId: ctx.etablissementId,
      action: AuditAction.UPDATE,
      entite: "Utilisateur",
      entiteId: ctx.utilisateurId,
      apres: { motDePasse: "modifié" },
    });

    return { succes: true, data: undefined };
  } catch (e) {
    return { succes: false, erreur: msg(e) };
  }
}
