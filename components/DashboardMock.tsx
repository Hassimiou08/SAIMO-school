"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Users, FileCheck, Wallet, TrendingUp, ArrowUpRight } from "lucide-react";

const stats = [
  { icon: Users, label: "Élèves actifs", target: 1248, suffix: "", accent: "text-blue-500" },
  { icon: FileCheck, label: "Bulletins générés", target: 312, suffix: "", accent: "text-teal-500" },
  { icon: Wallet, label: "Paiements à jour", target: 94, suffix: "%", accent: "text-gold-500" },
];

const bars = [62, 78, 45, 88, 70, 95, 58];

export function DashboardMock() {
  const rootRef = useRef<HTMLDivElement>(null);
  const numberRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(".mock-card", { y: 24, opacity: 0, duration: 0.7 })
        .from(
          ".mock-stat",
          { y: 14, opacity: 0, duration: 0.5, stagger: 0.12 },
          "-=0.35"
        )
        .from(
          ".mock-bar",
          { scaleY: 0, transformOrigin: "bottom", duration: 0.5, stagger: 0.06 },
          "-=0.3"
        );

      numberRefs.current.forEach((el, i) => {
        if (!el) return;
        const target = stats[i].target;
        const counter = { val: 0 };
        gsap.to(counter, {
          val: target,
          duration: 1.4,
          delay: 0.4 + i * 0.12,
          ease: "power2.out",
          onUpdate: () => {
            el.textContent = Math.round(counter.val).toString();
          },
        });
      });

      gsap.to(".mock-float", {
        y: -6,
        duration: 2.6,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="relative">
      <div className="mock-card mock-float rounded-2xl border border-white/10 bg-navy-800/90 p-5 shadow-panel backdrop-blur">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-white/40">
              Établissement pilote
            </p>
            <p className="font-display text-sm font-semibold text-white">
              Tableau de bord — Année 2025/2026
            </p>
          </div>
          <span className="flex items-center gap-1.5 rounded-full bg-teal-400/15 px-2.5 py-1 text-[11px] font-medium text-teal-300">
            <TrendingUp className="h-3 w-3" /> En temps réel
          </span>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className="mock-stat rounded-xl border border-white/5 bg-white/[0.03] p-3"
            >
              <stat.icon className={`mb-2 h-4 w-4 ${stat.accent}`} />
              <p className="font-mono text-xl font-medium text-white">
                <span ref={(el) => { numberRefs.current[i] = el; }}>0</span>
                {stat.suffix}
              </p>
              <p className="mt-0.5 text-[11px] leading-tight text-white/45">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-xl border border-white/5 bg-white/[0.03] p-4">
          <p className="mb-3 text-[11px] uppercase tracking-widest text-white/40">
            Moyenne générale par classe
          </p>
          <div className="flex h-20 items-end gap-2.5">
            {bars.map((h, i) => (
              <div
                key={i}
                className="mock-bar flex-1 rounded-t-sm bg-gradient-to-t from-blue-600 to-teal-400"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </div>
      </div>

      <a
        href="/portail"
        className="mock-card group mt-4 flex items-center justify-center gap-1.5 text-xs font-medium text-white/50 transition-colors hover:text-white"
      >
        Accéder au portail
        <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </a>
    </div>
  );
}
