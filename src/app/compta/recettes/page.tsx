"use client";

import { useState } from "react";
import { Plus, Search, Filter, CheckCircle, AlertTriangle, X } from "lucide-react";
import { ComptaSidebar } from "@/components/compta/ComptaSidebar";
import { ComptaTopbar } from "@/components/compta/ComptaTopbar";
import { mockRecettes, type Recette } from "@/lib/mock-compta";

const METHODES: Recette["methode"][] = ["Especes", "Mobile Money", "Virement", "Cheque"];

export default function RecettesPage() {
  const [recettes, setRecettes] = useState<Recette[]>(mockRecettes);
  const [search, setSearch] = useState("");
  const fmt = (val: number) => new Intl.NumberFormat("fr-FR").format(val) + " GNF";

  // Modale Nouvel encaissement
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    eleve: "",
    classe: "",
    motif: "",
    montant: "",
    methode: "Especes" as Recette["methode"],
    reference: "",
  });
  const [formError, setFormError] = useState("");

  const openModal = () => {
    setForm({ eleve: "", classe: "", motif: "", montant: "", methode: "Especes", reference: "" });
    setFormError("");
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.eleve || !form.motif || !form.montant) {
      setFormError("Veuillez remplir tous les champs obligatoires.");
      return;
    }
    const montantNum = parseInt(form.montant.replace(/\s/g, ""), 10);
    if (isNaN(montantNum) || montantNum <= 0) {
      setFormError("Le montant doit être un nombre valide supérieur à 0.");
      return;
    }
    const newRecette: Recette = {
      id: `r${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      eleve: form.eleve,
      classe: form.classe,
      motif: form.motif,
      montant: montantNum,
      methode: form.methode,
      statut: "Valide",
      reference: form.reference || `REC-${Date.now().toString().slice(-5)}`,
    };
    setRecettes(prev => [newRecette, ...prev]);
    setIsModalOpen(false);
  };

  const filtered = recettes.filter(r =>
    r.eleve.toLowerCase().includes(search.toLowerCase()) ||
    r.reference.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-neutral-50/50">
      <ComptaSidebar />
      <div className="lg:pl-64">
        <ComptaTopbar />

        <main className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
          <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="font-display text-2xl font-bold tracking-tight text-neutral-900">Recettes & Encaissements</h1>
              <p className="mt-1 text-sm text-neutral-500">Gérez les paiements reçus des élèves et autres entrées d'argent.</p>
            </div>
            <button
              onClick={openModal}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-600/20 hover:bg-blue-700 transition"
            >
              <Plus className="h-4 w-4" /> Nouvel encaissement
            </button>
          </div>

          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Chercher un élève ou une référence..."
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
                  <th className="px-6 py-4 font-semibold">Élève</th>
                  <th className="px-6 py-4 font-semibold">Motif</th>
                  <th className="px-6 py-4 font-semibold">Montant</th>
                  <th className="px-6 py-4 font-semibold">Méthode</th>
                  <th className="px-6 py-4 font-semibold">Statut</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filtered.map(r => (
                  <tr key={r.id} className="hover:bg-neutral-50 transition">
                    <td className="px-6 py-4 text-sm text-neutral-500">
                      {new Date(r.date).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-neutral-900">{r.eleve}</p>
                      <p className="text-xs text-neutral-500">{r.classe}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-700">{r.motif}</td>
                    <td className="px-6 py-4 font-mono text-sm font-bold text-emerald-600">{fmt(r.montant)}</td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-neutral-700">{r.methode}</p>
                      <p className="text-[10px] text-neutral-400 font-mono">Ref: {r.reference}</p>
                    </td>
                    <td className="px-6 py-4">
                      {r.statut === "Valide" ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-700">
                          <CheckCircle className="h-3 w-3" /> Validé
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-100 px-2.5 py-1 text-xs font-bold text-orange-700">
                          <AlertTriangle className="h-3 w-3" /> En attente
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {r.statut === "En attente" && (
                        <button
                          onClick={() => setRecettes(prev => prev.map(rec => rec.id === r.id ? ({ ...rec, statut: "Valide" } as Recette) : rec))}
                          className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700 hover:bg-blue-100 transition border border-blue-200"
                        >
                          ✅ Valider l'encaissement
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-sm text-neutral-500">Aucune recette trouvée.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {/* ===== MODALE NOUVEL ENCAISSEMENT ===== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 bg-blue-50/50">
              <div>
                <h2 className="font-display font-bold text-neutral-900">Nouvel Encaissement</h2>
                <p className="text-xs text-neutral-500 mt-0.5">Enregistrer un paiement reçu</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="rounded-full p-2 text-neutral-400 hover:bg-neutral-100 transition">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Eleve + Classe */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-600 mb-1.5">Nom de l'élève <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    placeholder="Ex: Amadou Conde"
                    value={form.eleve}
                    onChange={e => setForm(f => ({ ...f, eleve: e.target.value }))}
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-600 mb-1.5">Classe</label>
                  <input
                    type="text"
                    placeholder="Ex: 6ème A"
                    value={form.classe}
                    onChange={e => setForm(f => ({ ...f, classe: e.target.value }))}
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
                  />
                </div>
              </div>

              {/* Motif */}
              <div>
                <label className="block text-xs font-semibold text-neutral-600 mb-1.5">Motif du paiement <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  placeholder="Ex: Scolarité Novembre, Cantine, Frais d'examen..."
                  value={form.motif}
                  onChange={e => setForm(f => ({ ...f, motif: e.target.value }))}
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
                  required
                />
              </div>

              {/* Montant + Mode */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-600 mb-1.5">Montant (GNF) <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    placeholder="Ex: 500000"
                    value={form.montant}
                    onChange={e => setForm(f => ({ ...f, montant: e.target.value }))}
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
                    min="0"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-600 mb-1.5">Mode de paiement</label>
                  <select
                    value={form.methode}
                    onChange={e => setForm(f => ({ ...f, methode: e.target.value as Recette["methode"] }))}
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
                  >
                    {METHODES.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
              </div>

              {/* Référence */}
              <div>
                <label className="block text-xs font-semibold text-neutral-600 mb-1.5">Référence (optionnel)</label>
                <input
                  type="text"
                  placeholder="Ex: OM-123456 (laissez vide pour auto-génération)"
                  value={form.reference}
                  onChange={e => setForm(f => ({ ...f, reference: e.target.value }))}
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
                />
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
                  ✅ Enregistrer l'encaissement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
