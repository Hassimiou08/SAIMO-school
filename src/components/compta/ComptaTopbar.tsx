"use client";

import { Bell, Search, Settings } from "lucide-react";
import {
  useCurrentUserOptional,
  libelleRole,
  initiales,
} from "@/components/providers/UserProvider";

export function ComptaTopbar() {
  const user = useCurrentUserOptional();
  const nom = user?.name ?? "Utilisateur";
  const roleLabel = user ? libelleRole(user.role) : "Comptabilité";

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-neutral-200 bg-white/80 px-6 backdrop-blur-md lg:pl-10">
      <div className="relative hidden sm:block w-72">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
        <input
          type="search"
          placeholder="Rechercher une transaction..."
          className="w-full rounded-xl border border-neutral-200 bg-neutral-50 py-2 pl-9 pr-4 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
        />
      </div>

      <div className="flex items-center gap-2 ml-auto">
        <button className="relative rounded-xl p-2 text-neutral-500 hover:bg-neutral-100 transition">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white border-2 border-white">
            3
          </span>
        </button>
        <button className="rounded-xl p-2 text-neutral-500 hover:bg-neutral-100 transition">
          <Settings className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2.5 border-l border-neutral-200 pl-4 ml-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700 shadow-sm border border-indigo-200">
            {initiales(nom)}
          </div>
          <div className="hidden sm:block leading-none">
            <p className="text-sm font-bold text-neutral-900">{nom}</p>
            <p className="text-[11px] text-indigo-600 font-medium">{roleLabel}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
