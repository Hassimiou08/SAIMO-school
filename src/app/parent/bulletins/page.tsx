import Link from "next/link";
import { Award, Eye } from "lucide-react";
import { ParentShell, AucunEnfant } from "@/components/parent/ParentShell";
import { resoudreEnfant, getBulletinsEnfant } from "@/server/dal/parent";

export const metadata = { title: "Bulletins — Espace Parent SAIMO" };

export default async function BulletinsParentPage({
  searchParams,
}: {
  searchParams: Promise<{ enfant?: string }>;
}) {
  const sp = await searchParams;
  const enfant = await resoudreEnfant(sp.enfant);
  if (!enfant) return <AucunEnfant />;

  const bulletins = await getBulletinsEnfant(enfant.id);

  return (
    <ParentShell>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold tracking-tight text-neutral-900">
          Bulletins scolaires
        </h1>
        <p className="mt-1 text-sm text-neutral-500">
          {enfant.nomComplet} &bull; {enfant.classe}
        </p>
      </div>

      {bulletins.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-neutral-300 bg-white p-12 text-center text-sm text-neutral-500">
          Aucun bulletin publié pour le moment.
        </div>
      ) : (
        <div className="grid gap-6">
          {bulletins.map((b) => (
            <div key={b.id} className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-neutral-100 bg-gradient-to-r from-emerald-50 to-teal-50 px-6 py-5">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white">
                    <Award className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="font-bold text-neutral-900">
                      {b.periode} — {b.annee}
                    </h2>
                    <p className="text-sm text-neutral-500">{b.date ? `Publié le ${b.date}` : ""}</p>
                  </div>
                </div>
                <Link
                  href={`/parent/bulletins/${b.id}?enfant=${enfant.id}`}
                  className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-700 shadow-sm transition hover:bg-neutral-50"
                >
                  <Eye className="h-4 w-4" /> Consulter
                </Link>
              </div>
              <div className="grid grid-cols-3 divide-x divide-neutral-100 text-center">
                <div className="px-4 py-5">
                  <p className="text-xs font-medium text-neutral-500">Moyenne</p>
                  <p className="mt-1 text-xl font-bold text-emerald-600">
                    {b.moyenneGenerale != null ? b.moyenneGenerale.toFixed(2) : "—"}/20
                  </p>
                </div>
                <div className="px-4 py-5">
                  <p className="text-xs font-medium text-neutral-500">Rang</p>
                  <p className="mt-1 text-xl font-bold text-neutral-900">
                    {b.rang ?? "—"}
                    <span className="text-sm font-medium text-neutral-400">/{b.effectif ?? "—"}</span>
                  </p>
                </div>
                <div className="px-4 py-5">
                  <p className="text-xs font-medium text-neutral-500">Mention</p>
                  <p className="mt-1 text-sm font-bold text-neutral-900">{b.mention}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </ParentShell>
  );
}
