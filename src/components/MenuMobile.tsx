"use client";

import { useEffect, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

/**
 * Ouverture du menu latéral sur petit écran. Le bouton (dans la topbar) et
 * le menu (sidebar) sont rendus séparément par chaque page : l'état est donc
 * partagé via un petit store module plutôt qu'un contexte React.
 */
let ouvert = false;
const abonnes = new Set<() => void>();

function definir(valeur: boolean) {
  if (ouvert === valeur) return;
  ouvert = valeur;
  abonnes.forEach((f) => f());
}

function abonner(f: () => void) {
  abonnes.add(f);
  return () => abonnes.delete(f);
}

export function useMenuMobile() {
  const estOuvert = useSyncExternalStore(abonner, () => ouvert, () => false);
  return {
    ouvert: estOuvert,
    basculer: () => definir(!ouvert),
    fermer: () => definir(false),
  };
}

/** Classes d'affichage du menu : tiroir sur mobile quand ouvert, fixe dès lg. */
export function classesMenu(estOuvert: boolean) {
  return estOuvert ? "flex shadow-2xl" : "hidden lg:flex";
}

/** Bouton « menu » de la topbar, visible uniquement sous lg. */
export function BoutonMenuMobile({ className = "" }: { className?: string }) {
  const { ouvert: estOuvert, basculer } = useMenuMobile();
  return (
    <button
      type="button"
      onClick={basculer}
      aria-label="Ouvrir le menu"
      aria-expanded={estOuvert}
      className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl border border-neutral-200 text-neutral-600 hover:bg-neutral-50 lg:hidden ${className}`}
    >
      <Menu className="h-4 w-4" />
    </button>
  );
}

/**
 * Fond assombri derrière le menu ouvert sur mobile. Ferme le menu au clic,
 * à la touche Échap et à chaque changement de page.
 */
export function FondMenuMobile() {
  const { ouvert: estOuvert, fermer } = useMenuMobile();
  const pathname = usePathname();

  useEffect(() => {
    definir(false);
  }, [pathname]);

  useEffect(() => {
    if (!estOuvert) return;
    const surTouche = (e: KeyboardEvent) => {
      if (e.key === "Escape") definir(false);
    };
    window.addEventListener("keydown", surTouche);
    return () => window.removeEventListener("keydown", surTouche);
  }, [estOuvert]);

  if (!estOuvert) return null;
  return (
    <div
      aria-hidden
      onClick={fermer}
      className="fixed inset-0 z-[35] bg-navy-950/40 backdrop-blur-[1px] lg:hidden"
    />
  );
}
