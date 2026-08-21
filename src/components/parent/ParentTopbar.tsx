"use client";

import { Bell, Search } from "lucide-react";
import { notificationsParent, parentInfo } from "@/lib/mock-parent";

export function ParentTopbar() {
  const unread = notificationsParent.filter(n => !n.lu).length;

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-neutral-200 bg-white/90 px-6 backdrop-blur-md lg:pl-10">
      <div className="relative hidden sm:block w-64">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
        <input
          type="search"
          placeholder="Rechercher..."
          className="w-full rounded-xl border border-neutral-200 bg-neutral-50 py-2 pl-9 pr-4 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition"
        />
      </div>

      <div className="flex items-center gap-3 ml-auto">
        <button className="relative rounded-xl p-2 text-neutral-500 hover:bg-neutral-100 transition">
          <Bell className="h-5 w-5" />
          {unread > 0 && (
            <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-orange-500 text-[9px] font-bold text-white">
              {unread}
            </span>
          )}
        </button>

        <div className="flex items-center gap-2.5 border-l border-neutral-200 pl-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">
            {parentInfo.nom.split(" ").map(p => p[0]).join("").slice(0, 2)}
          </div>
          <div className="hidden sm:block leading-none">
            <p className="text-xs font-bold text-neutral-900">{parentInfo.nom}</p>
            <p className="text-[11px] text-neutral-500">Parent</p>
          </div>
        </div>
      </div>
    </header>
  );
}
