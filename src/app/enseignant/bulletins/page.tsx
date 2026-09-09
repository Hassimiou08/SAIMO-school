import type { Metadata } from "next";
import { Star } from "lucide-react";
import { EnseignantShell } from "@/components/enseignant/Shell";
import { MesBulletinsManager } from "@/components/enseignant/MesBulletinsManager";
import { mesBulletins, mesClassesProfPrincipal } from "@/server/dal/enseignant";
import { listerPeriodes } from "@/server/dal/evaluations";

export const metadata: Metadata = { title: "Bulletins — Enseignant SAIMO" };

export default async function BulletinsEnseignantPage({
  searchParams,
}: {
  searchParams: Promise<{ classe?: string; periode?: string }>;
}) {
  const sp = await searchParams;
  const [classesPP, periodes] = await Promise.all([
    mesClassesProfPrincipal(),
    listerPeriodes(),
  ]);

  if (classesPP.length === 0) {
    return (
      <EnseignantShell titre="Bulletins">
        <div className="rounded-2xl border border-dashed border-neutral-300 bg-white p-12 text-center">
          <Star className="mx-auto mb-3 h-7 w-7 text-neutral-300" />
          <p className="text-sm text-neutral-600">
            Cet espace est réservé au <strong>professeur principal</strong>. Vous n&rsquo;êtes
            professeur principal d&rsquo;aucune classe cette année.
          </p>
        </div>
      </EnseignantShell>
    );
  }

  const bulletins = await mesBulletins(sp.classe, sp.periode);

  return (
    <EnseignantShell
      large
      titre="Bulletins de mes classes"
      sous="Générez les bulletins de vos classes (professeur principal). Validation et publication : administration."
    >
      <MesBulletinsManager
        bulletins={bulletins}
        classes={classesPP}
        periodes={periodes}
        classeSel={sp.classe}
        periodeSel={sp.periode}
      />
    </EnseignantShell>
  );
}
