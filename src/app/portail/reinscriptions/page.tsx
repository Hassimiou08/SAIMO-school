import type { Metadata } from "next";
import { Sidebar } from "@/components/portal/Sidebar";
import { Topbar } from "@/components/portal/Topbar";
import { ReinscriptionsManager } from "@/components/portal/ReinscriptionsManager";
import { getDonneesReinscription } from "@/server/dal/reinscriptions";
import { requireContext } from "@/server/context";
import { peutFaire } from "@/server/permissions/roles";

export const metadata: Metadata = {
  title: "Réinscriptions — Portail SAIMO",
  description: "Réinscrire les élèves d'une année précédente dans les classes de l'année active.",
};

export default async function ReinscriptionsPage({
  searchParams,
}: {
  searchParams: Promise<{ source?: string }>;
}) {
  const sp = await searchParams;
  const [donnees, ctx] = await Promise.all([getDonneesReinscription(sp.source), requireContext()]);

  return (
    <div className="min-h-screen bg-paper-100">
      <Sidebar />
      <div className="lg:pl-64">
        <Topbar />
        <main className="mx-auto max-w-5xl px-6 py-8 lg:px-10">
          <div className="mb-7">
            <h1 className="font-display text-2xl font-bold tracking-tight text-navy-900">Réinscriptions</h1>
            <p className="mt-1 text-sm text-ink-500">
              Réinscrivez les élèves d&rsquo;une année précédente dans une classe de l&rsquo;année{" "}
              <strong>{donnees.anneeActive}</strong>. Leurs frais (réinscription, scolarité…) sont créés automatiquement.
            </p>
          </div>
          <ReinscriptionsManager {...donnees} peutReinscrire={peutFaire(ctx.role, "inscription:create")} />
        </main>
      </div>
    </div>
  );
}
