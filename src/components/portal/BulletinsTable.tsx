"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, FileText, CheckCircle, Clock, ChevronDown } from "lucide-react";
import { bulletins } from "@/lib/mock-bulletins";

const classes = ["Toutes les classes", "6ème A", "6ème B", "5ème A", "5ème B", "Terminale SM", "11ème SS"];

export function BulletinsTable() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [classe, setClasse] = useState(classes[0]);

  const filtered = useMemo(() => {
    return bulletins.filter((b) => {
      const matchQuery = b.eleve.toLowerCase().includes(query.toLowerCase());
      const matchClasse = classe === "Toutes les classes" || b.classe === classe;
      return matchQuery && matchClasse;
    });
  }, [query, classe]);

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white">
      <div className="flex flex-col gap-3 border-b border-neutral-100 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Chercher un élève..." className="w-full rounded-xl border border-neutral-200 bg-neutral-50 py-2.5 pl-9 pr-3.5 text-xs outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition" />
        </div>
        <div className="relative">
          <select value={classe} onChange={(e) => setClasse(e.target.value)} className="appearance-none rounded-xl border border-neutral-200 bg-white py-2.5 pl-3.5 pr-8 text-xs font-medium text-neutral-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition cursor-pointer">
            {classes.map((c) => (<option key={c}>{c}</option>))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-400" />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-neutral-100 bg-neutral-50/50 text-xs uppercase tracking-wide text-neutral-500">
              <th className="px-5 py-3.5 font-semibold">Élève</th>
              <th className="px-5 py-3.5 font-semibold">Classe</th>
              <th className="px-5 py-3.5 font-semibold">Période</th>
              <th className="px-5 py-3.5 font-semibold">Moyenne Générale</th>
              <th className="px-5 py-3.5 font-semibold">Rang</th>
              <th className="px-5 py-3.5 font-semibold">Statut</th>
              <th className="px-5 py-3.5 font-semibold text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-neutral-200">
            {filtered.map((b) => (
              <tr 
                key={b.id} 
                onClick={() => router.push(`/portail/bulletins/${b.id}`)}
                className="group hover:bg-blue-50/50 transition cursor-pointer"
              >
                <td className="px-5 py-3.5 text-sm font-semibold text-neutral-800 group-hover:text-blue-600 transition">{b.eleve}</td>
                <td className="px-5 py-3.5 text-xs text-neutral-600">{b.classe}</td>
                <td className="px-5 py-3.5 text-sm font-medium text-neutral-700">{b.periode}</td>
                <td className="px-5 py-3.5">
                  <span className="font-mono text-sm font-bold text-neutral-900 bg-neutral-100 px-2 py-1 rounded-md">{b.moyenne.toFixed(2).replace(".", ",")}</span>
                </td>
                <td className="px-5 py-3.5 text-sm font-medium text-neutral-700">{b.rang} / {b.effectif}</td>
                <td className="px-5 py-3.5">
                  {b.statut === "Publié" ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-2.5 py-1 text-[11px] font-semibold text-green-700">
                      <CheckCircle className="h-3 w-3" /> Publié
                    </span>
                  ) : b.statut === "Validé" ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-2.5 py-1 text-[11px] font-semibold text-blue-700">
                      <CheckCircle className="h-3 w-3" /> Validé
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-100 px-2.5 py-1 text-[11px] font-semibold text-orange-700">
                      <Clock className="h-3 w-3" /> Brouillon
                    </span>
                  )}
                </td>
                <td className="px-5 py-3.5 text-right">
                  <button 
                    onClick={(e) => { e.stopPropagation(); router.push(`/portail/bulletins/${b.id}`); }}
                    className="inline-flex items-center justify-center rounded-lg bg-neutral-100 p-2 text-neutral-500 hover:bg-blue-100 hover:text-blue-600 transition"
                  >
                    <FileText className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
            
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-5 py-10 text-center text-sm text-neutral-500">Aucun bulletin trouvé pour cette classe.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
