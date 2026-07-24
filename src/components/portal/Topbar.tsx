"use client";

import { Search, Bell, ChevronDown } from "lucide-react";

export function Topbar() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-navy-900/5 bg-paper-50/90 px-6 backdrop-blur lg:px-10">
      <div className="hidden items-center gap-2 rounded-full border border-navy-900/8 bg-white px-3.5 py-2 text-xs font-medium text-ink-700 sm:flex">
        Année 2025/2026
        <ChevronDown className="h-3.5 w-3.5 text-ink-500" />
      </div>

      <div className="relative hidden max-w-xs flex-1 sm:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-500/50" />
        <input
          type="search"
          placeholder="Rechercher un élève, une classe..."
          className="w-full rounded-full border border-navy-900/8 bg-white py-2 pl-9 pr-3.5 text-xs text-ink-900 placeholder:text-ink-500/50 outline-none focus:border-teal-400/60"
        />
      </div>

      <div className="flex items-center gap-4">
        <button
          aria-label="Notifications"
          className="relative flex h-9 w-9 items-center justify-center rounded-full border border-navy-900/8 bg-white text-ink-700 hover:bg-paper-100"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-gold-500" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-navy-950 font-display text-xs font-semibold text-teal-300">
            MS
          </div>
          <div className="hidden leading-none sm:block">
            <p className="text-xs font-semibold text-navy-900">
              Mohamed H. Soumah
            </p>
            <p className="mt-0.5 text-[11px] text-ink-500">
              Administrateur établissement
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
