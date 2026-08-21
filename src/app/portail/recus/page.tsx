"use client";

import { useState } from "react";
import { Search, Printer, Download, Eye } from "lucide-react";
import { recus } from "@/lib/mock-admin";
import { Sidebar } from "@/components/portal/Sidebar";
import { Topbar } from "@/components/portal/Topbar";

export default function RecusPage() {
  const [query, setQuery] = useState("");
  const filtered = recus.filter(r => r.eleve.toLowerCase().includes(query.toLowerCase()) || r.numero.toLowerCase().includes(query.toLowerCase()));

  const formatCurrency = (val: number) => new Intl.NumberFormat("fr-FR").format(val) + " GNF";

  return (
    <div className="min-h-screen bg-paper-100">
      <Sidebar />
      <div className="lg:pl-64">
        <Topbar />
        <main className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
          <div className="mb-7">
            <h1 className="font-display text-2xl font-bold tracking-tight text-navy-900">Reçus de Paiement</h1>
            <p className="mt-1 text-sm text-ink-500">Historique et impression des reçus émis.</p>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm">
            <div className="border-b border-neutral-100 p-5">
              <div className="relative max-w-xs">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                <input type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Chercher par nom ou numéro..." className="w-full rounded-xl border border-neutral-200 bg-neutral-50 py-2.5 pl-9 pr-3.5 text-xs outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-neutral-100 bg-neutral-50/50 text-xs uppercase tracking-wide text-neutral-500">
                    <th className="px-5 py-3.5 font-semibold">N° Reçu</th>
                    <th className="px-5 py-3.5 font-semibold">Élève</th>
                    <th className="px-5 py-3.5 font-semibold">Montant</th>
                    <th className="px-5 py-3.5 font-semibold">Date</th>
                    <th className="px-5 py-3.5 font-semibold">Mode</th>
                    <th className="px-5 py-3.5 font-semibold">Statut</th>
                    <th className="px-5 py-3.5 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-neutral-200">
                  {filtered.map(r => (
                    <tr key={r.id} className="hover:bg-blue-50/40 transition">
                      <td className="px-5 py-3.5 font-mono text-xs font-bold text-neutral-700">{r.numero}</td>
                      <td className="px-5 py-3.5">
                        <p className="text-sm font-semibold text-neutral-800">{r.eleve}</p>
                        <p className="text-xs text-neutral-500">{r.classe}</p>
                      </td>
                      <td className="px-5 py-3.5 font-mono text-sm font-bold text-neutral-900">{formatCurrency(r.montant)}</td>
                      <td className="px-5 py-3.5 text-xs text-neutral-500">{new Date(r.date).toLocaleDateString("fr-FR")}</td>
                      <td className="px-5 py-3.5 text-xs font-medium text-neutral-600">{r.mode}</td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold ${r.statut === "Envoyé" ? "bg-green-100 text-green-700" : "bg-neutral-100 text-neutral-600"}`}>
                          {r.statut}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="rounded-lg bg-neutral-100 p-2 text-neutral-500 hover:bg-blue-100 hover:text-blue-600 transition" title="Voir"><Eye className="h-4 w-4" /></button>
                          <button className="rounded-lg bg-neutral-100 p-2 text-neutral-500 hover:bg-blue-100 hover:text-blue-600 transition" title="Télécharger"><Download className="h-4 w-4" /></button>
                          <button className="rounded-lg bg-neutral-100 p-2 text-neutral-500 hover:bg-blue-100 hover:text-blue-600 transition" title="Imprimer"><Printer className="h-4 w-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
