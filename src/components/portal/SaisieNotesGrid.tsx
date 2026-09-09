"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { ArrowLeft, Save, Lock, Unlock, Loader2, CheckCircle2 } from "lucide-react";
import type { SaisieNoteLigne } from "@/server/dal/evaluations";
import {
  actionSaisirNotes,
  actionValiderEvaluation,
  actionDeverrouillerEvaluation,
} from "@/server/actions/evaluations";

type Etat = Record<string, { valeur: string; absent: boolean; dispense: boolean; observations: string }>;

export function SaisieNotesGrid({
  evaluation,
  retour = "/portail/notes",
  peutDeverrouiller = true,
}: {
  evaluation: {
    id: string;
    titre: string;
    matiere: string;
    classe: string;
    periode: string;
    noteMaximale: number;
    verrouillee: boolean;
    lignes: SaisieNoteLigne[];
  };
  retour?: string;
  peutDeverrouiller?: boolean;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [msg, setMsg] = useState<{ type: "ok" | "err"; texte: string } | null>(null);
  const [etat, setEtat] = useState<Etat>(() =>
    Object.fromEntries(
      evaluation.lignes.map((l) => [
        l.eleveId,
        {
          valeur: l.valeur != null ? String(l.valeur) : "",
          absent: l.absent,
          dispense: l.dispense,
          observations: l.observations,
        },
      ]),
    ),
  );

  const maj = (id: string, patch: Partial<Etat[string]>) =>
    setEtat((e) => ({ ...e, [id]: { ...e[id], ...patch } }));

  const enregistrer = () => {
    setMsg(null);
    const notes = evaluation.lignes.map((l) => {
      const s = etat[l.eleveId];
      return {
        eleveId: l.eleveId,
        valeur: s.absent || s.dispense || s.valeur === "" ? null : Number(s.valeur),
        absent: s.absent,
        dispense: s.dispense,
        observations: s.observations || undefined,
      };
    });
    startTransition(async () => {
      const r = await actionSaisirNotes(evaluation.id, notes);
      if (!r.succes) { setMsg({ type: "err", texte: r.erreur }); toast.error(r.erreur); }
      else { setMsg({ type: "ok", texte: "Notes enregistrées." }); toast.success("Notes enregistrées."); router.refresh(); }
    });
  };

  const verrouiller = () => {
    if (!confirm("Verrouiller ? Les notes ne seront plus modifiables.")) return;
    startTransition(async () => {
      const r = await actionValiderEvaluation(evaluation.id);
      if (!r.succes) { setMsg({ type: "err", texte: r.erreur }); toast.error(r.erreur); }
      else { toast.success("Évaluation verrouillée."); router.push(retour); }
    });
  };

  const deverrouiller = () => {
    if (!confirm("Déverrouiller cette évaluation pour corriger les notes ? Les bulletins générés devront être régénérés.")) return;
    setMsg(null);
    startTransition(async () => {
      const r = await actionDeverrouillerEvaluation(evaluation.id);
      if (!r.succes) { setMsg({ type: "err", texte: r.erreur }); toast.error(r.erreur); }
      else { toast.success("Évaluation déverrouillée — vous pouvez corriger les notes."); router.refresh(); }
    });
  };

  return (
    <div>
      <Link href={retour} className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 hover:text-navy-900">
        <ArrowLeft className="h-4 w-4" /> Retour aux évaluations
      </Link>

      <div className="mb-6 rounded-2xl border border-neutral-200 bg-white p-5">
        <h1 className="font-display text-xl font-bold text-navy-900">{evaluation.titre}</h1>
        <p className="mt-1 text-sm text-ink-500">
          {evaluation.classe} · {evaluation.matiere} · {evaluation.periode} · barème /{evaluation.noteMaximale}
          {evaluation.verrouillee && <span className="ml-2 rounded-full bg-neutral-800 px-2 py-0.5 text-[11px] font-semibold text-white">Verrouillée</span>}
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-neutral-100 bg-neutral-50/50 text-xs uppercase text-neutral-500">
              <th className="px-5 py-3">Élève</th>
              <th className="px-5 py-3 w-28">Note</th>
              <th className="px-5 py-3 w-20">Absent</th>
              <th className="px-5 py-3 w-20">Dispensé</th>
              <th className="px-5 py-3">Observation</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {evaluation.lignes.map((l) => {
              const s = etat[l.eleveId];
              return (
                <tr key={l.eleveId}>
                  <td className="px-5 py-2.5">
                    <span className="font-medium text-neutral-800">{l.prenom} {l.nom}</span>
                    <span className="ml-2 font-mono text-[11px] text-neutral-400">{l.matricule}</span>
                  </td>
                  <td className="px-5 py-2.5">
                    <input
                      type="number" step="0.25" min="0" max={evaluation.noteMaximale}
                      disabled={evaluation.verrouillee || s.absent || s.dispense}
                      value={s.valeur}
                      onChange={(e) => maj(l.eleveId, { valeur: e.target.value })}
                      className="w-20 rounded-lg border border-neutral-200 px-2 py-1.5 text-sm outline-none focus:border-blue-400 disabled:bg-neutral-100"
                    />
                  </td>
                  <td className="px-5 py-2.5">
                    <input type="checkbox" disabled={evaluation.verrouillee} checked={s.absent} onChange={(e) => maj(l.eleveId, { absent: e.target.checked, dispense: false })} className="h-4 w-4" />
                  </td>
                  <td className="px-5 py-2.5">
                    <input type="checkbox" disabled={evaluation.verrouillee} checked={s.dispense} onChange={(e) => maj(l.eleveId, { dispense: e.target.checked, absent: false })} className="h-4 w-4" />
                  </td>
                  <td className="px-5 py-2.5">
                    <input
                      type="text" disabled={evaluation.verrouillee}
                      value={s.observations}
                      onChange={(e) => maj(l.eleveId, { observations: e.target.value })}
                      className="w-full rounded-lg border border-neutral-200 px-2 py-1.5 text-sm outline-none focus:border-blue-400 disabled:bg-neutral-100"
                    />
                  </td>
                </tr>
              );
            })}
            {evaluation.lignes.length === 0 && (
              <tr><td colSpan={5} className="px-5 py-10 text-center text-neutral-500">Aucun élève inscrit dans cette classe.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {msg && (
        <p className={`mt-4 rounded-lg border p-3 text-sm ${msg.type === "ok" ? "border-green-200 bg-green-50 text-green-700" : "border-red-200 bg-red-50 text-red-600"}`}>
          {msg.type === "ok" && <CheckCircle2 className="mr-1.5 inline h-4 w-4" />}{msg.texte}
        </p>
      )}

      {!evaluation.verrouillee ? (
        <div className="mt-5 flex items-center justify-end gap-3">
          <button onClick={verrouiller} disabled={isPending} className="inline-flex items-center gap-2 rounded-full border border-neutral-300 px-5 py-2.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 disabled:opacity-60">
            <Lock className="h-4 w-4" /> Verrouiller l&rsquo;évaluation
          </button>
          <button onClick={enregistrer} disabled={isPending} className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-60">
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Enregistrer
          </button>
        </div>
      ) : (
        <div className="mt-5 flex items-center justify-between gap-3 rounded-xl border border-neutral-200 bg-neutral-50 p-4">
          <p className="text-xs text-neutral-500">
            Évaluation verrouillée : les notes ne sont plus modifiables.
            {peutDeverrouiller ? " Déverrouillez pour corriger (droit administrateur / direction)." : ""}
          </p>
          {peutDeverrouiller && (
            <button onClick={deverrouiller} disabled={isPending} className="inline-flex flex-none items-center gap-2 rounded-full border border-amber-300 bg-white px-4 py-2 text-sm font-semibold text-amber-700 hover:bg-amber-50 disabled:opacity-60">
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Unlock className="h-4 w-4" />} Déverrouiller pour corriger
            </button>
          )}
        </div>
      )}
    </div>
  );
}
