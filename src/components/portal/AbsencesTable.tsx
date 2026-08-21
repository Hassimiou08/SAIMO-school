"use client";

import { useMemo, useState } from "react";
import { Search, AlertCircle, CheckCircle2 } from "lucide-react";
import { absences } from "@/lib/mock-absences";

export function AbsencesTable() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return absences.filter((a) => a.eleve.toLowerCase().includes(query.toLowerCase()));
  }, [query]);

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white">
      <div className="border-b border-neutral-100 p-5">
        <div className="relative max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Chercher un élève..." className="w-full rounded-xl border border-neutral-200 bg-neutral-50 py-2.5 pl-9 pr-3.5 text-xs outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition" />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-neutral-100 bg-neutral-50/50 text-xs uppercase tracking-wide text-neutral-500">
              <th className="px-5 py-3.5 font-semibold">Élève</th>
              <th className="px-5 py-3.5 font-semibold">Classe</th>
              <th className="px-5 py-3.5 font-semibold">Date</th>
              <th className="px-5 py-3.5 font-semibold">Statut</th>
              <th className="px-5 py-3.5 font-semibold">Justification</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-neutral-200">
            {filtered.map((a) => (
              <tr key={a.id} className="hover:bg-blue-50/50 transition">
                <td className="px-5 py-3.5 text-sm font-semibold text-neutral-800">{a.eleve}</td>
                <td className="px-5 py-3.5 text-xs text-neutral-600">{a.classe}</td>
                <td className="px-5 py-3.5 text-xs text-neutral-500">{new Date(a.date).toLocaleDateString("fr-FR")}</td>
                <td className="px-5 py-3.5">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold ${a.statut === "Retard" ? "bg-orange-100 text-orange-700" : "bg-red-100 text-red-700"}`}>
                    {a.statut}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  {a.justifie ? (
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle2 className="h-4 w-4" />
                      <span className="text-xs font-medium">{a.motif}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-red-500">
                      <AlertCircle className="h-4 w-4" />
                      <span className="text-xs font-medium">Non justifié</span>
                    </div>
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
