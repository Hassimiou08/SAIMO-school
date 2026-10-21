import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, FileCheck2, Info } from "lucide-react";
import { getSiteEcole } from "@/server/dal/site-ecole";
import { insecable, type SiteEcole } from "@/lib/site-ecole";
import { EnTetePage, Paragraphes } from "@/components/ecole/EcoleUi";

type Props = { params: Promise<{ slug: string }> };
type Ligne = SiteEcole["tarifs"]["lignes"][number];

export const metadata: Metadata = { title: "Tarifs et renseignements" };

type Colonne = { cle: string; libelle: string; detail?: string; valeur: (l: Ligne) => string; fort?: boolean };

/** Colonnes du tableau : seules celles renseignées pour au moins une classe sont affichées. */
function colonnes(t: SiteEcole["tarifs"]): Colonne[] {
  const toutes: Colonne[] = [
    { cle: "inscription", libelle: "Inscription", valeur: (l) => l.inscription },
    { cle: "reinscription", libelle: "Réinscription", valeur: (l) => l.reinscription },
    { cle: "mensualite", libelle: "Mensualité", valeur: (l) => l.mensualite },
    ...t.tranches.map((tr, i) => ({
      cle: `tranche-${i}`,
      libelle: tr.libelle || `Tranche ${i + 1}`,
      detail: tr.echeance,
      valeur: (l: Ligne) => l.montantsTranches[i] ?? "",
    })),
    { cle: "annuel", libelle: "Montant annuel", valeur: (l) => l.annuel, fort: true },
  ];
  return toutes.filter((c) => t.lignes.some((l) => c.valeur(l)));
}

/** Découpe les lignes en groupes consécutifs (intertitres « Collège », « Lycée »…). */
function groupes(lignes: Ligne[]) {
  const res: { titre: string; lignes: Ligne[] }[] = [];
  for (const l of lignes) {
    const dernier = res[res.length - 1];
    if (dernier && (l.groupe === "" || l.groupe === dernier.titre)) dernier.lignes.push(l);
    else res.push({ titre: l.groupe, lignes: [l] });
  }
  return res;
}

export default async function TarifsPage({ params }: Props) {
  const { slug } = await params;
  const ecole = await getSiteEcole(slug);
  if (!ecole) return null;
  const { site } = ecole;
  const t = site.tarifs;
  const base = `/ecoles/${site.slug}`;
  const cols = colonnes(t);
  const blocs = groupes(t.lignes);

  return (
    <>
      <EnTetePage
        surtitre="Tarifs et renseignements scolaires"
        titre="Frais de scolarité"
        intro={t.annee ? `Année scolaire ${t.annee}.` : "Frais d'inscription, de réinscription et de scolarité par classe."}
      />

      <div className="mx-auto max-w-6xl px-6 py-16">
        {t.lignes.length === 0 ? (
          <div className="rounded-3xl border border-neutral-200 bg-white p-10 text-center">
            <p className="text-lg text-ink-700">La grille des tarifs sera publiée prochainement.</p>
            <p className="mt-2 text-ink-500">Pour connaître les frais d&apos;une classe, contactez l&apos;école.</p>
            <Link href={`${base}/contact`} className="mt-6 inline-flex items-center gap-2 font-bold text-[var(--ec-primary)] hover:underline">
              Nous contacter <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <>
            {/* Ordinateur et tablette : tableau */}
            <div data-anim="reveal" className="hidden overflow-x-auto rounded-3xl border border-neutral-200 bg-white md:block">
              <table className="w-full text-left text-sm">
                <thead className="bg-navy-950 text-white">
                  <tr>
                    <th className="px-5 py-4 align-bottom font-semibold">Classe</th>
                    {cols.map((c) => (
                      <th key={c.cle} className="px-5 py-4 text-right align-bottom font-semibold">
                        {c.libelle}
                        {c.detail && <span className="mt-0.5 block text-[11px] font-normal text-white/65">{c.detail}</span>}
                      </th>
                    ))}
                  </tr>
                </thead>
                {blocs.map((g, gi) => (
                  <tbody key={gi}>
                    {g.titre && (
                      <tr className="bg-[var(--ec-light)]">
                        <th colSpan={cols.length + 1} className="px-5 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[var(--ec-primary)]">
                          {g.titre}
                        </th>
                      </tr>
                    )}
                    {g.lignes.map((l, i) => (
                      <tr key={i} className="border-t border-neutral-100">
                        <td className="px-5 py-4 font-semibold text-navy-900">{l.classe}</td>
                        {cols.map((c) => (
                          <td key={c.cle} className={`whitespace-nowrap px-5 py-4 text-right tabular-nums ${c.fort ? "font-bold text-navy-900" : "text-ink-700"}`}>
                            {insecable(c.valeur(l)) || "—"}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                ))}
              </table>
            </div>

            {/* Téléphone : une carte par classe */}
            <div data-anim="cartes" className="space-y-6 md:hidden">
              {blocs.map((g, gi) => (
                <div key={gi} className="space-y-3">
                  {g.titre && <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--ec-primary)]">{g.titre}</p>}
                  {g.lignes.map((l, i) => (
                    <div key={i} className="rounded-2xl border border-neutral-200 bg-white p-5">
                      <p className="font-display text-lg font-bold text-navy-900">{l.classe}</p>
                      <dl className="mt-3 space-y-2 text-sm">
                        {cols.map((c) => (
                          <div key={c.cle} className="flex justify-between gap-4">
                            <dt className="text-ink-500">
                              {c.libelle}
                              {c.detail && <span className="block text-[11px]">{c.detail}</span>}
                            </dt>
                            <dd className={`whitespace-nowrap tabular-nums ${c.fort ? "font-bold text-navy-900" : "font-semibold text-ink-700"}`}>
                              {insecable(c.valeur(l)) || "—"}
                            </dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </>
        )}

        <div data-anim="cartes" className="mt-12 grid gap-8 md:grid-cols-2">
          {t.annexes.length > 0 && (
            <section>
              <h2 className="mb-4 font-display text-2xl font-bold text-navy-900">{t.annexesTitre || "Frais annexes"}</h2>
              <ul className="divide-y divide-neutral-100 rounded-3xl border border-neutral-200 bg-white">
                {t.annexes.map((a, i) => (
                  <li key={i} className="flex justify-between gap-4 px-6 py-4">
                    <span className="text-ink-700">{a.libelle}</span>
                    <span className="whitespace-nowrap font-semibold tabular-nums text-navy-900">{insecable(a.montant)}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {t.dossiers.length > 0 && (
            <section>
              <h2 className="mb-4 font-display text-2xl font-bold text-navy-900">Dossiers à fournir</h2>
              <ul className="space-y-3 rounded-3xl border border-neutral-200 bg-white p-6">
                {t.dossiers.map((d, i) => (
                  <li key={i} className="flex gap-3 text-ink-700">
                    <FileCheck2 className="mt-0.5 h-5 w-5 shrink-0 text-[var(--ec-primary)]" /> {d}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {t.note && (
          <div data-anim="reveal" className="mt-10 flex gap-3 rounded-2xl border border-neutral-200 bg-white p-5">
            <Info className="mt-0.5 h-5 w-5 shrink-0 text-[var(--ec-primary)]" />
            <Paragraphes texte={t.note} className="text-sm" />
          </div>
        )}

        <div className="mt-12 text-center">
          <Link
            href={`${base}/preinscription`}
            className="inline-flex items-center gap-2 rounded-full bg-[var(--ec-primary)] px-8 py-4 font-bold text-white hover:opacity-90"
          >
            Démarrer la préinscription <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </>
  );
}
