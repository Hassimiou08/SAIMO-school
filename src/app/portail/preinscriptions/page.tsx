import type { Metadata } from "next";
import { Sidebar } from "@/components/portal/Sidebar";
import { Topbar } from "@/components/portal/Topbar";
import { PreInscriptionsManager } from "@/components/portal/PreInscriptionsManager";
import { listerPreInscriptions, getStatsPreInscriptions } from "@/server/dal/preinscriptions";
import { listerClassesOptions } from "@/server/dal/pedagogie";
import { niveauxSansFrais } from "@/server/dal/finance";

export const metadata: Metadata = { title: "Pré-inscriptions — Portail SAIMO" };

export default async function PreInscriptionsPage({
  searchParams,
}: {
  searchParams: Promise<{ statut?: string }>;
}) {
  const sp = await searchParams;
  const [demandes, stats, classes, niveauxSans] = await Promise.all([
    listerPreInscriptions(sp.statut),
    getStatsPreInscriptions(),
    listerClassesOptions(),
    niveauxSansFrais(),
  ]);
  const classesSansFrais = classes
    .filter((c) => niveauxSans.includes(c.niveauId))
    .map((c) => c.id);

  return (
    <div className="min-h-screen bg-paper-100">
      <Sidebar />
      <div className="lg:pl-64">
        <Topbar />
        <main className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
          <div className="mb-7">
            <h1 className="font-display text-2xl font-bold tracking-tight text-navy-900">Pré-inscriptions</h1>
            <p className="mt-1 text-sm text-ink-500">Demandes reçues depuis le site public — à contacter puis convertir en élèves.</p>
          </div>
          <PreInscriptionsManager
            demandes={demandes}
            stats={stats}
            classes={classes}
            classesSansFrais={classesSansFrais}
            filtre={sp.statut}
          />
        </main>
      </div>
    </div>
  );
}
