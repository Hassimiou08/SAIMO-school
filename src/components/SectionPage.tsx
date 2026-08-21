import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

type SectionPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  bullets?: string[];
  ctaLabel?: string;
  ctaHref?: string;
  media?: ReactNode;
  children?: ReactNode;
};

export function SectionPage({
  eyebrow,
  title,
  description,
  bullets = [],
  ctaLabel,
  ctaHref = "/",
  media,
  children,
}: SectionPageProps) {
  return (
    <main>
      <Navbar />
      <section className="bg-paper-100 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="rounded-[2rem] border border-primary-200/70 bg-gradient-to-br from-white via-primary-50/70 to-secondary-50 p-8 shadow-[0_25px_60px_-25px_rgba(15,42,74,0.2)] lg:p-12">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary-600">
              {eyebrow}
            </p>
            <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-navy-900 sm:text-4xl">
              {title}
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-ink-500">
              {description}
            </p>

            {media ? <div className="mt-8">{media}</div> : null}

            {bullets.length > 0 ? (
              <ul className="mt-8 grid gap-3 md:grid-cols-2">
                {bullets.map((bullet) => (
                  <li
                    key={bullet}
                    className="rounded-2xl border border-primary-200 bg-white/80 p-4 text-sm text-ink-600 shadow-sm"
                  >
                    {bullet}
                  </li>
                ))}
              </ul>
            ) : null}

            {children}

            {ctaLabel ? (
              <a
                href={ctaHref}
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-navy-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-600"
              >
                {ctaLabel}
                <ArrowRight className="h-4 w-4" />
              </a>
            ) : null}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
