"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Animations GSAP du site d'une école, dans l'esprit des pages SAIMO.
 * Les pages balisent leurs éléments, ce composant les anime à chaque page :
 * - data-anim="intro"  : en-tête, apparition en cascade au chargement ;
 * - data-anim="reveal" : bloc qui monte en fondu quand il entre à l'écran ;
 * - data-anim="cartes" : les enfants du bloc arrivent l'un après l'autre au défilement.
 * Rien n'est animé si le visiteur a demandé de réduire les animations.
 */
export function EcoleAnimations() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.from("[data-anim='intro']", {
        opacity: 0,
        y: 30,
        duration: 0.9,
        stagger: 0.12,
        ease: "power3.out",
      });

      gsap.utils.toArray<HTMLElement>("[data-anim='reveal']").forEach((el) => {
        gsap.from(el, {
          opacity: 0,
          y: 40,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
      });

      gsap.utils.toArray<HTMLElement>("[data-anim='cartes']").forEach((groupe) => {
        gsap.from(groupe.children, {
          opacity: 0,
          y: 30,
          duration: 0.6,
          stagger: 0.1,
          ease: "back.out(1.4)",
          scrollTrigger: { trigger: groupe, start: "top 88%", once: true },
        });
      });
    });

    // Les hauteurs changent une fois les polices et images chargées.
    const rafraichir = () => ScrollTrigger.refresh();
    window.addEventListener("load", rafraichir);
    return () => {
      window.removeEventListener("load", rafraichir);
      ctx.revert();
    };
  }, [pathname]);

  return null;
}
