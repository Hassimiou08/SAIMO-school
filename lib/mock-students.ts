export type Student = {
  id: string;
  matricule: string;
  firstName: string;
  lastName: string;
  classe: string;
  niveau: string;
  statut: "Actif" | "Inactif";
  genre: "M" | "F";
  dateNaissance: string;
  parent: string;
  parentTelephone: string;
  parentEmail: string;
  adresse: string;
  dateInscription: string;
  moyenneGenerale: number;
  soldeDu: number;
  documents: string[];
  resultats: {
    matiere: string;
    coefficient: number;
    note: number;
    bareme: number;
    appreciation: string;
  }[];
  absences: {
    date: string;
    type: "Absence" | "Retard";
    motif: string;
    justifie: boolean;
  }[];
  paiements: {
    recu: string;
    date: string;
    montant: number;
    mode: string;
    statut: "Payé" | "Partiel";
  }[];
};

export const students: Student[] = [
  {
    id: "eleve-001",
    matricule: "SAIMO-24-0182",
    firstName: "Fatoumata",
    lastName: "Camara",
    classe: "6ᵉ A",
    niveau: "6ᵉ",
    statut: "Actif",
    genre: "F",
    dateNaissance: "14 mars 2013",
    parent: "Mamadou Camara",
    parentTelephone: "+224 622 45 12 08",
    parentEmail: "m.camara@example.com",
    adresse: "Ratoma, Conakry",
    dateInscription: "3 octobre 2025",
    moyenneGenerale: 78.4,
    soldeDu: 0,
    documents: ["Acte de naissance", "Certificat médical", "Photo d'identité"],
    resultats: [
      { matiere: "Mathématiques", coefficient: 4, note: 82, bareme: 100, appreciation: "Très bon niveau" },
      { matiere: "Français", coefficient: 4, note: 75, bareme: 100, appreciation: "Bon travail" },
      { matiere: "Sciences", coefficient: 3, note: 88, bareme: 100, appreciation: "Excellent" },
      { matiere: "Histoire-Géographie", coefficient: 2, note: 70, bareme: 100, appreciation: "Satisfaisant" },
      { matiere: "Anglais", coefficient: 2, note: 79, bareme: 100, appreciation: "Bon niveau" },
    ],
    absences: [
      { date: "12 février 2026", type: "Absence", motif: "Maladie", justifie: true },
      { date: "28 janvier 2026", type: "Retard", motif: "Transport", justifie: false },
    ],
    paiements: [
      { recu: "REC-00842", date: "5 janvier 2026", montant: 320000, mode: "Espèces", statut: "Payé" },
      { recu: "REC-00791", date: "3 octobre 2025", montant: 450000, mode: "Mobile Money", statut: "Payé" },
    ],
  },
  {
    id: "eleve-002",
    matricule: "SAIMO-24-0183",
    firstName: "Mamadou",
    lastName: "Bah",
    classe: "5ᵉ A",
    niveau: "5ᵉ",
    statut: "Actif",
    genre: "M",
    dateNaissance: "2 juillet 2012",
    parent: "Aïssatou Bah",
    parentTelephone: "+224 655 30 88 21",
    parentEmail: "a.bah@example.com",
    adresse: "Matam, Conakry",
    dateInscription: "1 octobre 2025",
    moyenneGenerale: 61.2,
    soldeDu: 150000,
    documents: ["Acte de naissance", "Bulletin précédent"],
    resultats: [
      { matiere: "Mathématiques", coefficient: 4, note: 58, bareme: 100, appreciation: "Peut mieux faire" },
      { matiere: "Français", coefficient: 4, note: 64, bareme: 100, appreciation: "Correct" },
      { matiere: "Sciences", coefficient: 3, note: 66, bareme: 100, appreciation: "Correct" },
      { matiere: "Histoire-Géographie", coefficient: 2, note: 60, bareme: 100, appreciation: "Moyen" },
    ],
    absences: [
      { date: "20 février 2026", type: "Absence", motif: "Non justifié", justifie: false },
      { date: "14 février 2026", type: "Absence", motif: "Maladie", justifie: true },
      { date: "6 février 2026", type: "Retard", motif: "Transport", justifie: false },
    ],
    paiements: [
      { recu: "REC-00764", date: "12 novembre 2025", montant: 300000, mode: "Espèces", statut: "Partiel" },
    ],
  },
  {
    id: "eleve-003",
    matricule: "SAIMO-24-0184",
    firstName: "Aïcha",
    lastName: "Diallo",
    classe: "4ᵉ B",
    niveau: "4ᵉ",
    statut: "Actif",
    genre: "F",
    dateNaissance: "19 novembre 2011",
    parent: "Ibrahima Diallo",
    parentTelephone: "+224 664 12 77 40",
    parentEmail: "i.diallo@example.com",
    adresse: "Dixinn, Conakry",
    dateInscription: "28 septembre 2025",
    moyenneGenerale: 91.6,
    soldeDu: 0,
    documents: ["Acte de naissance", "Certificat médical", "Photo d'identité", "Bulletin précédent"],
    resultats: [
      { matiere: "Mathématiques", coefficient: 4, note: 95, bareme: 100, appreciation: "Excellent" },
      { matiere: "Français", coefficient: 4, note: 89, bareme: 100, appreciation: "Excellent" },
      { matiere: "Sciences", coefficient: 3, note: 93, bareme: 100, appreciation: "Excellent" },
      { matiere: "Anglais", coefficient: 2, note: 90, bareme: 100, appreciation: "Excellent" },
    ],
    absences: [],
    paiements: [
      { recu: "REC-00905", date: "8 janvier 2026", montant: 480000, mode: "Mobile Money", statut: "Payé" },
    ],
  },
  {
    id: "eleve-004",
    matricule: "SAIMO-24-0185",
    firstName: "Ousmane",
    lastName: "Sylla",
    classe: "3ᵉ A",
    niveau: "3ᵉ",
    statut: "Inactif",
    genre: "M",
    dateNaissance: "5 mai 2010",
    parent: "Mariama Sylla",
    parentTelephone: "+224 611 09 34 56",
    parentEmail: "m.sylla@example.com",
    adresse: "Kaloum, Conakry",
    dateInscription: "15 octobre 2024",
    moyenneGenerale: 54.8,
    soldeDu: 620000,
    documents: ["Acte de naissance"],
    resultats: [
      { matiere: "Mathématiques", coefficient: 4, note: 50, bareme: 100, appreciation: "Insuffisant" },
      { matiere: "Français", coefficient: 4, note: 57, bareme: 100, appreciation: "Moyen" },
    ],
    absences: [
      { date: "3 décembre 2025", type: "Absence", motif: "Non justifié", justifie: false },
      { date: "22 novembre 2025", type: "Absence", motif: "Non justifié", justifie: false },
      { date: "10 novembre 2025", type: "Absence", motif: "Non justifié", justifie: false },
    ],
    paiements: [
      { recu: "REC-00612", date: "20 octobre 2024", montant: 200000, mode: "Espèces", statut: "Partiel" },
    ],
  },
  {
    id: "eleve-005",
    matricule: "SAIMO-24-0186",
    firstName: "Kadiatou",
    lastName: "Barry",
    classe: "6ᵉ B",
    niveau: "6ᵉ",
    statut: "Actif",
    genre: "F",
    dateNaissance: "27 janvier 2013",
    parent: "Sekou Barry",
    parentTelephone: "+224 628 71 05 19",
    parentEmail: "s.barry@example.com",
    adresse: "Ratoma, Conakry",
    dateInscription: "2 octobre 2025",
    moyenneGenerale: 70.3,
    soldeDu: 0,
    documents: ["Acte de naissance", "Photo d'identité"],
    resultats: [
      { matiere: "Mathématiques", coefficient: 4, note: 68, bareme: 100, appreciation: "Correct" },
      { matiere: "Français", coefficient: 4, note: 74, bareme: 100, appreciation: "Bon travail" },
      { matiere: "Sciences", coefficient: 3, note: 69, bareme: 100, appreciation: "Correct" },
    ],
    absences: [{ date: "18 janvier 2026", type: "Retard", motif: "Transport", justifie: true }],
    paiements: [
      { recu: "REC-00877", date: "2 octobre 2025", montant: 450000, mode: "Virement", statut: "Payé" },
    ],
  },
  {
    id: "eleve-006",
    matricule: "SAIMO-24-0187",
    firstName: "Alpha",
    lastName: "Condé",
    classe: "5ᵉ B",
    niveau: "5ᵉ",
    statut: "Actif",
    genre: "M",
    dateNaissance: "9 septembre 2012",
    parent: "Fatoumata Condé",
    parentTelephone: "+224 666 88 21 05",
    parentEmail: "f.conde@example.com",
    adresse: "Matoto, Conakry",
    dateInscription: "5 octobre 2025",
    moyenneGenerale: 82.9,
    soldeDu: 0,
    documents: ["Acte de naissance", "Certificat médical", "Photo d'identité"],
    resultats: [
      { matiere: "Mathématiques", coefficient: 4, note: 85, bareme: 100, appreciation: "Très bon niveau" },
      { matiere: "Français", coefficient: 4, note: 80, bareme: 100, appreciation: "Bon travail" },
      { matiere: "Sciences", coefficient: 3, note: 84, bareme: 100, appreciation: "Très bon niveau" },
    ],
    absences: [],
    paiements: [
      { recu: "REC-00918", date: "6 janvier 2026", montant: 450000, mode: "Mobile Money", statut: "Payé" },
    ],
  },
];

export function getStudent(id: string) {
  return students.find((s) => s.id === id);
}

export function formatGNF(amount: number) {
  return new Intl.NumberFormat("fr-FR").format(amount) + " GNF";
}
