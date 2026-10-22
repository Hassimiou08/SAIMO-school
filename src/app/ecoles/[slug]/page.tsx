import Link from "next/link";
import { ArrowRight, Book, BookOpen, CheckCircle2, GraduationCap, Heart, MapPin, Phone, Sparkles } from "lucide-react";
import { getSiteEcole } from "@/server/dal/site-ecole";
import { ancreCycle, IMAGE_ACCUEIL_DEFAUT, insecable, lienTel, paragraphes } from "@/lib/site-ecole";
import { BoutonFacebook, Lueurs, Titre } from "@/components/ecole/EcoleUi";

const ICONES_CYCLES = [Heart, BookOpen, Book, GraduationCap];

export default async function AccueilEcole({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const ecole = await getSiteEcole(slug);
  if (!ecole) return null; // le layout a déjà renvoyé 404
  const { site } = ecole;
  const base = `/ecoles/${site.slug}`;
  const intro = paragraphes(site.presentation.quiSommesNous)[0];

  return (
    <>
      {/* Présentation : photo en fond, voile bleu nuit pour la lisibilité */}
      <section className="relative overflow-hidden px-6 pb-32 pt-20 text-white md:pb-40 md:pt-28">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={site.imageAccueil || IMAGE_ACCUEIL_DEFAUT}
          alt=""
          fetchPriority="high"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(100deg, rgba(10,25,48,0.9) 0%, rgba(10,25,48,0.72) 45%, color-mix(in srgb, var(--ec-primary) 40%, transparent) 100%)",
          }}
        />
        <div className="relative mx-auto max-w-6xl">
          {site.anneeFondation && (
            <p data-anim="intro" className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] backdrop-blur-sm">
              <Sparkles className="h-4 w-4 text-[var(--ec-to)]" /> Depuis {site.anneeFondation}
            </p>
          )}
          <h1 data-anim="intro" className="max-w-4xl font-display text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
            {site.nomComplet}
          </h1>
          {site.slogan && <p data-anim="intro" className="mt-6 max-w-2xl text-xl leading-relaxed text-white/90">{site.slogan}</p>}
          {site.deviseEcole && (
            <p data-anim="intro" className="mt-6 inline-block rounded-2xl border border-white/20 bg-white/10 px-5 py-3 text-base text-white/90 backdrop-blur-sm">
              Notre devise : <strong className="font-display tracking-wide text-white">{site.deviseEcole}</strong>
            </p>
          )}
          {site.localisation && (
            <p data-anim="intro" className="mt-6 flex max-w-2xl items-start gap-2 text-white/85">
              <MapPin className="mt-1 h-4 w-4 shrink-0 text-[var(--ec-to)]" /> {site.localisation}
            </p>
          )}
          <div data-anim="intro" className="mt-10 flex flex-wrap gap-4">
            <Link
              href={`${base}/preinscription`}
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[var(--ec-from)] to-[var(--ec-to)] px-7 py-3.5 text-sm font-bold text-white shadow-[0_10px_25px_-5px_rgba(27,111,209,0.5)] transition-transform hover:scale-[1.03]"
            >
              Préinscrire mon enfant <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href={`${base}/decouvrir`}
              className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-7 py-3.5 text-sm font-bold text-white backdrop-blur-sm transition-colors hover:bg-white/20"
            >
              Découvrir notre école
            </Link>
            <BoutonFacebook lien={site.facebook} />
          </div>
        </div>
      </section>

      {/* Chiffres clés */}
      {site.chiffres.length > 0 && (
        <section className="relative z-10 -mt-16 px-6">
          <div data-anim="cartes" className="mx-auto grid max-w-6xl grid-cols-2 gap-4 md:grid-cols-4">
            {site.chiffres.map((c) => (
              <div key={c.libelle} className="rounded-2xl border border-neutral-200 bg-white p-6 text-center shadow-[0_20px_40px_-20px_rgba(10,25,48,0.25)]">
                <p className="font-display text-3xl font-bold text-[var(--ec-primary)] md:text-4xl">{insecable(c.valeur)}</p>
                <p className="mt-1 text-sm font-medium text-ink-500">{c.libelle}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Qui sommes-nous */}
      {(intro || site.presentation.valeurs.length > 0) && (
        <section className="px-6 py-20">
          <div data-anim="cartes" className="mx-auto grid max-w-6xl items-start gap-12 md:grid-cols-2">
            <div>
              <Titre surtitre="Qui sommes-nous ?" titre={site.nomComplet} />
              {intro && <p className="text-lg leading-relaxed text-ink-700">{intro}</p>}
              <Link href={`${base}/decouvrir`} className="mt-6 inline-flex items-center gap-2 font-bold text-[var(--ec-primary)] hover:underline">
                Découvrir notre école <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            {site.presentation.valeurs.length > 0 && (
              <div className="relative overflow-hidden rounded-3xl bg-[var(--ec-primary)] p-8 text-white shadow-[0_20px_40px_-20px_rgba(27,111,209,0.45)]">
                <Lueurs />
                <p className="relative text-xs font-bold uppercase tracking-[0.2em] text-white/85">Nos valeurs</p>
                <ul className="relative mt-6 space-y-5">
                  {site.presentation.valeurs.map((v) => {
                    const [nom, accroche] = v.titre.split(/\s*:\s*/);
                    return (
                      <li key={v.titre} className="flex gap-4">
                        <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-white" />
                        <div>
                          <p className="font-display text-xl font-bold">{nom}</p>
                          {accroche && <p className="text-sm text-white/85">{accroche}</p>}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Cycles */}
      {site.cycles.length > 0 && (
        <section className="bg-white px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <Titre
              surtitre="Nos cycles d'enseignement"
              titre={`${site.cycles.length === 4 ? "Quatre cycles" : "Nos cycles"}, un même parcours`}
              intro={site.cycles.map((c) => c.nom.toLowerCase()).join(", ").replace(/, ([^,]*)$/, " et $1") + "."}
              centre
            />
            <div data-anim="cartes" className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {site.cycles.map((c, i) => {
                const Icone = ICONES_CYCLES[i % ICONES_CYCLES.length];
                return (
                  <article key={c.nom} className="flex flex-col rounded-3xl border border-neutral-200 bg-paper-50 p-6">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--ec-primary)] text-white">
                      <Icone className="h-6 w-6" />
                    </span>
                    <h3 className="mt-5 font-display text-xl font-bold text-navy-900">{c.nom}</h3>
                    {c.description && <p className="mt-2 text-sm leading-relaxed text-ink-500">{c.description}</p>}
                    <ul className="mt-4 flex-1 space-y-2 text-sm text-ink-700">
                      {c.objectifs.slice(0, 3).map((o) => (
                        <li key={o} className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--ec-primary)]" /> {o}</li>
                      ))}
                    </ul>
                    <Link href={`${base}/cycles#${ancreCycle(c.nom)}`} className="mt-6 inline-flex items-center gap-1.5 text-sm font-bold text-[var(--ec-primary)] hover:underline">
                      Consulter les détails <ArrowRight className="h-4 w-4" />
                    </Link>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Services */}
      {site.services.length > 0 && (
        <section className="px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <Titre surtitre="Nos services" titre="Au service des élèves et des familles" />
            <div data-anim="cartes" className="grid gap-6 md:grid-cols-3">
              {site.services.map((s) => (
                <Link key={s.titre} href={`${base}/services`} className="group rounded-3xl border border-neutral-200 bg-white p-7 transition-shadow hover:shadow-lg">
                  <h3 className="font-display text-lg font-bold text-navy-900">{s.titre}</h3>
                  {s.texte && <p className="mt-2 text-sm leading-relaxed text-ink-500">{s.texte}</p>}
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-[var(--ec-primary)]">
                    En savoir plus <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Préinscription */}
      <section className="px-6 pb-20">
        <div
          data-anim="reveal"
          className="relative mx-auto flex max-w-6xl flex-col items-start justify-between gap-8 overflow-hidden rounded-[2rem] bg-[var(--ec-primary)] p-10 text-white shadow-[0_20px_50px_-20px_rgba(27,111,209,0.5)] md:flex-row md:items-center md:p-14"
        >
          <Lueurs />
          <div className="relative max-w-2xl">
            <h2 className="font-display text-3xl font-bold md:text-4xl">Votre enfant rejoint {site.nomCourt} ?</h2>
            <p className="mt-3 text-lg text-white/85">
              Déposez votre demande de préinscription en ligne en quelques minutes. L&apos;école vous recontacte pour finaliser le dossier.
            </p>
            {site.telephones.length > 0 && (
              <p className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-white/85">
                <Phone className="h-4 w-4" />
                {site.telephones.map((t) => (
                  <a key={t} href={lienTel(t)} className="font-semibold hover:underline">{t}</a>
                ))}
              </p>
            )}
          </div>
          <Link
            href={`${base}/preinscription`}
            className="relative inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-8 py-4 font-bold text-[var(--ec-primary)] transition-transform hover:scale-[1.02]"
          >
            Démarrer la préinscription <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </>
  );
}
