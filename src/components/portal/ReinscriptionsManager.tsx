"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowRight, CheckCircle2, Loader2, RefreshCcw } from "lucide-react";
import { actionReinscrireEleves } from "@/server/actions/annees";

type Props = {
  anneeActive: string;
  sources: { id: string; nom: string; niveau: string; annee: string; effectif: number }[];
  cibles: { id: string; nom: string; niveau: string }[];
  source: { id: string; nom: string; annee: string } | null;
  eleves: { id: string; matricule: string; nom: string; dejaInscrit: string | null }[];
  peutReinscrire: boolean;
};

const champ = "w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-400";

export function ReinscriptionsManager({ anneeActive, sources, cibles, source, eleves, peutReinscrire }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const aReinscrire = eleves.filter((e) => !e.dejaInscrit);
  const [coches, setCoches] = useState<Set<string>>(() => new Set(aReinscrire.map((e) => e.id)));
  const [cible, setCible] = useState("");

  // Nouvelle classe source : tout est recoché (la page est rechargée avec ?source=…).
  const [sourceVue, setSourceVue] = useState(source?.id);
  if (sourceVue !== source?.id) {
    setSourceVue(source?.id);
    setCoches(new Set(aReinscrire.map((e) => e.id)));
  }

  // Seuls les élèves encore à réinscrire comptent dans la sélection.
  const selection = aReinscrire.filter((e) => coches.has(e.id)).map((e) => e.id);
  const annees = [...new Set(sources.map((s) => s.annee))];
  const basculer = (id: string) =>
    setCoches((c) => {
      const n = new Set(c);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });

  const reinscrire = () =>
    startTransition(async () => {
      const r = await actionReinscrireEleves(cible, selection);
      if (!r.succes) {
        toast.error(r.erreur);
        return;
      }
      const { reinscrits, dejaInscrits } = r.data;
      toast.success(
        `${reinscrits} élève${reinscrits > 1 ? "s" : ""} réinscrit${reinscrits > 1 ? "s" : ""}` +
          (dejaInscrits ? ` (${dejaInscrits} déjà inscrit${dejaInscrits > 1 ? "s" : ""})` : "") + ".",
      );
      router.refresh();
    });

  if (sources.length === 0) {
    return (
      <div className="rounded-2xl border border-neutral-200 bg-white p-8 text-center text-sm text-ink-500">
        Aucune année précédente : rien à réinscrire. Pour préparer une nouvelle année, allez dans{" "}
        <strong>Paramètres → Année scolaire</strong>.
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-4 rounded-2xl border border-neutral-200 bg-white p-5 md:grid-cols-[1fr_auto_1fr] md:items-end">
        <label className="text-sm font-medium text-neutral-700">
          Classe d&rsquo;origine
          <select
            value={source?.id ?? ""}
            onChange={(e) => router.push(e.target.value ? `/portail/reinscriptions?source=${e.target.value}` : "/portail/reinscriptions")}
            className={`${champ} mt-1`}
          >
            <option value="">Choisir une classe…</option>
            {annees.map((a) => (
              <optgroup key={a} label={`Année ${a}`}>
                {sources.filter((s) => s.annee === a).map((s) => (
                  <option key={s.id} value={s.id}>{s.nom} ({s.effectif} élève{s.effectif > 1 ? "s" : ""})</option>
                ))}
              </optgroup>
            ))}
          </select>
        </label>
        <ArrowRight className="mx-auto hidden h-5 w-5 text-neutral-400 md:mb-3 md:block" />
        <label className="text-sm font-medium text-neutral-700">
          Classe de destination ({anneeActive})
          <select value={cible} onChange={(e) => setCible(e.target.value)} className={`${champ} mt-1`} disabled={!peutReinscrire}>
            <option value="">Choisir une classe…</option>
            {cibles.map((c) => (
              <option key={c.id} value={c.id}>{c.nom} — {c.niveau}</option>
            ))}
          </select>
        </label>
      </div>

      {cibles.length === 0 && (
        <p className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
          L&rsquo;année {anneeActive} n&rsquo;a encore aucune classe. Créez-les dans <strong>Classes</strong>, ou recréez l&rsquo;année en reprenant les classes.
        </p>
      )}

      {source && (
        <div className="rounded-2xl border border-neutral-200 bg-white">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-100 px-5 py-4">
            <div>
              <p className="font-display font-bold text-navy-900">{source.nom} — {source.annee}</p>
              <p className="text-xs text-ink-500">
                {aReinscrire.length} élève{aReinscrire.length > 1 ? "s" : ""} à réinscrire
                {eleves.length - aReinscrire.length > 0 && `, ${eleves.length - aReinscrire.length} déjà inscrit${eleves.length - aReinscrire.length > 1 ? "s" : ""} en ${anneeActive}`}
              </p>
            </div>
            {aReinscrire.length > 0 && (
              <button
                type="button"
                onClick={() => setCoches(selection.length === aReinscrire.length ? new Set() : new Set(aReinscrire.map((e) => e.id)))}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800"
              >
                {selection.length === aReinscrire.length ? "Tout décocher" : "Tout cocher"}
              </button>
            )}
          </div>
          {eleves.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-ink-500">Aucun élève actif dans cette classe.</p>
          ) : (
            <ul className="divide-y divide-neutral-100">
              {eleves.map((e) => (
                <li key={e.id} className="flex items-center gap-3 px-5 py-3 text-sm">
                  {e.dejaInscrit ? (
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  ) : (
                    <input
                      type="checkbox"
                      checked={coches.has(e.id)}
                      onChange={() => basculer(e.id)}
                      disabled={!peutReinscrire}
                      className="h-4 w-4 accent-blue-600"
                      aria-label={`Réinscrire ${e.nom}`}
                    />
                  )}
                  <span className="font-medium text-neutral-800">{e.nom}</span>
                  <span className="font-mono text-xs text-neutral-400">{e.matricule}</span>
                  {e.dejaInscrit && <span className="ml-auto text-xs text-green-700">Inscrit en {e.dejaInscrit}</span>}
                </li>
              ))}
            </ul>
          )}
          {peutReinscrire && aReinscrire.length > 0 && (
            <div className="flex items-center justify-end gap-3 border-t border-neutral-100 px-5 py-4">
              <p className="text-xs text-ink-500">Les élèves non cochés (redoublement, départ…) peuvent être traités séparément.</p>
              <button
                type="button"
                onClick={reinscrire}
                disabled={isPending || !cible || selection.length === 0}
                className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCcw className="h-4 w-4" />}
                Réinscrire {selection.length} élève{selection.length > 1 ? "s" : ""}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
