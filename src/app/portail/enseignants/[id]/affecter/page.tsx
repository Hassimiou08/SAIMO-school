import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Sidebar } from "@/components/portal/Sidebar";
import { Topbar } from "@/components/portal/Topbar";
import { FilParcours, ETAPES_RECRUTEMENT } from "@/components/portal/FilParcours";
import { AffecterEnseignantView } from "@/components/portal/AffecterEnseignantView";
import {
  getEnseignantDetail,
  listerClassesOptions,
  listerMatieresOptions,
} from "@/server/dal/pedagogie";

export const metadata = { title: "Affecter des cours — Portail SAIMO" };

export default async function AffecterPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [ens, classes, matieres] = await Promise.all([
    getEnseignantDetail(id),
    listerClassesOptions(),
    listerMatieresOptions(),
  ]);

  return (
    <div className="min-h-screen bg-paper-100">
      <Sidebar />
      <div className="lg:pl-64">
        <Topbar />
        <main className="mx-auto max-w-3xl px-6 py-8 lg:px-10">
          <Link href="/portail/enseignants" className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 hover:text-navy-900">
            <ArrowLeft className="h-4 w-4" /> Retour aux enseignants
          </Link>

          <h1 className="font-display text-2xl font-bold tracking-tight text-navy-900">Affecter des cours</h1>
          <p className="mt-1 mb-5 text-sm text-ink-500">{ens.firstName} {ens.lastName}{ens.specialite ? ` · ${ens.specialite}` : ""}</p>

          <FilParcours etapes={ETAPES_RECRUTEMENT} courant={1} />

          <AffecterEnseignantView
            enseignantId={id}
            enseignantNom={`${ens.firstName} ${ens.lastName}`}
            affectations={ens.affectations}
            classes={classes}
            matieres={matieres}
          />
        </main>
      </div>
    </div>
  );
}
