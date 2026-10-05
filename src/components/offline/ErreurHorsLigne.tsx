"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CloudOff, RotateCcw } from "lucide-react";

/** true quand le navigateur n'a pas de connexion (évalué après le montage). */
export function useHorsLigne(): boolean {
  const [horsLigne, setHorsLigne] = useState(false);
  useEffect(() => {
    const maj = () => setHorsLigne(!navigator.onLine);
    maj();
    window.addEventListener("online", maj);
    window.addEventListener("offline", maj);
    return () => {
      window.removeEventListener("online", maj);
      window.removeEventListener("offline", maj);
    };
  }, []);
  return horsLigne;
}

/**
 * Écran affiché par les pages d'erreur quand une action réservée au mode
 * connecté a échoué faute de réseau.
 */
export function ErreurHorsLigne({ reset, accueil }: { reset: () => void; accueil: string }) {
  return (
    <div className="min-h-screen bg-paper-100 flex items-center justify-center p-6">
      <div className="max-w-md rounded-2xl border border-neutral-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-amber-600">
          <CloudOff className="h-6 w-6" />
        </div>
        <h2 className="mt-4 font-display text-lg font-bold text-navy-900">Connexion requise</h2>
        <p className="mt-2 text-sm text-ink-500">
          Cette action n&rsquo;est pas disponible hors connexion. Les notes, absences, encaissements,
          inscriptions et dépenses peuvent être saisis hors ligne : ils seront envoyés au retour de la connexion.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href={accueil} className="rounded-full border border-neutral-300 px-5 py-2.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-50">
            Accueil
          </Link>
          <button onClick={reset} className="inline-flex items-center gap-2 rounded-full bg-navy-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-600">
            <RotateCcw className="h-4 w-4" /> Réessayer
          </button>
        </div>
      </div>
    </div>
  );
}
