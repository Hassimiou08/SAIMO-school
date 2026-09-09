import type { Metadata } from "next";
import Link from "next/link";
import { BellRing, ChevronRight, CheckCircle2 } from "lucide-react";
import { Sidebar } from "@/components/portal/Sidebar";
import { Topbar } from "@/components/portal/Topbar";
import { getNotificationsPortail } from "@/server/dal/notifications";

export const metadata: Metadata = {
  title: "Notifications — Portail SAIMO",
  description: "Ce qui demande votre attention dans l'établissement.",
};

const TON: Record<string, string> = {
  info: "border-blue-200 bg-blue-50 text-blue-700",
  attention: "border-orange-200 bg-orange-50 text-orange-700",
  urgent: "border-red-200 bg-red-50 text-red-700",
};

export default async function NotificationsPage() {
  const { items, total } = await getNotificationsPortail();

  return (
    <div className="min-h-screen bg-paper-100">
      <Sidebar />
      <div className="lg:pl-64">
        <Topbar />
        <main className="mx-auto max-w-3xl px-6 py-8 lg:px-10">
          <div className="mb-7">
            <h1 className="flex items-center gap-2 font-display text-2xl font-bold tracking-tight text-navy-900">
              <BellRing className="h-6 w-6 text-orange-500" /> Notifications
            </h1>
            <p className="mt-1 text-sm text-ink-500">
              {total > 0
                ? `${total} élément${total > 1 ? "s" : ""} demandent votre attention.`
                : "Tout est à jour."}
            </p>
          </div>

          {items.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-neutral-300 bg-white p-12 text-center">
              <CheckCircle2 className="mx-auto mb-3 h-8 w-8 text-green-500" />
              <p className="text-sm text-neutral-600">
                Aucune action en attente. Rien à traiter pour le moment.
              </p>
            </div>
          ) : (
            <ul className="space-y-3">
              {items.map((it) => (
                <li key={it.id}>
                  <Link
                    href={it.href}
                    className="flex items-center gap-4 rounded-2xl border border-neutral-200 bg-white p-5 transition hover:shadow-md hover:-translate-y-0.5"
                  >
                    <span
                      className={`flex h-10 min-w-10 items-center justify-center rounded-xl border px-1.5 text-sm font-bold ${TON[it.ton] ?? TON.info}`}
                    >
                      {it.compteur}
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="block text-sm font-bold text-neutral-800">{it.titre}</span>
                      <span className="block text-xs text-neutral-500">{it.detail}</span>
                    </span>
                    <ChevronRight className="h-4 w-4 flex-none text-neutral-300" />
                  </Link>
                </li>
              ))}
            </ul>
          )}

          <p className="mt-6 text-xs text-neutral-400">
            Cette liste se met à jour automatiquement : un élément disparaît dès que la situation est réglée.
          </p>
        </main>
      </div>
    </div>
  );
}
