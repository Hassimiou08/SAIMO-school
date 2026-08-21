"use client";

import { FileBarChart, Download, Calendar, PieChart } from "lucide-react";
import { ComptaSidebar } from "@/components/compta/ComptaSidebar";
import { ComptaTopbar } from "@/components/compta/ComptaTopbar";
import { kpisFinanciers } from "@/lib/mock-compta";

export default function RapportsPage() {
  const fmt = (val: number) => new Intl.NumberFormat("fr-FR").format(val) + " GNF";

  return (
    <div className="min-h-screen bg-neutral-50/50">
      <ComptaSidebar />
      <div className="lg:pl-64">
        <ComptaTopbar />
        
        <main className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
          <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="font-display text-2xl font-bold tracking-tight text-neutral-900">Rapports Financiers</h1>
              <p className="mt-1 text-sm text-neutral-500">Générez et exportez les bilans comptables de l'établissement.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Bilan Mensuel */}
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm flex flex-col items-start hover:shadow-md transition">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 mb-4">
                <Calendar className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-neutral-900 mb-2">Bilan Mensuel</h3>
              <p className="text-sm text-neutral-500 mb-6 flex-1">
                Résumé complet des entrées et sorties pour le mois en cours.
              </p>
              <button className="w-full inline-flex justify-center items-center gap-2 rounded-xl bg-indigo-50 py-2.5 text-sm font-semibold text-indigo-700 hover:bg-indigo-100 transition">
                <Download className="h-4 w-4" /> Exporter PDF
              </button>
            </div>

            {/* Bilan Annuel */}
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm flex flex-col items-start hover:shadow-md transition">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 mb-4">
                <FileBarChart className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-neutral-900 mb-2">Bilan Annuel</h3>
              <p className="text-sm text-neutral-500 mb-6 flex-1">
                Synthèse financière pour toute l'année scolaire (Recettes, Dépenses, Résultat).
              </p>
              <button className="w-full inline-flex justify-center items-center gap-2 rounded-xl bg-emerald-50 py-2.5 text-sm font-semibold text-emerald-700 hover:bg-emerald-100 transition">
                <Download className="h-4 w-4" /> Exporter PDF
              </button>
            </div>

            {/* Répartition des Dépenses */}
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm flex flex-col items-start hover:shadow-md transition">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-orange-700 mb-4">
                <PieChart className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-neutral-900 mb-2">Analyse des Dépenses</h3>
              <p className="text-sm text-neutral-500 mb-6 flex-1">
                Graphiques détaillés sur les postes de dépenses (Salaires, Maintenance, etc.).
              </p>
              <button className="w-full inline-flex justify-center items-center gap-2 rounded-xl border border-neutral-200 bg-white py-2.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 transition">
                <Download className="h-4 w-4" /> Exporter Excel
              </button>
            </div>
          </div>

          {/* Apercu Rapide */}
          <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm overflow-hidden p-6">
            <h2 className="font-bold text-neutral-900 mb-6">Aperçu du mois en cours</h2>
            <div className="flex flex-col md:flex-row items-center gap-8 justify-around">
              <div className="text-center">
                <p className="text-sm text-neutral-500 font-medium">Total Recettes</p>
                <p className="text-3xl font-bold text-emerald-600 mt-2">{fmt(kpisFinanciers.recettesMois)}</p>
              </div>
              <div className="h-16 w-px bg-neutral-200 hidden md:block"></div>
              <div className="text-center">
                <p className="text-sm text-neutral-500 font-medium">Total Dépenses</p>
                <p className="text-3xl font-bold text-orange-600 mt-2">{fmt(kpisFinanciers.depensesMois)}</p>
              </div>
              <div className="h-16 w-px bg-neutral-200 hidden md:block"></div>
              <div className="text-center">
                <p className="text-sm text-neutral-500 font-medium">Résultat Net</p>
                <p className={`text-3xl font-bold mt-2 ${kpisFinanciers.recettesMois - kpisFinanciers.depensesMois >= 0 ? "text-indigo-600" : "text-red-600"}`}>
                  {fmt(kpisFinanciers.recettesMois - kpisFinanciers.depensesMois)}
                </p>
              </div>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
