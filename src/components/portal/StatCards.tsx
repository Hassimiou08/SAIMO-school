"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Users2, FileBadge2, CalendarCheck2, Wallet2 } from "lucide-react";

const stats = [
  {
    icon: Users2,
    label: "Élèves actifs",
    target: 1248,
    suffix: "",
    iconBg: "bg-blue-500",
    cardBg: "bg-white",
    borderColor: "border-neutral-200",
  },
  {
    icon: FileBadge2,
    label: "Bulletins générés",
    target: 312,
    suffix: "",
    iconBg: "bg-orange-500",
    cardBg: "bg-white",
    borderColor: "border-neutral-200",
  },
  {
    icon: CalendarCheck2,
    label: "Taux de présence",
    target: 96,
    suffix: "%",
    iconBg: "bg-blue-400",
    cardBg: "bg-white",
    borderColor: "border-neutral-200",
  },
  {
    icon: Wallet2,
    label: "Paiements du mois",
    target: 78,
    suffix: "%",
    iconBg: "bg-orange-400",
    cardBg: "bg-white",
    borderColor: "border-neutral-200",
  },
];

export function StatCards() {
  const rootRef = useRef<HTMLDivElement>(null);
  const numberRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    // Animation GSAP uniquement pour l'incrémentation des nombres
    numberRefs.current.forEach((el, i) => {
      if (!el) return;
      const counter = { val: 0 };
      gsap.to(counter, {
        val: stats[i].target,
        duration: 1.2,
        delay: 0.1,
        ease: "power2.out",
        onUpdate: () => {
          el.textContent = Math.round(counter.val).toString();
        },
      });
    });
  }, []);

  return (
    <div ref={rootRef} className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat, i) => (
        <div
          key={stat.label}
          className={`rounded-2xl border ${stat.borderColor} ${stat.cardBg} p-6 shadow-sm`}
        >
          <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.iconBg}`}>
            <stat.icon className="h-5 w-5 text-white" />
          </div>
          <p className="mt-5 font-display text-3xl font-black text-neutral-900">
            <span ref={(el) => { numberRefs.current[i] = el; }}>0</span>
            {stat.suffix}
          </p>
          <p className="mt-1 text-sm font-medium text-neutral-500">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
