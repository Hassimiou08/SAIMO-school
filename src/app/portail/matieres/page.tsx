"use client";

import { useState } from "react";
import { Search, Plus, Pencil, CheckCircle, XCircle, X } from "lucide-react";
import { matieres as mockMatieres } from "@/lib/mock-admin";
import { Sidebar } from "@/components/portal/Sidebar";
import { Topbar } from "@/components/portal/Topbar";

export default function MatieresPage() {
  const [data, setData] = useState(mockMatieres);
  const [query, setQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newMatiere, setNewMatiere] = useState({ nom: "", code: "", coefficient: 2, niveaux: ["6ème"] });

  const filtered = data.filter(m => m.nom.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="min-h-screen bg-paper-100">
      <Sidebar />
      <div className="lg:pl-64">
        <Topbar />
        <main className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
          <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="font-display text-2xl font-bold tracking-tight text-navy-900">Matières</h1>
              <p className="mt-1 text-sm text-ink-500">Gestion des matières enseignées et de leurs coefficients par niveau.</p>
            </div>
            <button onClick={() => setIsModalOpen(true)} className="inline-flex items-center gap-2 self-start rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-600/20 hover:bg-blue-700 transition">
              <Plus className="h-4 w-4" /> Nouvelle matière
            </button>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm">
            <div className="border-b border-neutral-100 p-5">
              <div className="relative max-w-xs">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                <input type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Rechercher une matière..." className="w-full rounded-xl border border-neutral-200 bg-neutral-50 py-2.5 pl-9 pr-3.5 text-xs outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-neutral-100 bg-neutral-50/50 text-xs uppercase tracking-wide text-neutral-500">
                    <th className="px-5 py-3.5 font-semibold">Matière</th>
                    <th className="px-5 py-3.5 font-semibold">Code</th>
                    <th className="px-5 py-3.5 font-semibold">Coefficient</th>
                    <th className="px-5 py-3.5 font-semibold">Niveaux concernés</th>
                    <th className="px-5 py-3.5 font-semibold">Statut</th>
                    <th className="px-5 py-3.5 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-neutral-200">
                  {filtered.map(m => (
                    <tr key={m.id} className="hover:bg-blue-50/40 transition">
                      <td className="px-5 py-3.5 text-sm font-semibold text-neutral-800">{m.nom}</td>
                      <td className="px-5 py-3.5 font-mono text-xs text-neutral-500">{m.code}</td>
                      <td className="px-5 py-3.5">
                        <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100 text-xs font-bold text-blue-700">{m.coefficient}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex flex-wrap gap-1">
                          {m.niveaux.map(n => (
                            <span key={n} className="rounded-md bg-neutral-100 px-2 py-0.5 text-[11px] font-medium text-neutral-600">{n}</span>
                          ))}
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        {m.actif
                          ? <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-2.5 py-1 text-[11px] font-semibold text-green-700"><CheckCircle className="h-3 w-3" />Active</span>
                          : <span className="inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-2.5 py-1 text-[11px] font-semibold text-neutral-500"><XCircle className="h-3 w-3" />Inactive</span>
                        }
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <button className="inline-flex items-center justify-center rounded-lg bg-neutral-100 p-2 text-neutral-500 hover:bg-blue-100 hover:text-blue-600 transition">
                          <Pencil className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/50 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-neutral-900">Nouvelle Matière</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-neutral-400 hover:text-neutral-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-neutral-700">Nom de la matière</label>
                <input type="text" value={newMatiere.nom} onChange={e => setNewMatiere({...newMatiere, nom: e.target.value})} placeholder="Ex: Mathématiques" className="mt-1 w-full rounded-xl border border-neutral-200 px-4 py-2 text-sm outline-none focus:border-blue-400" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-neutral-700">Code</label>
                  <input type="text" value={newMatiere.code} onChange={e => setNewMatiere({...newMatiere, code: e.target.value})} placeholder="Ex: MATH" className="mt-1 w-full rounded-xl border border-neutral-200 px-4 py-2 text-sm outline-none focus:border-blue-400" />
                </div>
                <div>
                  <label className="text-sm font-medium text-neutral-700">Coefficient</label>
                  <input type="number" value={newMatiere.coefficient} onChange={e => setNewMatiere({...newMatiere, coefficient: parseInt(e.target.value)})} className="mt-1 w-full rounded-xl border border-neutral-200 px-4 py-2 text-sm outline-none" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-neutral-700">Niveaux</label>
                <input type="text" value={newMatiere.niveaux.join(", ")} onChange={e => setNewMatiere({...newMatiere, niveaux: e.target.value.split(",").map(n=>n.trim())})} placeholder="Ex: 6ème, 5ème" className="mt-1 w-full rounded-xl border border-neutral-200 px-4 py-2 text-sm outline-none focus:border-blue-400" />
                <p className="text-xs text-neutral-400 mt-1">Séparés par des virgules</p>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button onClick={() => setIsModalOpen(false)} className="rounded-xl px-4 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-100">Annuler</button>
                <button
                  onClick={() => {
                    setData([{
                      id: Date.now().toString(),
                      nom: newMatiere.nom,
                      code: newMatiere.code,
                      coefficient: newMatiere.coefficient,
                      niveaux: newMatiere.niveaux,
                      actif: true
                    }, ...data]);
                    setIsModalOpen(false);
                    setNewMatiere({ nom: "", code: "", coefficient: 2, niveaux: ["6ème"] });
                  }}
                  className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700"
                >
                  Ajouter
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
