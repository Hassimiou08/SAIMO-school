import "server-only";
import { cache } from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireContext, requirePermission } from "@/server/context";
import { resolveTheme } from "@/lib/theme";
import {
  CLE_SITE, CLE_SLUG, COULEURS_SAIMO, siteEcoleSchema, siteParDefaut,
  type CouleursSite, type MarqueEcole, type SiteEcole,
} from "@/lib/site-ecole";

function lireContenu(valeur: string | undefined): SiteEcole | null {
  if (!valeur) return null;
  try {
    const r = siteEcoleSchema.safeParse(JSON.parse(valeur));
    return r.success ? r.data : null;
  } catch {
    return null;
  }
}

/**
 * Site public d'une école, retrouvé par son adresse (/ecoles/[slug]).
 * Accès anonyme : renvoie null si l'école est inconnue, inactive ou si son site n'est pas publié.
 */
export const getSiteEcole = cache(async (slug: string) => {
  const ref = await prisma.parametre.findFirst({
    where: { cle: CLE_SLUG, valeur: slug.toLowerCase() },
    select: { etablissementId: true },
  });
  if (!ref) return null;

  const [etab, contenu] = await Promise.all([
    prisma.etablissement.findUnique({
      where: { id: ref.etablissementId },
      select: { id: true, nom: true, actif: true, couleurTheme: true, degradeTheme: true, police: true, tailleTexte: true },
    }),
    prisma.parametre.findUnique({
      where: { etablissementId_cle: { etablissementId: ref.etablissementId, cle: CLE_SITE } },
      select: { valeur: true },
    }),
  ]);
  const site = lireContenu(contenu?.valeur);
  if (!etab?.actif || !site?.publie) return null;

  const theme = resolveTheme(etab);
  const couleurs: CouleursSite =
    site.palette === "saimo"
      ? COULEURS_SAIMO
      : { primary: theme.primary, light: theme.primaryLight, from: theme.sidebarFrom, to: theme.sidebarTo };

  return { site, etablissementId: etab.id, couleurs };
});

/** Identité visuelle d'une école publiée, ou null (slug absent ou inconnu → pages SAIMO). */
export async function getMarqueEcole(slug: string | undefined): Promise<MarqueEcole | null> {
  if (!slug) return null;
  const ecole = await getSiteEcole(slug);
  if (!ecole) return null;
  const { site, couleurs } = ecole;
  return {
    slug: site.slug,
    nomComplet: site.nomComplet,
    nomCourt: site.nomCourt,
    logo: site.logo,
    deviseEcole: site.deviseEcole,
    couleurs,
  };
}

/**
 * Écoles proposées au choix sur le site SAIMO : site publié, établissement actif
 * et préinscriptions en ligne ouvertes. Accès anonyme.
 */
export async function listerEcolesPreinscription() {
  const contenus = await prisma.parametre.findMany({
    where: { cle: CLE_SITE, etablissement: { actif: true } },
    select: { valeur: true },
  });
  return contenus
    .map((c) => lireContenu(c.valeur))
    .filter((s): s is SiteEcole => !!s && s.publie && s.preinscriptionsOuvertes)
    .map((s) => ({ slug: s.slug, nom: s.nomComplet, localisation: s.localisation }))
    .sort((a, b) => a.nom.localeCompare(b.nom, "fr"));
}

/** Contenu du site de l'établissement courant, pour l'éditeur du portail. */
export async function getSiteEcoleAdmin() {
  const { etablissementId, role } = await requireContext();
  requirePermission(role, "parametres:view");

  const [etab, contenu] = await Promise.all([
    prisma.etablissement.findUnique({
      where: { id: etablissementId },
      select: { nom: true, code: true, logo: true, telephone: true, email: true, adresse: true, ville: true },
    }),
    prisma.parametre.findUnique({
      where: { etablissementId_cle: { etablissementId, cle: CLE_SITE } },
      select: { valeur: true },
    }),
  ]);
  if (!etab) notFound();

  return {
    site: lireContenu(contenu?.valeur) ?? siteParDefaut(etab),
    logoPortail: etab.logo,
  };
}
