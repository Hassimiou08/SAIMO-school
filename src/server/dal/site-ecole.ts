import "server-only";
import { cache } from "react";
import { createHash } from "node:crypto";
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

/** Empreinte courte d'une image : l'adresse change quand l'image change (cache navigateur sûr). */
const empreinte = (v: string) => createHash("sha1").update(v).digest("hex").slice(0, 10);

/** Adresse publique d'une image du site (servie par /api/ecoles/[slug]/media/[nom]). */
function urlMedia(slug: string, nom: string, dataUri: string) {
  return dataUri ? `/api/ecoles/${slug}/media/${nom}?v=${empreinte(dataUri)}` : "";
}

/**
 * Site public d'une école, retrouvé par son adresse (/ecoles/[slug]).
 * Accès anonyme : renvoie null si l'école est inconnue, inactive ou si son site n'est pas publié.
 * Les images (logo, photo d'accueil, galerie) y sont remplacées par leurs adresses :
 * les pages restent légères et les images sont mises en cache.
 */
export const getSiteEcole = cache(async (slug: string) => {
  const brut = await getContenuSiteEcole(slug);
  if (!brut) return null;
  const { site } = brut;
  return {
    ...brut,
    site: {
      ...site,
      logo: urlMedia(site.slug, "logo", site.logo),
      imageAccueil: urlMedia(site.slug, "accueil", site.imageAccueil),
      galerie: site.galerie.map((g, i) => ({ ...g, image: urlMedia(site.slug, `galerie-${i}`, g.image) })),
    },
  };
});

/** Image brute d'un site publié (data URI), pour la route qui la sert. */
export async function getMediaSiteEcole(slug: string, nom: string): Promise<string | null> {
  const brut = await getContenuSiteEcole(slug);
  if (!brut) return null;
  const { site } = brut;
  if (nom === "logo") return site.logo || null;
  if (nom === "accueil") return site.imageAccueil || null;
  const m = /^galerie-(\d+)$/.exec(nom);
  return m ? site.galerie[Number(m[1])]?.image ?? null : null;
}

/** Contenu complet (images comprises) d'un site publié. */
const getContenuSiteEcole = cache(async (slug: string) => {
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
