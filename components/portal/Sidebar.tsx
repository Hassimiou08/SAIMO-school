"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Users2,
  ClipboardCheck,
  CalendarX2,
  FileBadge2,
  Wallet2,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";
import { LogoMark } from "@/components/Logo";

const nav = [
  { icon: LayoutDashboard, label: "Tableau de bord", href: "/portail" },
  { icon: Users2, label: "Élèves", href: "/portail/eleves" },
  { icon: ClipboardCheck, label: "Notes", href: "#" },
  { icon: CalendarX2, label: "Absences", href: "#" },
  { icon: FileBadge2, label: "Bulletins", href: "#" },
  { icon: Wallet2, label: "Paiements", href: "#" },
  { icon: BarChart3, label: "Rapports", href: "#" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-white/5 bg-navy-950 lg:flex">
      <div className="flex h-16 items-center gap-2.5 border-b border-white/5 px-6">
        <LogoMark className="h-8 w-8" />
        <div className="leading-none">
          <p className="font-display text-sm font-bold text-white">SAIMO</p>
          <p className="text-[10px] uppercase tracking-widest text-white/35">
            Portail établissement
          </p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-6">
        {nav.map((item) => {
          const active =
            item.href !== "#" &&
            (pathname === item.href ||
              (item.href !== "/portail" && pathname.startsWith(item.href)));
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-white/[0.06] text-white"
                  : "text-white/45 hover:bg-white/[0.03] hover:text-white/80"
              }`}
            >
              <item.icon className="h-[18px] w-[18px]" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/5 p-3">
        <a
          href="#"
          className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-white/45 transition-colors hover:bg-white/[0.03] hover:text-white/80"
        >
          <Settings className="h-[18px] w-[18px]" />
          Paramètres
        </a>
        <a
          href="/connexion"
          className="mt-1 flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-white/45 transition-colors hover:bg-white/[0.03] hover:text-white/80"
        >
          <LogOut className="h-[18px] w-[18px]" />
          Déconnexion
        </a>
      </div>
    </aside>
  );
}
