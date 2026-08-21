"use client";

import { useState } from "react";
import { CheckCircle, AlertTriangle, CreditCard, Clock, X, Smartphone, Loader2 } from "lucide-react";
import { ParentSidebar } from "@/components/parent/ParentSidebar";
import { ParentTopbar } from "@/components/parent/ParentTopbar";
import { paiementsParent as initialPaiements, enfantsList, PaiementParent } from "@/lib/mock-parent";
import { useSearchParams } from "next/navigation";

export default function PaiementsParentPage() {
  const searchParams = useSearchParams();
  const enfantId = searchParams.get("enfant") || "e1";
  const enfantInfo = enfantsList.find(e => e.id === enfantId) || enfantsList[0];

  // État local pour refléter les paiements en temps réel
  const [paiements, setPaiements] = useState<PaiementParent[]>(initialPaiements);

  // État de la modale de paiement
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<PaiementParent | null>(null);
  const [step, setStep] = useState<"select" | "method" | "phone" | "processing" | "success">("select");
  const [method, setMethod] = useState<"orange" | "mtn" | "card" | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("");

  const fmt = (val: number) => new Intl.NumberFormat("fr-FR").format(val) + " GNF";
  const totalDu = paiements.reduce((a, p) => a + p.montantDu, 0);
  const totalPaye = paiements.reduce((a, p) => a + p.montantPaye, 0);
  const solde = totalDu - totalPaye;

  // Ouvrir la modale depuis un bouton spécifique
  const handleOpenPayment = (p?: PaiementParent) => {
    if (p) {
      setSelectedInvoice(p);
      setStep("method");
    } else {
      setSelectedInvoice(null);
      setStep("select");
    }
    setMethod(null);
    setPhoneNumber("");
    setIsModalOpen(true);
  };

  // Traiter le paiement
  const handleProcessPayment = () => {
    setStep("processing");
    // Simuler l'API (2.5 secondes)
    setTimeout(() => {
      if (selectedInvoice) {
        setPaiements(paiements.map(p => {
          if (p.id === selectedInvoice.id) {
            return {
              ...p,
              montantPaye: p.montantDu, // On solde l'échéance
              statut: "Solde",
              datePaiement: new Date().toISOString(),
              mode: method === "orange" ? "Orange Money" : method === "mtn" ? "MTN Mobile Money" : "Carte Bancaire"
            };
          }
          return p;
        }));
      }
      setStep("success");
    }, 2500);
  };

  const pendingInvoices = paiements.filter(p => p.statut !== "Solde");

  return (
    <div className="min-h-screen bg-neutral-50">
      <ParentSidebar />
      <div className="lg:pl-64">
        <ParentTopbar />
        <main className="mx-auto max-w-5xl px-6 py-8 lg:px-10">
          <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="font-display text-2xl font-bold tracking-tight text-neutral-900">Paiements</h1>
              <p className="mt-1 text-sm text-neutral-500">{enfantInfo.nom} &bull; {enfantInfo.classe}</p>
            </div>
            <button
              onClick={() => handleOpenPayment()}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition"
            >
              <Smartphone className="h-4 w-4" /> Payer en ligne
            </button>
          </div>

          {/* Stats financieres */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-medium text-neutral-500 mb-1">Total Ecolage</p>
              <p className="text-xl font-bold text-neutral-900">{fmt(totalDu)}</p>
            </div>
            <div className="rounded-2xl border border-green-200 bg-green-50 p-5 shadow-sm">
              <p className="text-xs font-medium text-green-600 mb-1">Montant Regle</p>
              <p className="text-xl font-bold text-green-700">{fmt(totalPaye)}</p>
            </div>
            <div className={`rounded-2xl border p-5 shadow-sm ${solde > 0 ? "border-red-200 bg-red-50" : "border-emerald-200 bg-emerald-50"}`}>
              <p className={`text-xs font-medium mb-1 ${solde > 0 ? "text-red-600" : "text-emerald-600"}`}>Solde Restant</p>
              <p className={`text-xl font-bold ${solde > 0 ? "text-red-700" : "text-emerald-700"}`}>{fmt(solde)}</p>
            </div>
          </div>

          {/* Barre de progression globale */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm mb-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold text-neutral-700">Progression des paiements</p>
              <p className="text-sm font-bold text-emerald-600">{Math.round((totalPaye / totalDu) * 100)}%</p>
            </div>
            <div className="w-full h-3 bg-neutral-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-700"
                style={{ width: `${(totalPaye / totalDu) * 100}%` }}
              />
            </div>
          </div>

          {/* Tableau */}
          <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-neutral-100 bg-neutral-50/50 text-xs uppercase tracking-wide text-neutral-500">
                  <th className="px-6 py-4 font-semibold">Libelle</th>
                  <th className="px-6 py-4 font-semibold">Montant Du</th>
                  <th className="px-6 py-4 font-semibold">Montant Regle</th>
                  <th className="px-6 py-4 font-semibold">Statut</th>
                  <th className="px-6 py-4 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {paiements.map(p => (
                  <tr key={p.id} className="hover:bg-neutral-50 transition">
                    <td className="px-6 py-4 text-sm font-semibold text-neutral-900">{p.libelle}</td>
                    <td className="px-6 py-4 font-mono text-sm text-neutral-700">{fmt(p.montantDu)}</td>
                    <td className="px-6 py-4 font-mono text-sm font-bold text-emerald-700">{fmt(p.montantPaye)}</td>
                    <td className="px-6 py-4">
                      {p.statut === "Solde" ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-2.5 py-1 text-xs font-bold text-green-700">
                          <CheckCircle className="h-3 w-3" /> Solde
                        </span>
                      ) : p.statut === "Partiel" ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-2.5 py-1 text-xs font-bold text-blue-700">
                          Partiel
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-2.5 py-1 text-xs font-bold text-red-700">
                          <AlertTriangle className="h-3 w-3" /> Impaye
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {p.statut !== "Solde" ? (
                        <button
                          onClick={() => handleOpenPayment(p)}
                          className="rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 transition"
                        >
                          Payer
                        </button>
                      ) : (
                        <span className="text-xs text-neutral-400">Regle le {new Date(p.datePaiement!).toLocaleDateString("fr-FR")}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {/* --- MODALE DE PAIEMENT --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl relative">
            
            {/* Header Modale */}
            <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-4 bg-emerald-50/50">
              <h2 className="font-display font-bold text-neutral-900">
                {step === "success" ? "Paiement Reussi" : "Paiement en ligne"}
              </h2>
              {step !== "processing" && (
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-full p-2 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>

            {/* Contenu Modale */}
            <div className="p-6">
              
              {/* ETAPE 1: Selection de la facture */}
              {step === "select" && (
                <div className="space-y-4">
                  <p className="text-sm text-neutral-600 mb-4">Selectionnez l'echeance a regler :</p>
                  {pendingInvoices.length === 0 ? (
                    <div className="rounded-xl bg-green-50 p-4 text-center text-sm font-medium text-green-700">
                      Vous n'avez aucune echeance en attente.
                    </div>
                  ) : (
                    pendingInvoices.map(inv => (
                      <button
                        key={inv.id}
                        onClick={() => {
                          setSelectedInvoice(inv);
                          setStep("method");
                        }}
                        className="w-full text-left flex items-center justify-between rounded-xl border border-neutral-200 p-4 hover:border-emerald-500 hover:bg-emerald-50 transition"
                      >
                        <div>
                          <p className="font-bold text-neutral-900">{inv.libelle}</p>
                          <p className="text-xs text-neutral-500">Reste a payer</p>
                        </div>
                        <p className="font-mono font-bold text-emerald-700">{fmt(inv.montantDu - inv.montantPaye)}</p>
                      </button>
                    ))
                  )}
                </div>
              )}

              {/* ETAPE 2: Choix de la methode */}
              {step === "method" && selectedInvoice && (
                <div className="space-y-6">
                  <div className="rounded-xl bg-neutral-50 p-4 text-center border border-neutral-100">
                    <p className="text-xs text-neutral-500">Montant a payer</p>
                    <p className="font-mono text-2xl font-bold text-neutral-900 mt-1">
                      {fmt(selectedInvoice.montantDu - selectedInvoice.montantPaye)}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-semibold text-neutral-900 mb-3">Choisissez un moyen de paiement :</p>
                    <div className="grid gap-3">
                      <button
                        onClick={() => { setMethod("orange"); setStep("phone"); }}
                        className="flex items-center gap-4 rounded-xl border border-orange-200 bg-orange-50 p-4 hover:bg-orange-100 transition text-left"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-500 text-white font-bold text-xs">OM</div>
                        <div>
                          <p className="font-bold text-neutral-900">Orange Money</p>
                          <p className="text-xs text-neutral-500">Paiement instantane via mobile</p>
                        </div>
                      </button>
                      <button
                        onClick={() => { setMethod("mtn"); setStep("phone"); }}
                        className="flex items-center gap-4 rounded-xl border border-yellow-200 bg-yellow-50 p-4 hover:bg-yellow-100 transition text-left"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-yellow-500 text-neutral-900 font-bold text-xs">MTN</div>
                        <div>
                          <p className="font-bold text-neutral-900">MTN Mobile Money</p>
                          <p className="text-xs text-neutral-500">Paiement instantane via mobile</p>
                        </div>
                      </button>
                      <button
                        onClick={() => { setMethod("card"); setStep("phone"); }}
                        className="flex items-center gap-4 rounded-xl border border-blue-200 bg-blue-50 p-4 hover:bg-blue-100 transition text-left"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-xs">CB</div>
                        <div>
                          <p className="font-bold text-neutral-900">Carte Bancaire</p>
                          <p className="text-xs text-neutral-500">Visa, Mastercard</p>
                        </div>
                      </button>
                    </div>
                  </div>
                  <button onClick={() => setStep("select")} className="text-xs font-semibold text-neutral-500 hover:text-neutral-900 underline">
                    Retour aux factures
                  </button>
                </div>
              )}

              {/* ETAPE 3: Formulaire Numero */}
              {step === "phone" && (
                <div className="space-y-6">
                  <div className="rounded-xl bg-neutral-50 p-4 text-center border border-neutral-100">
                    <p className="text-xs text-neutral-500">Vous allez payer {fmt(selectedInvoice!.montantDu - selectedInvoice!.montantPaye)} via</p>
                    <p className="font-bold text-neutral-900 mt-1">
                      {method === "orange" ? "Orange Money" : method === "mtn" ? "MTN Mobile Money" : "Carte Bancaire"}
                    </p>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-neutral-900">
                      {method === "card" ? "Numero de carte" : "Numero de telephone"}
                    </label>
                    <input
                      type="text"
                      value={phoneNumber}
                      onChange={e => setPhoneNumber(e.target.value)}
                      placeholder={method === "card" ? "XXXX XXXX XXXX XXXX" : "Ex: 620 00 00 00"}
                      className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition"
                      autoFocus
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setStep("method")}
                      className="w-1/3 rounded-xl border border-neutral-200 py-3 font-semibold text-neutral-700 hover:bg-neutral-50"
                    >
                      Retour
                    </button>
                    <button
                      onClick={handleProcessPayment}
                      disabled={phoneNumber.length < 5}
                      className="w-2/3 rounded-xl bg-emerald-600 py-3 font-bold text-white hover:bg-emerald-700 disabled:opacity-50 transition"
                    >
                      Confirmer le paiement
                    </button>
                  </div>
                </div>
              )}

              {/* ETAPE 4: Processing (Loader) */}
              {step === "processing" && (
                <div className="flex flex-col items-center justify-center py-10 space-y-4">
                  <Loader2 className="h-12 w-12 animate-spin text-emerald-600" />
                  <p className="font-bold text-neutral-900">Traitement en cours...</p>
                  <p className="text-sm text-neutral-500 text-center">
                    Veuillez valider la transaction sur votre telephone si necessaire.
                  </p>
                </div>
              )}

              {/* ETAPE 5: Success */}
              {step === "success" && (
                <div className="flex flex-col items-center justify-center py-6 space-y-4">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                    <CheckCircle className="h-10 w-10 text-green-600" />
                  </div>
                  <h3 className="font-display text-xl font-bold text-neutral-900">Paiement Valide !</h3>
                  <p className="text-sm text-neutral-500 text-center px-4">
                    Votre paiement de <strong>{fmt(selectedInvoice!.montantDu - selectedInvoice!.montantPaye)}</strong> a bien ete recu.
                  </p>
                  <div className="w-full pt-4">
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="w-full rounded-xl bg-emerald-600 py-3 font-bold text-white hover:bg-emerald-700 transition"
                    >
                      Terminer et fermer
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
