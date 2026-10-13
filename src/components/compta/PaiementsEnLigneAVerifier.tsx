"use client";

import { useTransition } from "react";
import { useRouter } from "@/lib/offline/router";
import { toast } from "sonner";
import { AlertTriangle, Check } from "lucide-react";
import type { PaiementEnLigneAVerifier } from "@/server/dal/compta";
import { actionCloreTransactionEnLigne } from "@/server/actions/compta";
import { formatGNF } from "@/lib/format";

/** Paiements mobiles reçus mais non encaissés automatiquement. */
export function PaiementsEnLigneAVerifier({ lignes }: { lignes: PaiementEnLigneAVerifier[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  if (lignes.length === 0) return null;

  const clore = (id: string) => {
    const note = prompt("Qu'avez-vous fait de ce paiement ? (ex. remboursé au parent le 14/10, encaissé sur Scolarité T2)");
    if (!note) return;
    startTransition(async () => {
      const r = await actionCloreTransactionEnLigne(id, note);
      if (!r.succes) {
        toast.error(r.erreur);
        return;
      }
      toast.success("Paiement en ligne marqué comme traité.");
      router.refresh();
    });
  };

  return (
    <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-5">
      <div className="mb-3 flex items-center gap-2 text-sm font-bold text-red-800">
        <AlertTriangle className="h-4 w-4" />
        {lignes.length} paiement{lignes.length > 1 ? "s" : ""} en ligne à vérifier
      </div>
      <p className="mb-4 text-xs text-red-700">
        L&rsquo;opérateur a confirmé ces paiements, mais ils n&rsquo;ont pas pu être encaissés
        automatiquement. Remboursez le parent ou encaissez le montant sur une autre échéance, puis
        marquez-les comme traités.
      </p>
      <ul className="space-y-2">
        {lignes.map((l) => (
          <li
            key={l.id}
            className="flex flex-col gap-2 rounded-xl border border-red-100 bg-white p-3 text-sm sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="min-w-0">
              <p className="font-semibold text-neutral-900">
                {l.eleve} · {l.classe} — {l.echeance}
              </p>
              <p className="text-xs text-neutral-500">
                {formatGNF(l.montant)} · {l.operateur} {l.telephone} · réf. {l.reference} · {l.date}
              </p>
              {l.motif && <p className="mt-1 text-xs text-red-700">{l.motif}</p>}
            </div>
            <button
              onClick={() => clore(l.id)}
              disabled={isPending}
              className="inline-flex flex-none items-center gap-1.5 rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 disabled:opacity-60"
            >
              <Check className="h-3.5 w-3.5" /> Marquer traité
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
