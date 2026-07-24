"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Users2, FileBadge2, CalendarCheck2, Wallet2, TrendingUp, TrendingDown } from "lucide-react";

const stats = [
  {
    icon: Users2,
    label: "Élèves actifs",
    target: 1248,
    suffix: "",
    trend: "+3,2 %",
    up: true,
  },
  {
    icon: FileBadge2,
    label: "Bulletins générés",
    target: 312,
    suffix: "",
    trend: "+18",
    up: true,
  },
  {
    icon: CalendarCheck2,
    label: "Taux de présence",
    target: 96,
    suffix: "%",
    trend: "-0,4 %",
    up: false,
  },
  {
    icon: Wallet2,
    label: "Paiements du mois",
    target: 78,
    suffix: "%",
    trend: "+5,1 %",
    up: true,
  },
];

export function StatCards() {
  const rootRef = useRef<HTMLDivElement>(null);
  const numberRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".stat-card", {
        y: 16,
        opacity: 0,
        duration: 0.5,
        stagger: 0.08,
        ease: "power2.out",
      });

      numberRefs.current.forEach((el, i) => {
        if (!el) return;
        const counter = { val: 0 };
        gsap.to(counter, {
          val: stats[i].target,
          duration: 1.2,
          delay: 0.25 + i * 0.1,
          ease: "power2.out",
          onUpdate: () => {
            el.textContent = Math.round(counter.val).toString();
          },
        });
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat, i) => (
        <div
          key={stat.label}
          className="stat-card rounded-2xl border border-navy-900/5 bg-white p-5"
        >
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy-950">
              <stat.icon className="h-5 w-5 text-teal-300" />
            </div>
            <span
              className={`flex items-center gap-1 text-xs font-medium ${
                stat.up ? "text-teal-600" : "text-red-500"
              }`}
            >
              {stat.up ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              {stat.trend}
            </span>
          </div>
          <p className="mt-4 font-mono text-2xl font-medium text-navy-900">
            <span ref={(el) => { numberRefs.current[i] = el; }}>0</span>
            {stat.suffix}
          </p>
          <p className="mt-1 text-xs text-ink-500">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
