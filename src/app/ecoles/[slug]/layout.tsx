import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSiteEcole } from "@/server/dal/site-ecole";
import { variablesCouleurs } from "@/lib/site-ecole";
import { EcoleNavbar } from "@/components/ecole/EcoleNavbar";
import { EcoleFooter } from "@/components/ecole/EcoleFooter";
import { EcoleAnimations } from "@/components/ecole/EcoleAnimations";

type Props = { children: React.ReactNode; params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Omit<Props, "children">): Promise<Metadata> {
  const { slug } = await params;
  const ecole = await getSiteEcole(slug);
  if (!ecole) return { title: "École introuvable" };
  const { site } = ecole;
  return {
    title: { default: site.nomComplet, template: `%s — ${site.nomCourt}` },
    description: site.slogan || `Site officiel du ${site.nomComplet}.`,
  };
}

/** Site public d'une école : habillage aux couleurs de l'établissement. */
export default async function EcoleLayout({ children, params }: Props) {
  const { slug } = await params;
  const ecole = await getSiteEcole(slug);
  if (!ecole) notFound();
  const { site, couleurs } = ecole;
  const base = `/ecoles/${site.slug}`;


  return (
    <div style={variablesCouleurs(couleurs) as CSSProperties} className="flex min-h-screen flex-col bg-paper-50">
      <EcoleNavbar base={base} nomCourt={site.nomCourt} logo={site.logo} deviseEcole={site.deviseEcole} />
      <main className="flex-1">{children}</main>
      <EcoleFooter site={site} base={base} />
      <EcoleAnimations />
    </div>
  );
}
