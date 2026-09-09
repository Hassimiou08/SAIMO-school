import { AlertCircle, CalendarX2, Wallet2, CheckCircle2, FileText, Bell } from "lucide-react";
import { ParentShell, AucunEnfant } from "@/components/parent/ParentShell";
import { resoudreEnfant, getNotificationsEnfant } from "@/server/dal/parent";

export const metadata = { title: "Notifications — Espace Parent SAIMO" };

const ICON = {
  note: { i: CheckCircle2, c: "text-emerald-600", bg: "bg-emerald-100" },
  absence: { i: CalendarX2, c: "text-orange-600", bg: "bg-orange-100" },
  paiement: { i: Wallet2, c: "text-red-600", bg: "bg-red-100" },
  bulletin: { i: FileText, c: "text-blue-600", bg: "bg-blue-100" },
} as const;

export default async function NotificationsParentPage({
  searchParams,
}: {
  searchParams: Promise<{ enfant?: string }>;
}) {
  const sp = await searchParams;
  const enfant = await resoudreEnfant(sp.enfant);
  if (!enfant) return <AucunEnfant />;

  const notifs = await getNotificationsEnfant(enfant.id);

  return (
    <ParentShell max="max-w-4xl">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold tracking-tight text-neutral-900">Notifications</h1>
        <p className="mt-1 text-sm text-neutral-500">Alertes et mises à jour pour {enfant.prenom}</p>
      </div>

      {notifs.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-neutral-300 bg-white p-12 text-center">
          <Bell className="mx-auto mb-2 h-6 w-6 text-neutral-300" />
          <p className="text-sm text-neutral-500">Rien à signaler pour le moment.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifs.map((n) => {
            const cfg = ICON[n.type];
            return (
              <div
                key={n.id}
                className="flex items-start gap-4 rounded-2xl border border-neutral-100 bg-white p-4"
              >
                <div className={`mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${cfg.bg}`}>
                  <cfg.i className={`h-5 w-5 ${cfg.c}`} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-neutral-800">{n.message}</p>
                  <p className="mt-1 text-xs text-neutral-400">{n.date}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <p className="mt-6 text-xs text-neutral-400">
        Cette liste se met à jour automatiquement selon les notes, absences, paiements et bulletins.
      </p>
    </ParentShell>
  );
}
