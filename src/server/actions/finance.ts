"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireContext, requirePermission } from "@/server/context";
import { audit, AuditAction } from "@/server/logs/audit";
import { annulerUnPaiement } from "@/server/services/paiement.service";
import { encaisserDepuisFormulaire } from "@/server/services/encaissement.service";
import type { ActionResult } from "./eleves";

import { messageErreur as msg } from "@/server/errors";
const s = (v: FormDataEntryValue | null) => {
  const t = typeof v === "string" ? v.trim() : "";
  return t === "" ? undefined : t;
};

// ─── Encaisser un paiement ──────────────────────────────────

export async function actionEnregistrerPaiement(
  formData: FormData,
): Promise<ActionResult<{ numeroRecu: string; paiementId: string }>> {
  return encaisserDepuisFormulaire(formData);
}

export async function actionAnnulerPaiement(
  paiementId: string,
  motif: string,
): Promise<ActionResult> {
  try {
    if (!motif.trim()) return { succes: false, erreur: "Un motif est obligatoire" };
    const ctx = await requireContext();
    requirePermission(ctx.role, "paiement:annuler");
    await annulerUnPaiement({
      paiementId,
      motif,
      annuleParId: ctx.utilisateurId,
      etablissementId: ctx.etablissementId,
    });
    revalidatePath("/portail/paiements");
    revalidatePath("/portail/recus");
    return { succes: true, data: undefined };
  } catch (e) {
    return { succes: false, erreur: msg(e) };
  }
}

// ─── Remises ────────────────────────────────────────────────

export async function actionCreerRemise(formData: FormData): Promise<ActionResult> {
  try {
    const ctx = await requireContext();
    requirePermission(ctx.role, "frais:configure");

    const fraisEleveId = s(formData.get("fraisEleveId"));
    const montant = Number(formData.get("montant"));
    const motif = s(formData.get("motif"));
    if (!fraisEleveId || !montant || montant <= 0 || !motif) {
      return { succes: false, erreur: "Frais, montant et motif requis" };
    }

    const frais = await prisma.fraisEleve.findFirst({
      where: { id: fraisEleveId, inscription: { etablissementId: ctx.etablissementId } },
    });
    if (!frais) return { succes: false, erreur: "Frais introuvable" };

    await prisma.remise.create({
      data: { fraisEleveId, montant, motif, accordeParId: ctx.utilisateurId },
    });
    await audit({
      utilisateurId: ctx.utilisateurId,
      etablissementId: ctx.etablissementId,
      action: AuditAction.CREATE,
      entite: "Remise",
      apres: { fraisEleveId, montant },
    });
    revalidatePath("/portail/remises");
    revalidatePath("/portail/paiements");
    return { succes: true, data: undefined };
  } catch (e) {
    return { succes: false, erreur: msg(e) };
  }
}

// ─── Configuration des frais ────────────────────────────────

export async function actionCreerTypeFrais(formData: FormData): Promise<ActionResult> {
  try {
    const ctx = await requireContext();
    requirePermission(ctx.role, "frais:configure");
    const nom = s(formData.get("nom"));
    if (!nom) return { succes: false, erreur: "Nom requis" };
    await prisma.typeFrais.create({
      data: {
        etablissementId: ctx.etablissementId,
        nom,
        obligatoire: formData.get("obligatoire") === "on",
      },
    });
    revalidatePath("/portail/paiements");
    return { succes: true, data: undefined };
  } catch (e) {
    return { succes: false, erreur: msg(e) };
  }
}

export async function actionCreerEcheance(formData: FormData): Promise<ActionResult> {
  try {
    const ctx = await requireContext();
    requirePermission(ctx.role, "frais:configure");

    const typeFraisId = s(formData.get("typeFraisId"));
    const niveauId = s(formData.get("niveauId"));
    const montant = Number(formData.get("montant"));
    const dateEcheance = s(formData.get("dateEcheance"));
    const libelle = s(formData.get("libelle"));
    if (!typeFraisId || !montant || montant <= 0) {
      return { succes: false, erreur: "Type de frais et montant requis" };
    }

    const type = await prisma.typeFrais.findFirst({
      where: { id: typeFraisId, etablissementId: ctx.etablissementId },
    });
    if (!type) return { succes: false, erreur: "Type de frais invalide" };

    await prisma.echeance.create({
      data: {
        typeFraisId,
        anneeScolaireId: ctx.anneeScolaireId,
        niveauId: niveauId ?? null,
        montant,
        dateEcheance: dateEcheance ? new Date(dateEcheance) : undefined,
        libelle: libelle ?? `${type.nom}`,
      },
    });
    revalidatePath("/portail/paiements");
    return { succes: true, data: undefined };
  } catch (e) {
    return { succes: false, erreur: msg(e) };
  }
}

/** Génère les FraisEleve d'une échéance pour tous les inscrits (idempotent). */
export async function actionGenererFrais(
  echeanceId: string,
  classeId?: string,
): Promise<ActionResult<{ crees: number }>> {
  try {
    const ctx = await requireContext();
    requirePermission(ctx.role, "frais:configure");

    const echeance = await prisma.echeance.findFirst({
      where: { id: echeanceId, typeFrais: { etablissementId: ctx.etablissementId } },
    });
    if (!echeance) return { succes: false, erreur: "Échéance introuvable" };

    const inscriptions = await prisma.inscription.findMany({
      where: {
        etablissementId: ctx.etablissementId,
        anneeScolaireId: ctx.anneeScolaireId,
        statut: "active",
        ...(classeId ? { classeId } : {}),
        ...(echeance.niveauId ? { classe: { niveauId: echeance.niveauId } } : {}),
      },
      select: { id: true },
    });

    let crees = 0;
    for (const insc of inscriptions) {
      const existe = await prisma.fraisEleve.findUnique({
        where: { inscriptionId_echeanceId: { inscriptionId: insc.id, echeanceId } },
      });
      if (existe) continue;
      await prisma.fraisEleve.create({
        data: {
          inscriptionId: insc.id,
          echeanceId,
          montantDu: echeance.montant,
        },
      });
      crees += 1;
    }

    revalidatePath("/portail/paiements");
    return { succes: true, data: { crees } };
  } catch (e) {
    return { succes: false, erreur: msg(e) };
  }
}
