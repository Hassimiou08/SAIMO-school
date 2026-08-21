"use client";

import { useMemo, useState } from "react";
import { Search, CreditCard, CheckCircle, AlertTriangle } from "lucide-react";
import { paiements } from "@/lib/mock-paiements";

export function PaiementsTable() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return paiements.filter((p) => p.eleve.toLowerCase().includes(query.toLowerCase()));
  }, [query]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("fr-FR").format(val) + " GNF";
  };

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
              <th className="px-5 py-3.5 font-semibold">Élève / Classe</th>
              <th className="px-5 py-3.5 font-semibold">Échéance</th>
              <th className="px-5 py-3.5 font-semibold">Montant Dû</th>
              <th className="px-5 py-3.5 font-semibold">Montant Payé</th>
              <th className="px-5 py-3.5 font-semibold">Mode</th>
              <th className="px-5 py-3.5 font-semibold">Date de paiement</th>
              <th className="px-5 py-3.5 font-semibold">Statut</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-neutral-200">
            {filtered.map((p) => (
              <tr key={p.id} className="hover:bg-blue-50/50 transition">
                <td className="px-5 py-3.5">
                  <p className="text-sm font-semibold text-neutral-800">{p.eleve}</p>
                  <p className="text-xs text-neutral-500">{p.classe}</p>
                </td>
                <td className="px-5 py-3.5 text-sm text-neutral-700">{p.echeance}</td>
                <td className="px-5 py-3.5">
                  <span className="font-mono text-sm font-medium text-neutral-900">{formatCurrency(p.montantDu)}</span>
                </td>
                <td className="px-5 py-3.5">
                  <span className="font-mono text-sm font-bold text-green-700">{formatCurrency(p.montantPaye)}</span>
                </td>
                <td className="px-5 py-3.5 text-xs text-neutral-600">
                  <div className="flex items-center gap-1">
                    <CreditCard className="h-3 w-3 text-neutral-400" />
                    {p.mode}
                  </div>
                </td>
                <td className="px-5 py-3.5 text-xs text-neutral-500">{p.date ? new Date(p.date).toLocaleDateString("fr-FR") : "-"}</td>
                <td className="px-5 py-3.5">
                  {p.statut === "Soldé" ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-2.5 py-1 text-[11px] font-semibold text-green-700">
                      <CheckCircle className="h-3 w-3" /> Soldé
                    </span>
                  ) : p.statut === "Partiel" ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-2.5 py-1 text-[11px] font-semibold text-blue-700">
                      <CheckCircle className="h-3 w-3" /> Partiel
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-2.5 py-1 text-[11px] font-semibold text-red-700">
                      <AlertTriangle className="h-3 w-3" /> Impayé
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
