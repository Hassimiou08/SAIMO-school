"use client";

import { useState } from "react";
import { Plus, Tag, X } from "lucide-react";
import { remises as mockRemises } from "@/lib/mock-admin";
import { Sidebar } from "@/components/portal/Sidebar";
import { Topbar } from "@/components/portal/Topbar";

export default function RemisesPage() {
  const [data, setData] = useState(mockRemises);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRemise, setNewRemise] = useState({ eleve: "", classe: "", motif: "Excellence", montant: 500000 });

  const formatCurrency = (val: number) => new Intl.NumberFormat("fr-FR").format(val) + " GNF";

  return (
    <div className="min-h-screen bg-paper-100">
      <Sidebar />
      <div className="lg:pl-64">
        <Topbar />
        <main className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
          <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="font-display text-2xl font-bold tracking-tight text-navy-900">Remises & Bourses</h1>
              <p className="mt-1 text-sm text-ink-500">Gestion des aides financières appliquées aux élèves.</p>
            </div>
            <button onClick={() => setIsModalOpen(true)} className="inline-flex items-center gap-2 self-start rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-600/20 hover:bg-blue-700 transition">
              <Plus className="h-4 w-4" /> Nouvelle remise
            </button>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-neutral-100 bg-neutral-50/50 text-xs uppercase tracking-wide text-neutral-500">
                  <th className="px-5 py-3.5 font-semibold">Élève</th>
                  <th className="px-5 py-3.5 font-semibold">Motif</th>
                  <th className="px-5 py-3.5 font-semibold">Montant réduit</th>
                  <th className="px-5 py-3.5 font-semibold">Accordé par</th>
                  <th className="px-5 py-3.5 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-neutral-200">
                {data.map(r => (
                  <tr key={r.id} className="hover:bg-blue-50/40 transition">
                    <td className="px-5 py-3.5">
                      <p className="text-sm font-semibold text-neutral-800">{r.eleve}</p>
                      <p className="text-xs text-neutral-500">{r.classe}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center gap-1.5 rounded-lg bg-orange-50 px-2.5 py-1 text-xs font-medium text-orange-700">
                        <Tag className="h-3 w-3" /> {r.motif}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-mono text-sm font-bold text-green-600">-{formatCurrency(r.montant)}</td>
                    <td className="px-5 py-3.5 text-xs text-neutral-600">{r.accordePar}</td>
                    <td className="px-5 py-3.5 text-xs text-neutral-400">{new Date(r.date).toLocaleDateString("fr-FR")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/50 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-neutral-900">Ajouter une remise</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-neutral-400 hover:text-neutral-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-neutral-700">Nom de l'élève</label>
                  <input type="text" value={newRemise.eleve} onChange={e => setNewRemise({...newRemise, eleve: e.target.value})} placeholder="Ex: Aïcha Sylla" className="mt-1 w-full rounded-xl border border-neutral-200 px-4 py-2 text-sm outline-none focus:border-blue-400" />
                </div>
                <div>
                  <label className="text-sm font-medium text-neutral-700">Classe</label>
                  <input type="text" value={newRemise.classe} onChange={e => setNewRemise({...newRemise, classe: e.target.value})} placeholder="Ex: 6ème A" className="mt-1 w-full rounded-xl border border-neutral-200 px-4 py-2 text-sm outline-none focus:border-blue-400" />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-neutral-700">Motif de la remise</label>
                <input type="text" value={newRemise.motif} onChange={e => setNewRemise({...newRemise, motif: e.target.value})} placeholder="Ex: Excellence académique, Cas social..." className="mt-1 w-full rounded-xl border border-neutral-200 px-4 py-2 text-sm outline-none focus:border-blue-400" />
              </div>
              
              <div>
                <label className="text-sm font-medium text-neutral-700">Montant (GNF)</label>
                <input type="number" value={newRemise.montant} onChange={e => setNewRemise({...newRemise, montant: parseInt(e.target.value)})} className="mt-1 w-full rounded-xl border border-neutral-200 px-4 py-2 text-sm outline-none focus:border-blue-400" />
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button onClick={() => setIsModalOpen(false)} className="rounded-xl px-4 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-100">Annuler</button>
                <button
                  onClick={() => {
                    setData([{
                      id: Date.now().toString(),
                      eleve: newRemise.eleve,
                      classe: newRemise.classe,
                      motif: newRemise.motif,
                      montant: newRemise.montant,
                      accordePar: "Directeur Général",
                      date: new Date().toISOString()
                    }, ...data]);
                    setIsModalOpen(false);
                    setNewRemise({ eleve: "", classe: "", motif: "Excellence", montant: 500000 });
                  }}
                  className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700"
                >
                  Appliquer la remise
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
