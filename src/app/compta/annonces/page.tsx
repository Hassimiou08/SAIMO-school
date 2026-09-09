import type { Metadata } from "next";
import { ComptaShell } from "@/components/compta/ComptaShell";
import { AnnoncesManager } from "@/components/portal/AnnoncesManager";
import { RelanceImpayesCard } from "@/components/compta/RelanceImpayesCard";
import { listerAnnonces } from "@/server/dal/admin";
import { getStatsImpayes } from "@/server/dal/compta";

export const metadata: Metadata = {
  title: "Annonces & relances — Portail comptable SAIMO",
};

export default async function ComptaAnnoncesPage() {
  const [annonces, stats] = await Promise.all([
    listerAnnonces(),
    getStatsImpayes(),
  ]);

  return (
    <ComptaShell>
      <div className="mb-7">
        <h1 className="font-display text-2xl font-bold tracking-tight text-neutral-900">
          Annonces &amp; relances
        </h1>
        <p className="mt-1 text-sm text-neutral-500">
          Communication vers les familles et relance des paiements en attente.
        </p>
      </div>

      <div className="mb-8">
        <RelanceImpayesCard
          nbParents={stats.nbParents}
          totalDu={stats.totalDu}
        />
      </div>

      <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-neutral-500">
        Annonces
      </h2>
      <AnnoncesManager annonces={annonces} />
    </ComptaShell>
  );
}
