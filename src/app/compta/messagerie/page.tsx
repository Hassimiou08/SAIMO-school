"use client";

import { useState } from "react";
import { Search, Send, Phone, Video, MoreVertical, Check, CheckCheck, Paperclip } from "lucide-react";
import { ComptaSidebar } from "@/components/compta/ComptaSidebar";
import { ComptaTopbar } from "@/components/compta/ComptaTopbar";

type Message = {
  id: string;
  texte: string;
  heure: string;
  envoyeur: "moi" | "contact";
  lu?: boolean;
};

type Contact = {
  id: string;
  nom: string;
  role: string;
  avatar: string;
  messages: Message[];
  enLigne: boolean;
};

// Données fictives pour la messagerie comptable
const MOCK_CONTACTS: Contact[] = [
  {
    id: "c1",
    nom: "Amadou Conde (Parent)",
    role: "Parent d'élève",
    avatar: "AC",
    enLigne: true,
    messages: [
      { id: "m1", texte: "Bonjour, j'ai effectué le virement pour le mois de Novembre.", heure: "09:42", envoyeur: "contact" },
      { id: "m2", texte: "Bonjour M. Conde. Pouvez-vous me transférer la référence du virement s'il vous plaît ?", heure: "10:15", envoyeur: "moi", lu: true },
      { id: "m3", texte: "Oui bien sûr, c're VIR-88231", heure: "10:18", envoyeur: "contact" },
    ],
  },
  {
    id: "c2",
    nom: "Mme Sylla (Enseignante)",
    role: "Professeur de Maths",
    avatar: "MS",
    enLigne: false,
    messages: [
      { id: "m1", texte: "Bonjour M. Diallo, avez-vous pu vérifier mes heures supplémentaires du mois dernier ?", heure: "Hier", envoyeur: "contact" },
      { id: "m2", texte: "Bonjour Mme Sylla. Oui, c'est validé et ça sera inclus dans la paie de cette semaine.", heure: "Hier", envoyeur: "moi", lu: true },
    ],
  },
  {
    id: "c3",
    nom: "Direction SAIMO",
    role: "Administration",
    avatar: "DIR",
    enLigne: true,
    messages: [
      { id: "m1", texte: "Merci de me sortir le bilan des impayés avant 14h.", heure: "08:00", envoyeur: "contact" },
    ],
  }
];

export default function MessagerieComptaPage() {
  const [contacts] = useState<Contact[]>(MOCK_CONTACTS);
  const [activeContactId, setActiveContactId] = useState<string>(MOCK_CONTACTS[0].id);
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState<Record<string, Message[]>>(
    MOCK_CONTACTS.reduce((acc, c) => ({ ...acc, [c.id]: c.messages }), {})
  );

  const [isCalling, setIsCalling] = useState<"audio" | "video" | null>(null);

  const activeContact = contacts.find(c => c.id === activeContactId)!;
  const activeMessages = messages[activeContactId] || [];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      texte: messageText,
      heure: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      envoyeur: "moi",
      lu: false,
    };

    setMessages(prev => ({
      ...prev,
      [activeContactId]: [...(prev[activeContactId] || []), newMessage]
    }));
    setMessageText("");
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      <ComptaTopbar />
      <ComptaSidebar />

      <main className="flex-1 lg:pl-64 flex overflow-hidden h-[calc(100vh-4rem)] pt-16 lg:pt-0">
        
        {/* Colonne Contacts */}
        <div className="w-full lg:w-80 bg-white border-r border-neutral-200 flex flex-col h-full flex-shrink-0">
          <div className="p-4 border-b border-neutral-100">
            <h1 className="font-display text-xl font-bold text-neutral-900 mb-4">Messagerie</h1>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Chercher une discussion..."
                className="w-full rounded-xl bg-neutral-100 py-2.5 pl-9 pr-4 text-sm outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {contacts.map(c => (
              <button
                key={c.id}
                onClick={() => setActiveContactId(c.id)}
                className={`w-full flex items-center gap-3 p-4 text-left transition ${activeContactId === c.id ? "bg-blue-50/50 relative" : "hover:bg-neutral-50"}`}
              >
                {activeContactId === c.id && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600" />}
                <div className="relative">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700 flex-shrink-0">
                    {c.avatar}
                  </div>
                  {c.enLigne && <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <p className="font-bold text-neutral-900 truncate">{c.nom}</p>
                    <span className="text-[10px] text-neutral-400">{messages[c.id]?.[messages[c.id].length - 1]?.heure || ""}</span>
                  </div>
                  <p className="text-xs text-neutral-500 truncate">
                    {messages[c.id]?.[messages[c.id].length - 1]?.texte || "Nouvelle discussion"}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Colonne Chat */}
        <div className="flex-1 flex flex-col h-full bg-[#f8f9fa] relative">
          
          {/* Header Chat */}
          <div className="h-16 border-b border-neutral-200 bg-white flex items-center justify-between px-6 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">
                {activeContact.avatar}
              </div>
              <div>
                <p className="font-bold text-neutral-900 leading-tight">{activeContact.nom}</p>
                <p className="text-xs text-neutral-500">{activeContact.role}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setIsCalling("audio")} className="flex h-10 w-10 items-center justify-center rounded-full text-blue-600 hover:bg-blue-50 transition">
                <Phone className="h-5 w-5" />
              </button>
              <button onClick={() => setIsCalling("video")} className="flex h-10 w-10 items-center justify-center rounded-full text-blue-600 hover:bg-blue-50 transition">
                <Video className="h-5 w-5" />
              </button>
              <button className="flex h-10 w-10 items-center justify-center rounded-full text-neutral-400 hover:bg-neutral-50 transition">
                <MoreVertical className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="flex justify-center">
              <span className="bg-neutral-200/50 text-neutral-500 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">Aujourd'hui</span>
            </div>
            {activeMessages.map(m => (
              <div key={m.id} className={`flex flex-col ${m.envoyeur === "moi" ? "items-end" : "items-start"}`}>
                <div className={`max-w-[75%] rounded-2xl px-5 py-3 ${
                  m.envoyeur === "moi" 
                    ? "bg-blue-600 text-white rounded-br-sm" 
                    : "bg-white border border-neutral-200 text-neutral-800 rounded-bl-sm"
                }`}>
                  <p className="text-sm leading-relaxed">{m.texte}</p>
                </div>
                <div className="flex items-center gap-1 mt-1.5 px-1">
                  <span className="text-[10px] font-semibold text-neutral-400">{m.heure}</span>
                  {m.envoyeur === "moi" && (
                    m.lu ? <CheckCheck className="h-3.5 w-3.5 text-blue-500" /> : <Check className="h-3.5 w-3.5 text-neutral-300" />
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Input Chat */}
          <div className="p-4 bg-white border-t border-neutral-200 flex-shrink-0">
            <form onSubmit={handleSend} className="flex items-end gap-2">
              <button type="button" className="p-3 text-neutral-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition flex-shrink-0">
                <Paperclip className="h-5 w-5" />
              </button>
              <textarea 
                value={messageText}
                onChange={e => setMessageText(e.target.value)}
                placeholder="Écrire un message..."
                className="flex-1 max-h-32 min-h-[44px] rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm outline-none focus:border-blue-400 focus:bg-white resize-none"
                rows={1}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend(e);
                  }
                }}
              />
              <button 
                type="submit" 
                disabled={!messageText.trim()}
                className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition flex-shrink-0 shadow-md shadow-blue-600/20"
              >
                <Send className="h-5 w-5" />
              </button>
            </form>
          </div>

          {/* OVERLAY APPEL AUDIO/VIDEO */}
          {isCalling && (
            <div className="absolute inset-0 z-50 bg-neutral-900 flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-200">
              {isCalling === "video" ? (
                <div className="absolute inset-0 bg-neutral-800 flex items-center justify-center">
                  <div className="text-neutral-500 flex flex-col items-center gap-4">
                    <Video className="h-16 w-16 opacity-50" />
                    <p className="font-bold text-lg">Caméra activée...</p>
                  </div>
                </div>
              ) : null}
              
              <div className="relative z-10 flex flex-col items-center">
                <div className="h-32 w-32 rounded-full bg-blue-600 border-4 border-blue-500 flex items-center justify-center text-4xl font-bold text-white mb-6 shadow-[0_0_50px_rgba(37,99,235,0.4)] animate-pulse">
                  {activeContact.avatar}
                </div>
                <h3 className="text-3xl font-display font-bold text-white mb-2">{activeContact.nom}</h3>
                <p className="text-blue-300 font-medium mb-12">{isCalling === "audio" ? "Appel vocal en cours..." : "Appel vidéo en cours..."}</p>
                
                <div className="flex items-center gap-6">
                  <button className="h-14 w-14 rounded-full bg-neutral-800/80 backdrop-blur border border-neutral-700 flex items-center justify-center text-white hover:bg-neutral-700 transition">
                    <Phone className="h-6 w-6" /> {/* Micro */}
                  </button>
                  <button 
                    onClick={() => setIsCalling(null)}
                    className="h-16 w-16 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center text-white transition shadow-lg shadow-red-500/30"
                  >
                    <Phone className="h-7 w-7 rotate-[135deg]" /> {/* Raccrocher */}
                  </button>
                  <button className="h-14 w-14 rounded-full bg-neutral-800/80 backdrop-blur border border-neutral-700 flex items-center justify-center text-white hover:bg-neutral-700 transition">
                    <Video className="h-6 w-6" />
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
