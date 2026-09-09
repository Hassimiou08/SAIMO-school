import type { Metadata } from "next";
import { EnseignantShell } from "@/components/enseignant/Shell";
import { MonEmploiDuTemps } from "@/components/enseignant/MonEmploiDuTemps";
import { mesCreneaux } from "@/server/dal/enseignant";

export const metadata: Metadata = { title: "Emploi du temps — Enseignant SAIMO" };

export default async function EmploiDuTempsEnseignantPage() {
  const creneaux = await mesCreneaux();

  return (
    <EnseignantShell large titre="Mon emploi du temps" sous="Vos cours de la semaine.">
      <MonEmploiDuTemps creneaux={creneaux} />
    </EnseignantShell>
  );
}
