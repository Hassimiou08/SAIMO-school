"use client";

import Link from "next/link";
import { Bell } from "lucide-react";
import {
  useCurrentUserOptional,
  libelleRole,
  initiales,
} from "@/components/providers/UserProvider";

export function ParentTopbar() {
  const user = useCurrentUserOptional();
  const nom = user?.name ?? "Utilisateur";
  const photo = user?.photo ?? null;
  const roleLabel = user ? libelleRole(user.role) : "Parent";

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-neutral-200 bg-white/90 px-6 backdrop-blur-md lg:pl-10">
      <div className="text-sm font-semibold text-neutral-400">SAIMO École</div>

      <div className="ml-auto flex items-center gap-3">
        <Link
          href="/parent/notifications"
          className="rounded-xl p-2 text-neutral-500 transition hover:bg-neutral-100"
        >
          <Bell className="h-5 w-5" />
        </Link>

        <Link
          href="/parent/profil"
          className="flex items-center gap-2.5 border-l border-neutral-200 pl-3"
        >
          {photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photo} alt={nom} className="h-8 w-8 rounded-full object-cover" />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">
              {initiales(nom)}
            </div>
          )}
          <div className="hidden leading-none sm:block">
            <p className="text-xs font-bold text-neutral-900">{nom}</p>
            <p className="text-[11px] text-neutral-500">{roleLabel}</p>
          </div>
        </Link>
      </div>
    </header>
  );
}
