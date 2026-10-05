"use client";

import { useState } from "react";
import { useRouter } from "@/lib/offline/router";
import type { TableauGeneralDTO } from "@/server/dal/notes-tableau";

interface Opt {
  id: string;
  nom: string;
}

function couleurMoyenne(moyenne: number | null) {
  if (moyenne == null) return "text-neutral-300";
  if (moyenne >= 14) return "text-emerald-600";
  if (moyenne >= 10) return "text-blue-600";
  return "text-red-500";
}

export function TableauGeneralNotes({
  data,
  classes,
  periodes,
  filtreClasse,
  filtrePeriode,
  basePath,
  libelleClasseVide = "Choisir une classe",
}: {
  data: TableauGeneralDTO | null;
  classes: Opt[];
  periodes: Opt[];
  filtreClasse?: string;
  filtrePeriode?: string;
  basePath: string;
  libelleClasseVide?: string;
}) {
  const router = useRouter();
  const [celluleOuverte, setCelluleOuverte] = useState<string | null>(null);

  const nav = (k: string, v: string) => {
    const sp = new URLSearchParams(window.location.search);
    if (v) sp.set(k, v);
    else sp.delete(k);
    router.push(`${basePath}?${sp.toString()}`);
  };

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white">
      <div className="flex flex-wrap items-center gap-3 border-b border-neutral-100 p-5">
        <select
          value={filtreClasse ?? ""}
          onChange={(e) => nav("classe", e.target.value)}
          className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs font-medium text-neutral-700 outline-none focus:border-blue-400"
        >
          <option value="">{libelleClasseVide}</option>
          {classes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nom}
            </option>
          ))}
        </select>
        <select
          value={filtrePeriode ?? ""}
          onChange={(e) => nav("periode", e.target.value)}
          className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs font-medium text-neutral-700 outline-none focus:border-blue-400"
        >
          <option value="">Choisir une période</option>
          {periodes.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nom}
            </option>
          ))}
        </select>
        {data && (
          <span className="ml-auto text-xs font-medium text-neutral-500">
            {data.effectif} élève{data.effectif > 1 ? "s" : ""} · {data.classe} · {data.periode}
          </span>
        )}
      </div>

      {!data ? (
        <div className="px-6 py-16 text-center text-sm text-neutral-500">
          Sélectionnez une classe et une période pour afficher le tableau.
        </div>
      ) : data.lignes.length === 0 ? (
        <div className="px-6 py-16 text-center text-sm text-neutral-500">
          Aucun élève inscrit dans cette classe pour l&rsquo;année en cours.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-neutral-100 bg-neutral-50/50 text-xs uppercase text-neutral-500">
                <th className="sticky left-0 z-10 bg-neutral-50 px-5 py-3 whitespace-nowrap">Élève</th>
                {data.matieres.map((m) => (
                  <th key={m.id} className="px-4 py-3 text-center whitespace-nowrap">
                    {m.nom} <span className="text-neutral-400">(coef {m.coefficient})</span>
                  </th>
                ))}
                <th className="px-4 py-3 text-center whitespace-nowrap">Moyenne</th>
                <th className="px-4 py-3 text-center whitespace-nowrap">Rang</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {data.lignes.map((l) => (
                <tr key={l.eleveId} className="hover:bg-neutral-50/60">
                  <td className="sticky left-0 z-10 bg-white px-5 py-3 font-semibold text-neutral-900 whitespace-nowrap">
                    {l.prenom} {l.nom}
                  </td>
                  {data.matieres.map((m) => {
                    const cell = l.matieres[m.id];
                    const cle = `${l.eleveId}:${m.id}`;
                    const ouverte = celluleOuverte === cle;
                    return (
                      <td key={m.id} className="relative px-4 py-3 text-center">
                        <button
                          type="button"
                          onClick={() => cell.notes.length > 0 && setCelluleOuverte(ouverte ? null : cle)}
                          className={`font-bold ${couleurMoyenne(cell.moyenne)} ${
                            cell.notes.length > 0 ? "cursor-pointer underline decoration-dotted underline-offset-4" : "cursor-default"
                          }`}
                        >
                          {cell.moyenne != null ? cell.moyenne.toFixed(1) : "—"}
                        </button>
                        {cell.moyenne != null && cell.provisoire && (
                          <sup className="ml-0.5 text-[9px] font-semibold uppercase text-amber-600">prov.</sup>
                        )}
                        {ouverte && (
                          <div className="absolute left-1/2 top-full z-20 mt-1 w-60 -translate-x-1/2 rounded-xl border border-neutral-200 bg-white p-3 text-left text-xs shadow-lg">
                            <p className="mb-1.5 font-semibold text-neutral-700">{m.nom}</p>
                            <div className="space-y-1">
                              {cell.notes.map((n) => (
                                <div key={n.evaluationId} className="flex items-center justify-between gap-2">
                                  <span className="truncate text-neutral-500">
                                    {n.type}
                                    {n.date ? ` · ${n.date}` : ""}
                                  </span>
                                  <span className="shrink-0 font-semibold text-neutral-800">
                                    {n.absent ? "Absent" : n.dispense ? "Dispensé" : n.valeur != null ? `${n.valeur}/${n.noteMaximale}` : "—"}
                                  </span>
                                </div>
                              ))}
                            </div>
                            {cell.moyenneDevoirs != null && (
                              <div className="mt-2 border-t border-neutral-100 pt-1.5 text-neutral-500">
                                Devoirs {cell.moyenneDevoirs.toFixed(1)}/20
                                {cell.moyenneComposition != null
                                  ? ` ×2 + Compo ${cell.moyenneComposition.toFixed(1)}/20`
                                  : " (composition pas encore verrouillée)"}
                              </div>
                            )}
                          </div>
                        )}
                      </td>
                    );
                  })}
                  <td className="px-4 py-3 text-center font-bold text-neutral-900">
                    {l.moyenneGenerale != null ? l.moyenneGenerale.toFixed(2) : "—"}
                  </td>
                  <td className="px-4 py-3 text-center text-neutral-600">
                    {l.rang != null ? `${l.rang}/${data.effectif}` : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
