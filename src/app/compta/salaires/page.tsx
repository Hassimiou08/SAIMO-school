"use client";

import { useState } from "react";
import { Search, Filter, CheckCircle, Clock, X, Loader2, CreditCard, Smartphone, Banknote, CheckSquare } from "lucide-react";
import { ComptaSidebar } from "@/components/compta/ComptaSidebar";
import { ComptaTopbar } from "@/components/compta/ComptaTopbar";
import { mockSalaires, type Salaire } from "@/lib/mock-compta";

export default function SalairesPage() {
  const [salaires, setSalaires] = useState<Salaire[]>(mockSalaires);
  const [search, setSearch] = useState("");

  // Sélection pour paiement groupé
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Modale paiement individuel
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSalaire, setSelectedSalaire] = useState<Salaire | null>(null);

  // Modale paiement groupé
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);

  // État partagé pour les modales
  const [payStep, setPayStep] = useState<"recap" | "method" | "processing" | "success">("recap");
  const [payMethod, setPayMethod] = useState<"virement" | "especes" | "mobile" | null>(null);

  const fmt = (val: number) => new Intl.NumberFormat("fr-FR").format(val) + " GNF";

  // Filtre
  const filtered = salaires.filter(s =>
    s.employe.toLowerCase().includes(search.toLowerCase()) ||
    s.role.toLowerCase().includes(search.toLowerCase())
  );

  // Sélection
  const toggleSelectAll = () => {
    const payables = filtered.filter(s => s.statut === "En attente");
    if (selectedIds.length === payables.length && payables.length > 0) {
      setSelectedIds([]); // tout désélectionner
    } else {
      setSelectedIds(payables.map(s => s.id)); // tout sélectionner
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]
    );
  };

  const selectedSalairesObj = salaires.filter(s => selectedIds.includes(s.id));
  const totalBatch = selectedSalairesObj.reduce((sum, s) => sum + s.netAPayer, 0);

  // Paiement individuel
  const openModal = (s: Salaire) => {
    setSelectedSalaire(s);
    setPayStep("recap");
    setPayMethod(null);
    setIsModalOpen(true);
  };

  const processPayment = () => {
    setPayStep("processing");
    setTimeout(() => {
      setSalaires(prev =>
        prev.map(s =>
          s.id === selectedSalaire?.id
            ? ({ ...s, statut: "Paye" } as Salaire)
            : s
        )
      );
      setPayStep("success");
    }, 2000);
  };

  // Paiement groupé
  const openBatchModal = () => {
    setPayStep("recap");
    setPayMethod(null);
    setIsBatchModalOpen(true);
  };

  const processBatchPayment = () => {
    setPayStep("processing");
    setTimeout(() => {
      setSalaires(prev =>
        prev.map(s =>
          selectedIds.includes(s.id)
            ? ({ ...s, statut: "Paye" } as Salaire)
            : s
        )
      );
      setSelectedIds([]);
      setPayStep("success");
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-neutral-50/50 pb-24">
      <ComptaSidebar />
      <div className="lg:pl-64">
        <ComptaTopbar />

        <main className="mx-auto max-w-7xl px-6 py-8 lg:px-10 relative">
          <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="font-display text-2xl font-bold tracking-tight text-neutral-900">Salaires & Paie</h1>
              <p className="mt-1 text-sm text-neutral-500">Gérez la rémunération du personnel et effectuez des paiements groupés.</p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-sm font-semibold px-3 py-1.5 rounded-full ${salaires.some(s => s.statut === "En attente") ? "bg-orange-100 text-orange-700" : "bg-emerald-100 text-emerald-700"}`}>
                {salaires.filter(s => s.statut === "En attente").length} en attente
              </span>
            </div>
          </div>

          {/* Search */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Chercher un employé, rôle, classe..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full rounded-xl border border-neutral-200 bg-white py-2.5 pl-9 pr-4 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <button className="inline-flex items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-50">
              <Filter className="h-4 w-4" /> Filtres
            </button>
          </div>

          {/* Table */}
          <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm overflow-hidden overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap">
              <thead>
                <tr className="border-b border-neutral-100 bg-neutral-50/50 text-xs uppercase tracking-wide text-neutral-500">
                  <th className="px-6 py-4 w-12">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-neutral-300 text-blue-600 focus:ring-blue-600 cursor-pointer"
                      checked={
                        filtered.filter(s => s.statut === "En attente").length > 0 &&
                        selectedIds.length === filtered.filter(s => s.statut === "En attente").length
                      }
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th className="px-6 py-4 font-semibold">Employé</th>
                  <th className="px-6 py-4 font-semibold">Contrat</th>
                  <th className="px-6 py-4 font-semibold">Base / Heures</th>
                  <th className="px-6 py-4 font-semibold">Primes / Retenues</th>
                  <th className="px-6 py-4 font-semibold">Net à Payer</th>
                  <th className="px-6 py-4 font-semibold">Statut</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filtered.map(s => (
                  <tr key={s.id} className={`hover:bg-neutral-50 transition ${s.statut === "En attente" ? "bg-orange-50/10" : ""} ${selectedIds.includes(s.id) ? "bg-blue-50/50" : ""}`}>
                    <td className="px-6 py-4">
                      {s.statut === "En attente" ? (
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-neutral-300 text-blue-600 focus:ring-blue-600 cursor-pointer"
                          checked={selectedIds.includes(s.id)}
                          onChange={() => toggleSelect(s.id)}
                        />
                      ) : (
                        <CheckSquare className="h-4 w-4 text-emerald-300 opacity-50" />
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-neutral-900">{s.employe}</p>
                      <p className="text-xs text-neutral-500">{s.role}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${s.typeContrat === "Fixe" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"}`}>
                        {s.typeContrat}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {s.typeContrat === "Horaire" ? (
                        <div>
                          <p className="text-sm font-semibold text-neutral-800">{s.heures}h</p>
                          <p className="text-xs text-neutral-500">× {fmt(s.tauxHoraire ?? 0)}</p>
                        </div>
                      ) : (
                        <p className="text-sm font-semibold text-neutral-800">{fmt(s.salaireDeBase ?? 0)}</p>
                      )}
                    </td>
                    <td className="px-6 py-4 font-mono text-xs">
                      {s.primes > 0 && <p className="text-emerald-600">+{fmt(s.primes)}</p>}
                      {s.retenues > 0 && <p className="text-red-500">−{fmt(s.retenues)}</p>}
                      {s.primes === 0 && s.retenues === 0 && <p className="text-neutral-400">—</p>}
                    </td>
                    <td className="px-6 py-4 font-mono text-sm font-bold text-neutral-900">
                      {fmt(s.netAPayer)}
                    </td>
                    <td className="px-6 py-4">
                      {s.statut === "Paye" ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-700">
                          <CheckCircle className="h-3 w-3" /> Réglé
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-100 px-2.5 py-1 text-xs font-bold text-orange-700">
                          <Clock className="h-3 w-3" /> En attente
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {s.statut === "En attente" ? (
                        <button
                          onClick={() => openModal(s)}
                          className="rounded-lg bg-white border border-neutral-200 px-3 py-1.5 text-xs font-bold text-neutral-700 hover:bg-neutral-50 transition shadow-sm"
                        >
                          Payer seul
                        </button>
                      ) : (
                        <span className="text-xs text-neutral-400 italic">Payé ce mois</span>
                      )}
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-6 py-8 text-center text-sm text-neutral-500">Aucun résultat.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* FLOATING ACTION BAR POUR PAIEMENT GROUPÉ */}
          {selectedIds.length > 0 && (
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 ml-32 z-40 bg-neutral-900 rounded-full shadow-2xl px-6 py-4 flex items-center gap-6 border border-neutral-800 animate-in slide-in-from-bottom-10 fade-in duration-300">
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-neutral-400">{selectedIds.length} employés sélectionnés</span>
                <span className="text-white font-bold font-mono text-lg">{fmt(totalBatch)}</span>
              </div>
              <button
                onClick={openBatchModal}
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-2.5 rounded-full transition shadow-[0_0_20px_rgba(37,99,235,0.4)]"
              >
                Payer la sélection
              </button>
            </div>
          )}
        </main>
      </div>

      {/* ===== MODALE PAIEMENT INDIVIDUEL ===== */}
      {isModalOpen && selectedSalaire && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl bg-white shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 bg-slate-50">
              <h2 className="font-display font-bold text-neutral-900">
                {payStep === "success" ? "✅ Salaire Payé" : "💳 Paiement de Salaire"}
              </h2>
              {payStep !== "processing" && (
                <button onClick={() => setIsModalOpen(false)} className="rounded-full p-2 text-neutral-400 hover:bg-neutral-100 transition">
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
            {/* Contenu modale individuelle abrégé (identique à avant) */}
            <div className="p-6">
              {payStep === "recap" && (
                <div className="space-y-5">
                  <div className="rounded-xl bg-blue-50 border border-blue-200 p-4 space-y-2.5">
                    <div className="flex justify-between text-sm"><span className="text-neutral-500">Employé</span><span className="font-bold text-neutral-900">{selectedSalaire.employe}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-neutral-500">Rôle</span><span className="font-semibold text-neutral-800">{selectedSalaire.role}</span></div>
                    <div className="border-t border-blue-200 pt-2.5 flex justify-between items-center"><span className="font-bold text-neutral-700">Net à Payer</span><span className="font-mono font-bold text-2xl text-blue-700">{fmt(selectedSalaire.netAPayer)}</span></div>
                  </div>
                  <button onClick={() => setPayStep("method")} className="w-full rounded-xl bg-blue-600 py-3 font-bold text-white hover:bg-blue-700 transition">Choisir le mode de paiement →</button>
                </div>
              )}
              {payStep === "method" && (
                <div className="space-y-4">
                  <p className="text-sm font-semibold text-neutral-700">Mode de paiement :</p>
                  {[{ id: "virement", icon: <CreditCard className="h-5 w-5" />, label: "Virement Bancaire" },{ id: "especes",  icon: <Banknote className="h-5 w-5" />, label: "Espèces" },{ id: "mobile",  icon: <Smartphone className="h-5 w-5" />, label: "Mobile Money" }].map(m => (
                    <button key={m.id} onClick={() => setPayMethod(m.id as any)} className={`w-full flex items-center gap-4 rounded-xl border p-4 text-left transition ${payMethod === m.id ? "border-blue-500 bg-blue-50" : "border-neutral-200 hover:bg-neutral-50"}`}>
                      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${payMethod === m.id ? "bg-blue-600 text-white" : "bg-neutral-100 text-neutral-600"}`}>{m.icon}</div>
                      <div className="flex-1 font-bold text-neutral-900">{m.label}</div>
                      {payMethod === m.id && <CheckCircle className="h-5 w-5 text-blue-600" />}
                    </button>
                  ))}
                  <div className="flex gap-3 pt-2">
                    <button onClick={() => setPayStep("recap")} className="w-1/3 rounded-xl border border-neutral-200 py-2.5 font-semibold text-neutral-700 text-sm">Retour</button>
                    <button disabled={!payMethod} onClick={processPayment} className="w-2/3 rounded-xl bg-emerald-600 py-2.5 font-bold text-white text-sm disabled:opacity-50">Confirmer le paiement</button>
                  </div>
                </div>
              )}
              {payStep === "processing" && (
                <div className="flex flex-col items-center justify-center py-12 gap-4"><Loader2 className="h-12 w-12 animate-spin text-blue-600" /><p className="font-bold">Traitement...</p></div>
              )}
              {payStep === "success" && (
                <div className="flex flex-col items-center text-center py-6 gap-4">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100"><CheckCircle className="h-10 w-10 text-emerald-600" /></div>
                  <h3 className="text-xl font-bold">Salaire Versé !</h3>
                  <button onClick={() => setIsModalOpen(false)} className="w-full rounded-xl bg-blue-600 py-2.5 text-sm font-bold text-white mt-4">Terminer</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ===== MODALE PAIEMENT GROUPÉ (BATCH) ===== */}
      {isBatchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 bg-neutral-900 text-white">
              <h2 className="font-display font-bold">
                {payStep === "success" ? "✅ Paiement Groupé Réussi" : "💳 Paiement Groupé"}
              </h2>
              {payStep !== "processing" && (
                <button onClick={() => setIsBatchModalOpen(false)} className="rounded-full p-2 text-neutral-400 hover:bg-neutral-800 transition">
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
            
            <div className="p-6">
              {payStep === "recap" && (
                <div className="space-y-5">
                  <p className="text-sm text-neutral-600">Vous êtes sur le point de régler les salaires de <strong>{selectedIds.length}</strong> employés simultanément.</p>
                  <div className="rounded-xl bg-neutral-50 border border-neutral-200 p-4 max-h-40 overflow-y-auto space-y-2">
                    {selectedSalairesObj.map(s => (
                      <div key={s.id} className="flex justify-between items-center text-sm">
                        <span className="font-medium text-neutral-800">{s.employe}</span>
                        <span className="font-mono text-neutral-600">{fmt(s.netAPayer)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-neutral-200 pt-4 flex justify-between items-center">
                    <span className="font-bold text-neutral-900">Total à décaisser</span>
                    <span className="font-mono font-bold text-2xl text-emerald-600">{fmt(totalBatch)}</span>
                  </div>
                  <button onClick={() => setPayStep("method")} className="w-full rounded-xl bg-neutral-900 py-3 font-bold text-white hover:bg-black transition">
                    Définir le mode de paiement →
                  </button>
                </div>
              )}

              {payStep === "method" && (
                <div className="space-y-4">
                  <p className="text-sm font-semibold text-neutral-700">Mode de paiement global pour ces {selectedIds.length} employés :</p>
                  {[{ id: "virement", icon: <CreditCard className="h-5 w-5" />, label: "Virement Bancaire" },{ id: "especes",  icon: <Banknote className="h-5 w-5" />, label: "Espèces" },{ id: "mobile",  icon: <Smartphone className="h-5 w-5" />, label: "Mobile Money" }].map(m => (
                    <button key={m.id} onClick={() => setPayMethod(m.id as any)} className={`w-full flex items-center gap-4 rounded-xl border p-4 text-left transition ${payMethod === m.id ? "border-neutral-900 bg-neutral-50" : "border-neutral-200 hover:bg-neutral-50"}`}>
                      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${payMethod === m.id ? "bg-neutral-900 text-white" : "bg-neutral-100 text-neutral-600"}`}>{m.icon}</div>
                      <div className="flex-1 font-bold text-neutral-900">{m.label}</div>
                      {payMethod === m.id && <CheckCircle className="h-5 w-5 text-neutral-900" />}
                    </button>
                  ))}
                  <div className="flex gap-3 pt-2">
                    <button onClick={() => setPayStep("recap")} className="w-1/3 rounded-xl border border-neutral-200 py-2.5 font-semibold text-neutral-700 text-sm">Retour</button>
                    <button disabled={!payMethod} onClick={processBatchPayment} className="w-2/3 rounded-xl bg-emerald-600 py-2.5 font-bold text-white text-sm disabled:opacity-50">Confirmer le paiement groupé</button>
                  </div>
                </div>
              )}

              {payStep === "processing" && (
                <div className="flex flex-col items-center justify-center py-12 gap-4"><Loader2 className="h-12 w-12 animate-spin text-neutral-900" /><p className="font-bold">Traitement des {selectedIds.length} salaires...</p></div>
              )}
              {payStep === "success" && (
                <div className="flex flex-col items-center text-center py-6 gap-4">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100"><CheckCircle className="h-10 w-10 text-emerald-600" /></div>
                  <h3 className="text-xl font-bold">Paiements Effectués !</h3>
                  <p className="text-sm text-neutral-500">Les {selectedIds.length} bulletins de paie ont été générés avec succès.</p>
                  <button onClick={() => setIsBatchModalOpen(false)} className="w-full rounded-xl bg-neutral-900 py-2.5 text-sm font-bold text-white mt-4">Terminer</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
