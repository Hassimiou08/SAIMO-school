import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Sidebar } from "@/components/portal/Sidebar";
import { Topbar } from "@/components/portal/Topbar";
import { RecuImprimable } from "@/components/portal/RecuImprimable";
import { BoutonPdf } from "@/components/portal/BoutonPdf";
import { BoutonImprimer } from "@/components/portal/BoutonImprimer";
import { getRecuDetail } from "@/server/dal/finance";

export const metadata = { title: "Reçu de paiement — Portail SAIMO" };

export default async function RecuDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const r = await getRecuDetail(id);

  return (
    <div className="min-h-screen bg-paper-100 print:bg-white">
      <div className="print:hidden">
        <Sidebar />
      </div>
      <div className="lg:pl-64 print:pl-0">
        <div className="print:hidden">
          <Topbar />
        </div>
        <main className="mx-auto max-w-3xl px-6 py-8 lg:px-10 print:max-w-none print:p-0">
          <div className="mb-6 flex items-center justify-between print:hidden">
            <Link
              href="/portail/recus"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 hover:text-navy-900"
            >
              <ArrowLeft className="h-4 w-4" /> Retour aux reçus
            </Link>
            <div className="flex items-center gap-2">
              <BoutonPdf fichier={`Recu-${r.numero}`} label="Télécharger le PDF" />
              <BoutonImprimer label="Imprimer" />
            </div>
          </div>

          <RecuImprimable r={r} />
        </main>
      </div>
    </div>
  );
}
