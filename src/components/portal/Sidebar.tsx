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
  GraduationCap,
} from "lucide-react";
import { LogoMark } from "@/components/Logo";

const nav = [
  { icon: LayoutDashboard, label: "Tableau de bord", href: "/portail" },
  { icon: Users2, label: "Élèves", href: "/portail/eleves" },
  { icon: GraduationCap, label: "Enseignants", href: "/portail/enseignants" },
  { icon: ClipboardCheck, label: "Notes", href: "#" },
  { icon: CalendarX2, label: "Absences", href: "#" },
  { icon: FileBadge2, label: "Bulletins", href: "#" },
  { icon: Wallet2, label: "Paiements", href: "#" },
  { icon: BarChart3, label: "Rapports", href: "#" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col lg:flex overflow-hidden"
    >
      {/* Fond dégradé Bleu SAIMO */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-600 to-blue-500" />
      {/* Motif subtil */}
      <div className="absolute inset-0 opacity-[0.07] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHBhdGggZD0iTTQwIDQwVjBIMHY0MHoiIGZpbGw9Im5vbmUiLz48cGF0aCBkPSJNMzkgNDBWMGgxdjQwek0wIDM5aDQwdjFIMHoiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMSkiLz48L3N2Zz4=')]" />
      
      {/* Contenu */}
      <div className="relative flex flex-col h-full">
        {/* Logo */}
        <div className="flex h-16 items-center gap-2.5 border-b border-white/15 px-6">
          <LogoMark className="h-8 w-8" />
          <div className="leading-none">
            <p className="font-display text-sm font-bold text-white">SAIMO</p>
            <p className="text-[10px] uppercase tracking-widest text-white/60">
              Administration
            </p>
          </div>
        </div>

        {/* Navigation */}
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
                className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200 ${
                  active
                    ? "bg-white text-blue-600 shadow-md shadow-blue-900/20"
                    : "text-white/80 hover:bg-white/15 hover:text-white"
                }`}
              >
                <item.icon className={`h-[18px] w-[18px] ${active ? "text-orange-500" : ""}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Bas de sidebar */}
        <div className="border-t border-white/15 p-3">
          <a
            href="#"
            className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-white/70 transition-colors hover:bg-white/15 hover:text-white"
          >
            <Settings className="h-[18px] w-[18px]" />
            Paramètres
          </a>
          <a
            href="/connexion"
            className="mt-1 flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-white/70 transition-colors hover:bg-red-500/20 hover:text-red-200"
          >
            <LogOut className="h-[18px] w-[18px]" />
            Déconnexion
          </a>
        </div>
      </div>
    </aside>
  );
}
