"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireContext } from "@/server/context";
import { enregistrerPaiement } from "@/server/services/paiement.service";
import { mesEnfants } from "@/server/dal/parent";
import { messageErreur as msg } from "@/server/errors";
import type { ActionResult } from "./eleves";

const LIBELLE_METHODE: Record<string, string> = {
  orange: "Orange Money",
  mtn: "MTN Mobile Money",
  card: "Carte bancaire",
};

/**
 * Paiement en ligne d'une échéance par le parent (mobile money / carte).
 * L'encaissement réel via l'agrégateur est simulé côté UI ; ici on enregistre
 * le paiement + le reçu comme un encaissement standard.
 */
export async function actionPayerFraisEnfant(
  fraisEleveId: string,
  montant: number,
  methode: string,
): Promise<ActionResult<{ numeroRecu: string }>> {
  try {
    const ctx = await requireContext();
    if (ctx.role !== "PARENT") {
      return { succes: false, erreur: "Réservé au parent." };
    }

    const frais = await prisma.fraisEleve.findFirst({
      where: { id: fraisEleveId, inscription: { etablissementId: ctx.etablissementId } },
      include: {
        inscription: {
          include: {
            eleve: {
              include: {
                parents: { where: { principal: true }, include: { parent: true } },
              },
            },
          },
        },
      },
    });
    if (!frais) return { succes: false, erreur: "Échéance introuvable" };

    const enfants = await mesEnfants();
    if (!enfants.some((e) => e.id === frais.inscription.eleveId)) {
      return { succes: false, erreur: "Cette échéance ne concerne pas votre enfant." };
    }

    const solde = Number(frais.montantDu) - Number(frais.montantPaye);
    const aRegler = Math.min(montant, solde);
    if (aRegler <= 0) return { succes: false, erreur: "Cette échéance est déjà soldée." };

    const { paiement } = await enregistrerPaiement({
      fraisEleveId,
      montant: aRegler,
      modePaiement: "mobile",
      reference: LIBELLE_METHODE[methode] ?? methode,
      observation: "Paiement en ligne (espace parent)",
      encaisseParId: ctx.utilisateurId,
      etablissementId: ctx.etablissementId,
    });

    // Reçu par email (best-effort)
    try {
      const parent = frais.inscription.eleve.parents[0]?.parent;
      const etab = await prisma.etablissement.findUnique({
        where: { id: ctx.etablissementId },
        select: { devise: true },
      });
      if (parent?.email) {
        const { envoyerRecuPaiement } = await import("@/server/external/email.service");
        await envoyerRecuPaiement({
          email: parent.email,
          prenomParent: parent.prenom,
          prenomEleve: frais.inscription.eleve.prenom,
          nomEleve: frais.inscription.eleve.nom,
          numeroRecu: paiement.numeroRecu,
          montant: aRegler,
          devise: etab?.devise ?? "GNF",
          etablissementId: ctx.etablissementId,
        });
      }
    } catch (e) {
      console.error("[email reçu parent]", e);
    }

    revalidatePath("/parent/paiements");
    revalidatePath("/parent");
    return { succes: true, data: { numeroRecu: paiement.numeroRecu } };
  } catch (e) {
    return { succes: false, erreur: msg(e) };
  }
}
