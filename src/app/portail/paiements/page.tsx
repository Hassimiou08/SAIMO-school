import type { Metadata } from "next";
import Link from "next/link";
import { Settings2 } from "lucide-react";
import { Sidebar } from "@/components/portal/Sidebar";
import { Topbar } from "@/components/portal/Topbar";
import { PaiementsTable } from "@/components/portal/PaiementsTable";
import { listerFrais } from "@/server/dal/finance";
import { listerClassesOptions } from "@/server/dal/pedagogie";

export const metadata: Metadata = {
  title: "Paiements — Portail SAIMO",
  description: "Gestion de la facturation et des encaissements.",
};

export default async function PaiementsPage({
  searchParams,
}: {
  searchParams: Promise<{ classe?: string; statut?: string; q?: string }>;
}) {
  const sp = await searchParams;
  const [frais, classes] = await Promise.all([
    listerFrais({ classeId: sp.classe, statut: sp.statut, q: sp.q }),
    listerClassesOptions(),
  ]);

  return (
    <div className="min-h-screen bg-paper-100">
      <Sidebar />
      <div className="lg:pl-64">
        <Topbar />
        <main className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
          <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="font-display text-2xl font-bold tracking-tight text-navy-900">Facturation &amp; Paiements</h1>
              <p className="mt-1 text-sm text-ink-500">Frais de scolarité, encaissements et états des paiements.</p>
            </div>
            <Link href="/portail/echeances" className="inline-flex items-center gap-2 self-start rounded-full border border-neutral-300 px-4 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 transition">
              <Settings2 className="h-4 w-4" /> Configurer les frais
            </Link>
          </div>
          <PaiementsTable frais={frais} classes={classes} />
        </main>
      </div>
    </div>
  );
}
