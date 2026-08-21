"use client";

import { useState } from "react";
import { Plus, Search, Filter, CheckCircle, Clock, X } from "lucide-react";
import { ComptaSidebar } from "@/components/compta/ComptaSidebar";
import { ComptaTopbar } from "@/components/compta/ComptaTopbar";
import { mockDepenses, type Depense } from "@/lib/mock-compta";

const CATEGORIES = ["Fournitures", "Factures", "Maintenance", "Salaires", "Transport", "Alimentation", "Autre"];

export default function DepensesPage() {
  const [depenses, setDepenses] = useState<Depense[]>(mockDepenses);
  const [search, setSearch] = useState("");
  const fmt = (val: number) => new Intl.NumberFormat("fr-FR").format(val) + " GNF";

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    beneficiaire: "",
    categorie: "Fournitures",
    description: "",
    montant: "",
    date: new Date().toISOString().split("T")[0],
    statut: "Planifie" as Depense["statut"],
  });
  const [formError, setFormError] = useState("");

  const openModal = () => {
    setForm({
      beneficiaire: "",
      categorie: "Fournitures",
      description: "",
      montant: "",
      date: new Date().toISOString().split("T")[0],
      statut: "Planifie",
    });
    setFormError("");
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.beneficiaire || !form.description || !form.montant) {
      setFormError("Veuillez remplir tous les champs obligatoires.");
      return;
    }
    const montantNum = parseInt(form.montant.replace(/\s/g, ""), 10);
    if (isNaN(montantNum) || montantNum <= 0) {
      setFormError("Le montant doit être un nombre valide supérieur à 0.");
      return;
    }
    const newDepense: Depense = {
      id: `d${Date.now()}`,
      date: form.date,
      categorie: form.categorie,
      description: form.description,
      montant: montantNum,
      beneficiaire: form.beneficiaire,
      statut: form.statut,
    };
    setDepenses(prev => [newDepense, ...prev]);
    setIsModalOpen(false);
  };

  const filtered = depenses.filter(d =>
    d.beneficiaire.toLowerCase().includes(search.toLowerCase()) ||
    d.categorie.toLowerCase().includes(search.toLowerCase()) ||
    d.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-neutral-50/50">
      <ComptaSidebar />
      <div className="lg:pl-64">
        <ComptaTopbar />

        <main className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
          <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="font-display text-2xl font-bold tracking-tight text-neutral-900">Dépenses & Achats</h1>
              <p className="mt-1 text-sm text-neutral-500">Suivi des charges, factures et décaissements de l'établissement.</p>
            </div>
            <button
              onClick={openModal}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-600/20 hover:bg-blue-700 transition"
            >
              <Plus className="h-4 w-4" /> Nouvelle dépense
            </button>
          </div>

          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Chercher un bénéficiaire, une catégorie..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full rounded-xl border border-neutral-200 bg-white py-2.5 pl-9 pr-4 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <button className="inline-flex items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-50">
              <Filter className="h-4 w-4" /> Filtres
            </button>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-neutral-100 bg-neutral-50/50 text-xs uppercase tracking-wide text-neutral-500">
                  <th className="px-6 py-4 font-semibold">Date</th>
                  <th className="px-6 py-4 font-semibold">Bénéficiaire</th>
                  <th className="px-6 py-4 font-semibold">Description</th>
                  <th className="px-6 py-4 font-semibold">Montant</th>
                  <th className="px-6 py-4 font-semibold">Statut</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filtered.map(d => (
                  <tr key={d.id} className="hover:bg-neutral-50 transition">
                    <td className="px-6 py-4 text-sm text-neutral-500">
                      {new Date(d.date).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-neutral-900">{d.beneficiaire}</p>
                      <span className="inline-block rounded-md bg-neutral-100 px-2 py-0.5 text-[10px] font-semibold text-neutral-600 mt-1 uppercase tracking-wide">
                        {d.categorie}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-700 max-w-xs truncate">{d.description}</td>
                    <td className="px-6 py-4 font-mono text-sm font-bold text-neutral-900">{fmt(d.montant)}</td>
                    <td className="px-6 py-4">
                      {d.statut === "Paye" ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-700">
                          <CheckCircle className="h-3 w-3" /> Payé
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-2.5 py-1 text-xs font-bold text-blue-700">
                          <Clock className="h-3 w-3" /> Planifié
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {d.statut === "Planifie" && (
                        <button
                          onClick={() => setDepenses(prev => prev.map(dep => dep.id === d.id ? ({ ...dep, statut: "Paye" } as Depense) : dep))}
                          className="rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 hover:bg-emerald-100 transition border border-emerald-200"
                        >
                          ✅ Marquer payé
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-sm text-neutral-500">Aucune dépense trouvée.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {/* ===== MODALE NOUVELLE DÉPENSE ===== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 bg-orange-50/50">
              <div>
                <h2 className="font-display font-bold text-neutral-900">Nouvelle Dépense</h2>
                <p className="text-xs text-neutral-500 mt-0.5">Enregistrer un décaissement ou une charge</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="rounded-full p-2 text-neutral-400 hover:bg-neutral-100 transition">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Bénéficiaire + Catégorie */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-600 mb-1.5">Bénéficiaire <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    placeholder="Ex: EDG, Librairie, Prestataire..."
                    value={form.beneficiaire}
                    onChange={e => setForm(f => ({ ...f, beneficiaire: e.target.value }))}
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-600 mb-1.5">Catégorie</label>
                  <select
                    value={form.categorie}
                    onChange={e => setForm(f => ({ ...f, categorie: e.target.value }))}
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
                  >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-neutral-600 mb-1.5">Description <span className="text-red-500">*</span></label>
                <textarea
                  placeholder="Décrivez brièvement la nature de la dépense..."
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  rows={3}
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition resize-none"
                  required
                />
              </div>

              {/* Montant + Date */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-600 mb-1.5">Montant (GNF) <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    placeholder="Ex: 1500000"
                    value={form.montant}
                    onChange={e => setForm(f => ({ ...f, montant: e.target.value }))}
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
                    min="0"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-600 mb-1.5">Date</label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
                  />
                </div>
              </div>

              {/* Statut */}
              <div>
                <label className="block text-xs font-semibold text-neutral-600 mb-1.5">Statut de paiement</label>
                <div className="grid grid-cols-2 gap-3">
                  {(["Planifie", "Paye"] as Depense["statut"][]).map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setForm(f => ({ ...f, statut: s }))}
                      className={`flex items-center justify-center gap-2 rounded-xl border py-2.5 text-sm font-semibold transition ${
                        form.statut === s
                          ? s === "Paye" ? "border-emerald-400 bg-emerald-50 text-emerald-700" : "border-blue-400 bg-blue-50 text-blue-700"
                          : "border-neutral-200 text-neutral-600 hover:bg-neutral-50"
                      }`}
                    >
                      {s === "Paye" ? <><CheckCircle className="h-4 w-4" /> Déjà payé</> : <><Clock className="h-4 w-4" /> À payer</>}
                    </button>
                  ))}
                </div>
              </div>

              {formError && (
                <p className="text-xs font-semibold text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">
                  ⚠️ {formError}
                </p>
              )}

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="w-1/3 rounded-xl border border-neutral-200 py-2.5 font-semibold text-neutral-700 text-sm hover:bg-neutral-50 transition">
                  Annuler
                </button>
                <button type="submit" className="w-2/3 rounded-xl bg-blue-600 py-2.5 font-bold text-white text-sm hover:bg-blue-700 transition shadow-md shadow-blue-600/20">
                  💾 Enregistrer la dépense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
