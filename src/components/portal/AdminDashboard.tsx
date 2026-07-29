"use client";

import { Users, BookOpen, CalendarCheck, Wallet2, GraduationCap, ClipboardCheck, BarChart3, MessageCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

const quickActions = [
  { icon: Users, label: "Gérer les Élèves", href: "/portail/eleves", color: "from-blue-500 to-blue-600", desc: "Inscriptions, fiches, classes" },
  { icon: GraduationCap, label: "Enseignants", href: "#", color: "from-blue-400 to-blue-500", desc: "Gestion du corps enseignant" },
  { icon: ClipboardCheck, label: "Notes & Évaluations", href: "#", color: "from-orange-400 to-orange-500", desc: "Saisie et validation des notes" },
  { icon: Wallet2, label: "Paiements", href: "#", color: "from-orange-500 to-orange-600", desc: "Scolarité, reçus, suivi" },
  { icon: BookOpen, label: "Bulletins", href: "#", color: "from-blue-500 to-blue-600", desc: "Génération et impression" },
  { icon: BarChart3, label: "Rapports", href: "#", color: "from-orange-400 to-orange-500", desc: "Statistiques et analyses" },
];

export function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Accès rapides */}
      <div>
        <h2 className="font-display text-lg font-bold text-neutral-900 mb-4">Accès rapides</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="group flex items-center gap-4 rounded-2xl border border-neutral-200 bg-white p-5 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-blue-200"
            >
              <div className={`flex h-12 w-12 flex-none items-center justify-center rounded-xl bg-gradient-to-br ${action.color} shadow-md`}>
                <action.icon className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-neutral-800 group-hover:text-blue-600 transition">{action.label}</p>
                <p className="mt-0.5 text-xs text-neutral-500">{action.desc}</p>
              </div>
              <ArrowRight className="h-4 w-4 text-neutral-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
            </Link>
          ))}
        </div>
      </div>

      {/* Bannière résumé */}
      <div className="rounded-2xl bg-gradient-to-r from-blue-500 to-orange-400 p-6 text-white overflow-hidden relative">
        {/* Motif carreaux */}
        <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHBhdGggZD0iTTQwIDQwVjBIMHY0MHoiIGZpbGw9Im5vbmUiLz48cGF0aCBkPSJNMzkgNDBWMGgxdjQwek0wIDM5aDQwdjFIMHoiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMSkiLz48L3N2Zz4=')]" />
        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-white/80">Vue rapide</p>
            <p className="mt-2 text-xl font-bold">Tableau de bord Administrateur — Année 2025/2026</p>
            <p className="mt-1 text-sm text-white/80">Tout est à jour. 3 notifications en attente.</p>
          </div>
          <div className="flex gap-3">
            <Link href="/portail/eleves" className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-blue-600 hover:bg-blue-50 transition shadow-md">
              Voir les élèves <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
