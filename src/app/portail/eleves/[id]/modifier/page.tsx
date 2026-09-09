import Link from "next/link";
import { ArrowLeft, UserPlus } from "lucide-react";
import { Sidebar } from "@/components/portal/Sidebar";
import { Topbar } from "@/components/portal/Topbar";
import { EleveEditForm } from "@/components/portal/EleveEditForm";
import { getEleveDetailDTO } from "@/server/dal/eleves";

export default async function ModifierElevePage({
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
          <div className="mb-8">
            <Link
              href={`/portail/eleves/${eleve.id}`}
              className="inline-flex items-center gap-2 text-sm font-semibold text-ink-500 hover:text-blue-600 transition-colors mb-4"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour à la fiche de {eleve.firstName}
            </Link>

            <h1 className="font-display text-2xl font-bold tracking-tight text-navy-900 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 shadow-md shadow-blue-500/20">
                <UserPlus className="h-5 w-5 text-white" />
              </div>
              Modifier — {eleve.firstName} {eleve.lastName}
            </h1>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white p-6 md:p-8 shadow-sm">
            <EleveEditForm eleve={eleve} />
          </div>
        </main>
      </div>
    </div>
  );
}
