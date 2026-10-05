import "server-only";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireContext, requirePermission } from "@/server/context";
import { enregistrerPaiement } from "@/server/services/paiement.service";
import { envoyerRecuPaiement } from "@/server/external/email.service";
import { messageErreur as msg } from "@/server/errors";
import type { ActionResult } from "@/server/actions/eleves";

const s = (v: FormDataEntryValue | null) => {
  const t = typeof v === "string" ? v.trim() : "";
  return t === "" ? undefined : t;
};

const schemaPaiement = z.object({
  fraisEleveId: z.string().min(1),
  montant: z.coerce.number().positive("Montant invalide"),
  modePaiement: z.enum(["especes", "cheque", "virement", "mobile"]),
  reference: z.string().max(80).optional(),
});

/**
 * Encaissement depuis le formulaire de paiement.
 * `dateEncaissement` n'est fourni que par la synchronisation hors ligne (date
 * réelle de saisie sur l'appareil) : ce module n'est pas une Server Action, un
 * formulaire ne peut donc pas antidater un paiement.
 */
export async function encaisserDepuisFormulaire(
  formData: FormData,
  dateEncaissement?: Date,
): Promise<ActionResult<{ numeroRecu: string; paiementId: string }>> {
  try {
    const ctx = await requireContext();
    requirePermission(ctx.role, "paiement:enregistrer");

    const parsed = schemaPaiement.safeParse({
      fraisEleveId: formData.get("fraisEleveId"),
      montant: formData.get("montant"),
      modePaiement: formData.get("modePaiement"),
      reference: s(formData.get("reference")),
    });
    if (!parsed.success) {
      return { succes: false, erreur: parsed.error.issues[0]?.message ?? "Données invalides" };
    }

    const { paiement } = await enregistrerPaiement({
      ...parsed.data,
      encaisseParId: ctx.utilisateurId,
      etablissementId: ctx.etablissementId,
      date: dateEncaissement,
    });

    // Reçu par email au parent principal (RM-14 : non bloquant)
    try {
      const frais = await prisma.fraisEleve.findUnique({
        where: { id: parsed.data.fraisEleveId },
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
      const parent = frais?.inscription.eleve.parents[0]?.parent;
      const etab = await prisma.etablissement.findUnique({ where: { id: ctx.etablissementId } });
      if (parent?.email && frais) {
        await envoyerRecuPaiement({
          email: parent.email,
          prenomParent: parent.prenom,
          prenomEleve: frais.inscription.eleve.prenom,
          nomEleve: frais.inscription.eleve.nom,
          numeroRecu: paiement.numeroRecu,
          montant: Number(paiement.montant),
          devise: etab?.devise ?? "GNF",
          etablissementId: ctx.etablissementId,
        });
      }
    } catch {
      /* email best-effort */
    }

    revalidatePath("/portail/paiements");
    revalidatePath("/portail/recus");
    return { succes: true, data: { numeroRecu: paiement.numeroRecu, paiementId: paiement.id } };
  } catch (e) {
    return { succes: false, erreur: msg(e) };
  }
}
