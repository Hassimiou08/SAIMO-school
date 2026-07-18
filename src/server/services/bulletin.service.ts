import { prisma } from "@/lib/prisma";
import { audit, AuditAction, AuditEntite } from "@/server/logs/audit";
import { calculerMoyennesClasse } from "./notes.service";

// ─── Générer les bulletins d'une classe ──────────────────────────

export async function genererBulletinsClasse(
  classeId: string,
  periodeId: string,
  anneeScolaireId: string,
  etablissementId: string,
  genereParId: string
) {
  // 1. Calculer les moyennes via le service des notes
  const moyennes = await calculerMoyennesClasse(classeId, periodeId, etablissementId);

  if (moyennes.length === 0) {
    throw new Error("Aucune note valide trouvée pour cette classe à cette période");
  }

  // 2. Trier pour obtenir le rang
  moyennes.sort((a, b) => {
    if (a.moyenneMatiere === null) return 1;
    if (b.moyenneMatiere === null) return -1;
    return b.moyenneMatiere - a.moyenneMatiere;
  });

  const effectif = moyennes.length;
  let resultats = [];

  // 3. Enregistrer les bulletins en base
  for (let i = 0; i < effectif; i++) {
    const etudiant = moyennes[i];
    const rang = etudiant.moyenneMatiere !== null ? i + 1 : null;

    const bulletin = await prisma.bulletin.upsert({
      where: {
        eleveId_periodeId: { eleveId: etudiant.eleveId, periodeId },
      },
      create: {
        eleveId: etudiant.eleveId,
        classeId,
        periodeId,
        anneeScolaireId,
        moyenneGenerale: etudiant.moyenneMatiere,
        rang,
        effectifClasse: effectif,
        statut: "brouillon",
      },
      update: {
        classeId,
        anneeScolaireId,
        moyenneGenerale: etudiant.moyenneMatiere,
        rang,
        effectifClasse: effectif,
        statut: "brouillon", // Reset to draft if recalculated
      },
    });
    
    resultats.push(bulletin);
  }

  // Audit
  await audit({
    utilisateurId: genereParId,
    etablissementId,
    action: AuditAction.CREATE,
    entite: AuditEntite.BULLETIN,
    apres: { classeId, periodeId, nbBulletins: resultats.length },
  });

  return resultats;
}

// ─── Valider un bulletin ───────────────────────────────────────

export async function validerBulletin(
  bulletinId: string,
  valideParId: string,
  etablissementId: string
) {
  const bulletin = await prisma.bulletin.findUnique({
    where: { id: bulletinId },
    include: { eleve: true },
  });

  if (!bulletin) throw new Error("Bulletin introuvable");
  
  // RM-10 : Un bulletin ne peut être publié (ou validé) si les données obligatoires sont incomplètes
  if (bulletin.moyenneGenerale === null) {
    throw new Error("Impossible de valider un bulletin sans moyenne générale");
  }

  // Récupérer les notes de l'élève pour le snapshot
  const notesEleve = await prisma.note.findMany({
    where: {
      eleveId: bulletin.eleveId,
      evaluation: {
        periodeId: bulletin.periodeId,
      }
    },
    include: { evaluation: { include: { matiere: true } } }
  });

  const donneeSnapshot = {
    notes: notesEleve.map(n => ({
      matiere: n.evaluation.matiere.nom,
      valeur: n.valeur,
      noteMaximale: n.evaluation.noteMaximale,
    })),
    moyenneGenerale: bulletin.moyenneGenerale,
    rang: bulletin.rang,
    effectifClasse: bulletin.effectifClasse,
  };

  const bulletinValide = await prisma.bulletin.update({
    where: { id: bulletinId },
    data: {
      statut: "valide",
      valideParId,
      dateValidation: new Date(),
      donneeSnapshot, // RM-17 : Les documents générés doivent conserver la version des données
    },
  });

  await audit({
    utilisateurId: valideParId,
    etablissementId,
    action: AuditAction.VALIDATE,
    entite: AuditEntite.BULLETIN,
    entiteId: bulletinId,
    apres: { statut: "valide", valideParId },
  });

  return bulletinValide;
}
