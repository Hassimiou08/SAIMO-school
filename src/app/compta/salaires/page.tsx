import type { Metadata } from "next";
import { ComptaShell } from "@/components/compta/ComptaShell";
import { SalairesManager } from "@/components/compta/SalairesManager";
import { listerSalaires } from "@/server/dal/compta";

export const metadata: Metadata = {
  title: "Salaires & paie — Portail comptable SAIMO",
};

export default async function SalairesPage({
  searchParams,
}: {
  searchParams: Promise<{ mois?: string; q?: string }>;
}) {
  const sp = await searchParams;
  const data = await listerSalaires({ mois: sp.mois, q: sp.q });
  return (
    <ComptaShell>
      <SalairesManager data={data} />
    </ComptaShell>
  );
}
