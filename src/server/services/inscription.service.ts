import { prisma } from "@/lib/prisma";

export interface PreInscriptionInput {
  etablissementId: string;
  prenom: string;
  nom: string;
  telephoneContact: string;
  niveauSouhaiteId: string;
  anneeScolaireId: string;
}

export async function creerPreInscription(data: PreInscriptionInput) {
  // Génération d'un matricule temporaire "PRE-..."
  const matriculeTemporaire = `PRE-${Date.now().toString().slice(-6)}`;

  // Transaction pour créer l'élève et l'inscription
  const resultat = await prisma.$transaction(async (tx) => {
    const eleve = await tx.eleve.create({
      data: {
        etablissementId: data.etablissementId,
        matricule: matriculeTemporaire,
        prenom: data.prenom,
        nom: data.nom,
        statut: "en_attente",
      },
    });

    const inscription = await tx.inscription.create({
      data: {
        eleveId: eleve.id,
        anneeScolaireId: data.anneeScolaireId,
        classeId: data.niveauSouhaiteId, // Stocké temporairement ici
        etablissementId: data.etablissementId,
        statut: "en_attente",
        typeInscription: "nouvelle",
        observations: `Contact Parent: ${data.telephoneContact}`,
      },
    });

    return { eleve, inscription };
  });

  return { reference: matriculeTemporaire };
}

export async function validerPreInscription(inscriptionId: string, classeIdDefinitive: string, valideParId: string) {
  // Le contrôleur pour transformer la pré-inscription en inscription réelle
  const inscription = await prisma.inscription.update({
    where: { id: inscriptionId },
    data: {
      statut: "active",
      classeId: classeIdDefinitive,
      inscritParId: valideParId,
    },
    include: { eleve: true }
  });

  // Mettre à jour le statut de l'élève
  await prisma.eleve.update({
    where: { id: inscription.eleveId },
    data: { statut: "actif" }
  });

  return inscription;
}
