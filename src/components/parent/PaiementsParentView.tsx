"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  CheckCircle, AlertTriangle, X, Smartphone, Loader2,
} from "lucide-react";
import { formatGNF } from "@/lib/format";
import { actionPayerFraisEnfant } from "@/server/actions/parent";
import type { PaiementParentLigne } from "@/server/dal/parent";

type Etape = "select" | "method" | "phone" | "processing" | "success";

export function PaiementsParentView({
  paiements,
  enfantNom,
  peutPayer,
}: {
  paiements: PaiementParentLigne[];
  enfantNom: string;
  peutPayer: boolean;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [open, setOpen] = useState(false);
  const [facture, setFacture] = useState<PaiementParentLigne | null>(null);
  const [etape, setEtape] = useState<Etape>("select");
  const [methode, setMethode] = useState<"orange" | "mtn" | "card" | null>(null);
  const [numero, setNumero] = useState("");
  const [recu, setRecu] = useState<string | null>(null);

  const totalDu = paiements.reduce((a, p) => a + p.montantDu, 0);
  const totalPaye = paiements.reduce((a, p) => a + p.montantPaye, 0);
  const solde = totalDu - totalPaye;
  const pct = totalDu > 0 ? Math.round((totalPaye / totalDu) * 100) : 100;
  const enAttente = paiements.filter((p) => p.solde > 0);

  const ouvrir = (p?: PaiementParentLigne) => {
    setFacture(p ?? null);
    setEtape(p ? "method" : "select");
    setMethode(null);
    setNumero("");
    setRecu(null);
    setOpen(true);
  };

  const payer = () => {
    if (!facture) return;
    setEtape("processing");
    startTransition(async () => {
      const r = await actionPayerFraisEnfant(
        facture.id,
        facture.solde,
        methode ?? "orange",
      );
      if (!r.succes) {
        toast.error(r.erreur);
        setEtape("phone");
        return;
      }
      setRecu(r.data.numeroRecu);
      setEtape("success");
      router.refresh();
    });
  };

  return (
    <>
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-neutral-900">Paiements</h1>
          <p className="mt-1 text-sm text-neutral-500">{enfantNom}</p>
        </div>
        {peutPayer && enAttente.length > 0 && (
          <button
            onClick={() => ouvrir()}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-emerald-600/20 transition hover:bg-emerald-700"
          >
            <Smartphone className="h-4 w-4" /> Payer en ligne
          </button>
        )}
      </div>

      <div className="mb-8 grid grid-cols-3 gap-4">
        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
          <p className="mb-1 text-xs font-medium text-neutral-500">Total écolage</p>
          <p className="text-xl font-bold text-neutral-900">{formatGNF(totalDu)}</p>
        </div>
        <div className="rounded-2xl border border-green-200 bg-green-50 p-5 shadow-sm">
          <p className="mb-1 text-xs font-medium text-green-600">Montant réglé</p>
          <p className="text-xl font-bold text-green-700">{formatGNF(totalPaye)}</p>
        </div>
        <div
          className={`rounded-2xl border p-5 shadow-sm ${solde > 0 ? "border-red-200 bg-red-50" : "border-emerald-200 bg-emerald-50"}`}
        >
          <p className={`mb-1 text-xs font-medium ${solde > 0 ? "text-red-600" : "text-emerald-600"}`}>
            Solde restant
          </p>
          <p className={`text-xl font-bold ${solde > 0 ? "text-red-700" : "text-emerald-700"}`}>
            {formatGNF(solde)}
          </p>
        </div>
      </div>

      <div className="mb-6 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-sm font-semibold text-neutral-700">Progression des paiements</p>
          <p className="text-sm font-bold text-emerald-600">{pct}%</p>
        </div>
        <div className="h-3 w-full overflow-hidden rounded-full bg-neutral-100">
          <div className="h-full rounded-full bg-emerald-500 transition-all duration-700" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-neutral-100 bg-neutral-50/50 text-xs uppercase tracking-wide text-neutral-500">
              <th className="px-6 py-4 font-semibold">Libellé</th>
              <th className="px-6 py-4 font-semibold">Montant dû</th>
              <th className="px-6 py-4 font-semibold">Réglé</th>
              <th className="px-6 py-4 font-semibold">Statut</th>
              {peutPayer && <th className="px-6 py-4 font-semibold">Action</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {paiements.map((p) => (
              <tr key={p.id} className="transition hover:bg-neutral-50">
                <td className="px-6 py-4 text-sm font-semibold text-neutral-900">
                  {p.libelle}
                  {p.echeanceDate && (
                    <span className="ml-2 text-xs font-normal text-neutral-400">éch. {p.echeanceDate}</span>
                  )}
                </td>
                <td className="px-6 py-4 font-mono text-sm text-neutral-700">{formatGNF(p.montantDu)}</td>
                <td className="px-6 py-4 font-mono text-sm font-bold text-emerald-700">
                  {formatGNF(p.montantPaye)}
                </td>
                <td className="px-6 py-4">
                  {p.statut === "Soldé" ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-2.5 py-1 text-xs font-bold text-green-700">
                      <CheckCircle className="h-3 w-3" /> Soldé
                    </span>
                  ) : p.statut === "Partiel" ? (
                    <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-bold text-blue-700">
                      Partiel
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-2.5 py-1 text-xs font-bold text-red-700">
                      <AlertTriangle className="h-3 w-3" /> Impayé
                    </span>
                  )}
                </td>
                {peutPayer && (
                  <td className="px-6 py-4">
                    {p.solde > 0 ? (
                      <button
                        onClick={() => ouvrir(p)}
                        className="rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100"
                      >
                        Payer {formatGNF(p.solde)}
                      </button>
                    ) : (
                      <span className="text-xs text-neutral-400">Réglé</span>
                    )}
                  </td>
                )}
              </tr>
            ))}
            {paiements.length === 0 && (
              <tr>
                <td colSpan={peutPayer ? 5 : 4} className="px-6 py-12 text-center text-sm text-neutral-500">
                  Aucun frais pour cette année.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modale de paiement */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/50 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-100 bg-emerald-50/50 px-6 py-4">
              <h2 className="font-display font-bold text-neutral-900">
                {etape === "success" ? "Paiement réussi" : "Paiement en ligne"}
              </h2>
              {etape !== "processing" && (
                <button
                  onClick={() => setOpen(false)}
                  className="rounded-full p-2 text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-700"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>

            <div className="p-6">
              {etape === "select" && (
                <div className="space-y-3">
                  <p className="mb-2 text-sm text-neutral-600">Sélectionnez l&rsquo;échéance à régler :</p>
                  {enAttente.length === 0 ? (
                    <div className="rounded-xl bg-green-50 p-4 text-center text-sm font-medium text-green-700">
                      Aucune échéance en attente.
                    </div>
                  ) : (
                    enAttente.map((inv) => (
                      <button
                        key={inv.id}
                        onClick={() => {
                          setFacture(inv);
                          setEtape("method");
                        }}
                        className="flex w-full items-center justify-between rounded-xl border border-neutral-200 p-4 text-left transition hover:border-emerald-500 hover:bg-emerald-50"
                      >
                        <div>
                          <p className="font-bold text-neutral-900">{inv.libelle}</p>
                          <p className="text-xs text-neutral-500">Reste à payer</p>
                        </div>
                        <p className="font-mono font-bold text-emerald-700">{formatGNF(inv.solde)}</p>
                      </button>
                    ))
                  )}
                </div>
              )}

              {etape === "method" && facture && (
                <div className="space-y-6">
                  <div className="rounded-xl border border-neutral-100 bg-neutral-50 p-4 text-center">
                    <p className="text-xs text-neutral-500">Montant à payer</p>
                    <p className="mt-1 font-mono text-2xl font-bold text-neutral-900">
                      {formatGNF(facture.solde)}
                    </p>
                  </div>
                  <div className="grid gap-3">
                    {[
                      { k: "orange", l: "Orange Money", cls: "border-orange-200 bg-orange-50 hover:bg-orange-100", badge: "bg-orange-500 text-white", t: "OM" },
                      { k: "mtn", l: "MTN Mobile Money", cls: "border-yellow-200 bg-yellow-50 hover:bg-yellow-100", badge: "bg-yellow-500 text-neutral-900", t: "MTN" },
                      { k: "card", l: "Carte bancaire", cls: "border-blue-200 bg-blue-50 hover:bg-blue-100", badge: "bg-blue-600 text-white", t: "CB" },
                    ].map((m) => (
                      <button
                        key={m.k}
                        onClick={() => {
                          setMethode(m.k as "orange" | "mtn" | "card");
                          setEtape("phone");
                        }}
                        className={`flex items-center gap-4 rounded-xl border p-4 text-left transition ${m.cls}`}
                      >
                        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${m.badge}`}>
                          {m.t}
                        </div>
                        <p className="font-bold text-neutral-900">{m.l}</p>
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setEtape("select")}
                    className="text-xs font-semibold text-neutral-500 underline hover:text-neutral-900"
                  >
                    Retour aux échéances
                  </button>
                </div>
              )}

              {etape === "phone" && facture && (
                <div className="space-y-6">
                  <div className="rounded-xl border border-neutral-100 bg-neutral-50 p-4 text-center">
                    <p className="text-xs text-neutral-500">
                      Vous allez payer {formatGNF(facture.solde)} via
                    </p>
                    <p className="mt-1 font-bold text-neutral-900">
                      {methode === "orange" ? "Orange Money" : methode === "mtn" ? "MTN Mobile Money" : "Carte bancaire"}
                    </p>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-neutral-900">
                      {methode === "card" ? "Numéro de carte" : "Numéro de téléphone"}
                    </label>
                    <input
                      type="text"
                      value={numero}
                      onChange={(e) => setNumero(e.target.value)}
                      placeholder={methode === "card" ? "XXXX XXXX XXXX XXXX" : "Ex : 620 00 00 00"}
                      className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                      autoFocus
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setEtape("method")}
                      className="w-1/3 rounded-xl border border-neutral-200 py-3 font-semibold text-neutral-700 hover:bg-neutral-50"
                    >
                      Retour
                    </button>
                    <button
                      onClick={payer}
                      disabled={numero.length < 5 || isPending}
                      className="w-2/3 rounded-xl bg-emerald-600 py-3 font-bold text-white transition hover:bg-emerald-700 disabled:opacity-50"
                    >
                      Confirmer le paiement
                    </button>
                  </div>
                </div>
              )}

              {etape === "processing" && (
                <div className="flex flex-col items-center justify-center space-y-4 py-10">
                  <Loader2 className="h-12 w-12 animate-spin text-emerald-600" />
                  <p className="font-bold text-neutral-900">Traitement en cours…</p>
                  <p className="text-center text-sm text-neutral-500">
                    Validez la transaction sur votre téléphone si nécessaire.
                  </p>
                </div>
              )}

              {etape === "success" && (
                <div className="flex flex-col items-center justify-center space-y-4 py-6">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                    <CheckCircle className="h-10 w-10 text-green-600" />
                  </div>
                  <h3 className="font-display text-xl font-bold text-neutral-900">Paiement validé !</h3>
                  <p className="px-4 text-center text-sm text-neutral-500">
                    Reçu n° <strong>{recu}</strong> — un email de confirmation vous a été envoyé.
                  </p>
                  <button
                    onClick={() => setOpen(false)}
                    className="w-full rounded-xl bg-emerald-600 py-3 font-bold text-white transition hover:bg-emerald-700"
                  >
                    Terminer
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
