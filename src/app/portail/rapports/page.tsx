import type { Metadata } from "next";
import { DownloadCloud } from "lucide-react";
import { Sidebar } from "@/components/portal/Sidebar";
import { Topbar } from "@/components/portal/Topbar";
import { ReportsDashboard } from "@/components/portal/ReportsDashboard";

export const metadata: Metadata = {
  title: "Rapports — Portail SAIMO",
  description: "Visualisation des rapports et statistiques.",
};

export default function RapportsPage() {
  return (
    <div className="min-h-screen bg-paper-100">
      <Sidebar />
      <div className="lg:pl-64">
        <Topbar />
        <main className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
          <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="font-display text-2xl font-bold tracking-tight text-navy-900">
                Rapports & Statistiques
              </h1>
              <p className="mt-1 text-sm text-ink-500">
                Vue analytique des performances académiques et financières.
              </p>
            </div>
            <button className="inline-flex items-center gap-2 self-start rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 shadow-md shadow-blue-600/20">
              <DownloadCloud className="h-4 w-4" />
              Exporter le rapport
            </button>
          </div>
          <ReportsDashboard />
        </main>
      </div>
    </div>
  );
}
