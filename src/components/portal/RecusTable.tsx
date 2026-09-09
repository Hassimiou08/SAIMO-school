"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, Receipt, FileText } from "lucide-react";
import type { RecuRowDTO } from "@/server/dal/finance";
import { formatGNF } from "@/lib/format";

const MODE_LABEL: Record<string, string> = {
  especes: "Espèces",
  mobile: "Mobile Money",
  virement: "Virement",
  cheque: "Chèque",
};

export function RecusTable({ recus }: { recus: RecuRowDTO[] }) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(
    () =>
      recus.filter(
        (r) =>
          r.eleve.toLowerCase().includes(query.toLowerCase()) ||
          r.numero.toLowerCase().includes(query.toLowerCase()),
      ),
    [recus, query],
  );

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white">
      <div className="border-b border-neutral-100 p-5">
        <div className="relative max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="N° reçu ou élève..." className="w-full rounded-xl border border-neutral-200 bg-neutral-50 py-2.5 pl-9 pr-3.5 text-xs outline-none focus:border-blue-400 transition" />
        </div>
      </div>
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-neutral-100 bg-neutral-50/50 text-xs uppercase text-neutral-500">
            <th className="px-5 py-3">N° Reçu</th><th className="px-5 py-3">Élève</th>
            <th className="px-5 py-3">Montant</th><th className="px-5 py-3">Date</th>
            <th className="px-5 py-3">Mode</th><th className="px-5 py-3">Statut</th>
            <th className="px-5 py-3 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-100">
          {filtered.map((r) => (
            <tr key={r.id} className="hover:bg-neutral-50/60">
              <td className="px-5 py-3 font-mono text-xs font-bold text-neutral-700">{r.numero}</td>
              <td className="px-5 py-3">
                <p className="font-medium text-neutral-800">{r.eleve}</p>
                <p className="text-xs text-neutral-500">{r.classe}</p>
              </td>
              <td className="px-5 py-3 font-mono font-bold text-neutral-900">{formatGNF(r.montant)}</td>
              <td className="px-5 py-3 text-xs text-neutral-500">{r.date}</td>
              <td className="px-5 py-3 text-xs text-neutral-600">{MODE_LABEL[r.mode] ?? r.mode}</td>
              <td className="px-5 py-3">
                <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                  r.statut === "Annulé" ? "bg-red-100 text-red-600"
                  : r.statut === "Envoyé" ? "bg-green-100 text-green-700"
                  : "bg-neutral-100 text-neutral-600"}`}>{r.statut}</span>
              </td>
              <td className="px-5 py-3 text-right">
                <Link href={`/portail/recus/${r.id}`} className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800">
                  <FileText className="h-3.5 w-3.5" /> Voir / PDF
                </Link>
              </td>
            </tr>
          ))}
          {filtered.length === 0 && (
            <tr><td colSpan={7} className="px-5 py-10 text-center text-neutral-500">
              <Receipt className="mx-auto mb-2 h-6 w-6 text-neutral-300" /> Aucun reçu.
            </td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
