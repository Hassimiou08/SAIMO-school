"use client";

import Link from "next/link";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Clock,
  CheckCircle,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { TableauBordCompta } from "@/server/dal/compta";
import { formatGNF } from "@/lib/format";

const fmtShort = (val: number) => {
  if (Math.abs(val) >= 1_000_000) return (val / 1_000_000).toFixed(1) + "M";
  if (Math.abs(val) >= 1_000) return (val / 1_000).toFixed(0) + "K";
  return String(val);
};

export function ComptaDashboard({ data }: { data: TableauBordCompta }) {
  const kpis = [
    {
      label: "Trésorerie",
      value: formatGNF(data.tresorerie),
      icon: Wallet,
      bg: "bg-slate-100",
      fg: "text-slate-700",
      vc: data.tresorerie >= 0 ? "text-neutral-900" : "text-red-600",
    },
    {
      label: "Recettes (mois)",
      value: formatGNF(data.recettesMois),
      icon: TrendingUp,
      bg: "bg-emerald-100",
      fg: "text-emerald-700",
      vc: "text-emerald-700",
    },
    {
      label: "Dépenses (mois)",
      value: formatGNF(data.depensesMois),
      icon: TrendingDown,
      bg: "bg-orange-100",
      fg: "text-orange-700",
      vc: "text-orange-700",
    },
    {
      label: "Reste à recouvrer",
      value: formatGNF(data.impayes),
      icon: AlertTriangle,
      bg: "bg-red-100",
      fg: "text-red-700",
      vc: "text-red-600",
    },
  ];

  return (
    <>
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-neutral-900">
            Tableau de bord financier
          </h1>
          <p className="mt-1 text-sm text-neutral-500">Vue d&rsquo;ensemble</p>
        </div>
        <Link
          href="/compta/recettes"
          className="inline-flex items-center gap-2 self-start rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-violet-600/20 transition hover:bg-violet-700"
        >
          Nouvel encaissement
        </Link>
      </div>

      {/* KPIs */}
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {kpis.map((k) => (
          <div
            key={k.label}
            className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm transition hover:shadow-md"
          >
            <div className="mb-3 flex items-center gap-3">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-xl ${k.bg}`}
              >
                <k.icon className={`h-4 w-4 ${k.fg}`} />
              </div>
              <p className="text-xs font-semibold text-neutral-500">{k.label}</p>
            </div>
            <p className={`text-lg font-bold leading-tight ${k.vc}`}>{k.value}</p>
          </div>
        ))}
      </div>

      {/* Graphiques */}
      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm lg:col-span-2">
          <h2 className="mb-1 text-sm font-bold text-neutral-900">
            Flux de trésorerie
          </h2>
          <p className="mb-5 text-xs text-neutral-400">
            Recettes vs dépenses (6 derniers mois)
          </p>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={data.flux} margin={{ top: 4, right: 8, left: 8, bottom: 0 }}>
              <defs>
                <linearGradient id="gRec" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gDep" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="mois"
                tick={{ fontSize: 11, fill: "#9ca3af" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tickFormatter={fmtShort}
                tick={{ fontSize: 11, fill: "#9ca3af" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                formatter={(v) => formatGNF(Number(v))}
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid #e5e7eb",
                  fontSize: 12,
                }}
              />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
              <Area
                type="monotone"
                dataKey="recettes"
                name="Recettes"
                stroke="#10b981"
                fill="url(#gRec)"
                strokeWidth={2.5}
                dot={false}
              />
              <Area
                type="monotone"
                dataKey="depenses"
                name="Dépenses"
                stroke="#f97316"
                fill="url(#gDep)"
                strokeWidth={2}
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="mb-1 text-sm font-bold text-neutral-900">
            Répartition des dépenses
          </h2>
          <p className="mb-5 text-xs text-neutral-400">Par catégorie (réglées)</p>
          {data.parCategorie.length === 0 ? (
            <p className="py-16 text-center text-sm text-neutral-400">
              Aucune dépense réglée
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart
                data={data.parCategorie}
                layout="vertical"
                margin={{ top: 0, right: 8, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                <XAxis
                  type="number"
                  tickFormatter={fmtShort}
                  tick={{ fontSize: 10, fill: "#9ca3af" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="categorie"
                  tick={{ fontSize: 11, fill: "#6b7280" }}
                  axisLine={false}
                  tickLine={false}
                  width={80}
                />
                <Tooltip
                  formatter={(v) => formatGNF(Number(v))}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #e5e7eb",
                    fontSize: 12,
                  }}
                />
                <Bar
                  dataKey="montant"
                  name="Montant"
                  fill="#7c3aed"
                  radius={[0, 6, 6, 0]}
                  opacity={0.85}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Listes */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-4">
            <h2 className="flex items-center gap-2 text-sm font-bold text-neutral-900">
              <Clock className="h-4 w-4 text-orange-500" /> Frais impayés
            </h2>
            <Link
              href="/compta/recettes"
              className="text-xs font-semibold text-violet-600 hover:underline"
            >
              Encaisser
            </Link>
          </div>
          <div className="divide-y divide-neutral-50">
            {data.fraisImpayes.map((f) => (
              <div
                key={f.id}
                className="flex items-center justify-between px-6 py-4 hover:bg-neutral-50"
              >
                <div>
                  <p className="text-sm font-bold text-neutral-900">{f.eleve}</p>
                  <p className="text-xs text-neutral-500">
                    {f.classe} — {f.motif}
                  </p>
                </div>
                <p className="font-mono text-sm font-bold text-neutral-800">
                  {formatGNF(f.solde)}
                </p>
              </div>
            ))}
            {data.fraisImpayes.length === 0 && (
              <div className="flex items-center justify-center gap-2 px-6 py-8 text-center text-sm font-semibold text-emerald-600">
                <CheckCircle className="h-4 w-4" /> Aucun impayé
              </div>
            )}
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-4">
            <h2 className="flex items-center gap-2 text-sm font-bold text-neutral-900">
              <TrendingDown className="h-4 w-4 text-orange-500" /> Dernières dépenses
            </h2>
            <Link
              href="/compta/depenses"
              className="text-xs font-semibold text-violet-600 hover:underline"
            >
              Tout voir
            </Link>
          </div>
          <div className="divide-y divide-neutral-50">
            {data.dernieresDepenses.map((d) => (
              <div
                key={d.id}
                className="flex items-center justify-between px-6 py-4 hover:bg-neutral-50"
              >
                <div>
                  <p className="text-sm font-bold text-neutral-900">
                    {d.beneficiaire}
                  </p>
                  <span className="mt-1 inline-block rounded bg-neutral-100 px-1.5 py-0.5 text-[10px] font-bold uppercase text-neutral-500">
                    {d.categorie}
                  </span>
                </div>
                <div className="text-right">
                  <p className="font-mono text-sm font-bold text-neutral-900">
                    {formatGNF(d.montant)}
                  </p>
                  <p
                    className={`text-[10px] font-bold ${
                      d.statut === "paye" ? "text-emerald-500" : "text-blue-500"
                    }`}
                  >
                    {d.statut === "paye" ? "Payé" : "Planifié"}
                  </p>
                </div>
              </div>
            ))}
            {data.dernieresDepenses.length === 0 && (
              <div className="px-6 py-8 text-center text-sm text-neutral-400">
                Aucune dépense enregistrée
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
