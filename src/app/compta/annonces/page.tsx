"use client";

import { useState } from "react";
import { Megaphone, Users, Send, CheckCircle, Clock, Search, Filter } from "lucide-react";
import { ComptaSidebar } from "@/components/compta/ComptaSidebar";
import { ComptaTopbar } from "@/components/compta/ComptaTopbar";

const MOCK_CLASSES = ["Toutes les classes", "6ème A", "5ème B", "Terminale SM", "Parents avec impayés", "Tous les Enseignants"];
const MOCK_HISTORY = [
  { id: 1, date: "2026-10-15", cible: "Parents avec impayés", sujet: "Rappel Frais de scolarité", statut: "Envoyé", type: "Email & SMS" },
  { id: 2, date: "2026-10-01", cible: "Tous les Enseignants", sujet: "Disponibilité des bulletins de paie", statut: "Envoyé", type: "Message Interne" },
  { id: 3, date: "2026-09-25", cible: "Toutes les classes", sujet: "Date limite paiement T1", statut: "Envoyé", type: "Email" },
];

export default function AnnoncesPage() {
  const [cible, setCible] = useState(MOCK_CLASSES[0]);
  const [sujet, setSujet] = useState("");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sujet || !message) return;
    
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setSuccess(true);
      setSujet("");
      setMessage("");
      setTimeout(() => setSuccess(false), 4000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-neutral-50/50">
      <ComptaSidebar />
      <div className="lg:pl-64">
        <ComptaTopbar />

        <main className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
          <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="font-display text-2xl font-bold tracking-tight text-neutral-900">Annonces & Relances</h1>
              <p className="mt-1 text-sm text-neutral-500">Envoyez des messages groupés pour relancer les paiements ou informer le personnel.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Colonne gauche : Formulaire d'envoi */}
            <div className="lg:col-span-2 space-y-6">
              <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                    <Megaphone className="h-5 w-5" />
                  </div>
                  <h2 className="font-bold text-neutral-900 text-lg">Nouvelle annonce</h2>
                </div>

                {success && (
                  <div className="mb-6 rounded-xl bg-emerald-50 p-4 border border-emerald-200 flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5" />
                    <div>
                      <p className="font-bold text-emerald-800">Annonce envoyée avec succès !</p>
                      <p className="text-sm text-emerald-600">Votre message a été transmis à la cible sélectionnée.</p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSend} className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-1.5">Destinataires</label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
                      <select
                        value={cible}
                        onChange={e => setCible(e.target.value)}
                        className="w-full appearance-none rounded-xl border border-neutral-200 bg-neutral-50 py-3 pl-10 pr-4 text-sm font-medium outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                      >
                        {MOCK_CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-1.5">Sujet / Objet</label>
                    <input
                      type="text"
                      placeholder="Ex: Rappel de paiement, Notification de virement..."
                      value={sujet}
                      onChange={e => setSujet(e.target.value)}
                      className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-1.5">Message</label>
                    <textarea
                      placeholder="Tapez votre message ici..."
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                      rows={6}
                      className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 resize-none"
                      required
                    />
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      disabled={isSending || !sujet || !message}
                      className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-bold text-white shadow-md shadow-blue-600/20 hover:bg-blue-700 disabled:opacity-50 transition"
                    >
                      {isSending ? (
                        <>Envoi en cours <Clock className="h-4 w-4 animate-spin" /></>
                      ) : (
                        <>Envoyer l'annonce <Send className="h-4 w-4" /></>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Colonne droite : Historique */}
            <div className="space-y-6">
              <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm overflow-hidden flex flex-col h-full">
                <div className="px-6 py-4 border-b border-neutral-100 bg-neutral-50">
                  <h2 className="font-bold text-neutral-900">Historique d'envoi</h2>
                </div>
                <div className="flex-1 overflow-y-auto p-2">
                  {MOCK_HISTORY.map((h, i) => (
                    <div key={h.id} className={`p-4 rounded-xl hover:bg-neutral-50 transition ${i !== MOCK_HISTORY.length -1 ? "border-b border-neutral-100" : ""}`}>
                      <div className="flex justify-between items-start mb-2">
                        <span className="inline-block rounded-md bg-neutral-100 px-2 py-0.5 text-[10px] font-semibold text-neutral-600 uppercase tracking-wide">
                          {h.cible}
                        </span>
                        <span className="text-xs text-neutral-400">{new Date(h.date).toLocaleDateString("fr-FR")}</span>
                      </div>
                      <p className="text-sm font-bold text-neutral-900 mb-1">{h.sujet}</p>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-[11px] font-medium text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-full">{h.type}</span>
                        <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                          <CheckCircle className="h-3 w-3" /> {h.statut}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
