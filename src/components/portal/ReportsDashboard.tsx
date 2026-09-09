import { Users2, GraduationCap, Wallet2, TrendingUp, CalendarX2, FileBadge2 } from "lucide-react";
import type { StatsDashboard, MoyenneClasse } from "@/server/dal/dashboard";
import type { RapportCaisseDTO } from "@/server/dal/finance";
import type { StatsAbsences } from "@/server/dal/absences";
import { formatGNF } from "@/lib/format";

const MODE_LABEL: Record<string, string> = {
  especes: "Espèces", mobile: "Mobile Money", virement: "Virement", cheque: "Chèque",
};

export function ReportsDashboard({
  stats,
  moyennes,
  caisse,
  absences,
  periode,
}: {
  stats: StatsDashboard;
  moyennes: { classes: MoyenneClasse[]; moyenneGenerale: number | null };
  caisse: RapportCaisseDTO;
  absences: StatsAbsences;
  periode: string;
}) {
  const kpis = [
    { icon: Users2, label: "Élèves actifs", value: String(stats.elevesActifs) },
    { icon: GraduationCap, label: "Enseignants", value: String(stats.enseignantsActifs) },
    { icon: TrendingUp, label: "Recouvrement", value: `${stats.tauxRecouvrement}%` },
    { icon: CalendarX2, label: "Absences (non just.)", value: String(absences.nonJustifiees) },
    { icon: FileBadge2, label: "Bulletins générés", value: String(stats.bulletinsGeneres) },
    { icon: Wallet2, label: "Recettes année", value: formatGNF(stats.recettesTotales) },
  ];

  const maxMoy = 20;

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {kpis.map((k) => (
          <div key={k.label} className="rounded-2xl border border-neutral-200 bg-white p-5">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600"><k.icon className="h-5 w-5" /></span>
              <div>
                <p className="font-display text-xl font-black text-neutral-900">{k.value}</p>
                <p className="text-xs text-neutral-500">{k.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-neutral-200 bg-white p-6">
          <h3 className="font-display text-sm font-bold text-navy-900">Niveau par classe {moyennes.moyenneGenerale != null && `(moy. ${moyennes.moyenneGenerale.toFixed(1)}/20)`}</h3>
          <div className="mt-4 space-y-2.5">
            {moyennes.classes.filter((c) => c.value != null).map((c) => (
              <div key={c.nom}>
                <div className="flex justify-between text-xs text-neutral-500"><span>{c.nom}</span><span className="font-mono">{c.value!.toFixed(1)}/20</span></div>
                <div className="mt-1 h-2 rounded-full bg-neutral-100">
                  <div className="h-full rounded-full bg-blue-500" style={{ width: `${(c.value! / maxMoy) * 100}%` }} />
                </div>
              </div>
            ))}
            {moyennes.classes.every((c) => c.value == null) && <p className="text-sm text-neutral-400">Aucun bulletin validé.</p>}
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-6">
          <h3 className="font-display text-sm font-bold text-navy-900">Caisse — {periode}</h3>
          <p className="mt-2 font-display text-2xl font-black text-green-600">{formatGNF(caisse.total)}</p>
          <p className="text-xs text-neutral-500">{caisse.nombre} encaissement{caisse.nombre > 1 ? "s" : ""}</p>
          <div className="mt-4 space-y-2">
            {caisse.parMode.map((m) => (
              <div key={m.mode} className="flex items-center justify-between text-sm">
                <span className="text-neutral-600">{MODE_LABEL[m.mode] ?? m.mode}</span>
                <span className="font-mono font-semibold text-neutral-800">{formatGNF(m.total)} <span className="text-xs text-neutral-400">({m.nombre})</span></span>
              </div>
            ))}
            {caisse.parMode.length === 0 && <p className="text-sm text-neutral-400">Aucun encaissement sur la période.</p>}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-neutral-200 bg-white overflow-hidden">
        <div className="border-b border-neutral-100 p-4 text-sm font-semibold text-neutral-700">Derniers encaissements</div>
        <table className="w-full text-left text-sm">
          <thead><tr className="border-b border-neutral-100 bg-neutral-50/50 text-xs uppercase text-neutral-500"><th className="px-5 py-3">Reçu</th><th className="px-5 py-3">Élève</th><th className="px-5 py-3">Montant</th><th className="px-5 py-3">Mode</th><th className="px-5 py-3">Date</th></tr></thead>
          <tbody className="divide-y divide-neutral-100">
            {caisse.lignes.slice(0, 15).map((l) => (
              <tr key={l.id}>
                <td className="px-5 py-2.5 font-mono text-xs text-neutral-500">{l.numeroRecu}</td>
                <td className="px-5 py-2.5 text-neutral-800">{l.eleve}</td>
                <td className="px-5 py-2.5 font-mono">{formatGNF(l.montant)}</td>
                <td className="px-5 py-2.5 text-xs text-neutral-600">{MODE_LABEL[l.mode] ?? l.mode}</td>
                <td className="px-5 py-2.5 text-xs text-neutral-500">{l.date}</td>
              </tr>
            ))}
            {caisse.lignes.length === 0 && <tr><td colSpan={5} className="px-5 py-8 text-center text-neutral-500">Aucun encaissement.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
