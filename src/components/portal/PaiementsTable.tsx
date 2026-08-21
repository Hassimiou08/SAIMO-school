"use client";

import { useMemo, useState } from "react";
import { Search, CreditCard, CheckCircle, AlertTriangle, Plus, X } from "lucide-react";
import { paiements as mockPaiements } from "@/lib/mock-paiements";

export function PaiementsTable() {
  const [data, setData] = useState(mockPaiements);
  const [query, setQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPaiement, setNewPaiement] = useState({ eleve: "", classe: "", montantDu: 1000000, montantPaye: 0, mode: "Espèces", echeance: "Mensualité 1" });

  const filtered = useMemo(() => {
    return data.filter((p) => p.eleve.toLowerCase().includes(query.toLowerCase()));
  }, [query, data]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("fr-FR").format(val) + " GNF";
  };

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white">
      <div className="border-b border-neutral-100 p-5 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
        <div className="relative w-full max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Chercher un élève..." className="w-full rounded-xl border border-neutral-200 bg-neutral-50 py-2.5 pl-9 pr-3.5 text-xs outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition" />
        </div>
        <button onClick={() => setIsModalOpen(true)} className="inline-flex items-center gap-2 rounded-full bg-green-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-700 shadow-md shadow-green-600/20">
          <Plus className="h-4 w-4" /> Encaisser un paiement
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-neutral-100 bg-neutral-50/50 text-xs uppercase tracking-wide text-neutral-500">
              <th className="px-5 py-3.5 font-semibold">Élève / Classe</th>
              <th className="px-5 py-3.5 font-semibold">Échéance</th>
              <th className="px-5 py-3.5 font-semibold">Montant Dû</th>
              <th className="px-5 py-3.5 font-semibold">Montant Payé</th>
              <th className="px-5 py-3.5 font-semibold">Mode</th>
              <th className="px-5 py-3.5 font-semibold">Date de paiement</th>
              <th className="px-5 py-3.5 font-semibold">Statut</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-neutral-200">
            {filtered.map((p) => (
              <tr key={p.id} className="hover:bg-blue-50/50 transition">
                <td className="px-5 py-3.5">
                  <p className="text-sm font-semibold text-neutral-800">{p.eleve}</p>
                  <p className="text-xs text-neutral-500">{p.classe}</p>
                </td>
                <td className="px-5 py-3.5 text-sm text-neutral-700">{p.echeance}</td>
                <td className="px-5 py-3.5">
                  <span className="font-mono text-sm font-medium text-neutral-900">{formatCurrency(p.montantDu)}</span>
                </td>
                <td className="px-5 py-3.5">
                  <span className="font-mono text-sm font-bold text-green-700">{formatCurrency(p.montantPaye)}</span>
                </td>
                <td className="px-5 py-3.5 text-xs text-neutral-600">
                  <div className="flex items-center gap-1">
                    <CreditCard className="h-3 w-3 text-neutral-400" />
                    {p.mode}
                  </div>
                </td>
                <td className="px-5 py-3.5 text-xs text-neutral-500">{p.date ? new Date(p.date).toLocaleDateString("fr-FR") : "-"}</td>
                <td className="px-5 py-3.5">
                  {p.statut === "Soldé" ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-2.5 py-1 text-[11px] font-semibold text-green-700">
                      <CheckCircle className="h-3 w-3" /> Soldé
                    </span>
                  ) : p.statut === "Partiel" ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-2.5 py-1 text-[11px] font-semibold text-blue-700">
                      <CheckCircle className="h-3 w-3" /> Partiel
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-2.5 py-1 text-[11px] font-semibold text-red-700">
                      <AlertTriangle className="h-3 w-3" /> Impayé
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODALE PAIEMENT */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-neutral-900/50 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-neutral-900">Encaisser un paiement</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-neutral-400 hover:text-neutral-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4 text-left">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-neutral-700">Nom de l'élève</label>
                  <input type="text" value={newPaiement.eleve} onChange={e => setNewPaiement({...newPaiement, eleve: e.target.value})} placeholder="Ex: Aliou Diallo" className="mt-1 w-full rounded-xl border border-neutral-200 px-4 py-2 text-sm outline-none focus:border-blue-400" />
                </div>
                <div>
                  <label className="text-sm font-medium text-neutral-700">Classe</label>
                  <input type="text" value={newPaiement.classe} onChange={e => setNewPaiement({...newPaiement, classe: e.target.value})} placeholder="Ex: 6ème A" className="mt-1 w-full rounded-xl border border-neutral-200 px-4 py-2 text-sm outline-none focus:border-blue-400" />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-neutral-700">Montant Dû (GNF)</label>
                  <input type="number" value={newPaiement.montantDu} onChange={e => setNewPaiement({...newPaiement, montantDu: parseInt(e.target.value)})} className="mt-1 w-full rounded-xl border border-neutral-200 px-4 py-2 text-sm outline-none" />
                </div>
                <div>
                  <label className="text-sm font-medium text-neutral-700">Montant Payé (GNF)</label>
                  <input type="number" value={newPaiement.montantPaye} onChange={e => setNewPaiement({...newPaiement, montantPaye: parseInt(e.target.value)})} className="mt-1 w-full rounded-xl border border-neutral-200 px-4 py-2 text-sm outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-neutral-700">Mode de paiement</label>
                  <select value={newPaiement.mode} onChange={e => setNewPaiement({...newPaiement, mode: e.target.value})} className="mt-1 w-full rounded-xl border border-neutral-200 px-4 py-2 text-sm outline-none">
                    <option>Espèces</option>
                    <option>Orange Money</option>
                    <option>Virement</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-neutral-700">Échéance</label>
                  <input type="text" value={newPaiement.echeance} onChange={e => setNewPaiement({...newPaiement, echeance: e.target.value})} className="mt-1 w-full rounded-xl border border-neutral-200 px-4 py-2 text-sm outline-none focus:border-blue-400" />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button onClick={() => setIsModalOpen(false)} className="rounded-xl px-4 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-100">Annuler</button>
                <button
                  onClick={() => {
                    const statut = newPaiement.montantPaye >= newPaiement.montantDu ? "Soldé" : newPaiement.montantPaye > 0 ? "Partiel" : "Impayé";
                    setData([{
                      id: Date.now().toString(),
                      eleve: newPaiement.eleve,
                      classe: newPaiement.classe,
                      echeance: newPaiement.echeance,
                      montantDu: newPaiement.montantDu,
                      montantPaye: newPaiement.montantPaye,
                      mode: newPaiement.mode,
                      date: new Date().toISOString(),
                      statut: statut as any
                    }, ...data]);
                    setIsModalOpen(false);
                    setNewPaiement({ eleve: "", classe: "", montantDu: 1000000, montantPaye: 0, mode: "Espèces", echeance: "Mensualité 1" });
                  }}
                  className="rounded-xl bg-green-600 px-4 py-2 text-sm font-bold text-white hover:bg-green-700"
                >
                  Valider le paiement
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
