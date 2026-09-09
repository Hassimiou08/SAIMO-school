import type { Metadata } from "next";
import { ComptaShell } from "@/components/compta/ComptaShell";
import { RecettesManager } from "@/components/compta/RecettesManager";
import { listerRecettes } from "@/server/dal/compta";
import { listerFrais } from "@/server/dal/finance";

export const metadata: Metadata = {
  title: "Recettes — Portail comptable SAIMO",
};

export default async function RecettesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; mois?: string }>;
}) {
  const sp = await searchParams;
  const [recettes, frais] = await Promise.all([
    listerRecettes({ q: sp.q, mois: sp.mois }),
    listerFrais({}),
  ]);

  return (
    <ComptaShell>
      <RecettesManager recettes={recettes} frais={frais} />
    </ComptaShell>
  );
}
