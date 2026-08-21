"use client";

import { BarChart3, TrendingUp, Users, Wallet2, BookOpen, GraduationCap } from "lucide-react";

export function ReportsDashboard() {
  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { title: "Taux de réussite", value: "86%", trend: "+2.4%", icon: TrendingUp, color: "text-green-600", bg: "bg-green-100" },
          { title: "Effectif total", value: "1,248", trend: "+12", icon: Users, color: "text-blue-600", bg: "bg-blue-100" },
          { title: "Moyenne Générale", value: "13.8/20", trend: "+0.3", icon: BookOpen, color: "text-purple-600", bg: "bg-purple-100" },
          { title: "Recouvrement", value: "92%", trend: "-1.5%", icon: Wallet2, color: "text-orange-600", bg: "bg-orange-100" },
        ].map((kpi, i) => (
          <div key={i} className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${kpi.bg}`}>
                <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
              </div>
              <span className={`text-xs font-semibold ${kpi.trend.startsWith("+") ? "text-green-600" : "text-red-500"}`}>
                {kpi.trend}
              </span>
            </div>
            <p className="mt-4 text-sm font-medium text-neutral-500">{kpi.title}</p>
            <p className="mt-1 text-2xl font-bold text-neutral-900">{kpi.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Performance par Niveau (Barres) */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-neutral-800">Performance par Niveau</h2>
            <BarChart3 className="h-5 w-5 text-neutral-400" />
          </div>
          <div className="space-y-4">
            {[
              { label: "Primaire", value: 88, color: "bg-blue-500" },
              { label: "Collège", value: 76, color: "bg-indigo-500" },
              { label: "Lycée", value: 82, color: "bg-purple-500" },
            ].map((bar, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-neutral-700">{bar.label}</span>
                  <span className="text-neutral-500">{bar.value}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-100">
                  <div className={`h-full ${bar.color} rounded-full`} style={{ width: `${bar.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Répartition des statuts de paiement */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-neutral-800">État des Recouvrements</h2>
            <Wallet2 className="h-5 w-5 text-neutral-400" />
          </div>
          <div className="flex items-center justify-center gap-8">
            {/* Custom Pie Chart representation using CSS conic-gradient */}
            <div className="relative h-32 w-32 rounded-full" style={{ background: "conic-gradient(#22c55e 0% 75%, #3b82f6 75% 90%, #ef4444 90% 100%)" }}>
              <div className="absolute inset-2 rounded-full bg-white flex items-center justify-center">
                <span className="text-xl font-bold text-neutral-800">75%</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-green-500" />
                <span className="text-sm text-neutral-600">Soldé (75%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-blue-500" />
                <span className="text-sm text-neutral-600">Partiel (15%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500" />
                <span className="text-sm text-neutral-600">Impayé (10%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
