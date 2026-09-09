import type { Metadata } from "next";
import { Sidebar } from "@/components/portal/Sidebar";
import { Topbar } from "@/components/portal/Topbar";
import { NotesManager } from "@/components/portal/NotesManager";
import {
  listerEvaluations,
  listerPeriodes,
  listerTypesEvaluation,
} from "@/server/dal/evaluations";
import { listerClassesOptions, listerMatieresOptions } from "@/server/dal/pedagogie";

export const metadata: Metadata = { title: "Notes & Évaluations — Portail SAIMO" };

export default async function NotesPage({
  searchParams,
}: {
  searchParams: Promise<{ classe?: string; periode?: string }>;
}) {
  const sp = await searchParams;
  const [evaluations, classes, matieres, periodes, types] = await Promise.all([
    listerEvaluations({ classeId: sp.classe, periodeId: sp.periode }),
    listerClassesOptions(),
    listerMatieresOptions(),
    listerPeriodes(),
    listerTypesEvaluation(),
  ]);

  return (
    <div className="min-h-screen bg-paper-100">
      <Sidebar />
      <div className="lg:pl-64">
        <Topbar />
        <main className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
          <div className="mb-7">
            <h1 className="font-display text-2xl font-bold tracking-tight text-navy-900">Notes &amp; Évaluations</h1>
            <p className="mt-1 text-sm text-ink-500">Créez des évaluations, saisissez et verrouillez les notes.</p>
          </div>
          <NotesManager
            evaluations={evaluations}
            classes={classes}
            matieres={matieres}
            periodes={periodes}
            types={types}
            filtreClasse={sp.classe}
            filtrePeriode={sp.periode}
          />
        </main>
      </div>
    </div>
  );
}
