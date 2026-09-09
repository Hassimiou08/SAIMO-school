import type { Metadata } from "next";
import { Sidebar } from "@/components/portal/Sidebar";
import { Topbar } from "@/components/portal/Topbar";
import { EnseignantsTable } from "@/components/portal/EnseignantsTable";
import { listerEnseignants } from "@/server/dal/pedagogie";

export const metadata: Metadata = {
  title: "Enseignants — Portail SAIMO",
  description: "Gestion du corps enseignant de l'établissement.",
};

export default async function EnseignantsPage() {
  const enseignants = await listerEnseignants();

  return (
    <div className="min-h-screen bg-paper-100">
      <Sidebar />
      <div className="lg:pl-64">
        <Topbar />
        <main className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
          <div className="mb-7">
            <h1 className="font-display text-2xl font-bold tracking-tight text-navy-900">Enseignants</h1>
            <p className="mt-1 text-sm text-ink-500">
              {enseignants.length} professeur{enseignants.length > 1 ? "s" : ""} enregistré{enseignants.length > 1 ? "s" : ""}.
            </p>
          </div>
          <EnseignantsTable enseignants={enseignants} />
        </main>
      </div>
    </div>
  );
}
