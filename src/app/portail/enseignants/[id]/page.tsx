import Link from "next/link";
import { ArrowLeft, Mail, Phone, GraduationCap, BookOpen } from "lucide-react";
import { Sidebar } from "@/components/portal/Sidebar";
import { Topbar } from "@/components/portal/Topbar";
import { getEnseignantDetail } from "@/server/dal/pedagogie";
import { formatDateLongue } from "@/lib/format";

export default async function EnseignantDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const e = await getEnseignantDetail(id);

  return (
    <div className="min-h-screen bg-paper-100">
      <Sidebar />
      <div className="lg:pl-64">
        <Topbar />
        <main className="mx-auto max-w-5xl px-6 py-8 lg:px-10">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <Link href="/portail/enseignants" className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 transition-colors hover:text-blue-600">
              <ArrowLeft className="h-4 w-4" /> Retour à la liste des enseignants
            </Link>
            <div className="flex gap-2">
              <Link href={`/portail/enseignants/${id}/affecter`} className="inline-flex items-center gap-1.5 rounded-full border border-neutral-300 px-4 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-50">
                Gérer les affectations
              </Link>
              <Link href={`/portail/emploi-du-temps?enseignant=${id}`} className="inline-flex items-center gap-1.5 rounded-full border border-neutral-300 px-4 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-50">
                Emploi du temps
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white overflow-hidden mb-6">
            <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-8">
              <div className="flex items-center gap-5">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm text-white font-display text-2xl font-bold shadow-lg">
                  {e.firstName[0]}{e.lastName[0]}
                </div>
                <div className="text-white">
                  <h1 className="font-display text-2xl font-bold">{e.firstName} {e.lastName}</h1>
                  <p className="text-blue-100">{e.specialite ?? "Enseignant"}</p>
                  <span className={`mt-2 inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${e.statut === "Actif" ? "bg-green-400/20 text-green-50" : "bg-white/20 text-white"}`}>{e.statut}</span>
                </div>
              </div>
            </div>
            <div className="grid gap-4 p-6 sm:grid-cols-3 text-sm">
              <div className="flex items-center gap-2 text-neutral-600"><Mail className="h-4 w-4 text-neutral-400" /> {e.email}</div>
              <div className="flex items-center gap-2 text-neutral-600"><Phone className="h-4 w-4 text-neutral-400" /> {e.telephone ?? "—"}</div>
              <div className="flex items-center gap-2 text-neutral-600"><GraduationCap className="h-4 w-4 text-neutral-400" /> Matricule {e.matricule ?? "—"}</div>
            </div>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white p-6">
            <h2 className="mb-4 flex items-center gap-2 font-display text-sm font-bold text-navy-900">
              <BookOpen className="h-4 w-4" /> Affectations ({e.affectations.length})
            </h2>
            {e.affectations.length === 0 ? (
              <p className="text-sm text-neutral-500">Aucune affectation pour l&rsquo;année en cours.</p>
            ) : (
              <ul className="divide-y divide-neutral-100">
                {e.affectations.map((a) => (
                  <li key={a.id} className="flex items-center justify-between py-3 text-sm">
                    <span className="font-medium text-neutral-800">{a.classe}</span>
                    <span className="rounded-lg bg-blue-50 border border-blue-100 px-2 py-0.5 text-[11px] font-semibold text-blue-600">{a.matiere}</span>
                    {a.profPrincipal && <span className="rounded-lg bg-green-50 border border-green-100 px-2 py-0.5 text-[11px] font-semibold text-green-600">Prof. principal</span>}
                  </li>
                ))}
              </ul>
            )}
            <p className="mt-4 text-xs text-neutral-400">
              Dernière connexion : {e.derniereConnexion ? formatDateLongue(e.derniereConnexion) : "jamais"}
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
