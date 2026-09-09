import type { Metadata } from "next";
import { EnseignantShell } from "@/components/enseignant/Shell";
import { AbsencesManager } from "@/components/portal/AbsencesManager";
import { mesAbsences, mesElevesParClasse, mesClassesOptions } from "@/server/dal/enseignant";

export const metadata: Metadata = { title: "Absences — Enseignant SAIMO" };

export default async function AbsencesEnseignantPage() {
  const [absences, eleves, classes] = await Promise.all([
    mesAbsences(),
    mesElevesParClasse(),
    mesClassesOptions(),
  ]);

  const stats = {
    total: absences.length,
    justifiees: absences.filter((a) => a.justifie).length,
    nonJustifiees: absences.filter((a) => !a.justifie).length,
  };

  return (
    <EnseignantShell
      large
      titre="Absences & retards"
      sous="Saisissez les absences de vos classes. La justification est gérée par l'administration."
    >
      <AbsencesManager
        absences={absences}
        stats={stats}
        classes={classes}
        eleves={eleves}
        peutJustifier={false}
      />
    </EnseignantShell>
  );
}
