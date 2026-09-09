"use client";

import { useMemo, useState } from "react";
import { Search, ShieldAlert } from "lucide-react";
import type { AuditRowDTO } from "@/server/dal/admin";

const BADGE: Record<string, string> = {
  CREATE: "bg-green-100 text-green-700",
  UPDATE: "bg-blue-100 text-blue-700",
  DELETE: "bg-red-100 text-red-700",
  ARCHIVE: "bg-neutral-200 text-neutral-700",
  VALIDATE: "bg-emerald-100 text-emerald-700",
  LOCK: "bg-neutral-800 text-white",
  PAYMENT: "bg-orange-100 text-orange-700",
  CANCEL_PAYMENT: "bg-red-100 text-red-700",
};

export function AuditTable({ logs }: { logs: AuditRowDTO[] }) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(
    () => logs.filter((l) => `${l.entite} ${l.who} ${l.action} ${l.detail}`.toLowerCase().includes(query.toLowerCase())),
    [logs, query],
  );

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white">
      <div className="border-b border-neutral-100 p-5">
        <div className="relative max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Entité, utilisateur, action..." className="w-full rounded-xl border border-neutral-200 bg-neutral-50 py-2.5 pl-9 pr-3.5 text-xs outline-none focus:border-blue-400 transition" />
        </div>
      </div>
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-neutral-100 bg-neutral-50/50 text-xs uppercase text-neutral-500">
            <th className="px-5 py-3">Action</th><th className="px-5 py-3">Entité</th>
            <th className="px-5 py-3">Détail</th><th className="px-5 py-3">Utilisateur</th>
            <th className="px-5 py-3">IP</th><th className="px-5 py-3">Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-100">
          {filtered.map((l) => (
            <tr key={l.id} className="hover:bg-neutral-50/60">
              <td className="px-5 py-3"><span className={`rounded-md px-2 py-0.5 text-[11px] font-bold ${BADGE[l.action] ?? "bg-neutral-100 text-neutral-700"}`}>{l.action}</span></td>
              <td className="px-5 py-3 font-mono text-xs text-neutral-500">{l.entite}</td>
              <td className="px-5 py-3 max-w-xs truncate text-neutral-600">{l.detail}</td>
              <td className="px-5 py-3 text-neutral-700">{l.who}</td>
              <td className="px-5 py-3 font-mono text-xs text-neutral-400">{l.ip ?? "—"}</td>
              <td className="px-5 py-3 text-xs text-neutral-500">{l.date}</td>
            </tr>
          ))}
          {filtered.length === 0 && (
            <tr><td colSpan={6} className="px-5 py-10 text-center text-neutral-500">
              <ShieldAlert className="mx-auto mb-2 h-6 w-6 text-neutral-300" /> Aucune entrée dans le journal.
            </td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
