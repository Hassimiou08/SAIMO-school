"use client";

import { useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import {
  ArrowDown, ArrowUp, ExternalLink, Globe, ImagePlus, Loader2, Plus, Save, Trash2,
} from "lucide-react";
import { actionMajSiteEcole } from "@/server/actions/site-ecole";
import { monogramme, slugifier, type SiteEcole } from "@/lib/site-ecole";

type Point = { titre: string; texte: string };

const champ =
  "w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 disabled:opacity-70";
const libelle = "text-sm font-medium text-neutral-700";
const aideCls = "mt-1 text-xs text-ink-500";
const boutonAjout =
  "inline-flex items-center gap-1.5 rounded-full border border-dashed border-neutral-300 px-4 py-2 text-xs font-semibold text-ink-700 hover:border-blue-400 hover:text-blue-700 disabled:opacity-50";
const boutonIcone = "rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 disabled:opacity-30";

// Logo du site : on garde les proportions (≤ 400 px) et la transparence (PNG).
function logoVersDataUri(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Lecture du fichier impossible"));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("Image illisible"));
      img.onload = () => {
        const echelle = Math.min(1, 400 / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * echelle);
        canvas.height = Math.round(img.height * echelle);
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("Canvas indisponible"));
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/png"));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

/** Déplace l'élément i d'une case (sens = -1 vers le haut, +1 vers le bas). */
function deplacer<T>(liste: T[], i: number, sens: -1 | 1): T[] {
  const j = i + sens;
  if (j < 0 || j >= liste.length) return liste;
  const copie = [...liste];
  [copie[i], copie[j]] = [copie[j], copie[i]];
  return copie;
}

function Section({
  titre,
  description,
  children,
  ouvert = false,
}: {
  titre: string;
  description: string;
  children: React.ReactNode;
  ouvert?: boolean;
}) {
  return (
    <details open={ouvert} className="group rounded-2xl border border-neutral-200 bg-white">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5">
        <span>
          <span className="block font-display text-base font-bold text-navy-900">{titre}</span>
          <span className="block text-xs text-ink-500">{description}</span>
        </span>
        <span className="text-xl leading-none text-neutral-400 transition-transform group-open:rotate-45">+</span>
      </summary>
      <div className="space-y-5 border-t border-neutral-100 px-6 py-6">{children}</div>
    </details>
  );
}

function Texte({
  label,
  value,
  onChange,
  aide,
  placeholder,
  lignes,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  aide?: string;
  placeholder?: string;
  lignes?: number;
  disabled?: boolean;
}) {
  return (
    <div>
      <label className={libelle}>
        {label}
        {lignes ? (
          <textarea rows={lignes} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} disabled={disabled} className={`${champ} mt-1`} />
        ) : (
          <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} disabled={disabled} className={`${champ} mt-1`} />
        )}
      </label>
      {aide && <p className={aideCls}>{aide}</p>}
    </div>
  );
}

/** Liste saisie « une ligne = un élément ». Le texte brut reste local pour pouvoir taper des retours à la ligne. */
function ZoneLignes({
  label,
  value,
  onChange,
  aide,
  disabled,
}: {
  label: string;
  value: string[];
  onChange: (v: string[]) => void;
  aide?: string;
  disabled?: boolean;
}) {
  const [brut, setBrut] = useState(value.join("\n"));
  // Resynchronise si la liste a changé de l'extérieur (ex. cycles réordonnés).
  const versListe = (t: string) => t.split("\n").map((l) => l.trim()).filter(Boolean);
  if (versListe(brut).join("\n") !== value.join("\n")) setBrut(value.join("\n"));
  return (
    <div>
      <label className={libelle}>
        {label}
        <textarea
          rows={Math.max(3, Math.min(value.length + 1, 8))}
          value={brut}
          disabled={disabled}
          onChange={(e) => {
            setBrut(e.target.value);
            onChange(versListe(e.target.value));
          }}
          className={`${champ} mt-1`}
        />
      </label>
      <p className={aideCls}>{aide ?? "Un élément par ligne."}</p>
    </div>
  );
}

function ListePoints({
  value,
  onChange,
  libelleTitre,
  libelleTexte,
  ajouter,
  disabled,
}: {
  value: Point[];
  onChange: (v: Point[]) => void;
  libelleTitre: string;
  libelleTexte: string;
  ajouter: string;
  disabled?: boolean;
}) {
  const maj = (i: number, p: Partial<Point>) => onChange(value.map((v, j) => (j === i ? { ...v, ...p } : v)));
  return (
    <div className="space-y-3">
      {value.map((p, i) => (
        <div key={i} className="rounded-xl border border-neutral-200 bg-neutral-50/60 p-4">
          <div className="flex items-start gap-2">
            <div className="flex-1 space-y-2">
              <input value={p.titre} onChange={(e) => maj(i, { titre: e.target.value })} placeholder={libelleTitre} disabled={disabled} className={champ} />
              <textarea rows={2} value={p.texte} onChange={(e) => maj(i, { texte: e.target.value })} placeholder={libelleTexte} disabled={disabled} className={champ} />
            </div>
            <div className="flex flex-col">
              <button type="button" aria-label="Monter" disabled={disabled || i === 0} onClick={() => onChange(deplacer(value, i, -1))} className={boutonIcone}><ArrowUp className="h-4 w-4" /></button>
              <button type="button" aria-label="Descendre" disabled={disabled || i === value.length - 1} onClick={() => onChange(deplacer(value, i, 1))} className={boutonIcone}><ArrowDown className="h-4 w-4" /></button>
              <button type="button" aria-label="Supprimer" disabled={disabled} onClick={() => onChange(value.filter((_, j) => j !== i))} className={`${boutonIcone} hover:text-red-600`}><Trash2 className="h-4 w-4" /></button>
            </div>
          </div>
        </div>
      ))}
      <button type="button" disabled={disabled} onClick={() => onChange([...value, { titre: "", texte: "" }])} className={boutonAjout}>
        <Plus className="h-3.5 w-3.5" /> {ajouter}
      </button>
    </div>
  );
}

export function SitePublicForm({
  initial,
  logoPortail,
  peutModifier,
}: {
  initial: SiteEcole;
  logoPortail: string | null;
  peutModifier: boolean;
}) {
  const [site, setSite] = useState<SiteEcole>(initial);
  const [slugEnregistre, setSlugEnregistre] = useState(initial.publie ? initial.slug : null);
  const [isPending, startTransition] = useTransition();
  const [logoChargement, setLogoChargement] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const off = !peutModifier;

  const maj = (p: Partial<SiteEcole>) => setSite((s) => ({ ...s, ...p }));
  const majPres = (p: Partial<SiteEcole["presentation"]>) =>
    setSite((s) => ({ ...s, presentation: { ...s.presentation, ...p } }));
  const majTarifs = (p: Partial<SiteEcole["tarifs"]>) => setSite((s) => ({ ...s, tarifs: { ...s.tarifs, ...p } }));
  const majCycle = (i: number, p: Partial<SiteEcole["cycles"][number]>) =>
    maj({ cycles: site.cycles.map((c, j) => (j === i ? { ...c, ...p } : c)) });
  const majService = (i: number, p: Partial<SiteEcole["services"][number]>) =>
    maj({ services: site.services.map((c, j) => (j === i ? { ...c, ...p } : c)) });

  const choisirLogo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) return toast.error("Choisissez un fichier image.");
    setLogoChargement(true);
    try {
      maj({ logo: await logoVersDataUri(file) });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Image illisible");
    } finally {
      setLogoChargement(false);
    }
  };

  const enregistrer = () => {
    startTransition(async () => {
      const slug = slugifier(site.slug);
      setSite((s) => ({ ...s, slug }));
      const r = await actionMajSiteEcole({ ...site, slug });
      if (!r.succes) {
        toast.error(r.erreur);
        return;
      }
      setSlugEnregistre(site.publie ? r.data.slug : null);
      toast.success(site.publie ? "Site enregistré et publié." : "Site enregistré (non publié).");
    });
  };

  const urlSite = slugEnregistre ? `/ecoles/${slugEnregistre}` : null;

  return (
    <div className="space-y-4 pb-24">
      {/* Publication */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600"><Globe className="h-5 w-5" /></span>
            <div>
              <p className="font-display font-bold text-navy-900">{site.publie ? "Site publié" : "Site non publié"}</p>
              <p className="text-xs text-ink-500">
                {site.publie ? "Visible par tous les visiteurs à l'adresse ci-dessous." : "Seul le personnel peut préparer le contenu ; les visiteurs ne voient rien."}
              </p>
            </div>
          </div>
          {urlSite && (
            <a href={urlSite} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 px-4 py-2 text-sm font-semibold text-navy-900 hover:bg-neutral-50">
              Voir le site <ExternalLink className="h-4 w-4" />
            </a>
          )}
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
          <div>
            <label className={libelle} htmlFor="slug">Adresse du site</label>
            <div className="mt-1 flex items-center overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50 text-sm focus-within:border-blue-400">
              <span className="shrink-0 pl-4 text-ink-500">…/ecoles/</span>
              <input
                id="slug"
                value={site.slug}
                disabled={off}
                onChange={(e) =>
                  maj({
                    slug: e.target.value
                      .normalize("NFD")
                      .replace(/[̀-ͯ]/g, "")
                      .toLowerCase()
                      .replace(/[^a-z0-9-]+/g, "-")
                      .replace(/-{2,}/g, "-")
                      .slice(0, 40),
                  })
                }
                className="w-full bg-transparent py-2.5 pr-4 outline-none"
              />
            </div>
            <p className={aideCls}>Lettres minuscules, chiffres et tirets. Changer l&apos;adresse casse les liens déjà partagés.</p>
          </div>
          <label className="flex items-center gap-3 rounded-xl border border-neutral-200 px-4 py-2.5 text-sm font-medium text-navy-900">
            <input type="checkbox" checked={site.publie} disabled={off} onChange={(e) => maj({ publie: e.target.checked })} className="h-4 w-4 accent-blue-600" />
            Publier le site
          </label>
        </div>
        <div className="mt-4 rounded-xl border border-neutral-200 px-4 py-3 text-sm">
          <p className="font-medium text-navy-900">Couleurs du site</p>
          <div className="mt-2 flex flex-wrap gap-4">
            {([
              ["saimo", "Couleurs SAIMO (bleu et orange)"],
              ["etablissement", "Couleurs de l'établissement (Paramètres → Apparence)"],
            ] as const).map(([v, l]) => (
              <label key={v} className="flex items-center gap-2">
                <input type="radio" name="palette" checked={site.palette === v} disabled={off} onChange={() => maj({ palette: v })} className="h-4 w-4 accent-blue-600" />
                {l}
              </label>
            ))}
          </div>
        </div>
        <label className="mt-4 flex items-start gap-3 rounded-xl border border-neutral-200 px-4 py-3 text-sm">
          <input
            type="checkbox"
            checked={site.preinscriptionsOuvertes}
            disabled={off}
            onChange={(e) => maj({ preinscriptionsOuvertes: e.target.checked })}
            className="mt-0.5 h-4 w-4 accent-blue-600"
          />
          <span>
            <span className="block font-medium text-navy-900">Accepter les préinscriptions en ligne</span>
            <span className="block text-xs text-ink-500">
              Les familles peuvent déposer une demande (un ou plusieurs enfants) depuis le site de l&apos;école et depuis le site SAIMO,
              où l&apos;école apparaît dans la liste. Les demandes arrivent dans « Pré-inscriptions » et par e-mail.
            </span>
          </span>
        </label>
      </div>

      <Section titre="Identité" description="Nom, logo, devise et slogan de l'école." ouvert>
        <div className="flex flex-wrap items-center gap-4">
          {site.logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={site.logo} alt="Logo du site" className="h-20 w-20 rounded-2xl border border-neutral-200 bg-white object-contain p-1" />
          ) : (
            <span className="flex h-20 w-20 items-center justify-center rounded-2xl border border-dashed border-neutral-300 font-display text-2xl font-bold text-neutral-400">
              {monogramme(site.nomCourt || site.nomComplet)}
            </span>
          )}
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              <button type="button" disabled={off || logoChargement} onClick={() => fileRef.current?.click()} className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 px-4 py-2 text-xs font-semibold text-navy-900 hover:bg-neutral-50 disabled:opacity-50">
                {logoChargement ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ImagePlus className="h-3.5 w-3.5" />} Choisir le logo officiel
              </button>
              {logoPortail && site.logo !== logoPortail && (
                <button type="button" disabled={off} onClick={() => maj({ logo: logoPortail })} className="rounded-full border border-neutral-200 px-4 py-2 text-xs font-semibold text-ink-700 hover:bg-neutral-50 disabled:opacity-50">
                  Reprendre le logo du portail
                </button>
              )}
              {site.logo && (
                <button type="button" disabled={off} onClick={() => maj({ logo: "" })} className="rounded-full px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50">
                  Retirer
                </button>
              )}
            </div>
            <p className={aideCls}>Sans logo, le site affiche les initiales de l&apos;école.</p>
            <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={choisirLogo} />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Texte label="Nom officiel" value={site.nomComplet} onChange={(v) => maj({ nomComplet: v })} aide="Utilisé dans les textes de présentation." disabled={off} />
          <Texte label="Nom court" value={site.nomCourt} onChange={(v) => maj({ nomCourt: v })} aide="Utilisé dans le menu et les boutons." disabled={off} />
          <Texte label="Devise" value={site.deviseEcole} onChange={(v) => maj({ deviseEcole: v })} placeholder="Travail – Discipline – Équité" disabled={off} />
          <div>
            <label className={libelle}>
              Année de fondation
              <input
                type="number"
                min={1800}
                max={2100}
                value={site.anneeFondation ?? ""}
                disabled={off}
                onChange={(e) => maj({ anneeFondation: e.target.value ? Number(e.target.value) : null })}
                className={`${champ} mt-1`}
              />
            </label>
          </div>
        </div>
        <Texte label="Slogan" value={site.slogan} onChange={(v) => maj({ slogan: v })} disabled={off} />
        <Texte label="Localisation (page d'accueil)" value={site.localisation} onChange={(v) => maj({ localisation: v })} disabled={off} />
      </Section>

      <Section titre="Coordonnées" description="Téléphones, e-mail de réception, adresse, horaires et Facebook.">
        <ZoneLignes label="Téléphones" value={site.telephones} onChange={(v) => maj({ telephones: v.slice(0, 5) })} aide="Un numéro par ligne (5 au maximum). Ils deviennent cliquables sur téléphone." disabled={off} />
        <Texte label="E-mail de réception" value={site.email} onChange={(v) => maj({ email: v })} aide="Les messages du formulaire de contact et les préinscriptions sont envoyés à cette adresse." disabled={off} />
        <Texte label="Adresse" value={site.adresse} onChange={(v) => maj({ adresse: v })} disabled={off} />
        <Texte label="Horaires d'ouverture" value={site.horaires} onChange={(v) => maj({ horaires: v })} placeholder="Du lundi au samedi, de 08 h 00 à 17 h 00" disabled={off} />
        <Texte label="Page Facebook" value={site.facebook} onChange={(v) => maj({ facebook: v })} placeholder="https://www.facebook.com/…" aide="Laisser vide pour masquer le bouton Facebook." disabled={off} />
      </Section>

      <Section titre="Chiffres clés" description="Affichés sur l'accueil et la page « Découvrir l'école ».">
        {site.chiffres.map((c, i) => (
          <div key={i} className="flex items-center gap-2">
            <input value={c.valeur} disabled={off} onChange={(e) => maj({ chiffres: site.chiffres.map((x, j) => (j === i ? { ...x, valeur: e.target.value } : x)) })} placeholder="1 200+" className={`${champ} w-32`} />
            <input value={c.libelle} disabled={off} onChange={(e) => maj({ chiffres: site.chiffres.map((x, j) => (j === i ? { ...x, libelle: e.target.value } : x)) })} placeholder="élèves" className={champ} />
            <button type="button" aria-label="Monter" disabled={off || i === 0} onClick={() => maj({ chiffres: deplacer(site.chiffres, i, -1) })} className={boutonIcone}><ArrowUp className="h-4 w-4" /></button>
            <button type="button" aria-label="Supprimer" disabled={off} onClick={() => maj({ chiffres: site.chiffres.filter((_, j) => j !== i) })} className={`${boutonIcone} hover:text-red-600`}><Trash2 className="h-4 w-4" /></button>
          </div>
        ))}
        {site.chiffres.length < 6 && (
          <button type="button" disabled={off} onClick={() => maj({ chiffres: [...site.chiffres, { valeur: "", libelle: "" }] })} className={boutonAjout}>
            <Plus className="h-3.5 w-3.5" /> Ajouter un chiffre
          </button>
        )}
      </Section>

      <Section titre="Découvrir l'école" description="Qui sommes-nous, vision, mission, valeurs, engagement et histoire.">
        <p className="rounded-xl bg-blue-50 px-4 py-3 text-xs text-blue-800">Séparez les paragraphes par une ligne vide.</p>
        <Texte label="Qui sommes-nous ?" value={site.presentation.quiSommesNous} onChange={(v) => majPres({ quiSommesNous: v })} lignes={6} disabled={off} />
        <Texte label="Notre vision" value={site.presentation.vision} onChange={(v) => majPres({ vision: v })} lignes={4} disabled={off} />
        <Texte label="Notre mission — introduction" value={site.presentation.missionIntro} onChange={(v) => majPres({ missionIntro: v })} lignes={4} disabled={off} />
        <div>
          <p className={`${libelle} mb-2`}>Notre mission — points d&apos;attention</p>
          <ListePoints value={site.presentation.missionPoints} onChange={(v) => majPres({ missionPoints: v })} libelleTitre="Ex. La qualité des apprentissages" libelleTexte="Description" ajouter="Ajouter un point" disabled={off} />
        </div>
        <Texte label="Nos valeurs — introduction" value={site.presentation.valeursIntro} onChange={(v) => majPres({ valeursIntro: v })} lignes={3} disabled={off} />
        <div>
          <p className={`${libelle} mb-2`}>Nos valeurs</p>
          <ListePoints value={site.presentation.valeurs} onChange={(v) => majPres({ valeurs: v })} libelleTitre="Ex. Travail : le chemin vers la réussite" libelleTexte="Description" ajouter="Ajouter une valeur" disabled={off} />
          <p className={aideCls}>Sur l&apos;accueil, le mot avant « : » est affiché en grand.</p>
        </div>
        <Texte label="Notre engagement envers les familles" value={site.presentation.engagement} onChange={(v) => majPres({ engagement: v })} lignes={4} disabled={off} />
        <Texte label="Une histoire tournée vers l'avenir" value={site.presentation.histoire} onChange={(v) => majPres({ histoire: v })} lignes={5} disabled={off} />
      </Section>

      <Section titre="Cycles d'enseignement" description="Un bloc par cycle, avec ses objectifs et ses matières.">
        {site.cycles.map((c, i) => (
          <div key={i} className="space-y-3 rounded-xl border border-neutral-200 bg-neutral-50/60 p-4">
            <div className="flex items-center gap-2">
              <input value={c.nom} disabled={off} onChange={(e) => majCycle(i, { nom: e.target.value })} placeholder="Nom du cycle (ex. Primaire)" className={`${champ} font-semibold`} />
              <button type="button" aria-label="Monter" disabled={off || i === 0} onClick={() => maj({ cycles: deplacer(site.cycles, i, -1) })} className={boutonIcone}><ArrowUp className="h-4 w-4" /></button>
              <button type="button" aria-label="Descendre" disabled={off || i === site.cycles.length - 1} onClick={() => maj({ cycles: deplacer(site.cycles, i, 1) })} className={boutonIcone}><ArrowDown className="h-4 w-4" /></button>
              <button type="button" aria-label="Supprimer" disabled={off} onClick={() => maj({ cycles: site.cycles.filter((_, j) => j !== i) })} className={`${boutonIcone} hover:text-red-600`}><Trash2 className="h-4 w-4" /></button>
            </div>
            <Texte label="Description (facultatif)" value={c.description} onChange={(v) => majCycle(i, { description: v })} lignes={2} disabled={off} />
            <div className="grid gap-3 sm:grid-cols-2">
              <ZoneLignes label="Objectifs" value={c.objectifs} onChange={(v) => majCycle(i, { objectifs: v })} disabled={off} />
              <ZoneLignes label="Matières affichées" value={c.matieres} onChange={(v) => majCycle(i, { matieres: v })} disabled={off} />
            </div>
          </div>
        ))}
        {site.cycles.length < 8 && (
          <button type="button" disabled={off} onClick={() => maj({ cycles: [...site.cycles, { nom: "", description: "", objectifs: [], matieres: [] }] })} className={boutonAjout}>
            <Plus className="h-3.5 w-3.5" /> Ajouter un cycle
          </button>
        )}
      </Section>

      <Section titre="Tarifs" description="Grille des frais par classe, tranches de paiement, frais généraux et dossiers à fournir.">
        <p className="rounded-xl bg-amber-50 px-4 py-3 text-xs text-amber-800">
          Reprenez les montants de la fiche de renseignement officielle. Une case vide s&apos;affiche « — » ; une colonne entièrement vide est masquée.
        </p>
        <Texte label="Année scolaire de la grille" value={site.tarifs.annee} onChange={(v) => majTarifs({ annee: v })} placeholder="2026-2027" disabled={off} />

        <div>
          <p className={`${libelle} mb-2`}>Tranches de paiement (facultatif)</p>
          {site.tarifs.tranches.map((tr, i) => (
            <div key={i} className="mb-2 flex items-center gap-2">
              <input value={tr.libelle} disabled={off} onChange={(e) => majTarifs({ tranches: site.tarifs.tranches.map((x, j) => (j === i ? { ...x, libelle: e.target.value } : x)) })} placeholder={`Tranche ${i + 1}`} className={`${champ} w-44`} />
              <input value={tr.echeance} disabled={off} onChange={(e) => majTarifs({ tranches: site.tarifs.tranches.map((x, j) => (j === i ? { ...x, echeance: e.target.value } : x)) })} placeholder="Échéance et mois couverts (ex. le 05 décembre — nov., déc., janv.)" className={champ} />
              <button
                type="button"
                aria-label="Supprimer"
                disabled={off}
                onClick={() =>
                  majTarifs({
                    tranches: site.tarifs.tranches.filter((_, j) => j !== i),
                    lignes: site.tarifs.lignes.map((l) => ({ ...l, montantsTranches: l.montantsTranches.filter((_, j) => j !== i) })),
                  })
                }
                className={`${boutonIcone} hover:text-red-600`}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          {site.tarifs.tranches.length < 4 && (
            <button type="button" disabled={off} onClick={() => majTarifs({ tranches: [...site.tarifs.tranches, { libelle: "", echeance: "" }] })} className={boutonAjout}>
              <Plus className="h-3.5 w-3.5" /> Ajouter une tranche
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="text-left text-xs uppercase text-neutral-500">
                <th className="pb-2 pr-2 font-semibold">Groupe</th>
                <th className="pb-2 pr-2 font-semibold">Classe</th>
                <th className="pb-2 pr-2 font-semibold">Inscription</th>
                <th className="pb-2 pr-2 font-semibold">Réinscription</th>
                <th className="pb-2 pr-2 font-semibold">Mensualité</th>
                {site.tarifs.tranches.map((tr, i) => (
                  <th key={i} className="pb-2 pr-2 font-semibold">{tr.libelle || `Tranche ${i + 1}`}</th>
                ))}
                <th className="pb-2 pr-2 font-semibold">Annuel</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {site.tarifs.lignes.map((l, i) => {
                const majLigne = (p: Partial<typeof l>) =>
                  majTarifs({ lignes: site.tarifs.lignes.map((x, j) => (j === i ? { ...x, ...p } : x)) });
                const cellule = "px-2 py-1.5";
                return (
                  <tr key={i}>
                    <td className="py-1 pr-2"><input value={l.groupe} disabled={off} onChange={(e) => majLigne({ groupe: e.target.value })} placeholder="Collège" className={`${champ} ${cellule}`} /></td>
                    <td className="py-1 pr-2"><input value={l.classe} disabled={off} onChange={(e) => majLigne({ classe: e.target.value })} placeholder="6e année" className={`${champ} ${cellule}`} /></td>
                    {(["inscription", "reinscription", "mensualite"] as const).map((k) => (
                      <td key={k} className="py-1 pr-2"><input value={l[k]} disabled={off} onChange={(e) => majLigne({ [k]: e.target.value })} placeholder="0 GNF" className={`${champ} ${cellule}`} /></td>
                    ))}
                    {site.tarifs.tranches.map((_, t) => (
                      <td key={t} className="py-1 pr-2">
                        <input
                          value={l.montantsTranches[t] ?? ""}
                          disabled={off}
                          onChange={(e) => {
                            const m = [...l.montantsTranches];
                            while (m.length <= t) m.push("");
                            m[t] = e.target.value;
                            majLigne({ montantsTranches: m });
                          }}
                          placeholder="0 GNF"
                          className={`${champ} ${cellule}`}
                        />
                      </td>
                    ))}
                    <td className="py-1 pr-2"><input value={l.annuel} disabled={off} onChange={(e) => majLigne({ annuel: e.target.value })} placeholder="0 GNF" className={`${champ} ${cellule}`} /></td>
                    <td className="whitespace-nowrap py-1">
                      <button type="button" aria-label="Monter" disabled={off || i === 0} onClick={() => majTarifs({ lignes: deplacer(site.tarifs.lignes, i, -1) })} className={boutonIcone}><ArrowUp className="h-4 w-4" /></button>
                      <button type="button" aria-label="Supprimer" disabled={off} onClick={() => majTarifs({ lignes: site.tarifs.lignes.filter((_, j) => j !== i) })} className={`${boutonIcone} hover:text-red-600`}><Trash2 className="h-4 w-4" /></button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <button
          type="button"
          disabled={off}
          onClick={() =>
            majTarifs({
              lignes: [
                ...site.tarifs.lignes,
                { groupe: "", classe: "", inscription: "", reinscription: "", mensualite: "", montantsTranches: [], annuel: "" },
              ],
            })
          }
          className={boutonAjout}
        >
          <Plus className="h-3.5 w-3.5" /> Ajouter une classe
        </button>
        <p className={aideCls}>« Groupe » affiche un intertitre (ex. Collège, Lycée) au-dessus des classes qui le suivent.</p>

        <div>
          <Texte label="Titre des frais communs" value={site.tarifs.annexesTitre} onChange={(v) => majTarifs({ annexesTitre: v })} placeholder="Frais généraux" disabled={off} />
          <div className="mt-3">
            {site.tarifs.annexes.map((a, i) => (
              <div key={i} className="mb-2 flex items-center gap-2">
                <input value={a.libelle} disabled={off} onChange={(e) => majTarifs({ annexes: site.tarifs.annexes.map((x, j) => (j === i ? { ...x, libelle: e.target.value } : x)) })} placeholder="Libellé (ex. Inscription)" className={champ} />
                <input value={a.montant} disabled={off} onChange={(e) => majTarifs({ annexes: site.tarifs.annexes.map((x, j) => (j === i ? { ...x, montant: e.target.value } : x)) })} placeholder="Montant" className={`${champ} w-44`} />
                <button type="button" aria-label="Supprimer" disabled={off} onClick={() => majTarifs({ annexes: site.tarifs.annexes.filter((_, j) => j !== i) })} className={`${boutonIcone} hover:text-red-600`}><Trash2 className="h-4 w-4" /></button>
              </div>
            ))}
            <button type="button" disabled={off} onClick={() => majTarifs({ annexes: [...site.tarifs.annexes, { libelle: "", montant: "" }] })} className={boutonAjout}>
              <Plus className="h-3.5 w-3.5" /> Ajouter un frais
            </button>
          </div>
        </div>
        <ZoneLignes label="Dossiers à fournir" value={site.tarifs.dossiers} onChange={(v) => majTarifs({ dossiers: v.slice(0, 15) })} aide="Une pièce ou une condition par ligne." disabled={off} />
        <Texte label="Remarques (modalités de paiement, remboursement…)" value={site.tarifs.note} onChange={(v) => majTarifs({ note: v })} lignes={4} disabled={off} />
      </Section>

      <Section titre="Services" description="Restauration, cours de révision, tenues… avec leurs conditions.">
        {site.services.map((s, i) => (
          <div key={i} className="space-y-3 rounded-xl border border-neutral-200 bg-neutral-50/60 p-4">
            <div className="flex items-center gap-2">
              <input value={s.titre} disabled={off} onChange={(e) => majService(i, { titre: e.target.value })} placeholder="Nom du service" className={`${champ} font-semibold`} />
              <button type="button" aria-label="Monter" disabled={off || i === 0} onClick={() => maj({ services: deplacer(site.services, i, -1) })} className={boutonIcone}><ArrowUp className="h-4 w-4" /></button>
              <button type="button" aria-label="Descendre" disabled={off || i === site.services.length - 1} onClick={() => maj({ services: deplacer(site.services, i, 1) })} className={boutonIcone}><ArrowDown className="h-4 w-4" /></button>
              <button type="button" aria-label="Supprimer" disabled={off} onClick={() => maj({ services: site.services.filter((_, j) => j !== i) })} className={`${boutonIcone} hover:text-red-600`}><Trash2 className="h-4 w-4" /></button>
            </div>
            <Texte label="Description" value={s.texte} onChange={(v) => majService(i, { texte: v })} lignes={2} disabled={off} />
            <div>
              <p className={`${libelle} mb-2`}>Conditions ou catégories (facultatif)</p>
              <ListePoints value={s.points} onChange={(v) => majService(i, { points: v })} libelleTitre="Ex. Classes d'examen" libelleTexte="Ex. Cours obligatoires et gratuits." ajouter="Ajouter une condition" disabled={off} />
            </div>
          </div>
        ))}
        {site.services.length < 10 && (
          <button type="button" disabled={off} onClick={() => maj({ services: [...site.services, { titre: "", texte: "", points: [] }] })} className={boutonAjout}>
            <Plus className="h-3.5 w-3.5" /> Ajouter un service
          </button>
        )}
      </Section>

      {peutModifier && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-neutral-200 bg-white/95 backdrop-blur lg:pl-64">
          <div className="mx-auto flex max-w-4xl items-center justify-end gap-3 px-6 py-3 lg:px-10">
            <button
              type="button"
              onClick={enregistrer}
              disabled={isPending}
              className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Enregistrer le site
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
