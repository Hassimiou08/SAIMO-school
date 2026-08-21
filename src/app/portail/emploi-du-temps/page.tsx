"use client";

import { useState } from "react";
import { Plus, Clock, X } from "lucide-react";
import { seances as mockSeances } from "@/lib/mock-admin";
import { Sidebar } from "@/components/portal/Sidebar";
import { Topbar } from "@/components/portal/Topbar";

const JOURS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"];
const HEURES = ["07:00","08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00"];
const COULEURS_CLASSES: Record<string, string> = {
  "6ème A": "bg-blue-100 text-blue-800 border-blue-200",
  "6ème B": "bg-indigo-100 text-indigo-800 border-indigo-200",
  "5ème B": "bg-purple-100 text-purple-800 border-purple-200",
  "Terminale SM": "bg-orange-100 text-orange-800 border-orange-200",
  "11ème SS": "bg-emerald-100 text-emerald-800 border-emerald-200",
};

export default function EmploiDuTempsPage() {
  const [data, setData] = useState(mockSeances);
  const [selectedClasse, setSelectedClasse] = useState("Toutes");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSeance, setNewSeance] = useState({ classe: "6ème A", matiere: "", enseignant: "", jour: "Lundi", heureDebut: "08:00", heureFin: "10:00", salle: "" });

  const classes = ["Toutes", ...Array.from(new Set(data.map(s => s.classe)))];

  const filtered = selectedClasse === "Toutes"
    ? data
    : data.filter(s => s.classe === selectedClasse);

  return (
    <div className="min-h-screen bg-paper-100">
      <Sidebar />
      <div className="lg:pl-64">
        <Topbar />
        <main className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
          <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="font-display text-2xl font-bold tracking-tight text-navy-900">Emploi du Temps</h1>
              <p className="mt-1 text-sm text-ink-500">Planning hebdomadaire par classe et par enseignant.</p>
            </div>
            <div className="flex items-center gap-3">
              <select value={selectedClasse} onChange={e => setSelectedClasse(e.target.value)}
                className="rounded-xl border border-neutral-200 bg-white py-2.5 px-4 text-sm font-medium outline-none focus:border-blue-400">
                {classes.map(c => <option key={c}>{c}</option>)}
              </select>
              <button onClick={() => setIsModalOpen(true)} className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-600/20 hover:bg-blue-700 transition">
                <Plus className="h-4 w-4" /> Ajouter une séance
              </button>
            </div>
          </div>

          {/* Grille visuelle */}
          <div className="rounded-2xl border border-neutral-200 bg-white overflow-x-auto shadow-sm">
            <table className="w-full border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-neutral-50/80">
                  <th className="w-20 border-b border-r border-neutral-100 p-3 text-xs font-bold text-neutral-500 uppercase">Heure</th>
                  {JOURS.map(j => (
                    <th key={j} className="border-b border-r border-neutral-100 p-3 text-xs font-bold text-neutral-700 uppercase tracking-wide">{j}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {HEURES.slice(0, -1).map((heure, hi) => (
                  <tr key={heure} className={hi % 2 === 0 ? "bg-white" : "bg-neutral-50/30"}>
                    <td className="border-b border-r border-neutral-100 p-2 text-center">
                      <div className="flex items-center justify-center gap-1 text-xs text-neutral-400">
                        <Clock className="h-3 w-3" />{heure}
                      </div>
                    </td>
                    {JOURS.map(jour => {
                      const seancesDuCreneau = filtered.filter(s => s.jour === jour && s.heureDebut === heure);
                      return (
                        <td key={jour} className="border-b border-r border-neutral-100 p-1.5 h-16 align-top">
                          <div className="flex flex-col gap-1">
                            {seancesDuCreneau.map(s => (
                              <div key={s.id} className={`rounded-lg border p-2 text-xs cursor-pointer hover:shadow-sm transition ${COULEURS_CLASSES[s.classe] ?? "bg-neutral-100 text-neutral-700 border-neutral-200"}`}>
                                <p className="font-bold leading-tight truncate">{s.matiere}</p>
                                <p className="mt-0.5 truncate opacity-75">{s.classe}</p>
                                <p className="mt-0.5 truncate opacity-60">{s.enseignant}</p>
                              </div>
                            ))}
                          </div>
                        </td>
                      );
                    })}
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
              <h3 className="text-lg font-bold text-neutral-900">Nouvelle Séance</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-neutral-400 hover:text-neutral-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-neutral-700">Classe</label>
                  <input type="text" value={newSeance.classe} onChange={e => setNewSeance({...newSeance, classe: e.target.value})} placeholder="Ex: 6ème A" className="mt-1 w-full rounded-xl border border-neutral-200 px-4 py-2 text-sm outline-none" />
                </div>
                <div>
                  <label className="text-sm font-medium text-neutral-700">Matière</label>
                  <input type="text" value={newSeance.matiere} onChange={e => setNewSeance({...newSeance, matiere: e.target.value})} placeholder="Ex: Maths" className="mt-1 w-full rounded-xl border border-neutral-200 px-4 py-2 text-sm outline-none" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-neutral-700">Enseignant</label>
                <input type="text" value={newSeance.enseignant} onChange={e => setNewSeance({...newSeance, enseignant: e.target.value})} placeholder="Ex: M. Camara" className="mt-1 w-full rounded-xl border border-neutral-200 px-4 py-2 text-sm outline-none" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-neutral-700">Jour</label>
                  <select value={newSeance.jour} onChange={e => setNewSeance({...newSeance, jour: e.target.value})} className="mt-1 w-full rounded-xl border border-neutral-200 px-4 py-2 text-sm outline-none">
                    {JOURS.map(j => <option key={j}>{j}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-neutral-700">Début</label>
                  <select value={newSeance.heureDebut} onChange={e => setNewSeance({...newSeance, heureDebut: e.target.value})} className="mt-1 w-full rounded-xl border border-neutral-200 px-4 py-2 text-sm outline-none">
                    {HEURES.slice(0, -1).map(h => <option key={h}>{h}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-neutral-700">Fin</label>
                  <select value={newSeance.heureFin} onChange={e => setNewSeance({...newSeance, heureFin: e.target.value})} className="mt-1 w-full rounded-xl border border-neutral-200 px-4 py-2 text-sm outline-none">
                    {HEURES.slice(1).map(h => <option key={h}>{h}</option>)}
                  </select>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button onClick={() => setIsModalOpen(false)} className="rounded-xl px-4 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-100">Annuler</button>
                <button
                  onClick={() => {
                    setData([...data, { id: Date.now().toString(), ...newSeance }]);
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
