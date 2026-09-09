import { CheckCircle, XCircle } from "lucide-react";
import { ParentShell, AucunEnfant } from "@/components/parent/ParentShell";
import { resoudreEnfant, getAbsencesEnfant } from "@/server/dal/parent";

export const metadata = { title: "Absences — Espace Parent SAIMO" };

export default async function AbsencesParentPage({
  searchParams,
}: {
  searchParams: Promise<{ enfant?: string }>;
}) {
  const sp = await searchParams;
  const enfant = await resoudreEnfant(sp.enfant);
  if (!enfant) return <AucunEnfant />;

  const absences = await getAbsencesEnfant(enfant.id);
  const nj = absences.filter((a) => !a.justifiee).length;
  const justifiees = absences.length - nj;

  return (
    <ParentShell>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold tracking-tight text-neutral-900">Absences</h1>
        <p className="mt-1 text-sm text-neutral-500">
          {enfant.nomComplet} &bull; {enfant.classe}
        </p>
      </div>

      <div className="mb-8 grid grid-cols-3 gap-4">
        <div className="rounded-2xl border border-neutral-200 bg-white p-5 text-center shadow-sm">
          <p className="text-3xl font-bold text-neutral-900">{absences.length}</p>
          <p className="mt-1 text-xs font-medium text-neutral-500">Total</p>
        </div>
        <div className="rounded-2xl border border-green-200 bg-green-50 p-5 text-center shadow-sm">
          <p className="text-3xl font-bold text-green-700">{justifiees}</p>
          <p className="mt-1 text-xs font-medium text-green-600">Justifiées</p>
        </div>
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-center shadow-sm">
          <p className="text-3xl font-bold text-red-700">{nj}</p>
          <p className="mt-1 text-xs font-medium text-red-600">Non justifiées</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-neutral-100 bg-neutral-50/50 text-xs uppercase tracking-wide text-neutral-500">
              <th className="px-6 py-4 font-semibold">Date</th>
              <th className="px-6 py-4 font-semibold">Type</th>
              <th className="px-6 py-4 font-semibold">Statut</th>
              <th className="px-6 py-4 font-semibold">Motif</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {absences.map((a) => (
              <tr key={a.id} className={`transition hover:bg-neutral-50 ${!a.justifiee ? "bg-red-50/30" : ""}`}>
                <td className="px-6 py-4 text-sm font-medium text-neutral-700">{a.date}</td>
                <td className="px-6 py-4 text-sm font-semibold text-neutral-900">{a.statut}</td>
                <td className="px-6 py-4">
                  {a.justifiee ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-2.5 py-1 text-xs font-bold text-green-700">
                      <CheckCircle className="h-3 w-3" /> Justifiée
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-2.5 py-1 text-xs font-bold text-red-700">
                      <XCircle className="h-3 w-3" /> Non justifiée
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-neutral-500">{a.motif}</td>
              </tr>
            ))}
            {absences.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-sm text-neutral-500">
                  Aucune absence enregistrée. 🎉
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </ParentShell>
  );
}
