"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, ChevronDown, MoreHorizontal, Pencil, UserPlus } from "lucide-react";
import type { EnseignantDTO } from "@/server/dal/pedagogie";

export function EnseignantsTable({ enseignants }: { enseignants: EnseignantDTO[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [matiere, setMatiere] = useState("Toutes les matières");
  const [statut, setStatut] = useState("Tous les statuts");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const matieres = useMemo(
    () => ["Toutes les matières", ...Array.from(new Set(enseignants.flatMap((e) => e.matieres))).sort()],
    [enseignants],
  );

  const filtered = useMemo(
    () =>
      enseignants.filter((e) => {
        const full = `${e.firstName} ${e.lastName}`.toLowerCase();
        const q =
          query.trim() === "" ||
          full.includes(query.toLowerCase()) ||
          (e.matricule ?? "").toLowerCase().includes(query.toLowerCase()) ||
          e.email.toLowerCase().includes(query.toLowerCase());
        const m = matiere === "Toutes les matières" || e.matieres.includes(matiere);
        const s = statut === "Tous les statuts" || e.statut === statut;
        return q && m && s;
      }),
    [enseignants, query, matiere, statut],
  );

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white">
      <div className="flex flex-col gap-3 border-b border-neutral-100 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Nom, email ou matricule..." className="w-full rounded-xl border border-neutral-200 bg-neutral-50 py-2.5 pl-9 pr-3.5 text-xs outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition" />
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <Link href="/portail/enseignants/nouveau" className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-orange-500/20 hover:bg-blue-600 transition">
            <UserPlus className="h-4 w-4" /> Nouvel enseignant
          </Link>
          <div className="relative">
            <select value={matiere} onChange={(e) => setMatiere(e.target.value)} className="appearance-none rounded-xl border border-neutral-200 bg-white py-2.5 pl-3.5 pr-8 text-xs font-medium text-neutral-700 outline-none focus:border-blue-400 transition cursor-pointer">
              {matieres.map((m) => (<option key={m}>{m}</option>))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-400" />
          </div>
          <div className="relative">
            <select value={statut} onChange={(e) => setStatut(e.target.value)} className="appearance-none rounded-xl border border-neutral-200 bg-white py-2.5 pl-3.5 pr-8 text-xs font-medium text-neutral-700 outline-none focus:border-blue-400 transition cursor-pointer">
              {["Tous les statuts", "Actif", "Inactif"].map((s) => (<option key={s}>{s}</option>))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-400" />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-neutral-100 bg-neutral-50/50 text-xs uppercase tracking-wide text-neutral-500">
              <th className="px-5 py-3.5 font-semibold">Enseignant</th>
              <th className="px-5 py-3.5 font-semibold">Matricule</th>
              <th className="px-5 py-3.5 font-semibold">Matières</th>
              <th className="px-5 py-3.5 font-semibold">Classes</th>
              <th className="px-5 py-3.5 font-semibold">Statut</th>
              <th className="px-5 py-3.5 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-neutral-200">
            {filtered.map((e) => (
              <tr key={e.id} onClick={() => router.push(`/portail/enseignants/${e.id}`)} className="group transition-colors hover:bg-blue-50/80 cursor-pointer">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 flex-none items-center justify-center rounded-xl bg-gradient-to-br from-orange-400 to-orange-500 font-display text-xs font-bold text-white shadow-sm">
                      {e.firstName[0]}{e.lastName[0]}
                    </span>
                    <div>
                      <span className="text-sm font-semibold text-neutral-800 group-hover:text-blue-600 transition">{e.firstName} {e.lastName}</span>
                      <p className="text-[11px] text-neutral-400">{e.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3.5 font-mono text-xs text-neutral-500">{e.matricule ?? "—"}</td>
                <td className="px-5 py-3.5">
                  <div className="flex flex-wrap gap-1">
                    {e.matieres.length ? e.matieres.map((m) => (
                      <span key={m} className="rounded-lg bg-blue-50 border border-blue-100 px-2 py-0.5 text-[11px] font-semibold text-blue-600">{m}</span>
                    )) : <span className="text-xs text-neutral-400">{e.specialite ?? "—"}</span>}
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex flex-wrap gap-1">
                    {e.classes.map((c) => (<span key={c} className="rounded-md bg-neutral-100 px-2 py-0.5 text-[10px] font-semibold text-neutral-600">{c}</span>))}
                    {e.classes.length === 0 && <span className="text-xs text-neutral-400">Aucune</span>}
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${e.statut === "Actif" ? "bg-green-100 text-green-600" : "bg-neutral-100 text-neutral-500"}`}>{e.statut}</span>
                </td>
                <td className="px-5 py-3.5">
                  <div className="relative flex items-center justify-end" onClick={(ev) => ev.stopPropagation()}>
                    <button className="p-2 text-neutral-400 hover:text-blue-600 hover:bg-blue-100 rounded-lg transition" onClick={() => setOpenMenuId(openMenuId === e.id ? null : e.id)}>
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                    {openMenuId === e.id && (
                      <div className="absolute right-0 top-10 z-50 w-52 rounded-xl bg-white border border-neutral-200 shadow-xl py-2">
                        <button onClick={() => { setOpenMenuId(null); router.push(`/portail/enseignants/${e.id}`); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-neutral-700 hover:bg-blue-50 hover:text-blue-600 transition">
                          <Pencil className="h-4 w-4" /> Voir la fiche
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="px-5 py-10 text-center text-sm text-neutral-500">Aucun enseignant.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="border-t border-neutral-100 px-5 py-4 text-xs text-neutral-500 font-medium">
        {filtered.length} enseignant{filtered.length > 1 ? "s" : ""} sur {enseignants.length}
      </div>
    </div>
  );
}
