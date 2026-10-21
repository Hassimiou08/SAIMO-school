import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Book, BookOpen, CheckCircle2, GraduationCap, Heart } from "lucide-react";
import { getSiteEcole } from "@/server/dal/site-ecole";
import { ancreCycle } from "@/lib/site-ecole";
import { EnTetePage } from "@/components/ecole/EcoleUi";

type Props = { params: Promise<{ slug: string }> };

export const metadata: Metadata = { title: "Nos cycles" };

const ICONES = [Heart, BookOpen, Book, GraduationCap];

export default async function CyclesPage({ params }: Props) {
  const { slug } = await params;
  const ecole = await getSiteEcole(slug);
  if (!ecole) return null;
  const { site } = ecole;
  const base = `/ecoles/${site.slug}`;

  return (
    <>
      <EnTetePage
        surtitre="Nos cycles d'enseignement"
        titre={site.cycles.length === 4 ? "Quatre cycles d'enseignement" : "Nos cycles d'enseignement"}
        intro={
          site.cycles.length > 0
            ? site.cycles.map((c) => c.nom).join(", ").replace(/, ([^,]*)$/, " et $1") + "."
            : undefined
        }
      />

      <div className="mx-auto max-w-6xl space-y-8 px-6 py-16">
        {site.cycles.length === 0 && <p className="text-center text-ink-500">La présentation des cycles sera bientôt disponible.</p>}
        {site.cycles.map((c, i) => {
          const Icone = ICONES[i % ICONES.length];
          return (
            <article
              key={c.nom}
              id={ancreCycle(c.nom)}
              data-anim="reveal"
              className="scroll-mt-28 grid gap-8 rounded-[2rem] border border-neutral-200 bg-white p-8 md:grid-cols-[16rem_1fr] md:p-10"
            >
              <div>
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--ec-primary)] text-white">
                  <Icone className="h-7 w-7" />
                </span>
                <p className="mt-5 font-display text-sm font-bold text-[var(--ec-primary)]">{String(i + 1).padStart(2, "0")}</p>
                <h2 className="font-display text-3xl font-bold tracking-tight text-navy-900">{c.nom}</h2>
                {c.description && <p className="mt-3 leading-relaxed text-ink-500">{c.description}</p>}
              </div>
              <div className="grid gap-8 sm:grid-cols-2">
                {c.objectifs.length > 0 && (
                  <div>
                    <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-ink-500">Objectifs</h3>
                    <ul className="space-y-3">
                      {c.objectifs.map((o) => (
                        <li key={o} className="flex gap-3 text-ink-700">
                          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[var(--ec-primary)]" /> {o}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {c.matieres.length > 0 && (
                  <div>
                    <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-ink-500">Matières</h3>
                    <ul className="flex flex-wrap gap-2">
                      {c.matieres.map((m) => (
                        <li key={m} className="rounded-full border border-neutral-200 bg-paper-50 px-3 py-1.5 text-sm font-medium text-navy-900">{m}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </article>
          );
        })}

        <div className="flex flex-wrap justify-center gap-4 pt-6">
          <Link href={`${base}/tarifs`} className="inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-7 py-3.5 font-bold text-navy-900 hover:bg-paper-100">
            Voir les tarifs
          </Link>
          <Link href={`${base}/preinscription`} className="inline-flex items-center gap-2 rounded-full bg-[var(--ec-primary)] px-7 py-3.5 font-bold text-white hover:opacity-90">
            Démarrer la préinscription <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </>
  );
}
