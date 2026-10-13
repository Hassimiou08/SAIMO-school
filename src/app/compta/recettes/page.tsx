import type { Metadata } from "next";
import { ComptaShell } from "@/components/compta/ComptaShell";
import { RecettesManager } from "@/components/compta/RecettesManager";
import { PaiementsEnLigneAVerifier } from "@/components/compta/PaiementsEnLigneAVerifier";
import { listerRecettes, listerPaiementsEnLigneAVerifier } from "@/server/dal/compta";
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
  // listerFrais encaisse d'abord les paiements en ligne restés en attente :
  // les recettes et la liste « à vérifier » sont lues après.
  const frais = await listerFrais({});
  const [recettes, aVerifier] = await Promise.all([
    listerRecettes({ q: sp.q, mois: sp.mois }),
    listerPaiementsEnLigneAVerifier(),
  ]);

  return (
    <ComptaShell>
      <PaiementsEnLigneAVerifier lignes={aVerifier} />
      <RecettesManager recettes={recettes} frais={frais} />
    </ComptaShell>
  );
}
