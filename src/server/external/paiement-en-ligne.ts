import "server-only";

/**
 * Paiement en ligne des familles (Orange Money, MTN, carte).
 *
 * Aucun agrégateur n'est encore branché : tant que c'est le cas, le paiement
 * en ligne reste désactivé pour ne jamais enregistrer un encaissement (et
 * envoyer un reçu) sans que l'argent ait réellement été reçu. Passer
 * PAIEMENT_EN_LIGNE_ACTIF=true uniquement une fois l'agrégateur intégré.
 */
export function paiementEnLigneActif(): boolean {
  return process.env.PAIEMENT_EN_LIGNE_ACTIF === "true";
}
