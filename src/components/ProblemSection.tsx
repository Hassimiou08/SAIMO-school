"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { X, Check } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const before = [
  "Dossiers élèves sur cahiers et fichiers isolés",
  "Moyennes calculées à la main, sujettes à erreur",
  "Bulletins préparés en retard, ressaisis chaque trimestre",
  "Impayés difficiles à suivre, reçus non centralisés",
];

const after = [
  "Un seul dossier élève, à jour, consultable en 30 secondes",
  "Moyennes et classements calculés automatiquement",
  "Bulletins générés en lot, en PDF, archivés par version",
  "Soldes, reçus et impayés visibles en temps réel",
];

export function ProblemSection() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".problem-row", {
        opacity: 0,
        x: -16,
        duration: 0.5,
        stagger: 0.08,
        ease: "power2.out",
        scrollTrigger: { trigger: rootRef.current, start: "top 75%" },
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className="mx-auto max-w-6xl px-6 py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-display text-3xl font-bold tracking-tight text-navy-900 sm:text-4xl">
          Ce que le papier vous coûte chaque trimestre
        </h2>
        <p className="mt-4 text-base leading-relaxed text-ink-500">
          Chaque établissement connaît ces pertes de temps. SAIMO remplace
          les cahiers et tableurs par un référentiel unique, partagé et
          sécurisé.
        </p>
      </div>

      <div className="mt-14 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-ink-900/5 bg-white p-7">
          <p className="mb-5 text-xs font-semibold uppercase tracking-widest text-ink-500">
            Aujourd&rsquo;hui, sans SAIMO
          </p>
          <ul className="space-y-4">
            {before.map((item) => (
              <li key={item} className="problem-row flex items-start gap-3">
                <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-red-50">
                  <X className="h-3 w-3 text-red-400" />
                </span>
                <span className="text-sm leading-relaxed text-ink-700">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-teal-500/15 bg-navy-950 p-7">
          <p className="mb-5 text-xs font-semibold uppercase tracking-widest text-teal-300">
            Avec la plateforme SAIMO
          </p>
          <ul className="space-y-4">
            {after.map((item) => (
              <li key={item} className="problem-row flex items-start gap-3">
                <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-teal-400/15">
                  <Check className="h-3 w-3 text-teal-300" />
                </span>
                <span className="text-sm leading-relaxed text-white/80">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
