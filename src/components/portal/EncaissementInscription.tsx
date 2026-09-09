"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Wallet2, CheckCircle2, ChevronRight, Printer } from "lucide-react";
import { actionEnregistrerPaiement } from "@/server/actions/finance";
import { formatGNF } from "@/lib/format";

const MODES = [
  { v: "especes", l: "Espèces" },
  { v: "mobile", l: "Mobile Money" },
  { v: "virement", l: "Virement" },
  { v: "cheque", l: "Chèque" },
];

export interface FraisAEncaisser {
  id: string;
  libelle: string;
  montantDu: number;
  montantPaye: number;
}

export function EncaissementInscription({
  eleveId,
  matricule,
  frais,
}: {
  eleveId: string;
  matricule?: string;
  frais: FraisAEncaisser[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [payes, setPayes] = useState<Record<string, { recu: string; montant: number }>>({});
  const [erreur, setErreur] = useState("");

  const encaisser = (fraisId: string, fd: FormData) => {
    fd.set("fraisEleveId", fraisId);
    setErreur("");
    startTransition(async () => {
      const r = await actionEnregistrerPaiement(fd);
      if (!r.succes) setErreur(r.erreur);
      else
        setPayes((p) => ({
          ...p,
          [fraisId]: { recu: r.data.numeroRecu, montant: Number(fd.get("montant")) },
        }));
    });
  };

  const soldeLigne = (f: FraisAEncaisser) =>
    Math.max(0, f.montantDu - f.montantPaye - (payes[f.id]?.montant ?? 0));

  const totalDu = frais.reduce((s, f) => s + f.montantDu, 0);
  const totalPaye =
    frais.reduce((s, f) => s + f.montantPaye, 0) +
    Object.values(payes).reduce((s, p) => s + p.montant, 0);
  const toutSolde = frais.length > 0 && frais.every((f) => soldeLigne(f) === 0);

  return (
    <div className="space-y-5">
      {matricule && (
        <div className="rounded-2xl border border-green-200 bg-green-50 p-5 print:hidden">
          <p className="flex items-center gap-2 font-bold text-green-800">
            <CheckCircle2 className="h-5 w-5" /> Élève inscrit — matricule <span className="font-mono">{matricule}</span>
          </p>
          <p className="mt-1 text-sm text-green-700">
            Encaissez les frais ci-dessous, ou terminez et encaissez plus tard depuis Finance › Paiements.
          </p>
        </div>
      )}

      <div className="rounded-2xl border border-neutral-200 bg-white p-6">
        <h2 className="mb-4 font-display text-lg font-bold text-navy-900">Frais de l&rsquo;inscription</h2>
        {frais.length === 0 ? (
          <p className="text-sm text-neutral-500">
            Aucune échéance configurée pour ce niveau. Configurez-les dans{" "}
            <Link href="/portail/echeances" className="text-blue-600 hover:underline">Échéances &amp; Frais</Link>.
          </p>
        ) : (
          <div className="space-y-3">
            {frais.map((f) => {
              const solde = soldeLigne(f);
              const recu = payes[f.id]?.recu;
              return (
                <div key={f.id} className="rounded-xl border border-neutral-200 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-neutral-800">{f.libelle}</p>
                      <p className="text-sm text-neutral-500">
                        Dû {formatGNF(f.montantDu)}
                        {f.montantPaye > 0 && ` · déjà payé ${formatGNF(f.montantPaye)}`}
                        {solde > 0 && ` · reste ${formatGNF(solde)}`}
                      </p>
                    </div>
                    {solde === 0 ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Soldé{recu ? ` — reçu ${recu}` : ""}
                      </span>
                    ) : (
                      <form action={(fd) => encaisser(f.id, fd)} className="flex flex-wrap items-end gap-2">
                        <div>
                          <label className="text-[11px] font-medium text-neutral-500">Montant</label>
                          <input name="montant" type="number" min="1" max={solde} defaultValue={solde} className="mt-0.5 w-32 rounded-lg border border-neutral-200 px-2 py-1.5 text-sm outline-none focus:border-blue-400" />
                        </div>
                        <div>
                          <label className="text-[11px] font-medium text-neutral-500">Mode</label>
                          <select name="modePaiement" defaultValue="especes" className="mt-0.5 rounded-lg border border-neutral-200 px-2 py-1.5 text-sm outline-none focus:border-blue-400">
                            {MODES.map((m) => (<option key={m.v} value={m.v}>{m.l}</option>))}
                          </select>
                        </div>
                        <button type="submit" disabled={isPending} className="inline-flex items-center gap-1.5 rounded-lg bg-green-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-60">
                          <Wallet2 className="h-3.5 w-3.5" /> Encaisser
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              );
            })}
            <div className="flex justify-between border-t border-neutral-100 pt-3 text-sm">
              <span className="text-neutral-500">Total dû : <strong className="text-neutral-800">{formatGNF(totalDu)}</strong></span>
              <span className="text-neutral-500">Encaissé : <strong className="text-green-700">{formatGNF(totalPaye)}</strong></span>
            </div>
          </div>
        )}
        {erreur && <p className="mt-3 rounded-lg border border-red-200 bg-red-50 p-2 text-xs text-red-600">{erreur}</p>}
      </div>

      <div className="flex items-center justify-end gap-3 print:hidden">
        <button onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-full border border-neutral-300 px-5 py-2.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-50">
          <Printer className="h-4 w-4" /> Imprimer
        </button>
        <button onClick={() => router.push(`/portail/eleves/${eleveId}`)} className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-blue-700">
          {toutSolde ? "Terminer — voir la fiche" : "Terminer plus tard"} <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
