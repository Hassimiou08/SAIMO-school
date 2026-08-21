"use server";

import { autoriser } from "@/server/permissions/can";
import {
  enregistrerPaiement,
  annulerUnPaiement,
  rapportCaisse,
  type EnregistrerPaiementInput,
} from "@/server/services/paiement.service";
import { envoyerRecuPaiement } from "@/server/external/email.service";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import type { ActionResult } from "./eleves";

// ─── Action : Enregistrer un paiement ────────────────────────

const schemaPaiement = z.object({
  fraisEleveId: z.string().min(1),
  montant: z.number().positive("Le montant doit être positif"),
  modePaiement: z.enum(["especes", "cheque", "virement", "mobile"]),
  reference: z.string().optional(),
  observation: z.string().optional(),
});

export async function actionEnregistrerPaiement(
  utilisateurId: string,
  etablissementId: string,
  data: Omit<EnregistrerPaiementInput, "encaisseParId" | "etablissementId">
): Promise<ActionResult<{ numeroRecu: string }>> {
  try {
    await autoriser(utilisateurId, etablissementId, "paiement:enregistrer");

    const parsed = schemaPaiement.parse(data);
    const { paiement, recu } = await enregistrerPaiement({
      ...parsed,
      encaisseParId: utilisateurId,
      etablissementId,
    });

    // Envoyer le reçu par email si le parent a un email
    const fraisEleve = await prisma.fraisEleve.findUnique({
      where: { id: data.fraisEleveId },
      include: {
        inscription: {
          include: {
            eleve: {
              include: {
                parents: {
                  where: { principal: true },
                  include: { parent: true },
                },
              },
            },
          },
        },
      },
    });

    const parentPrincipal = fraisEleve?.inscription?.eleve?.parents?.[0]?.parent;
    const etablissement = await prisma.etablissement.findUnique({
      where: { id: etablissementId },
    });

    if (parentPrincipal?.email && fraisEleve?.inscription?.eleve) {
      const eleve = fraisEleve.inscription.eleve;
      await envoyerRecuPaiement({
        email: parentPrincipal.email,
        prenomParent: parentPrincipal.prenom,
        prenomEleve: eleve.prenom,
        nomEleve: eleve.nom,
        numeroRecu: paiement.numeroRecu,
        montant: Number(paiement.montant),
        devise: etablissement?.devise ?? "GNF",
        etablissementId,
      });
    }

    revalidatePath("/finance");
    return { succes: true, data: { numeroRecu: paiement.numeroRecu } };
  } catch (error) {
    return {
      succes: false,
      erreur: error instanceof Error ? error.message : "Erreur inattendue",
    };
  }
}

// ─── Action : Annuler un paiement ────────────────────────────

export async function actionAnnulerPaiement(
  utilisateurId: string,
  etablissementId: string,
  paiementId: string,
  motif: string
): Promise<ActionResult> {
  try {
    if (!motif.trim()) {
      return { succes: false, erreur: "Un motif d'annulation est obligatoire" };
    }
    await autoriser(utilisateurId, etablissementId, "paiement:annuler");
    await annulerUnPaiement({ paiementId, motif, annuleParId: utilisateurId, etablissementId });
    revalidatePath("/finance");
    return { succes: true, data: undefined };
  } catch (error) {
    return {
      succes: false,
      erreur: error instanceof Error ? error.message : "Erreur inattendue",
    };
  }
}

// ─── Action : Rapport de caisse ───────────────────────────────

export async function actionRapportCaisse(
  utilisateurId: string,
  etablissementId: string,
  dateDebut: Date,
  dateFin: Date
): Promise<ActionResult<Awaited<ReturnType<typeof rapportCaisse>>>> {
  try {
    await autoriser(utilisateurId, etablissementId, "rapport:financier");
    const rapport = await rapportCaisse(etablissementId, dateDebut, dateFin);
    return { succes: true, data: rapport };
  } catch (error) {
    return {
      succes: false,
      erreur: error instanceof Error ? error.message : "Erreur inattendue",
    };
  }
}
