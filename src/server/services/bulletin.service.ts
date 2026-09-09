import { prisma } from "@/lib/prisma";
import { audit, AuditAction, AuditEntite } from "@/server/logs/audit";
import { calculerMoyennesClasse, calculerDetailParMatiere } from "./notes.service";

// ─── Générer les bulletins d'une classe ──────────────────────────

export async function genererBulletinsClasse(
  classeId: string,
  periodeId: string,
  anneeScolaireId: string,
  etablissementId: string,
  genereParId: string
) {
  // 0. Diagnostic préalable : messages d'erreur explicites selon l'état réel
  const [totalEvals, evalsVerrouillees] = await Promise.all([
    prisma.evaluation.count({ where: { classeId, periodeId, etablissementId } }),
    prisma.evaluation.count({
      where: { classeId, periodeId, etablissementId, statut: "verrouillee" },
    }),
  ]);

  if (totalEvals === 0) {
    throw new Error(
      "Aucune évaluation n'a été créée pour cette classe à cette période. Créez et notez des évaluations dans l'onglet Notes.",
    );
  }
  if (evalsVerrouillees === 0) {
    throw new Error(
      `${totalEvals} évaluation${totalEvals > 1 ? "s" : ""} trouvée${totalEvals > 1 ? "s" : ""}, mais aucune n'est verrouillée. Verrouillez les évaluations (onglet Notes) pour générer les bulletins.`,
    );
  }

  // 1. Calculer les moyennes via le service des notes
  const moyennes = await calculerMoyennesClasse(classeId, periodeId, etablissementId);

  if (moyennes.length === 0) {
    throw new Error(
      "Les évaluations verrouillées ne contiennent aucune note exploitable (élèves tous absents ou dispensés).",
    );
  }

  // 2. Trier pour obtenir le rang
  moyennes.sort((a, b) => {
    if (a.moyenneMatiere === null) return 1;
    if (b.moyenneMatiere === null) return -1;
    return b.moyenneMatiere - a.moyenneMatiere;
  });

  const effectif = moyennes.length;
  const resultats = [];

  // Détail par matière (moyenne /20 par matière et par élève) + rang par matière.
  const detailParEleve = await calculerDetailParMatiere(
    classeId,
    periodeId,
    etablissementId,
  );
  // Classement par matière sur l'ensemble de la classe.
  const rangsParMatiere = new Map<string, Map<string, number>>();
  {
    const parMatiere = new Map<string, { eleveId: string; moyenne: number }[]>();
    for (const [eleveId, lignes] of detailParEleve) {
      for (const l of lignes) {
        if (l.moyenne == null) continue;
        const arr = parMatiere.get(l.matiereId) ?? [];
        arr.push({ eleveId, moyenne: l.moyenne });
        parMatiere.set(l.matiereId, arr);
      }
    }
    for (const [matiereId, arr] of parMatiere) {
      arr.sort((a, b) => b.moyenne - a.moyenne);
      const m = new Map<string, number>();
      arr.forEach((x, idx) => m.set(x.eleveId, idx + 1));
      rangsParMatiere.set(matiereId, m);
    }
  }

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

    // Lignes par matière — l'appréciation manuelle éventuelle est préservée.
    const lignes = detailParEleve.get(etudiant.eleveId) ?? [];
    for (const l of lignes) {
      await prisma.moyenneMatiere.upsert({
        where: {
          bulletinId_matiereId: { bulletinId: bulletin.id, matiereId: l.matiereId },
        },
        create: {
          bulletinId: bulletin.id,
          matiereId: l.matiereId,
          coefficient: l.coefficient,
          moyenne: l.moyenne,
          rang: rangsParMatiere.get(l.matiereId)?.get(etudiant.eleveId) ?? null,
        },
        update: {
          coefficient: l.coefficient,
          moyenne: l.moyenne,
          rang: rangsParMatiere.get(l.matiereId)?.get(etudiant.eleveId) ?? null,
        },
      });
    }

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
