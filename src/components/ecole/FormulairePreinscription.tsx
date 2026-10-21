"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, ChevronLeft, ChevronRight, Loader2, Plus, School, Trash2, UserRound } from "lucide-react";
import { MAX_ENFANTS_PREINSCRIPTION } from "@/lib/site-ecole";

type Config = {
  etablissementId: string;
  etablissementNom: string;
  anneeScolaireId: string;
  anneeLibelle: string;
  niveaux: { id: string; nom: string; cycle: string }[];
};
type EcoleChoix = { slug: string; nom: string; localisation: string };
type Enfant = { prenomEleve: string; nomEleve: string; dateNaissance: string; sexe: string; niveauId: string };
type Etape = "ecole" | "enfants" | "parent" | "recap";

const CHAMP =
  "w-full p-3 bg-paper-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-[var(--ec-primary,#1B6FD1)] outline-none transition-all text-sm";
const BOUTON =
  "bg-[var(--ec-primary,#1B6FD1)] hover:opacity-90 text-white font-bold py-2.5 px-6 rounded-xl flex items-center gap-2 transition-all shadow-md text-sm disabled:opacity-60";
const BOUTON_ENVOI =
  "bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 px-6 rounded-xl flex items-center gap-2 transition-all shadow-md text-sm disabled:opacity-60";
const RETOUR = "text-slate-500 hover:text-navy-900 text-sm font-bold py-2.5 px-4 rounded-xl flex items-center gap-2";

const LIBELLES: Record<Etape, { titre: string; sous: string }> = {
  ecole: { titre: "École", sous: "Établissement souhaité" },
  enfants: { titre: "Enfants", sous: "Identité et niveau souhaité" },
  parent: { titre: "Responsable", sous: "Coordonnées et contacts" },
  recap: { titre: "Récapitulatif", sous: "Vérification et envoi" },
};

const enfantVide = (): Enfant => ({ prenomEleve: "", nomEleve: "", dateNaissance: "", sexe: "", niveauId: "" });

/**
 * Tunnel de préinscription, partagé par le site SAIMO et les sites des écoles.
 * - `ecole` fourni (site d'une école) : la demande est adressée à cette école.
 * - sans `ecole` (site SAIMO) : le parent choisit d'abord l'école ; `?ecole=…` dans l'URL la présélectionne.
 * Une demande peut concerner plusieurs enfants (un même responsable).
 */
export function FormulairePreinscription({
  ecole,
  accueilHref,
  telephoneAide,
}: {
  ecole?: string;
  accueilHref: string;
  telephoneAide?: string;
}) {
  const choixEcole = !ecole;
  const etapes: Etape[] = choixEcole ? ["ecole", "enfants", "parent", "recap"] : ["enfants", "parent", "recap"];

  const [etape, setEtape] = useState<Etape>(etapes[0]);
  const [ecoles, setEcoles] = useState<EcoleChoix[] | null>(null);
  const [slug, setSlug] = useState(ecole ?? "");
  const [config, setConfig] = useState<Config | null>(null);
  const [configErreur, setConfigErreur] = useState("");
  const chargement = !!slug && !config && !configErreur;
  const [enfants, setEnfants] = useState<Enfant[]>([enfantVide()]);
  const [parent, setParent] = useState({ prenomTuteur: "", nomTuteur: "", telephone: "", email: "", message: "" });
  const [references, setReferences] = useState<string[] | null>(null);
  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState("");

  /** Change d'école : la configuration et les niveaux choisis dépendent de l'école. */
  const choisirEcole = (s: string) => {
    if (s === slug) return;
    setSlug(s);
    setConfig(null);
    setConfigErreur("");
    setErreur("");
    setEnfants((l) => l.map((e) => ({ ...e, niveauId: "" })));
  };

  // Site SAIMO : liste des écoles ouvertes, présélection via ?ecole=
  useEffect(() => {
    if (!choixEcole) return;
    fetch("/api/ecoles")
      .then((r) => (r.ok ? r.json() : { ecoles: [] }))
      .then((d: { ecoles: EcoleChoix[] }) => {
        setEcoles(d.ecoles);
        const voulue = new URLSearchParams(window.location.search).get("ecole");
        if (voulue && d.ecoles.some((e) => e.slug === voulue)) setSlug(voulue);
        else if (d.ecoles.length === 1) setSlug(d.ecoles[0].slug);
      })
      .catch(() => setEcoles([]));
  }, [choixEcole]);

  // Configuration (année, niveaux) de l'école choisie
  useEffect(() => {
    if (!slug) return;
    let annule = false;
    fetch(`/api/pre-inscriptions?ecole=${encodeURIComponent(slug)}`)
      .then(async (r) => {
        const d = await r.json().catch(() => ({}));
        if (annule) return;
        if (r.ok) setConfig(d);
        else setConfigErreur(d.erreur ?? "Les préinscriptions en ligne ne sont pas ouvertes pour cette école.");
      })
      .catch(() => !annule && setConfigErreur("Impossible de charger le formulaire. Vérifiez votre connexion."));
    return () => { annule = true; };
  }, [slug]);

  const majEnfant = (i: number, p: Partial<Enfant>) => setEnfants((l) => l.map((e, j) => (j === i ? { ...e, ...p } : e)));
  const majParent = (k: keyof typeof parent, v: string) => setParent((p) => ({ ...p, [k]: v }));
  const niveauNom = (id: string) => config?.niveaux.find((n) => n.id === id)?.nom;

  /** Contrôle des étapes précédant `cible` ; renvoie l'étape à corriger, ou null. */
  const verifier = (cible: Etape): Etape | null => {
    const avant = etapes.slice(0, etapes.indexOf(cible));
    if (avant.includes("ecole") && (!slug || !config)) {
      setErreur(!slug ? "Choisissez l'école souhaitée." : configErreur || "Formulaire en cours de chargement…");
      return "ecole";
    }
    if (avant.includes("enfants") && enfants.some((e) => !e.prenomEleve.trim() || !e.nomEleve.trim())) {
      setErreur("Le prénom et le nom de chaque enfant sont obligatoires.");
      return "enfants";
    }
    if (avant.includes("parent") && parent.telephone.trim().length < 6) {
      setErreur("Le téléphone du responsable est obligatoire.");
      return "parent";
    }
    return null;
  };

  const allerA = (cible: Etape) => {
    setErreur("");
    const aCorriger = verifier(cible);
    setEtape(aCorriger ?? cible);
  };
  const suivante = () => allerA(etapes[etapes.indexOf(etape) + 1]);
  const precedente = () => { setErreur(""); setEtape(etapes[etapes.indexOf(etape) - 1]); };

  const soumettre = async () => {
    setErreur("");
    const aCorriger = verifier("recap");
    if (aCorriger) { setEtape(aCorriger); return; }
    if (!config) { setErreur(configErreur || "Le formulaire n'est pas encore chargé. Réessayez dans un instant."); return; }
    setEnvoi(true);
    try {
      const res = await fetch("/api/pre-inscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ecole: slug,
          etablissementId: config.etablissementId,
          anneeScolaireId: config.anneeScolaireId,
          enfants: enfants.map((e) => ({
            prenomEleve: e.prenomEleve,
            nomEleve: e.nomEleve,
            dateNaissance: e.dateNaissance || undefined,
            sexe: e.sexe || undefined,
            niveauId: e.niveauId || undefined,
          })),
          ...parent,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) { setErreur(data.erreur ?? "L'envoi a échoué. Réessayez."); return; }
      setReferences(data.references ?? [data.reference]);
    } catch {
      setErreur("Erreur réseau : vérifiez votre connexion puis réessayez.");
    } finally {
      setEnvoi(false);
    }
  };

  if (references) {
    return (
      <div className="p-8 md:p-16 text-center flex flex-col items-center justify-center min-h-[420px]">
        <div className="h-20 w-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-navy-900 mb-4">Demande envoyée avec succès !</h2>
        <p className="text-slate-600 text-lg max-w-xl mx-auto mb-6 leading-relaxed">
          {config?.etablissementNom ?? "L'école"} a bien reçu votre demande
          {enfants.length > 1 ? ` pour vos ${enfants.length} enfants` : ""}. L&apos;école va examiner le dossier et vous contactera.
        </p>
        <ul className="mb-8 w-full max-w-md space-y-2 text-left">
          {enfants.map((e, i) => (
            <li key={i} className="flex items-center justify-between gap-4 rounded-xl border border-neutral-200 bg-paper-50 px-4 py-3 text-sm">
              <span className="font-semibold text-navy-900">{e.prenomEleve} {e.nomEleve}</span>
              <span className="font-mono text-xs text-slate-600">{references[i]}</span>
            </li>
          ))}
        </ul>
        <p className="mb-8 text-sm text-slate-500">Conservez ces références pour tout suivi.</p>
        <a href={accueilHref} className={BOUTON}>Retour à l&apos;accueil</a>
      </div>
    );
  }

  const indice = etapes.indexOf(etape);

  return (
    <div className="flex flex-col md:flex-row">
      {/* Étapes */}
      <div className="w-full md:w-1/3 bg-slate-50 p-6 md:p-10 border-b md:border-b-0 md:border-r border-neutral-200">
        <h3 className="font-display font-bold text-xl text-navy-900 mb-6 md:mb-10">Votre progression</h3>
        <ol className="flex md:flex-col gap-3 md:gap-8">
          {etapes.map((e, i) => (
            <li key={e}>
              <button
                type="button"
                onClick={() => i <= indice && allerA(e)}
                disabled={i > indice}
                className={`flex items-start gap-3 text-left transition-opacity ${i === indice ? "opacity-100" : "opacity-60 hover:opacity-100"} disabled:cursor-not-allowed`}
              >
                <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-bold ${i <= indice ? "bg-[var(--ec-primary,#1B6FD1)] text-white" : "bg-white border-2 border-neutral-200 text-slate-400"}`}>{i + 1}</span>
                <span className="hidden sm:block pt-1">
                  <span className="block font-bold text-sm text-navy-900">{LIBELLES[e].titre}</span>
                  <span className="block text-xs text-slate-500">{LIBELLES[e].sous}</span>
                </span>
              </button>
            </li>
          ))}
        </ol>
        {telephoneAide && (
          <div className="mt-8 md:mt-14 p-4 bg-white border border-neutral-200 rounded-2xl">
            <p className="font-bold text-navy-900 text-sm mb-1">Besoin d&apos;aide ?</p>
            <p className="text-xs text-slate-600">Appelez-nous au <strong className="text-navy-900">{telephoneAide}</strong>.</p>
          </div>
        )}
      </div>

      {/* Contenu de l'étape */}
      <div className="w-full md:w-2/3 p-6 md:p-10">
        {!choixEcole && configErreur && (
          <p className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">{configErreur}</p>
        )}

        {etape === "ecole" && (
          <div>
            <h2 className="font-display text-2xl font-bold text-navy-900 mb-1">Choix de l&apos;école</h2>
            <p className="text-slate-500 text-sm mb-6">Votre demande sera transmise directement à l&apos;école choisie.</p>
            {ecoles === null ? (
              <p className="flex items-center gap-2 text-sm text-slate-500"><Loader2 className="h-4 w-4 animate-spin" /> Chargement des écoles…</p>
            ) : ecoles.length === 0 ? (
              <p className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                Aucune école n&apos;accepte de préinscriptions en ligne pour le moment.
              </p>
            ) : (
              <div className="grid gap-3">
                {ecoles.map((e) => (
                  <label
                    key={e.slug}
                    className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-colors ${slug === e.slug ? "border-[var(--ec-primary,#1B6FD1)] bg-blue-50/40" : "border-neutral-200 hover:bg-paper-50"}`}
                  >
                    <input type="radio" name="ecole" value={e.slug} checked={slug === e.slug} onChange={() => choisirEcole(e.slug)} className="mt-1 accent-[var(--ec-primary,#1B6FD1)]" />
                    <span>
                      <span className="flex items-center gap-2 font-bold text-navy-900"><School className="h-4 w-4 text-slate-400" /> {e.nom}</span>
                      {e.localisation && <span className="mt-0.5 block text-xs text-slate-500">{e.localisation}</span>}
                    </span>
                  </label>
                ))}
              </div>
            )}
            {slug && chargement && <p className="mt-4 flex items-center gap-2 text-sm text-slate-500"><Loader2 className="h-4 w-4 animate-spin" /> Chargement du formulaire…</p>}
            {slug && configErreur && <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">{configErreur}</p>}
            {erreur && <p className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">{erreur}</p>}
            <div className="pt-6 flex justify-end">
              <button type="button" onClick={suivante} disabled={!config} className={BOUTON}>
                Étape suivante <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {etape === "enfants" && (
          <div>
            <h2 className="font-display text-2xl font-bold text-navy-900 mb-1">
              {enfants.length > 1 ? `Vos ${enfants.length} enfants` : "Informations de l'enfant"}
            </h2>
            <p className="text-slate-500 text-sm mb-6">
              {config ? `${config.etablissementNom} — année ${config.anneeLibelle}` : configErreur ? "" : "Chargement…"}
              {" · "}Vous pouvez inscrire plusieurs enfants dans la même demande.
            </p>
            <div className="space-y-4">
              {enfants.map((e, i) => (
                <fieldset key={i} className="rounded-2xl border border-neutral-200 p-4">
                  <legend className="flex items-center gap-2 px-2 text-sm font-bold text-navy-900">
                    <UserRound className="h-4 w-4 text-slate-400" /> Enfant {i + 1}
                  </legend>
                  <div className="grid md:grid-cols-2 gap-3">
                    <input className={CHAMP} aria-label={`Prénom de l'enfant ${i + 1}`} placeholder="Prénom *" value={e.prenomEleve} onChange={(ev) => majEnfant(i, { prenomEleve: ev.target.value })} />
                    <input className={CHAMP} aria-label={`Nom de l'enfant ${i + 1}`} placeholder="Nom *" value={e.nomEleve} onChange={(ev) => majEnfant(i, { nomEleve: ev.target.value })} />
                    <label className="text-xs text-slate-500">
                      Date de naissance
                      <input type="date" className={`${CHAMP} mt-1`} value={e.dateNaissance} onChange={(ev) => majEnfant(i, { dateNaissance: ev.target.value })} />
                    </label>
                    <label className="text-xs text-slate-500">
                      Sexe
                      <select className={`${CHAMP} mt-1`} value={e.sexe} onChange={(ev) => majEnfant(i, { sexe: ev.target.value })}>
                        <option value="">—</option>
                        <option value="M">Masculin</option>
                        <option value="F">Féminin</option>
                      </select>
                    </label>
                    <select className={`${CHAMP} md:col-span-2`} aria-label={`Niveau souhaité pour l'enfant ${i + 1}`} value={e.niveauId} onChange={(ev) => majEnfant(i, { niveauId: ev.target.value })}>
                      <option value="">Niveau souhaité</option>
                      {config?.niveaux.map((n) => (
                        <option key={n.id} value={n.id}>{n.nom} — {n.cycle}</option>
                      ))}
                    </select>
                  </div>
                  {enfants.length > 1 && (
                    <button type="button" onClick={() => setEnfants((l) => l.filter((_, j) => j !== i))} className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:underline">
                      <Trash2 className="h-3.5 w-3.5" /> Retirer cet enfant
                    </button>
                  )}
                </fieldset>
              ))}
            </div>
            {enfants.length < MAX_ENFANTS_PREINSCRIPTION && (
              <button
                type="button"
                onClick={() => setEnfants((l) => [...l, { ...enfantVide(), nomEleve: l[0]?.nomEleve ?? "" }])}
                className="mt-4 inline-flex items-center gap-2 rounded-xl border border-dashed border-neutral-300 px-4 py-2.5 text-sm font-semibold text-navy-900 hover:border-[var(--ec-primary,#1B6FD1)]"
              >
                <Plus className="h-4 w-4" /> Ajouter un enfant
              </button>
            )}
            {erreur && <p className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">{erreur}</p>}
            <div className="pt-6 flex justify-between items-center">
              {indice > 0 ? <button type="button" onClick={precedente} className={RETOUR}><ChevronLeft className="h-4 w-4" /> Retour</button> : <span />}
              <button type="button" onClick={suivante} className={BOUTON}>
                Étape suivante <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {etape === "parent" && (
          <div>
            <h2 className="font-display text-2xl font-bold text-navy-900 mb-1">Coordonnées du responsable</h2>
            <p className="text-slate-500 text-sm mb-6">Nous utiliserons ces informations pour vous recontacter.</p>
            <div className="grid md:grid-cols-2 gap-3">
              <input className={CHAMP} placeholder="Prénom du parent ou tuteur" value={parent.prenomTuteur} onChange={(e) => majParent("prenomTuteur", e.target.value)} />
              <input className={CHAMP} placeholder="Nom du parent ou tuteur" value={parent.nomTuteur} onChange={(e) => majParent("nomTuteur", e.target.value)} />
              <input type="tel" className={CHAMP} placeholder="Téléphone * (6XX XX XX XX)" value={parent.telephone} onChange={(e) => majParent("telephone", e.target.value)} />
              <input type="email" className={CHAMP} placeholder="E-mail (facultatif)" value={parent.email} onChange={(e) => majParent("email", e.target.value)} />
              <textarea className={`${CHAMP} md:col-span-2`} rows={3} placeholder="Message ou précisions (facultatif)" value={parent.message} onChange={(e) => majParent("message", e.target.value)} />
            </div>
            {erreur && <p className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">{erreur}</p>}
            <div className="pt-6 flex justify-between items-center">
              <button type="button" onClick={precedente} className={RETOUR}><ChevronLeft className="h-4 w-4" /> Retour</button>
              <button type="button" onClick={suivante} className={BOUTON}>
                Étape suivante <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {etape === "recap" && (
          <div>
            <h2 className="font-display text-2xl font-bold text-navy-900 mb-1">Récapitulatif</h2>
            <p className="text-slate-500 text-sm mb-6">Vérifiez puis envoyez votre demande.</p>
            <div className="rounded-2xl border border-neutral-200 bg-white p-5 text-sm space-y-3">
              <p><span className="text-slate-500">École : </span><strong>{config?.etablissementNom}</strong></p>
              <div>
                <p className="text-slate-500">{enfants.length > 1 ? `Enfants (${enfants.length}) :` : "Enfant :"}</p>
                <ul className="mt-1 space-y-1">
                  {enfants.map((e, i) => (
                    <li key={i}><strong>{e.prenomEleve} {e.nomEleve}</strong> — {niveauNom(e.niveauId) ?? "niveau non précisé"}</li>
                  ))}
                </ul>
              </div>
              <p><span className="text-slate-500">Contact : </span>{parent.prenomTuteur} {parent.nomTuteur} — {parent.telephone || "—"}{parent.email ? ` · ${parent.email}` : ""}</p>
              {parent.message && <p className="italic text-slate-500">« {parent.message} »</p>}
            </div>
            <p className="mt-4 text-xs text-slate-500 leading-relaxed bg-paper-50 p-3 rounded-xl border border-neutral-200">
              Les pièces du dossier (extrait de naissance, bulletins, photos, certificat médical…) seront à fournir lors du rendez-vous fixé par l&apos;administration.
            </p>
            {erreur && <p className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">{erreur}</p>}
            <div className="pt-6 flex justify-between items-center border-t border-neutral-100 mt-4">
              <button type="button" onClick={precedente} className={RETOUR}><ChevronLeft className="h-4 w-4" /> Retour</button>
              <button type="button" onClick={soumettre} disabled={envoi || !config} className={BOUTON_ENVOI}>
                {envoi ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />} {envoi ? "Envoi…" : "Envoyer la demande"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
