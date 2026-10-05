import type { Metadata } from "next";
import { Table2 } from "lucide-react";
import { EnseignantShell } from "@/components/enseignant/Shell";
import { TableauGeneralNotes } from "@/components/notes/TableauGeneralNotes";
import { mesClassesProfPrincipal, getMonTableauGeneral } from "@/server/dal/enseignant";
import { listerPeriodes } from "@/server/dal/evaluations";

export const metadata: Metadata = { title: "Tableau général des notes — Enseignant SAIMO" };

export default async function TableauGeneralEnseignantPage({
  searchParams,
}: {
  searchParams: Promise<{ classe?: string; periode?: string }>;
}) {
  const sp = await searchParams;
  const [classesPP, periodes] = await Promise.all([mesClassesProfPrincipal(), listerPeriodes()]);

  if (classesPP.length === 0) {
    return (
      <EnseignantShell titre="Tableau général des notes">
        <div className="rounded-2xl border border-dashed border-neutral-300 bg-white p-12 text-center">
          <Table2 className="mx-auto mb-3 h-7 w-7 text-neutral-300" />
          <p className="text-sm text-neutral-600">
            Ce tableau est réservé au <strong>professeur principal</strong>. Vous n&rsquo;êtes
            professeur principal d&rsquo;aucune classe cette année.
          </p>
        </div>
      </EnseignantShell>
    );
  }

  const classeId = sp.classe && classesPP.some((c) => c.id === sp.classe) ? sp.classe : classesPP[0].id;
  const periodeId = sp.periode ?? periodes.find((p) => p.active)?.id;

  let data = null;
  let erreur: string | null = null;
  if (periodeId) {
    try {
      data = await getMonTableauGeneral(classeId, periodeId);
    } catch (e) {
      erreur = e instanceof Error ? e.message : "Erreur inconnue";
    }
  }

  return (
    <EnseignantShell
      large
      titre="Tableau général des notes"
      sous="Toutes les matières, tous les élèves de votre classe — moyenne pondérée devoirs × 2 + composition, sur 3."
    >
      {erreur ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-6 text-sm text-red-700">{erreur}</div>
      ) : (
        <TableauGeneralNotes
          data={data}
          classes={classesPP}
          periodes={periodes}
          filtreClasse={classeId}
          filtrePeriode={periodeId}
          basePath="/enseignant/notes/tableau"
          libelleClasseVide="Choisir une classe (P.P.)"
        />
      )}
    </EnseignantShell>
  );
}
