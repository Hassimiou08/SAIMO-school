import type { Metadata } from "next";
import { ComptaShell } from "@/components/compta/ComptaShell";
import { ComptaDashboard } from "@/components/compta/ComptaDashboard";
import { getTableauBordCompta } from "@/server/dal/compta";

export const metadata: Metadata = {
  title: "Tableau de bord — Portail comptable SAIMO",
};

export default async function ComptaDashboardPage() {
  const data = await getTableauBordCompta();
  return (
    <ComptaShell>
      <ComptaDashboard data={data} />
    </ComptaShell>
  );
}
