"use client";

import { Search, ShieldAlert, Clock } from "lucide-react";
import { auditLogs } from "@/lib/mock-admin";
import { Sidebar } from "@/components/portal/Sidebar";
import { Topbar } from "@/components/portal/Topbar";

export default function AuditPage() {
  return (
    <div className="min-h-screen bg-paper-100">
      <Sidebar />
      <div className="lg:pl-64">
        <Topbar />
        <main className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
          <div className="mb-7 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold tracking-tight text-navy-900">Journal d'Audit</h1>
              <p className="mt-1 text-sm text-ink-500">Traçabilité complète des actions effectuées sur le système.</p>
            </div>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-neutral-100 bg-neutral-50/50 text-xs uppercase tracking-wide text-neutral-500">
                  <th className="px-5 py-3.5 font-semibold">Date & Heure</th>
                  <th className="px-5 py-3.5 font-semibold">Utilisateur</th>
                  <th className="px-5 py-3.5 font-semibold">Action</th>
                  <th className="px-5 py-3.5 font-semibold">Entité</th>
                  <th className="px-5 py-3.5 font-semibold">Détails</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-neutral-200">
                {auditLogs.map(log => (
                  <tr key={log.id} className="hover:bg-orange-50/30 transition text-sm">
                    <td className="px-5 py-3.5 text-xs text-neutral-500 whitespace-nowrap">
                      <div className="flex items-center gap-1.5"><Clock className="h-3 w-3" /> {new Date(log.date).toLocaleString("fr-FR")}</div>
                    </td>
                    <td className="px-5 py-3.5 font-semibold text-neutral-800">{log.utilisateur}</td>
                    <td className="px-5 py-3.5">
                      <span className={`rounded px-2 py-0.5 text-[10px] font-bold tracking-wider ${
                        log.action === "CREATE" ? "bg-green-100 text-green-700" :
                        log.action === "UPDATE" ? "bg-blue-100 text-blue-700" :
                        log.action === "DELETE" ? "bg-red-100 text-red-700" : "bg-neutral-100 text-neutral-700"
                      }`}>{log.action}</span>
                    </td>
                    <td className="px-5 py-3.5 font-mono text-xs text-neutral-500">{log.entite}</td>
                    <td className="px-5 py-3.5 text-neutral-600">{log.detail}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}
