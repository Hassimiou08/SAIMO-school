"use client";

import { toast } from "sonner";

import { useState, useTransition, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Send, Loader2 } from "lucide-react";
import { actionEnvoyerMessage } from "@/server/actions/admin";

export function MessageThread({
  conversation,
  retour = "/portail/messagerie",
}: {
  conversation: {
    id: string;
    sujet: string | null;
    participants: string[];
    messages: { id: string; contenu: string; auteur: string; mien: boolean; quand: string }[];
  };
  retour?: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [texte, setTexte] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation.messages.length]);

  const envoyer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!texte.trim()) return;
    const contenu = texte;
    setTexte("");
    startTransition(async () => {
      const r = await actionEnvoyerMessage(conversation.id, contenu);
      if (!r.succes) toast.error(r.erreur);
      else router.refresh();
    });
  };

  return (
    <div className="flex h-[calc(100vh-10rem)] flex-col rounded-2xl border border-neutral-200 bg-white">
      <div className="flex items-center gap-3 border-b border-neutral-100 p-4">
        <Link href={retour} className="text-neutral-400 hover:text-neutral-700"><ArrowLeft className="h-5 w-5" /></Link>
        <div>
          <p className="text-sm font-bold text-neutral-900">{conversation.participants.join(", ")}</p>
          {conversation.sujet && <p className="text-xs text-neutral-500">{conversation.sujet}</p>}
        </div>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto p-5">
        {conversation.messages.map((m) => (
          <div key={m.id} className={`flex ${m.mien ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${m.mien ? "bg-blue-600 text-white" : "bg-neutral-100 text-neutral-800"}`}>
              {!m.mien && <p className="mb-0.5 text-[11px] font-semibold text-neutral-500">{m.auteur}</p>}
              <p className="whitespace-pre-wrap">{m.contenu}</p>
              <p className={`mt-1 text-[10px] ${m.mien ? "text-blue-100" : "text-neutral-400"}`}>{m.quand}</p>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={envoyer} className="flex items-center gap-2 border-t border-neutral-100 p-4">
        <input value={texte} onChange={(e) => setTexte(e.target.value)} placeholder="Votre message…" className="flex-1 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-sm outline-none focus:border-blue-400" />
        <button type="submit" disabled={isPending || !texte.trim()} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-50">
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </button>
      </form>
    </div>
  );
}
