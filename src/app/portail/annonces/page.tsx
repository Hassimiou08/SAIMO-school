import type { Metadata } from "next";
import { Sidebar } from "@/components/portal/Sidebar";
import { Topbar } from "@/components/portal/Topbar";
import { AnnoncesManager } from "@/components/portal/AnnoncesManager";
import { listerAnnonces } from "@/server/dal/admin";

export const metadata: Metadata = { title: "Annonces — Portail SAIMO" };

export default async function AnnoncesPage() {
  const annonces = await listerAnnonces();
  return (
    <div className="min-h-screen bg-paper-100">
      <Sidebar />
      <div className="lg:pl-64">
        <Topbar />
        <main className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
          <div className="mb-7">
            <h1 className="font-display text-2xl font-bold tracking-tight text-navy-900">Annonces</h1>
            <p className="mt-1 text-sm text-ink-500">Communication officielle vers parents, élèves et enseignants.</p>
          </div>
          <AnnoncesManager annonces={annonces} />
        </main>
      </div>
    </div>
  );
}
