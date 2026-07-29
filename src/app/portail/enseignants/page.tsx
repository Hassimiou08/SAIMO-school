import type { Metadata } from "next";
import Link from "next/link";
import { UserPlus } from "lucide-react";
import { Sidebar } from "@/components/portal/Sidebar";
import { Topbar } from "@/components/portal/Topbar";
import { EnseignantsTable } from "@/components/portal/EnseignantsTable";

export const metadata: Metadata = {
  title: "Enseignants — Portail SAIMO",
  description: "Gestion du corps enseignant de l'établissement.",
};

export default function EnseignantsPage() {
  return (
    <div className="min-h-screen bg-paper-100">
      <Sidebar />

      <div className="lg:pl-64">
        <Topbar />

        <main className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
          {/* En-tête */}
          <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="font-display text-2xl font-bold tracking-tight text-navy-900">
                Enseignants
              </h1>
              <p className="mt-1 text-sm text-ink-500">
                Gestion du corps enseignant — {6} professeurs enregistrés.
              </p>
            </div>

            <Link href="/portail/enseignants/nouveau" className="inline-flex items-center gap-2 self-start rounded-full bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-600 shadow-md shadow-orange-500/20 hover:shadow-blue-600/20">
              <UserPlus className="h-4 w-4" />
              Nouvel enseignant
            </Link>
          </div>

          <EnseignantsTable />
        </main>
      </div>
    </div>
  );
}
