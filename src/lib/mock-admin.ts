// Emploi du Temps
export const seances = [
  { id: "s1", classe: "6eme A", matiere: "Mathematiques", enseignant: "M. Camara", jour: "Lundi",    heureDebut: "08:00", heureFin: "09:00", salle: "S-101" },
  { id: "s2", classe: "6eme A", matiere: "Francais",      enseignant: "Mme Sylla", jour: "Lundi",    heureDebut: "09:00", heureFin: "10:00", salle: "S-101" },
  { id: "s3", classe: "5eme B", matiere: "Physique",      enseignant: "M. Diallo", jour: "Mardi",    heureDebut: "10:00", heureFin: "11:00", salle: "S-103" },
  { id: "s4", classe: "Terminale SM", matiere: "Philosophie", enseignant: "Mme Barry", jour: "Mercredi", heureDebut: "08:00", heureFin: "09:30", salle: "L-201" },
  { id: "s5", classe: "6eme B", matiere: "Histoire",      enseignant: "M. Sow",    jour: "Jeudi",    heureDebut: "14:00", heureFin: "15:00", salle: "S-102" },
  { id: "s6", classe: "11eme SS", matiere: "Anglais",     enseignant: "Mme Keita", jour: "Vendredi", heureDebut: "11:00", heureFin: "12:00", salle: "L-202" },
];

// Matieres
export const matieres = [
  { id: "m1", nom: "Mathematiques", code: "MATH",  niveaux: ["6eme", "5eme", "Terminale"], coefficient: 4, actif: true },
  { id: "m2", nom: "Francais",      code: "FR",    niveaux: ["6eme", "5eme"],              coefficient: 3, actif: true },
  { id: "m3", nom: "Physique",      code: "PHY",   niveaux: ["5eme", "Terminale"],         coefficient: 3, actif: true },
  { id: "m4", nom: "Histoire-Geo",  code: "HG",    niveaux: ["6eme", "5eme"],              coefficient: 2, actif: true },
  { id: "m5", nom: "Anglais",       code: "ANG",   niveaux: ["6eme", "5eme", "11eme"],     coefficient: 2, actif: true },
  { id: "m6", nom: "Philosophie",   code: "PHILO", niveaux: ["Terminale"],                 coefficient: 3, actif: false },
  { id: "m7", nom: "Chimie",        code: "CHIM",  niveaux: ["Terminale", "11eme"],        coefficient: 3, actif: true },
];

// Affectations
export const affectations = [
  { id: "a1", enseignant: "M. Camara",  specialite: "Mathematiques", classe: "6eme A",       matiere: "Mathematiques", profPrincipal: true,  annee: "2026-2027" },
  { id: "a2", enseignant: "Mme Sylla",  specialite: "Francais",      classe: "6eme A",       matiere: "Francais",      profPrincipal: false, annee: "2026-2027" },
  { id: "a3", enseignant: "M. Diallo",  specialite: "Physique",      classe: "5eme B",       matiere: "Physique",      profPrincipal: true,  annee: "2026-2027" },
  { id: "a4", enseignant: "Mme Barry",  specialite: "Philosophie",   classe: "Terminale SM", matiere: "Philosophie",   profPrincipal: true,  annee: "2026-2027" },
  { id: "a5", enseignant: "M. Sow",     specialite: "Histoire",      classe: "6eme B",       matiere: "Histoire-Geo",  profPrincipal: true,  annee: "2026-2027" },
  { id: "a6", enseignant: "Mme Keita",  specialite: "Anglais",       classe: "11eme SS",     matiere: "Anglais",       profPrincipal: false, annee: "2026-2027" },
];

// Cycles et Niveaux
export const cycles = [
  { id: "c1", nom: "Primaire", ordre: 1, niveaux: [
    { id: "n1", nom: "CP", ordre: 1 }, { id: "n2", nom: "CE1", ordre: 2 },
    { id: "n3", nom: "CE2", ordre: 3 }, { id: "n4", nom: "CM1", ordre: 4 }, { id: "n5", nom: "CM2", ordre: 5 },
  ]},
  { id: "c2", nom: "College", ordre: 2, niveaux: [
    { id: "n6", nom: "6eme", ordre: 1 }, { id: "n7", nom: "5eme", ordre: 2 },
    { id: "n8", nom: "4eme", ordre: 3 }, { id: "n9", nom: "3eme", ordre: 4 },
  ]},
  { id: "c3", nom: "Lycee", ordre: 3, niveaux: [
    { id: "n10", nom: "2nde", ordre: 1 }, { id: "n11", nom: "1ere", ordre: 2 }, { id: "n12", nom: "Terminale", ordre: 3 },
  ]},
];

// Annonces
export const annonces = [
  { id: "an1", titre: "Rentrée scolaire 2026-2027", cible: "Tous", cibles: ["Parents", "Élèves", "Enseignants"], contenu: "La rentrée aura lieu le lundi 15 septembre. Merci de finaliser les réinscriptions avant le 30 août.", date: "2026-08-15", statut: "Publiee", publie: true, auteur: "Direction" },
  { id: "an2", titre: "Réunion parents d'élèves", cible: "Parents", cibles: ["Parents"], contenu: "Réunion de présentation des équipes pédagogiques le samedi 5 septembre à 9h au réfectoire.", date: "2026-09-05", statut: "Programmee", publie: false, auteur: "Directeur" },
  { id: "an3", titre: "Examens de mi-trimestre", cible: "Eleves", cibles: ["Élèves"], contenu: "Les compositions de mi-trimestre se dérouleront du 20 au 24 octobre. Le calendrier détaillé sera affiché.", date: "2026-10-20", statut: "Brouillon", publie: false, auteur: "Scolarite" },
];

// Journal Audit
export const auditLogs = [
  { id: "au1", action: "CREATE", entite: "Classe", ressource: "Classe 6eme A", detail: "Création de la classe 6ème A", utilisateur: "Admin Soumah", date: "2026-08-20T09:00:00Z", ip: "192.168.1.1" },
  { id: "au2", action: "UPDATE", entite: "Note", ressource: "Note Maths - Aliou", detail: "Note modifiée : 12 → 14", utilisateur: "M. Camara", date: "2026-08-20T10:15:00Z", ip: "192.168.1.5" },
  { id: "au3", action: "DELETE", entite: "Seance", ressource: "Seance Vendredi", detail: "Séance du vendredi supprimée", utilisateur: "Admin Soumah", date: "2026-08-20T11:30:00Z", ip: "192.168.1.1" },
  { id: "au4", action: "CREATE", entite: "Paiement", ressource: "Paiement - Fatou Bah", detail: "Encaissement 150 000 GNF (reçu REC-2026-0842)", utilisateur: "Comptable", date: "2026-08-21T08:00:00Z", ip: "192.168.1.8" },
  { id: "au5", action: "UPDATE", entite: "Utilisateur", ressource: "Profil Enseignant", detail: "Téléphone mis à jour", utilisateur: "Admin Soumah", date: "2026-08-21T09:30:00Z", ip: "192.168.1.1" },
];

// Reçus de paiement (historique)
export const recus = [
  { id: "re1", numero: "REC-2026-0838", eleve: "Fatou Bah", classe: "6ème A", montant: 150000, date: "2026-08-21T08:00:00Z", mode: "Espèces", statut: "Envoyé" },
  { id: "re2", numero: "REC-2026-0839", eleve: "Aliou Diallo", classe: "5ème A", montant: 200000, date: "2026-08-21T09:10:00Z", mode: "Orange Money", statut: "Envoyé" },
  { id: "re3", numero: "REC-2026-0840", eleve: "Mariama Sow", classe: "4ème A", montant: 175000, date: "2026-08-22T10:30:00Z", mode: "Virement", statut: "Non envoyé" },
  { id: "re4", numero: "REC-2026-0841", eleve: "Ibrahima Camara", classe: "6ème B", montant: 150000, date: "2026-08-22T11:45:00Z", mode: "Espèces", statut: "Envoyé" },
];

// Utilisateurs
export const utilisateurs = [
  { id: "u1", nom: "Ibrahima Soumah", email: "i.soumah@saimo.edu", role: "Admin_Super",     statut: "Actif",   dernierAcces: "2026-08-21T08:00:00Z" },
  { id: "u2", nom: "Fatoumata Bah",   email: "f.bah@saimo.edu",    role: "Comptable",       statut: "Actif",   dernierAcces: "2026-08-21T07:45:00Z" },
  { id: "u3", nom: "M. Camara",       email: "camara@saimo.edu",   role: "Enseignant",      statut: "Actif",   dernierAcces: "2026-08-20T16:00:00Z" },
  { id: "u4", nom: "K. Diallo",       email: "k.diallo@saimo.edu", role: "Admin_Scolarite", statut: "Inactif", dernierAcces: "2026-07-15T10:00:00Z" },
];

// Remises
export const remises = [
  { id: "r1", eleve: "Aicha Keita",  classe: "6eme A",       motif: "Excellence",   montant: 200000, accordePar: "Directeur", date: "2026-08-18T00:00:00Z" },
  { id: "r2", eleve: "Omar Barry",   classe: "5eme B",       motif: "Cas social",   montant: 500000, accordePar: "Directeur", date: "2026-08-10T00:00:00Z" },
  { id: "r3", eleve: "Rougui Balde", classe: "Terminale SM", motif: "Bourse SAIMO", montant: 800000, accordePar: "Conseil",   date: "2026-09-01T00:00:00Z" },
];

// Messagerie
export type Message = {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
};

export type Conversation = {
  id: string;
  contactName: string;
  contactRole: string;
  lastMessage: string;
  lastMessageTime: string;
  unread: number;
  messages: Message[];
};

export const conversations: Conversation[] = [
  {
    id: "1",
    contactName: "Ousmane Conde",
    contactRole: "Parent d eleve - 6eme A",
    lastMessage: "Merci pour les informations.",
    lastMessageTime: "10:30",
    unread: 2,
    messages: [
      { id: "msg1", senderId: "other", text: "Bonjour, mon fils sera absent demain matin pour un rendez-vous medical.", timestamp: "10:00" },
      { id: "msg2", senderId: "me",    text: "Bonjour M. Conde. C est note. Merci de fournir un justificatif a son retour.", timestamp: "10:15" },
      { id: "msg3", senderId: "other", text: "Merci pour les informations. Je vous l enverrai par email.", timestamp: "10:30" },
    ],
  },
  {
    id: "2",
    contactName: "Aissatou Sylla",
    contactRole: "Prof. Principale - Terminale SM",
    lastMessage: "Les bulletins sont prets pour la validation.",
    lastMessageTime: "Hier",
    unread: 0,
    messages: [
      { id: "msg4", senderId: "other", text: "Les bulletins sont prets pour la validation. Vous pouvez les consulter sur la plateforme.", timestamp: "14:20" },
    ],
  },
  {
    id: "3",
    contactName: "M. Camara (Mathematiques)",
    contactRole: "Enseignant",
    lastMessage: "Pourrions-nous deplacer la seance de rattrapage ?",
    lastMessageTime: "Lun",
    unread: 1,
    messages: [
      { id: "msg5", senderId: "other", text: "Pourrions-nous deplacer la seance de rattrapage prevue ce vendredi ?", timestamp: "09:00" },
    ],
  },
];