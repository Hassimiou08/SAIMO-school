"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, MessageSquare, Plus, Send, Loader2 } from "lucide-react";
import type { ConversationApercu } from "@/server/dal/admin";
import { actionCreerConversation } from "@/server/actions/admin";
import { Modale, Champ, Selecteur, Err, ModalActions } from "@/components/portal/_ui";
import { initiales } from "@/lib/roles-labels";

export function MessagerieView({
  conversations,
  contacts,
  basePath = "/portail/messagerie",
}: {
  conversations: ConversationApercu[];
  contacts: { id: string; nom: string; role: string }[];
  basePath?: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState("");
  const [modal, setModal] = useState(false);
  const [erreur, setErreur] = useState("");

  const filtered = useMemo(
    () => conversations.filter((c) => `${c.interlocuteurs} ${c.sujet ?? ""}`.toLowerCase().includes(query.toLowerCase())),
    [conversations, query],
  );

  const creer = (fd: FormData) => {
    setErreur("");
    startTransition(async () => {
      const r = await actionCreerConversation(fd);
      if (!r.succes) setErreur(r.erreur);
      else { setModal(false); router.push(`${basePath}/${r.data.id}`); }
    });
  };

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white">
      <div className="flex items-center gap-3 border-b border-neutral-100 p-5">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Rechercher une conversation..." className="w-full rounded-xl border border-neutral-200 bg-neutral-50 py-2.5 pl-9 pr-3.5 text-xs outline-none focus:border-blue-400 transition" />
        </div>
        <button onClick={() => setModal(true)} className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-blue-600 transition">
          <Plus className="h-4 w-4" /> Nouveau
        </button>
      </div>

      <ul className="divide-y divide-neutral-100">
        {filtered.map((c) => (
          <li key={c.id}>
            <Link href={`${basePath}/${c.id}`} className="flex items-center gap-4 px-5 py-4 hover:bg-neutral-50 transition">
              <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">{initiales(c.interlocuteurs)}</span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <p className="truncate text-sm font-semibold text-neutral-800">{c.interlocuteurs}</p>
                  <span className="flex-none text-[11px] text-neutral-400">{c.quand}</span>
                </div>
                <p className="truncate text-xs text-neutral-500">
                  {c.dernierAuteur && <span className="font-medium">{c.dernierAuteur.split(" ")[0]} : </span>}{c.dernierMessage}
                </p>
              </div>
              {c.nonLus > 0 && <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-500 px-1 text-[10px] font-bold text-white">{c.nonLus}</span>}
            </Link>
          </li>
        ))}
        {filtered.length === 0 && (
          <li className="px-5 py-12 text-center text-sm text-neutral-500">
            <MessageSquare className="mx-auto mb-2 h-6 w-6 text-neutral-300" /> Aucune conversation.
          </li>
        )}
      </ul>

      {modal && (
        <Modale titre="Nouvelle conversation" onClose={() => setModal(false)}>
          <form action={creer} className="space-y-4">
            <Selecteur name="destinataireId" label="Destinataire" required defaultValue="">
              <option value="" disabled>Choisir…</option>
              {contacts.map((c) => (<option key={c.id} value={c.id}>{c.nom} — {c.role}</option>))}
            </Selecteur>
            <Champ name="sujet" label="Sujet (optionnel)" />
            <div>
              <label className="text-sm font-medium text-neutral-700">Message</label>
              <textarea name="message" rows={3} required className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-blue-400" />
            </div>
            {erreur && <Err msg={erreur} />}
            <ModalActions pending={isPending} onCancel={() => setModal(false)} label="Envoyer" />
          </form>
        </Modale>
      )}
    </div>
  );
}
