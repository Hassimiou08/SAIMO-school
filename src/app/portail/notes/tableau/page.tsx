import type { Metadata } from "next";
import { Sidebar } from "@/components/portal/Sidebar";
import { Topbar } from "@/components/portal/Topbar";
import { TableauGeneralNotes } from "@/components/notes/TableauGeneralNotes";
import { getTableauGeneralClasse } from "@/server/dal/notes-tableau";
import { listerPeriodes } from "@/server/dal/evaluations";
import { listerClassesOptions } from "@/server/dal/pedagogie";

export const metadata: Metadata = { title: "Tableau général des notes — Portail SAIMO" };

export default async function TableauGeneralNotesPage({
  searchParams,
}: {
  searchParams: Promise<{ classe?: string; periode?: string }>;
}) {
  const sp = await searchParams;
  const [classes, periodes] = await Promise.all([listerClassesOptions(), listerPeriodes()]);

  const classeId = sp.classe;
  const periodeId = sp.periode ?? periodes.find((p) => p.active)?.id;

  let data = null;
  let erreur: string | null = null;
  if (classeId && periodeId) {
    try {
      data = await getTableauGeneralClasse(classeId, periodeId);
    } catch (e) {
      erreur = e instanceof Error ? e.message : "Erreur inconnue";
    }
  }

  return (
    <div className="min-h-screen bg-paper-100">
      <Sidebar />
      <div className="lg:pl-64">
        <Topbar />
        <main className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
          <div className="mb-7">
            <h1 className="font-display text-2xl font-bold tracking-tight text-navy-900">
              Tableau général des notes
            </h1>
            <p className="mt-1 text-sm text-ink-500">
              Toutes les matières, tous les élèves de la classe — moyenne pondérée devoirs × 2 + composition, sur 3.
            </p>
          </div>
          {erreur ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-6 text-sm text-red-700">{erreur}</div>
          ) : (
            <TableauGeneralNotes
              data={data}
              classes={classes}
              periodes={periodes}
              filtreClasse={classeId}
              filtrePeriode={periodeId}
              basePath="/portail/notes/tableau"
            />
          )}
        </main>
      </div>
    </div>
  );
}
