"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "@/lib/offline/router";
import { toast } from "sonner";
import {
  Cloud, CloudOff, RefreshCw, Download, AlertTriangle, Trash2, RotateCcw, X, Loader2,
} from "lucide-react";
import { useCurrentUserOptional } from "@/components/providers/UserProvider";
import {
  EVENEMENT_FILE, synchroniser, notifierChangement, definirUtilisateurHorsLigne,
} from "@/lib/offline/client";
import {
  listerOperations, supprimerOperation, remettreEnAttente, type OperationLocale,
} from "@/lib/offline/outbox";
import {
  verifierUtilisateurHorsLigne, lireDatesPreparation, ecrireDatesPreparation,
} from "@/lib/offline/cache";

// Rafraîchissement des pages enregistrées pour le hors-ligne.
const INTERVALLE_ESSENTIELLES_MS = 30 * 60_000;
const INTERVALLE_DETAILS_MS = 12 * 3600_000;
const INTERVALLE_SYNCHRO_MS = 60_000;

function depuis(ts?: number): string {
  if (!ts) return "jamais";
  const min = Math.round((Date.now() - ts) / 60_000);
  if (min < 1) return "à l'instant";
  if (min < 60) return `il y a ${min} min`;
  const h = Math.round(min / 60);
  if (h < 24) return `il y a ${h} h`;
  return `il y a ${Math.round(h / 24)} j`;
}

export function SyncHorsLigne() {
  const router = useRouter();
  const user = useCurrentUserOptional();
  const utilisateurId = user?.id;

  const [enLigne, setEnLigne] = useState(true);
  const [ops, setOps] = useState<OperationLocale[]>([]);
  const [ouvert, setOuvert] = useState(false);
  const [synchro, setSynchro] = useState(false);
  const [sessionExpiree, setSessionExpiree] = useState(false);
  const [preparation, setPreparation] = useState<{ faites: number; total: number } | null>(null);
  const [dates, setDates] = useState(lireDatesPreparation);
  const preparationEnCours = useRef(false);
  const datesEnAttente = useRef<{ essentielles?: number; details?: number } | null>(null);

  const recharger = useCallback(async () => {
    if (!utilisateurId) return;
    try {
      setOps(await listerOperations(utilisateurId));
    } catch {
      /* IndexedDB indisponible */
    }
  }, [utilisateurId]);

  const lancerSynchro = useCallback(async () => {
    if (!utilisateurId || !navigator.onLine) return;
    setSynchro(true);
    const etat = await synchroniser(utilisateurId);
    setSessionExpiree(etat === "session_expiree");
    setSynchro(false);
  }, [utilisateurId]);

  /** Télécharge les pages utiles pour travailler hors connexion. */
  const preparer = useCallback(async (forcer = false) => {
    if (!navigator.onLine || preparationEnCours.current) return;
    const sw = navigator.serviceWorker?.controller;
    if (!sw) {
      if (forcer) toast.info("Le mode hors ligne sera disponible au prochain chargement de la page.");
      return;
    }
    const d = lireDatesPreparation();
    const maintenant = Date.now();
    const majEssentielles = forcer || !d.essentielles || maintenant - d.essentielles > INTERVALLE_ESSENTIELLES_MS;
    const majDetails = forcer || !d.details || maintenant - d.details > INTERVALLE_DETAILS_MS;
    if (!majEssentielles && !majDetails) return;

    let liste: { essentielles: string[]; details: string[] };
    try {
      const res = await fetch("/api/offline/pages", { cache: "no-store" });
      if (!res.ok) return;
      liste = await res.json();
    } catch {
      return;
    }
    const pages = [
      ...(majEssentielles ? liste.essentielles : []),
      ...(majDetails ? liste.details : []),
    ];
    if (!pages.length) return;

    preparationEnCours.current = true;
    setPreparation({ faites: 0, total: pages.length });
    const nouvelles = {
      essentielles: majEssentielles ? maintenant : d.essentielles,
      details: majDetails ? maintenant : d.details,
    };
    datesEnAttente.current = nouvelles;
    sw.postMessage({ type: "PREPARER", pages });
    // La fin est signalée par le service worker (voir l'écouteur plus bas).
    // Filet de sécurité si le navigateur l'arrête en cours de route.
    setTimeout(() => {
      if (!preparationEnCours.current) return;
      preparationEnCours.current = false;
      setPreparation(null);
    }, 10 * 60_000);
  }, []);

  // Initialisation : utilisateur, état réseau, file, préparation.
  useEffect(() => {
    if (!utilisateurId) return;
    definirUtilisateurHorsLigne(utilisateurId);
    void (async () => {
      await verifierUtilisateurHorsLigne(utilisateurId);
      setEnLigne(navigator.onLine);
      setDates(lireDatesPreparation());
      await recharger();
      await lancerSynchro();
      await preparer();
    })();
  }, [utilisateurId, recharger, lancerSynchro, preparer]);

  // Hors connexion, la navigation interne de Next.js (chargement de la page
  // par le réseau) échoue et finit sur la page d'erreur. On la remplace par
  // un chargement complet : le service worker sert alors la page enregistrée.
  useEffect(() => {
    const surClic = (e: MouseEvent) => {
      if (navigator.onLine || e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const lien = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!lien || lien.target === "_blank" || lien.hasAttribute("download")) return;
      const url = new URL(lien.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname && url.search === window.location.search) return;
      e.preventDefault();
      e.stopPropagation();
      window.location.assign(url.toString());
    };
    // Phase de capture sur window : avant que Next.js ne traite le clic.
    window.addEventListener("click", surClic, true);
    return () => window.removeEventListener("click", surClic, true);
  }, []);

  // Réseau, file d'attente, service worker.
  useEffect(() => {
    if (!utilisateurId) return;

    const surEnLigne = async () => {
      setEnLigne(true);
      await lancerSynchro();
      await preparer();
    };
    const surHorsLigne = () => setEnLigne(false);

    const surFile = (e: Event) => {
      void recharger();
      const detail = (e as CustomEvent<{ appliquees?: number; erreurs?: number } | undefined>).detail;
      if (detail?.appliquees) {
        toast.success(
          `${detail.appliquees} opération${detail.appliquees > 1 ? "s" : ""} hors ligne synchronisée${detail.appliquees > 1 ? "s" : ""}.`,
        );
        router.refresh();
      }
      if (detail?.erreurs) {
        toast.error(
          `${detail.erreurs} opération${detail.erreurs > 1 ? "s" : ""} refusée${detail.erreurs > 1 ? "s" : ""} à la synchronisation.`,
        );
        setOuvert(true);
      }
    };

    const surMessageSW = (e: MessageEvent) => {
      const m = e.data ?? {};
      if (m.type === "PREPARATION_PROGRES") setPreparation({ faites: m.faites, total: m.total });
      if (m.type === "PREPARATION_TERMINEE") {
        preparationEnCours.current = false;
        setPreparation(null);
        if (datesEnAttente.current) {
          ecrireDatesPreparation(datesEnAttente.current);
          setDates(datesEnAttente.current);
          datesEnAttente.current = null;
        }
      }
    };

    window.addEventListener("online", surEnLigne);
    window.addEventListener("offline", surHorsLigne);
    window.addEventListener(EVENEMENT_FILE, surFile);
    navigator.serviceWorker?.addEventListener("message", surMessageSW);
    const minuteur = setInterval(() => {
      if (navigator.onLine) void lancerSynchro();
    }, INTERVALLE_SYNCHRO_MS);

    return () => {
      window.removeEventListener("online", surEnLigne);
      window.removeEventListener("offline", surHorsLigne);
      window.removeEventListener(EVENEMENT_FILE, surFile);
      navigator.serviceWorker?.removeEventListener("message", surMessageSW);
      clearInterval(minuteur);
    };
  }, [utilisateurId, recharger, lancerSynchro, preparer, router]);

  if (!utilisateurId) return null;

  const enAttente = ops.filter((o) => o.statut === "en_attente");
  const erreurs = ops.filter((o) => o.statut === "erreur");

  const reessayer = async (op: OperationLocale) => {
    await remettreEnAttente(op);
    notifierChangement();
    await lancerSynchro();
  };
  const supprimer = async (op: OperationLocale) => {
    if (!confirm(`Supprimer définitivement cette saisie ?\n\n${op.libelle}`)) return;
    await supprimerOperation(op.id);
    notifierChangement();
  };

  let pastille: { texte: string; classe: string; icone: React.ReactNode };
  if (erreurs.length) {
    pastille = { texte: `${erreurs.length} à corriger`, classe: "bg-red-600 text-white", icone: <AlertTriangle className="h-4 w-4" /> };
  } else if (!enLigne) {
    pastille = {
      texte: enAttente.length ? `Hors ligne · ${enAttente.length} en attente` : "Hors ligne",
      classe: "bg-amber-500 text-white",
      icone: <CloudOff className="h-4 w-4" />,
    };
  } else if (synchro || enAttente.length) {
    pastille = {
      texte: `Synchronisation… ${enAttente.length || ""}`.trim(),
      classe: "bg-blue-600 text-white",
      icone: <RefreshCw className="h-4 w-4 animate-spin" />,
    };
  } else if (preparation) {
    pastille = {
      texte: `Préparation hors ligne ${preparation.faites}/${preparation.total}`,
      classe: "bg-white text-neutral-700 border border-neutral-200",
      icone: <Loader2 className="h-4 w-4 animate-spin" />,
    };
  } else {
    pastille = { texte: "", classe: "bg-white text-green-600 border border-neutral-200", icone: <Cloud className="h-4 w-4" /> };
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2 print:hidden">
      {ouvert && (
        <div className="w-[min(380px,calc(100vw-32px))] rounded-2xl border border-neutral-200 bg-white shadow-xl">
          <div className="flex items-center justify-between border-b border-neutral-100 px-4 py-3">
            <p className="text-sm font-bold text-neutral-900">Mode hors ligne</p>
            <button onClick={() => setOuvert(false)} className="rounded-lg p-1 text-neutral-400 hover:bg-neutral-100" aria-label="Fermer">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-3 px-4 py-3 text-xs text-neutral-600">
            <p className="flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${enLigne ? "bg-green-500" : "bg-amber-500"}`} />
              {enLigne ? "Connecté" : "Hors connexion : vos saisies sont gardées sur cet appareil."}
            </p>
            {sessionExpiree && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-red-700">
                Session expirée : reconnectez-vous pour envoyer vos saisies. Elles restent sur cet appareil.
              </p>
            )}
            <p>
              Données hors ligne mises à jour {depuis(dates.essentielles)}
              {preparation && ` — en cours (${preparation.faites}/${preparation.total})`}.
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => void preparer(true)}
                disabled={!enLigne || !!preparation}
                className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 px-3 py-1.5 font-semibold text-neutral-700 hover:bg-neutral-50 disabled:opacity-50"
              >
                <Download className="h-3.5 w-3.5" /> Mettre à jour pour le hors-ligne
              </button>
              {enAttente.length > 0 && (
                <button
                  onClick={() => void lancerSynchro()}
                  disabled={!enLigne || synchro}
                  className="inline-flex items-center gap-1.5 rounded-full bg-blue-600 px-3 py-1.5 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  <RefreshCw className="h-3.5 w-3.5" /> Synchroniser
                </button>
              )}
            </div>
          </div>

          {ops.length > 0 && (
            <ul className="max-h-72 divide-y divide-neutral-100 overflow-y-auto border-t border-neutral-100">
              {ops.map((op) => (
                <li key={op.id} className="px-4 py-2.5 text-xs">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-semibold text-neutral-800">{op.libelle}</p>
                      <p className="text-neutral-400">
                        Saisi le {new Date(op.saisieLe).toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" })}
                      </p>
                      {op.statut === "erreur" && <p className="mt-1 text-red-600">{op.erreur}</p>}
                    </div>
                    {op.statut === "erreur" ? (
                      <div className="flex flex-none gap-1">
                        <button onClick={() => void reessayer(op)} className="rounded-lg p-1.5 text-blue-600 hover:bg-blue-50" title="Réessayer">
                          <RotateCcw className="h-3.5 w-3.5" />
                        </button>
                        <button onClick={() => void supprimer(op)} className="rounded-lg p-1.5 text-red-600 hover:bg-red-50" title="Supprimer">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ) : (
                      <span className="flex-none rounded-full bg-amber-100 px-2 py-0.5 font-semibold text-amber-700">En attente</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <button
        onClick={() => setOuvert((o) => !o)}
        className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold shadow-lg transition ${pastille.classe}`}
        title="Mode hors ligne"
      >
        {pastille.icone}
        {pastille.texte}
      </button>
    </div>
  );
}
