import Link from "next/link";
import { ArrowLeft, Users, MapPin, GraduationCap } from "lucide-react";
import { Sidebar } from "@/components/portal/Sidebar";
import { Topbar } from "@/components/portal/Topbar";
import { ClasseDetailView } from "@/components/portal/ClasseDetailView";
import {
  getClasseDetail,
  listerMatieresOptions,
  listerEnseignantsOptions,
  listerNiveauxOptions,
} from "@/server/dal/pedagogie";

export default async function ClasseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [classe, matieres, enseignants, niveaux] = await Promise.all([
    getClasseDetail(id),
    listerMatieresOptions(),
    listerEnseignantsOptions(),
    listerNiveauxOptions(),
  ]);

  return (
    <div className="min-h-screen bg-paper-100">
      <Sidebar />
      <div className="lg:pl-64">
        <Topbar />
        <main className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
          <Link href="/portail/classes" className="inline-flex items-center gap-2 text-sm font-medium text-neutral-500 hover:text-neutral-900 mb-4 transition">
            <ArrowLeft className="h-4 w-4" /> Retour aux classes
          </Link>

          <div className="mb-8 rounded-2xl border border-neutral-200 bg-white p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="font-display text-2xl font-bold text-navy-900">{classe.nom}</h1>
                <p className="mt-1 text-sm text-ink-500">{classe.cycle} · {classe.niveau}</p>
              </div>
              <div className="flex gap-6 text-sm">
                <span className="flex items-center gap-1.5 text-neutral-600"><Users className="h-4 w-4 text-neutral-400" /> {classe.effectif}{classe.capacite ? ` / ${classe.capacite}` : ""} élèves</span>
                <span className="flex items-center gap-1.5 text-neutral-600"><MapPin className="h-4 w-4 text-neutral-400" /> {classe.salle ?? "Salle non définie"}</span>
                <span className="flex items-center gap-1.5 text-neutral-600"><GraduationCap className="h-4 w-4 text-neutral-400" /> {classe.profPrincipal ?? "Aucun prof. principal"}</span>
              </div>
            </div>
          </div>

          <ClasseDetailView classe={classe} matieres={matieres} enseignants={enseignants} niveaux={niveaux} />
        </main>
      </div>
    </div>
  );
}
