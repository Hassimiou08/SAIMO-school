import type { RecuDetail } from "@/server/dal/finance";
import { formatGNF } from "@/lib/format";

/** Reçu de paiement — écran + impression + PDF (via [data-bulletin]). */
export function RecuImprimable({ r }: { r: RecuDetail }) {
  return (
    <article
      data-bulletin
      className="relative rounded-2xl border border-neutral-200 bg-white p-8 text-neutral-900 print:rounded-none print:border-0 print:p-0"
    >
      {r.annule && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span className="rotate-[-18deg] rounded-lg border-4 border-red-500/60 px-6 py-2 text-4xl font-black tracking-widest text-red-500/60">
            ANNULÉ
          </span>
        </div>
      )}

      <header className="flex items-start justify-between border-b-2 border-navy-900 pb-4">
        <div>
          <p className="font-display text-lg font-bold text-navy-900">{r.etablissement}</p>
          <p className="text-xs uppercase tracking-widest text-neutral-500">Reçu de paiement</p>
        </div>
        <div className="text-right text-sm">
          <p className="font-mono font-bold text-navy-900">N° {r.numero}</p>
          <p className="text-neutral-500">{r.date}</p>
        </div>
      </header>

      <div className="mt-5 grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
        <Info label="Élève" value={r.eleve} />
        <Info label="Matricule" value={r.matricule ?? "—"} />
        <Info label="Classe" value={r.classe} />
        <Info label="Tuteur" value={r.tuteur ?? "—"} />
      </div>

      <table className="mt-6 w-full text-left text-sm">
        <thead>
          <tr className="border-y border-neutral-300 text-xs uppercase text-neutral-500">
            <th className="py-2">Nature des frais</th>
            <th className="py-2">Mode</th>
            <th className="py-2 text-right">Montant réglé</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-neutral-100">
            <td className="py-3 font-medium">{r.natureFrais}</td>
            <td className="py-3">
              {r.mode}
              {r.reference ? ` — ${r.reference}` : ""}
            </td>
            <td className="py-3 text-right font-mono font-bold">{formatGNF(r.montant)}</td>
          </tr>
        </tbody>
        <tfoot>
          <tr className="text-sm">
            <td className="py-1.5 text-neutral-500" colSpan={2}>
              Montant dû pour ce poste
            </td>
            <td className="py-1.5 text-right font-mono">{formatGNF(r.montantDu)}</td>
          </tr>
          <tr className="text-sm">
            <td className="py-1.5 text-neutral-500" colSpan={2}>
              Total réglé à ce jour
            </td>
            <td className="py-1.5 text-right font-mono">{formatGNF(r.totalPaye)}</td>
          </tr>
          <tr className="border-t border-neutral-300 text-sm font-bold">
            <td className="py-2" colSpan={2}>
              Solde restant
            </td>
            <td
              className={`py-2 text-right font-mono ${r.soldeRestant > 0 ? "text-orange-600" : "text-green-600"}`}
            >
              {formatGNF(r.soldeRestant)}
            </td>
          </tr>
        </tfoot>
      </table>

      <div className="mt-10 grid grid-cols-2 gap-8 text-xs text-neutral-500">
        <div className="border-t border-neutral-300 pt-2">
          Encaissé par{r.encaissePar ? ` — ${r.encaissePar}` : ""}
        </div>
        <div className="border-t border-neutral-300 pt-2 text-right">Cachet & signature</div>
      </div>

      <p className="mt-4 text-[11px] text-neutral-400">
        Conservez ce reçu comme justificatif de paiement.
      </p>
    </article>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <p>
      <span className="text-xs uppercase text-neutral-400">{label} : </span>
      <span className="font-medium text-neutral-800">{value}</span>
    </p>
  );
}
