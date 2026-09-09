"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireContext, requirePermission } from "@/server/context";
import { audit, AuditAction } from "@/server/logs/audit";
import type { ActionResult } from "./eleves";

import { messageErreur as msg } from "@/server/errors";

const schema = z.object({
  classeId: z.string().min(1),
  eleveId: z.string().min(1),
  date: z.string().min(1),
  statut: z.enum(["absent", "retard"]),
  motif: z.string().max(200).optional(),
});

export async function actionEnregistrerAbsence(
  formData: FormData,
): Promise<ActionResult> {
  try {
    const ctx = await requireContext();
    requirePermission(ctx.role, "presence:saisir");

    const parsed = schema.safeParse({
      classeId: formData.get("classeId"),
      eleveId: formData.get("eleveId"),
      date: formData.get("date"),
      statut: formData.get("statut"),
      motif: (formData.get("motif") as string) || undefined,
    });
    if (!parsed.success) {
      return { succes: false, erreur: parsed.error.issues[0]?.message ?? "Données invalides" };
    }

    const [classe, inscription] = await Promise.all([
      prisma.classe.findFirst({
        where: { id: parsed.data.classeId, etablissementId: ctx.etablissementId },
      }),
      prisma.inscription.findFirst({
        where: {
          eleveId: parsed.data.eleveId,
          classeId: parsed.data.classeId,
          statut: "active",
        },
      }),
    ]);
    if (!classe) return { succes: false, erreur: "Classe invalide" };
    if (!inscription) return { succes: false, erreur: "L'élève n'est pas inscrit dans cette classe" };

    const jour = new Date(parsed.data.date);
    // Une séance "administrative" par (classe, jour) pour rattacher la présence.
    let seance = await prisma.seance.findFirst({
      where: { classeId: parsed.data.classeId, date: jour },
    });
    if (!seance) {
      seance = await prisma.seance.create({
        data: { classeId: parsed.data.classeId, date: jour },
      });
    }

    const periode = await prisma.periode.findFirst({
      where: {
        anneeScolaire: { id: ctx.anneeScolaireId },
        dateDebut: { lte: jour },
        dateFin: { gte: jour },
      },
    });

    await prisma.presence.upsert({
      where: { seanceId_eleveId: { seanceId: seance.id, eleveId: parsed.data.eleveId } },
      create: {
        seanceId: seance.id,
        eleveId: parsed.data.eleveId,
        classeId: parsed.data.classeId,
        periodeId: periode?.id,
        statut: parsed.data.statut,
        motif: parsed.data.motif,
        enregistrePar: ctx.utilisateurId,
      },
      update: {
        statut: parsed.data.statut,
        motif: parsed.data.motif,
        enregistrePar: ctx.utilisateurId,
      },
    });

    await audit({
      utilisateurId: ctx.utilisateurId,
      etablissementId: ctx.etablissementId,
      action: AuditAction.CREATE,
      entite: "Presence",
      apres: { eleveId: parsed.data.eleveId, statut: parsed.data.statut },
    });

    // Alerte email aux parents — n'interrompt jamais l'enregistrement.
    try {
      const [eleve, { contactsParentsEleve, envoyerAlerteAbsence }] = await Promise.all([
        prisma.eleve.findUnique({
          where: { id: parsed.data.eleveId },
          select: { prenom: true, nom: true },
        }),
        import("@/server/external/email.service"),
      ]);
      const contacts = await contactsParentsEleve(parsed.data.eleveId);
      const dateLisible = jour.toLocaleDateString("fr-FR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      });
      for (const c of contacts) {
        await envoyerAlerteAbsence({
          email: c.email,
          prenomParent: c.prenom,
          prenomEleve: eleve?.prenom ?? "",
          nomEleve: eleve?.nom ?? "",
          date: dateLisible,
          statut: parsed.data.statut,
          motif: parsed.data.motif,
          etablissementId: ctx.etablissementId,
        });
      }
    } catch (e) {
      console.error("[email alerte absence]", e);
    }

    revalidatePath("/portail/absences");
    return { succes: true, data: undefined };
  } catch (e) {
    return { succes: false, erreur: msg(e) };
  }
}

export async function actionJustifierAbsence(
  presenceId: string,
  motif: string,
): Promise<ActionResult> {
  try {
    const ctx = await requireContext();
    requirePermission(ctx.role, "presence:justifier");
    const p = await prisma.presence.findFirst({
      where: { id: presenceId, classe: { etablissementId: ctx.etablissementId } },
    });
    if (!p) return { succes: false, erreur: "Absence introuvable" };
    await prisma.presence.update({
      where: { id: presenceId },
      data: { justifie: true, motif: motif || p.motif },
    });
    revalidatePath("/portail/absences");
    return { succes: true, data: undefined };
  } catch (e) {
    return { succes: false, erreur: msg(e) };
  }
}
