"use client";

import { useMemo, useState } from "react";
import { Search, ChevronDown, ChevronUp, CheckCircle, Clock } from "lucide-react";
import { notes } from "@/lib/mock-notes";

export function NotesTable() {
  const [query, setQuery] = useState("");
  const [statut, setStatut] = useState("Tous les statuts");

  const filtered = useMemo(() => {
    return notes.filter((n) => {
      const matchQuery = n.eleve.toLowerCase().includes(query.toLowerCase()) || n.matiere.toLowerCase().includes(query.toLowerCase());
      const matchStatut = statut === "Tous les statuts" || n.statut === statut;
      return matchQuery && matchStatut;
    });
  }, [query, statut]);

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white">
      <div className="flex flex-col gap-3 border-b border-neutral-100 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Élève, matière..." className="w-full rounded-xl border border-neutral-200 bg-neutral-50 py-2.5 pl-9 pr-3.5 text-xs outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition" />
        </div>
        <select value={statut} onChange={(e) => setStatut(e.target.value)} className="rounded-xl border border-neutral-200 bg-white py-2.5 px-3.5 text-xs font-medium outline-none cursor-pointer">
          <option>Tous les statuts</option>
          <option>Validé</option>
          <option>Brouillon</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-neutral-100 bg-neutral-50/50 text-xs uppercase tracking-wide text-neutral-500">
              <th className="px-5 py-3.5 font-semibold">Élève</th>
              <th className="px-5 py-3.5 font-semibold">Classe</th>
              <th className="px-5 py-3.5 font-semibold">Matière</th>
              <th className="px-5 py-3.5 font-semibold">Type</th>
              <th className="px-5 py-3.5 font-semibold">Note</th>
              <th className="px-5 py-3.5 font-semibold">Date</th>
              <th className="px-5 py-3.5 font-semibold">Statut</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-neutral-200">
            {filtered.map((n) => (
              <tr key={n.id} className="hover:bg-blue-50/50 transition">
                <td className="px-5 py-3.5 text-sm font-semibold text-neutral-800">{n.eleve}</td>
                <td className="px-5 py-3.5 text-xs text-neutral-600">{n.classe}</td>
                <td className="px-5 py-3.5 text-sm text-neutral-700">{n.matiere}</td>
                <td className="px-5 py-3.5 text-xs text-neutral-500">{n.type}</td>
                <td className="px-5 py-3.5">
                  {n.absent ? (
                    <span className="rounded bg-red-100 px-2 py-1 text-xs font-bold text-red-600">ABS</span>
                  ) : (
                    <span className="font-mono text-sm font-bold text-neutral-900 bg-neutral-100 px-2 py-1 rounded-md">{n.note?.toFixed(1).replace(".", ",")}</span>
                  )}
                </td>
                <td className="px-5 py-3.5 text-xs text-neutral-500">{new Date(n.date).toLocaleDateString("fr-FR")}</td>
                <td className="px-5 py-3.5">
                  {n.statut === "Validé" ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-2.5 py-1 text-[11px] font-semibold text-green-700">
                      <CheckCircle className="h-3 w-3" /> Validé
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-100 px-2.5 py-1 text-[11px] font-semibold text-orange-700">
                      <Clock className="h-3 w-3" /> Brouillon
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
