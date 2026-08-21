"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard, Users2, GraduationCap, School, BookMarked,
  Layers, CalendarRange, UserCheck,
  ClipboardCheck, CalendarX2, FileBadge2,
  Wallet2, Receipt, Tag,
  Megaphone, Sparkles,
  BarChart3, ShieldAlert, UserCog,
  Settings, LogOut,
} from "lucide-react";
import { LogoMark } from "@/components/Logo";

const NAV_SECTIONS = [
  {
    label: null,
    items: [
      { icon: LayoutDashboard, label: "Tableau de bord", href: "/portail" },
    ],
  },
  {
    label: "Académique",
    items: [
      { icon: Users2,       label: "Élèves",          href: "/portail/eleves" },
      { icon: GraduationCap,label: "Enseignants",      href: "/portail/enseignants" },
      { icon: School,       label: "Classes",          href: "/portail/classes" },
      { icon: BookMarked,   label: "Matières",         href: "/portail/matieres" },
      { icon: Layers,       label: "Cycles & Niveaux", href: "/portail/cycles" },
      { icon: CalendarRange,label: "Emploi du Temps",  href: "/portail/emploi-du-temps" },
      { icon: UserCheck,    label: "Affectations",     href: "/portail/affectations" },
    ],
  },
  {
    label: "Évaluation",
    items: [
      { icon: ClipboardCheck, label: "Notes",     href: "/portail/notes" },
      { icon: CalendarX2,     label: "Absences",  href: "/portail/absences" },
      { icon: FileBadge2,     label: "Bulletins", href: "/portail/bulletins" },
    ],
  },
  {
    label: "Finance",
    items: [
      { icon: Wallet2,  label: "Paiements",       href: "/portail/paiements" },
      { icon: Receipt,  label: "Reçus",            href: "/portail/recus" },
      { icon: Tag,      label: "Remises & Bourses",href: "/portail/remises" },
    ],
  },
  {
    label: "Communication",
    items: [
      { icon: Megaphone, label: "Annonces",     href: "/portail/annonces" },
      { icon: Sparkles,  label: "Assistant IA", href: "/portail/ia" },
    ],
  },
  {
    label: "Administration",
    items: [
      { icon: BarChart3,  label: "Rapports",         href: "/portail/rapports" },
      { icon: UserCog,    label: "Utilisateurs",      href: "/portail/utilisateurs" },
      { icon: ShieldAlert,label: "Journal d'Audit",   href: "/portail/audit" },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [sidebarStyle, setSidebarStyle] = useState({});

  useEffect(() => {
    const updateColors = () => {
      const root = document.documentElement;
      const from = root.style.getPropertyValue("--saimo-sidebar-from") || "#2563EB";
      const to   = root.style.getPropertyValue("--saimo-sidebar-to")   || "#3B82F6";
      setSidebarStyle({ background: `linear-gradient(to bottom, ${from}, ${to})` });
    };
    updateColors();
    window.addEventListener("saimo-theme-change", updateColors);
    return () => window.removeEventListener("saimo-theme-change", updateColors);
  }, []);

  const isActive = (href: string) =>
    href !== "#" && (pathname === href || (href !== "/portail" && pathname.startsWith(href)));

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col lg:flex overflow-hidden">
      <div className="absolute inset-0" style={sidebarStyle} />
      <div className="absolute inset-0 opacity-[0.07] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHBhdGggZD0iTTQwIDQwVjBIMHY0MHoiIGZpbGw9Im5vbmUiLz48cGF0aCBkPSJNMzkgNDBWMGgxdjQwek0wIDM5aDQwdjFIMHoiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMSkiLz48L3N2Zz4=')]" />

      <div className="relative flex flex-col h-full">
        {/* Logo */}
        <div className="flex h-16 flex-shrink-0 items-center gap-2.5 border-b border-white/15 px-6">
          <LogoMark className="h-8 w-8" />
          <div className="leading-none">
            <p className="font-display text-sm font-bold text-white">SAIMO</p>
            <p className="text-[10px] uppercase tracking-widest text-white/60">Administration</p>
          </div>
        </div>

        {/* Navigation scrollable */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1 scrollbar-thin">
          {NAV_SECTIONS.map((section, si) => (
            <div key={si} className={si > 0 ? "pt-2" : ""}>
              {section.label && (
                <p className="mb-1 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-white/40">
                  {section.label}
                </p>
              )}
              {section.items.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 rounded-xl px-3.5 py-2 text-sm font-medium transition-all duration-150 ${
                      active
                        ? "bg-white text-blue-600 shadow-md shadow-blue-900/20"
                        : "text-white/80 hover:bg-white/15 hover:text-white"
                    }`}
                  >
                    <item.icon className={`h-[17px] w-[17px] flex-shrink-0 ${active ? "text-orange-500" : ""}`} />
                    <span className="truncate">{item.label}</span>
                  </Link>
                );
              })}
              {si < NAV_SECTIONS.length - 1 && (
                <div className="mt-2 mx-3 border-b border-white/10" />
              )}
            </div>
          ))}
        </nav>

        {/* Bas de sidebar */}
        <div className="flex-shrink-0 border-t border-white/15 p-3 space-y-1">
          <Link
            href="/portail/parametres"
            className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
              pathname === "/portail/parametres"
                ? "bg-white/20 text-white shadow-md"
                : "text-white/70 hover:bg-white/15 hover:text-white"
            }`}
          >
            <Settings className="h-[18px] w-[18px]" />
            Paramètres
          </Link>
          <a
            href="/connexion"
            className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-white/70 transition-colors hover:bg-red-500/20 hover:text-red-200"
          >
            <LogOut className="h-[18px] w-[18px]" />
            Déconnexion
          </a>
        </div>
      </div>
    </aside>
  );
}
