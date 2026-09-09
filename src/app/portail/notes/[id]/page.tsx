import { Sidebar } from "@/components/portal/Sidebar";
import { Topbar } from "@/components/portal/Topbar";
import { SaisieNotesGrid } from "@/components/portal/SaisieNotesGrid";
import { getEvaluationSaisie } from "@/server/dal/evaluations";

export default async function SaisieNotesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const evaluation = await getEvaluationSaisie(id);

  return (
    <div className="min-h-screen bg-paper-100">
      <Sidebar />
      <div className="lg:pl-64">
        <Topbar />
        <main className="mx-auto max-w-5xl px-6 py-8 lg:px-10">
          <SaisieNotesGrid evaluation={evaluation} />
        </main>
      </div>
    </div>
  );
}
