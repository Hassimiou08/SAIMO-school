import type { Metadata } from "next";
import Link from "next/link";
import { getSiteEcole } from "@/server/dal/site-ecole";
import { EnTetePage } from "@/components/ecole/EcoleUi";
import { FormulairePreinscription } from "@/components/ecole/FormulairePreinscription";

type Props = { params: Promise<{ slug: string }> };

export const metadata: Metadata = { title: "Préinscription" };

export default async function PreinscriptionEcolePage({ params }: Props) {
  const { slug } = await params;
  const ecole = await getSiteEcole(slug);
  if (!ecole) return null;
  const { site } = ecole;

  return (
    <>
      <EnTetePage
        surtitre="Préinscription en ligne"
        titre="Préinscrire mon enfant"
        intro={`Une seule demande pour un ou plusieurs enfants. Le ${site.nomCourt} vous recontacte pour fixer un rendez-vous et finaliser le dossier.`}
      />
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16">
        {site.preinscriptionsOuvertes ? (
          <div data-anim="reveal" className="overflow-hidden rounded-[2rem] border border-neutral-200 bg-white shadow-[0_20px_50px_-20px_rgba(15,42,74,0.12)]">
            <FormulairePreinscription
              ecole={site.slug}
              accueilHref={`/ecoles/${site.slug}`}
              telephoneAide={site.telephones[0]}
            />
          </div>
        ) : (
          <div className="rounded-[2rem] border border-neutral-200 bg-white p-10 text-center">
            <p className="text-lg text-ink-700">Les préinscriptions en ligne sont fermées pour le moment.</p>
            <p className="mt-2 text-ink-500">Pour inscrire votre enfant, contactez directement l&apos;école.</p>
            <Link
              href={`/ecoles/${site.slug}/contact`}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--ec-primary)] px-7 py-3 font-bold text-white hover:opacity-90"
            >
              Nous contacter
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
