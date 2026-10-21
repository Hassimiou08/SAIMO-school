import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { getSiteEcole } from "@/server/dal/site-ecole";
import { lienTel } from "@/lib/site-ecole";
import { BoutonFacebook, EnTetePage } from "@/components/ecole/EcoleUi";
import { FormulaireContact } from "@/components/ecole/FormulaireContact";

type Props = { params: Promise<{ slug: string }> };

export const metadata: Metadata = { title: "Contact" };

function Coordonnee({ icone: Icone, libelle, children }: { icone: typeof Phone; libelle: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-4">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10">
        <Icone className="h-5 w-5" />
      </span>
      <div className="min-w-0">
        <p className="mb-1 text-xs font-bold uppercase tracking-wider text-white/60">{libelle}</p>
        {children}
      </div>
    </div>
  );
}

export default async function ContactPage({ params }: Props) {
  const { slug } = await params;
  const ecole = await getSiteEcole(slug);
  if (!ecole) return null;
  const { site } = ecole;

  return (
    <>
      <EnTetePage
        surtitre="Contact"
        titre="Nous contacter"
        intro="Parents, élèves et visiteurs : appelez-nous, écrivez-nous ou passez nous voir."
      />

      <div className="mx-auto max-w-6xl px-6 py-16">
        <div data-anim="reveal" className="flex flex-col overflow-hidden rounded-[2rem] border border-neutral-200 bg-white shadow-[0_20px_60px_-20px_rgba(15,42,74,0.12)] lg:flex-row">
          <div className="w-full bg-navy-950 p-8 text-white md:p-12 lg:w-[40%]">
            <h2 className="font-display text-2xl font-bold">{site.nomComplet}</h2>
            <div className="mt-8 space-y-7">
              {site.telephones.length > 0 && (
                <Coordonnee icone={Phone} libelle="Téléphones">
                  <ul className="space-y-1">
                    {site.telephones.map((t) => (
                      <li key={t}>
                        <a href={lienTel(t)} className="text-lg font-medium hover:underline">{t}</a>
                      </li>
                    ))}
                  </ul>
                </Coordonnee>
              )}
              {site.email && (
                <Coordonnee icone={Mail} libelle="E-mail">
                  <a href={`mailto:${site.email}`} className="break-all text-lg font-medium hover:underline">{site.email}</a>
                </Coordonnee>
              )}
              {site.adresse && (
                <Coordonnee icone={MapPin} libelle="Adresse">
                  <p className="text-lg font-medium leading-snug">{site.adresse}</p>
                </Coordonnee>
              )}
              {site.horaires && (
                <Coordonnee icone={Clock} libelle="Horaires d'ouverture">
                  <p className="text-lg font-medium">{site.horaires}</p>
                </Coordonnee>
              )}
            </div>
            {site.facebook && (
              <div className="mt-10 border-t border-white/10 pt-8">
                <BoutonFacebook lien={site.facebook} />
              </div>
            )}
          </div>

          <div className="relative w-full p-8 md:p-12 lg:w-[60%]">
            <FormulaireContact ecole={site.slug} />
          </div>
        </div>
      </div>
    </>
  );
}
