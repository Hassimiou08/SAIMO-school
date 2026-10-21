import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import { audit, AuditAction, AuditEntite } from "@/server/logs/audit";

type Tx = Prisma.TransactionClient;

const normaliser = (v: string) =>
  v.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();

/**
 * Crée les frais d'une inscription à partir des échéances de l'année :
 * celles du niveau de la classe et celles communes à tous les niveaux.
 * Règle : un nouvel élève ne paie pas le type de frais « Réinscription »,
 * un élève réinscrit ne paie pas le type « Inscription ».
 */
export async function creerFraisInscription(
  tx: Tx,
  input: {
    inscriptionId: string;
    anneeScolaireId: string;
    etablissementId: string;
    classeId: string;
    type: "nouvelle" | "reinscription";
  },
) {
  const classe = await tx.classe.findUnique({ where: { id: input.classeId }, select: { niveauId: true } });
  const echeances = await tx.echeance.findMany({
    where: {
      anneeScolaireId: input.anneeScolaireId,
      typeFrais: { etablissementId: input.etablissementId },
      OR: [{ niveauId: classe?.niveauId ?? undefined }, { niveauId: null }],
    },
    include: { typeFrais: true },
    orderBy: { dateEcheance: "asc" },
  });
  const exclu = input.type === "nouvelle" ? "reinscription" : "inscription";

  const frais = [];
  for (const e of echeances) {
    if (normaliser(e.typeFrais.nom) === exclu) continue;
    const f = await tx.fraisEleve.create({
      data: { inscriptionId: input.inscriptionId, echeanceId: e.id, montantDu: e.montant },
    });
    frais.push({ id: f.id, libelle: e.libelle ?? e.typeFrais.nom, montantDu: Number(e.montant) });
  }
  return frais;
}

/**
 * Crée une nouvelle année scolaire (inactive). Peut reprendre les classes
 * d'une année existante et, avec elles, les affectations des enseignants.
 */
export async function creerAnneeScolaire(input: {
  etablissementId: string;
  libelle: string;
  dateDebut: Date;
  dateFin: Date;
  sourceAnneeId?: string;
  reprendreAffectations?: boolean;
  utilisateurId?: string;
}) {
  if (input.dateFin <= input.dateDebut) throw new Error("La date de fin doit suivre la date de début.");
  const existe = await prisma.anneeScolaire.findFirst({
    where: { etablissementId: input.etablissementId, libelle: input.libelle },
    select: { id: true },
  });
  if (existe) throw new Error(`L'année « ${input.libelle} » existe déjà.`);

  const resultat = await prisma.$transaction(async (tx) => {
    const annee = await tx.anneeScolaire.create({
      data: {
        etablissementId: input.etablissementId,
        libelle: input.libelle,
        dateDebut: input.dateDebut,
        dateFin: input.dateFin,
        active: false,
      },
    });

    let classes = 0;
    let affectations = 0;
    if (input.sourceAnneeId) {
      const sources = await tx.classe.findMany({
        where: { etablissementId: input.etablissementId, anneeScolaireId: input.sourceAnneeId },
        include: { affectationsEnseignants: true },
      });
      for (const c of sources) {
        const nouvelle = await tx.classe.create({
          data: {
            etablissementId: input.etablissementId,
            anneeScolaireId: annee.id,
            niveauId: c.niveauId,
            nom: c.nom,
            capacite: c.capacite,
            salle: c.salle,
          },
        });
        classes += 1;
        if (input.reprendreAffectations && c.affectationsEnseignants.length > 0) {
          const r = await tx.affectationEnseignant.createMany({
            data: c.affectationsEnseignants.map((a) => ({
              enseignantId: a.enseignantId,
              classeId: nouvelle.id,
              matiereId: a.matiereId,
              anneeScolaireId: annee.id,
              estProfPrincipal: a.estProfPrincipal,
            })),
            skipDuplicates: true,
          });
          affectations += r.count;
        }
      }
    }
    return { annee, classes, affectations };
  });

  await audit({
    utilisateurId: input.utilisateurId,
    etablissementId: input.etablissementId,
    action: AuditAction.CREATE,
    entite: "AnneeScolaire",
    entiteId: resultat.annee.id,
    apres: { libelle: input.libelle, classes: resultat.classes, affectations: resultat.affectations },
  });
  return resultat;
}

/** Fait de l'année indiquée l'année active de l'établissement (les autres deviennent inactives). */
export async function activerAnneeScolaire(input: { etablissementId: string; anneeId: string; utilisateurId?: string }) {
  const annee = await prisma.anneeScolaire.findFirst({
    where: { id: input.anneeId, etablissementId: input.etablissementId },
  });
  if (!annee) throw new Error("Année scolaire introuvable.");
  if (annee.active) return annee;

  await prisma.$transaction([
    prisma.anneeScolaire.updateMany({
      where: { etablissementId: input.etablissementId, active: true },
      data: { active: false },
    }),
    prisma.anneeScolaire.update({ where: { id: annee.id }, data: { active: true } }),
  ]);

  await audit({
    utilisateurId: input.utilisateurId,
    etablissementId: input.etablissementId,
    action: AuditAction.UPDATE,
    entite: "AnneeScolaire",
    entiteId: annee.id,
    apres: { active: true, libelle: annee.libelle },
  });
  return annee;
}

/**
 * Réinscrit des élèves dans une classe de l'année active et crée leurs frais.
 * Les élèves déjà inscrits cette année sont ignorés.
 */
export async function reinscrireEleves(input: {
  etablissementId: string;
  anneeScolaireId: string;
  classeId: string;
  eleveIds: string[];
  inscritParId?: string;
}) {
  const classe = await prisma.classe.findFirst({
    where: { id: input.classeId, etablissementId: input.etablissementId, anneeScolaireId: input.anneeScolaireId },
    select: { id: true, nom: true },
  });
  if (!classe) throw new Error("La classe choisie n'appartient pas à l'année active.");

  let reinscrits = 0;
  let dejaInscrits = 0;
  for (const eleveId of input.eleveIds) {
    const eleve = await prisma.eleve.findFirst({
      where: { id: eleveId, etablissementId: input.etablissementId },
      select: { id: true },
    });
    if (!eleve) continue;
    const existe = await prisma.inscription.findUnique({
      where: {
        eleveId_anneeScolaireId_etablissementId: {
          eleveId,
          anneeScolaireId: input.anneeScolaireId,
          etablissementId: input.etablissementId,
        },
      },
      select: { id: true },
    });
    if (existe) {
      dejaInscrits += 1;
      continue;
    }

    const inscription = await prisma.$transaction(async (tx) => {
      const insc = await tx.inscription.create({
        data: {
          eleveId,
          anneeScolaireId: input.anneeScolaireId,
          classeId: classe.id,
          etablissementId: input.etablissementId,
          typeInscription: "reinscription",
          inscritParId: input.inscritParId,
        },
      });
      await creerFraisInscription(tx, {
        inscriptionId: insc.id,
        anneeScolaireId: input.anneeScolaireId,
        etablissementId: input.etablissementId,
        classeId: classe.id,
        type: "reinscription",
      });
      return insc;
    });

    await audit({
      utilisateurId: input.inscritParId,
      etablissementId: input.etablissementId,
      action: AuditAction.CREATE,
      entite: AuditEntite.INSCRIPTION,
      entiteId: inscription.id,
      apres: { type: "reinscription", eleveId, classe: classe.nom },
    });
    reinscrits += 1;
  }
  return { reinscrits, dejaInscrits };
}
