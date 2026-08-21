"use client";

import { Plus, Tag } from "lucide-react";
import { remises } from "@/lib/mock-admin";
import { Sidebar } from "@/components/portal/Sidebar";
import { Topbar } from "@/components/portal/Topbar";

export default function RemisesPage() {
  const formatCurrency = (val: number) => new Intl.NumberFormat("fr-FR").format(val) + " GNF";

  return (
    <div className="min-h-screen bg-paper-100">
      <Sidebar />
      <div className="lg:pl-64">
        <Topbar />
        <main className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
          <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="font-display text-2xl font-bold tracking-tight text-navy-900">Remises & Bourses</h1>
              <p className="mt-1 text-sm text-ink-500">Gestion des aides financières appliquées aux élèves.</p>
            </div>
            <button className="inline-flex items-center gap-2 self-start rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-600/20 hover:bg-blue-700 transition">
              <Plus className="h-4 w-4" /> Nouvelle remise
            </button>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-neutral-100 bg-neutral-50/50 text-xs uppercase tracking-wide text-neutral-500">
                  <th className="px-5 py-3.5 font-semibold">Élève</th>
                  <th className="px-5 py-3.5 font-semibold">Motif</th>
                  <th className="px-5 py-3.5 font-semibold">Montant réduit</th>
                  <th className="px-5 py-3.5 font-semibold">Accordé par</th>
                  <th className="px-5 py-3.5 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-neutral-200">
                {remises.map(r => (
                  <tr key={r.id} className="hover:bg-blue-50/40 transition">
                    <td className="px-5 py-3.5">
                      <p className="text-sm font-semibold text-neutral-800">{r.eleve}</p>
                      <p className="text-xs text-neutral-500">{r.classe}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center gap-1.5 rounded-lg bg-orange-50 px-2.5 py-1 text-xs font-medium text-orange-700">
                        <Tag className="h-3 w-3" /> {r.motif}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-mono text-sm font-bold text-green-600">-{formatCurrency(r.montant)}</td>
                    <td className="px-5 py-3.5 text-xs text-neutral-600">{r.accordePar}</td>
                    <td className="px-5 py-3.5 text-xs text-neutral-400">{new Date(r.date).toLocaleDateString("fr-FR")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}
