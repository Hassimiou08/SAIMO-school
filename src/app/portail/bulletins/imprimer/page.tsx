import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { BulletinImprimable } from "@/components/portal/BulletinImprimable";
import { BoutonImprimer } from "@/components/portal/BoutonImprimer";
import { BoutonPdf } from "@/components/portal/BoutonPdf";
import { listerBulletinsClasseImpression } from "@/server/dal/bulletins";

export const metadata = { title: "Impression des bulletins — Portail SAIMO" };

export default async function ImpressionBulletinsPage({
  searchParams,
}: {
  searchParams: Promise<{ classe?: string; periode?: string }>;
}) {
  const sp = await searchParams;

  if (!sp.classe || !sp.periode) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-16 text-center">
        <p className="text-sm text-neutral-600">
          Choisissez une classe et une période depuis la page Bulletins.
        </p>
        <Link href="/portail/bulletins" className="mt-4 inline-block text-sm font-semibold text-blue-600">
          ← Retour aux bulletins
        </Link>
      </div>
    );
  }

  const bulletins = await listerBulletinsClasseImpression(sp.classe, sp.periode);
  const imprimables = bulletins.filter((b) => b.statut !== "brouillon");
  const nomFichier = (
    imprimables[0]
      ? `Bulletins-${imprimables[0].classe}-${imprimables[0].periode}`
      : "Bulletins"
  ).replace(/[^a-zA-Z0-9]+/g, "-");

  return (
    <div className="min-h-screen bg-paper-100 print:bg-white">
      {/* Barre d'action — masquée à l'impression */}
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-neutral-200 bg-white/95 px-6 py-3 backdrop-blur print:hidden">
        <Link
          href={`/portail/bulletins?classe=${sp.classe}&periode=${sp.periode}`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 hover:text-navy-900"
        >
          <ArrowLeft className="h-4 w-4" /> Retour
        </Link>
        <p className="text-sm text-neutral-600">
          {imprimables.length} bulletin{imprimables.length > 1 ? "s" : ""} prêt
          {imprimables.length > 1 ? "s" : ""}
          {bulletins.length > imprimables.length &&
            ` · ${bulletins.length - imprimables.length} en brouillon (ignoré${
              bulletins.length - imprimables.length > 1 ? "s" : ""
            })`}
        </p>
        <div className="flex items-center gap-2">
          <BoutonPdf fichier={nomFichier} label="Télécharger le PDF" />
          <BoutonImprimer label="Imprimer" />
        </div>
      </div>

      <main className="mx-auto max-w-3xl space-y-8 px-6 py-8 print:max-w-none print:space-y-0 print:p-0">
        {imprimables.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-neutral-300 bg-white p-12 text-center text-sm text-neutral-500">
            Aucun bulletin validé ou publié pour cette classe et cette période.
            Générez puis validez les bulletins d&rsquo;abord.
          </p>
        ) : (
          imprimables.map((b) => <BulletinImprimable key={b.id} b={b} />)
        )}
      </main>
    </div>
  );
}
