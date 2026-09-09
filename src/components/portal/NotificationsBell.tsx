"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Bell, ChevronRight, Loader2 } from "lucide-react";
import { actionListerNotifications } from "@/server/actions/notifications";
import type { NotifItem } from "@/server/dal/notifications";

const TON: Record<string, string> = {
  info: "bg-blue-100 text-blue-700",
  attention: "bg-orange-100 text-orange-700",
  urgent: "bg-red-100 text-red-700",
};

export function NotificationsBell() {
  const [items, setItems] = useState<NotifItem[]>([]);
  const [total, setTotal] = useState(0);
  const [ouvert, setOuvert] = useState(false);
  const [charge, setCharge] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  const rafraichir = () => {
    setCharge(true);
    actionListerNotifications()
      .then((r) => {
        setItems(r.items);
        setTotal(r.total);
      })
      .finally(() => setCharge(false));
  };

  useEffect(() => {
    rafraichir();
    const t = setInterval(rafraichir, 60_000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (!ouvert) return;
    const onClick = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOuvert(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [ouvert]);

  return (
    <div className="relative" ref={boxRef}>
      <button
        aria-label="Notifications"
        onClick={() => setOuvert((v) => !v)}
        className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50 transition"
      >
        <Bell className="h-4 w-4" />
        {total > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-orange-500 px-0.5 text-[9px] font-bold text-white">
            {total > 99 ? "99+" : total}
          </span>
        )}
      </button>

      {ouvert && (
        <div className="absolute right-0 top-11 z-50 w-80 rounded-2xl border border-neutral-200 bg-white shadow-xl">
          <div className="flex items-center justify-between border-b border-neutral-100 px-4 py-3">
            <p className="text-sm font-bold text-neutral-900">Notifications</p>
            {charge && <Loader2 className="h-3.5 w-3.5 animate-spin text-neutral-400" />}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {items.length === 0 ? (
              <p className="px-4 py-8 text-center text-xs text-neutral-500">
                Rien à signaler. Tout est à jour.
              </p>
            ) : (
              items.map((it) => (
                <Link
                  key={it.id}
                  href={it.href}
                  onClick={() => setOuvert(false)}
                  className="flex items-start gap-3 border-b border-neutral-50 px-4 py-3 last:border-0 hover:bg-neutral-50"
                >
                  <span
                    className={`mt-0.5 flex h-6 min-w-6 items-center justify-center rounded-full px-1 text-[10px] font-bold ${TON[it.ton] ?? TON.info}`}
                  >
                    {it.compteur}
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-xs font-semibold text-neutral-800">{it.titre}</span>
                    <span className="block text-[11px] text-neutral-500">{it.detail}</span>
                  </span>
                  <ChevronRight className="mt-1 h-3.5 w-3.5 flex-none text-neutral-300" />
                </Link>
              ))
            )}
          </div>

          <Link
            href="/portail/notifications"
            onClick={() => setOuvert(false)}
            className="block border-t border-neutral-100 px-4 py-2.5 text-center text-xs font-semibold text-blue-600 hover:bg-blue-50"
          >
            Tout voir
          </Link>
        </div>
      )}
    </div>
  );
}
