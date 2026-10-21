import { z } from "zod";

// Site public propre à chaque établissement (/ecoles/[slug]).
// Le contenu est stocké en JSON dans la table `parametres` (clé CLE_SITE),
// le slug dans une clé séparée (CLE_SLUG) pour retrouver l'école par son URL.

export const CLE_SITE = "site_public";
export const CLE_SLUG = "site_slug";

export const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const txt = (max: number) => z.string().trim().max(max);
const point = z.object({ titre: txt(120), texte: txt(1000) });

// Logo propre au site : image redimensionnée côté navigateur (data URI ≤ ~400 Ko).
const logoSchema = z
  .string()
  .max(560_000, "Logo trop volumineux")
  .refine((v) => v === "" || /^data:image\/(png|jpeg|webp);base64,/.test(v), "Format de logo invalide");

export const siteEcoleSchema = z.object({
  publie: z.boolean(),
  // L'école reçoit-elle des préinscriptions en ligne (depuis son site et depuis le site SAIMO) ?
  preinscriptionsOuvertes: z.boolean().default(true),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .min(2, "Adresse du site trop courte")
    .max(40, "Adresse du site trop longue")
    .regex(SLUG_RE, "Adresse du site : lettres minuscules, chiffres et tirets uniquement"),
  logo: logoSchema,
  nomComplet: txt(120).min(2, "Nom officiel requis"),
  nomCourt: txt(40).min(2, "Nom court requis"),
  deviseEcole: txt(120),
  slogan: txt(200),
  anneeFondation: z.number().int().min(1800).max(2100).nullable(),
  localisation: txt(300),
  adresse: txt(300),
  telephones: z.array(txt(30)).max(5),
  email: z.union([z.literal(""), z.email("E-mail de réception invalide")]),
  horaires: txt(200),
  facebook: z
    .string()
    .trim()
    .max(300)
    .refine((v) => v === "" || /^https:\/\/[^\s]+$/.test(v), "Le lien Facebook doit commencer par https://"),
  chiffres: z.array(z.object({ valeur: txt(20), libelle: txt(60) })).max(6),
  presentation: z.object({
    quiSommesNous: txt(4000),
    vision: txt(4000),
    missionIntro: txt(2000),
    missionPoints: z.array(point).max(10),
    valeursIntro: txt(2000),
    valeurs: z.array(point).max(10),
    engagement: txt(4000),
    histoire: txt(4000),
  }),
  cycles: z
    .array(
      z.object({
        nom: txt(60).min(1, "Nom de cycle requis"),
        description: txt(1000),
        objectifs: z.array(txt(200)).max(10),
        matieres: z.array(txt(60)).max(20),
      }),
    )
    .max(8),
  tarifs: z.object({
    // Année scolaire concernée par la grille (ex. « 2026-2027 »).
    annee: txt(20).default(""),
    note: txt(2000),
    // Paiement en plusieurs tranches : un libellé par tranche (vide = colonne masquée).
    tranches: z.array(z.object({ libelle: txt(60), echeance: txt(120) })).max(4).default([]),
    lignes: z
      .array(
        z.object({
          // Regroupement affiché en intertitre (ex. « Collège »), facultatif.
          groupe: txt(60).default(""),
          classe: txt(80),
          inscription: txt(40),
          reinscription: txt(40),
          mensualite: txt(40),
          montantsTranches: z.array(txt(40)).max(4).default([]),
          annuel: txt(40),
        }),
      )
      .max(40),
    annexesTitre: txt(60).default("Frais annexes"),
    annexes: z.array(z.object({ libelle: txt(120), montant: txt(60) })).max(20),
    // Pièces à fournir pour l'inscription, un élément par ligne.
    dossiers: z.array(txt(300)).max(15).default([]),
  }),
  services: z
    .array(z.object({ titre: txt(80).min(1, "Titre de service requis"), texte: txt(1000), points: z.array(point).max(10) }))
    .max(10),
});

export type SiteEcole = z.output<typeof siteEcoleSchema>;

/** Identité d'une école appliquée aux pages partagées (connexion…) quand on arrive depuis son site. */
export type MarqueEcole = {
  slug: string;
  nomComplet: string;
  nomCourt: string;
  logo: string;
  deviseEcole: string;
  primary: string;
  from: string;
  to: string;
};

/** Variables CSS des couleurs d'une école (mêmes noms que sur son site). */
export function couleursMarque(m: MarqueEcole | null): Record<string, string> {
  return m ? { "--ec-primary": m.primary, "--ec-from": m.from, "--ec-to": m.to } : {};
}

/** Ajoute `?ecole=…` à un lien quand on navigue dans l'univers d'une école. */
export function avecEcole(href: string, m: MarqueEcole | null): string {
  return m ? `${href}${href.includes("?") ? "&" : "?"}ecole=${encodeURIComponent(m.slug)}` : href;
}

/** Nombre maximal d'enfants dans une même demande de préinscription. */
export const MAX_ENFANTS_PREINSCRIPTION = 6;

/** Contenu de départ d'un site, pré-rempli avec les infos connues de l'établissement. */
export function siteParDefaut(etab: {
  nom: string;
  code: string;
  telephone: string | null;
  email: string | null;
  adresse: string | null;
  ville: string | null;
}): SiteEcole {
  return {
    publie: false,
    preinscriptionsOuvertes: true,
    slug: slugifier(etab.nom) || etab.code.toLowerCase(),
    logo: "",
    nomComplet: etab.nom,
    nomCourt: etab.nom,
    deviseEcole: "",
    slogan: "",
    anneeFondation: null,
    localisation: [etab.adresse, etab.ville].filter(Boolean).join(", "),
    adresse: [etab.adresse, etab.ville].filter(Boolean).join(", "),
    telephones: etab.telephone ? [etab.telephone] : [],
    email: etab.email ?? "",
    horaires: "",
    facebook: "",
    chiffres: [],
    presentation: {
      quiSommesNous: "",
      vision: "",
      missionIntro: "",
      missionPoints: [],
      valeursIntro: "",
      valeurs: [],
      engagement: "",
      histoire: "",
    },
    cycles: [],
    tarifs: { annee: "", note: "", tranches: [], lignes: [], annexesTitre: "Frais annexes", annexes: [], dossiers: [] },
    services: [],
  };
}

export function slugifier(v: string): string {
  return v
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

/** Découpe un texte saisi en paragraphes (séparés par une ligne vide). */
export function paragraphes(t: string): string[] {
  return t
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

/** Initiales affichées à la place du logo tant que l'école n'en a pas fourni. */
export function monogramme(nom: string): string {
  const ignores = new Set(["GS", "GROUPE", "SCOLAIRE", "ECOLE", "LE", "LA", "LES", "DE", "DU", "DES", "ET"]);
  const mots = nom
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toUpperCase()
    .split(/[^A-Z0-9]+/)
    .filter((m) => m && !ignores.has(m));
  return (mots.slice(0, 2).map((m) => m[0]).join("") || nom.slice(0, 2)).toUpperCase();
}

/** Lien `tel:` à partir d'un numéro saisi librement (indicatif Guinée par défaut). */
export function lienTel(numero: string): string {
  const chiffres = numero.replace(/[^\d+]/g, "");
  if (chiffres.startsWith("+")) return `tel:${chiffres}`;
  if (chiffres.startsWith("00")) return `tel:+${chiffres.slice(2)}`;
  return `tel:+224${chiffres}`;
}

/** Empêche la coupure de ligne à l'intérieur d'un nombre (« 1 200 » reste sur une ligne). */
export function insecable(v: string): string {
  return v.replace(/(\d) (?=\d)/g, "$1 ");
}

/** Ancre d'un cycle dans la page des cycles. */
export function ancreCycle(nom: string): string {
  return slugifier(nom) || "cycle";
}
