"use client";

import { useMemo } from "react";
import { useRouter as useRouterNext } from "next/navigation";

/**
 * useRouter de Next.js, adapté au hors-ligne : sans réseau, `push` et
 * `replace` font un chargement complet de la page, que le service worker sert
 * depuis les pages enregistrées. (La navigation interne de Next.js, elle,
 * échouerait et finirait sur la page d'erreur.)
 */
export function useRouter(): ReturnType<typeof useRouterNext> {
  const router = useRouterNext();
  return useMemo(
    () => ({
      ...router,
      push: (href, options) => {
        if (navigator.onLine) router.push(href, options);
        else window.location.assign(href);
      },
      replace: (href, options) => {
        if (navigator.onLine) router.replace(href, options);
        else window.location.replace(href);
      },
    }),
    [router],
  );
}
