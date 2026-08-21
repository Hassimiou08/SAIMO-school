"use client";

import { useState } from "react";
import {
  Wallet, TrendingUp, TrendingDown, AlertTriangle,
  ArrowRight, Plus, CheckCircle, Clock, X, Loader2,
  Smartphone, CreditCard, ArrowDownRight
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import { ComptaSidebar } from "@/components/compta/ComptaSidebar";
import { ComptaTopbar } from "@/components/compta/ComptaTopbar";
import { kpisFinanciers, mockRecettes, mockDepenses, Recette } from "@/lib/mock-compta";
import Link from "next/link";

// ---- Données graphiques ----
const fluxData = [
  { mois: "Juin",   recettes: 9200000,  depenses: 3800000 },
  { mois: "Juil",   recettes: 10500000, depenses: 4200000 },
  { mois: "Août",   recettes: 11000000, depenses: 5500000 },
  { mois: "Sept",   recettes: 13500000, depenses: 4900000 },
  { mois: "Oct",    recettes: 12500000, depenses: 4550000 },
];

const categoriesDepenses = [
  { cat: "Salaires",     montant: 18000000 },
  { cat: "Factures",     montant: 2500000 },
  { cat: "Fournitures",  montant: 1200000 },
  { cat: "Maintenance",  montant: 850000 },
];

const fmt = (val: number) => new Intl.NumberFormat("fr-FR").format(val) + " GNF";
const fmtShort = (val: number) => {
  if (val >= 1000000) return (val / 1000000).toFixed(1) + "M";
  if (val >= 1000) return (val / 1000).toFixed(0) + "K";
  return val.toString();
};

export default function ComptaDashboard() {
  const [recettes, setRecettes] = useState(mockRecettes);

  // ---- États modale de paiement (encaissement depuis dashboard) ----
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [payStep, setPayStep] = useState<"info" | "method" | "confirm" | "processing" | "success">("info");
  const [payMethod, setPayMethod] = useState<"especes" | "mobile" | "cheque" | null>(null);
  const [selectedRecette, setSelectedRecette] = useState<Recette | null>(null);

  const openPayModal = (r: Recette) => {
    setSelectedRecette(r);
    setPayStep("info");
    setPayMethod(null);
    setIsPayModalOpen(true);
  };

  const processPayment = () => {
    setPayStep("processing");
    setTimeout(() => {
      setRecettes(prev => prev.map(r =>
        r.id === selectedRecette?.id ? { ...r, statut: "Valide", methode: payMethod === "especes" ? "Especes" : payMethod === "mobile" ? "Mobile Money" : "Cheque" } : r
      ));
      setPayStep("success");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-neutral-50/50">
      <ComptaSidebar />
      <div className="lg:pl-64">
        <ComptaTopbar />

        <main className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
          {/* Header */}
          <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="font-display text-2xl font-bold tracking-tight text-neutral-900">Tableau de Bord Financier</h1>
              <p className="mt-1 text-sm text-neutral-500">Vue d'ensemble — Octobre 2026</p>
            </div>
            <Link
              href="/compta/recettes"
              className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-violet-600/20 hover:bg-violet-700 transition"
            >
              <Plus className="h-4 w-4" /> Nouvel encaissement
            </Link>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 mb-8">
            {[
              { label: "Trésorerie",        value: fmt(kpisFinanciers.tresorerieGlobale), icon: Wallet,        colorBg: "bg-slate-100", colorText: "text-slate-700", valueColor: "text-neutral-900" },
              { label: "Recettes (Mois)",   value: fmt(kpisFinanciers.recettesMois),      icon: TrendingUp,    colorBg: "bg-emerald-100", colorText: "text-emerald-700", valueColor: "text-emerald-700" },
              { label: "Dépenses (Mois)",   value: fmt(kpisFinanciers.depensesMois),      icon: TrendingDown,  colorBg: "bg-orange-100", colorText: "text-orange-700", valueColor: "text-orange-700" },
              { label: "Reste à recouvrer", value: fmt(kpisFinanciers.impayes),           icon: AlertTriangle, colorBg: "bg-red-100", colorText: "text-red-700", valueColor: "text-red-600" },
            ].map(k => (
              <div key={k.label} className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm hover:shadow-md transition">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${k.colorBg}`}>
                    <k.icon className={`h-4 w-4 ${k.colorText}`} />
                  </div>
                  <p className="text-xs font-semibold text-neutral-500">{k.label}</p>
                </div>
                <p className={`text-lg font-bold leading-tight ${k.valueColor}`}>{k.value}</p>
              </div>
            ))}
          </div>

          {/* Graphiques */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Graphe flux trésorerie */}
            <div className="lg:col-span-2 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
              <h2 className="font-bold text-neutral-900 mb-1 text-sm">Flux de Trésorerie</h2>
              <p className="text-xs text-neutral-400 mb-5">Recettes vs Dépenses (6 derniers mois)</p>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={fluxData} margin={{ top: 4, right: 8, left: 8, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gradRecettes" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gradDepenses" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="mois" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                  <YAxis tickFormatter={fmtShort} tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                  <Tooltip formatter={(v: number) => fmt(v)} contentStyle={{ borderRadius: "12px", border: "1px solid #e5e7eb", fontSize: 12 }} />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                  <Area type="monotone" dataKey="recettes" name="Recettes" stroke="#10b981" fill="url(#gradRecettes)" strokeWidth={2.5} dot={false} />
                  <Area type="monotone" dataKey="depenses" name="Dépenses" stroke="#f97316" fill="url(#gradDepenses)" strokeWidth={2} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Répartition des dépenses */}
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
              <h2 className="font-bold text-neutral-900 mb-1 text-sm">Répartition Dépenses</h2>
              <p className="text-xs text-neutral-400 mb-5">Par catégorie (Cumul annuel)</p>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={categoriesDepenses} layout="vertical" margin={{ top: 0, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                  <XAxis type="number" tickFormatter={fmtShort} tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="cat" tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={false} tickLine={false} width={75} />
                  <Tooltip formatter={(v: number) => fmt(v)} contentStyle={{ borderRadius: "12px", border: "1px solid #e5e7eb", fontSize: 12 }} />
                  <Bar dataKey="montant" name="Montant" fill="#7c3aed" radius={[0, 6, 6, 0]} opacity={0.85} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Paiements en attente + Dernières dépenses */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Paiements en attente avec bouton Encaisser */}
            <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
                <h2 className="font-bold text-neutral-900 flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-orange-500" /> Paiements en attente
                </h2>
                <Link href="/compta/recettes" className="text-xs font-semibold text-violet-600 hover:underline">Tout voir</Link>
              </div>
              <div className="divide-y divide-neutral-50">
                {recettes.filter(r => r.statut === "En attente").map(r => (
                  <div key={r.id} className="flex items-center justify-between px-6 py-4 hover:bg-neutral-50">
                    <div>
                      <p className="text-sm font-bold text-neutral-900">{r.eleve}</p>
                      <p className="text-xs text-neutral-500">{r.motif} — Ref: {r.reference}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="font-mono text-sm font-bold text-neutral-800">{fmt(r.montant)}</p>
                      <button
                        onClick={() => openPayModal(r)}
                        className="rounded-lg bg-violet-50 px-3 py-1.5 text-xs font-bold text-violet-700 hover:bg-violet-100 transition border border-violet-200"
                      >
                        Encaisser
                      </button>
                    </div>
                  </div>
                ))}
                {recettes.filter(r => r.statut === "En attente").length === 0 && (
                  <div className="px-6 py-8 text-center text-sm text-emerald-600 font-semibold flex items-center justify-center gap-2">
                    <CheckCircle className="h-4 w-4" /> Aucun paiement en attente
                  </div>
                )}
              </div>
            </div>

            {/* Dernières dépenses */}
            <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
                <h2 className="font-bold text-neutral-900 flex items-center gap-2 text-sm">
                  <TrendingDown className="h-4 w-4 text-orange-500" /> Dernières Dépenses
                </h2>
                <Link href="/compta/depenses" className="text-xs font-semibold text-violet-600 hover:underline">Tout voir</Link>
              </div>
              <div className="divide-y divide-neutral-50">
                {mockDepenses.map(d => (
                  <div key={d.id} className="flex items-center justify-between px-6 py-4 hover:bg-neutral-50">
                    <div>
                      <p className="text-sm font-bold text-neutral-900">{d.beneficiaire}</p>
                      <span className="text-[10px] uppercase font-bold bg-neutral-100 text-neutral-500 rounded px-1.5 py-0.5">{d.categorie}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-sm font-bold text-neutral-900">{fmt(d.montant)}</p>
                      <p className={`text-[10px] font-bold ${d.statut === "Paye" ? "text-emerald-500" : "text-blue-500"}`}>{d.statut}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* ---- MODALE ENCAISSEMENT (Processus complet) ---- */}
      {isPayModalOpen && selectedRecette && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl bg-white shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 bg-slate-50">
              <h2 className="font-display font-bold text-neutral-900">
                {payStep === "success" ? "✅ Encaissement Confirmé" : "💳 Encaisser un Paiement"}
              </h2>
              {payStep !== "processing" && (
                <button onClick={() => setIsPayModalOpen(false)} className="rounded-full p-2 text-neutral-400 hover:bg-neutral-100">
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>

            <div className="p-6">
              {/* ÉTAPE 1 : Info paiement */}
              {payStep === "info" && (
                <div className="space-y-5">
                  <div className="rounded-xl bg-violet-50 border border-violet-200 p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-500">Élève</span>
                      <span className="font-bold text-neutral-900">{selectedRecette.eleve}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-500">Classe</span>
                      <span className="font-semibold text-neutral-800">{selectedRecette.classe}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-500">Motif</span>
                      <span className="font-semibold text-neutral-800">{selectedRecette.motif}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-500">Référence</span>
                      <span className="font-mono text-xs text-neutral-600">{selectedRecette.reference}</span>
                    </div>
                    <div className="border-t border-violet-200 pt-2 flex justify-between">
                      <span className="font-bold text-neutral-700">Montant à encaisser</span>
                      <span className="font-mono font-bold text-xl text-violet-700">{fmt(selectedRecette.montant)}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setPayStep("method")}
                    className="w-full rounded-xl bg-violet-600 py-3 font-bold text-white hover:bg-violet-700 transition"
                  >
                    Choisir le mode de paiement →
                  </button>
                </div>
              )}

              {/* ÉTAPE 2 : Mode de paiement */}
              {payStep === "method" && (
                <div className="space-y-4">
                  <p className="text-sm font-semibold text-neutral-700">Comment le parent paie-t-il ?</p>
                  {[
                    { id: "especes", icon: "💵", label: "Espèces", desc: "Paiement physique au guichet" },
                    { id: "mobile",  icon: "📱", label: "Mobile Money", desc: "Orange Money, MTN MoMo" },
                    { id: "cheque",  icon: "🏦", label: "Chèque / Virement", desc: "Virement bancaire ou chèque" },
                  ].map(m => (
                    <button
                      key={m.id}
                      onClick={() => setPayMethod(m.id as typeof payMethod)}
                      className={`w-full flex items-center gap-4 rounded-xl border p-4 text-left transition ${
                        payMethod === m.id
                          ? "border-violet-500 bg-violet-50"
                          : "border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50"
                      }`}
                    >
                      <span className="text-2xl">{m.icon}</span>
                      <div>
                        <p className="font-bold text-neutral-900">{m.label}</p>
                        <p className="text-xs text-neutral-500">{m.desc}</p>
                      </div>
                      {payMethod === m.id && <CheckCircle className="ml-auto h-5 w-5 text-violet-600" />}
                    </button>
                  ))}
                  <div className="flex gap-3 pt-2">
                    <button onClick={() => setPayStep("info")} className="w-1/3 rounded-xl border border-neutral-200 py-2.5 font-semibold text-neutral-700 text-sm hover:bg-neutral-50">
                      Retour
                    </button>
                    <button
                      disabled={!payMethod}
                      onClick={() => setPayStep("confirm")}
                      className="w-2/3 rounded-xl bg-violet-600 py-2.5 font-bold text-white text-sm hover:bg-violet-700 disabled:opacity-50 transition"
                    >
                      Suivant →
                    </button>
                  </div>
                </div>
              )}

              {/* ÉTAPE 3 : Confirmation */}
              {payStep === "confirm" && (
                <div className="space-y-5">
                  <div className="rounded-xl bg-neutral-50 border border-neutral-200 p-4 space-y-2">
                    <p className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">Récapitulatif</p>
                    <div className="flex justify-between text-sm"><span className="text-neutral-500">Élève</span><span className="font-bold">{selectedRecette.eleve}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-neutral-500">Motif</span><span className="font-semibold">{selectedRecette.motif}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-neutral-500">Mode</span>
                      <span className="font-semibold capitalize">{payMethod === "especes" ? "Espèces" : payMethod === "mobile" ? "Mobile Money" : "Chèque / Virement"}</span>
                    </div>
                    <div className="border-t border-neutral-200 pt-3 flex justify-between items-center">
                      <span className="font-bold text-neutral-700">Total</span>
                      <span className="font-mono font-bold text-2xl text-violet-700">{fmt(selectedRecette.montant)}</span>
                    </div>
                  </div>
                  <p className="text-xs text-center text-neutral-500">
                    En confirmant, un reçu sera généré et le statut passera à <strong>Validé</strong>.
                  </p>
                  <div className="flex gap-3">
                    <button onClick={() => setPayStep("method")} className="w-1/3 rounded-xl border border-neutral-200 py-2.5 font-semibold text-neutral-700 text-sm hover:bg-neutral-50">
                      Retour
                    </button>
                    <button
                      onClick={processPayment}
                      className="w-2/3 rounded-xl bg-emerald-600 py-2.5 font-bold text-white text-sm hover:bg-emerald-700 transition"
                    >
                      ✅ Confirmer l'encaissement
                    </button>
                  </div>
                </div>
              )}

              {/* ÉTAPE 4 : Processing */}
              {payStep === "processing" && (
                <div className="flex flex-col items-center justify-center py-12 gap-4">
                  <Loader2 className="h-12 w-12 animate-spin text-violet-600" />
                  <p className="font-bold text-neutral-900">Traitement en cours...</p>
                  <p className="text-sm text-neutral-500 text-center">Validation du paiement et génération du reçu.</p>
                </div>
              )}

              {/* ÉTAPE 5 : Succès */}
              {payStep === "success" && (
                <div className="flex flex-col items-center text-center py-6 gap-4">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
                    <CheckCircle className="h-10 w-10 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-bold text-neutral-900">Encaissement Validé !</h3>
                  <div className="rounded-xl bg-neutral-50 border border-neutral-200 px-6 py-4 w-full text-left space-y-1 text-sm">
                    <div className="flex justify-between"><span className="text-neutral-500">Élève</span><span className="font-bold">{selectedRecette.eleve}</span></div>
                    <div className="flex justify-between"><span className="text-neutral-500">Montant</span><span className="font-mono font-bold text-emerald-700">{fmt(selectedRecette.montant)}</span></div>
                    <div className="flex justify-between"><span className="text-neutral-500">N° Reçu</span><span className="font-mono text-xs">REC-{Date.now().toString().slice(-6)}</span></div>
                  </div>
                  <div className="flex gap-3 w-full pt-2">
                    <button className="w-1/2 rounded-xl border border-neutral-200 py-2.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 flex items-center justify-center gap-1.5">
                      🖨️ Imprimer le reçu
                    </button>
                    <button
                      onClick={() => setIsPayModalOpen(false)}
                      className="w-1/2 rounded-xl bg-violet-600 py-2.5 text-sm font-bold text-white hover:bg-violet-700 transition"
                    >
                      Terminer
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
