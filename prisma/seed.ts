import "dotenv/config";
import { PrismaClient, type RoleUtilisateur } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";

// Prisma 7 : le client exige un driver adapter (comme src/lib/prisma.ts).
const pool = new Pool({
  connectionString: process.env.DIRECT_URL || process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

const MDP_DEMO = "Passer123!";
const CODE_ETABLISSEMENT = "SAIMO-PILOTE";
const LIBELLE_ANNEE = "2025-2026";

// ─────────────────────────────────────────────────────────────
// Données de référence
// ─────────────────────────────────────────────────────────────

const NIVEAUX = [
  { cycle: "Primaire", ordreCycle: 1, nom: "CM2", ordre: 5 },
  { cycle: "Collège", ordreCycle: 2, nom: "6ème", ordre: 1 },
  { cycle: "Collège", ordreCycle: 2, nom: "5ème", ordre: 2 },
  { cycle: "Collège", ordreCycle: 2, nom: "4ème", ordre: 3 },
];

const CLASSES = [
  { nom: "6ème A", niveau: "6ème", salle: "B12", capacite: 40 },
  { nom: "6ème B", niveau: "6ème", salle: "B13", capacite: 40 },
  { nom: "5ème A", niveau: "5ème", salle: "B21", capacite: 38 },
  { nom: "4ème A", niveau: "4ème", salle: "B31", capacite: 35 },
];

const MATIERES = [
  { nom: "Mathématiques", code: "MATH", coef: 4 },
  { nom: "Français", code: "FRAN", coef: 4 },
  { nom: "Histoire-Géographie", code: "HGEO", coef: 2 },
  { nom: "Sciences de la Vie et de la Terre", code: "SVT", coef: 2 },
  { nom: "Anglais", code: "ANGL", coef: 3 },
  { nom: "Éducation Physique et Sportive", code: "EPS", coef: 1 },
];

const ENSEIGNANTS = [
  { prenom: "Aïssatou", nom: "Barry", specialite: "Mathématiques", matieres: ["Mathématiques"], profPrincipalDe: "6ème A" },
  { prenom: "Ibrahima", nom: "Camara", specialite: "Lettres", matieres: ["Français", "Histoire-Géographie"], profPrincipalDe: "5ème A" },
  { prenom: "Mariama", nom: "Bah", specialite: "Sciences", matieres: ["Sciences de la Vie et de la Terre", "Mathématiques"], profPrincipalDe: "4ème A" },
  { prenom: "Sékou", nom: "Touré", specialite: "Langues", matieres: ["Anglais"], profPrincipalDe: "6ème B" },
  { prenom: "Fatoumata", nom: "Diallo", specialite: "EPS", matieres: ["Éducation Physique et Sportive"], profPrincipalDe: null },
];

const PRENOMS_M = ["Mamadou", "Ousmane", "Alpha", "Thierno", "Abdoulaye", "Mohamed", "Elhadj", "Boubacar", "Amadou", "Saïdou"];
const PRENOMS_F = ["Fatoumata", "Aïssatou", "Mariama", "Kadiatou", "Hadja", "Aminata", "Djénabou", "Ramatoulaye", "Néné", "Oumou"];
const NOMS = ["Diallo", "Barry", "Bah", "Sow", "Baldé", "Camara", "Touré", "Condé", "Sylla", "Keïta", "Cissé", "Soumah"];

const TYPES_FRAIS = [
  { nom: "Inscription", obligatoire: true, montant: 300_000 },
  { nom: "Scolarité", obligatoire: true, montant: 1_500_000 },
];

function h(n: number): number {
  // petit PRNG déterministe pour des données stables entre exécutions
  const x = Math.sin(n * 928.371) * 43758.5453;
  return x - Math.floor(x);
}

async function main() {
  const password = await bcrypt.hash(MDP_DEMO, 10);
  const adminEmail = process.env.SAIMO_ADMIN_EMAIL || "admin@saimo-ecole.com";
  const adminPassword = await bcrypt.hash("Password123!", 10);

  // ── Établissement ──────────────────────────────────────────
  const etab = await prisma.etablissement.upsert({
    where: { code: CODE_ETABLISSEMENT },
    update: {},
    create: {
      nom: "Groupe Scolaire SAIMO — Établissement Pilote",
      code: CODE_ETABLISSEMENT,
      telephone: "+224 620 00 00 00",
      email: "contact@saimo-ecole.gn",
      ville: "Conakry",
      pays: "Guinée",
      devise: "GNF",
    },
  });
  const etablissementId = etab.id;

  // ── Année scolaire + périodes ─────────────────────────────
  const annee = await prisma.anneeScolaire.upsert({
    where: { etablissementId_libelle: { etablissementId, libelle: LIBELLE_ANNEE } },
    update: { active: true },
    create: {
      etablissementId,
      libelle: LIBELLE_ANNEE,
      dateDebut: new Date("2025-10-01"),
      dateFin: new Date("2026-07-15"),
      active: true,
    },
  });
  const anneeScolaireId = annee.id;

  if ((await prisma.periode.count({ where: { anneeScolaireId } })) === 0) {
    await prisma.periode.createMany({
      data: [
        { anneeScolaireId, nom: "1er Trimestre", ordre: 1, dateDebut: new Date("2025-10-01"), dateFin: new Date("2025-12-20"), active: true },
        { anneeScolaireId, nom: "2ème Trimestre", ordre: 2, dateDebut: new Date("2026-01-06"), dateFin: new Date("2026-03-28") },
        { anneeScolaireId, nom: "3ème Trimestre", ordre: 3, dateDebut: new Date("2026-04-07"), dateFin: new Date("2026-07-10") },
      ],
    });
  }
  const periodes = await prisma.periode.findMany({ where: { anneeScolaireId }, orderBy: { ordre: "asc" } });
  const periodeT1 = periodes[0];

  // ── Comptes du personnel ─────────────────────────────────
  await prisma.utilisateur.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      motDePasseHash: adminPassword,
      prenom: "Mohamed Hassimiou",
      nom: "Soumah",
      emailVerifie: true,
      etablissements: { create: { etablissementId, role: "SUPER_ADMIN_SAIMO", actif: true } },
    },
  });

  async function creerStaff(prenom: string, nom: string, role: RoleUtilisateur) {
    const email =
      `${prenom}.${nom}`
        .toLowerCase()
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "") + "@saimo.gn";
    const u = await prisma.utilisateur.upsert({
      where: { email },
      update: { prenom, nom, motDePasseHash: password },
      create: { email, motDePasseHash: password, prenom, nom, emailVerifie: true },
    });
    // Lien établissement + rôle (idempotent, met à jour le rôle si besoin).
    await prisma.utilisateurEtablissement.upsert({
      where: { utilisateurId_etablissementId: { utilisateurId: u.id, etablissementId } },
      update: { role, actif: true },
      create: { utilisateurId: u.id, etablissementId, role, actif: true },
    });
    return u;
  }

  // Compte admin principal : ADMIN_ETABLISSEMENT = accès complet au portail.
  const directeur = await creerStaff("Mamadou", "Kaba", "ADMIN_ETABLISSEMENT");
  await creerStaff("Fatou", "Sylla", "DIRECTEUR");
  await creerStaff("Aminata", "Fofana", "SECRETAIRE");
  await creerStaff("Ibrahima", "Diané", "COMPTABLE");

  // ── Pédagogie : cycles / niveaux / classes / matières ─────
  const dejaStructure = (await prisma.classe.count({ where: { etablissementId, anneeScolaireId } })) > 0;

  const niveauxParNom = new Map<string, string>(); // nom -> id
  if (!dejaStructure) {
    for (const n of NIVEAUX) {
      const cycle = await prisma.cycle.upsert({
        where: { etablissementId_nom: { etablissementId, nom: n.cycle } },
        update: {},
        create: { etablissementId, nom: n.cycle, ordre: n.ordreCycle },
      });
      const niveau = await prisma.niveau.create({
        data: { cycleId: cycle.id, nom: n.nom, ordre: n.ordre },
      });
      niveauxParNom.set(n.nom, niveau.id);
    }
  } else {
    const niveaux = await prisma.niveau.findMany({ where: { cycle: { etablissementId } } });
    niveaux.forEach((nv) => niveauxParNom.set(nv.nom, nv.id));
  }

  const matieresParNom = new Map<string, string>();
  for (const m of MATIERES) {
    const mat = await prisma.matiere.upsert({
      where: { etablissementId_nom: { etablissementId, nom: m.nom } },
      update: {},
      create: { etablissementId, nom: m.nom, code: m.code },
    });
    matieresParNom.set(m.nom, mat.id);
    for (const [nomNiveau, niveauId] of niveauxParNom) {
      void nomNiveau;
      await prisma.matiereNiveau.upsert({
        where: { matiereId_niveauId: { matiereId: mat.id, niveauId } },
        update: { coefficient: m.coef },
        create: { matiereId: mat.id, niveauId, coefficient: m.coef },
      });
    }
  }

  const classesParNom = new Map<string, string>();
  for (const c of CLASSES) {
    const niveauId = niveauxParNom.get(c.niveau)!;
    const classe = await prisma.classe.upsert({
      where: { etablissementId_anneeScolaireId_nom: { etablissementId, anneeScolaireId, nom: c.nom } },
      update: {},
      create: {
        etablissementId,
        anneeScolaireId,
        niveauId,
        nom: c.nom,
        salle: c.salle,
        capacite: c.capacite,
      },
    });
    classesParNom.set(c.nom, classe.id);
  }

  // ── Enseignants + affectations ───────────────────────────
  for (const e of ENSEIGNANTS) {
    const u = await creerStaff(e.prenom, e.nom, "ENSEIGNANT");
    const ens = await prisma.enseignant.upsert({
      where: { utilisateurId: u.id },
      update: { specialite: e.specialite },
      create: { utilisateurId: u.id, etablissementId, specialite: e.specialite },
    });
    for (const nomMatiere of e.matieres) {
      const matiereId = matieresParNom.get(nomMatiere)!;
      for (const [nomClasse, classeId] of classesParNom) {
        const estPP = e.profPrincipalDe === nomClasse && nomMatiere === e.matieres[0];
        await prisma.affectationEnseignant.upsert({
          where: {
            enseignantId_classeId_matiereId_anneeScolaireId: {
              enseignantId: ens.id, classeId, matiereId, anneeScolaireId,
            },
          },
          update: { estProfPrincipal: estPP },
          create: { enseignantId: ens.id, classeId, matiereId, anneeScolaireId, estProfPrincipal: estPP },
        });
      }
    }
  }

  // ── Frais : types + échéances par niveau ─────────────────
  const echeancesParNiveau = new Map<string, { id: string; montant: number }[]>();
  for (const tf of TYPES_FRAIS) {
    const typeFrais = await prisma.typeFrais.upsert({
      where: { etablissementId_nom: { etablissementId, nom: tf.nom } },
      update: {},
      create: { etablissementId, nom: tf.nom, obligatoire: tf.obligatoire },
    });
    for (const [nomNiveau, niveauId] of niveauxParNom) {
      void nomNiveau;
      let ech = await prisma.echeance.findFirst({
        where: { typeFraisId: typeFrais.id, anneeScolaireId, niveauId },
      });
      if (!ech) {
        ech = await prisma.echeance.create({
          data: {
            typeFraisId: typeFrais.id,
            anneeScolaireId,
            niveauId,
            montant: tf.montant,
            libelle: `${tf.nom} ${LIBELLE_ANNEE}`,
            dateEcheance: tf.nom === "Inscription" ? new Date("2025-10-05") : new Date("2025-11-30"),
          },
        });
      }
      const list = echeancesParNiveau.get(niveauId) ?? [];
      list.push({ id: ech.id, montant: tf.montant });
      echeancesParNiveau.set(niveauId, list);
    }
  }

  // ── Type d'évaluation ────────────────────────────────────
  const typeCompo = await prisma.typeEvaluation.upsert({
    where: { etablissementId_nom: { etablissementId, nom: "Composition" } },
    update: {},
    create: { etablissementId, nom: "Composition", noteMaximale: 20 },
  });

  // ── Élèves + inscriptions + frais + paiements ────────────
  if ((await prisma.eleve.count({ where: { etablissementId } })) === 0) {
    let seq = 0;
    for (const c of CLASSES) {
      const classeId = classesParNom.get(c.nom)!;
      const niveauId = niveauxParNom.get(c.niveau)!;
      const echeances = echeancesParNiveau.get(niveauId) ?? [];

      for (let i = 0; i < 6; i++) {
        seq++;
        const idx = seq;
        const sexe = h(idx) > 0.5 ? "M" : "F";
        const prenom = sexe === "M"
          ? PRENOMS_M[Math.floor(h(idx * 2) * PRENOMS_M.length)]
          : PRENOMS_F[Math.floor(h(idx * 2) * PRENOMS_F.length)];
        const nom = NOMS[Math.floor(h(idx * 3) * NOMS.length)];
        const matricule = `${LIBELLE_ANNEE.slice(0, 4)}-${String(seq).padStart(5, "0")}`;

        const eleve = await prisma.eleve.create({
          data: {
            etablissementId,
            matricule,
            prenom,
            nom,
            sexe,
            nationalite: "Guinéenne",
            dateNaissance: new Date(2012 - (NIVEAUX.find((n) => n.nom === c.niveau)?.ordre ?? 1), (idx % 12), 1 + (idx % 27)),
            lieuNaissance: "Conakry",
          },
        });

        const inscription = await prisma.inscription.create({
          data: {
            eleveId: eleve.id,
            anneeScolaireId,
            classeId,
            etablissementId,
            typeInscription: "nouvelle",
            inscritParId: directeur.id,
          },
        });

        for (const ech of echeances) {
          // ~55% soldé, ~25% partiel, ~20% impayé
          const r = h(idx * 7 + ech.montant);
          const montantPaye = r > 0.45 ? ech.montant : r > 0.2 ? Math.round(ech.montant * 0.5) : 0;
          const statut = montantPaye >= ech.montant ? "solde" : montantPaye > 0 ? "partiel" : "impaye";

          const frais = await prisma.fraisEleve.create({
            data: {
              inscriptionId: inscription.id,
              echeanceId: ech.id,
              montantDu: ech.montant,
              montantPaye,
              statut,
            },
          });

          if (montantPaye > 0) {
            const numeroRecu = `REC-${LIBELLE_ANNEE.slice(0, 4)}-${String(seq).padStart(4, "0")}${ech.montant === 300_000 ? "I" : "S"}`;
            const paiement = await prisma.paiement.create({
              data: {
                fraisEleveId: frais.id,
                numeroRecu,
                montant: montantPaye,
                modePaiement: h(idx) > 0.5 ? "especes" : "mobile",
                statut: "valide",
                encaisseParId: directeur.id,
              },
            });
            await prisma.recu.create({ data: { paiementId: paiement.id, numero: numeroRecu } });
          }
        }
      }
    }
  }

  // ── Évaluation verrouillée + notes pour la 6ème A ────────
  const classe6A = classesParNom.get("6ème A")!;
  const matMath = matieresParNom.get("Mathématiques")!;
  if ((await prisma.evaluation.count({ where: { classeId: classe6A, periodeId: periodeT1.id } })) === 0) {
    const evaluation = await prisma.evaluation.create({
      data: {
        etablissementId,
        periodeId: periodeT1.id,
        classeId: classe6A,
        matiereId: matMath,
        typeEvaluationId: typeCompo.id,
        titre: "Composition n°1 — Mathématiques",
        dateEvaluation: new Date("2025-12-05"),
        noteMaximale: 20,
        statut: "verrouillee",
        creePar: directeur.id,
        valideePar: directeur.id,
        dateValidation: new Date("2025-12-12"),
      },
    });

    const eleves6A = await prisma.inscription.findMany({
      where: { classeId: classe6A, anneeScolaireId },
      select: { eleveId: true },
    });
    await prisma.note.createMany({
      data: eleves6A.map((e, i) => ({
        evaluationId: evaluation.id,
        eleveId: e.eleveId,
        valeur: Math.round((6 + h(i * 11) * 12) * 100) / 100,
        saisieParId: directeur.id,
      })),
    });
  }

  // ── Emploi du temps (quelques créneaux pour la 6ème A) ──
  if ((await prisma.creneauCours.count({ where: { etablissementId } })) === 0) {
    const matFr = matieresParNom.get("Français")!;
    const grille = [
      { jour: 1, hd: "08:00", hf: "09:00", matiereId: matMath, salle: "B12" },
      { jour: 1, hd: "09:00", hf: "10:00", matiereId: matFr, salle: "B12" },
      { jour: 2, hd: "08:00", hf: "09:00", matiereId: matieresParNom.get("Anglais")!, salle: "B12" },
      { jour: 3, hd: "10:00", hf: "11:00", matiereId: matMath, salle: "B12" },
      { jour: 4, hd: "08:00", hf: "09:00", matiereId: matieresParNom.get("Histoire-Géographie")!, salle: "B12" },
      { jour: 5, hd: "09:00", hf: "10:00", matiereId: matieresParNom.get("Sciences de la Vie et de la Terre")!, salle: "Labo 1" },
    ];
    await prisma.creneauCours.createMany({
      data: grille.map((g) => ({
        etablissementId,
        anneeScolaireId,
        classeId: classe6A,
        matiereId: g.matiereId,
        jour: g.jour,
        heureDebut: g.hd,
        heureFin: g.hf,
        salle: g.salle,
      })),
    });
  }

  // ── Parent lié à 2 enfants ──────────────────────────────
  const parentUser = await prisma.utilisateur.upsert({
    where: { email: "parent@saimo.gn" },
    update: {},
    create: {
      email: "parent@saimo.gn",
      motDePasseHash: password,
      prenom: "Ousmane",
      nom: "Condé",
      emailVerifie: true,
      etablissements: { create: { etablissementId, role: "PARENT", actif: true } },
    },
  });
  let parent = await prisma.parent.findUnique({ where: { utilisateurId: parentUser.id } });
  if (!parent) {
    parent = await prisma.parent.create({
      data: {
        utilisateurId: parentUser.id,
        prenom: "Ousmane",
        nom: "Condé",
        telephone: "+224 621 11 22 33",
        email: "parent@saimo.gn",
      },
    });
    const deuxEleves = await prisma.eleve.findMany({ where: { etablissementId }, take: 2, orderBy: { matricule: "asc" } });
    for (const [i, e] of deuxEleves.entries()) {
      await prisma.relationParentEleve.create({
        data: { parentId: parent.id, eleveId: e.id, lien: "pere", principal: i === 0 },
      });
    }
  }

  // ── Annonces ────────────────────────────────────────────
  if ((await prisma.annonce.count({ where: { etablissementId } })) === 0) {
    await prisma.annonce.createMany({
      data: [
        {
          etablissementId,
          titre: "Rentrée des classes",
          contenu: "La rentrée a lieu le lundi. Merci de récupérer les emplois du temps à l'accueil.",
          rolesVises: ["PARENT", "ELEVE", "ENSEIGNANT"],
          publie: true,
          datePublication: new Date("2025-10-01"),
          creePar: directeur.id,
        },
        {
          etablissementId,
          titre: "Réunion parents-professeurs",
          contenu: "Une réunion est prévue en fin de premier trimestre. Détails à venir.",
          rolesVises: ["PARENT"],
          publie: false,
          creePar: directeur.id,
        },
      ],
    });
  }

  // ── Journal d'audit (quelques entrées d'exemple) ────────
  if ((await prisma.journalAudit.count({ where: { etablissementId } })) === 0) {
    await prisma.journalAudit.createMany({
      data: [
        { etablissementId, utilisateurId: directeur.id, action: "CREATE", entite: "Classe", apres: { nom: "6ème A" } },
        { etablissementId, utilisateurId: directeur.id, action: "LOCK", entite: "Evaluation", apres: { titre: "Composition n°1" } },
        { etablissementId, utilisateurId: directeur.id, action: "CREATE", entite: "Annonce", apres: { titre: "Rentrée des classes" } },
      ],
    });
  }

  // ── Une conversation interne ───────────────────────────
  if ((await prisma.conversation.count({ where: { etablissementId } })) === 0) {
    const secretaire = await prisma.utilisateur.findUnique({ where: { email: "aminata.fofana@saimo.gn" } });
    if (secretaire) {
      await prisma.conversation.create({
        data: {
          etablissementId,
          sujet: "Dossiers d'inscription en attente",
          participants: {
            create: [
              { utilisateurId: directeur.id },
              { utilisateurId: secretaire.id, luJusquA: new Date() },
            ],
          },
          messages: {
            create: [
              { expediteurId: secretaire.id, contenu: "Bonjour, il reste 3 dossiers à valider pour la 6ème B." },
              { expediteurId: directeur.id, contenu: "Merci, je regarde ça cet après-midi." },
            ],
          },
        },
      });
    }
  }

  // ── Pré-inscriptions (demandes du site public) ─────────
  if ((await prisma.preInscription.count({ where: { etablissementId } })) === 0) {
    const niv6 = niveauxParNom.get("6ème");
    await prisma.preInscription.createMany({
      data: [
        {
          etablissementId, anneeScolaireId, niveauId: niv6 ?? null,
          reference: "PRE-DEMO0001",
          prenomEleve: "Awa", nomEleve: "Baldé", sexe: "F",
          niveauSouhaite: "6ème",
          prenomTuteur: "Sékou", nomTuteur: "Baldé",
          telephone: "+224 611 22 33 44", email: "sekou.balde@example.com",
          message: "Nous souhaitons une place en 6ème pour la rentrée.",
          statut: "nouvelle",
        },
        {
          etablissementId, anneeScolaireId, niveauId: niveauxParNom.get("CM2") ?? null,
          reference: "PRE-DEMO0002",
          prenomEleve: "Mamadou", nomEleve: "Sow", sexe: "M",
          niveauSouhaite: "CM2",
          prenomTuteur: "Aïcha", nomTuteur: "Sow",
          telephone: "+224 622 55 66 77",
          statut: "contactee",
        },
      ],
    });
  }

  const total = await prisma.eleve.count({ where: { etablissementId } });
  console.log("✔ Seed terminé.");
  console.log(`  Établissement : ${etab.nom}`);
  console.log(`  Année active  : ${annee.libelle}`);
  console.log(`  Élèves        : ${total}`);
  console.log("");
  console.log("  Comptes de démonstration (mot de passe commun : " + MDP_DEMO + ") :");
  console.log("   • Direction   : mamadou.kaba@saimo.gn");
  console.log("   • Secrétariat : aminata.fofana@saimo.gn");
  console.log("   • Comptable   : ibrahima.diane@saimo.gn");
  console.log("   • Enseignant  : aissatou.barry@saimo.gn");
  console.log("   • Parent      : parent@saimo.gn");
  console.log(`   • Super admin : ${adminEmail} (mot de passe : Password123!)`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
