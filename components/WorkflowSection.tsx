"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const steps = [
  {
    n: "01",
    title: "Inscription",
    desc: "Le secrétaire recherche l'élève, crée le dossier, ajoute les parents et affecte la classe.",
  },
  {
    n: "02",
    title: "Notes",
    desc: "L'enseignant saisit les résultats de sa classe ; les notes validées sont verrouillées.",
  },
  {
    n: "03",
    title: "Bulletin",
    desc: "Moyennes, rangs et appréciations sont calculés puis exportés en PDF, par lot.",
  },
  {
    n: "04",
    title: "Paiement",
    desc: "Le comptable enregistre le règlement ; le solde et le reçu numéroté sont générés.",
  },
];

export function WorkflowSection() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".step-card", {
        opacity: 0,
        y: 24,
        duration: 0.55,
        stagger: 0.12,
        ease: "power2.out",
        scrollTrigger: { trigger: rootRef.current, start: "top 70%" },
      });
      gsap.from(".step-line", {
        scaleX: 0,
        transformOrigin: "left",
        duration: 1,
        ease: "power2.inOut",
        scrollTrigger: { trigger: rootRef.current, start: "top 65%" },
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="parcours" ref={rootRef} className="mx-auto max-w-6xl px-6 py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-display text-3xl font-bold tracking-tight text-navy-900 sm:text-4xl">
          Un parcours, du premier jour au reçu de paiement
        </h2>
        <p className="mt-4 text-base leading-relaxed text-ink-500">
          Quatre étapes qui suivent exactement le déroulement réel d&rsquo;une
          année scolaire dans votre établissement.
        </p>
      </div>

      <div className="relative mt-16">
        <div className="step-line absolute left-0 right-0 top-6 hidden h-px bg-navy-900/10 md:block" />
        <div className="grid gap-8 md:grid-cols-4">
          {steps.map((step) => (
            <div key={step.n} className="step-card relative">
              <div className="relative z-10 mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-navy-950 font-mono text-sm font-medium text-teal-300">
                {step.n}
              </div>
              <h3 className="font-display text-base font-semibold text-navy-900">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-500">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
