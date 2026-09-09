import type { Metadata } from "next";
import { ComptaShell } from "@/components/compta/ComptaShell";
import { DepensesManager } from "@/components/compta/DepensesManager";
import { listerDepenses } from "@/server/dal/compta";

export const metadata: Metadata = {
  title: "Dépenses — Portail comptable SAIMO",
};

export default async function DepensesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; statut?: string }>;
}) {
  const sp = await searchParams;
  const depenses = await listerDepenses({ q: sp.q, statut: sp.statut });
  return (
    <ComptaShell>
      <DepensesManager depenses={depenses} />
    </ComptaShell>
  );
}
