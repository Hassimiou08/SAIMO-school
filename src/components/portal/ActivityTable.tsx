"use client";

import { UserPlus, ClipboardCheck, Wallet2, FileBadge2 } from "lucide-react";

const activity = [
  {
    icon: UserPlus,
    text: "Inscription de Fatoumata Camara — 6ᵉ A",
    who: "Secrétariat",
    when: "Il y a 12 min",
    iconColor: "bg-blue-100 text-blue-600",
  },
  {
    icon: ClipboardCheck,
    text: "Notes validées — Mathématiques, 4ᵉ B",
    who: "M. Diallo",
    when: "Il y a 47 min",
    iconColor: "bg-orange-100 text-orange-600",
  },
  {
    icon: FileBadge2,
    text: "Bulletins générés — 3ᵉ B, 2ᵉ trimestre",
    who: "Direction",
    when: "Il y a 2 h",
    iconColor: "bg-blue-100 text-blue-600",
  },
  {
    icon: Wallet2,
    text: "Paiement scolarité — Mamadou Bah, 5ᵉ A",
    who: "Comptabilité",
    when: "Il y a 3 h",
    iconColor: "bg-orange-100 text-orange-600",
  },
  {
    icon: UserPlus,
    text: "Réinscription de Mamadou Bah — 5ᵉ A",
    who: "Secrétariat",
    when: "Hier",
    iconColor: "bg-blue-100 text-blue-600",
  },
];

export function ActivityTable() {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-6">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="font-display text-sm font-bold text-neutral-900">
          Activité récente
        </h3>
        <a href="#" className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition">
          Voir le journal complet →
        </a>
      </div>

      <ul className="divide-y divide-neutral-100">
        {activity.map((item, i) => (
          <li key={i} className="flex items-center gap-3.5 py-3.5 hover:bg-neutral-50 rounded-xl px-2 -mx-2 transition">
            <span className={`flex h-9 w-9 flex-none items-center justify-center rounded-xl ${item.iconColor}`}>
              <item.icon className="h-4 w-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-neutral-800">{item.text}</p>
              <p className="mt-0.5 text-xs text-neutral-500">{item.who}</p>
            </div>
            <span className="flex-none text-[11px] font-medium text-neutral-400">{item.when}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
