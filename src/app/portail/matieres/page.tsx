import type { Metadata } from "next";
import { Sidebar } from "@/components/portal/Sidebar";
import { Topbar } from "@/components/portal/Topbar";
import { MatieresManager } from "@/components/portal/MatieresManager";
import { listerMatieres, listerNiveauxOptions } from "@/server/dal/pedagogie";

export const metadata: Metadata = { title: "Matières — Portail SAIMO" };

export default async function MatieresPage() {
  const [matieres, niveaux] = await Promise.all([
    listerMatieres(),
    listerNiveauxOptions(),
  ]);
  return (
    <div className="min-h-screen bg-paper-100">
      <Sidebar />
      <div className="lg:pl-64">
        <Topbar />
        <main className="mx-auto max-w-6xl px-6 py-8 lg:px-10">
          <div className="mb-7">
            <h1 className="font-display text-2xl font-bold tracking-tight text-navy-900">Matières</h1>
            <p className="mt-1 text-sm text-ink-500">{matieres.length} matière{matieres.length > 1 ? "s" : ""} · coefficients par niveau.</p>
          </div>
          <MatieresManager matieres={matieres} niveaux={niveaux} />
        </main>
      </div>
    </div>
  );
}
