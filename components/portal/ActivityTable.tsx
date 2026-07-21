"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { UserPlus, ClipboardCheck, Wallet2, FileBadge2 } from "lucide-react";

const activity = [
  {
    icon: UserPlus,
    text: "Inscription de Fatoumata Camara — 6ᵉ A",
    who: "Secrétariat",
    when: "Il y a 12 min",
  },
  {
    icon: ClipboardCheck,
    text: "Notes validées — Mathématiques, 4ᵉ B",
    who: "M. Diallo",
    when: "Il y a 47 min",
  },
  {
    icon: FileBadge2,
    text: "Bulletins générés — 3ᵉ B, 2ᵉ trimestre",
    who: "Direction",
    when: "Il y a 2 h",
  },
  {
    icon: UserPlus,
    text: "Réinscription de Mamadou Bah — 5ᵉ A",
    who: "Secrétariat",
    when: "Hier",
  },
];

export function ActivityTable() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".activity-row", {
        opacity: 0,
        x: -10,
        duration: 0.4,
        stagger: 0.06,
        ease: "power2.out",
        delay: 0.3,
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={rootRef}
      className="rounded-2xl border border-navy-900/5 bg-white p-6"
    >
      <div className="mb-5 flex items-center justify-between">
        <h3 className="font-display text-sm font-semibold text-navy-900">
          Activité récente
        </h3>
        <a href="#" className="text-xs font-medium text-teal-600 hover:text-teal-700">
          Voir le journal complet
        </a>
      </div>

      <ul className="divide-y divide-navy-900/5">
        {activity.map((item, i) => (
          <li key={i} className="activity-row flex items-center gap-3.5 py-3.5">
            <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-paper-100">
              <item.icon className="h-4 w-4 text-navy-800" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm text-navy-900">{item.text}</p>
              <p className="mt-0.5 text-xs text-ink-500">{item.who}</p>
            </div>
            <span className="flex-none text-xs text-ink-500">{item.when}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
