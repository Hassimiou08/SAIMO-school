"use client";

import { useState, useRef } from "react";
import {
  Save, Building, CalendarClock, ShieldCheck,
  Palette, CreditCard, Upload, Check,
} from "lucide-react";
import { saveTheme } from "@/lib/theme";


const TABS = [
  { id: "general",    label: "Informations", icon: Building },
  { id: "apparence",  label: "Apparence",    icon: Palette },
  { id: "paiements",  label: "Paiements",    icon: CreditCard },
  { id: "annee",      label: "Année scolaire", icon: CalendarClock },
  { id: "securite",   label: "Sécurité",     icon: ShieldCheck },
];

const COULEURS = [
  { label: "Bleu SAIMO",   value: "blue",   hex: "#2563EB" },
  { label: "Vert Émeraude", value: "emerald", hex: "#059669" },
  { label: "Violet",        value: "violet",  hex: "#7C3AED" },
  { label: "Orange",        value: "orange",  hex: "#EA580C" },
  { label: "Ardoise",       value: "slate",   hex: "#475569" },
];

const POLICES = ["Inter", "Roboto", "Poppins", "Lato", "Nunito", "Raleway"];

const MODES_PAIEMENT_DEFAULT = [
  { id: "especes",      label: "Espèces",      actif: true  },
  { id: "cheque",       label: "Chèque",        actif: true  },
  { id: "virement",     label: "Virement bancaire", actif: true },
  { id: "orange_money", label: "Orange Money",  actif: true  },
  { id: "mtn_money",    label: "MTN Mobile Money", actif: false },
  { id: "visa",         label: "Carte Visa/Mastercard", actif: false },
];

function TabBtn({ tab, active, onClick }: { tab: typeof TABS[0]; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium w-full transition ${
        active ? "bg-blue-50 text-blue-700 shadow-sm" : "text-neutral-600 hover:bg-neutral-100"
      }`}
    >
      <tab.icon className="h-4 w-4 flex-shrink-0" />
      <span className="text-left">{tab.label}</span>
    </button>
  );
}

function SaveBtn({ label = "Enregistrer" }: { label?: string }) {
  return (
    <div className="pt-6 border-t border-neutral-100 flex justify-end">
      <button className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-600/20 hover:bg-blue-700 transition">
        <Save className="h-4 w-4" /> {label}
      </button>
    </div>
  );
}

export function SettingsForm() {
  const [activeTab, setActiveTab] = useState("general");
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [couleur, setCouleur] = useState("blue");
  const [police, setPolice] = useState("Inter");
  const [taille, setTaille] = useState("base");
  const [modes, setModes] = useState(MODES_PAIEMENT_DEFAULT);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setLogoPreview(URL.createObjectURL(file));
  };

  const toggleMode = (id: string) => {
    setModes(prev => prev.map(m => m.id === id ? { ...m, actif: !m.actif } : m));
  };

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Sidebar Nav */}
      <nav className="w-full md:w-56 flex-shrink-0 flex flex-col gap-1">
        {TABS.map(t => (
          <TabBtn key={t.id} tab={t} active={activeTab === t.id} onClick={() => setActiveTab(t.id)} />
        ))}
      </nav>

      {/* Panel */}
      <div className="flex-1 bg-white border border-neutral-200 rounded-3xl p-8 shadow-sm">

        {/* ── GENERAL ── */}
        {activeTab === "general" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-neutral-900">Informations de l'établissement</h2>
              <p className="text-sm text-neutral-500 mt-1">Profil officiel de votre école affiché sur tous les documents.</p>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Nom de l'établissement" defaultValue="Lycée SAIMO Conakry" />
              <Field label="Code" defaultValue="SAIMO-CKY-01" disabled />
              <Field label="Devise" type="select" options={["GNF", "USD", "EUR"]} className="md:col-span-1" />
              <Field label="Pays" defaultValue="Guinée" />
              <Field label="Ville" defaultValue="Conakry" />
              <Field label="Téléphone" defaultValue="+224 620 00 00 00" />
              <Field label="Email" defaultValue="contact@saimo.edu.gn" className="md:col-span-2" />
              <Field label="Site web" defaultValue="https://saimo.edu.gn" className="md:col-span-2" />
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-medium text-neutral-700">Adresse complète</label>
                <textarea rows={2} defaultValue="Quartier Kipé, Commune de Ratoma, Conakry, Guinée" className="w-full rounded-xl border border-neutral-200 px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 resize-none" />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-medium text-neutral-700">Mentions légales / Slogan</label>
                <textarea rows={2} defaultValue="Excellence, Intégrité & Avenir" className="w-full rounded-xl border border-neutral-200 px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 resize-none" />
              </div>
            </div>
            <SaveBtn />
          </div>
        )}

        {/* ── APPARENCE ── */}
        {activeTab === "apparence" && (
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-bold text-neutral-900">Apparence & Marque</h2>
              <p className="text-sm text-neutral-500 mt-1">Personnalisez le logo, les couleurs et la typographie du portail.</p>
            </div>

            {/* Logo */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-neutral-700">Logo de l'établissement</label>
              <div className="flex items-center gap-6">
                <div className="flex h-24 w-24 items-center justify-center rounded-2xl border-2 border-dashed border-neutral-300 bg-neutral-50 overflow-hidden">
                  {logoPreview
                    ? <img src={logoPreview} alt="Logo" className="h-full w-full object-cover" />
                    : <Building className="h-8 w-8 text-neutral-300" />
                  }
                </div>
                <div className="space-y-2">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition shadow-sm"
                  >
                    <Upload className="h-4 w-4" /> Choisir un fichier
                  </button>
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogo} />
                  <p className="text-xs text-neutral-400">PNG, JPG, SVG — max 2 Mo — recommandé 200×200px</p>
                  {logoPreview && (
                    <button onClick={() => setLogoPreview(null)} className="text-xs text-red-500 hover:underline">Supprimer</button>
                  )}
                </div>
              </div>
            </div>

            {/* Couleur */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-neutral-700">Couleur principale</label>
              <div className="flex flex-wrap gap-3">
                {COULEURS.map(c => (
                  <button
                    key={c.value}
                    onClick={() => setCouleur(c.value)}
                    className={`flex items-center gap-2.5 rounded-xl border px-4 py-2.5 text-sm font-medium transition ${
                      couleur === c.value ? "border-blue-400 bg-blue-50 shadow-sm" : "border-neutral-200 bg-white hover:border-neutral-300"
                    }`}
                  >
                    <span className="h-4 w-4 rounded-full" style={{ backgroundColor: c.hex }} />
                    {c.label}
                    {couleur === c.value && <Check className="h-3 w-3 text-blue-600" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Police */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-neutral-700">Police d'écriture</label>
              <div className="flex flex-wrap gap-3">
                {POLICES.map(p => (
                  <button
                    key={p}
                    onClick={() => setPolice(p)}
                    className={`rounded-xl border px-4 py-2.5 text-sm font-medium transition ${
                      police === p ? "border-blue-400 bg-blue-50 text-blue-700 shadow-sm" : "border-neutral-200 bg-white hover:border-neutral-300 text-neutral-700"
                    }`}
                    style={{ fontFamily: p }}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Taille texte */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-neutral-700">Taille de base du texte</label>
              <div className="flex gap-3">
                {[
                  { v: "sm", l: "Petit (14px)" },
                  { v: "base", l: "Normal (16px)" },
                  { v: "lg", l: "Grand (18px)" },
                ].map(({ v, l }) => (
                  <button
                    key={v}
                    onClick={() => setTaille(v)}
                    className={`rounded-xl border px-4 py-2.5 text-sm font-medium transition ${
                      taille === v ? "border-blue-400 bg-blue-50 text-blue-700 shadow-sm" : "border-neutral-200 bg-white hover:border-neutral-300 text-neutral-700"
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            {/* Aperçu */}
            <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-3">Aperçu en direct</p>
              <div className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm">
                <div className="h-10 w-10 rounded-xl flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: COULEURS.find(c => c.value === couleur)?.hex }}>S</div>
                <div>
                  <p className="font-bold text-neutral-900" style={{ fontFamily: police, fontSize: taille === "sm" ? 14 : taille === "lg" ? 18 : 16 }}>Lycée SAIMO Conakry</p>
                  <p className="text-xs text-neutral-500">Administration</p>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-neutral-100 flex justify-end">
              <button
                onClick={() => saveTheme({ couleur, police, taille })}
                className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-600/20 hover:bg-blue-700 transition"
              >
                <Save className="h-4 w-4" /> Appliquer le thème
              </button>
            </div>
          </div>
        )}

        {/* ── PAIEMENTS ── */}
        {activeTab === "paiements" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-neutral-900">Modes de Paiement</h2>
              <p className="text-sm text-neutral-500 mt-1">Activez les modes de paiement acceptés par l'établissement.</p>
            </div>

            <div className="space-y-3">
              {modes.map(m => (
                <div key={m.id} className="flex items-center justify-between rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm transition hover:border-blue-200">
                  <div className="flex items-center gap-3">
                    <div className={`h-9 w-9 rounded-xl flex items-center justify-center ${m.actif ? "bg-green-100" : "bg-neutral-100"}`}>
                      <CreditCard className={`h-4 w-4 ${m.actif ? "text-green-600" : "text-neutral-400"}`} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-neutral-800">{m.label}</p>
                      <p className="text-xs text-neutral-400">{m.actif ? "Actif — disponible à la caisse" : "Inactif"}</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={m.actif} onChange={() => toggleMode(m.id)} className="sr-only peer" />
                    <div className="w-11 h-6 bg-neutral-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
                  </label>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 p-5">
              <h3 className="text-sm font-semibold text-neutral-700 mb-3">Format des reçus</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Préfixe du numéro de reçu" defaultValue="REC-" />
                <Field label="Devise d'affichage" type="select" options={["GNF (Franc Guinéen)", "USD (Dollar)", "EUR (Euro)"]} />
                <Field label="Format de date sur les reçus" type="select" options={["DD/MM/YYYY", "MM/DD/YYYY", "YYYY-MM-DD"]} />
                <Field label="Mentions de bas de page" defaultValue="Merci de conserver ce reçu." />
              </div>
            </div>

            <SaveBtn label="Sauvegarder les paramètres de paiement" />
          </div>
        )}

        {/* ── ANNEE ── */}
        {activeTab === "annee" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-neutral-900">Année Scolaire & Périodes</h2>
              <p className="text-sm text-neutral-500 mt-1">Configurez l'année académique active et ses trimestres.</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Année active" type="select" options={["2026 - 2027 (Active)", "2025 - 2026 (Archivée)"]} className="md:col-span-2" />
              <Field label="Début d'année" type="date" className="md:col-span-1" />
              <Field label="Fin d'année" type="date" className="md:col-span-1" />
            </div>
            <div className="space-y-3">
              <label className="text-sm font-semibold text-neutral-700">Découpage des trimestres</label>
              {["1er Trimestre", "2ème Trimestre", "3ème Trimestre"].map((tr, i) => (
                <div key={i} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
                  <span className="font-medium text-sm text-neutral-700 w-32">{tr}</span>
                  <div className="flex items-center gap-3">
                    <input type="date" className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-400" />
                    <span className="text-neutral-400 text-sm">→</span>
                    <input type="date" className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-400" />
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-3">
              <label className="text-sm font-semibold text-neutral-700">Format du matricule élève</label>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Format" type="select" options={["ANNEE-SEQ (ex: 2026-0001)", "CODE-NIVEAU-SEQ", "Personnalisé"]} />
                <Field label="Préfixe" defaultValue="EL-" />
              </div>
            </div>
            <SaveBtn label="Mettre à jour la configuration annuelle" />
          </div>
        )}

        {/* ── SECURITE ── */}
        {activeTab === "securite" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-neutral-900">Sécurité & Rôles</h2>
              <p className="text-sm text-neutral-500 mt-1">Politique d'accès et règles de sécurité du portail.</p>
            </div>

            <div className="space-y-3">
              {[
                { title: "Authentification à deux facteurs (2FA)", desc: "Forcer le 2FA pour les administrateurs et comptables.", defaultChecked: true },
                { title: "Journalisation des actions (Audit)", desc: "Enregistrer toutes les modifications dans le journal d'audit.", defaultChecked: true },
                { title: "Mode maintenance", desc: "Désactiver temporairement le portail pour les utilisateurs non-admin.", defaultChecked: false },
              ].map((opt, i) => (
                <div key={i} className="flex items-center justify-between rounded-2xl border border-neutral-200 p-4">
                  <div>
                    <p className="text-sm font-semibold text-neutral-800">{opt.title}</p>
                    <p className="text-xs text-neutral-500 mt-0.5">{opt.desc}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked={opt.defaultChecked} className="sr-only peer" />
                    <div className="w-11 h-6 bg-neutral-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
                  </label>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5 space-y-4">
              <h3 className="font-semibold text-sm text-neutral-700">Politique de mot de passe</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Longueur minimale" type="select" options={["6 caractères", "8 caractères", "12 caractères"]} />
                <Field label="Verrouillage après N tentatives" type="select" options={["3 tentatives", "5 tentatives", "10 tentatives"]} />
                <Field label="Expiration du mot de passe" type="select" options={["Jamais", "90 jours", "180 jours", "1 an"]} />
                <Field label="Durée de session inactive" type="select" options={["15 min", "30 min", "1 heure", "Jamais"]} />
              </div>
            </div>

            <SaveBtn label="Mettre à jour la politique de sécurité" />
          </div>
        )}
      </div>
    </div>
  );
}

// Helper component
function Field({ label, defaultValue, disabled, type = "text", options, className = "" }: {
  label: string; defaultValue?: string; disabled?: boolean;
  type?: "text" | "date" | "select"; options?: string[]; className?: string;
}) {
  const base = "w-full rounded-xl border border-neutral-200 px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition";
  return (
    <div className={`space-y-2 ${className}`}>
      <label className="text-sm font-medium text-neutral-700">{label}</label>
      {type === "select" ? (
        <select className={`${base} bg-white cursor-pointer appearance-none`}>
          {options?.map(o => <option key={o}>{o}</option>)}
        </select>
      ) : (
        <input type={type} defaultValue={defaultValue} disabled={disabled}
          className={`${base} ${disabled ? "bg-neutral-50 text-neutral-400 cursor-not-allowed" : "bg-white"}`} />
      )}
    </div>
  );
}
