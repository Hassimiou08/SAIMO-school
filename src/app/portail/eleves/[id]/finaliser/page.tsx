import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Sidebar } from "@/components/portal/Sidebar";
import { Topbar } from "@/components/portal/Topbar";
import { FilParcours, ETAPES_INSCRIPTION } from "@/components/portal/FilParcours";
import { EncaissementInscription } from "@/components/portal/EncaissementInscription";
import { getEleveDetailDTO } from "@/server/dal/eleves";
import { listerFraisEleve } from "@/server/dal/finance";

export const metadata = { title: "Finaliser l'inscription — Portail SAIMO" };

export default async function FinaliserInscriptionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [eleve, frais] = await Promise.all([
    getEleveDetailDTO(id),
    listerFraisEleve(id),
  ]);

  return (
    <div className="min-h-screen bg-paper-100">
      <Sidebar />
      <div className="lg:pl-64">
        <Topbar />
        <main className="mx-auto max-w-3xl px-6 py-8 lg:px-10">
          <Link href="/portail/eleves" className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 hover:text-navy-900">
            <ArrowLeft className="h-4 w-4" /> Retour à la liste des élèves
          </Link>

          <h1 className="font-display text-2xl font-bold tracking-tight text-navy-900">
            Finaliser l&rsquo;inscription
          </h1>
          <p className="mt-1 mb-5 text-sm text-ink-500">
            {eleve.firstName} {eleve.lastName} · {eleve.classe} · matricule {eleve.matricule}
          </p>

          <FilParcours etapes={ETAPES_INSCRIPTION} courant={2} />

          <EncaissementInscription eleveId={id} matricule={eleve.matricule} frais={frais} />
        </main>
      </div>
    </div>
  );
}
