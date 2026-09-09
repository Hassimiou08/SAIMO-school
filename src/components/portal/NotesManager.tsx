"use client";

import { toast } from "sonner";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, ClipboardCheck, Lock, PencilLine } from "lucide-react";
import type { EvaluationDTO } from "@/server/dal/evaluations";
import type { PeriodeOption, TypeEvaluationOption } from "@/server/dal/evaluations";
import type { ClasseOption, MatiereOption } from "@/server/dal/pedagogie";
import { actionCreerEvaluation, actionValiderEvaluation } from "@/server/actions/evaluations";
import { Modale, Champ, Selecteur, Err, ModalActions } from "@/components/portal/_ui";

export function NotesManager({
  evaluations,
  classes,
  matieres,
  periodes,
  types,
  filtreClasse,
  filtrePeriode,
}: {
  evaluations: EvaluationDTO[];
  classes: ClasseOption[];
  matieres: MatiereOption[];
  periodes: PeriodeOption[];
  types: TypeEvaluationOption[];
  filtreClasse?: string;
  filtrePeriode?: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [modal, setModal] = useState(false);
  const [erreur, setErreur] = useState("");
  const [classeModalSel, setClasseModalSel] = useState(filtreClasse ?? "");

  const classeParId = useMemo(() => new Map(classes.map((c) => [c.id, c])), [classes]);
  const matieresFiltrees = useMemo(() => {
    const c = classeModalSel ? classeParId.get(classeModalSel) : null;
    if (!c) return matieres;
    return matieres.filter((m) => m.niveauIds.length === 0 || m.niveauIds.includes(c.niveauId));
  }, [matieres, classeModalSel, classeParId]);

  const setFiltre = (k: string, v: string) => {
    const sp = new URLSearchParams(window.location.search);
    if (v) sp.set(k, v); else sp.delete(k);
    router.push(`/portail/notes?${sp.toString()}`);
  };

  const creer = (fd: FormData) => {
    setErreur("");
    startTransition(async () => {
      const r = await actionCreerEvaluation(fd);
      if (!r.succes) setErreur(r.erreur);
      else { setModal(false); router.push(`/portail/notes/${r.data.id}`); }
    });
  };
  const verrouiller = (id: string) => {
    if (!confirm("Verrouiller cette évaluation ? Les notes ne pourront plus être modifiées.")) return;
    startTransition(async () => {
      const r = await actionValiderEvaluation(id);
      if (!r.succes) toast.error(r.erreur);
      else router.refresh();
    });
  };

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white">
      <div className="flex flex-wrap items-center gap-3 border-b border-neutral-100 p-5">
        <select value={filtreClasse ?? ""} onChange={(e) => setFiltre("classe", e.target.value)} className="rounded-xl border border-neutral-200 bg-white py-2 px-3 text-xs font-medium text-neutral-700 outline-none focus:border-blue-400">
          <option value="">Toutes les classes</option>
          {classes.map((c) => (<option key={c.id} value={c.id}>{c.nom}</option>))}
        </select>
        <select value={filtrePeriode ?? ""} onChange={(e) => setFiltre("periode", e.target.value)} className="rounded-xl border border-neutral-200 bg-white py-2 px-3 text-xs font-medium text-neutral-700 outline-none focus:border-blue-400">
          <option value="">Toutes les périodes</option>
          {periodes.map((p) => (<option key={p.id} value={p.id}>{p.nom}</option>))}
        </select>
        <button onClick={() => { setClasseModalSel(filtreClasse ?? ""); setModal(true); }} className="ml-auto inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-blue-600 transition">
          <Plus className="h-4 w-4" /> Nouvelle évaluation
        </button>
      </div>

      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-neutral-100 bg-neutral-50/50 text-xs uppercase text-neutral-500">
            <th className="px-5 py-3">Évaluation</th><th className="px-5 py-3">Classe</th>
            <th className="px-5 py-3">Période</th><th className="px-5 py-3">Saisie</th>
            <th className="px-5 py-3">Statut</th><th className="px-5 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-100">
          {evaluations.map((e) => (
            <tr key={e.id} className="hover:bg-neutral-50/60">
              <td className="px-5 py-3">
                <p className="font-medium text-neutral-800">{e.titre}</p>
                <p className="text-xs text-neutral-500">{e.matiere} · {e.type} · /{e.noteMaximale}</p>
              </td>
              <td className="px-5 py-3 text-neutral-700">{e.classe}</td>
              <td className="px-5 py-3 text-neutral-500">{e.periode}</td>
              <td className="px-5 py-3 font-mono text-xs">{e.nbNotes}/{e.effectif}</td>
              <td className="px-5 py-3">
                <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                  e.statut === "verrouillee" ? "bg-neutral-800 text-white"
                  : e.statut === "validee" ? "bg-green-100 text-green-600"
                  : "bg-blue-100 text-blue-600"}`}>
                  {e.statut === "verrouillee" ? "Verrouillée" : e.statut === "validee" ? "Validée" : "Ouverte"}
                </span>
              </td>
              <td className="px-5 py-3 text-right">
                <div className="flex items-center justify-end gap-3">
                  <button onClick={() => router.push(`/portail/notes/${e.id}`)} className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800">
                    <PencilLine className="h-3.5 w-3.5" /> {e.statut === "verrouillee" ? "Consulter" : "Saisir"}
                  </button>
                  {e.statut !== "verrouillee" && (
                    <button onClick={() => verrouiller(e.id)} disabled={isPending} className="inline-flex items-center gap-1 text-xs font-semibold text-neutral-500 hover:text-neutral-800">
                      <Lock className="h-3.5 w-3.5" /> Verrouiller
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
          {evaluations.length === 0 && (
            <tr><td colSpan={6} className="px-5 py-10 text-center text-neutral-500">
              <ClipboardCheck className="mx-auto mb-2 h-6 w-6 text-neutral-300" />
              Aucune évaluation. Créez-en une pour saisir des notes.
            </td></tr>
          )}
        </tbody>
      </table>

      {modal && (
        <Modale titre="Nouvelle évaluation" onClose={() => setModal(false)}>
          <form action={creer} className="space-y-4">
            <Selecteur
              name="classeId"
              label="Classe"
              required
              value={classeModalSel}
              onChange={(e) => setClasseModalSel(e.target.value)}
            >
              <option value="" disabled>Choisir…</option>
              {classes.map((c) => (<option key={c.id} value={c.id}>{c.nom}</option>))}
            </Selecteur>
            <Selecteur name="periodeId" label="Période" required defaultValue={filtrePeriode ?? periodes.find((p) => p.active)?.id ?? ""}>
              <option value="" disabled>Choisir…</option>
              {periodes.map((p) => (<option key={p.id} value={p.id}>{p.nom}</option>))}
            </Selecteur>
            <Selecteur name="matiereId" label="Matière" required defaultValue="">
              <option value="" disabled>Choisir…</option>
              {matieresFiltrees.map((m) => (<option key={m.id} value={m.id}>{m.nom}</option>))}
            </Selecteur>
            <div className="grid grid-cols-2 gap-3">
              <Selecteur name="typeEvaluationId" label="Type" required defaultValue={types[0]?.id ?? ""}>
                {types.map((t) => (<option key={t.id} value={t.id}>{t.nom}</option>))}
              </Selecteur>
              <Champ name="noteMaximale" label="Barème" type="number" min="1" defaultValue="20" />
            </div>
            <Champ name="titre" label="Titre (optionnel)" placeholder="Ex : Composition n°1" />
            <Champ name="dateEvaluation" label="Date (optionnel)" type="date" />
            {erreur && <Err msg={erreur} />}
            <ModalActions pending={isPending} onCancel={() => setModal(false)} label="Créer" />
          </form>
        </Modale>
      )}
    </div>
  );
}
