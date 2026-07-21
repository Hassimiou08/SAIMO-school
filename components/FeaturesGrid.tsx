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
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".feature-card", {
        opacity: 0,
        y: 20,
        duration: 0.5,
        stagger: 0.08,
        ease: "power2.out",
        scrollTrigger: { trigger: rootRef.current, start: "top 75%" },
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="modules" ref={rootRef} className="bg-paper-100 py-24">
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
              className="feature-card rounded-2xl border border-navy-900/5 bg-white p-6 transition-shadow hover:shadow-panel-light"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-navy-950">
                <f.icon className="h-5 w-5 text-teal-300" />
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
  );
}
