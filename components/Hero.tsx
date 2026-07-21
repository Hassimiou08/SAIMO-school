"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ArrowRight, Download, PlayCircle } from "lucide-react";
import { DashboardMock } from "./DashboardMock";

export function Hero() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .from(".hero-eyebrow", { y: 16, opacity: 0, duration: 0.5 })
        .from(".hero-title-line", { y: 28, opacity: 0, duration: 0.6, stagger: 0.08 }, "-=0.25")
        .from(".hero-sub", { y: 16, opacity: 0, duration: 0.5 }, "-=0.3")
        .from(".hero-cta", { y: 12, opacity: 0, duration: 0.45, stagger: 0.08 }, "-=0.25");
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="top"
      ref={rootRef}
      className="relative overflow-hidden bg-navy-950"
      style={{
        backgroundImage: "url('/hero-bg.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="pointer-events-none absolute inset-0 bg-navy-950/80" />
      <div className="pointer-events-none absolute inset-0 bg-grid-faint bg-[size:44px_44px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black,transparent)]" />
      <div className="pointer-events-none absolute -top-40 right-[-10%] h-96 w-96 rounded-full bg-blue-600/20 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-[-20%] left-[-10%] h-96 w-96 rounded-full bg-teal-400/10 blur-[120px]" />

      <div className="relative mx-auto grid max-w-6xl gap-16 px-6 pb-24 pt-16 md:grid-cols-[1.1fr_1fr] md:items-center md:pb-32 md:pt-20">
        <div>
          <span className="hero-eyebrow inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs font-medium text-white/70">
            École moderne — programme, préinscription, suivi et communication
          </span>

          <h1 className="mt-6 font-display text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl">
            <span className="hero-title-line block">Bienvenue à l’école</span>
            <span className="hero-title-line block">
              <span className="bg-gradient-to-r from-primary-300 to-secondary-300 bg-clip-text text-transparent">
                SAIMO
              </span>
            </span>
            <span className="hero-title-line block">où l’éducation devient simple et inspirante.</span>
          </h1>

          <p className="hero-sub mt-6 max-w-lg text-base leading-relaxed text-white/60">
            Découvrez une école moderne qui allie pédagogie, innovation, suivi parental et outils numériques pour accompagner chaque enfant dans sa réussite.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <a
              href="#services"
              className="hero-cta group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-navy-950 transition-transform hover:-translate-y-0.5"
            >
              <Download className="h-4 w-4" />
              Installer l’appli
            </a>
            <a
              href="/school"
              className="hero-cta inline-flex items-center gap-2 text-sm font-semibold text-white/80 transition-colors hover:text-white"
            >
              <PlayCircle className="h-5 w-5" />
              Découvrir l'école
            </a>
            <a
              href="#preinscription"
              className="hero-cta inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              Préinscrire mon enfant
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>

        <DashboardMock />
      </div>
    </section>
  );
}
