"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Users2, GraduationCap, CalendarCheck2, Wallet2 } from "lucide-react";
import type { StatsDashboard } from "@/server/dal/dashboard";

export function StatCards({ stats }: { stats: StatsDashboard }) {
  const cartes = [
    { icon: Users2, label: "Élèves actifs", value: stats.elevesActifs, suffix: "", iconBg: "bg-blue-500" },
    { icon: GraduationCap, label: "Enseignants", value: stats.enseignantsActifs, suffix: "", iconBg: "bg-orange-500" },
    { icon: CalendarCheck2, label: "Taux de présence", value: stats.tauxPresence, suffix: "%", iconBg: "bg-blue-400" },
    { icon: Wallet2, label: "Recouvrement", value: stats.tauxRecouvrement, suffix: "%", iconBg: "bg-orange-400" },
  ];

  const numberRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    numberRefs.current.forEach((el, i) => {
      if (!el) return;
      const counter = { val: 0 };
      gsap.to(counter, {
        val: cartes[i].value,
        duration: 1.1,
        ease: "power2.out",
        onUpdate: () => {
          el.textContent = Math.round(counter.val).toString();
        },
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stats]);

  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {cartes.map((stat, i) => (
        <div key={stat.label} className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
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
