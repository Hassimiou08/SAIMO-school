"use client";

import { useState, useRef, useEffect } from "react";
import { Search, Send, MessageSquare, Circle } from "lucide-react";
import { conversations as mockConversations, type Conversation, type Message } from "@/lib/mock-admin";
import { Sidebar } from "@/components/portal/Sidebar";
import { Topbar } from "@/components/portal/Topbar";

export default function MessageriePage() {
  const [data, setData] = useState<Conversation[]>(mockConversations);
  const [query, setQuery] = useState("");
  const [activeId, setActiveId] = useState<string>(mockConversations[0].id);
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
    <div className="min-h-screen bg-paper-100">
      <Sidebar />
      <div className="lg:pl-64 flex flex-col" style={{ minHeight: "100vh" }}>
        <Topbar />

        <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-6 lg:px-8">
          <div className="mb-6">
            <h1 className="font-display text-2xl font-bold tracking-tight text-navy-900">Messagerie</h1>
            <p className="mt-1 text-sm text-neutral-500">Communiquez avec les parents, enseignants et personnel.</p>
          </div>

          {/* Layout deux colonnes */}
          <div className="flex h-[calc(100vh-220px)] min-h-[500px] rounded-2xl border border-neutral-200 bg-white shadow-sm overflow-hidden">

            {/* ==== COLONNE GAUCHE : Contacts ==== */}
            <div className="w-80 flex-shrink-0 flex flex-col border-r border-neutral-100">
              {/* Recherche */}
              <div className="p-4 border-b border-neutral-100">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                  <input
                    type="search"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder="Rechercher..."
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 py-2.5 pl-9 pr-3.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
                  />
                </div>
              </div>

              {/* Liste des conversations */}
              <div className="flex-1 overflow-y-auto">
                {filtered.map(conv => (
                  <button
                    key={conv.id}
                    onClick={() => handleSelect(conv.id)}
                    className={`w-full text-left flex items-start gap-3 px-4 py-4 border-b border-neutral-50 transition-colors ${
                      activeId === conv.id ? "bg-blue-50" : "hover:bg-neutral-50"
                    }`}
                  >
                    {/* Avatar */}
                    <div className={`flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-full font-bold text-sm ${
                      activeId === conv.id ? "bg-blue-600 text-white" : "bg-neutral-200 text-neutral-600"
                    }`}>
                      {conv.contactName.split(" ").map(p => p[0]).join("").slice(0, 2).toUpperCase()}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className={`text-sm font-bold truncate ${activeId === conv.id ? "text-blue-700" : "text-neutral-900"}`}>
                          {conv.contactName}
                        </p>
                        <span className="text-[11px] text-neutral-400 flex-shrink-0 ml-1">{conv.lastMessageTime}</span>
                      </div>
                      <p className="text-xs text-neutral-400 truncate">{conv.contactRole}</p>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-xs text-neutral-500 truncate">{conv.lastMessage}</p>
                        {conv.unread > 0 && (
                          <span className="flex-shrink-0 ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
                            {conv.unread}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                ))}

                {filtered.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-40 text-neutral-400">
                    <MessageSquare className="h-8 w-8 mb-2 text-neutral-300" />
                    <p className="text-sm">Aucun résultat</p>
                  </div>
                )}
              </div>
            </div>

            {/* ==== COLONNE DROITE : Chat ==== */}
            <div className="flex-1 flex flex-col min-w-0">
              {activeConv ? (
                <>
                  {/* Header du chat */}
                  <div className="flex items-center gap-4 px-6 py-4 border-b border-neutral-100 bg-white">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white font-bold text-sm">
                      {activeConv.contactName.split(" ").map(p => p[0]).join("").slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-neutral-900">{activeConv.contactName}</p>
                      <p className="flex items-center gap-1.5 text-xs text-green-500 font-medium">
                        <Circle className="h-2 w-2 fill-green-500" /> En ligne
                      </p>
                    </div>
                  </div>

                  {/* Zone des messages */}
                  <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4 bg-neutral-50/50">
                    {activeConv.messages.map(msg => (
                      <div key={msg.id} className={`flex ${msg.senderId === "me" ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[70%] rounded-2xl px-4 py-2.5 shadow-sm ${
                          msg.senderId === "me"
                            ? "bg-blue-600 text-white rounded-br-md"
                            : "bg-white border border-neutral-200 text-neutral-800 rounded-bl-md"
                        }`}>
                          <p className="text-sm leading-relaxed">{msg.text}</p>
                          <p className={`text-[11px] mt-1 text-right ${msg.senderId === "me" ? "text-blue-200" : "text-neutral-400"}`}>
                            {msg.timestamp}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div ref={bottomRef} />
                  </div>

                  {/* Zone de saisie */}
                  <div className="px-6 py-4 border-t border-neutral-100 bg-white">
                    <div className="flex items-center gap-3">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={e => setNewMessage(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && handleSend()}
                        placeholder={`Message à ${activeConv.contactName}...`}
                        className="flex-1 rounded-2xl border border-neutral-200 bg-neutral-50 px-5 py-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
                      />
                      <button
                        onClick={handleSend}
                        disabled={!newMessage.trim()}
                        className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-white shadow-md shadow-blue-600/30 transition hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <Send className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-neutral-400">
                  <MessageSquare className="h-14 w-14 text-neutral-200 mb-4" />
                  <p className="text-lg font-medium text-neutral-600">Sélectionnez une conversation</p>
                  <p className="text-sm mt-1">Choisissez un contact dans la liste à gauche.</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
