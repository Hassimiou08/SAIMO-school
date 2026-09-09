import type { Metadata } from "next";
import { ShieldAlert } from "lucide-react";
import { Sidebar } from "@/components/portal/Sidebar";
import { Topbar } from "@/components/portal/Topbar";
import { AuditTable } from "@/components/portal/AuditTable";
import { listerAudit } from "@/server/dal/admin";

export const metadata: Metadata = { title: "Journal d'audit — Portail SAIMO" };

export default async function AuditPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; entite?: string }>;
}) {
  const sp = await searchParams;
  const logs = await listerAudit({ q: sp.q, entite: sp.entite });

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
              <h1 className="font-display text-2xl font-bold tracking-tight text-navy-900">Journal d&rsquo;audit</h1>
              <p className="mt-1 text-sm text-ink-500">Traçabilité des opérations sensibles ({logs.length} dernières).</p>
            </div>
          </div>
          <AuditTable logs={logs} />
        </main>
      </div>
    </div>
  );
}
