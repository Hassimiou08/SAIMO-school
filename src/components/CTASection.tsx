"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function CTASection() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".cta-inner", {
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: { trigger: rootRef.current, start: "top 80%" },
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="pilote" ref={rootRef} className="mx-auto max-w-6xl px-6 py-24">
      <div className="cta-inner relative overflow-hidden rounded-3xl bg-gradient-to-br from-navy-900 to-navy-950 px-8 py-16 text-center sm:px-16">
        <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-teal-400/15 blur-[100px]" />
        <div className="relative">
          <h2 className="mx-auto max-w-xl font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Devenez l&rsquo;établissement pilote de SAIMO
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-white/60">
            Nous accompagnons le lancement pilote de bout en bout : reprise
            des données, formation de l&rsquo;équipe et support renforcé
            pendant le démarrage.
          </p>
          <a
            href="mailto:contact@saimo.gn"
            className="group mt-8 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-navy-950 transition-transform hover:-translate-y-0.5"
          >
            Contacter l&rsquo;équipe SAIMO
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </a>
        </div>
      </div>
    </section>
  );
}
