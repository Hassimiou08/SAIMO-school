"use client";

import { useState } from "react";
import { Send, Bot, Sparkles, LayoutList, AlertCircle, CheckCircle2, ChevronRight, User } from "lucide-react";

export function AIAssistant() {
  const [activeTab, setActiveTab] = useState("chat");
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<{ role: "user" | "ia"; content: string }[]>([
    { role: "ia", content: "Bonjour ! Je suis l'assistant SAIMO. Je peux vous aider à rédiger des courriers, analyser des statistiques ou vérifier des dossiers. Que puis-je faire pour vous aujourd'hui ?" }
  ]);

  const handleSend = () => {
    if (!message.trim()) return;
    setChat(prev => [...prev, { role: "user", content: message }]);
    const currentMessage = message;
    setMessage("");

    // Simulation de réponse de l'IA
    setTimeout(() => {
      setChat(prev => [...prev, { role: "ia", content: `Je traite votre demande : "${currentMessage}". (Ceci est une simulation de réponse d'assistant).` }]);
    }, 1000);
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 h-[calc(100vh-180px)]">
      {/* Menu Latéral IA */}
      <div className="w-full md:w-64 flex-shrink-0">
        <nav className="flex flex-col gap-2">
          <button
            onClick={() => setActiveTab("chat")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
              activeTab === "chat"
                ? "bg-purple-50 text-purple-700 shadow-sm"
                : "text-neutral-600 hover:bg-neutral-100"
            }`}
          >
            <Sparkles className="h-5 w-5" />
            Discussion IA
          </button>
          <button
            onClick={() => setActiveTab("insights")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
              activeTab === "insights"
                ? "bg-purple-50 text-purple-700 shadow-sm"
                : "text-neutral-600 hover:bg-neutral-100"
            }`}
          >
            <LayoutList className="h-5 w-5" />
            Propositions & États
          </button>
        </nav>

        <div className="mt-8 rounded-2xl bg-neutral-50 p-4 border border-neutral-200">
          <h3 className="text-xs font-bold text-neutral-800 uppercase tracking-wider mb-2">Exemples</h3>
          <ul className="text-xs text-neutral-600 space-y-2">
            <li className="cursor-pointer hover:text-purple-600 transition flex items-start gap-2">
              <ChevronRight className="h-3 w-3 mt-0.5 flex-shrink-0" />
              "Rédige une appréciation pour Fatoumata"
            </li>
            <li className="cursor-pointer hover:text-purple-600 transition flex items-start gap-2">
              <ChevronRight className="h-3 w-3 mt-0.5 flex-shrink-0" />
              "Qui sont les élèves en retard de paiement ?"
            </li>
          </ul>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="flex-1 bg-white border border-neutral-200 rounded-3xl shadow-sm overflow-hidden flex flex-col">
        {activeTab === "chat" && (
          <>
            {/* Header Chat */}
            <div className="border-b border-neutral-100 p-4 flex items-center gap-3 bg-white">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
                <Bot className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h2 className="font-bold text-neutral-800">Assistant SAIMO</h2>
                <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  En ligne
                </p>
              </div>
            </div>

            {/* Zone de messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-neutral-50/50">
              {chat.map((msg, i) => (
                <div key={i} className={`flex gap-4 max-w-[85%] ${msg.role === "user" ? "ml-auto flex-row-reverse" : ""}`}>
                  <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${msg.role === "user" ? "bg-blue-100 text-blue-600" : "bg-purple-100 text-purple-600"}`}>
                    {msg.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  </div>
                  <div className={`rounded-2xl px-5 py-3 text-sm ${msg.role === "user" ? "bg-blue-600 text-white rounded-tr-sm shadow-md shadow-blue-600/20" : "bg-white border border-neutral-200 text-neutral-700 rounded-tl-sm shadow-sm"}`}>
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>

            {/* Zone de saisie */}
            <div className="p-4 bg-white border-t border-neutral-100">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Posez votre question à l'assistant..."
                  className="w-full rounded-full border border-neutral-200 bg-neutral-50 py-3 pl-5 pr-12 text-sm outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition"
                />
                <button
                  onClick={handleSend}
                  className="absolute right-2 flex h-8 w-8 items-center justify-center rounded-full bg-purple-600 text-white hover:bg-purple-700 transition shadow-sm"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </>
        )}

        {activeTab === "insights" && (
          <div className="p-8 h-full overflow-y-auto">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-neutral-900">Propositions & Prérequis</h2>
              <p className="text-sm text-neutral-500 mt-1">L'IA analyse le système et vous propose des actions préventives.</p>
            </div>

            <div className="space-y-6">
              {/* Alertes & Prérequis */}
              <div className="rounded-2xl border border-orange-200 bg-orange-50 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <AlertCircle className="h-5 w-5 text-orange-600" />
                  <h3 className="font-bold text-orange-900">Prérequis manquants</h3>
                </div>
                <ul className="space-y-3 text-sm text-orange-800">
                  <li className="flex items-start gap-2 bg-white/60 p-3 rounded-lg border border-orange-100">
                    <span className="font-semibold">Bulletins :</span> 15 notes sont manquantes en classe de 6ème B avant de pouvoir générer les bulletins du 1er trimestre.
                  </li>
                  <li className="flex items-start gap-2 bg-white/60 p-3 rounded-lg border border-orange-100">
                    <span className="font-semibold">Finance :</span> 5 paiements sont enregistrés en brouillon, ils doivent être validés par la comptabilité.
                  </li>
                </ul>
              </div>

              {/* Propositions IA */}
              <div className="rounded-2xl border border-purple-200 bg-purple-50/50 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="h-5 w-5 text-purple-600" />
                  <h3 className="font-bold text-purple-900">Suggestions de l'IA</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-purple-100 shadow-sm">
                    <div>
                      <p className="font-semibold text-neutral-800 text-sm">Générer un rappel d'absence</p>
                      <p className="text-xs text-neutral-500 mt-1">3 élèves ont plus de 3 absences non justifiées cette semaine.</p>
                    </div>
                    <button className="px-4 py-2 bg-purple-100 text-purple-700 text-xs font-bold rounded-lg hover:bg-purple-200 transition">Exécuter</button>
                  </div>
                  <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-purple-100 shadow-sm">
                    <div>
                      <p className="font-semibold text-neutral-800 text-sm">Analyser les résultats de Terminale</p>
                      <p className="text-xs text-neutral-500 mt-1">La moyenne en Physique a baissé de 2 points ce mois-ci.</p>
                    </div>
                    <button className="px-4 py-2 bg-purple-100 text-purple-700 text-xs font-bold rounded-lg hover:bg-purple-200 transition">Voir l'analyse</button>
                  </div>
                </div>
              </div>

              {/* États du système */}
              <div className="rounded-2xl border border-green-200 bg-green-50 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <h3 className="font-bold text-green-900">État du système</h3>
                </div>
                <p className="text-sm text-green-800">
                  Toutes les sauvegardes (backups) ont été effectuées avec succès à 03h00 du matin. Les serveurs d'envoi d'emails (Brevo) sont opérationnels.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
