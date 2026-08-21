import type { Metadata } from "next";
import { Receipt } from "lucide-react";
import { Sidebar } from "@/components/portal/Sidebar";
import { Topbar } from "@/components/portal/Topbar";
import { PaiementsTable } from "@/components/portal/PaiementsTable";

export const metadata: Metadata = {
  title: "Paiements — Portail SAIMO",
  description: "Gestion de la facturation et des encaissements.",
};

export default function PaiementsPage() {
  return (
    <div className="min-h-screen bg-paper-100">
      <Sidebar />
      <div className="lg:pl-64">
        <Topbar />
        <main className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
          <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="font-display text-2xl font-bold tracking-tight text-navy-900">
                Facturation & Paiements
              </h1>
              <p className="mt-1 text-sm text-ink-500">
                Suivi des frais de scolarité, encaissements et états des paiements.
              </p>
            </div>
          </div>
          <PaiementsTable />
        </main>
      </div>
    </div>
  );
}
