"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireContext, requirePermission } from "@/server/context";
import { audit, AuditAction } from "@/server/logs/audit";
import { envoyerRelanceFrais } from "@/server/external/email.service";
import { messageErreur as msg } from "@/server/errors";
import type { ActionResult } from "./eleves";

const s = (v: FormDataEntryValue | null) => {
  const t = typeof v === "string" ? v.trim() : "";
  return t === "" ? undefined : t;
};

const MODES = ["especes", "cheque", "virement", "mobile"] as const;

// ─────────────────────────────────────────────────────────────
// Dépenses
// ─────────────────────────────────────────────────────────────

const schemaDepense = z.object({
  beneficiaire: z.string().min(1, "Bénéficiaire requis").max(120),
  categorie: z.string().min(1).max(60),
  description: z.string().min(1, "Description requise").max(500),
  montant: z.coerce.number().positive("Montant invalide"),
  date: z.string().min(1),
  statut: z.enum(["planifie", "paye"]).default("planifie"),
  modePaiement: z.enum(MODES).optional(),
});

export async function actionCreerDepense(
  formData: FormData,
): Promise<ActionResult> {
  try {
    const ctx = await requireContext();
    requirePermission(ctx.role, "depense:gerer");

    const parsed = schemaDepense.safeParse({
      beneficiaire: s(formData.get("beneficiaire")),
      categorie: s(formData.get("categorie")),
      description: s(formData.get("description")),
      montant: formData.get("montant"),
      date: s(formData.get("date")),
      statut: s(formData.get("statut")) ?? "planifie",
      modePaiement: s(formData.get("modePaiement")),
    });
    if (!parsed.success) {
      return {
        succes: false,
        erreur: parsed.error.issues[0]?.message ?? "Données invalides",
      };
    }
    const d = parsed.data;
    const paye = d.statut === "paye";

    const depense = await prisma.depense.create({
      data: {
        etablissementId: ctx.etablissementId,
        date: new Date(d.date),
        categorie: d.categorie,
        description: d.description,
        montant: d.montant,
        beneficiaire: d.beneficiaire,
        statut: d.statut,
        modePaiement: paye ? d.modePaiement ?? "especes" : null,
        datePaiement: paye ? new Date() : null,
        creeParId: ctx.utilisateurId,
      },
    });
    await audit({
      utilisateurId: ctx.utilisateurId,
      etablissementId: ctx.etablissementId,
      action: AuditAction.CREATE,
      entite: "Depense",
      entiteId: depense.id,
      apres: { beneficiaire: d.beneficiaire, montant: d.montant, statut: d.statut },
    });
    revalidatePath("/compta/depenses");
    revalidatePath("/compta");
    return { succes: true, data: undefined };
  } catch (e) {
    return { succes: false, erreur: msg(e) };
  }
}

export async function actionMarquerDepensePayee(
  id: string,
  mode: string,
): Promise<ActionResult> {
  try {
    const ctx = await requireContext();
    requirePermission(ctx.role, "depense:gerer");
    const modePaiement = MODES.includes(mode as (typeof MODES)[number])
      ? mode
      : "especes";

    const dep = await prisma.depense.findFirst({
      where: { id, etablissementId: ctx.etablissementId },
    });
    if (!dep) return { succes: false, erreur: "Dépense introuvable" };
    if (dep.statut === "paye")
      return { succes: false, erreur: "Cette dépense est déjà réglée" };

    await prisma.depense.update({
      where: { id },
      data: { statut: "paye", modePaiement, datePaiement: new Date() },
    });
    await audit({
      utilisateurId: ctx.utilisateurId,
      etablissementId: ctx.etablissementId,
      action: AuditAction.UPDATE,
      entite: "Depense",
      entiteId: id,
      apres: { statut: "paye", modePaiement },
    });
    revalidatePath("/compta/depenses");
    revalidatePath("/compta");
    return { succes: true, data: undefined };
  } catch (e) {
    return { succes: false, erreur: msg(e) };
  }
}

// ─────────────────────────────────────────────────────────────
// Salaires
// ─────────────────────────────────────────────────────────────

const champsSalaire = {
  employeNom: z.string().min(1, "Nom de l'employé requis").max(120),
  role: z.string().min(1).max(60),
  typeContrat: z.enum(["fixe", "horaire"]).default("fixe"),
  heures: z.coerce.number().min(0).optional(),
  tauxHoraire: z.coerce.number().min(0).optional(),
  salaireBase: z.coerce.number().min(0).optional(),
  primes: z.coerce.number().min(0).default(0),
  retenues: z.coerce.number().min(0).default(0),
};

const refineMontants = (d: {
  typeContrat: "fixe" | "horaire";
  heures?: number;
  tauxHoraire?: number;
  salaireBase?: number;
}) =>
  d.typeContrat === "horaire"
    ? (d.heures ?? 0) > 0 && (d.tauxHoraire ?? 0) > 0
    : (d.salaireBase ?? 0) > 0;
const messageMontants = {
  message: "Renseignez la base (fixe) ou heures + taux (horaire)",
};

const schemaSalaire = z
  .object({
    mois: z.string().regex(/^\d{4}-\d{2}$/, "Mois invalide (AAAA-MM)"),
    ...champsSalaire,
  })
  .refine(refineMontants, messageMontants);

const schemaModifSalaire = z.object(champsSalaire).refine(refineMontants, messageMontants);

function calculerNet(d: {
  typeContrat: "fixe" | "horaire";
  heures?: number;
  tauxHoraire?: number;
  salaireBase?: number;
  primes?: number;
  retenues?: number;
}): number {
  const brut =
    d.typeContrat === "horaire"
      ? (d.heures ?? 0) * (d.tauxHoraire ?? 0)
      : d.salaireBase ?? 0;
  return Math.max(0, brut + (d.primes ?? 0) - (d.retenues ?? 0));
}

export async function actionCreerSalaire(
  formData: FormData,
): Promise<ActionResult> {
  try {
    const ctx = await requireContext();
    requirePermission(ctx.role, "salaire:gerer");

    const parsed = schemaSalaire.safeParse({
      mois: s(formData.get("mois")),
      employeNom: s(formData.get("employeNom")),
      role: s(formData.get("role")) ?? "Administration",
      typeContrat: s(formData.get("typeContrat")) ?? "fixe",
      heures: formData.get("heures") || undefined,
      tauxHoraire: formData.get("tauxHoraire") || undefined,
      salaireBase: formData.get("salaireBase") || undefined,
      primes: formData.get("primes") || 0,
      retenues: formData.get("retenues") || 0,
    });
    if (!parsed.success) {
      return {
        succes: false,
        erreur: parsed.error.issues[0]?.message ?? "Données invalides",
      };
    }
    const d = parsed.data;

    const salaire = await prisma.salaire.create({
      data: {
        etablissementId: ctx.etablissementId,
        mois: d.mois,
        employeNom: d.employeNom,
        role: d.role,
        typeContrat: d.typeContrat,
        heures: d.typeContrat === "horaire" ? d.heures : null,
        tauxHoraire: d.typeContrat === "horaire" ? d.tauxHoraire : null,
        salaireBase: d.typeContrat === "fixe" ? d.salaireBase : null,
        primes: d.primes,
        retenues: d.retenues,
        netAPayer: calculerNet(d),
        creeParId: ctx.utilisateurId,
      },
    });
    await audit({
      utilisateurId: ctx.utilisateurId,
      etablissementId: ctx.etablissementId,
      action: AuditAction.CREATE,
      entite: "Salaire",
      entiteId: salaire.id,
      apres: { employeNom: d.employeNom, mois: d.mois, netAPayer: calculerNet(d) },
    });
    revalidatePath("/compta/salaires");
    return { succes: true, data: undefined };
  } catch (e) {
    return { succes: false, erreur: msg(e) };
  }
}

/**
 * Corrige les montants d'une ligne de paie. Si elle était déjà réglée,
 * elle repasse « en attente » (le montant enregistré était erroné → à re-payer).
 */
export async function actionModifierSalaire(
  id: string,
  formData: FormData,
): Promise<ActionResult> {
  try {
    const ctx = await requireContext();
    requirePermission(ctx.role, "salaire:gerer");

    const existant = await prisma.salaire.findFirst({
      where: { id, etablissementId: ctx.etablissementId },
    });
    if (!existant) return { succes: false, erreur: "Ligne de paie introuvable" };

    const parsed = schemaModifSalaire.safeParse({
      employeNom: s(formData.get("employeNom")),
      role: s(formData.get("role")) ?? existant.role,
      typeContrat: s(formData.get("typeContrat")) ?? "fixe",
      heures: formData.get("heures") || undefined,
      tauxHoraire: formData.get("tauxHoraire") || undefined,
      salaireBase: formData.get("salaireBase") || undefined,
      primes: formData.get("primes") || 0,
      retenues: formData.get("retenues") || 0,
    });
    if (!parsed.success) {
      return {
        succes: false,
        erreur: parsed.error.issues[0]?.message ?? "Données invalides",
      };
    }
    const d = parsed.data;
    const etaitPaye = existant.statut === "paye";

    await prisma.salaire.update({
      where: { id },
      data: {
        employeNom: d.employeNom,
        role: d.role,
        typeContrat: d.typeContrat,
        heures: d.typeContrat === "horaire" ? d.heures : null,
        tauxHoraire: d.typeContrat === "horaire" ? d.tauxHoraire : null,
        salaireBase: d.typeContrat === "fixe" ? d.salaireBase : null,
        primes: d.primes,
        retenues: d.retenues,
        netAPayer: calculerNet(d),
        ...(etaitPaye
          ? { statut: "attente", modePaiement: null, datePaiement: null }
          : {}),
      },
    });
    await audit({
      utilisateurId: ctx.utilisateurId,
      etablissementId: ctx.etablissementId,
      action: AuditAction.UPDATE,
      entite: "Salaire",
      entiteId: id,
      avant: {
        netAPayer: Number(existant.netAPayer),
        statut: existant.statut,
      },
      apres: {
        netAPayer: calculerNet(d),
        statut: etaitPaye ? "attente (corrigé)" : existant.statut,
      },
    });
    revalidatePath("/compta/salaires");
    revalidatePath("/compta");
    return { succes: true, data: undefined };
  } catch (e) {
    return { succes: false, erreur: msg(e) };
  }
}

async function reglerSalaires(
  ids: string[],
  mode: string,
): Promise<{ payes: number }> {
  const ctx = await requireContext();
  requirePermission(ctx.role, "salaire:gerer");
  const modePaiement = MODES.includes(mode as (typeof MODES)[number])
    ? mode
    : "virement";

  const cibles = await prisma.salaire.findMany({
    where: {
      id: { in: ids },
      etablissementId: ctx.etablissementId,
      statut: "attente",
    },
    select: { id: true },
  });
  if (cibles.length === 0) return { payes: 0 };

  await prisma.salaire.updateMany({
    where: { id: { in: cibles.map((c) => c.id) } },
    data: { statut: "paye", modePaiement, datePaiement: new Date() },
  });
  await audit({
    utilisateurId: ctx.utilisateurId,
    etablissementId: ctx.etablissementId,
    action: AuditAction.PAYMENT,
    entite: "Salaire",
    entiteId: cibles.map((c) => c.id).join(","),
    apres: { payes: cibles.length, modePaiement },
  });
  revalidatePath("/compta/salaires");
  revalidatePath("/compta");
  return { payes: cibles.length };
}

export async function actionPayerSalaire(
  id: string,
  mode: string,
): Promise<ActionResult> {
  try {
    const { payes } = await reglerSalaires([id], mode);
    if (payes === 0)
      return { succes: false, erreur: "Salaire introuvable ou déjà réglé" };
    return { succes: true, data: undefined };
  } catch (e) {
    return { succes: false, erreur: msg(e) };
  }
}

export async function actionPayerSalairesGroupe(
  ids: string[],
  mode: string,
): Promise<ActionResult<{ payes: number }>> {
  try {
    if (!Array.isArray(ids) || ids.length === 0)
      return { succes: false, erreur: "Aucun salaire sélectionné" };
    const { payes } = await reglerSalaires(ids, mode);
    if (payes === 0)
      return { succes: false, erreur: "Aucun salaire réglable dans la sélection" };
    return { succes: true, data: { payes } };
  } catch (e) {
    return { succes: false, erreur: msg(e) };
  }
}

/**
 * Génère les lignes de paie du mois pour tous les enseignants actifs
 * qui n'en ont pas encore (montants à compléter ensuite). Idempotent.
 */
export async function actionGenererPaieMois(
  mois: string,
): Promise<ActionResult<{ crees: number }>> {
  try {
    const ctx = await requireContext();
    requirePermission(ctx.role, "salaire:gerer");
    if (!/^\d{4}-\d{2}$/.test(mois))
      return { succes: false, erreur: "Mois invalide" };

    const enseignants = await prisma.enseignant.findMany({
      where: { etablissementId: ctx.etablissementId, utilisateur: { actif: true } },
      include: { utilisateur: { select: { id: true, prenom: true, nom: true } } },
    });
    if (enseignants.length === 0)
      return { succes: false, erreur: "Aucun enseignant actif" };

    const existants = await prisma.salaire.findMany({
      where: { etablissementId: ctx.etablissementId, mois },
      select: { employeNom: true },
    });
    const dejaLa = new Set(existants.map((e) => e.employeNom));

    // Reprise des montants du dernier mois connu pour chaque employé.
    const anterieurs = await prisma.salaire.findMany({
      where: { etablissementId: ctx.etablissementId, mois: { lt: mois } },
      orderBy: { mois: "desc" },
    });
    const dernierParEmploye = new Map<string, (typeof anterieurs)[number]>();
    for (const a of anterieurs) {
      if (!dernierParEmploye.has(a.employeNom)) dernierParEmploye.set(a.employeNom, a);
    }

    const aCreer = enseignants
      .filter(
        (e) => !dejaLa.has(`${e.utilisateur.prenom} ${e.utilisateur.nom}`),
      )
      .map((ens) => {
        const nom = `${ens.utilisateur.prenom} ${ens.utilisateur.nom}`;
        const p = dernierParEmploye.get(nom);
        return {
          etablissementId: ctx.etablissementId,
          mois,
          employeNom: nom,
          employeUtilisateurId: ens.utilisateur.id,
          role: p?.role ?? "Enseignant",
          typeContrat: p?.typeContrat ?? "fixe",
          heures: p?.heures ?? null,
          tauxHoraire: p?.tauxHoraire ?? null,
          salaireBase: p?.salaireBase ?? (p ? null : 0),
          primes: p ? Number(p.primes) : 0,
          retenues: p ? Number(p.retenues) : 0,
          netAPayer: p ? Number(p.netAPayer) : 0,
        };
      });

    if (aCreer.length === 0)
      return { succes: false, erreur: "La paie de ce mois est déjà générée" };

    await prisma.salaire.createMany({ data: aCreer, skipDuplicates: true });
    await audit({
      utilisateurId: ctx.utilisateurId,
      etablissementId: ctx.etablissementId,
      action: AuditAction.CREATE,
      entite: "Salaire",
      entiteId: `paie-${mois}`,
      apres: { mois, crees: aCreer.length },
    });
    revalidatePath("/compta/salaires");
    return { succes: true, data: { crees: aCreer.length } };
  } catch (e) {
    return { succes: false, erreur: msg(e) };
  }
}

// ─────────────────────────────────────────────────────────────
// Relance des impayés (envoi email aux parents débiteurs)
// ─────────────────────────────────────────────────────────────

export async function actionRelancerImpayes(
  formData: FormData,
): Promise<ActionResult<{ envoyes: number; sansEmail: number }>> {
  try {
    const ctx = await requireContext();
    requirePermission(ctx.role, "email:envoyer");
    const message = s(formData.get("message")) ?? null;

    const etab = await prisma.etablissement.findUnique({
      where: { id: ctx.etablissementId },
      select: { devise: true },
    });
    const devise = etab?.devise ?? "GNF";

    const frais = await prisma.fraisEleve.findMany({
      where: {
        inscription: {
          etablissementId: ctx.etablissementId,
          anneeScolaireId: ctx.anneeScolaireId,
        },
        statut: { not: "annule" },
      },
      include: {
        remises: { select: { montant: true } },
        echeance: { include: { typeFrais: { select: { nom: true } } } },
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

    type Ligne = { eleve: string; motif: string; solde: number };
    const parParent = new Map<
      string,
      { email: string; prenom: string; lignes: Ligne[]; total: number }
    >();
    let sansEmail = 0;

    for (const f of frais) {
      const remises = f.remises.reduce((sum, r) => sum + Number(r.montant), 0);
      const solde = Math.max(
        0,
        Number(f.montantDu) - Number(f.montantPaye) - remises,
      );
      if (solde <= 0) continue;

      const parent = f.inscription.eleve.parents[0]?.parent;
      const eleveNom = `${f.inscription.eleve.prenom} ${f.inscription.eleve.nom}`;
      const ligne: Ligne = {
        eleve: eleveNom,
        motif: f.echeance.libelle ?? f.echeance.typeFrais.nom,
        solde,
      };
      if (!parent?.email) {
        sansEmail++;
        continue;
      }
      const cur = parParent.get(parent.email) ?? {
        email: parent.email,
        prenom: parent.prenom,
        lignes: [],
        total: 0,
      };
      cur.lignes.push(ligne);
      cur.total += solde;
      parParent.set(parent.email, cur);
    }

    if (parParent.size === 0) {
      return {
        succes: false,
        erreur:
          sansEmail > 0
            ? "Aucun parent débiteur ne dispose d'une adresse e-mail."
            : "Aucun frais échu impayé à relancer.",
      };
    }

    let envoyes = 0;
    for (const p of parParent.values()) {
      try {
        await envoyerRelanceFrais({
          email: p.email,
          prenomParent: p.prenom,
          lignes: p.lignes,
          total: p.total,
          devise,
          message,
          etablissementId: ctx.etablissementId,
        });
        envoyes++;
      } catch {
        /* best-effort : tracé dans la table Notification */
      }
    }

    await audit({
      utilisateurId: ctx.utilisateurId,
      etablissementId: ctx.etablissementId,
      action: AuditAction.SEND_EMAIL,
      entite: "Notification",
      entiteId: `relance-impayes`,
      apres: { envoyes, sansEmail },
    });
    return { succes: true, data: { envoyes, sansEmail } };
  } catch (e) {
    return { succes: false, erreur: msg(e) };
  }
}
