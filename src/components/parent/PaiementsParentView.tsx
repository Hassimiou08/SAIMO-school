"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "@/lib/offline/router";
import { toast } from "sonner";
import {
  CheckCircle, AlertTriangle, X, Smartphone, Loader2, XCircle,
} from "lucide-react";
import { formatGNF } from "@/lib/format";
import { actionInitierPaiementEnLigne, actionSuivrePaiementEnLigne } from "@/server/actions/parent";
import type { PaiementParentLigne } from "@/server/dal/parent";

type Etape = "select" | "method" | "phone" | "processing" | "success" | "echec";
type Methode = "orange" | "mtn";

const LIBELLE_METHODE: Record<Methode, string> = {
  orange: "Orange Money",
  mtn: "MTN Mobile Money",
};

const METHODES: { k: Methode; cls: string; badge: string; t: string }[] = [
  { k: "orange", cls: "border-orange-200 bg-orange-50 hover:bg-orange-100", badge: "bg-orange-500 text-white", t: "OM" },
  { k: "mtn", cls: "border-yellow-200 bg-yellow-50 hover:bg-yellow-100", badge: "bg-yellow-500 text-neutral-900", t: "MTN" },
];

/** Intervalle de vérification auprès de l'opérateur pendant l'attente. */
const INTERVALLE_SUIVI_MS = 2500;

export function PaiementsParentView({
  paiements,
  enfantNom,
  peutPayer,
  simulation,
}: {
  paiements: PaiementParentLigne[];
  enfantNom: string;
  /** Parent (l'élève ne paie pas). */
  peutPayer: boolean;
  /** Aucune API opérateur branchée : paiement simulé. */
  simulation: boolean;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [open, setOpen] = useState(false);
  const [facture, setFacture] = useState<PaiementParentLigne | null>(null);
  const [etape, setEtape] = useState<Etape>("select");
  const [methode, setMethode] = useState<Methode | null>(null);
  const [numero, setNumero] = useState("");
  const [recu, setRecu] = useState<string | null>(null);
  const [motifEchec, setMotifEchec] = useState<string | null>(null);
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const suiviEnCours = useRef(false);

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
    setMotifEchec(null);
    setTransactionId(null);
    setOpen(true);
  };

  const fermer = () => {
    if (etape === "processing") {
      toast.info("Paiement en attente de validation : la page se mettra à jour dès sa confirmation.");
    }
    setTransactionId(null);
    setOpen(false);
  };

  // Attente de la validation sur le téléphone : on interroge l'opérateur
  // jusqu'au résultat (réussi, refusé ou expiré).
  useEffect(() => {
    if (!transactionId) return;
    const id = setInterval(async () => {
      if (suiviEnCours.current) return;
      suiviEnCours.current = true;
      try {
        const r = await actionSuivrePaiementEnLigne(transactionId);
        if (!r.succes || r.data.statut === "en_attente") return;
        const e = r.data;
        setTransactionId(null);
        if (e.statut === "reussie") {
          setRecu(e.numeroRecu);
          setEtape("success");
        } else {
          setMotifEchec(
            e.statut === "a_verifier"
              ? "Paiement reçu, en cours de vérification par la comptabilité de l'école."
              : (e.motif ?? "Le paiement n'a pas abouti."),
          );
          setEtape("echec");
        }
        router.refresh();
      } finally {
        suiviEnCours.current = false;
      }
    }, INTERVALLE_SUIVI_MS);
    return () => clearInterval(id);
  }, [transactionId, router]);

  const payer = () => {
    if (!facture || !methode) return;
    if (typeof navigator !== "undefined" && !navigator.onLine) {
      toast.error("Le paiement en ligne nécessite une connexion Internet.");
      return;
    }
    startTransition(async () => {
      const r = await actionInitierPaiementEnLigne(facture.id, methode, numero);
      if (!r.succes) {
        toast.error(r.erreur);
        return;
      }
      setEtape("processing");
      setTransactionId(r.data.id);
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
                {etape === "success" ? "Paiement réussi" : etape === "echec" ? "Paiement non abouti" : "Paiement en ligne"}
              </h2>
              <button
                onClick={fermer}
                className="rounded-full p-2 text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-700"
              >
                <X className="h-5 w-5" />
              </button>
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
                    {METHODES.map((m) => (
                      <button
                        key={m.k}
                        onClick={() => {
                          setMethode(m.k);
                          setEtape("phone");
                        }}
                        className={`flex items-center gap-4 rounded-xl border p-4 text-left transition ${m.cls}`}
                      >
                        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${m.badge}`}>
                          {m.t}
                        </div>
                        <p className="font-bold text-neutral-900">{LIBELLE_METHODE[m.k]}</p>
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

              {etape === "phone" && facture && methode && (
                <div className="space-y-6">
                  <div className="rounded-xl border border-neutral-100 bg-neutral-50 p-4 text-center">
                    <p className="text-xs text-neutral-500">
                      Vous allez payer {formatGNF(facture.solde)} via
                    </p>
                    <p className="mt-1 font-bold text-neutral-900">{LIBELLE_METHODE[methode]}</p>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-neutral-900">
                      Numéro {LIBELLE_METHODE[methode]}
                    </label>
                    <input
                      type="tel"
                      inputMode="tel"
                      value={numero}
                      onChange={(e) => setNumero(e.target.value)}
                      placeholder="Ex : 620 00 00 00"
                      className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                      autoFocus
                    />
                    <p className="mt-2 text-xs text-neutral-500">
                      Une demande de paiement sera envoyée sur ce numéro : validez-la avec votre code secret.
                    </p>
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
                      disabled={numero.replace(/\D/g, "").length < 9 || isPending}
                      className="inline-flex w-2/3 items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 font-bold text-white transition hover:bg-emerald-700 disabled:opacity-50"
                    >
                      {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                      Confirmer le paiement
                    </button>
                  </div>
                </div>
              )}

              {etape === "processing" && (
                <div className="flex flex-col items-center justify-center space-y-4 py-10">
                  <Loader2 className="h-12 w-12 animate-spin text-emerald-600" />
                  <p className="font-bold text-neutral-900">Validez sur votre téléphone</p>
                  <p className="text-center text-sm text-neutral-500">
                    Une demande de {facture ? formatGNF(facture.solde) : ""} a été envoyée au {numero}.
                    Composez votre code secret {methode ? LIBELLE_METHODE[methode] : ""} pour confirmer.
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
                    onClick={fermer}
                    className="w-full rounded-xl bg-emerald-600 py-3 font-bold text-white transition hover:bg-emerald-700"
                  >
                    Terminer
                  </button>
                </div>
              )}

              {etape === "echec" && (
                <div className="flex flex-col items-center justify-center space-y-4 py-6">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
                    <XCircle className="h-10 w-10 text-red-600" />
                  </div>
                  <p className="px-4 text-center text-sm text-neutral-600">{motifEchec}</p>
                  <div className="flex w-full gap-3">
                    <button
                      onClick={fermer}
                      className="w-1/3 rounded-xl border border-neutral-200 py-3 font-semibold text-neutral-700 hover:bg-neutral-50"
                    >
                      Fermer
                    </button>
                    <button
                      onClick={() => setEtape("phone")}
                      className="w-2/3 rounded-xl bg-emerald-600 py-3 font-bold text-white transition hover:bg-emerald-700"
                    >
                      Réessayer
                    </button>
                  </div>
                </div>
              )}

              {simulation && etape !== "success" && (
                <p className="mt-6 border-t border-neutral-100 pt-3 text-center text-[11px] text-neutral-400">
                  Mode démonstration : aucun montant n&rsquo;est réellement débité.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
