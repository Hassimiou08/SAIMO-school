"use client";

import { toast } from "sonner";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Search, Plus, CheckCircle, XCircle, Pencil } from "lucide-react";
import type { MatiereDTO, NiveauOption } from "@/server/dal/pedagogie";
import {
  actionCreerMatiere,
  actionModifierMatiere,
  actionBasculerMatiere,
} from "@/server/actions/pedagogie";
import { Modale, Champ, Err, ModalActions } from "@/components/portal/_ui";

type ModalState = null | "new" | MatiereDTO;

export function MatieresManager({
  matieres,
  niveaux,
}: {
  matieres: MatiereDTO[];
  niveaux: NiveauOption[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState("");
  const [modal, setModal] = useState<ModalState>(null);
  const [erreur, setErreur] = useState("");

  const edition = modal && modal !== "new" ? modal : null;

  const filtered = useMemo(
    () => matieres.filter((m) => m.nom.toLowerCase().includes(query.toLowerCase())),
    [matieres, query],
  );

  const soumettre = (fd: FormData) => {
    setErreur("");
    startTransition(async () => {
      const r = edition
        ? await actionModifierMatiere(edition.id, fd)
        : await actionCreerMatiere(fd);
      if (!r.succes) setErreur(r.erreur);
      else { setModal(null); router.refresh(); }
    });
  };
  const basculer = (id: string) =>
    startTransition(async () => {
      const r = await actionBasculerMatiere(id);
      if (!r.succes) toast.error(r.erreur);
      else router.refresh();
    });

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white">
      <div className="flex flex-col gap-3 border-b border-neutral-100 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Rechercher une matière..." className="w-full rounded-xl border border-neutral-200 bg-neutral-50 py-2.5 pl-9 pr-3.5 text-xs outline-none focus:border-blue-400 transition" />
        </div>
        <button onClick={() => { setErreur(""); setModal("new"); }} className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-blue-600 transition">
          <Plus className="h-4 w-4" /> Ajouter
        </button>
      </div>

      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-neutral-100 bg-neutral-50/50 text-xs uppercase text-neutral-500">
            <th className="px-5 py-3">Matière</th><th className="px-5 py-3">Code</th>
            <th className="px-5 py-3">Niveaux</th><th className="px-5 py-3">Coef.</th>
            <th className="px-5 py-3">Statut</th><th className="px-5 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-100">
          {filtered.map((m) => (
            <tr key={m.id} className="hover:bg-neutral-50/60">
              <td className="px-5 py-3 font-medium text-neutral-800">{m.nom}</td>
              <td className="px-5 py-3 font-mono text-xs text-neutral-500">{m.code ?? "—"}</td>
              <td className="px-5 py-3">
                <div className="flex flex-wrap gap-1">
                  {m.niveaux.length ? m.niveaux.map((n) => (<span key={n} className="rounded bg-neutral-100 px-1.5 py-0.5 text-[10px] font-semibold text-neutral-600">{n}</span>)) : <span className="text-xs text-neutral-400">—</span>}
                </div>
              </td>
              <td className="px-5 py-3 font-mono">{m.coefficient ?? "—"}</td>
              <td className="px-5 py-3">
                <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${m.actif ? "bg-green-100 text-green-600" : "bg-neutral-100 text-neutral-500"}`}>{m.actif ? "Active" : "Inactive"}</span>
              </td>
              <td className="px-5 py-3">
                <div className="flex items-center justify-end gap-3">
                  <button onClick={() => { setErreur(""); setModal(m); }} className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800">
                    <Pencil className="h-3.5 w-3.5" /> Modifier
                  </button>
                  <button onClick={() => basculer(m.id)} disabled={isPending} className="inline-flex items-center gap-1 text-xs font-semibold text-neutral-500 hover:text-neutral-800">
                    {m.actif ? <><XCircle className="h-3.5 w-3.5" /> Désactiver</> : <><CheckCircle className="h-3.5 w-3.5" /> Activer</>}
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {filtered.length === 0 && <tr><td colSpan={6} className="px-5 py-10 text-center text-neutral-500">Aucune matière.</td></tr>}
        </tbody>
      </table>

      {modal && (
        <Modale titre={edition ? `Modifier — ${edition.nom}` : "Ajouter une matière"} onClose={() => setModal(null)} large>
          <form action={soumettre} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Champ name="nom" label="Nom" defaultValue={edition?.nom ?? ""} placeholder="Ex : Physique-Chimie" required />
              <Champ name="code" label="Code" defaultValue={edition?.code ?? ""} placeholder="Ex : PC" />
            </div>
            <Champ name="coefficient" label="Coefficient" type="number" step="0.5" min="0" defaultValue={String(edition?.coefficient ?? 1)} />
            <div>
              <label className="text-sm font-medium text-neutral-700">Niveaux concernés</label>
              <div className="mt-1 grid grid-cols-3 gap-1.5 rounded-xl border border-neutral-200 p-3 max-h-40 overflow-y-auto">
                {niveaux.map((n) => (
                  <label key={n.id} className="flex items-center gap-1.5 text-xs">
                    <input type="checkbox" name="niveauIds" value={n.id} defaultChecked={edition?.niveauIds.includes(n.id)} className="h-3.5 w-3.5" />
                    {n.nom}
                  </label>
                ))}
              </div>
            </div>
            {erreur && <Err msg={erreur} />}
            <ModalActions pending={isPending} onCancel={() => setModal(null)} label={edition ? "Enregistrer" : "Ajouter"} />
          </form>
        </Modale>
      )}
    </div>
  );
}
