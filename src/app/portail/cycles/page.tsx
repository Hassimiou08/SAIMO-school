import type { Metadata } from "next";
import { Sidebar } from "@/components/portal/Sidebar";
import { Topbar } from "@/components/portal/Topbar";
import { CyclesManager } from "@/components/portal/CyclesManager";
import { listerCyclesNiveaux } from "@/server/dal/pedagogie";

export const metadata: Metadata = { title: "Cycles & Niveaux — Portail SAIMO" };

export default async function CyclesPage() {
  const cycles = await listerCyclesNiveaux();
  return (
    <div className="min-h-screen bg-paper-100">
      <Sidebar />
      <div className="lg:pl-64">
        <Topbar />
        <main className="mx-auto max-w-4xl px-6 py-8 lg:px-10">
          <div className="mb-7">
            <h1 className="font-display text-2xl font-bold tracking-tight text-navy-900">Cycles &amp; Niveaux</h1>
            <p className="mt-1 text-sm text-ink-500">Structure pédagogique de l&rsquo;établissement.</p>
          </div>
          <CyclesManager cycles={cycles} />
        </main>
      </div>
    </div>
  );
}
