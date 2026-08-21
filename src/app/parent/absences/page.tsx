"use client";

import { CheckCircle, XCircle } from "lucide-react";
import { ParentSidebar } from "@/components/parent/ParentSidebar";
import { ParentTopbar } from "@/components/parent/ParentTopbar";
import { absencesParent, enfantsList } from "@/lib/mock-parent";
import { useSearchParams } from "next/navigation";

export default function AbsencesParentPage() {
  const searchParams = useSearchParams();
  const enfantId = searchParams.get("enfant") || "e1";
  const enfantInfo = enfantsList.find(e => e.id === enfantId) || enfantsList[0];
  const nj = absencesParent.filter(a => !a.justifiee).length;
  const justifiees = absencesParent.filter(a => a.justifiee).length;

  return (
    <div className="min-h-screen bg-neutral-50">
      <ParentSidebar />
      <div className="lg:pl-64">
        <ParentTopbar />
        <main className="mx-auto max-w-5xl px-6 py-8 lg:px-10">
          <div className="mb-8">
            <h1 className="font-display text-2xl font-bold tracking-tight text-neutral-900">Absences</h1>
            <p className="mt-1 text-sm text-neutral-500">{enfantInfo.nom} &bull; {enfantInfo.classe}</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm text-center">
              <p className="text-3xl font-bold text-neutral-900">{absencesParent.length}</p>
              <p className="text-xs font-medium text-neutral-500 mt-1">Total absences</p>
            </div>
            <div className="rounded-2xl border border-green-200 bg-green-50 p-5 shadow-sm text-center">
              <p className="text-3xl font-bold text-green-700">{justifiees}</p>
              <p className="text-xs font-medium text-green-600 mt-1">Justifiees</p>
            </div>
            <div className="rounded-2xl border border-red-200 bg-red-50 p-5 shadow-sm text-center">
              <p className="text-3xl font-bold text-red-700">{nj}</p>
              <p className="text-xs font-medium text-red-600 mt-1">Non justifiees</p>
            </div>
          </div>

          {/* Tableau */}
          <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-neutral-100 bg-neutral-50/50 text-xs uppercase tracking-wide text-neutral-500">
                  <th className="px-6 py-4 font-semibold">Date</th>
                  <th className="px-6 py-4 font-semibold">Matiere</th>
                  <th className="px-6 py-4 font-semibold">Duree</th>
                  <th className="px-6 py-4 font-semibold">Statut</th>
                  <th className="px-6 py-4 font-semibold">Motif</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {absencesParent.map(a => (
                  <tr key={a.id} className={`hover:bg-neutral-50 transition ${!a.justifiee ? "bg-red-50/30" : ""}`}>
                    <td className="px-6 py-4 text-sm font-medium text-neutral-700">
                      {new Date(a.date).toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "long" })}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-neutral-900">{a.matiere}</td>
                    <td className="px-6 py-4 text-sm text-neutral-600">{a.duree}</td>
                    <td className="px-6 py-4">
                      {a.justifiee ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-2.5 py-1 text-xs font-bold text-green-700">
                          <CheckCircle className="h-3 w-3" /> Justifiee
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-2.5 py-1 text-xs font-bold text-red-700">
                          <XCircle className="h-3 w-3" /> Non justifiee
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-500">{a.motif}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}
