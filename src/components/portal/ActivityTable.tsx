import Link from "next/link";
import { UserPlus, ClipboardCheck, Wallet2, FileBadge2, Pencil, Lock, Activity } from "lucide-react";
import type { ActiviteItem } from "@/server/dal/dashboard";

const ICONS: Record<string, { icon: typeof Activity; color: string }> = {
  CREATE: { icon: UserPlus, color: "bg-blue-100 text-blue-600" },
  UPDATE: { icon: Pencil, color: "bg-orange-100 text-orange-600" },
  VALIDATE: { icon: ClipboardCheck, color: "bg-green-100 text-green-600" },
  LOCK: { icon: Lock, color: "bg-neutral-100 text-neutral-600" },
  PAYMENT: { icon: Wallet2, color: "bg-orange-100 text-orange-600" },
  GENERATE_PDF: { icon: FileBadge2, color: "bg-blue-100 text-blue-600" },
};

const LIBELLE: Record<string, string> = {
  CREATE: "Création",
  UPDATE: "Modification",
  VALIDATE: "Validation",
  LOCK: "Verrouillage",
  ARCHIVE: "Archivage",
  PAYMENT: "Paiement",
  CANCEL_PAYMENT: "Annulation paiement",
};

export function ActivityTable({ items }: { items: ActiviteItem[] }) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-6">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="font-display text-sm font-bold text-neutral-900">Activité récente</h3>
        <Link href="/portail/audit" className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition">
          Voir le journal complet →
        </Link>
      </div>

      {items.length === 0 ? (
        <p className="py-8 text-center text-sm text-neutral-400">Aucune activité enregistrée pour le moment.</p>
      ) : (
        <ul className="divide-y divide-neutral-100">
          {items.map((item) => {
            const conf = ICONS[item.action] ?? { icon: Activity, color: "bg-neutral-100 text-neutral-600" };
            return (
              <li key={item.id} className="flex items-center gap-3.5 py-3.5 hover:bg-neutral-50 rounded-xl px-2 -mx-2 transition">
                <span className={`flex h-9 w-9 flex-none items-center justify-center rounded-xl ${conf.color}`}>
                  <conf.icon className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-neutral-800">
                    {LIBELLE[item.action] ?? item.action} — {item.entite}
                    {item.detail ? ` (${item.detail})` : ""}
                  </p>
                  <p className="mt-0.5 text-xs text-neutral-500">{item.who}</p>
                </div>
                <span className="flex-none text-[11px] font-medium text-neutral-400">{item.when}</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
