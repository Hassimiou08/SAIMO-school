"use client";

import { useState, useRef, useEffect } from "react";
import { Search, Send, MessageSquare, Circle } from "lucide-react";
import { ParentSidebar } from "@/components/parent/ParentSidebar";
import { ParentTopbar } from "@/components/parent/ParentTopbar";
import { type Message, type Conversation } from "@/lib/mock-admin";

const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: "1",
    contactName: "Administration SAIMO",
    contactRole: "Secretariat",
    lastMessage: "Bonjour, comment pouvons-nous vous aider ?",
    lastMessageTime: "09:00",
    unread: 1,
    messages: [
      { id: "m1", senderId: "other", text: "Bonjour M. Conde. Bienvenue sur la messagerie SAIMO. Comment pouvons-nous vous aider ?", timestamp: "09:00" },
    ],
  },
  {
    id: "2",
    contactName: "M. Camara (Maths)",
    contactRole: "Professeur Principal - 6eme A",
    lastMessage: "Bonjour, votre fils progresse bien.",
    lastMessageTime: "Hier",
    unread: 0,
    messages: [
      { id: "m2", senderId: "other", text: "Bonjour M. Conde. Votre fils Amadou progresse bien en mathematiques. Continuez a l encourager.", timestamp: "14:30" },
    ],
  },
];

export default function ParentMessageriePage() {
  const [data, setData] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [query, setQuery] = useState("");
  const [activeId, setActiveId] = useState("1");
  const [newMessage, setNewMessage] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const filtered = data.filter(c =>
    c.contactName.toLowerCase().includes(query.toLowerCase())
  );
  const activeConv = data.find(c => c.id === activeId)!;

  const handleSend = () => {
    if (!newMessage.trim()) return;
    const msg: Message = {
      id: Date.now().toString(),
      senderId: "me",
      text: newMessage.trim(),
      timestamp: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
    };
    setData(data.map(c =>
      c.id === activeId
        ? { ...c, messages: [...c.messages, msg], lastMessage: msg.text, lastMessageTime: msg.timestamp, unread: 0 }
        : c
    ));
    setNewMessage("");
  };

  const handleSelect = (id: string) => {
    setActiveId(id);
    setData(data.map(c => c.id === id ? { ...c, unread: 0 } : c));
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeConv?.messages.length]);

  return (
    <div className="min-h-screen bg-neutral-50">
      <ParentSidebar />
      <div className="lg:pl-64 flex flex-col" style={{ minHeight: "100vh" }}>
        <ParentTopbar />

        <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-6 lg:px-8">
          <div className="mb-6">
            <h1 className="font-display text-2xl font-bold tracking-tight text-neutral-900">Messagerie</h1>
            <p className="mt-1 text-sm text-neutral-500">Contactez l administration et les enseignants.</p>
          </div>

          <div className="flex h-[calc(100vh-220px)] min-h-[500px] rounded-2xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
            {/* Colonne gauche */}
            <div className="w-72 flex-shrink-0 flex flex-col border-r border-neutral-100">
              <div className="p-4 border-b border-neutral-100">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                  <input
                    type="search"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder="Rechercher..."
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 py-2.5 pl-9 pr-3.5 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition"
                  />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto">
                {filtered.map(conv => (
                  <button
                    key={conv.id}
                    onClick={() => handleSelect(conv.id)}
                    className={`w-full text-left flex items-start gap-3 px-4 py-4 border-b border-neutral-50 transition-colors ${
                      activeId === conv.id ? "bg-emerald-50" : "hover:bg-neutral-50"
                    }`}
                  >
                    <div className={`flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-full font-bold text-sm ${
                      activeId === conv.id ? "bg-emerald-600 text-white" : "bg-neutral-200 text-neutral-600"
                    }`}>
                      {conv.contactName.split(" ").map(p => p[0]).join("").slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className={`text-sm font-bold truncate ${activeId === conv.id ? "text-emerald-700" : "text-neutral-900"}`}>
                          {conv.contactName}
                        </p>
                        <span className="text-[11px] text-neutral-400 flex-shrink-0 ml-1">{conv.lastMessageTime}</span>
                      </div>
                      <p className="text-xs text-neutral-400 truncate">{conv.contactRole}</p>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-xs text-neutral-500 truncate">{conv.lastMessage}</p>
                        {conv.unread > 0 && (
                          <span className="flex-shrink-0 ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-bold text-white">
                            {conv.unread}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Colonne droite - Chat */}
            <div className="flex-1 flex flex-col min-w-0">
              {activeConv && (
                <>
                  <div className="flex items-center gap-4 px-6 py-4 border-b border-neutral-100 bg-white">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-white font-bold text-sm">
                      {activeConv.contactName.split(" ").map(p => p[0]).join("").slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-neutral-900">{activeConv.contactName}</p>
                      <p className="flex items-center gap-1.5 text-xs text-emerald-500 font-medium">
                        <Circle className="h-2 w-2 fill-emerald-500" /> Disponible
                      </p>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4 bg-neutral-50/50">
                    {activeConv.messages.map(msg => (
                      <div key={msg.id} className={`flex ${msg.senderId === "me" ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[70%] rounded-2xl px-4 py-2.5 shadow-sm ${
                          msg.senderId === "me"
                            ? "bg-emerald-600 text-white rounded-br-md"
                            : "bg-white border border-neutral-200 text-neutral-800 rounded-bl-md"
                        }`}>
                          <p className="text-sm leading-relaxed">{msg.text}</p>
                          <p className={`text-[11px] mt-1 text-right ${msg.senderId === "me" ? "text-emerald-200" : "text-neutral-400"}`}>
                            {msg.timestamp}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div ref={bottomRef} />
                  </div>

                  <div className="px-6 py-4 border-t border-neutral-100 bg-white">
                    <div className="flex items-center gap-3">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={e => setNewMessage(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && handleSend()}
                        placeholder={`Message a ${activeConv.contactName}...`}
                        className="flex-1 rounded-2xl border border-neutral-200 bg-neutral-50 px-5 py-3 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition"
                      />
                      <button
                        onClick={handleSend}
                        disabled={!newMessage.trim()}
                        className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white shadow-md shadow-emerald-600/30 transition hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <Send className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
