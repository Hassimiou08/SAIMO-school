import { prisma } from "@/lib/prisma";
import { audit, AuditAction, AuditEntite } from "@/server/logs/audit";
import { sendEmail } from "@/lib/brevo";
import { trouverOuCreerParent, relierParentEleve } from "@/server/services/parent.service";
import { creerFraisInscription } from "@/server/services/annee.service";
import {
  trouverEleveParMatricule,
  creerEleve,
  mettreAJourEleve,
  archiverEleve,
} from "@/server/repositories/eleve.repo";
import type { Prisma } from "@prisma/client";

// ─── Génération du matricule ──────────────────────────────────

export async function genererMatricule(
  etablissementId: string,
  anneeScolaireId: string
): Promise<string> {
  const annee = new Date().getFullYear();

  // Récupérer le format configuré
  const parametre = await prisma.parametre.findUnique({
    where: { etablissementId_cle: { etablissementId, cle: "format_matricule" } },
  });
  const format = parametre?.valeur ?? "ANNEE-SEQ";

  // Compter les élèves existants dans l'établissement cette année
  const count = await prisma.eleve.count({ where: { etablissementId } });
  const seq = String(count + 1).padStart(5, "0");

  return format.replace("ANNEE", String(annee)).replace("SEQ", seq);
}

// ─── Créer un élève ───────────────────────────────────────────

export interface CreerEleveInput {
  etablissementId: string;
  prenom: string;
  nom: string;
  dateNaissance?: Date;
  lieuNaissance?: string;
  sexe?: string;
  nationalite?: string;
  adresse?: string;
  anneeScolaireId: string;
  classeId: string;
  inscritParId?: string;
}

export async function creerNouvelEleve(input: CreerEleveInput) {
  const {
    etablissementId,
    anneeScolaireId,
    classeId,
    inscritParId,
    ...donnees
  } = input;

  // RM-03 : vérifier doublon (nom + prénom + dateNaissance dans l'établissement)
  if (donnees.dateNaissance) {
    const doublon = await prisma.eleve.findFirst({
      where: {
        etablissementId,
        prenom: donnees.prenom,
        nom: donnees.nom,
        dateNaissance: donnees.dateNaissance,
        statut: "actif",
      },
    });
    if (doublon) {
      throw new Error(
        `Un élève similaire existe déjà (matricule: ${doublon.matricule})`
      );
    }
  }

  const matricule = await genererMatricule(etablissementId, anneeScolaireId);

  // Transaction : créer élève + inscription
  const resultat = await prisma.$transaction(async (tx) => {
    const eleve = await tx.eleve.create({
      data: {
        etablissementId,
        matricule,
        prenom: donnees.prenom,
        nom: donnees.nom,
        dateNaissance: donnees.dateNaissance,
        lieuNaissance: donnees.lieuNaissance,
        sexe: donnees.sexe,
        nationalite: donnees.nationalite,
        adresse: donnees.adresse,
      },
    });

    // RM-03 : inscription unique par année/établissement
    const inscription = await tx.inscription.create({
      data: {
        eleveId: eleve.id,
        anneeScolaireId,
        classeId,
        etablissementId,
        typeInscription: "nouvelle",
        inscritParId,
      },
    });

    return { eleve, inscription };
  });

  // RM-14 : journal d'audit
  await audit({
    utilisateurId: inscritParId,
    etablissementId,
    action: AuditAction.CREATE,
    entite: AuditEntite.ELEVE,
    entiteId: resultat.eleve.id,
    apres: { matricule, prenom: donnees.prenom, nom: donnees.nom },
  });

  return resultat;
}

// ─── Inscription complète (élève + tuteur + frais) ───────────

export interface InscriptionCompleteInput extends CreerEleveInput {
  tuteurPrenom?: string;
  tuteurNom?: string;
  tuteurTelephone?: string;
  tuteurEmail?: string;
  tuteurLien?: string;
}

export async function inscrireEleveComplet(input: InscriptionCompleteInput) {
  const { etablissementId, anneeScolaireId, classeId, inscritParId } = input;

  // RM-03 : doublon
  if (input.dateNaissance) {
    const doublon = await prisma.eleve.findFirst({
      where: {
        etablissementId,
        prenom: input.prenom,
        nom: input.nom,
        dateNaissance: input.dateNaissance,
        statut: "actif",
      },
    });
    if (doublon) {
      throw new Error(`Un élève similaire existe déjà (matricule ${doublon.matricule})`);
    }
  }

  const matricule = await genererMatricule(etablissementId, anneeScolaireId);

  const resultat = await prisma.$transaction(async (tx) => {
    const eleve = await tx.eleve.create({
      data: {
        etablissementId,
        matricule,
        prenom: input.prenom,
        nom: input.nom,
        dateNaissance: input.dateNaissance,
        lieuNaissance: input.lieuNaissance,
        sexe: input.sexe,
        nationalite: input.nationalite,
        adresse: input.adresse,
      },
    });

    const inscription = await tx.inscription.create({
      data: {
        eleveId: eleve.id,
        anneeScolaireId,
        classeId,
        etablissementId,
        typeInscription: "nouvelle",
        inscritParId,
      },
    });

    // Tuteur — réutilise la fiche existante si ce tuteur a déjà un autre enfant inscrit.
    if (input.tuteurPrenom && input.tuteurNom && input.tuteurTelephone) {
      const parent = await trouverOuCreerParent(tx, {
        prenom: input.tuteurPrenom,
        nom: input.tuteurNom,
        telephone: input.tuteurTelephone,
        email: input.tuteurEmail,
      });
      await relierParentEleve(tx, {
        parentId: parent.id,
        eleveId: eleve.id,
        lien: input.tuteurLien ?? "tuteur",
        principal: true,
      });
    }

    // Frais depuis les échéances du niveau de la classe
    const frais = await creerFraisInscription(tx, {
      inscriptionId: inscription.id,
      anneeScolaireId,
      etablissementId,
      classeId,
      type: "nouvelle",
    });

    return { eleve, inscription, frais };
  });

  await audit({
    utilisateurId: inscritParId,
    etablissementId,
    action: AuditAction.CREATE,
    entite: AuditEntite.ELEVE,
    entiteId: resultat.eleve.id,
    apres: { matricule, prenom: input.prenom, nom: input.nom, inscriptionComplete: true },
  });

  return resultat;
}

// La réinscription d'une année sur l'autre est dans annee.service (reinscrireEleves).

// ─── Archiver un élève (suppression logique) ──────────────────

export async function archiverUnEleve(
  eleveId: string,
  etablissementId: string,
  archivedParId?: string
) {
  // RM-13 : archivage logique, pas de suppression physique
  const eleve = await archiverEleve(eleveId, etablissementId);

  await audit({
    utilisateurId: archivedParId,
    etablissementId,
    action: AuditAction.ARCHIVE,
    entite: AuditEntite.ELEVE,
    entiteId: eleveId,
  });

  return eleve;
}
