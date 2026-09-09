import { notFound } from "next/navigation";
import { EnseignantShell } from "@/components/enseignant/Shell";
import { SaisieNotesGrid } from "@/components/portal/SaisieNotesGrid";
import { getEvaluationSaisie } from "@/server/dal/evaluations";
import { evaluationEstAMoi } from "@/server/dal/enseignant";

export default async function SaisieNotesEnseignantPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!(await evaluationEstAMoi(id))) notFound();
  const evaluation = await getEvaluationSaisie(id);

  return (
    <EnseignantShell large>
      <SaisieNotesGrid
        evaluation={evaluation}
        retour="/enseignant/notes"
        peutDeverrouiller={false}
      />
    </EnseignantShell>
  );
}
