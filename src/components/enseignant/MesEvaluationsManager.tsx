"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, PencilLine, Lock, Loader2 } from "lucide-react";
import { Modale, Champ, Selecteur, Err, ModalActions } from "@/components/portal/_ui";
import { actionCreerEvaluation } from "@/server/actions/evaluations";
import type { MonEvaluation } from "@/server/dal/enseignant";

interface Opt {
  id: string;
  nom: string;
}

export function MesEvaluationsManager({
  evaluations,
  classes,
  matieres,
  periodes,
  types,
}: {
  evaluations: MonEvaluation[];
  classes: Opt[];
  matieres: Opt[];
  periodes: { id: string; nom: string }[];
  types: { id: string; nom: string; noteMaximale: number }[];
}) {
  const router = useRouter();
  const [modal, setModal] = useState(false);
  const [erreur, setErreur] = useState("");
  const [isPending, startTransition] = useTransition();

  const creer = (fd: FormData) => {
    setErreur("");
    startTransition(async () => {
      const r = await actionCreerEvaluation(fd);
      if (!r.succes) {
        setErreur(r.erreur);
        toast.error(r.erreur);
      } else {
        setModal(false);
        toast.success("Évaluation créée — saisissez les notes.");
        router.push(`/enseignant/notes/${r.data.id}`);
      }
    });
  };

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white">
      <div className="flex items-center justify-between border-b border-neutral-100 p-5">
        <p className="text-sm text-neutral-500">{evaluations.length} évaluation(s)</p>
        <button
          onClick={() => {
            setErreur("");
            setModal(true);
          }}
          className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-xs font-semibold text-white shadow-md transition hover:bg-blue-600"
        >
          <Plus className="h-4 w-4" /> Nouvelle évaluation
        </button>
      </div>

      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-neutral-100 bg-neutral-50/50 text-xs uppercase text-neutral-500">
            <th className="px-5 py-3">Évaluation</th>
            <th className="px-5 py-3">Classe</th>
            <th className="px-5 py-3">Période</th>
            <th className="px-5 py-3">Notes</th>
            <th className="px-5 py-3">Statut</th>
            <th className="px-5 py-3 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-100">
          {evaluations.map((e) => (
            <tr
              key={e.id}
              onClick={() => router.push(`/enseignant/notes/${e.id}`)}
              className="cursor-pointer hover:bg-neutral-50/60"
            >
              <td className="px-5 py-3">
                <span className="font-medium text-neutral-800">{e.titre}</span>
                <span className="ml-2 rounded-lg border border-blue-100 bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-600">
                  {e.matiere}
                </span>
              </td>
              <td className="px-5 py-3 text-neutral-600">{e.classe}</td>
              <td className="px-5 py-3 text-neutral-500">{e.periode}</td>
              <td className="px-5 py-3 font-mono text-xs">
                {e.nbNotes}/{e.effectif}
              </td>
              <td className="px-5 py-3">
                {e.statut === "verrouillee" ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-neutral-800 px-2 py-0.5 text-[11px] font-semibold text-white">
                    <Lock className="h-3 w-3" /> Verrouillée
                  </span>
                ) : (
                  <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[11px] font-semibold text-blue-600">
                    Ouverte
                  </span>
                )}
              </td>
              <td className="px-5 py-3 text-right">
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600">
                  <PencilLine className="h-3.5 w-3.5" /> Saisir
                </span>
              </td>
            </tr>
          ))}
          {evaluations.length === 0 && (
            <tr>
              <td colSpan={6} className="px-5 py-10 text-center text-neutral-500">
                Aucune évaluation. Créez-en une pour saisir des notes.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {modal && (
        <Modale titre="Nouvelle évaluation" onClose={() => setModal(false)}>
          <form action={creer} className="space-y-4">
            <Selecteur name="classeId" label="Classe" required defaultValue="">
              <option value="" disabled>
                Choisir…
              </option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nom}
                </option>
              ))}
            </Selecteur>
            <Selecteur name="matiereId" label="Matière" required defaultValue="">
              <option value="" disabled>
                Choisir…
              </option>
              {matieres.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.nom}
                </option>
              ))}
            </Selecteur>
            <Selecteur name="periodeId" label="Période" required defaultValue="">
              <option value="" disabled>
                Choisir…
              </option>
              {periodes.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nom}
                </option>
              ))}
            </Selecteur>
            <Selecteur name="typeEvaluationId" label="Type" required defaultValue="">
              <option value="" disabled>
                Choisir…
              </option>
              {types.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.nom}
                </option>
              ))}
            </Selecteur>
            <div className="grid grid-cols-2 gap-3">
              <Champ name="titre" label="Titre (optionnel)" placeholder="Composition n°1" />
              <Champ name="noteMaximale" label="Barème" type="number" defaultValue={20} min={1} max={100} />
            </div>
            <Champ name="dateEvaluation" label="Date (optionnel)" type="date" />
            {erreur && <Err msg={erreur} />}
            <ModalActions pending={isPending} onCancel={() => setModal(false)} label="Créer" />
          </form>
        </Modale>
      )}
    </div>
  );
}
