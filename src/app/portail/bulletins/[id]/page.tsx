import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Sidebar } from "@/components/portal/Sidebar";
import { Topbar } from "@/components/portal/Topbar";
import { BulletinImprimable } from "@/components/portal/BulletinImprimable";
import { BulletinAppreciationsEditor } from "@/components/portal/BulletinAppreciationsEditor";
import { BoutonImprimer } from "@/components/portal/BoutonImprimer";
import { BoutonPdf } from "@/components/portal/BoutonPdf";
import { getBulletinDetail } from "@/server/dal/bulletins";

const slug = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "bulletin";

export const metadata = { title: "Détail du bulletin — Portail SAIMO" };

export default async function BulletinDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const b = await getBulletinDetail(id);

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
              href="/portail/bulletins"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 hover:text-navy-900"
            >
              <ArrowLeft className="h-4 w-4" /> Retour
            </Link>
            {b.statut === "brouillon" ? (
              <span className="text-xs text-amber-600">
                Bulletin en brouillon — validez-le avant impression.
              </span>
            ) : (
              <div className="flex items-center gap-2">
                <BoutonPdf fichier={`Bulletin-${slug(b.eleve)}-${slug(b.periode)}`} label="Télécharger le PDF" />
                <BoutonImprimer label="Imprimer" />
              </div>
            )}
          </div>

          {b.statut !== "publie" && (
            <BulletinAppreciationsEditor
              bulletinId={b.id}
              mentionAuto={b.mentionAuto}
              mentionManuelle={b.mentionManuelle}
              mentionActuelle={b.mention}
              appreciationGenerale={b.appreciation}
              matieres={b.matieres.map((m) => ({
                matiereId: m.matiereId,
                matiere: m.matiere,
                appreciation: m.appreciation,
                coefficient: m.coefficient,
                moyenne: m.moyenne,
              }))}
            />
          )}

          <BulletinImprimable b={b} />
        </main>
      </div>
    </div>
  );
}
