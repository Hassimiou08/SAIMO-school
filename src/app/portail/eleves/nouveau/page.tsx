"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, UserPlus, Save, ChevronRight, UploadCloud, CreditCard, Banknote, ShieldCheck, Printer, CheckCircle2 } from "lucide-react";
import { Sidebar } from "@/components/portal/Sidebar";
import { Topbar } from "@/components/portal/Topbar";

const CLASSES_BY_CYCLE: Record<string, string[]> = {
  "Maternelle": ["Petite Section", "Moyenne Section", "Grande Section"],
  "Primaire": ["CP", "CE1", "CE2", "CM1", "CM2"],
  "Collège": ["6ème A", "6ème B", "5ème A", "5ème B", "4ème A", "4ème B", "3ème A", "3ème B"],
  "Lycée": ["2nde", "1ère", "Terminale"],
};

export default function NouvelleInscriptionPage() {
  const [step, setStep] = useState(1);
  const [cycle, setCycle] = useState("");
  const [paymentMode, setPaymentMode] = useState("especes"); 

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-paper-100 print:bg-white print:min-h-0">
      <div className="print:hidden">
        <Sidebar />
      </div>

      <div className="lg:pl-64 print:pl-0">
        <div className="print:hidden">
          <Topbar />
        </div>

        <main className="mx-auto max-w-5xl px-6 py-8 lg:px-10 print:px-0 print:py-0">
          
          {/* Header caché à l'impression ou à l'étape 3 */}
          {step !== 3 && (
            <div className="mb-8 print:hidden">
              <Link 
                href="/portail/eleves" 
                className="inline-flex items-center gap-2 text-sm font-semibold text-ink-500 hover:text-blue-600 transition-colors mb-4"
              >
                <ArrowLeft className="h-4 w-4" />
                Retour à la liste des élèves
              </Link>
              
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="font-display text-2xl font-bold tracking-tight text-navy-900 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 shadow-md shadow-orange-500/20">
                      <UserPlus className="h-5 w-5 text-white" />
                    </div>
                    Nouvelle Inscription
                  </h1>
                  <p className="mt-2 text-sm text-ink-500 max-w-xl">
                    {step === 1 
                      ? "Renseignez les informations de l'élève et de ses parents." 
                      : "Procédez au paiement des frais d'inscription ou de scolarité pour valider le dossier."}
                  </p>
                </div>

                {/* Indicateur d'étapes */}
                <div className="flex items-center gap-3 text-sm font-bold">
                  <span className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${step >= 1 ? "border-blue-600 bg-blue-600 text-white" : "border-neutral-300 text-neutral-400"}`}>1</span>
                  <div className={`h-1 w-8 rounded-full ${step >= 2 ? "bg-blue-600" : "bg-neutral-200"}`} />
                  <span className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${step >= 2 ? "border-blue-600 bg-blue-600 text-white" : "border-neutral-300 bg-white text-neutral-400"}`}>2</span>
                </div>
              </div>
            </div>
          )}

          {step !== 3 && (
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 md:p-8 shadow-sm print:hidden">
              <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
                
                {/* ÉTAPE 1 : Informations */}
                {step === 1 && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                    <section>
                      <h2 className="text-lg font-bold text-navy-900 border-b border-neutral-100 pb-3 mb-5">
                        Photo de l'élève (Facultatif)
                      </h2>
                      <div className="flex items-center gap-6">
                        <div className="flex h-24 w-24 items-center justify-center rounded-2xl border-2 border-dashed border-neutral-300 bg-neutral-50 text-neutral-400">
                          <UserPlus className="h-8 w-8 opacity-50" />
                        </div>
                        <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-white border border-neutral-200 px-4 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 transition">
                          <UploadCloud className="h-4 w-4 text-blue-500" />
                          Choisir une photo
                          <input type="file" accept="image/png, image/jpeg" className="hidden" />
                        </label>
                        <span className="text-xs text-neutral-400 max-w-[200px]">Format JPG, PNG. Taille maximale : 2 Mo.</span>
                      </div>
                    </section>

                    <section>
                      <h2 className="text-lg font-bold text-navy-900 border-b border-neutral-100 pb-3 mb-5">
                        1. Informations de l'élève
                      </h2>
                      <div className="grid gap-6 sm:grid-cols-2">
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-neutral-700">Nom de famille</label>
                          <input type="text" placeholder="Ex: Diallo" className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-neutral-700">Prénoms</label>
                          <input type="text" placeholder="Ex: Mamadou" className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-neutral-700">Date de naissance</label>
                          <input type="date" className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-neutral-700">Genre</label>
                          <div className="flex gap-4 pt-2">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input type="radio" name="genre" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300" />
                              <span className="text-sm text-neutral-700">Masculin</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input type="radio" name="genre" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300" />
                              <span className="text-sm text-neutral-700">Féminin</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </section>

                    <section>
                      <h2 className="text-lg font-bold text-navy-900 border-b border-neutral-100 pb-3 mb-5">
                        2. Détails de Scolarité
                      </h2>
                      <div className="grid gap-6 sm:grid-cols-3">
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-neutral-700">Cycle</label>
                          <select 
                            value={cycle}
                            onChange={(e) => setCycle(e.target.value)}
                            className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
                          >
                            <option value="">Choisir un cycle...</option>
                            <option value="Maternelle">Maternelle</option>
                            <option value="Primaire">Primaire</option>
                            <option value="Collège">Collège</option>
                            <option value="Lycée">Lycée</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-neutral-700">Classe d'affectation</label>
                          <select 
                            disabled={!cycle}
                            className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {!cycle && <option>Sélectionnez le cycle</option>}
                            {cycle && CLASSES_BY_CYCLE[cycle]?.map(c => (
                              <option key={c} value={c}>{c}</option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-neutral-700">Matricule</label>
                          <input type="text" disabled value="MAT-2025-0842" className="w-full rounded-xl border border-neutral-200 bg-neutral-100 px-4 py-3 text-sm text-neutral-500 font-mono font-bold cursor-not-allowed" />
                        </div>
                      </div>
                    </section>

                    <section>
                      <h2 className="text-lg font-bold text-navy-900 border-b border-neutral-100 pb-3 mb-5">
                        3. Responsable légal / Tuteur
                      </h2>
                      <div className="grid gap-6 sm:grid-cols-2">
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-neutral-700">Nom complet du tuteur</label>
                          <input type="text" placeholder="Ex: Oumar Diallo" className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-neutral-700">Téléphone</label>
                          <input type="tel" placeholder="+224 XX XX XX XX" className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition" />
                        </div>
                        <div className="space-y-2 sm:col-span-2">
                          <label className="text-sm font-semibold text-neutral-700">Adresse de résidence</label>
                          <textarea rows={2} placeholder="Quartier, secteur..." className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition" />
                        </div>
                      </div>
                    </section>

                    <div className="flex items-center justify-end gap-4 border-t border-neutral-100 pt-6 mt-8">
                      <button 
                        type="button"
                        onClick={() => setStep(2)}
                        className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-8 py-3 text-sm font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 transition"
                      >
                        Suivant : Paiement <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* ÉTAPE 2 : Paiement */}
                {step === 2 && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                    <section>
                      <h2 className="text-lg font-bold text-navy-900 border-b border-neutral-100 pb-3 mb-5">
                        Règlement des frais d'inscription
                      </h2>
                      <div className="rounded-xl border border-blue-100 bg-blue-50 p-5 mb-6">
                        <div className="flex items-center gap-3 text-blue-800">
                          <ShieldCheck className="h-5 w-5" />
                          <p className="text-sm font-semibold">Le paiement est requis pour valider définitivement le dossier (Gestion Comptable).</p>
                        </div>
                      </div>

                      <div className="grid gap-6 sm:grid-cols-2">
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-neutral-700">Frais à payer</label>
                          <div className="w-full rounded-xl border border-neutral-200 bg-neutral-100 px-4 py-3 text-lg font-bold text-neutral-900">
                            150 000 GNF
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-neutral-700">Motif</label>
                          <input type="text" disabled value="Frais d'inscription + 1er mois" className="w-full rounded-xl border border-neutral-200 bg-neutral-100 px-4 py-3 text-sm font-medium text-neutral-600" />
                        </div>
                      </div>

                      <div className="mt-8 space-y-4">
                        <label className="text-sm font-semibold text-neutral-700">Mode de paiement</label>
                        <div className="grid gap-4 sm:grid-cols-3">
                          <label 
                            onClick={() => setPaymentMode("especes")}
                            className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 p-4 transition ${paymentMode === "especes" ? "border-orange-500 bg-orange-50" : "border-neutral-200 bg-white hover:bg-neutral-50"}`}
                          >
                            <input type="radio" name="paiement" checked={paymentMode === "especes"} onChange={() => {}} className="h-4 w-4 text-orange-600 focus:ring-orange-500" />
                            <Banknote className={`h-5 w-5 ${paymentMode === "especes" ? "text-orange-600" : "text-neutral-500"}`} />
                            <span className={`font-semibold ${paymentMode === "especes" ? "text-orange-900" : "text-neutral-700"}`}>Espèces</span>
                          </label>
                          <label 
                            onClick={() => setPaymentMode("om")}
                            className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 p-4 transition ${paymentMode === "om" ? "border-blue-500 bg-blue-50" : "border-neutral-200 bg-white hover:bg-neutral-50"}`}
                          >
                            <input type="radio" name="paiement" checked={paymentMode === "om"} onChange={() => {}} className="h-4 w-4 text-blue-600 focus:ring-blue-500" />
                            <Banknote className={`h-5 w-5 ${paymentMode === "om" ? "text-blue-600" : "text-neutral-500"}`} />
                            <span className={`font-semibold ${paymentMode === "om" ? "text-blue-900" : "text-neutral-700"}`}>Orange Money</span>
                          </label>
                          <label 
                            onClick={() => setPaymentMode("carte")}
                            className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 p-4 transition ${paymentMode === "carte" ? "border-blue-500 bg-blue-50" : "border-neutral-200 bg-white hover:bg-neutral-50"}`}
                          >
                            <input type="radio" name="paiement" checked={paymentMode === "carte"} onChange={() => {}} className="h-4 w-4 text-blue-600 focus:ring-blue-500" />
                            <CreditCard className={`h-5 w-5 ${paymentMode === "carte" ? "text-blue-600" : "text-neutral-500"}`} />
                            <span className={`font-semibold ${paymentMode === "carte" ? "text-blue-900" : "text-neutral-700"}`}>Carte bancaire</span>
                          </label>
                        </div>

                        {/* Champs dynamiques de paiement */}
                        {paymentMode === "om" && (
                          <div className="mt-4 animate-in fade-in slide-in-from-top-2 p-5 bg-neutral-50 border border-neutral-200 rounded-xl space-y-4">
                            <div>
                              <label className="text-sm font-semibold text-neutral-700">Numéro Orange Money</label>
                              <input type="tel" placeholder="+224 62X XX XX XX" className="w-full mt-2 rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition" />
                            </div>
                            <div>
                              <label className="text-sm font-semibold text-neutral-700">ID de Transaction (facultatif)</label>
                              <input type="text" placeholder="Ex: CI2309..." className="w-full mt-2 rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition" />
                            </div>
                          </div>
                        )}

                        {paymentMode === "carte" && (
                          <div className="mt-4 animate-in fade-in slide-in-from-top-2 p-5 bg-neutral-50 border border-neutral-200 rounded-xl space-y-4">
                            <div>
                              <label className="text-sm font-semibold text-neutral-700">Numéro de la carte</label>
                              <div className="relative mt-2">
                                <CreditCard className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
                                <input type="text" placeholder="XXXX XXXX XXXX XXXX" className="w-full rounded-xl border border-neutral-200 bg-white pl-10 pr-4 py-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition" />
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-sm font-semibold text-neutral-700">Date d'exp.</label>
                                <input type="text" placeholder="MM/AA" className="w-full mt-2 rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition" />
                              </div>
                              <div>
                                <label className="text-sm font-semibold text-neutral-700">CVC</label>
                                <input type="text" placeholder="123" className="w-full mt-2 rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition" />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </section>

                    <div className="flex items-center justify-between border-t border-neutral-100 pt-6 mt-8">
                      <button 
                        type="button"
                        onClick={() => setStep(1)}
                        className="px-6 py-3 text-sm font-semibold text-neutral-600 hover:bg-neutral-100 rounded-full transition"
                      >
                        Retour aux informations
                      </button>
                      <button 
                        type="button"
                        onClick={() => setStep(3)}
                        className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-8 py-3 text-sm font-bold text-white shadow-md shadow-orange-500/20 hover:bg-orange-600 transition"
                      >
                        <Save className="h-4 w-4" />
                        Valider et Encaisser
                      </button>
                    </div>
                  </div>
                )}
              </form>
            </div>
          )}

          {/* ÉTAPE 3 : REÇU DE PAIEMENT (Généré après encaissement) */}
          {step === 3 && (
            <div className="animate-in fade-in zoom-in-95 duration-500 max-w-2xl mx-auto print:max-w-none print:w-full">
              
              {/* Actions d'impression - Cachées à l'impression */}
              <div className="mb-6 flex items-center justify-between bg-green-50 border border-green-200 rounded-2xl p-4 print:hidden">
                <div className="flex items-center gap-3 text-green-700">
                  <CheckCircle2 className="h-6 w-6" />
                  <div>
                    <p className="font-bold">Inscription validée et paiement encaissé !</p>
                    <p className="text-sm">Le dossier de l'élève est désormais actif.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={handlePrint} className="inline-flex items-center gap-2 rounded-xl bg-white border border-neutral-200 px-4 py-2.5 text-sm font-bold text-neutral-700 hover:bg-neutral-50 hover:text-blue-600 transition shadow-sm">
                    <Printer className="h-4 w-4" /> Imprimer le reçu
                  </button>
                  <Link href="/portail/eleves" className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-600/20 hover:bg-blue-700 transition">
                    Terminer
                  </Link>
                </div>
              </div>

              {/* Le Reçu (Format A4 ou Carte) */}
              <div className="bg-white rounded-3xl shadow-lg border border-neutral-100 overflow-hidden print:shadow-none print:border-none print:rounded-none">
                
                {/* En-tête du reçu */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-8 text-white flex justify-between items-center print:bg-none print:text-black print:border-b-2 print:border-neutral-900 print:px-0">
                  <div>
                    <h2 className="text-3xl font-black tracking-tight font-display text-orange-500 print:text-black">SAIMO <span className="text-white print:text-neutral-600">École</span></h2>
                    <p className="text-blue-100 mt-1 print:text-neutral-500">Excellence & Innovation Éducative</p>
                    <p className="text-blue-200 text-sm mt-2 print:text-neutral-500">Conakry, Kipé - Rép. de Guinée</p>
                  </div>
                  <div className="text-right">
                    <div className="inline-block bg-white/20 backdrop-blur-md rounded-lg px-4 py-2 print:bg-neutral-100 print:border print:border-neutral-200">
                      <p className="text-xs font-semibold text-blue-100 uppercase tracking-widest print:text-neutral-500">Reçu N°</p>
                      <p className="text-xl font-bold font-mono print:text-black">REC-2025-0842</p>
                    </div>
                  </div>
                </div>

                {/* Corps du reçu */}
                <div className="p-8 print:px-0">
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <p className="text-sm font-semibold text-neutral-400 uppercase tracking-wider mb-1">Délivré à</p>
                      <p className="text-xl font-bold text-neutral-900">Mamadou Diallo</p>
                      <p className="text-neutral-600 font-medium bg-neutral-100 inline-block px-2 py-0.5 rounded-md mt-1 text-sm">Matricule: MAT-2025-0842</p>
                      <p className="text-sm text-neutral-500 mt-2">Classe : 6ème A (Collège)</p>
                    </div>
                    
                    {/* QR Code généré via API */}
                    <div className="bg-white p-2 rounded-xl border border-neutral-200 shadow-sm print:border-neutral-900 print:shadow-none">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=MAT-2025-0842" 
                        alt="QR Code Matricule" 
                        className="w-24 h-24"
                      />
                    </div>
                  </div>

                  <table className="w-full mb-8">
                    <thead>
                      <tr className="border-b-2 border-neutral-200 text-left">
                        <th className="pb-3 font-semibold text-neutral-500 uppercase text-xs tracking-wider">Description</th>
                        <th className="pb-3 font-semibold text-neutral-500 uppercase text-xs tracking-wider text-right">Montant</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      <tr>
                        <td className="py-4 text-neutral-800 font-medium">Frais d'inscription (Année 2025-2026)</td>
                        <td className="py-4 text-right font-mono font-semibold text-neutral-800">50 000 GNF</td>
                      </tr>
                      <tr>
                        <td className="py-4 text-neutral-800 font-medium">1er Mois de scolarité</td>
                        <td className="py-4 text-right font-mono font-semibold text-neutral-800">100 000 GNF</td>
                      </tr>
                    </tbody>
                    <tfoot>
                      <tr className="border-t-2 border-neutral-900">
                        <td className="pt-4 font-bold text-lg text-neutral-900">Total Payé</td>
                        <td className="pt-4 text-right font-bold font-mono text-xl text-blue-600 print:text-black">150 000 GNF</td>
                      </tr>
                    </tfoot>
                  </table>

                  <div className="flex justify-between items-end border-t border-dashed border-neutral-200 pt-8 mt-4">
                    <div>
                      <p className="text-sm text-neutral-500">Mode de paiement : <strong className="text-neutral-800 capitalize">{paymentMode}</strong></p>
                      <p className="text-sm text-neutral-500 mt-1">Date : {new Date().toLocaleDateString('fr-FR')} à {new Date().toLocaleTimeString('fr-FR', {hour: '2-digit', minute:'2-digit'})}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-semibold text-neutral-900 mb-8">Cachet et Signature</p>
                      <div className="w-32 border-b border-neutral-300 mx-auto"></div>
                    </div>
                  </div>
                </div>

                <div className="bg-neutral-50 p-4 text-center text-xs text-neutral-400 print:bg-white print:border-t print:border-neutral-200">
                  Ce reçu est informatisé et généré par le portail éducatif SAIMO. À conserver précieusement.
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
