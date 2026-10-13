import { ParentShell, AucunEnfant } from "@/components/parent/ParentShell";
import { PaiementsParentView } from "@/components/parent/PaiementsParentView";
import { resoudreEnfant, getPaiementsEnfant, getContexteParent } from "@/server/dal/parent";
import { estSimulation } from "@/server/external/paiement-en-ligne";
import { resoudreTransactionsEnAttente } from "@/server/services/paiement-en-ligne.service";

export const metadata = { title: "Paiements — Espace Parent SAIMO" };

export default async function PaiementsParentPage({
  searchParams,
}: {
  searchParams: Promise<{ enfant?: string }>;
}) {
  const sp = await searchParams;
  const enfant = await resoudreEnfant(sp.enfant);
  if (!enfant) return <AucunEnfant />;

  // Un paiement validé après fermeture de la page est encaissé avant lecture.
  const ctx = await getContexteParent();
  await resoudreTransactionsEnAttente({ etablissementId: ctx.etablissementId, eleveId: enfant.id });
  const paiements = await getPaiementsEnfant(enfant.id);

  return (
    <ParentShell>
      <PaiementsParentView
        paiements={paiements}
        enfantNom={`${enfant.nomComplet} · ${enfant.classe}`}
        peutPayer={!ctx.estEleve}
        simulation={estSimulation()}
      />
    </ParentShell>
  );
}
