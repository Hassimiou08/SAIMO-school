"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import { Sparkles, Send, Loader2, Bot, User } from "lucide-react";
import { actionChatIA } from "@/server/actions/admin";
import { useCurrentUserOptional } from "@/components/providers/UserProvider";

type Msg = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "Combien d'élèves avons-nous et dans combien de classes ?",
  "Où en est le recouvrement des frais ?",
  "Rédige une annonce courte pour la réunion des parents.",
  "Comment j'encaisse un paiement pour un élève ?",
  "Quelles évaluations restent à verrouiller ?",
];

export function AIAssistant() {
  const user = useCurrentUserOptional();
  const prenom = user?.name?.split(" ")[0] ?? "";
  const [isPending, startTransition] = useTransition();
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content: `Salut${prenom ? " " + prenom : ""} 👋 Je suis l'assistant SAIMO. Pose-moi une question sur l'établissement, les élèves, les finances… ou demande-moi de rédiger une annonce.`,
    },
  ]);
  const [texte, setTexte] = useState("");
  const [erreur, setErreur] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, isPending]);

  const envoyer = (contenu: string) => {
    const q = contenu.trim();
    if (!q || isPending) return;
    setErreur("");
    setTexte("");
    const suite: Msg[] = [...messages, { role: "user", content: q }];
    setMessages(suite);
    startTransition(async () => {
      try {
        const r = await actionChatIA(suite.map((m) => ({ role: m.role, content: m.content })));
        if (!r.succes) {
          setErreur(r.erreur);
          setMessages((m) => m.slice(0, -1)); // retire la question ratée
          setTexte(q);
        } else {
          setMessages((m) => [...m, { role: "assistant", content: r.data.reponse }]);
        }
      } catch {
        setErreur("Erreur lors de l'appel à l'assistant.");
        setMessages((m) => m.slice(0, -1));
        setTexte(q);
      }
    });
  };

  return (
    <div className="mx-auto flex h-[calc(100vh-13rem)] max-w-3xl flex-col rounded-2xl border border-neutral-200 bg-white">
      <div className="flex items-center gap-2 border-b border-neutral-100 px-5 py-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white"><Sparkles className="h-4 w-4" /></span>
        <div>
          <p className="text-sm font-bold text-navy-900">Assistant SAIMO</p>
          <p className="text-[11px] text-neutral-400">Répond d'après les données de votre établissement · propose, ne décide pas (RM-15)</p>
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto p-5">
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
            <span className={`flex h-8 w-8 flex-none items-center justify-center rounded-full ${m.role === "user" ? "bg-neutral-200 text-neutral-600" : "bg-blue-100 text-blue-700"}`}>
              {m.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
            </span>
            <div className={`max-w-[80%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm ${m.role === "user" ? "bg-blue-600 text-white" : "bg-neutral-100 text-neutral-800"}`}>
              {m.content}
            </div>
          </div>
        ))}
        {isPending && (
          <div className="flex gap-3">
            <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-blue-100 text-blue-700"><Bot className="h-4 w-4" /></span>
            <div className="rounded-2xl bg-neutral-100 px-4 py-2.5 text-sm text-neutral-500"><Loader2 className="inline h-4 w-4 animate-spin" /> …</div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {messages.length <= 1 && (
        <div className="flex flex-wrap gap-2 px-5 pb-2">
          {SUGGESTIONS.map((s) => (
            <button key={s} onClick={() => envoyer(s)} disabled={isPending} className="rounded-full border border-neutral-200 px-3 py-1.5 text-xs text-neutral-600 hover:bg-neutral-50 disabled:opacity-50">
              {s}
            </button>
          ))}
        </div>
      )}

      {erreur && <p className="mx-5 rounded-lg border border-red-200 bg-red-50 p-2 text-xs text-red-600">{erreur}</p>}

      <form
        onSubmit={(e) => { e.preventDefault(); envoyer(texte); }}
        className="flex items-end gap-2 border-t border-neutral-100 p-4"
      >
        <textarea
          value={texte}
          onChange={(e) => setTexte(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); envoyer(texte); }
          }}
          rows={1}
          placeholder="Écrivez votre message…  (Entrée pour envoyer)"
          className="max-h-32 flex-1 resize-none rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-sm outline-none focus:border-blue-400"
        />
        <button type="submit" disabled={isPending || !texte.trim()} className="inline-flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50">
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </button>
      </form>
    </div>
  );
}
