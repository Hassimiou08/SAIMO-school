import type { Metadata } from "next";
import { EnseignantShell } from "@/components/enseignant/Shell";
import { MesEvaluationsManager } from "@/components/enseignant/MesEvaluationsManager";
import {
  mesEvaluations,
  mesClassesOptions,
  mesMatieresOptions,
} from "@/server/dal/enseignant";
import { listerPeriodes, listerTypesEvaluation } from "@/server/dal/evaluations";

export const metadata: Metadata = { title: "Mes notes — Enseignant SAIMO" };

export default async function MesNotesPage() {
  const [evaluations, classes, matieres, periodes, types] = await Promise.all([
    mesEvaluations(),
    mesClassesOptions(),
    mesMatieresOptions(),
    listerPeriodes(),
    listerTypesEvaluation(),
  ]);

  return (
    <EnseignantShell
      large
      titre="Mes notes"
      sous="Créez vos évaluations et saisissez les notes de vos classes."
    >
      <MesEvaluationsManager
        evaluations={evaluations}
        classes={classes}
        matieres={matieres}
        periodes={periodes}
        types={types}
      />
    </EnseignantShell>
  );
}
