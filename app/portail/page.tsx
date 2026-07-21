import type { Metadata } from "next";
import { Sidebar } from "@/components/portal/Sidebar";
import { Topbar } from "@/components/portal/Topbar";
import { StatCards } from "@/components/portal/StatCards";
import { ClassChart } from "@/components/portal/ClassChart";
import { ActivityTable } from "@/components/portal/ActivityTable";

export const metadata: Metadata = {
  title: "Portail établissement — SAIMO",
  description: "Tableau de bord de gestion de l'établissement scolaire.",
};

export default function PortailPage() {
  return (
    <div className="min-h-screen bg-paper-100">
      <Sidebar />

      <div className="lg:pl-64">
        <Topbar />

        <main className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
          <div className="mb-7">
            <h1 className="font-display text-2xl font-bold tracking-tight text-navy-900">
              Bonjour, Mohamed 👋
            </h1>
            <p className="mt-1 text-sm text-ink-500">
              Voici un aperçu de l&rsquo;établissement pour le 2ᵉ trimestre
              2025/2026.
            </p>
          </div>

          <div className="space-y-6">
            <StatCards />

            <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
              <ClassChart />
              <ActivityTable />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
