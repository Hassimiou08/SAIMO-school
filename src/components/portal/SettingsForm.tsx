"use client";

import { toast } from "sonner";

import { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Save, Building, Palette, CalendarClock, Loader2, CheckCircle2, Check } from "lucide-react";
import { saveTheme, loadTheme } from "@/lib/theme";
import { actionMajEtablissement } from "@/server/actions/admin";
import { useFormStatus } from "react-dom";

const COULEURS = [
  { label: "Bleu SAIMO", value: "blue", hex: "#2563EB" },
  { label: "Vert Émeraude", value: "emerald", hex: "#059669" },
  { label: "Violet", value: "violet", hex: "#7C3AED" },
  { label: "Orange", value: "orange", hex: "#EA580C" },
  { label: "Ardoise", value: "slate", hex: "#475569" },
];

const champ = "w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition";

type Props = {
  etablissement: {
    nom: string; code: string; telephone: string | null; email: string | null;
    adresse: string | null; ville: string | null; pays: string; devise: string;
    siteWeb: string | null; mentionsLegales: string | null;
  };
  annees: { id: string; libelle: string; active: boolean; verrouillee: boolean; debut: string; fin: string }[];
};

function SubmitBtn() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-60">
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Enregistrer
    </button>
  );
}

export function SettingsForm({ etablissement, annees }: Props) {
  const router = useRouter();
  const [tab, setTab] = useState<"infos" | "apparence" | "annee">("infos");
  const [ok, setOk] = useState(false);
  const [, startTransition] = useTransition();
  const [theme, setThemeState] = useState(() => loadTheme());

  useEffect(() => {
    if (!ok) return;
    const t = setTimeout(() => setOk(false), 3000);
    return () => clearTimeout(t);
  }, [ok]);

  const submitInfos = (fd: FormData) => {
    startTransition(async () => {
      const r = await actionMajEtablissement(fd);
      if (r.succes) { setOk(true); router.refresh(); }
      else toast.error(r.erreur);
    });
  };

  const setCouleur = (value: string) => {
    const next = { ...theme, couleur: value };
    setThemeState(next);
    saveTheme(next);
  };

  return (
    <div>
      <div className="mb-6 flex gap-1 rounded-full border border-neutral-200 bg-white p-1 w-fit">
        {[
          { id: "infos", label: "Informations", icon: Building },
          { id: "apparence", label: "Apparence", icon: Palette },
          { id: "annee", label: "Année scolaire", icon: CalendarClock },
        ].map((t) => (
          <button key={t.id} onClick={() => setTab(t.id as typeof tab)} className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${tab === t.id ? "bg-navy-950 text-white" : "text-ink-500 hover:text-navy-900"}`}>
            <t.icon className="h-4 w-4" /> {t.label}
          </button>
        ))}
      </div>

      {ok && <p className="mb-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700"><CheckCircle2 className="mr-1.5 inline h-4 w-4" />Modifications enregistrées.</p>}

      {tab === "infos" && (
        <form action={submitInfos} className="rounded-2xl border border-neutral-200 bg-white p-6 md:p-8 space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div><label className="text-sm font-semibold text-neutral-700">Nom de l&rsquo;établissement</label><input name="nom" defaultValue={etablissement.nom} className={champ} /></div>
            <div><label className="text-sm font-semibold text-neutral-700">Code</label><input defaultValue={etablissement.code} disabled className={`${champ} bg-neutral-100`} /></div>
            <div><label className="text-sm font-semibold text-neutral-700">Téléphone</label><input name="telephone" defaultValue={etablissement.telephone ?? ""} className={champ} /></div>
            <div><label className="text-sm font-semibold text-neutral-700">Email</label><input name="email" type="email" defaultValue={etablissement.email ?? ""} className={champ} /></div>
            <div><label className="text-sm font-semibold text-neutral-700">Ville</label><input name="ville" defaultValue={etablissement.ville ?? ""} className={champ} /></div>
            <div><label className="text-sm font-semibold text-neutral-700">Devise</label><input name="devise" defaultValue={etablissement.devise} className={champ} /></div>
            <div className="sm:col-span-2"><label className="text-sm font-semibold text-neutral-700">Adresse</label><input name="adresse" defaultValue={etablissement.adresse ?? ""} className={champ} /></div>
            <div className="sm:col-span-2"><label className="text-sm font-semibold text-neutral-700">Site web</label><input name="siteWeb" defaultValue={etablissement.siteWeb ?? ""} className={champ} /></div>
            <div className="sm:col-span-2"><label className="text-sm font-semibold text-neutral-700">Mentions légales (pied de reçu)</label><textarea name="mentionsLegales" rows={2} defaultValue={etablissement.mentionsLegales ?? ""} className={champ} /></div>
          </div>
          <div className="flex justify-end border-t border-neutral-100 pt-5"><SubmitBtn /></div>
        </form>
      )}

      {tab === "apparence" && (
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 md:p-8">
          <h3 className="font-display text-sm font-bold text-navy-900 mb-4">Couleur principale du portail</h3>
          <div className="flex flex-wrap gap-3">
            {COULEURS.map((c) => (
              <button key={c.value} onClick={() => setCouleur(c.value)} className={`flex items-center gap-2 rounded-xl border-2 px-4 py-2.5 text-sm font-semibold transition ${theme.couleur === c.value ? "border-blue-500" : "border-neutral-200 hover:border-neutral-300"}`}>
                <span className="h-4 w-4 rounded-full" style={{ background: c.hex }} />
                {c.label}
                {theme.couleur === c.value && <Check className="h-4 w-4 text-blue-600" />}
              </button>
            ))}
          </div>
          <p className="mt-4 text-xs text-neutral-400">La préférence d&rsquo;apparence est enregistrée sur cet appareil.</p>
        </div>
      )}

      {tab === "annee" && (
        <div className="rounded-2xl border border-neutral-200 bg-white overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead><tr className="border-b border-neutral-100 bg-neutral-50/50 text-xs uppercase text-neutral-500"><th className="px-5 py-3">Année</th><th className="px-5 py-3">Période</th><th className="px-5 py-3">Statut</th></tr></thead>
            <tbody className="divide-y divide-neutral-100">
              {annees.map((a) => (
                <tr key={a.id}>
                  <td className="px-5 py-3 font-medium text-neutral-800">{a.libelle}</td>
                  <td className="px-5 py-3 text-neutral-500">{a.debut} → {a.fin}</td>
                  <td className="px-5 py-3">
                    {a.active && <span className="rounded-full bg-green-100 px-2.5 py-1 text-[11px] font-semibold text-green-600">Active</span>}
                    {a.verrouillee && <span className="ml-2 rounded-full bg-neutral-800 px-2.5 py-1 text-[11px] font-semibold text-white">Verrouillée</span>}
                    {!a.active && !a.verrouillee && <span className="text-xs text-neutral-400">Archive</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
