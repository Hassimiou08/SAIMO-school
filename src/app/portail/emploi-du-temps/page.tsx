import type { Metadata } from "next";
import { Sidebar } from "@/components/portal/Sidebar";
import { Topbar } from "@/components/portal/Topbar";
import { EmploiDuTempsManager } from "@/components/portal/EmploiDuTempsManager";
import {
  listerCreneaux,
  listerClassesOptions,
  listerMatieresOptions,
  listerEnseignantsOptions,
} from "@/server/dal/pedagogie";

export const metadata: Metadata = { title: "Emploi du Temps — Portail SAIMO" };

export default async function EmploiDuTempsPage({
  searchParams,
}: {
  searchParams: Promise<{ enseignant?: string }>;
}) {
  const { enseignant: enseignantId } = await searchParams;

  const [creneaux, classes, matieres, enseignants] = await Promise.all([
    listerCreneaux(undefined, enseignantId),
    listerClassesOptions(),
    listerMatieresOptions(),
    listerEnseignantsOptions(),
  ]);

  const enseignantContexte = enseignantId
    ? enseignants.find((e) => e.id === enseignantId) ?? null
    : null;

  return (
    <div className="min-h-screen bg-paper-100">
      <Sidebar />
      <div className="lg:pl-64">
        <Topbar />
        <main className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
          <div className="mb-7">
            <h1 className="font-display text-2xl font-bold tracking-tight text-navy-900">Emploi du Temps</h1>
            <p className="mt-1 text-sm text-ink-500">
              {enseignantContexte
                ? `Cours de ${enseignantContexte.nom}`
                : "Grille hebdomadaire des cours par classe."}
            </p>
          </div>
          <EmploiDuTempsManager
            creneaux={creneaux}
            classes={classes}
            matieres={matieres}
            enseignants={enseignants}
            enseignantContexte={enseignantContexte}
          />
        </main>
      </div>
    </div>
  );
}
