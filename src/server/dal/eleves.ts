import "server-only";

import { cache } from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireContext, requirePermission } from "@/server/context";
import { trouverEleves, trouverEleveParId } from "@/server/repositories/eleve.repo";
import { trouverPaiementsEleve } from "@/server/repositories/paiement.repo";
import { formatDateLongue } from "@/lib/format";

// ─────────────────────────────────────────────────────────────
// DTO
// ─────────────────────────────────────────────────────────────

export interface EleveListDTO {
  id: string;
  matricule: string;
  prenom: string;
  nom: string;
  classe: string;
  statut: "Actif" | "Inactif";
  moyenneGenerale: number | null; // sur 20
  soldeDu: number; // GNF, ≥ 0
}

export interface EleveListResult {
  eleves: EleveListDTO[];
  total: number;
  page: number;
  pages: number;
}

export interface EleveDetailDTO {
  id: string;
  matricule: string;
  firstName: string;
  lastName: string;
  classe: string;
  classeId: string | null;
  statut: "Actif" | "Inactif";
  soldeDu: number;
  dateNaissance: string; // formatée FR pour l'affichage
  dateNaissanceISO: string | null; // yyyy-mm-dd pour les formulaires
  dateInscription: string;
  adresse: string | null;
  sexe: "M" | "F" | null;
  nationalite: string | null;
  lieuNaissance: string | null;
  parent: string;
  parentId: string | null;
  parentTelephone: string;
  parentEmail: string;
  parentAUnCompte: boolean;
  documents: string[];
  resultats: {
    matiere: string;
    coefficient: number;
    note: number;
    bareme: number;
    appreciation: string;
  }[];
  absences: {
    date: string;
    type: "Absence" | "Retard";
    motif: string;
    justifie: boolean;
  }[];
  paiements: {
    recu: string;
    date: string;
    montant: number;
    mode: string;
    statut: "Payé" | "Partiel";
  }[];
}

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

const statutLisible = (s: string): "Actif" | "Inactif" =>
  s === "actif" ? "Actif" : "Inactif";

function appreciation(moyenne: number): string {
  if (moyenne >= 16) return "Très bien";
  if (moyenne >= 14) return "Bien";
  if (moyenne >= 12) return "Assez bien";
  if (moyenne >= 10) return "Passable";
  if (moyenne > 0) return "Insuffisant";
  return "—";
}

const MODE_LISIBLE: Record<string, string> = {
  especes: "Espèces",
  cheque: "Chèque",
  virement: "Virement",
  mobile: "Mobile Money",
};

// ─────────────────────────────────────────────────────────────
// Liste
// ─────────────────────────────────────────────────────────────

export async function listerElevesDTO(params: {
  page?: number;
  recherche?: string;
  classeId?: string;
  statut?: string;
}): Promise<EleveListResult> {
  const ctx = await requireContext();
  requirePermission(ctx.role, "eleve:view");

  const res = await trouverEleves({
    etablissementId: ctx.etablissementId,
    anneeScolaireId: ctx.anneeScolaireId,
    page: params.page,
    recherche: params.recherche,
    classeId: params.classeId,
    statut: params.statut,
  });

  const eleveIds = res.eleves.map((e) => e.id);
  const inscriptionParEleve = new Map<string, string>();
  for (const e of res.eleves) {
    const insc = e.inscriptions[0];
    if (insc) inscriptionParEleve.set(insc.id, e.id);
  }

  const [soldes, bulletins] = await Promise.all([
    inscriptionParEleve.size
      ? prisma.fraisEleve.groupBy({
          by: ["inscriptionId"],
          where: { inscriptionId: { in: [...inscriptionParEleve.keys()] } },
          _sum: { montantDu: true, montantPaye: true },
        })
      : Promise.resolve([]),
    eleveIds.length
      ? prisma.bulletin.findMany({
          where: {
            eleveId: { in: eleveIds },
            anneeScolaireId: ctx.anneeScolaireId,
          },
          orderBy: { createdAt: "desc" },
          distinct: ["eleveId"],
          select: { eleveId: true, moyenneGenerale: true },
        })
      : Promise.resolve([]),
  ]);

  const soldeParEleve = new Map<string, number>();
  for (const s of soldes) {
    const eleveId = inscriptionParEleve.get(s.inscriptionId);
    if (!eleveId) continue;
    const du = Number(s._sum.montantDu ?? 0) - Number(s._sum.montantPaye ?? 0);
    soldeParEleve.set(eleveId, Math.max(0, du));
  }

  const moyenneParEleve = new Map<string, number | null>();
  for (const b of bulletins) {
    moyenneParEleve.set(
      b.eleveId,
      b.moyenneGenerale != null ? Number(b.moyenneGenerale) : null,
    );
  }

  const eleves: EleveListDTO[] = res.eleves.map((e) => ({
    id: e.id,
    matricule: e.matricule,
    prenom: e.prenom,
    nom: e.nom,
    classe: e.inscriptions[0]?.classe?.nom ?? "—",
    statut: statutLisible(e.statut),
    moyenneGenerale: moyenneParEleve.get(e.id) ?? null,
    soldeDu: soldeParEleve.get(e.id) ?? 0,
  }));

  return { eleves, total: res.total, page: res.page, pages: res.pages };
}

// ─────────────────────────────────────────────────────────────
// Détail
// ─────────────────────────────────────────────────────────────

export const getEleveDetailDTO = cache(
  async (id: string): Promise<EleveDetailDTO> => {
    const ctx = await requireContext();
    requirePermission(ctx.role, "eleve:view");

    const eleve = await trouverEleveParId(id, ctx.etablissementId);
    if (!eleve) notFound();

    const [notes, presences, paiements, documents] = await Promise.all([
      prisma.note.findMany({
        where: {
          eleveId: id,
          evaluation: { etablissementId: ctx.etablissementId },
        },
        include: {
          evaluation: {
            include: {
              matiere: { include: { niveaux: true } },
            },
          },
        },
      }),
      prisma.presence.findMany({
        where: {
          eleveId: id,
          statut: { in: ["absent", "retard"] },
          classe: { etablissementId: ctx.etablissementId },
        },
        include: { seance: { include: { matiere: true } } },
        orderBy: { createdAt: "desc" },
      }),
      trouverPaiementsEleve(id, ctx.etablissementId),
      prisma.documentEleve.findMany({ where: { eleveId: id } }),
    ]);

    // Résultats agrégés par matière (notes ramenées sur 20).
    const parMatiere = new Map<
      string,
      { somme: number; nb: number; coefficient: number }
    >();
    for (const n of notes) {
      if (n.valeur == null || n.absent || n.dispense) continue;
      const bareme = Number(n.evaluation.noteMaximale) || 20;
      const sur20 = (Number(n.valeur) / bareme) * 20;
      const nom = n.evaluation.matiere.nom;
      const coef = Number(n.evaluation.matiere.niveaux[0]?.coefficient ?? 1);
      const cur = parMatiere.get(nom) ?? { somme: 0, nb: 0, coefficient: coef };
      cur.somme += sur20;
      cur.nb += 1;
      parMatiere.set(nom, cur);
    }
    const resultats = [...parMatiere.entries()].map(([matiere, v]) => {
      const moyenne = v.nb ? Math.round((v.somme / v.nb) * 100) / 100 : 0;
      return {
        matiere,
        coefficient: v.coefficient,
        note: moyenne,
        bareme: 20,
        appreciation: appreciation(moyenne),
      };
    });

    const parent = eleve.parents[0]?.parent;
    const insc = eleve.inscriptions[0];
    const soldeDu = await soldeEleve(id, ctx.etablissementId);

    return {
      id: eleve.id,
      matricule: eleve.matricule,
      firstName: eleve.prenom,
      lastName: eleve.nom,
      classe: insc?.classe?.nom ?? "—",
      classeId: insc?.classeId ?? null,
      statut: statutLisible(eleve.statut),
      soldeDu,
      dateNaissance: formatDateLongue(eleve.dateNaissance),
      dateNaissanceISO: eleve.dateNaissance
        ? eleve.dateNaissance.toISOString().slice(0, 10)
        : null,
      dateInscription: formatDateLongue(insc?.dateInscription ?? eleve.createdAt),
      adresse: eleve.adresse,
      sexe: eleve.sexe === "M" || eleve.sexe === "F" ? eleve.sexe : null,
      nationalite: eleve.nationalite,
      lieuNaissance: eleve.lieuNaissance,
      parent: parent ? `${parent.prenom} ${parent.nom}` : "—",
      parentId: parent?.id ?? null,
      parentTelephone: parent?.telephone ?? "—",
      parentEmail: parent?.email ?? "—",
      parentAUnCompte: !!parent?.utilisateurId,
      documents: documents.map((d) => d.nom),
      resultats,
      absences: presences.map((p) => ({
        date: formatDateLongue(p.createdAt),
        type: p.statut === "retard" ? "Retard" : "Absence",
        motif: p.motif ?? "—",
        justifie: p.justifie,
      })),
      paiements: paiements
        .filter((p) => p.statut === "valide")
        .map((p) => ({
          recu: p.numeroRecu,
          date: formatDateLongue(p.createdAt),
          montant: Number(p.montant),
          mode: MODE_LISIBLE[p.modePaiement] ?? p.modePaiement,
          statut: "Payé" as const,
        })),
    };
  },
);

async function soldeEleve(eleveId: string, etablissementId: string): Promise<number> {
  const agg = await prisma.fraisEleve.aggregate({
    where: { inscription: { eleveId, etablissementId } },
    _sum: { montantDu: true, montantPaye: true },
  });
  return Math.max(
    0,
    Number(agg._sum.montantDu ?? 0) - Number(agg._sum.montantPaye ?? 0),
  );
}
