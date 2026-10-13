"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireContext } from "@/server/context";
import { mesEnfants } from "@/server/dal/parent";
import { messageErreur as msg } from "@/server/errors";
import {
  initierPaiementEnLigne,
  actualiserTransaction,
  normaliserTelephone,
  type EtatTransaction,
} from "@/server/services/paiement-en-ligne.service";
import type { Operateur } from "@/server/external/paiement-en-ligne";
import type { ActionResult } from "./eleves";

const OPERATEURS: Operateur[] = ["orange", "mtn"];

/** Pages dont les montants changent quand un paiement en ligne aboutit. */
function rafraichirPagesPaiement() {
  revalidatePath("/parent/paiements");
  revalidatePath("/parent");
  revalidatePath("/compta");
  revalidatePath("/compta/recettes");
  revalidatePath("/portail/paiements");
  revalidatePath("/portail/recus");
}

/** Vérifie que l'échéance appartient à un enfant du parent connecté. */
async function fraisDeMonEnfant(fraisEleveId: string, etablissementId: string) {
  const frais = await prisma.fraisEleve.findFirst({
    where: { id: fraisEleveId, inscription: { etablissementId } },
    select: { inscription: { select: { eleveId: true } } },
  });
  if (!frais) return false;
  const enfants = await mesEnfants();
  return enfants.some((e) => e.id === frais.inscription.eleveId);
}

/**
 * Paiement mobile d'une échéance par le parent : envoie la demande de
 * paiement au téléphone (Orange Money / MTN). Le paiement n'est enregistré
 * qu'après validation par le parent (voir actionSuivrePaiementEnLigne).
 */
export async function actionInitierPaiementEnLigne(
  fraisEleveId: string,
  operateur: string,
  telephoneBrut: string,
): Promise<ActionResult<EtatTransaction>> {
  try {
    const ctx = await requireContext();
    if (ctx.role !== "PARENT") {
      return { succes: false, erreur: "Réservé au parent." };
    }
    if (!OPERATEURS.includes(operateur as Operateur)) {
      return { succes: false, erreur: "Moyen de paiement inconnu." };
    }
    const telephone = normaliserTelephone(telephoneBrut);
    if (!telephone) {
      return { succes: false, erreur: "Numéro invalide : 9 chiffres commençant par 6 (ex. 620 00 00 00)." };
    }
    if (!(await fraisDeMonEnfant(fraisEleveId, ctx.etablissementId))) {
      return { succes: false, erreur: "Cette échéance ne concerne pas votre enfant." };
    }

    const etat = await initierPaiementEnLigne({
      etablissementId: ctx.etablissementId,
      fraisEleveId,
      utilisateurId: ctx.utilisateurId,
      operateur: operateur as Operateur,
      telephone,
    });
    return { succes: true, data: etat };
  } catch (e) {
    return { succes: false, erreur: msg(e) };
  }
}

/** État d'un paiement en ligne ; le fait avancer si l'opérateur a répondu. */
export async function actionSuivrePaiementEnLigne(
  transactionId: string,
): Promise<ActionResult<EtatTransaction>> {
  try {
    const ctx = await requireContext();
    const t = await prisma.transactionEnLigne.findFirst({
      where: { id: transactionId, etablissementId: ctx.etablissementId, initieeParId: ctx.utilisateurId },
      select: { id: true },
    });
    if (!t) return { succes: false, erreur: "Paiement introuvable." };

    const etat = await actualiserTransaction(t.id);
    if (etat.statut !== "en_attente") rafraichirPagesPaiement();
    return { succes: true, data: etat };
  } catch (e) {
    return { succes: false, erreur: msg(e) };
  }
}
