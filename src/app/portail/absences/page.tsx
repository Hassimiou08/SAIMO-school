import type { Metadata } from "next";
import { Sidebar } from "@/components/portal/Sidebar";
import { Topbar } from "@/components/portal/Topbar";
import { AbsencesManager } from "@/components/portal/AbsencesManager";
import { listerAbsences, getStatsAbsences } from "@/server/dal/absences";
import { listerClassesOptions, listerElevesParClasse } from "@/server/dal/pedagogie";

export const metadata: Metadata = { title: "Absences — Portail SAIMO" };

export default async function AbsencesPage() {
  const [absences, stats, classes, eleves] = await Promise.all([
    listerAbsences({}),
    getStatsAbsences(),
    listerClassesOptions(),
    listerElevesParClasse(),
  ]);

  return (
    <div className="min-h-screen bg-paper-100">
      <Sidebar />
      <div className="lg:pl-64">
        <Topbar />
        <main className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
          <div className="mb-7">
            <h1 className="font-display text-2xl font-bold tracking-tight text-navy-900">Absences &amp; Retards</h1>
            <p className="mt-1 text-sm text-ink-500">Suivi des absences et justifications.</p>
          </div>
          <AbsencesManager absences={absences} stats={stats} classes={classes} eleves={eleves} />
        </main>
      </div>
    </div>
  );
}
