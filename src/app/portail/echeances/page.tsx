import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Sidebar } from "@/components/portal/Sidebar";
import { Topbar } from "@/components/portal/Topbar";
import { EcheancesManager } from "@/components/portal/EcheancesManager";
import { listerEcheances, listerTypesFrais } from "@/server/dal/finance";
import { listerNiveauxOptions } from "@/server/dal/pedagogie";

export const metadata: Metadata = { title: "Échéances & Frais — Portail SAIMO" };

export default async function EcheancesPage() {
  const [echeances, typesFrais, niveaux] = await Promise.all([
    listerEcheances(),
    listerTypesFrais(),
    listerNiveauxOptions(),
  ]);

  return (
    <div className="min-h-screen bg-paper-100">
      <Sidebar />
      <div className="lg:pl-64">
        <Topbar />
        <main className="mx-auto max-w-5xl px-6 py-8 lg:px-10">
          <Link href="/portail/paiements" className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 hover:text-navy-900">
            <ArrowLeft className="h-4 w-4" /> Retour aux paiements
          </Link>
          <div className="mb-7">
            <h1 className="font-display text-2xl font-bold tracking-tight text-navy-900">Échéances &amp; Frais</h1>
            <p className="mt-1 text-sm text-ink-500">Types de frais, montants par niveau, et génération des frais élèves.</p>
          </div>
          <EcheancesManager echeances={echeances} typesFrais={typesFrais} niveaux={niveaux} />
        </main>
      </div>
    </div>
  );
}
