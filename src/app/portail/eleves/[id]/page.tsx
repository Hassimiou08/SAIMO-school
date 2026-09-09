import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Wallet2, ChevronRight } from "lucide-react";
import { Sidebar } from "@/components/portal/Sidebar";
import { Topbar } from "@/components/portal/Topbar";
import { StudentProfile } from "@/components/portal/StudentProfile";
import { getEleveDetailDTO } from "@/server/dal/eleves";
import { formatGNF } from "@/lib/format";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  try {
    const eleve = await getEleveDetailDTO(id);
    return { title: `${eleve.firstName} ${eleve.lastName} — SAIMO` };
  } catch {
    return { title: "Élève introuvable — SAIMO" };
  }
}

export default async function EleveDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const eleve = await getEleveDetailDTO(id); // notFound() géré dans le DAL

  return (
    <div className="min-h-screen bg-paper-100">
      <Sidebar />

      <div className="lg:pl-64">
        <Topbar />

        <main className="mx-auto max-w-5xl px-6 py-8 lg:px-10">
          <Link
            href="/portail/eleves"
            className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 transition-colors hover:text-navy-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour à la liste des élèves
          </Link>

          {eleve.soldeDu > 0 && (
            <Link
              href={`/portail/eleves/${id}/finaliser`}
              className="mb-5 flex items-center justify-between rounded-2xl border border-orange-200 bg-orange-50 p-4 text-sm text-orange-800 transition hover:bg-orange-100"
            >
              <span className="flex items-center gap-2">
                <Wallet2 className="h-4 w-4" />
                Inscription à finaliser — solde de <strong>{formatGNF(eleve.soldeDu)}</strong> à encaisser.
              </span>
              <span className="inline-flex items-center gap-1 font-semibold">Finaliser <ChevronRight className="h-4 w-4" /></span>
            </Link>
          )}

          <StudentProfile student={eleve} />
        </main>
      </div>
    </div>
  );
}
