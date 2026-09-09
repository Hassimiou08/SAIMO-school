import type { Metadata } from "next";
import { Sidebar } from "@/components/portal/Sidebar";
import { Topbar } from "@/components/portal/Topbar";
import { ReportsDashboard } from "@/components/portal/ReportsDashboard";
import { getStatsDashboard, getMoyennesParClasse } from "@/server/dal/dashboard";
import { getRapportCaisse } from "@/server/dal/finance";
import { getStatsAbsences } from "@/server/dal/absences";

export const metadata: Metadata = {
  title: "Rapports — Portail SAIMO",
  description: "Visualisation des rapports et statistiques.",
};

export default async function RapportsPage() {
  const fin = new Date();
  const debut = new Date();
  debut.setDate(debut.getDate() - 30);

  const [stats, moyennes, caisse, absences] = await Promise.all([
    getStatsDashboard(),
    getMoyennesParClasse(),
    getRapportCaisse(debut, fin),
    getStatsAbsences(),
  ]);

  return (
    <div className="min-h-screen bg-paper-100">
      <Sidebar />
      <div className="lg:pl-64">
        <Topbar />
        <main className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
          <div className="mb-7">
            <h1 className="font-display text-2xl font-bold tracking-tight text-navy-900">Rapports &amp; Statistiques</h1>
            <p className="mt-1 text-sm text-ink-500">Vue analytique des performances académiques et financières.</p>
          </div>
          <ReportsDashboard stats={stats} moyennes={moyennes} caisse={caisse} absences={absences} periode="30 derniers jours" />
        </main>
      </div>
    </div>
  );
}
