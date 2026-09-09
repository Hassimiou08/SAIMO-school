import type { Metadata } from "next";
import { Sidebar } from "@/components/portal/Sidebar";
import { Topbar } from "@/components/portal/Topbar";
import { RecusTable } from "@/components/portal/RecusTable";
import { listerRecus } from "@/server/dal/finance";

export const metadata: Metadata = { title: "Reçus — Portail SAIMO" };

export default async function RecusPage() {
  const recus = await listerRecus();
  return (
    <div className="min-h-screen bg-paper-100">
      <Sidebar />
      <div className="lg:pl-64">
        <Topbar />
        <main className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
          <div className="mb-7">
            <h1 className="font-display text-2xl font-bold tracking-tight text-navy-900">Reçus de paiement</h1>
            <p className="mt-1 text-sm text-ink-500">Historique des reçus émis ({recus.length}).</p>
          </div>
          <RecusTable recus={recus} />
        </main>
      </div>
    </div>
  );
}
