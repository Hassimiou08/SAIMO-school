"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard, BookOpen, FileText,
  CalendarX2, Wallet2, MessageSquare,
  Bell, User, LogOut, GraduationCap, ChevronDown
} from "lucide-react";
import { notificationsParent, enfantsList } from "@/lib/mock-parent";

const NAV = [
  { icon: LayoutDashboard, label: "Tableau de bord", href: "/parent" },
  { icon: BookOpen,         label: "Notes",           href: "/parent/notes" },
  { icon: FileText,         label: "Bulletins",       href: "/parent/bulletins" },
  { icon: CalendarX2,       label: "Absences",        href: "/parent/absences" },
  { icon: Wallet2,          label: "Paiements",       href: "/parent/paiements" },
  { icon: MessageSquare,    label: "Messagerie",      href: "/parent/messagerie" },
];

export function ParentSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const enfantId = searchParams.get("enfant") || "e1";
  
  const currentEnfant = enfantsList.find(e => e.id === enfantId) || enfantsList[0];
  const unread = notificationsParent.filter(n => !n.lu).length;

  const isActive = (href: string) =>
    href === "/parent" ? pathname === href : pathname.startsWith(href);

  // Fonction utilitaire pour garder le paramètre enfant dans les liens
  const getHref = (baseHref: string) => `${baseHref}?enfant=${enfantId}`;

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col lg:flex overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-700 to-teal-800" />
      <div className="absolute inset-0 opacity-[0.07] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHBhdGggZD0iTTQwIDQwVjBIMHY0MHoiIGZpbGw9Im5vbmUiLz48cGF0aCBkPSJNMzkgNDBWMGgxdjQwek0wIDM5aDQwdjFIMHoiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMSkiLz48L3N2Zz4=')]" />

      <div className="relative flex flex-col h-full">
        {/* Logo */}
        <div className="flex h-16 flex-shrink-0 items-center gap-3 border-b border-white/15 px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20">
            <GraduationCap className="h-5 w-5 text-white" />
          </div>
          <div className="leading-none">
            <p className="font-display text-sm font-bold text-white">SAIMO</p>
            <p className="text-[10px] uppercase tracking-widest text-white/60">Espace Parent</p>
          </div>
        </div>

        {/* Carte eleve / Selecteur Multi-Enfants */}
        <div className="mx-3 mt-4 rounded-xl bg-white/10 border border-white/15 px-4 py-3 relative group">
          <p className="text-[10px] uppercase tracking-wider text-white/50 mb-1">Mon enfant</p>
          <div className="relative">
            <select
              value={enfantId}
              onChange={(e) => router.push(`${pathname}?enfant=${e.target.value}`)}
              className="w-full appearance-none bg-transparent text-sm font-bold text-white outline-none cursor-pointer pr-6"
            >
              {enfantsList.map(enfant => (
                <option key={enfant.id} value={enfant.id} className="text-neutral-900">
                  {enfant.nom}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 h-4 w-4 text-white/70 pointer-events-none" />
          </div>
          <p className="text-xs text-white/60 mt-0.5">{currentEnfant.classe} &bull; {currentEnfant.anneeScolaire}</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {NAV.map(item => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={getHref(item.href)}
                className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-150 ${
                  active
                    ? "bg-white text-emerald-700 shadow-md"
                    : "text-white/80 hover:bg-white/15 hover:text-white"
                }`}
              >
                <item.icon className={`h-[17px] w-[17px] flex-shrink-0 ${active ? "text-emerald-600" : ""}`} />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}

          <div className="my-2 mx-3 border-b border-white/10" />

          {/* Notifications */}
          <Link
            href={getHref("/parent/notifications")}
            className={`flex items-center justify-between gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${
              pathname === "/parent/notifications"
                ? "bg-white text-emerald-700"
                : "text-white/80 hover:bg-white/15 hover:text-white"
            }`}
          >
            <div className="flex items-center gap-3">
              <Bell className="h-[17px] w-[17px]" />
              <span>Notifications</span>
            </div>
            {unread > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-[10px] font-bold text-white">
                {unread}
              </span>
            )}
          </Link>

          <Link
            href={getHref("/parent/profil")}
            className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${
              pathname === "/parent/profil"
                ? "bg-white text-emerald-700"
                : "text-white/80 hover:bg-white/15 hover:text-white"
            }`}
          >
            <User className="h-[17px] w-[17px]" />
            <span>Mon Profil</span>
          </Link>
        </nav>

        {/* Footer */}
        <div className="flex-shrink-0 border-t border-white/15 p-3">
          <a
            href="/connexion"
            className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-white/70 transition hover:bg-red-500/20 hover:text-red-200"
          >
            <LogOut className="h-[18px] w-[18px]" />
            Deconnexion
          </a>
        </div>
      </div>
    </aside>
  );
}
