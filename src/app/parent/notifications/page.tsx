"use client";

import { Bell, AlertCircle, CalendarX2, Wallet2, CheckCircle2 } from "lucide-react";
import { ParentSidebar } from "@/components/parent/ParentSidebar";
import { ParentTopbar } from "@/components/parent/ParentTopbar";
import { notificationsParent, enfantsList } from "@/lib/mock-parent";
import { useState } from "react";
import { useSearchParams } from "next/navigation";

export default function NotificationsParentPage() {
  const searchParams = useSearchParams();
  const enfantId = searchParams.get("enfant") || "e1";
  const enfantInfo = enfantsList.find(e => e.id === enfantId) || enfantsList[0];
  const [notifs, setNotifs] = useState(notificationsParent);

  const getIcon = (type: string) => {
    switch (type) {
      case "note": return <CheckCircle2 className="h-5 w-5 text-emerald-600" />;
      case "absence": return <CalendarX2 className="h-5 w-5 text-orange-600" />;
      case "paiement": return <Wallet2 className="h-5 w-5 text-red-600" />;
      default: return <AlertCircle className="h-5 w-5 text-blue-600" />;
    }
  };

  const getBg = (type: string) => {
    switch (type) {
      case "note": return "bg-emerald-100";
      case "absence": return "bg-orange-100";
      case "paiement": return "bg-red-100";
      default: return "bg-blue-100";
    }
  };

  const markAllAsRead = () => {
    setNotifs(notifs.map(n => ({ ...n, lu: true })));
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <ParentSidebar />
      <div className="lg:pl-64">
        <ParentTopbar />
        <main className="mx-auto max-w-4xl px-6 py-8 lg:px-10">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="font-display text-2xl font-bold tracking-tight text-neutral-900">Notifications</h1>
              <p className="mt-1 text-sm text-neutral-500">Alertes et mises à jour pour {enfantInfo.nom}</p>
            </div>
            {notifs.some(n => !n.lu) && (
              <button
                onClick={markAllAsRead}
                className="rounded-full bg-neutral-100 px-4 py-2 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-200"
              >
                Tout marquer comme lu
              </button>
            )}
          </div>

          <div className="space-y-3">
            {notifs.map(n => (
              <div
                key={n.id}
                className={`flex items-start gap-4 rounded-2xl border p-4 transition-all ${
                  n.lu ? "border-neutral-100 bg-white" : "border-emerald-200 bg-emerald-50/50 shadow-sm"
                }`}
              >
                <div className={`mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${getBg(n.type)}`}>
                  {getIcon(n.type)}
                </div>
                <div className="flex-1">
                  <p className={`text-sm ${n.lu ? "text-neutral-600" : "font-semibold text-neutral-900"}`}>
                    {n.message}
                  </p>
                  <p className="mt-1 text-xs text-neutral-400">
                    {new Date(n.date).toLocaleDateString("fr-FR", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </p>
                </div>
                {!n.lu && (
                  <div className="h-2 w-2 rounded-full bg-emerald-500" />
                )}
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
