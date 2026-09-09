const nfGNF = new Intl.NumberFormat("fr-FR");
const dfLong = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
  year: "numeric",
});
const dfShort = new Intl.DateTimeFormat("fr-FR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

/** Montant en francs guinéens : "1 500 000 GNF". */
export function formatGNF(montant: number): string {
  return `${nfGNF.format(Math.round(montant))} GNF`;
}

/** Date longue française, ou "—" si absente. */
export function formatDateLongue(date: Date | string | null | undefined): string {
  if (!date) return "—";
  const d = typeof date === "string" ? new Date(date) : date;
  return Number.isNaN(d.getTime()) ? "—" : dfLong.format(d);
}

/** Date courte française (jj/mm/aaaa), ou "—". */
export function formatDateCourte(date: Date | string | null | undefined): string {
  if (!date) return "—";
  const d = typeof date === "string" ? new Date(date) : date;
  return Number.isNaN(d.getTime()) ? "—" : dfShort.format(d);
}
