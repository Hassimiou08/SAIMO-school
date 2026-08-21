import type { Metadata } from "next";
import { Sidebar } from "@/components/portal/Sidebar";
import { Topbar } from "@/components/portal/Topbar";
import { StatCards } from "@/components/portal/StatCards";
import { ClassChart } from "@/components/portal/ClassChart";
import { ActivityTable } from "@/components/portal/ActivityTable";
import { AdminDashboard } from "@/components/portal/AdminDashboard";

export const metadata: Metadata = {
  title: "Portail SAIMO — Administration",
  description: "Tableau de bord principal de l'administration SAIMO.",
};

export default function PortailPage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Sidebar />

      <div className="lg:pl-64">
        <Topbar />

        <main className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
          {/* En-tête avec fond dégradé */}
          <div className="mb-8 rounded-2xl bg-gradient-to-r from-blue-500 to-orange-400 p-8 text-white overflow-hidden relative">
            {/* Motif carreaux */}
            <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHBhdGggZD0iTTQwIDQwVjBIMHY0MHoiIGZpbGw9Im5vbmUiLz48cGF0aCBkPSJNMzkgNDBWMGgxdjQwek0wIDM5aDQwdjFIMHoiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMSkiLz48L3N2Zz4=')]" />
            <div className="relative">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/80">
                Administration
              </p>
              <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Tableau de bord
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/85">
                Bienvenue, Mohamed. Suivez l'activité de votre établissement et accédez rapidement aux modules essentiels.
              </p>
            </div>
          </div>

          {/* Statistiques */}
          <StatCards />

          {/* Graphique + Activité */}
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <ClassChart />
            <ActivityTable />
          </div>

          {/* Dashboard Admin (Accès rapides + Bannière) */}
          <div className="mt-8">
            <AdminDashboard />
          </div>
        </main>
      </div>
    </div>
  );
}
