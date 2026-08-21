"use client";

import { BookOpen, CalendarX2, Wallet2, TrendingUp, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { ParentSidebar } from "@/components/parent/ParentSidebar";
import { ParentTopbar } from "@/components/parent/ParentTopbar";
import { enfantsList, parentInfo, notesParent, absencesParent, paiementsParent, notificationsParent } from "@/lib/mock-parent";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function ParentDashboard() {
  const searchParams = useSearchParams();
  const enfantId = searchParams.get("enfant") || "e1";
  const enfantInfo = enfantsList.find(e => e.id === enfantId) || enfantsList[0];
  const moyenneGenerale =
    notesParent.reduce((acc, n) => acc + (n.moyenne ?? 0) * n.coefficient, 0) /
    notesParent.reduce((acc, n) => acc + n.coefficient, 0);

  const absencesNonJustifiees = absencesParent.filter(a => !a.justifiee).length;
  const paiementsEnRetard = paiementsParent.filter(p => p.statut === "Impaye").length;
  const unread = notificationsParent.filter(n => !n.lu);

  const meilleureMatiere = [...notesParent].sort((a, b) => (b.moyenne ?? 0) - (a.moyenne ?? 0))[0];
  const matiereAmelioree = [...notesParent].sort((a, b) => (a.moyenne ?? 0) - (b.moyenne ?? 0))[0];

  return (
    <div className="min-h-screen bg-neutral-50">
      <ParentSidebar />
      <div className="lg:pl-64">
        <ParentTopbar />

        <main className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-display text-2xl font-bold tracking-tight text-neutral-900">
              Bonjour, {parentInfo.nom.split(" ")[0]} !
            </h1>
            <p className="mt-1 text-sm text-neutral-500">
              Voici le suivi scolaire de votre enfant &mdash; {enfantInfo.nom} &bull; {enfantInfo.classe}
            </p>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 mb-8">
            {[
              {
                label: "Moyenne Generale",
                value: moyenneGenerale.toFixed(2) + "/20",
                icon: TrendingUp,
                color: "bg-emerald-50 text-emerald-700",
                iconBg: "bg-emerald-100",
                href: "/parent/notes",
              },
              {
                label: "Absences",
                value: absencesParent.length + " dont " + absencesNonJustifiees + " N/J",
                icon: CalendarX2,
                color: absencesNonJustifiees > 0 ? "bg-orange-50 text-orange-700" : "bg-green-50 text-green-700",
                iconBg: absencesNonJustifiees > 0 ? "bg-orange-100" : "bg-green-100",
                href: "/parent/absences",
              },
              {
                label: "Paiements",
                value: paiementsEnRetard > 0 ? paiementsEnRetard + " en retard" : "A jour",
                icon: Wallet2,
                color: paiementsEnRetard > 0 ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700",
                iconBg: paiementsEnRetard > 0 ? "bg-red-100" : "bg-green-100",
                href: "/parent/paiements",
              },
              {
                label: "Notifications",
                value: unread.length + " non lues",
                icon: AlertCircle,
                color: unread.length > 0 ? "bg-blue-50 text-blue-700" : "bg-neutral-50 text-neutral-500",
                iconBg: unread.length > 0 ? "bg-blue-100" : "bg-neutral-100",
                href: "/parent/notifications",
              },
            ].map(stat => (
              <Link
                key={stat.label}
                href={stat.href}
                className={`rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm hover:shadow-md transition group`}
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.iconBg} mb-3`}>
                  <stat.icon className={`h-5 w-5 ${stat.color.split(" ")[1]}`} />
                </div>
                <p className="text-xs font-medium text-neutral-500">{stat.label}</p>
                <p className={`text-lg font-bold mt-1 ${stat.color.split(" ")[1]}`}>{stat.value}</p>
              </Link>
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Notes par matiere */}
            <div className="lg:col-span-2 rounded-2xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
                <h2 className="font-bold text-neutral-900 flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-emerald-600" /> Notes du trimestre
                </h2>
                <Link href="/parent/notes" className="text-xs font-semibold text-emerald-600 hover:underline">Voir tout</Link>
              </div>
              <div className="divide-y divide-neutral-50">
                {notesParent.map(n => (
                  <div key={n.id} className="flex items-center justify-between px-6 py-3.5 hover:bg-neutral-50 transition">
                    <div>
                      <p className="text-sm font-semibold text-neutral-800">{n.matiere}</p>
                      <p className="text-xs text-neutral-400">Coef. {n.coefficient}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-32 h-2 bg-neutral-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${(n.moyenne ?? 0) >= 14 ? "bg-emerald-500" : (n.moyenne ?? 0) >= 10 ? "bg-blue-500" : "bg-red-400"}`}
                          style={{ width: `${((n.moyenne ?? 0) / 20) * 100}%` }}
                        />
                      </div>
                      <span className={`text-sm font-bold w-10 text-right ${(n.moyenne ?? 0) >= 14 ? "text-emerald-600" : (n.moyenne ?? 0) >= 10 ? "text-blue-600" : "text-red-500"}`}>
                        {n.moyenne?.toFixed(1)}/20
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Colonne droite */}
            <div className="flex flex-col gap-6">
              {/* Points forts */}
              <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm p-5">
                <h2 className="font-bold text-neutral-900 mb-4 text-sm">Points forts / a ameliorer</h2>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 mt-0.5 flex-shrink-0">
                      <CheckCircle className="h-4 w-4 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-neutral-500">Meilleure matiere</p>
                      <p className="text-sm font-bold text-neutral-900">{meilleureMatiere.matiere}</p>
                      <p className="text-xs text-emerald-600 font-semibold">{meilleureMatiere.moyenne}/20 &mdash; {meilleureMatiere.appreciation}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-orange-100 mt-0.5 flex-shrink-0">
                      <AlertCircle className="h-4 w-4 text-orange-500" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-neutral-500">A ameliorer</p>
                      <p className="text-sm font-bold text-neutral-900">{matiereAmelioree.matiere}</p>
                      <p className="text-xs text-orange-500 font-semibold">{matiereAmelioree.moyenne}/20 &mdash; {matiereAmelioree.appreciation}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Prochains paiements */}
              <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm p-5">
                <h2 className="font-bold text-neutral-900 mb-4 text-sm flex items-center gap-2">
                  <Clock className="h-4 w-4 text-orange-500" /> Paiements
                </h2>
                <div className="space-y-2">
                  {paiementsParent.map(p => (
                    <div key={p.id} className="flex items-center justify-between text-xs">
                      <span className="truncate text-neutral-600 max-w-[140px]">{p.libelle}</span>
                      <span className={`font-bold rounded-full px-2 py-0.5 ${
                        p.statut === "Solde" ? "bg-green-100 text-green-700" :
                        p.statut === "Partiel" ? "bg-blue-100 text-blue-700" :
                        "bg-red-100 text-red-700"
                      }`}>{p.statut}</span>
                    </div>
                  ))}
                </div>
                <Link href="/parent/paiements" className="mt-3 block text-center text-xs font-semibold text-emerald-600 hover:underline">
                  Gerer mes paiements
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
