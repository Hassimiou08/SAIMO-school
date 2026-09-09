"use client";

import Link from "next/link";
import { Search, ChevronDown, Menu } from "lucide-react";
import {
  useCurrentUserOptional,
  libelleRole,
  initiales,
} from "@/components/providers/UserProvider";
import { NotificationsBell } from "@/components/portal/NotificationsBell";

export function Topbar() {
  const user = useCurrentUserOptional();
  const nom = user?.name ?? "Utilisateur";
  const photo = user?.photo ?? null;
  const roleLabel = user ? libelleRole(user.role) : "";

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-neutral-200 bg-white/95 px-6 backdrop-blur-sm lg:px-10">
      {/* Menu mobile */}
      <button className="lg:hidden flex h-9 w-9 items-center justify-center rounded-xl border border-neutral-200 text-neutral-600 hover:bg-neutral-50">
        <Menu className="h-4 w-4" />
      </button>

      {/* Année scolaire */}
      <div className="hidden items-center gap-2 rounded-full bg-blue-50 border border-blue-200 px-4 py-2 text-xs font-semibold text-blue-600 sm:flex">
        <span className="h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
        Année 2025/2026
      </div>

      {/* Barre de recherche */}
      <div className="relative hidden max-w-xs flex-1 mx-6 sm:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
        <input
          type="search"
          placeholder="Rechercher un élève, une classe..."
          className="w-full rounded-xl border border-neutral-200 bg-neutral-50 py-2.5 pl-9 pr-3.5 text-xs text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
        />
      </div>

      <div className="flex items-center gap-4">
        <NotificationsBell />

        {/* Profil */}
        <Link
          href="/portail/profil"
          className="flex items-center gap-2.5 cursor-pointer group rounded-xl px-1.5 py-1 hover:bg-neutral-50 transition"
        >
          {photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={photo}
              alt={nom}
              className="h-9 w-9 rounded-xl object-cover shadow-md shadow-blue-200"
            />
          ) : (
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 font-display text-xs font-bold text-white shadow-md shadow-blue-200">
              {initiales(nom)}
            </div>
          )}
          <div className="hidden leading-none sm:block">
            <p className="text-xs font-semibold text-neutral-900">{nom}</p>
            <p className="mt-0.5 text-[11px] text-neutral-500">{roleLabel}</p>
          </div>
          <ChevronDown className="hidden sm:block h-3.5 w-3.5 text-neutral-400 group-hover:text-neutral-600 transition" />
        </Link>
      </div>
    </header>
  );
}
