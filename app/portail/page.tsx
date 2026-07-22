import type { Metadata } from "next";
import { Sidebar } from "@/components/portal/Sidebar";
import { Topbar } from "@/components/portal/Topbar";
import { RoleDashboard } from "@/components/portal/RoleDashboard";

export const metadata: Metadata = {
  title: "Portail SAIMO",
  description: "Tableau de bord principal du portail établissement.",
};

export default function PortailPage() {
  return (
    <div className="min-h-screen bg-paper-100">
      <Sidebar />

      <div className="lg:pl-64">
        <Topbar />

        <main className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary-600">
                Portail établissement
              </p>
              <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-navy-900 sm:text-4xl">
                Tableau de bord
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-500">
                Suivez l’activité de votre établissement, pilotez les indicateurs clés et accédez rapidement aux modules essentiels.
              </p>
            </div>

            <div className="inline-flex items-center rounded-full border border-navy-900/8 bg-white px-4 py-2 text-sm font-medium text-ink-700 shadow-sm">
              Vue personnalisée selon votre rôle
            </div>
          </div>

          <RoleDashboard />
        </main>
      </div>
    </div>
  );
}
