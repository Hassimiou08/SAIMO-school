"use client";

import { Award, Download, Eye } from "lucide-react";
import { ParentSidebar } from "@/components/parent/ParentSidebar";
import { ParentTopbar } from "@/components/parent/ParentTopbar";
import { bulletinsParent, enfantsList, notesParent } from "@/lib/mock-parent";
import { useSearchParams } from "next/navigation";

export default function BulletinsParentPage() {
  const searchParams = useSearchParams();
  const enfantId = searchParams.get("enfant") || "e1";
  const enfantInfo = enfantsList.find(e => e.id === enfantId) || enfantsList[0];
  return (
    <div className="min-h-screen bg-neutral-50">
      <ParentSidebar />
      <div className="lg:pl-64">
        <ParentTopbar />
        <main className="mx-auto max-w-5xl px-6 py-8 lg:px-10">
          <div className="mb-8">
            <h1 className="font-display text-2xl font-bold tracking-tight text-neutral-900">Bulletins Scolaires</h1>
            <p className="mt-1 text-sm text-neutral-500">{enfantInfo.nom} &bull; {enfantInfo.classe}</p>
          </div>

          <div className="grid gap-6">
            {bulletinsParent.map(b => (
              <div key={b.id} className="rounded-2xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
                {/* En-tete */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-100 bg-gradient-to-r from-emerald-50 to-teal-50">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white">
                      <Award className="h-6 w-6" />
                    </div>
                    <div>
                      <h2 className="font-bold text-neutral-900">{b.trimestre} &mdash; {b.annee}</h2>
                      <p className="text-sm text-neutral-500">Emis le {new Date(b.dateEmission).toLocaleDateString("fr-FR")}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-700 shadow-sm hover:bg-neutral-50 transition">
                      <Eye className="h-4 w-4" /> Consulter
                    </button>
                    <button className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition">
                      <Download className="h-4 w-4" /> Telecharger
                    </button>
                  </div>
                </div>

                {/* Stats du bulletin */}
                <div className="grid grid-cols-3 divide-x divide-neutral-100 p-0">
                  <div className="px-6 py-5 text-center">
                    <p className="text-xs font-medium text-neutral-500 mb-1">Moyenne Generale</p>
                    <p className={`text-2xl font-bold ${b.moyenneGenerale >= 14 ? "text-emerald-600" : "text-blue-600"}`}>
                      {b.moyenneGenerale.toFixed(1)}<span className="text-sm text-neutral-400">/20</span>
                    </p>
                  </div>
                  <div className="px-6 py-5 text-center">
                    <p className="text-xs font-medium text-neutral-500 mb-1">Rang</p>
                    <p className="text-2xl font-bold text-neutral-900">
                      {b.rang}<span className="text-sm text-neutral-400">/{b.totalEleves}</span>
                    </p>
                  </div>
                  <div className="px-6 py-5 text-center">
                    <p className="text-xs font-medium text-neutral-500 mb-1">Mention</p>
                    <span className={`inline-block rounded-full px-3 py-1 text-sm font-bold ${
                      b.mention === "Tres bien" ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"
                    }`}>
                      {b.mention}
                    </span>
                  </div>
                </div>

                {/* Tableau des notes integre */}
                <div className="border-t border-neutral-100">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="bg-neutral-50/50 text-xs uppercase tracking-wide text-neutral-400">
                        <th className="px-6 py-3 font-semibold">Matiere</th>
                        <th className="px-6 py-3 font-semibold text-center">Coef.</th>
                        <th className="px-6 py-3 font-semibold text-center">Moyenne</th>
                        <th className="px-6 py-3 font-semibold">Appreciation</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-50">
                      {notesParent.map(n => (
                        <tr key={n.id} className="hover:bg-neutral-50/50">
                          <td className="px-6 py-2.5 font-medium text-neutral-800">{n.matiere}</td>
                          <td className="px-6 py-2.5 text-center text-neutral-500">{n.coefficient}</td>
                          <td className="px-6 py-2.5 text-center font-bold font-mono">
                            <span className={n.moyenne && n.moyenne >= 10 ? "text-emerald-600" : "text-red-500"}>
                              {n.moyenne?.toFixed(1) ?? "-"}
                            </span>
                          </td>
                          <td className="px-6 py-2.5 text-neutral-500 text-xs">{n.appreciation}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
