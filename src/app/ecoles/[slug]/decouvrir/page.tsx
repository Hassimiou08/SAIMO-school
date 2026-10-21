import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getSiteEcole } from "@/server/dal/site-ecole";
import { EnTetePage, Paragraphes } from "@/components/ecole/EcoleUi";
import { insecable } from "@/lib/site-ecole";

type Props = { params: Promise<{ slug: string }> };

export const metadata: Metadata = { title: "Découvrir l'école" };

function Bloc({ numero, titre, children }: { numero: number; titre: string; children: React.ReactNode }) {
  return (
    <section data-anim="reveal" className="border-t border-neutral-200 py-12 first:border-t-0 first:pt-0">
      <div className="grid gap-6 md:grid-cols-[12rem_1fr]">
        <div>
          <p className="font-display text-sm font-bold text-[var(--ec-primary)]">{String(numero).padStart(2, "0")}</p>
          <h2 className="mt-1 font-display text-2xl font-bold tracking-tight text-navy-900">{titre}</h2>
        </div>
        <div>{children}</div>
      </div>
    </section>
  );
}

export default async function DecouvrirPage({ params }: Props) {
  const { slug } = await params;
  const ecole = await getSiteEcole(slug);
  if (!ecole) return null;
  const { site } = ecole;
  const p = site.presentation;

  const blocs: { titre: string; contenu: React.ReactNode; present: boolean }[] = [
    { titre: "Qui sommes-nous ?", present: !!p.quiSommesNous, contenu: <Paragraphes texte={p.quiSommesNous} /> },
    { titre: "Notre vision", present: !!p.vision, contenu: <Paragraphes texte={p.vision} /> },
    {
      titre: "Notre mission",
      present: !!p.missionIntro || p.missionPoints.length > 0,
      contenu: (
        <>
          <Paragraphes texte={p.missionIntro} />
          {p.missionPoints.length > 0 && (
            <ul data-anim="cartes" className="mt-6 grid gap-4 sm:grid-cols-2">
              {p.missionPoints.map((m) => (
                <li key={m.titre} className="rounded-2xl border border-neutral-200 bg-white p-5">
                  <p className="font-bold text-navy-900">{m.titre}</p>
                  <p className="mt-1 text-sm leading-relaxed text-ink-500">{m.texte}</p>
                </li>
              ))}
            </ul>
          )}
        </>
      ),
    },
    {
      titre: "Nos valeurs fondamentales",
      present: !!p.valeursIntro || p.valeurs.length > 0,
      contenu: (
        <>
          <Paragraphes texte={p.valeursIntro} />
          <div data-anim="cartes" className="mt-6 space-y-4">
            {p.valeurs.map((v) => (
              <div key={v.titre} className="rounded-2xl border-l-4 border-[var(--ec-primary)] bg-white p-6 shadow-sm">
                <h3 className="font-display text-lg font-bold text-navy-900">{v.titre}</h3>
                <p className="mt-2 leading-relaxed text-ink-700">{v.texte}</p>
              </div>
            ))}
          </div>
        </>
      ),
    },
    { titre: "Notre engagement envers les familles", present: !!p.engagement, contenu: <Paragraphes texte={p.engagement} /> },
    { titre: "Une histoire tournée vers l'avenir", present: !!p.histoire, contenu: <Paragraphes texte={p.histoire} /> },
  ];
  const visibles = blocs.filter((b) => b.present);

  return (
    <>
      <EnTetePage
        surtitre={site.anneeFondation ? `Depuis ${site.anneeFondation}` : "Découvrir l'école"}
        titre={site.nomComplet}
        intro={site.slogan}
      />

      {site.deviseEcole && (
        <div className="border-b border-neutral-200 bg-white px-6 py-5">
          <p className="mx-auto max-w-6xl text-center text-lg text-ink-700">
            Notre devise : <strong className="font-display text-navy-900">{site.deviseEcole}</strong>
          </p>
        </div>
      )}

      <div className="mx-auto max-w-6xl px-6 py-16">
        {visibles.length === 0 && (
          <p className="text-center text-ink-500">La présentation de l&apos;école sera bientôt disponible.</p>
        )}
        {visibles.map((b, i) => (
          <Bloc key={b.titre} numero={i + 1} titre={b.titre}>{b.contenu}</Bloc>
        ))}
      </div>

      {site.chiffres.length > 0 && (
        <section className="px-6 pb-20">
          <div data-anim="reveal" className="mx-auto max-w-6xl rounded-[2rem] bg-navy-950 p-10 text-white md:p-14">
            <p className="text-center text-xs font-bold uppercase tracking-[0.2em] text-white/60">Chiffres clés de l&apos;établissement</p>
            <div className="mt-8 grid grid-cols-2 gap-8 md:grid-cols-4">
              {site.chiffres.map((c) => (
                <div key={c.libelle} className="text-center">
                  <p className="font-display text-4xl font-bold md:text-5xl">{insecable(c.valeur)}</p>
                  <p className="mt-2 text-sm text-white/70">{c.libelle}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-10 text-center">
            <Link
              href={`/ecoles/${site.slug}/preinscription`}
              className="inline-flex items-center gap-2 rounded-full bg-[var(--ec-primary)] px-8 py-4 font-bold text-white hover:opacity-90"
            >
              Démarrer la préinscription <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </section>
      )}
    </>
  );
}
