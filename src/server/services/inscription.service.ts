import { prisma } from "@/lib/prisma";
import { audit, AuditAction, AuditEntite } from "@/server/logs/audit";
import { genererMatricule } from "@/server/services/eleve.service";
import { trouverOuCreerParent, relierParentEleve } from "@/server/services/parent.service";

export interface PreInscriptionInput {
  etablissementId: string;
  anneeScolaireId: string;
  niveauId?: string;
  niveauSouhaite?: string;
  prenomEleve: string;
  nomEleve: string;
  dateNaissance?: Date;
  sexe?: string;
  prenomTuteur?: string;
  nomTuteur?: string;
  telephone: string;
  email?: string;
  message?: string;
}

/** Config publique du tunnel de pré-inscription (établissement pilote). */
export async function getConfigPreInscriptionPublique() {
  const etablissement = await prisma.etablissement.findFirst({
    where: { actif: true },
    orderBy: { createdAt: "asc" },
  });
  if (!etablissement) return null;

  const annee = await prisma.anneeScolaire.findFirst({
    where: { etablissementId: etablissement.id, active: true },
    orderBy: { dateDebut: "desc" },
  });
  if (!annee) return null;

  const niveaux = await prisma.niveau.findMany({
    where: { cycle: { etablissementId: etablissement.id } },
    include: { cycle: true },
    orderBy: [{ cycle: { ordre: "asc" } }, { ordre: "asc" }],
  });

  return {
    etablissementId: etablissement.id,
    etablissementNom: etablissement.nom,
    anneeScolaireId: annee.id,
    anneeLibelle: annee.libelle,
    niveaux: niveaux.map((n) => ({ id: n.id, nom: n.nom, cycle: n.cycle.nom })),
  };
}

export async function creerPreInscription(data: PreInscriptionInput) {
  const reference = `PRE-${Date.now().toString(36).toUpperCase().slice(-8)}`;

  await prisma.preInscription.create({
    data: {
      etablissementId: data.etablissementId,
      anneeScolaireId: data.anneeScolaireId,
      niveauId: data.niveauId ?? null,
      reference,
      prenomEleve: data.prenomEleve,
      nomEleve: data.nomEleve,
      dateNaissance: data.dateNaissance ?? null,
      sexe: data.sexe ?? null,
      niveauSouhaite: data.niveauSouhaite ?? null,
      prenomTuteur: data.prenomTuteur ?? null,
      nomTuteur: data.nomTuteur ?? null,
      telephone: data.telephone,
      email: data.email ?? null,
      message: data.message ?? null,
      statut: "nouvelle",
    },
  });

  return { reference };
}

/**
 * Convertit une pré-inscription acceptée en élève + inscription réels.
 */
export async function convertirPreInscription(input: {
  preInscriptionId: string;
  classeId: string;
  etablissementId: string;
  valideParId: string;
}) {
  const pre = await prisma.preInscription.findFirst({
    where: { id: input.preInscriptionId, etablissementId: input.etablissementId },
  });
  if (!pre) throw new Error("Pré-inscription introuvable");
  if (pre.statut === "convertie") throw new Error("Déjà convertie");

  const matricule = await genererMatricule(input.etablissementId, pre.anneeScolaireId);

  const resultat = await prisma.$transaction(async (tx) => {
    const eleve = await tx.eleve.create({
      data: {
        etablissementId: input.etablissementId,
        matricule,
        prenom: pre.prenomEleve,
        nom: pre.nomEleve,
        dateNaissance: pre.dateNaissance,
        sexe: pre.sexe,
      },
    });

    const inscription = await tx.inscription.create({
      data: {
        eleveId: eleve.id,
        anneeScolaireId: pre.anneeScolaireId,
        classeId: input.classeId,
        etablissementId: input.etablissementId,
        typeInscription: "nouvelle",
        inscritParId: input.valideParId,
        observations: `Issu de la pré-inscription ${pre.reference}`,
      },
    });

    if (pre.nomTuteur && pre.prenomTuteur) {
      const parent = await trouverOuCreerParent(tx, {
        prenom: pre.prenomTuteur,
        nom: pre.nomTuteur,
        telephone: pre.telephone,
        email: pre.email,
      });
      await relierParentEleve(tx, { parentId: parent.id, eleveId: eleve.id, lien: "tuteur" });
    }

    // Frais depuis les échéances du niveau de la classe
    const classe = await tx.classe.findUnique({
      where: { id: input.classeId },
      select: { niveauId: true },
    });
    const echeances = await tx.echeance.findMany({
      where: {
        anneeScolaireId: pre.anneeScolaireId,
        typeFrais: { etablissementId: input.etablissementId },
        OR: [{ niveauId: classe?.niveauId ?? undefined }, { niveauId: null }],
      },
    });
    for (const e of echeances) {
      await tx.fraisEleve.create({
        data: { inscriptionId: inscription.id, echeanceId: e.id, montantDu: e.montant },
      });
    }

    await tx.preInscription.update({
      where: { id: pre.id },
      data: { statut: "convertie", eleveId: eleve.id, traiteeParId: input.valideParId },
    });

    return { eleve, inscription };
  });

  await audit({
    utilisateurId: input.valideParId,
    etablissementId: input.etablissementId,
    action: AuditAction.CREATE,
    entite: AuditEntite.INSCRIPTION,
    entiteId: resultat.inscription.id,
    apres: { matricule, source: "pre-inscription", reference: pre.reference },
  });

  return resultat;
}
