import type { BulletinDetail } from "@/server/dal/bulletins";

/**
 * Rendu d'un bulletin, optimisé pour l'écran et l'impression (A4).
 * Aucune interactivité : utilisable en Server Component.
 */
export function BulletinImprimable({ b }: { b: BulletinDetail }) {
  const totalCoef = b.matieres.reduce((t, m) => t + (m.coefficient || 0), 0);

  return (
    <article
      data-bulletin
      className="rounded-2xl border border-neutral-200 bg-white p-8 text-neutral-900 print:rounded-none print:border-0 print:p-0 print:break-after-page"
    >
      {/* En-tête établissement */}
      <header className="flex items-center justify-between border-b-2 border-navy-900 pb-4">
        <div>
          <p className="font-display text-lg font-bold text-navy-900">{b.etablissement}</p>
          <p className="text-xs uppercase tracking-widest text-neutral-500">
            Bulletin scolaire — {b.periode}
          </p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold print:hidden ${
            b.statut === "publie"
              ? "bg-green-100 text-green-600"
              : b.statut === "valide"
                ? "bg-blue-100 text-blue-600"
                : "bg-neutral-100 text-neutral-500"
          }`}
        >
          {b.statut === "publie" ? "Publié" : b.statut === "valide" ? "Validé" : "Brouillon"}
        </span>
      </header>

      {/* Identité élève + moyenne */}
      <div className="mt-4 flex items-start justify-between">
        <div className="text-sm">
          <p className="text-base font-bold text-navy-900">{b.eleve}</p>
          <p className="text-neutral-500">
            {b.matricule ? `Matricule ${b.matricule} · ` : ""}
            {b.classe} ({b.cycle})
          </p>
        </div>
        <div className="text-right">
          <p className="font-mono text-3xl font-black text-blue-600">
            {b.moyenneGenerale != null ? b.moyenneGenerale.toFixed(2) : "—"}
            <span className="text-base text-neutral-400">/20</span>
          </p>
          {b.rang != null && (
            <p className="text-xs text-neutral-500">
              Rang {b.rang} / {b.effectifClasse ?? "?"}
            </p>
          )}
          {b.mention !== "—" && (
            <p className="mt-1 inline-block rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 print:bg-transparent print:px-0">
              Mention : {b.mention}
            </p>
          )}
        </div>
      </div>

      {/* Tableau des matières */}
      <table className="mt-5 w-full text-left text-sm">
        <thead>
          <tr className="border-y border-neutral-300 text-xs uppercase text-neutral-500">
            <th className="py-2">Matière</th>
            <th className="py-2 text-center">Coef.</th>
            <th className="py-2 text-center">Moyenne / 20</th>
            <th className="py-2">Appréciation</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-100">
          {b.matieres.map((m) => (
            <tr key={m.matiere}>
              <td className="py-2.5 font-medium text-neutral-800">{m.matiere}</td>
              <td className="py-2.5 text-center">{m.coefficient}</td>
              <td className="py-2.5 text-center font-mono">
                {m.moyenne != null ? m.moyenne.toFixed(2) : "—"}
              </td>
              <td className="py-2.5 text-neutral-500">{m.appreciation ?? "—"}</td>
            </tr>
          ))}
          {b.matieres.length === 0 && (
            <tr>
              <td colSpan={4} className="py-6 text-center text-neutral-500">
                Aucune note verrouillée pour cette période.
              </td>
            </tr>
          )}
        </tbody>
        {b.matieres.length > 0 && (
          <tfoot>
            <tr className="border-t border-neutral-300 text-sm font-semibold">
              <td className="py-2">Total coefficients</td>
              <td className="py-2 text-center">{totalCoef}</td>
              <td className="py-2 text-center font-mono">
                {b.moyenneGenerale != null ? b.moyenneGenerale.toFixed(2) : "—"}
              </td>
              <td className="py-2" />
            </tr>
          </tfoot>
        )}
      </table>

      {b.appreciation && (
        <p className="mt-4 rounded-xl bg-neutral-50 p-4 text-sm text-neutral-700 print:bg-transparent print:p-0">
          <span className="font-semibold">Appréciation générale : </span>
          {b.appreciation}
        </p>
      )}

      {/* Pied : signatures */}
      <div className="mt-10 grid grid-cols-2 gap-8 text-xs text-neutral-500">
        <div>
          <div className="flex h-16 items-end">
            {b.signatureProfPrincipal && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={b.signatureProfPrincipal}
                alt="Signature du professeur principal"
                className="max-h-16 object-contain"
              />
            )}
          </div>
          <p className="border-t border-neutral-300 pt-2">
            Le professeur principal
            {b.profPrincipalNom ? ` — ${b.profPrincipalNom}` : ""}
          </p>
        </div>
        <div className="text-right">
          <div className="flex h-16 items-end justify-end">
            {b.signatureDirection && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={b.signatureDirection}
                alt="Signature de la direction"
                className="max-h-16 object-contain"
              />
            )}
          </div>
          <p className="border-t border-neutral-300 pt-2">
            La direction
            {b.directionNom ? ` — ${b.directionNom}` : ""}
          </p>
        </div>
      </div>
      {b.dateValidation && (
        <p className="mt-4 text-[11px] text-neutral-400">Validé le {b.dateValidation}</p>
      )}
    </article>
  );
}
