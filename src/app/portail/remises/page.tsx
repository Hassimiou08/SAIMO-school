import type { Metadata } from "next";
import { Sidebar } from "@/components/portal/Sidebar";
import { Topbar } from "@/components/portal/Topbar";
import { RemisesManager } from "@/components/portal/RemisesManager";
import { listerRemises, listerFrais } from "@/server/dal/finance";

export const metadata: Metadata = { title: "Remises & Bourses — Portail SAIMO" };

export default async function RemisesPage() {
  const [remises, frais] = await Promise.all([
    listerRemises(),
    listerFrais({}),
  ]);
  return (
    <div className="min-h-screen bg-paper-100">
      <Sidebar />
      <div className="lg:pl-64">
        <Topbar />
        <main className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
          <div className="mb-7">
            <h1 className="font-display text-2xl font-bold tracking-tight text-navy-900">Remises &amp; Bourses</h1>
            <p className="mt-1 text-sm text-ink-500">Aides financières appliquées aux frais des élèves.</p>
          </div>
          <RemisesManager remises={remises} frais={frais} />
        </main>
      </div>
    </div>
  );
}
