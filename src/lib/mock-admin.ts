// ── Emploi du Temps ──
export const seances = [
  { id: "s1", classe: "6ème A", matiere: "Mathématiques", enseignant: "M. Camara", jour: "Lundi",    heureDebut: "08:00", heureFin: "09:00", salle: "S-101" },
  { id: "s2", classe: "6ème A", matiere: "Français",       enseignant: "Mme Sylla", jour: "Lundi",    heureDebut: "09:00", heureFin: "10:00", salle: "S-101" },
  { id: "s3", classe: "5ème B", matiere: "Physique",        enseignant: "M. Diallo", jour: "Mardi",    heureDebut: "10:00", heureFin: "11:00", salle: "S-103" },
  { id: "s4", classe: "Terminale SM", matiere: "Philosophie", enseignant: "Mme Barry", jour: "Mercredi", heureDebut: "08:00", heureFin: "09:30", salle: "L-201" },
  { id: "s5", classe: "6ème B", matiere: "Histoire",       enseignant: "M. Sow",    jour: "Jeudi",    heureDebut: "14:00", heureFin: "15:00", salle: "S-102" },
  { id: "s6", classe: "11ème SS", matiere: "Anglais",      enseignant: "Mme Keita", jour: "Vendredi", heureDebut: "11:00", heureFin: "12:00", salle: "L-202" },
];

// ── Matières ──
export const matieres = [
  { id: "m1", nom: "Mathématiques", code: "MATH", niveaux: ["6ème", "5ème", "Terminale"], coefficient: 4, actif: true },
  { id: "m2", nom: "Français",       code: "FR",   niveaux: ["6ème", "5ème"],              coefficient: 3, actif: true },
  { id: "m3", nom: "Physique",        code: "PHY",  niveaux: ["5ème", "Terminale"],         coefficient: 3, actif: true },
  { id: "m4", nom: "Histoire-Géo",   code: "HG",   niveaux: ["6ème", "5ème"],              coefficient: 2, actif: true },
  { id: "m5", nom: "Anglais",         code: "ANG",  niveaux: ["6ème", "5ème", "11ème"],    coefficient: 2, actif: true },
  { id: "m6", nom: "Philosophie",     code: "PHILO",niveaux: ["Terminale"],                 coefficient: 3, actif: false },
  { id: "m7", nom: "Chimie",          code: "CHIM", niveaux: ["Terminale", "11ème"],        coefficient: 3, actif: true },
];

// ── Affectations ──
export const affectations = [
  { id: "a1", enseignant: "M. Camara",  specialite: "Mathématiques", classe: "6ème A", matiere: "Mathématiques", profPrincipal: true,  annee: "2026-2027" },
  { id: "a2", enseignant: "Mme Sylla",  specialite: "Français",       classe: "6ème A", matiere: "Français",       profPrincipal: false, annee: "2026-2027" },
  { id: "a3", enseignant: "M. Diallo",  specialite: "Physique",        classe: "5ème B", matiere: "Physique",        profPrincipal: true,  annee: "2026-2027" },
  { id: "a4", enseignant: "Mme Barry",  specialite: "Philosophie",     classe: "Terminale SM", matiere: "Philosophie", profPrincipal: true, annee: "2026-2027" },
  { id: "a5", enseignant: "M. Sow",     specialite: "Histoire",        classe: "6ème B", matiere: "Histoire-Géo",  profPrincipal: true,  annee: "2026-2027" },
  { id: "a6", enseignant: "Mme Keita",  specialite: "Anglais",         classe: "11ème SS", matiere: "Anglais",      profPrincipal: false, annee: "2026-2027" },
];

// ── Annonces ──
export const annonces = [
  { id: "an1", titre: "Réunion parents-enseignants", contenu: "La réunion aura lieu le 30 août 2026 à 10h dans la salle polyvalente.", cibles: ["PARENT", "ENSEIGNANT"], publie: true,  date: "2026-08-18", auteur: "Direction" },
  { id: "an2", titre: "Fin des inscriptions",        contenu: "Les inscriptions ferment définitivement le 5 septembre 2026.",       cibles: ["PARENT"],              publie: true,  date: "2026-08-15", auteur: "Secrétariat" },
  { id: "an3", titre: "Résultats Trimestriels",      contenu: "Les bulletins du 1er trimestre sont disponibles sur le portail.",    cibles: ["PARENT", "ELEVE"],     publie: false, date: "",            auteur: "Administration" },
];

// ── Reçus ──
export const recus = [
  { id: "rec1", numero: "REC-2026-0001", eleve: "Fatoumata Barry",   classe: "6ème A", montant: 250000, date: "2026-08-05", mode: "Espèces",      statut: "Envoyé" },
  { id: "rec2", numero: "REC-2026-0002", eleve: "Aissatou Sow",      classe: "Terminale SM", montant: 300000, date: "2026-08-15", mode: "Virement", statut: "Envoyé" },
  { id: "rec3", numero: "REC-2026-0003", eleve: "Kadiatou Camara",   classe: "11ème SS", montant: 280000, date: "2026-08-01", mode: "Espèces",      statut: "Généré" },
  { id: "rec4", numero: "REC-2026-0004", eleve: "Ibrahima Diallo",   classe: "6ème A", montant: 100000, date: "2026-08-10", mode: "Orange Money", statut: "Envoyé" },
];

// ── Remises ──
export const remises = [
  { id: "rm1", eleve: "Ousmane Keita",   classe: "6ème B", motif: "Bourse d'excellence",  montant: 50000,  date: "2026-08-01", accordePar: "Directeur" },
  { id: "rm2", eleve: "Mamadou Sylla",   classe: "5ème B", motif: "Fratrie (3 enfants)",  montant: 30000,  date: "2026-08-02", accordePar: "Directeur" },
  { id: "rm3", eleve: "Aminata Traoré",  classe: "5ème A", motif: "Bourse sociale",       montant: 80000,  date: "2026-08-10", accordePar: "Secrétariat" },
];

// ── Utilisateurs ──
export const utilisateurs = [
  { id: "u1", nom: "Ibrahima Sory Soumah", email: "ibrahima@saimo.edu.gn", role: "ADMIN_ETABLISSEMENT", statut: "Actif",   dernierAcces: "2026-08-21" },
  { id: "u2", nom: "Fatoumata Barry",       email: "f.barry@saimo.edu.gn",  role: "DIRECTEUR",          statut: "Actif",   dernierAcces: "2026-08-20" },
  { id: "u3", nom: "Mamadou Diallo",        email: "m.diallo@saimo.edu.gn", role: "SECRETAIRE",         statut: "Actif",   dernierAcces: "2026-08-19" },
  { id: "u4", nom: "Aissatou Camara",       email: "a.camara@saimo.edu.gn", role: "COMPTABLE",          statut: "Actif",   dernierAcces: "2026-08-18" },
  { id: "u5", nom: "M. Camara",             email: "camara@saimo.edu.gn",   role: "ENSEIGNANT",         statut: "Inactif", dernierAcces: "2026-08-01" },
];

// ── Journal d'Audit ──
export const auditLogs = [
  { id: "au1", utilisateur: "Ibrahima Sory Soumah", action: "CREATE", entite: "Inscription", detail: "Nouvelle inscription : Fatoumata Barry en 6ème A", date: "2026-08-21T10:32:00Z" },
  { id: "au2", utilisateur: "Aissatou Camara",       action: "UPDATE", entite: "Paiement",    detail: "Paiement REC-2026-0001 validé — 250 000 GNF",       date: "2026-08-21T09:15:00Z" },
  { id: "au3", utilisateur: "Mamadou Diallo",        action: "DELETE", entite: "Note",        detail: "Note supprimée pour Ousmane Keita (Absences)",        date: "2026-08-20T14:00:00Z" },
  { id: "au4", utilisateur: "Fatoumata Barry",       action: "LOGIN",  entite: "Session",     detail: "Connexion depuis 196.x.x.x",                         date: "2026-08-20T08:00:00Z" },
  { id: "au5", utilisateur: "Ibrahima Sory Soumah", action: "VALIDATE", entite: "Bulletin",  detail: "Bulletin 1T validé pour 6ème A (32 élèves)",          date: "2026-08-19T16:45:00Z" },
];

// ── Cycles & Niveaux ──
export const cycles = [
  { id: "cy1", nom: "Primaire", ordre: 1, niveaux: [
    { id: "n1", nom: "CP1", ordre: 1 }, { id: "n2", nom: "CP2", ordre: 2 },
    { id: "n3", nom: "CE1", ordre: 3 }, { id: "n4", nom: "CE2", ordre: 4 },
  ]},
  { id: "cy2", nom: "Collège", ordre: 2, niveaux: [
    { id: "n5", nom: "6ème", ordre: 1 }, { id: "n6", nom: "5ème", ordre: 2 },
    { id: "n7", nom: "4ème", ordre: 3 }, { id: "n8", nom: "3ème", ordre: 4 },
  ]},
  { id: "cy3", nom: "Lycée", ordre: 3, niveaux: [
    { id: "n9", nom: "11ème", ordre: 1 }, { id: "n10", nom: "Terminale", ordre: 2 },
  ]},
];
