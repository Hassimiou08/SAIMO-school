import type { Metadata } from "next";
import { getSiteEcole } from "@/server/dal/site-ecole";
import { EnTetePage, Paragraphes } from "@/components/ecole/EcoleUi";

type Props = { params: Promise<{ slug: string }> };

export const metadata: Metadata = { title: "Services" };

export default async function ServicesPage({ params }: Props) {
  const { slug } = await params;
  const ecole = await getSiteEcole(slug);
  if (!ecole) return null;
  const { site } = ecole;

  return (
    <>
      <EnTetePage
        surtitre="Nos services"
        titre="Au service des élèves et des familles"
        intro={`Les services proposés par le ${site.nomComplet}.`}
      />

      <div className="mx-auto max-w-5xl space-y-6 px-6 py-16">
        {site.services.length === 0 && <p className="text-center text-ink-500">La liste des services sera bientôt disponible.</p>}
        {site.services.map((s, i) => (
          <article key={s.titre} className="rounded-[2rem] border border-neutral-200 bg-white p-8 md:p-10">
            <p className="font-display text-sm font-bold text-[var(--ec-primary)]">{String(i + 1).padStart(2, "0")}</p>
            <h2 className="mt-1 font-display text-2xl font-bold tracking-tight text-navy-900">{s.titre}</h2>
            {s.texte && <Paragraphes texte={s.texte} className="mt-3" />}
            {s.points.length > 0 && (
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {s.points.map((p) => (
                  <div key={p.titre} className="rounded-2xl border border-neutral-200 bg-paper-50 p-6">
                    <p className="font-display text-lg font-bold text-navy-900">{p.titre}</p>
                    <p className="mt-2 leading-relaxed text-ink-700">{p.texte}</p>
                  </div>
                ))}
              </div>
            )}
          </article>
        ))}
      </div>
    </>
  );
}
