import { TrendingUp, Award } from "lucide-react";
import { ParentShell, AucunEnfant } from "@/components/parent/ParentShell";
import { resoudreEnfant, getNotesEnfant } from "@/server/dal/parent";

export const metadata = { title: "Notes — Espace Parent SAIMO" };

export default async function NotesParentPage({
  searchParams,
}: {
  searchParams: Promise<{ enfant?: string }>;
}) {
  const sp = await searchParams;
  const enfant = await resoudreEnfant(sp.enfant);
  if (!enfant) return <AucunEnfant />;

  const { periode, matieres, moyenneGenerale, totalCoef } = await getNotesEnfant(enfant.id);

  return (
    <ParentShell>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-neutral-900">
            Notes &amp; résultats
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            {enfant.nomComplet} &bull; {enfant.classe}
            {periode ? ` · ${periode}` : ""}
          </p>
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-3">
          <TrendingUp className="h-5 w-5 text-emerald-600" />
          <div>
            <p className="text-xs font-medium text-emerald-600">Moyenne générale</p>
            <p className="text-xl font-bold text-emerald-700">
              {moyenneGenerale != null ? moyenneGenerale.toFixed(2) : "—"}
              <span className="text-sm font-medium">/20</span>
            </p>
          </div>
        </div>
      </div>

      <div className="mb-6 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-neutral-100 bg-neutral-50/50 text-xs uppercase tracking-wide text-neutral-500">
              <th className="px-6 py-4 font-semibold">Matière</th>
              <th className="px-6 py-4 text-center font-semibold">Coef.</th>
              <th className="px-6 py-4 text-center font-semibold">Notes /20</th>
              <th className="px-6 py-4 text-center font-semibold">Moyenne</th>
              <th className="px-6 py-4 font-semibold">Progression</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {matieres.map((n) => {
              const moy = n.moyenne ?? 0;
              const color = moy >= 14 ? "text-emerald-600" : moy >= 10 ? "text-blue-600" : "text-red-500";
              const bar = moy >= 14 ? "bg-emerald-500" : moy >= 10 ? "bg-blue-500" : "bg-red-400";
              return (
                <tr key={n.matiere} className="transition hover:bg-neutral-50">
                  <td className="px-6 py-4 text-sm font-semibold text-neutral-900">{n.matiere}</td>
                  <td className="px-6 py-4 text-center">
                    <span className="rounded-lg bg-neutral-100 px-2 py-1 text-xs font-bold text-neutral-600">
                      {n.coefficient}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center font-mono text-sm text-neutral-600">
                    {n.notes.length ? n.notes.map((v) => v.toFixed(1)).join(" · ") : "—"}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`text-base font-bold ${color}`}>
                      {n.moyenne != null ? n.moyenne.toFixed(1) : "—"}
                    </span>
                    <span className="text-xs text-neutral-400">/20</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-2 w-28 overflow-hidden rounded-full bg-neutral-100">
                      <div className={`h-full rounded-full ${bar}`} style={{ width: `${(moy / 20) * 100}%` }} />
                    </div>
                  </td>
                </tr>
              );
            })}
            {matieres.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-sm text-neutral-500">
                  Aucune note verrouillée pour la période en cours.
                </td>
              </tr>
            )}
          </tbody>
          {matieres.length > 0 && (
            <tfoot className="border-t-2 border-neutral-200 bg-neutral-50">
              <tr>
                <td colSpan={3} className="px-6 py-4 text-sm font-bold text-neutral-700">
                  Moyenne générale (total coef. {totalCoef})
                </td>
                <td colSpan={2} className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-emerald-600" />
                    <span className="text-lg font-bold text-emerald-600">
                      {moyenneGenerale != null ? moyenneGenerale.toFixed(2) : "—"}/20
                    </span>
                  </div>
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </ParentShell>
  );
}
