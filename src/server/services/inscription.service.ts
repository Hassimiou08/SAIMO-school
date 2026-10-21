import { prisma } from "@/lib/prisma";
import { audit, AuditAction, AuditEntite } from "@/server/logs/audit";
import { genererMatricule } from "@/server/services/eleve.service";
import { trouverOuCreerParent, relierParentEleve } from "@/server/services/parent.service";

/** Un enfant d'une demande de pré-inscription. */
export interface EnfantPreInscription {
  prenomEleve: string;
  nomEleve: string;
  dateNaissance?: Date;
  sexe?: string;
  niveauId?: string;
  niveauSouhaite?: string;
}

/** Demande déposée par une famille : un responsable, un ou plusieurs enfants. */
export interface DemandePreInscription {
  etablissementId: string;
  anneeScolaireId: string;
  enfants: EnfantPreInscription[];
  prenomTuteur?: string;
  nomTuteur?: string;
  telephone: string;
  email?: string;
  message?: string;
}

/** Configuration publique du tunnel de pré-inscription d'une école (année active, niveaux proposés). */
export async function getConfigPreInscriptionPublique(etablissementId: string) {
  const etablissement = await prisma.etablissement.findFirst({
    where: { actif: true, id: etablissementId },
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

/**
 * Enregistre une demande : une pré-inscription par enfant.
 * Les enfants d'une même demande partagent la racine de leur référence
 * (PRE-XXXX-1, PRE-XXXX-2…), ce qui permet au portail de les regrouper en fratrie.
 */
export async function creerPreInscriptions(data: DemandePreInscription) {
  const racine = `PRE-${Date.now().toString(36).toUpperCase().slice(-6)}${Math.random().toString(36).slice(2, 4).toUpperCase()}`;
  const plusieurs = data.enfants.length > 1;

  const crees = await prisma.$transaction(
    data.enfants.map((e, i) =>
      prisma.preInscription.create({
        data: {
          etablissementId: data.etablissementId,
          anneeScolaireId: data.anneeScolaireId,
          niveauId: e.niveauId ?? null,
          reference: plusieurs ? `${racine}-${i + 1}` : racine,
          prenomEleve: e.prenomEleve,
          nomEleve: e.nomEleve,
          dateNaissance: e.dateNaissance ?? null,
          sexe: e.sexe ?? null,
          niveauSouhaite: e.niveauSouhaite ?? null,
          prenomTuteur: data.prenomTuteur ?? null,
          nomTuteur: data.nomTuteur ?? null,
          telephone: data.telephone,
          email: data.email ?? null,
          message: data.message ?? null,
          statut: "nouvelle",
        },
        select: { reference: true },
      }),
    ),
  );

  return { reference: racine, references: crees.map((c) => c.reference) };
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
