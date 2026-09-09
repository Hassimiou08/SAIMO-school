// Utilitaires bulletins partagés client + serveur (aucune dépendance serveur).

/** Mention automatique d'après la moyenne générale /20. */
export function mentionAuto(moyenne: number | null): string {
  if (moyenne == null) return "—";
  if (moyenne >= 18) return "Félicitations";
  if (moyenne >= 16) return "Très bien";
  if (moyenne >= 14) return "Bien";
  if (moyenne >= 12) return "Assez bien";
  if (moyenne >= 10) return "Passable";
  return "Insuffisant";
}

/** Mentions proposées à la saisie manuelle. */
export const MENTIONS = [
  "Félicitations",
  "Très bien",
  "Bien",
  "Assez bien",
  "Passable",
  "Insuffisant",
  "Encouragements",
  "Tableau d'honneur",
  "Avertissement travail",
] as const;
