"use client";

import Link from "next/link";
import { ChevronDown, Menu } from "lucide-react";
import {
  useCurrentUserOptional,
  libelleRole,
  initiales,
} from "@/components/providers/UserProvider";

export function EnseignantTopbar() {
  const user = useCurrentUserOptional();
  const nom = user?.name ?? "Enseignant";
  const photo = user?.photo ?? null;
  const roleLabel = user ? libelleRole(user.role) : "";

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-neutral-200 bg-white/95 px-6 backdrop-blur-sm lg:px-10">
      <button className="flex h-9 w-9 items-center justify-center rounded-xl border border-neutral-200 text-neutral-600 hover:bg-neutral-50 lg:hidden">
        <Menu className="h-4 w-4" />
      </button>

      <div className="hidden items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-semibold text-blue-600 sm:flex">
        <span className="h-2 w-2 animate-pulse rounded-full bg-orange-500" />
        Année 2025/2026
      </div>

      <div className="flex items-center gap-4">
        <Link
          href="/enseignant/profil"
          className="group flex cursor-pointer items-center gap-2.5 rounded-xl px-1.5 py-1 transition hover:bg-neutral-50"
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
          <ChevronDown className="hidden h-3.5 w-3.5 text-neutral-400 transition group-hover:text-neutral-600 sm:block" />
        </Link>
      </div>
    </header>
  );
}
