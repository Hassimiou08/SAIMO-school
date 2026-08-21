"use client";

import { useState } from "react";
import { Plus, Layers, ChevronRight, X } from "lucide-react";
import { cycles as mockCycles } from "@/lib/mock-admin";
import { Sidebar } from "@/components/portal/Sidebar";
import { Topbar } from "@/components/portal/Topbar";

export default function CyclesPage() {
  const [data, setData] = useState(mockCycles);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCycle, setNewCycle] = useState({ nom: "", ordre: 4 });
  
  const [isNiveauModalOpen, setIsNiveauModalOpen] = useState(false);
  const [selectedCycleId, setSelectedCycleId] = useState<string | null>(null);
  const [newNiveau, setNewNiveau] = useState({ nom: "", ordre: 1 });

  return (
    <div className="min-h-screen bg-paper-100">
      <Sidebar />
      <div className="lg:pl-64">
        <Topbar />
        <main className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
          <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="font-display text-2xl font-bold tracking-tight text-navy-900">Cycles & Niveaux</h1>
              <p className="mt-1 text-sm text-ink-500">Structure académique de l'établissement.</p>
            </div>
            <button onClick={() => setIsModalOpen(true)} className="inline-flex items-center gap-2 self-start rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-600/20 hover:bg-blue-700 transition">
              <Plus className="h-4 w-4" /> Ajouter un cycle
            </button>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {data.map(cycle => (
              <div key={cycle.id} className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-neutral-100">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <Layers className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="font-bold text-neutral-900">{cycle.nom}</h2>
                      <p className="text-xs text-neutral-500">Ordre : {cycle.ordre}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Niveaux rattachés</p>
                  <ul className="space-y-1">
                    {cycle.niveaux.map(niveau => (
                      <li key={niveau.id} className="flex items-center justify-between rounded-lg bg-neutral-50 px-3 py-2">
                        <span className="text-sm font-medium text-neutral-700">{niveau.nom}</span>
                        <ChevronRight className="h-4 w-4 text-neutral-400" />
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => {
                      setSelectedCycleId(cycle.id);
                      setNewNiveau({ nom: "", ordre: cycle.niveaux.length + 1 });
                      setIsNiveauModalOpen(true);
                    }}
                    className="mt-2 w-full rounded-lg border border-dashed border-neutral-300 py-2 text-xs font-medium text-neutral-500 hover:bg-neutral-50 hover:text-neutral-700 transition"
                  >
                    + Ajouter un niveau
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/50 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-neutral-900">Nouveau Cycle</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-neutral-400 hover:text-neutral-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-neutral-700">Nom du cycle</label>
                <input type="text" value={newCycle.nom} onChange={e => setNewCycle({...newCycle, nom: e.target.value})} placeholder="Ex: Université" className="mt-1 w-full rounded-xl border border-neutral-200 px-4 py-2 text-sm outline-none focus:border-blue-400" />
              </div>
              <div>
                <label className="text-sm font-medium text-neutral-700">Ordre d'affichage</label>
                <input type="number" value={newCycle.ordre} onChange={e => setNewCycle({...newCycle, ordre: parseInt(e.target.value)})} className="mt-1 w-full rounded-xl border border-neutral-200 px-4 py-2 text-sm outline-none focus:border-blue-400" />
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button onClick={() => setIsModalOpen(false)} className="rounded-xl px-4 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-100">Annuler</button>
                <button
                  onClick={() => {
                    setData([...data, {
                      id: Date.now().toString(),
                      nom: newCycle.nom,
                      ordre: newCycle.ordre,
                      niveaux: []
                    }]);
                    setIsModalOpen(false);
                    setNewCycle({ nom: "", ordre: data.length + 1 });
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

      {/* MODALE AJOUT NIVEAU */}
      {isNiveauModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/50 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-neutral-900">Ajouter un Niveau</h3>
              <button onClick={() => setIsNiveauModalOpen(false)} className="text-neutral-400 hover:text-neutral-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-neutral-700">Nom du niveau</label>
                <input type="text" value={newNiveau.nom} onChange={e => setNewNiveau({...newNiveau, nom: e.target.value})} placeholder="Ex: Licence 1" className="mt-1 w-full rounded-xl border border-neutral-200 px-4 py-2 text-sm outline-none focus:border-blue-400" />
              </div>
              <div>
                <label className="text-sm font-medium text-neutral-700">Ordre d'affichage</label>
                <input type="number" value={newNiveau.ordre} onChange={e => setNewNiveau({...newNiveau, ordre: parseInt(e.target.value)})} className="mt-1 w-full rounded-xl border border-neutral-200 px-4 py-2 text-sm outline-none focus:border-blue-400" />
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button onClick={() => setIsNiveauModalOpen(false)} className="rounded-xl px-4 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-100">Annuler</button>
                <button
                  onClick={() => {
                    setData(data.map(c => {
                      if (c.id === selectedCycleId) {
                        return {
                          ...c,
                          niveaux: [...c.niveaux, { id: Date.now().toString(), nom: newNiveau.nom, ordre: newNiveau.ordre }]
                        };
                      }
                      return c;
                    }));
                    setIsNiveauModalOpen(false);
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
