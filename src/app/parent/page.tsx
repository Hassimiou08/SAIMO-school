import Link from "next/link";
import {
  BookOpen, CalendarX2, Wallet2, TrendingUp, AlertCircle, CheckCircle,
} from "lucide-react";
import { ParentShell, AucunEnfant } from "@/components/parent/ParentShell";
import { resoudreEnfant, getDashboardEnfant } from "@/server/dal/parent";
import { formatGNF } from "@/lib/format";

export const metadata = { title: "Tableau de bord — Espace Parent SAIMO" };

export default async function ParentDashboard({
  searchParams,
}: {
  searchParams: Promise<{ enfant?: string }>;
}) {
  const sp = await searchParams;
  const enfant = await resoudreEnfant(sp.enfant);
  if (!enfant) return <AucunEnfant />;

  const d = await getDashboardEnfant(enfant.id);
  const q = `?enfant=${enfant.id}`;

  const kpis = [
    {
      label: "Moyenne générale",
      value: d.moyenneGenerale != null ? `${d.moyenneGenerale.toFixed(2)}/20` : "—",
      icon: TrendingUp,
      cls: "text-emerald-700",
      bg: "bg-emerald-100",
      href: `/parent/notes${q}`,
    },
    {
      label: "Absences",
      value: `${d.absencesTotal}${d.absencesNonJustifiees ? ` · ${d.absencesNonJustifiees} N/J` : ""}`,
      icon: CalendarX2,
      cls: d.absencesNonJustifiees ? "text-orange-700" : "text-green-700",
      bg: d.absencesNonJustifiees ? "bg-orange-100" : "bg-green-100",
      href: `/parent/absences${q}`,
    },
    {
      label: "Solde restant",
      value: formatGNF(d.soldeTotal),
      icon: Wallet2,
      cls: d.soldeTotal > 0 ? "text-red-700" : "text-green-700",
      bg: d.soldeTotal > 0 ? "bg-red-100" : "bg-green-100",
      href: `/parent/paiements${q}`,
    },
    {
      label: "Notifications",
      value: `${d.nbNotifs}`,
      icon: AlertCircle,
      cls: d.nbNotifs ? "text-blue-700" : "text-neutral-500",
      bg: d.nbNotifs ? "bg-blue-100" : "bg-neutral-100",
      href: `/parent/notifications${q}`,
    },
  ];

  return (
    <ParentShell max="max-w-7xl">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold tracking-tight text-neutral-900">
          Suivi de {enfant.prenom}
        </h1>
        <p className="mt-1 text-sm text-neutral-500">
          {enfant.nomComplet} · {enfant.classe} ({enfant.cycle})
          {enfant.profPrincipal ? ` · Prof. principal : ${enfant.profPrincipal}` : ""}
        </p>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {kpis.map((k) => (
          <Link
            key={k.label}
            href={k.href}
            className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm transition hover:shadow-md"
          >
            <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${k.bg}`}>
              <k.icon className={`h-5 w-5 ${k.cls}`} />
            </div>
            <p className="text-xs font-medium text-neutral-500">{k.label}</p>
            <p className={`mt-1 text-lg font-bold ${k.cls}`}>{k.value}</p>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-4">
            <h2 className="flex items-center gap-2 font-bold text-neutral-900">
              <BookOpen className="h-4 w-4 text-emerald-600" /> Notes
              {d.periodeNotes ? ` — ${d.periodeNotes}` : ""}
            </h2>
            <Link href={`/parent/notes${q}`} className="text-xs font-semibold text-emerald-600 hover:underline">
              Voir tout
            </Link>
          </div>
          {d.matieres.length === 0 ? (
            <p className="px-6 py-10 text-center text-sm text-neutral-500">
              Aucune note verrouillée pour la période en cours.
            </p>
          ) : (
            <div className="divide-y divide-neutral-50">
              {d.matieres.map((n) => (
                <div key={n.matiere} className="flex items-center justify-between px-6 py-3.5">
                  <div>
                    <p className="text-sm font-semibold text-neutral-800">{n.matiere}</p>
                    <p className="text-xs text-neutral-400">Coef. {n.coefficient}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="h-2 w-32 overflow-hidden rounded-full bg-neutral-100">
                      <div
                        className={`h-full rounded-full ${(n.moyenne ?? 0) >= 14 ? "bg-emerald-500" : (n.moyenne ?? 0) >= 10 ? "bg-blue-500" : "bg-red-400"}`}
                        style={{ width: `${((n.moyenne ?? 0) / 20) * 100}%` }}
                      />
                    </div>
                    <span
                      className={`w-12 text-right text-sm font-bold ${(n.moyenne ?? 0) >= 14 ? "text-emerald-600" : (n.moyenne ?? 0) >= 10 ? "text-blue-600" : "text-red-500"}`}
                    >
                      {n.moyenne != null ? `${n.moyenne.toFixed(1)}` : "—"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-sm font-bold text-neutral-900">Points forts / à améliorer</h2>
            {d.meilleureMatiere ? (
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100">
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-neutral-500">Meilleure matière</p>
                    <p className="text-sm font-bold text-neutral-900">{d.meilleureMatiere.matiere}</p>
                    <p className="text-xs font-semibold text-emerald-600">
                      {d.meilleureMatiere.moyenne?.toFixed(2)}/20
                    </p>
                  </div>
                </div>
                {d.matiereAmelioree && (
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-orange-100">
                      <AlertCircle className="h-4 w-4 text-orange-500" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-neutral-500">À améliorer</p>
                      <p className="text-sm font-bold text-neutral-900">{d.matiereAmelioree.matiere}</p>
                      <p className="text-xs font-semibold text-orange-500">
                        {d.matiereAmelioree.moyenne?.toFixed(2)}/20
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-neutral-500">Pas encore de notes.</p>
            )}
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
            <h2 className="mb-3 text-sm font-bold text-neutral-900">Dernier bulletin</h2>
            {d.dernierBulletin ? (
              <Link
                href={`/parent/bulletins${q}`}
                className="block rounded-xl border border-neutral-100 bg-neutral-50 p-3 transition hover:bg-neutral-100"
              >
                <p className="text-sm font-bold text-neutral-900">
                  {d.dernierBulletin.periode} — {d.dernierBulletin.moyenneGenerale?.toFixed(2)}/20
                </p>
                <p className="text-xs text-neutral-500">
                  Rang {d.dernierBulletin.rang ?? "—"}/{d.dernierBulletin.effectif ?? "—"} ·{" "}
                  {d.dernierBulletin.mention}
                </p>
              </Link>
            ) : (
              <p className="text-sm text-neutral-500">Aucun bulletin publié.</p>
            )}
          </div>
        </div>
      </div>
    </ParentShell>
  );
}
