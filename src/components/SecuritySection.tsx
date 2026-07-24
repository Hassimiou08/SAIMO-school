"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ShieldCheck, Building2, History, Lock } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const points = [
  {
    icon: Building2,
    title: "Isolation par établissement",
    desc: "Chaque école dispose de ses utilisateurs, ses paramètres et ses données. Aucun accès croisé possible.",
  },
  {
    icon: Lock,
    title: "Accès par rôle",
    desc: "Un enseignant ne voit que ses classes ; un comptable ne voit que les finances qui le concernent.",
  },
  {
    icon: History,
    title: "Journal d'audit",
    desc: "Chaque opération sensible — note, paiement, rôle — est tracée, avec auteur et horodatage.",
  },
  {
    icon: ShieldCheck,
    title: "Sauvegardes automatiques",
    desc: "Sauvegarde quotidienne, stockage externe et procédure de restauration testée régulièrement.",
  },
];

export function SecuritySection() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".sec-item", {
        opacity: 0,
        y: 18,
        duration: 0.5,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: { trigger: rootRef.current, start: "top 75%" },
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="securite" ref={rootRef} className="bg-navy-950 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-12 md:grid-cols-[0.8fr_1fr] md:items-start">
          <div>
            <h2 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Multiétablissement, pensé pour rester étanche
            </h2>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/55">
              Les données scolaires sont sensibles. L&rsquo;architecture de
              SAIMO applique le principe du moindre privilège à chaque
              niveau, de la connexion à l&rsquo;export d&rsquo;un rapport.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {points.map((p) => (
              <div
                key={p.title}
                className="sec-item rounded-2xl border border-white/8 bg-white/[0.03] p-6"
              >
                <p.icon className="mb-3 h-5 w-5 text-teal-300" />
                <h3 className="font-display text-sm font-semibold text-white">
                  {p.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/50">
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
