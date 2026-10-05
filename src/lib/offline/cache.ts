"use client";

// Pages enregistrées par le service worker (public/sw.js) pour le hors-ligne.
// Elles contiennent les données de l'utilisateur connecté : on les efface à
// la déconnexion et quand un autre utilisateur se connecte sur l'appareil.

const CACHE_PAGES = "saimo-pages";
const CLE_UTILISATEUR = "saimo-hors-ligne-utilisateur";
export const CLE_PREPARATION = "saimo-hors-ligne-preparation";

function lire(cle: string): string | null {
  try {
    return localStorage.getItem(cle);
  } catch {
    return null;
  }
}

function ecrire(cle: string, valeur: string | null) {
  try {
    if (valeur === null) localStorage.removeItem(cle);
    else localStorage.setItem(cle, valeur);
  } catch {
    /* stockage indisponible (navigation privée) */
  }
}

export async function viderPagesHorsLigne(): Promise<void> {
  ecrire(CLE_UTILISATEUR, null);
  ecrire(CLE_PREPARATION, null);
  if ("caches" in window) await caches.delete(CACHE_PAGES).catch(() => false);
}

/** À appeler à l'ouverture : efface les pages d'un autre utilisateur. */
export async function verifierUtilisateurHorsLigne(utilisateurId: string): Promise<void> {
  if (lire(CLE_UTILISATEUR) === utilisateurId) return;
  await viderPagesHorsLigne();
  ecrire(CLE_UTILISATEUR, utilisateurId);
}

export interface DatesPreparation {
  essentielles?: number;
  details?: number;
}

export function lireDatesPreparation(): DatesPreparation {
  try {
    return JSON.parse(lire(CLE_PREPARATION) ?? "{}") as DatesPreparation;
  } catch {
    return {};
  }
}

export function ecrireDatesPreparation(d: DatesPreparation) {
  ecrire(CLE_PREPARATION, JSON.stringify(d));
}
