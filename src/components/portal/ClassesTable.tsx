"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Search, ChevronDown, MoreHorizontal, Pencil, Users, Plus, X, Loader2 } from "lucide-react";
import type { ClasseDTO } from "@/server/dal/pedagogie";
import type { NiveauOption } from "@/server/dal/pedagogie";
import { actionCreerClasse } from "@/server/actions/pedagogie";

export function ClassesTable({
  classes,
  niveaux,
}: {
  classes: ClasseDTO[];
  niveaux: NiveauOption[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState("");
  const [cycle, setCycle] = useState("Tous les cycles");
  const [modal, setModal] = useState(false);
  const [erreur, setErreur] = useState("");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const cycles = useMemo(
    () => ["Tous les cycles", ...Array.from(new Set(classes.map((c) => c.cycle)))],
    [classes],
  );

  const filtered = useMemo(
    () =>
      classes.filter((c) => {
        const q =
          query.trim() === "" ||
          c.nom.toLowerCase().includes(query.toLowerCase()) ||
          (c.profPrincipal ?? "").toLowerCase().includes(query.toLowerCase());
        const cy = cycle === "Tous les cycles" || c.cycle === cycle;
        return q && cy;
      }),
    [classes, query, cycle],
  );

  const soumettre = (formData: FormData) => {
    setErreur("");
    startTransition(async () => {
      const res = await actionCreerClasse(formData);
      if (!res.succes) setErreur(res.erreur);
      else {
        setModal(false);
        router.refresh();
      }
    });
  };

  return (
    <div className={`rounded-2xl border border-neutral-200 bg-white ${isPending ? "opacity-70" : ""}`}>
      <div className="flex flex-col gap-3 border-b border-neutral-100 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Nom de classe, professeur..." className="w-full rounded-xl border border-neutral-200 bg-neutral-50 py-2.5 pl-9 pr-3.5 text-xs outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition" />
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <button onClick={() => setModal(true)} className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-orange-500/20 hover:bg-blue-600 transition">
            <Plus className="h-4 w-4" /> Ajouter
          </button>
          <div className="relative">
            <select value={cycle} onChange={(e) => setCycle(e.target.value)} className="appearance-none rounded-xl border border-neutral-200 bg-white py-2.5 pl-3.5 pr-8 text-xs font-medium text-neutral-700 outline-none focus:border-blue-400 transition cursor-pointer">
              {cycles.map((c) => (<option key={c}>{c}</option>))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-400" />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-neutral-100 bg-neutral-50/50 text-xs uppercase tracking-wide text-neutral-500">
              <th className="px-5 py-3.5 font-semibold">Classe</th>
              <th className="px-5 py-3.5 font-semibold">Cycle / Niveau</th>
              <th className="px-5 py-3.5 font-semibold">Effectif</th>
              <th className="px-5 py-3.5 font-semibold">Professeur principal</th>
              <th className="px-5 py-3.5 font-semibold">Salle</th>
              <th className="px-5 py-3.5 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-neutral-200">
            {filtered.map((c) => (
              <tr key={c.id} onClick={() => router.push(`/portail/classes/${c.id}`)} className="group transition-colors hover:bg-blue-50/80 cursor-pointer">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 flex-none items-center justify-center rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 font-display text-xs font-bold text-blue-700 shadow-sm">
                      {c.nom.substring(0, 2)}
                    </span>
                    <span className="text-sm font-semibold text-neutral-800 group-hover:text-blue-600 transition">{c.nom}</span>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-xs">
                  <span className="rounded-lg bg-white border border-neutral-200 px-2.5 py-1 font-semibold text-neutral-600">{c.cycle}</span>
                  <span className="ml-2 text-neutral-400">{c.niveau}</span>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-neutral-400" />
                    <span className="font-mono text-sm font-semibold text-neutral-800">{c.effectif}</span>
                    {c.capacite != null && <span className="text-xs text-neutral-400">/ {c.capacite}</span>}
                  </div>
                </td>
                <td className="px-5 py-3.5 text-sm font-medium text-neutral-700">{c.profPrincipal ?? <span className="text-neutral-400">Non assigné</span>}</td>
                <td className="px-5 py-3.5 text-sm font-mono text-neutral-500">{c.salle ?? "—"}</td>
                <td className="px-5 py-3.5">
                  <div className="relative flex items-center justify-end" onClick={(e) => e.stopPropagation()}>
                    <button className="p-2 text-neutral-400 hover:text-blue-600 hover:bg-blue-100 rounded-lg transition" onClick={() => setOpenMenuId(openMenuId === c.id ? null : c.id)}>
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                    {openMenuId === c.id && (
                      <div className="absolute right-0 top-10 z-50 w-52 rounded-xl bg-white border border-neutral-200 shadow-xl py-2">
                        <button onClick={() => { setOpenMenuId(null); router.push(`/portail/classes/${c.id}`); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-neutral-700 hover:bg-blue-50 hover:text-blue-600 transition">
                          <Pencil className="h-4 w-4" /> Gérer la classe
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="px-5 py-10 text-center text-sm text-neutral-500">Aucune classe.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="border-t border-neutral-100 px-5 py-4 text-xs text-neutral-500 font-medium">
        {filtered.length} classe{filtered.length > 1 ? "s" : ""} sur {classes.length}
      </div>

      {modal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-neutral-900/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-neutral-900">Ajouter une classe</h3>
              <button onClick={() => setModal(false)} className="text-neutral-400 hover:text-neutral-700"><X className="h-5 w-5" /></button>
            </div>
            <form action={soumettre} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-neutral-700">Nom de la classe</label>
                <input name="nom" required placeholder="Ex : 6ème C" className="mt-1 w-full rounded-xl border border-neutral-200 px-4 py-2 text-sm outline-none focus:border-blue-400" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-neutral-700">Niveau</label>
                  <select name="niveauId" required defaultValue="" className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm outline-none">
                    <option value="" disabled>Choisir…</option>
                    {niveaux.map((n) => (<option key={n.id} value={n.id}>{n.nom} ({n.cycle})</option>))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-neutral-700">Capacité</label>
                  <input name="capacite" type="number" min={1} defaultValue={35} className="mt-1 w-full rounded-xl border border-neutral-200 px-4 py-2 text-sm outline-none" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-neutral-700">Salle</label>
                <input name="salle" placeholder="Ex : B12" className="mt-1 w-full rounded-xl border border-neutral-200 px-4 py-2 text-sm outline-none focus:border-blue-400" />
              </div>
              {erreur && <p className="rounded-lg bg-red-50 border border-red-200 p-2 text-xs text-red-600">{erreur}</p>}
              <div className="mt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setModal(false)} className="rounded-xl px-4 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-100">Annuler</button>
                <button type="submit" disabled={isPending} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-60">
                  {isPending && <Loader2 className="h-4 w-4 animate-spin" />} Ajouter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
