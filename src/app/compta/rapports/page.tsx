import type { Metadata } from "next";
import { Calendar, FileBarChart, PieChart, Download } from "lucide-react";
import { ComptaShell } from "@/components/compta/ComptaShell";
import { getSyntheseRapports } from "@/server/dal/compta";
import { formatGNF } from "@/lib/format";

export const metadata: Metadata = {
  title: "Rapports financiers — Portail comptable SAIMO",
};

export default async function RapportsPage() {
  const r = await getSyntheseRapports();

  const cards = [
    {
      icon: Calendar,
      bg: "bg-indigo-100",
      fg: "text-indigo-700",
      titre: "Bilan mensuel",
      desc: `Entrées et sorties de ${r.mois}.`,
    },
    {
      icon: FileBarChart,
      bg: "bg-emerald-100",
      fg: "text-emerald-700",
      titre: "Bilan annuel",
      desc: `Synthèse de l'année scolaire ${r.anneeLibelle}.`,
    },
    {
      icon: PieChart,
      bg: "bg-orange-100",
      fg: "text-orange-700",
      titre: "Analyse des dépenses",
      desc: "Répartition par poste (salaires, charges, maintenance…).",
    },
  ];

  return (
    <ComptaShell>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold tracking-tight text-neutral-900">
          Rapports financiers
        </h1>
        <p className="mt-1 text-sm text-neutral-500">
          Bilans comptables de l&rsquo;établissement.
        </p>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <div
            key={c.titre}
            className="flex flex-col items-start rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm"
          >
            <div
              className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${c.bg} ${c.fg}`}
            >
              <c.icon className="h-6 w-6" />
            </div>
            <h3 className="mb-2 text-lg font-bold text-neutral-900">{c.titre}</h3>
            <p className="mb-6 flex-1 text-sm text-neutral-500">{c.desc}</p>
            <button
              disabled
              title="Export disponible prochainement"
              className="inline-flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-neutral-100 py-2.5 text-sm font-semibold text-neutral-400"
            >
              <Download className="h-4 w-4" /> Export bientôt
            </button>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="mb-6 font-bold text-neutral-900">
            Mois en cours — {r.mois}
          </h2>
          <div className="space-y-4">
            <Ligne label="Total recettes" value={r.recettesMois} tone="emerald" />
            <Ligne label="Total dépenses" value={r.depensesMois} tone="orange" />
            <div className="border-t border-neutral-100 pt-4">
              <Ligne
                label="Résultat net"
                value={r.resultatMois}
                tone={r.resultatMois >= 0 ? "indigo" : "red"}
                bold
              />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="mb-6 font-bold text-neutral-900">
            Année scolaire {r.anneeLibelle}
          </h2>
          <div className="space-y-4">
            <Ligne label="Total recettes" value={r.recettesAnnee} tone="emerald" />
            <Ligne label="Total dépenses" value={r.depensesAnnee} tone="orange" />
            <div className="border-t border-neutral-100 pt-4">
              <Ligne
                label="Résultat net"
                value={r.resultatAnnee}
                tone={r.resultatAnnee >= 0 ? "indigo" : "red"}
                bold
              />
            </div>
          </div>
        </div>
      </div>
    </ComptaShell>
  );
}

function Ligne({
  label,
  value,
  tone,
  bold,
}: {
  label: string;
  value: number;
  tone: "emerald" | "orange" | "indigo" | "red";
  bold?: boolean;
}) {
  const color = {
    emerald: "text-emerald-600",
    orange: "text-orange-600",
    indigo: "text-indigo-600",
    red: "text-red-600",
  }[tone];
  return (
    <div className="flex items-center justify-between">
      <span
        className={`text-sm ${bold ? "font-bold text-neutral-800" : "text-neutral-500"}`}
      >
        {label}
      </span>
      <span
        className={`font-mono ${bold ? "text-xl font-bold" : "text-base font-semibold"} ${color}`}
      >
        {formatGNF(value)}
      </span>
    </div>
  );
}
