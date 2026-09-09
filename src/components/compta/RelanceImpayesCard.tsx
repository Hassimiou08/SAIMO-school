"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Send, Megaphone } from "lucide-react";
import { actionRelancerImpayes } from "@/server/actions/compta";
import { formatGNF } from "@/lib/format";

export function RelanceImpayesCard({
  nbParents,
  totalDu,
}: {
  nbParents: number;
  totalDu: number;
}) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");

  const relancer = () =>
    startTransition(async () => {
      const fd = new FormData();
      if (message.trim()) fd.set("message", message.trim());
      const r = await actionRelancerImpayes(fd);
      if (!r.succes) {
        toast.error(r.erreur);
        return;
      }
      const { envoyes, sansEmail } = r.data;
      toast.success(
        `${envoyes} relance(s) envoyée(s)` +
          (sansEmail > 0 ? ` — ${sansEmail} frais sans e-mail parent` : ""),
      );
      setMessage("");
    });

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
          <Megaphone className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-neutral-900">
            Relance des impayés
          </h2>
          <p className="text-xs text-neutral-500">
            {nbParents > 0
              ? `${nbParents} parent(s) débiteur(s) — ${formatGNF(totalDu)} dû`
              : "Aucun frais échu impayé"}
          </p>
        </div>
      </div>

      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={4}
        placeholder="Message personnalisé (optionnel). Un récapitulatif des sommes dues est ajouté automatiquement à chaque e-mail."
        className="w-full resize-none rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
      />

      <div className="mt-4 flex justify-end">
        <button
          onClick={relancer}
          disabled={isPending || nbParents === 0}
          className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-amber-500/20 transition hover:bg-amber-600 disabled:opacity-50"
        >
          <Send className="h-4 w-4" />
          {isPending ? "Envoi…" : "Envoyer les relances"}
        </button>
      </div>
    </div>
  );
}
