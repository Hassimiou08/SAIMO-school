// ===== Donnees fictives pour le portail comptable =====

export const comptaUser = {
  nom: "Mamadou Diallo",
  role: "Chef Comptable",
  initials: "MD"
};

export type Recette = {
  id: string;
  date: string;
  eleve: string;
  classe: string;
  motif: string;
  montant: number;
  methode: "Especes" | "Virement" | "Mobile Money" | "Cheque";
  statut: "Valide" | "En attente";
  reference: string;
};

export const mockRecettes: Recette[] = [
  { id: "r1", date: "2026-10-01", eleve: "Amadou Conde", classe: "6eme A", motif: "Scolarite Octobre", montant: 500000, methode: "Mobile Money", statut: "Valide", reference: "OM-987654" },
  { id: "r2", date: "2026-10-02", eleve: "Fatoumata Barry", classe: "Terminale SM", motif: "Scolarite Octobre", montant: 800000, methode: "Especes", statut: "Valide", reference: "REC-0012" },
  { id: "r3", date: "2026-10-03", eleve: "Ibrahim Sylla", classe: "3eme B", motif: "Frais d'examen", montant: 150000, methode: "Virement", statut: "En attente", reference: "VIR-77281" },
  { id: "r4", date: "2026-10-03", eleve: "Aissatou Camara", classe: "4eme A", motif: "Cantine Trimestre 1", montant: 300000, methode: "Mobile Money", statut: "Valide", reference: "MTN-11234" },
];

export type Depense = {
  id: string;
  date: string;
  categorie: string;
  description: string;
  montant: number;
  beneficiaire: string;
  statut: "Paye" | "Planifie";
};

export const mockDepenses: Depense[] = [
  { id: "d1", date: "2026-09-28", categorie: "Fournitures", description: "Achat marqueurs et rames de papier", montant: 1200000, beneficiaire: "Librairie Guineenne", statut: "Paye" },
  { id: "d2", date: "2026-09-30", categorie: "Factures", description: "Facture Electricite EDG", montant: 2500000, beneficiaire: "EDG", statut: "Paye" },
  { id: "d3", date: "2026-10-05", categorie: "Maintenance", description: "Reparation climatiseur Salle Informatique", montant: 850000, beneficiaire: "ClimPro", statut: "Planifie" },
];

export type Salaire = {
  id: string;
  employe: string;
  role: "Enseignant" | "Administration" | "Entretien";
  typeContrat: "Fixe" | "Horaire";
  heures?: number;
  tauxHoraire?: number;
  salaireDeBase?: number;
  primes: number;
  retenues: number;
  netAPayer: number;
  statut: "Paye" | "En attente";
};

export const mockSalaires: Salaire[] = [
  { id: "s1", employe: "M. Camara", role: "Enseignant", typeContrat: "Horaire", heures: 40, tauxHoraire: 50000, primes: 0, retenues: 0, netAPayer: 2000000, statut: "En attente" },
  { id: "s2", employe: "Mme Sylla", role: "Enseignant", typeContrat: "Fixe", salaireDeBase: 2500000, primes: 300000, retenues: 0, netAPayer: 2800000, statut: "Paye" },
  { id: "s3", employe: "A. Diallo", role: "Administration", typeContrat: "Fixe", salaireDeBase: 1800000, primes: 0, retenues: 50000, netAPayer: 1750000, statut: "Paye" },
];

export const kpisFinanciers = {
  tresorerieGlobale: 45500000,
  recettesMois: 12500000,
  depensesMois: 4550000,
  impayes: 8500000,
};
