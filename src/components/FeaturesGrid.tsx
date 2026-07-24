"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Users2,
  ClipboardCheck,
  CalendarX2,
  FileBadge2,
  Wallet2,
  BarChart3,
  ArrowRight,
} from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const features = [
  {
    icon: Users2,
    title: "Élèves & inscriptions",
    desc: "Dossiers complets, parents liés, matricules uniques et historique du parcours scolaire.",
  },
  {
    icon: ClipboardCheck,
    title: "Notes & évaluations",
    desc: "Barèmes paramétrés, saisie contrôlée, validation et verrouillage avec audit des corrections.",
  },
  {
    icon: CalendarX2,
    title: "Présences & absences",
    desc: "Suivi par classe et par élève, motifs, justificatifs et statistiques de présence.",
  },
  {
    icon: FileBadge2,
    title: "Bulletins",
    desc: "Génération en lot, export PDF, archivage par version et blocage si données incomplètes.",
  },
  {
    icon: Wallet2,
    title: "Paiements & reçus",
    desc: "Frais, échéances, paiements partiels, reçus numérotés et suivi des impayés.",
  },
  {
    icon: BarChart3,
    title: "Rapports & tableaux de bord",
    desc: "Indicateurs par établissement, année, classe et période — filtrés selon le rôle.",
  },
];

export function FeaturesGrid() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".feature-card",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top 75%",
          },
        }
      );
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <>
      <section id="modules" ref={rootRef} className="bg-paper-100 py-16 border-t border-neutral-200">
        <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight text-navy-900 sm:text-4xl">
            Six modules, un seul référentiel de données
          </h2>
          <p className="mt-4 text-base leading-relaxed text-ink-500">
            Chaque module s&rsquo;appuie sur les mêmes règles de sécurité,
            d&rsquo;audit et de traçabilité, avec une isolation stricte par
            établissement.
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="group relative feature-card rounded-[2rem] border border-neutral-200 bg-white p-8 transition-all duration-300 hover:-translate-y-2 hover:border-orange-400/30 hover:shadow-[0_20px_40px_-15px_rgba(249,115,22,0.2)]"
            >
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 transition-all duration-300 group-hover:bg-gradient-to-r group-hover:from-blue-500 group-hover:to-orange-400">
                <f.icon className="h-6 w-6 text-blue-600 transition-colors duration-300 group-hover:text-white" />
              </div>
              <h3 className="font-display text-base font-semibold text-navy-900">
                {f.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-500">
                {f.desc}
              </p>
            </div>
          ))}
          </div>
        </div>
      </section>

      {/* SECTION 5 : Final Call to Action */}
      <section className="relative overflow-hidden bg-navy-900 py-24 lg:py-32">
        {/* Cercles décoratifs */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[100%] rounded-full bg-blue-600/20 blur-3xl" />
          <div className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[100%] rounded-full bg-orange-500/20 blur-3xl" />
        </div>
        
        <div className="mx-auto max-w-4xl px-6 relative z-10 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-white text-xs font-bold uppercase tracking-wider mb-6 border border-white/20 backdrop-blur-md">
            🚀 L'avenir commence ici
          </span>
          <h2 className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl mb-6 leading-tight">
            Prêt à offrir le <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-300">meilleur</span> à vos enfants ?
          </h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto mb-10 leading-relaxed">
            Rejoignez SAIMO Ecole aujourd'hui. Offrez-leur un cadre exceptionnel, une pédagogie moderne et tous les outils pour réussir.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="#preinscription" className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-500 to-orange-400 px-8 py-4 text-lg font-bold text-white shadow-[0_10px_30px_-10px_rgba(249,115,22,0.5)] transition-all hover:scale-105 hover:shadow-[0_20px_40px_-15px_rgba(249,115,22,0.6)]">
              Démarrer l'inscription
              <ArrowRight className="h-5 w-5" />
            </a>
            <a href="/contact" className="inline-flex items-center gap-2 rounded-2xl border-2 border-white/20 bg-white/5 px-8 py-4 text-lg font-bold text-white transition-all hover:bg-white/10">
              Nous contacter
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
