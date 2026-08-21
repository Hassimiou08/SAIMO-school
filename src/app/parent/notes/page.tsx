"use client";

import { TrendingUp, Award } from "lucide-react";
import { ParentSidebar } from "@/components/parent/ParentSidebar";
import { ParentTopbar } from "@/components/parent/ParentTopbar";
import { notesParent, enfantsList } from "@/lib/mock-parent";
import { useSearchParams } from "next/navigation";

export default function NotesParentPage() {
  const searchParams = useSearchParams();
  const enfantId = searchParams.get("enfant") || "e1";
  const enfantInfo = enfantsList.find(e => e.id === enfantId) || enfantsList[0];
  const moyenneGenerale =
    notesParent.reduce((acc, n) => acc + (n.moyenne ?? 0) * n.coefficient, 0) /
    notesParent.reduce((acc, n) => acc + n.coefficient, 0);

  const totalCoef = notesParent.reduce((acc, n) => acc + n.coefficient, 0);

  return (
    <div className="min-h-screen bg-neutral-50">
      <ParentSidebar />
      <div className="lg:pl-64">
        <ParentTopbar />
        <main className="mx-auto max-w-5xl px-6 py-8 lg:px-10">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="font-display text-2xl font-bold tracking-tight text-neutral-900">Notes &amp; Resultats</h1>
              <p className="mt-1 text-sm text-neutral-500">{enfantInfo.nom} &bull; {enfantInfo.classe} &bull; {enfantInfo.anneeScolaire}</p>
            </div>
            <div className="flex items-center gap-3 rounded-2xl bg-emerald-50 border border-emerald-200 px-5 py-3">
              <TrendingUp className="h-5 w-5 text-emerald-600" />
              <div>
                <p className="text-xs text-emerald-600 font-medium">Moyenne generale</p>
                <p className="text-xl font-bold text-emerald-700">{moyenneGenerale.toFixed(2)}<span className="text-sm font-medium">/20</span></p>
              </div>
            </div>
          </div>

          {/* Tableau des notes */}
          <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm overflow-hidden mb-6">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-neutral-100 bg-neutral-50/50 text-xs uppercase tracking-wide text-neutral-500">
                  <th className="px-6 py-4 font-semibold">Matiere</th>
                  <th className="px-6 py-4 font-semibold text-center">Coef.</th>
                  <th className="px-6 py-4 font-semibold text-center">Devoir 1</th>
                  <th className="px-6 py-4 font-semibold text-center">Devoir 2</th>
                  <th className="px-6 py-4 font-semibold text-center">Moyenne</th>
                  <th className="px-6 py-4 font-semibold">Appreciation</th>
                  <th className="px-6 py-4 font-semibold">Progression</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {notesParent.map(n => {
                  const moy = n.moyenne ?? 0;
                  const color = moy >= 14 ? "text-emerald-600" : moy >= 10 ? "text-blue-600" : "text-red-500";
                  const bgBar = moy >= 14 ? "bg-emerald-500" : moy >= 10 ? "bg-blue-500" : "bg-red-400";
                  return (
                    <tr key={n.id} className="hover:bg-neutral-50 transition">
                      <td className="px-6 py-4">
                        <p className="text-sm font-semibold text-neutral-900">{n.matiere}</p>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="rounded-lg bg-neutral-100 px-2 py-1 text-xs font-bold text-neutral-600">{n.coefficient}</span>
                      </td>
                      <td className="px-6 py-4 text-center font-mono text-sm">{n.note1 ?? "-"}</td>
                      <td className="px-6 py-4 text-center font-mono text-sm">{n.note2 ?? "-"}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`text-base font-bold ${color}`}>{moy.toFixed(1)}</span>
                        <span className="text-xs text-neutral-400">/20</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-semibold rounded-full px-2.5 py-1 ${
                          moy >= 14 ? "bg-emerald-100 text-emerald-700" :
                          moy >= 10 ? "bg-blue-100 text-blue-700" :
                          "bg-red-100 text-red-700"
                        }`}>{n.appreciation}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="w-28 h-2 bg-neutral-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${bgBar}`} style={{ width: `${(moy / 20) * 100}%` }} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot className="border-t-2 border-neutral-200 bg-neutral-50">
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-sm font-bold text-neutral-700">
                    Moyenne Generale (sur {totalCoef} points de coef.)
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-emerald-600" />
                      <span className="text-lg font-bold text-emerald-600">{moyenneGenerale.toFixed(2)}/20</span>
                    </div>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}
