// ===== Donnees fictives pour le portail parent =====

export const parentInfo = {
  id: "p1",
  nom: "Ousmane Conde",
  email: "ousmane.conde@gmail.com",
  telephone: "+224 620 00 00 01",
  adresse: "Conakry, Ratoma",
};

export const enfantsList = [
  {
    id: "e1",
    nom: "Amadou Conde",
    prenom: "Amadou",
    classe: "6eme A",
    cycle: "College",
    matricule: "SAI-2026-0041",
    dateNaissance: "2014-03-15",
    photo: null,
    profPrincipal: "M. Camara",
    anneeScolaire: "2026-2027",
  },
  {
    id: "e2",
    nom: "Aissatou Conde",
    prenom: "Aissatou",
    classe: "Terminale SM",
    cycle: "Lycee",
    matricule: "SAI-2026-0042",
    dateNaissance: "2008-11-20",
    photo: null,
    profPrincipal: "Mme Sylla",
    anneeScolaire: "2026-2027",
  }
];

export const enfantInfo = enfantsList[0];

// ===== Notes par matiere =====
export type NoteParent = {
  id: string;
  matiere: string;
  coefficient: number;
  note1: number | null;
  note2: number | null;
  moyenne: number | null;
  appreciation: string;
};

export const notesParent: NoteParent[] = [
  { id: "n1", matiere: "Mathematiques", coefficient: 4, note1: 14,   note2: 16,   moyenne: 15,   appreciation: "Tres bien" },
  { id: "n2", matiere: "Francais",      coefficient: 3, note1: 12,   note2: 13,   moyenne: 12.5, appreciation: "Bien" },
  { id: "n3", matiere: "Physique",      coefficient: 3, note1: 11,   note2: 10,   moyenne: 10.5, appreciation: "Assez bien" },
  { id: "n4", matiere: "Histoire-Geo",  coefficient: 2, note1: 15,   note2: 14,   moyenne: 14.5, appreciation: "Bien" },
  { id: "n5", matiere: "Anglais",       coefficient: 2, note1: 9,    note2: 11,   moyenne: 10,   appreciation: "Passable" },
  { id: "n6", matiere: "Chimie",        coefficient: 3, note1: 13,   note2: 12,   moyenne: 12.5, appreciation: "Bien" },
  { id: "n7", matiere: "EPS",           coefficient: 1, note1: 17,   note2: 18,   moyenne: 17.5, appreciation: "Excellent" },
];

// ===== Absences =====
export type AbsenceParent = {
  id: string;
  date: string;
  matiere: string;
  duree: string;
  justifiee: boolean;
  motif: string;
};

export const absencesParent: AbsenceParent[] = [
  { id: "ab1", date: "2026-09-10", matiere: "Mathematiques", duree: "1h",   justifiee: true,  motif: "Rendez-vous medical" },
  { id: "ab2", date: "2026-09-18", matiere: "Anglais",       duree: "1h",   justifiee: false, motif: "-" },
  { id: "ab3", date: "2026-10-02", matiere: "Physique",       duree: "2h",  justifiee: true,  motif: "Maladie (certificat fourni)" },
  { id: "ab4", date: "2026-10-15", matiere: "Francais",       duree: "1h",  justifiee: false, motif: "-" },
];

// ===== Paiements =====
export type PaiementParent = {
  id: string;
  libelle: string;
  montantDu: number;
  montantPaye: number;
  datePaiement: string | null;
  statut: "Solde" | "Partiel" | "Impaye";
  mode: string;
};

export const paiementsParent: PaiementParent[] = [
  { id: "py1", libelle: "Frais d inscription 2026-2027", montantDu: 500000,  montantPaye: 500000,  datePaiement: "2026-08-20", statut: "Solde",   mode: "Especes" },
  { id: "py2", libelle: "Mensualite Septembre",           montantDu: 1000000, montantPaye: 1000000, datePaiement: "2026-09-05", statut: "Solde",   mode: "Orange Money" },
  { id: "py3", libelle: "Mensualite Octobre",             montantDu: 1000000, montantPaye: 500000,  datePaiement: "2026-10-10", statut: "Partiel", mode: "Especes" },
  { id: "py4", libelle: "Mensualite Novembre",            montantDu: 1000000, montantPaye: 0,       datePaiement: null,         statut: "Impaye",  mode: "-" },
];

// ===== Bulletins =====
export type BulletinParent = {
  id: string;
  trimestre: string;
  annee: string;
  moyenneGenerale: number;
  rang: number;
  totalEleves: number;
  mention: string;
  dateEmission: string;
};

export const bulletinsParent: BulletinParent[] = [
  { id: "b1", trimestre: "1er Trimestre", annee: "2026-2027", moyenneGenerale: 13.2, rang: 5,  totalEleves: 38, mention: "Bien",      dateEmission: "2026-11-15" },
  { id: "b2", trimestre: "2eme Trimestre", annee: "2026-2027", moyenneGenerale: 14.1, rang: 3, totalEleves: 38, mention: "Bien",      dateEmission: "2027-02-20" },
  { id: "b3", trimestre: "3eme Trimestre", annee: "2026-2027", moyenneGenerale: 14.8, rang: 2, totalEleves: 38, mention: "Tres bien", dateEmission: "2027-06-10" },
];

// ===== Notifications =====
export type NotifParent = {
  id: string;
  type: "note" | "absence" | "paiement" | "annonce";
  message: string;
  date: string;
  lu: boolean;
};

export const notificationsParent: NotifParent[] = [
  { id: "nf1", type: "note",     message: "Nouvelle note en Mathematiques : 16/20",     date: "2026-10-18T10:00:00Z", lu: false },
  { id: "nf2", type: "absence",  message: "Absence non justifiee le 15/10 en Francais", date: "2026-10-15T14:00:00Z", lu: false },
  { id: "nf3", type: "paiement", message: "Mensualite Novembre non reglee",              date: "2026-11-01T08:00:00Z", lu: true },
  { id: "nf4", type: "annonce",  message: "Reunion parents-eleves le 5 novembre",        date: "2026-10-20T09:00:00Z", lu: true },
];
