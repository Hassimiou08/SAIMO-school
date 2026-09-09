import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ParentSidebar } from "@/components/parent/ParentSidebar";
import { ParentTopbar } from "@/components/parent/ParentTopbar";
import { BulletinImprimable } from "@/components/portal/BulletinImprimable";
import { BoutonPdf } from "@/components/portal/BoutonPdf";
import { BoutonImprimer } from "@/components/portal/BoutonImprimer";
import { getBulletinDetail } from "@/server/dal/bulletins";
import { bulletinPublieDeMonEnfant } from "@/server/dal/parent";

const slug = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "bulletin";

export default async function BulletinParentDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ enfant?: string }>;
}) {
  const { id } = await params;
  const sp = await searchParams;
  if (!(await bulletinPublieDeMonEnfant(id))) notFound();
  const b = await getBulletinDetail(id);

  return (
    <div className="min-h-screen bg-neutral-50 print:bg-white">
      <div className="print:hidden">
        <ParentSidebar />
      </div>
      <div className="lg:pl-64 print:pl-0">
        <div className="print:hidden">
          <ParentTopbar />
        </div>
        <main className="mx-auto max-w-3xl px-6 py-8 lg:px-10 print:max-w-none print:p-0">
          <div className="mb-6 flex items-center justify-between print:hidden">
            <Link
              href={`/parent/bulletins${sp.enfant ? `?enfant=${sp.enfant}` : ""}`}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-500 hover:text-neutral-900"
            >
              <ArrowLeft className="h-4 w-4" /> Retour
            </Link>
            <div className="flex items-center gap-2">
              <BoutonPdf fichier={`Bulletin-${slug(b.eleve)}-${slug(b.periode)}`} label="Télécharger le PDF" />
              <BoutonImprimer label="Imprimer" />
            </div>
          </div>

          <BulletinImprimable b={b} />
        </main>
      </div>
    </div>
  );
}
