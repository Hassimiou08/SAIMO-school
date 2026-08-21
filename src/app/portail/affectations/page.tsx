"use client";

import { useState } from "react";
import { Plus, Star, X } from "lucide-react";
import { affectations as mockAffectations } from "@/lib/mock-admin";
import { Sidebar } from "@/components/portal/Sidebar";
import { Topbar } from "@/components/portal/Topbar";

export default function AffectationsPage() {
  const [data, setData] = useState(mockAffectations);
  const [classe, setClasse] = useState("Toutes");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAffect, setNewAffect] = useState({ enseignant: "", specialite: "", classe: "", matiere: "", profPrincipal: false, annee: "2026-2027" });

  const classes = ["Toutes", ...Array.from(new Set(data.map(a => a.classe)))];
  const filtered = classe === "Toutes" ? data : data.filter(a => a.classe === classe);

  return (
    <div className="min-h-screen bg-paper-100">
      <Sidebar />
      <div className="lg:pl-64">
        <Topbar />
        <main className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
          <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="font-display text-2xl font-bold tracking-tight text-navy-900">Affectations</h1>
              <p className="mt-1 text-sm text-ink-500">Attribution des enseignants aux classes et matières pour l'année en cours.</p>
            </div>
            <div className="flex items-center gap-3">
              <select value={classe} onChange={e => setClasse(e.target.value)} className="rounded-xl border border-neutral-200 bg-white py-2.5 px-4 text-sm outline-none">
                {classes.map(c => <option key={c}>{c}</option>)}
              </select>
              <button onClick={() => setIsModalOpen(true)} className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-600/20 hover:bg-blue-700 transition">
                <Plus className="h-4 w-4" /> Affecter
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-neutral-100 bg-neutral-50/50 text-xs uppercase tracking-wide text-neutral-500">
                  <th className="px-5 py-3.5 font-semibold">Enseignant</th>
                  <th className="px-5 py-3.5 font-semibold">Spécialité</th>
                  <th className="px-5 py-3.5 font-semibold">Classe</th>
                  <th className="px-5 py-3.5 font-semibold">Matière assignée</th>
                  <th className="px-5 py-3.5 font-semibold">Rôle</th>
                  <th className="px-5 py-3.5 font-semibold">Année</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-neutral-200">
                {filtered.map(a => (
                  <tr key={a.id} className="hover:bg-blue-50/40 transition">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 flex-none items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 font-bold text-xs text-white">
                          {a.enseignant.split(" ").map(p => p[0]).join("").slice(0,2)}
                        </span>
                        <span className="text-sm font-semibold text-neutral-800">{a.enseignant}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-neutral-500">{a.specialite}</td>
                    <td className="px-5 py-3.5"><span className="rounded-lg border border-neutral-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-neutral-600">{a.classe}</span></td>
                    <td className="px-5 py-3.5 text-sm text-neutral-700">{a.matiere}</td>
                    <td className="px-5 py-3.5">
                      {a.profPrincipal
                        ? <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-100 px-2.5 py-1 text-[11px] font-semibold text-orange-700"><Star className="h-3 w-3" />Prof. Principal</span>
                        : <span className="text-xs text-neutral-500">Intervenant</span>
                      }
                    </td>
                    <td className="px-5 py-3.5 font-mono text-xs text-neutral-400">{a.annee}</td>
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
              <h3 className="text-lg font-bold text-neutral-900">Nouvelle Affectation</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-neutral-400 hover:text-neutral-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-neutral-700">Enseignant</label>
                  <input type="text" value={newAffect.enseignant} onChange={e => setNewAffect({...newAffect, enseignant: e.target.value})} placeholder="Nom du prof" className="mt-1 w-full rounded-xl border border-neutral-200 px-4 py-2 text-sm outline-none" />
                </div>
                <div>
                  <label className="text-sm font-medium text-neutral-700">Spécialité</label>
                  <input type="text" value={newAffect.specialite} onChange={e => setNewAffect({...newAffect, specialite: e.target.value})} placeholder="Matière principale" className="mt-1 w-full rounded-xl border border-neutral-200 px-4 py-2 text-sm outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-neutral-700">Classe</label>
                  <input type="text" value={newAffect.classe} onChange={e => setNewAffect({...newAffect, classe: e.target.value})} placeholder="Ex: 6ème B" className="mt-1 w-full rounded-xl border border-neutral-200 px-4 py-2 text-sm outline-none" />
                </div>
                <div>
                  <label className="text-sm font-medium text-neutral-700">Matière assignée</label>
                  <input type="text" value={newAffect.matiere} onChange={e => setNewAffect({...newAffect, matiere: e.target.value})} placeholder="Matière enseignée" className="mt-1 w-full rounded-xl border border-neutral-200 px-4 py-2 text-sm outline-none" />
                </div>
              </div>
              <label className="flex items-center gap-3 pt-2 cursor-pointer">
                <input type="checkbox" checked={newAffect.profPrincipal} onChange={e => setNewAffect({...newAffect, profPrincipal: e.target.checked})} className="h-4 w-4 rounded border-neutral-300 text-blue-600 focus:ring-blue-500" />
                <span className="text-sm font-medium text-neutral-700">Définir comme Professeur Principal</span>
              </label>

              <div className="mt-6 flex justify-end gap-3">
                <button onClick={() => setIsModalOpen(false)} className="rounded-xl px-4 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-100">Annuler</button>
                <button
                  onClick={() => {
                    setData([{ id: Date.now().toString(), ...newAffect }, ...data]);
                    setIsModalOpen(false);
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
