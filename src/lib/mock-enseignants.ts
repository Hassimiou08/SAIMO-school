export type Enseignant = {
  id: string;
  matricule: string;
  firstName: string;
  lastName: string;
  matiere: string;
  classes: string[];
  statut: "Actif" | "Inactif";
  genre: "M" | "F";
  telephone: string;
  email: string;
  dateEmbauche: string;
  heuresHebdo: number;
  tauxPresence: number;
};

export const enseignants: Enseignant[] = [
  {
    id: "ens-001",
    matricule: "ENS-2024-001",
    firstName: "Ibrahima",
    lastName: "Diallo",
    matiere: "Mathématiques",
    classes: ["6ᵉ A", "6ᵉ B", "5ᵉ A"],
    statut: "Actif",
    genre: "M",
    telephone: "+224 622 11 22 33",
    email: "i.diallo@saimo.gn",
    dateEmbauche: "15 septembre 2023",
    heuresHebdo: 18,
    tauxPresence: 98,
  },
  {
    id: "ens-002",
    matricule: "ENS-2024-002",
    firstName: "Mariama",
    lastName: "Soumah",
    matiere: "Français",
    classes: ["6ᵉ A", "5ᵉ B", "4ᵉ A"],
    statut: "Actif",
    genre: "F",
    telephone: "+224 655 44 55 66",
    email: "m.soumah@saimo.gn",
    dateEmbauche: "1 octobre 2022",
    heuresHebdo: 20,
    tauxPresence: 95,
  },
  {
    id: "ens-003",
    matricule: "ENS-2024-003",
    firstName: "Oumar",
    lastName: "Barry",
    matiere: "Sciences",
    classes: ["5ᵉ A", "5ᵉ B", "4ᵉ B"],
    statut: "Actif",
    genre: "M",
    telephone: "+224 628 77 88 99",
    email: "o.barry@saimo.gn",
    dateEmbauche: "3 octobre 2024",
    heuresHebdo: 16,
    tauxPresence: 100,
  },
  {
    id: "ens-004",
    matricule: "ENS-2024-004",
    firstName: "Aïssatou",
    lastName: "Camara",
    matiere: "Histoire-Géographie",
    classes: ["4ᵉ A", "4ᵉ B", "3ᵉ A", "3ᵉ B"],
    statut: "Actif",
    genre: "F",
    telephone: "+224 664 00 11 22",
    email: "a.camara@saimo.gn",
    dateEmbauche: "12 septembre 2021",
    heuresHebdo: 22,
    tauxPresence: 92,
  },
  {
    id: "ens-005",
    matricule: "ENS-2024-005",
    firstName: "Mohamed",
    lastName: "Condé",
    matiere: "Anglais",
    classes: ["6ᵉ A", "6ᵉ B", "3ᵉ A"],
    statut: "Inactif",
    genre: "M",
    telephone: "+224 611 33 44 55",
    email: "m.conde@saimo.gn",
    dateEmbauche: "20 octobre 2024",
    heuresHebdo: 12,
    tauxPresence: 78,
  },
  {
    id: "ens-006",
    matricule: "ENS-2024-006",
    firstName: "Fatoumata",
    lastName: "Bah",
    matiere: "Éducation Physique",
    classes: ["6ᵉ A", "6ᵉ B", "5ᵉ A", "5ᵉ B"],
    statut: "Actif",
    genre: "F",
    telephone: "+224 666 55 66 77",
    email: "f.bah@saimo.gn",
    dateEmbauche: "5 octobre 2023",
    heuresHebdo: 14,
    tauxPresence: 97,
  },
];

export function getEnseignant(id: string) {
  return enseignants.find((e) => e.id === id);
}
