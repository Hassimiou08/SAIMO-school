import { ParentShell, AucunEnfant } from "@/components/parent/ParentShell";
import { PaiementsParentView } from "@/components/parent/PaiementsParentView";
import { resoudreEnfant, getPaiementsEnfant, getContexteParent } from "@/server/dal/parent";

export const metadata = { title: "Paiements — Espace Parent SAIMO" };

export default async function PaiementsParentPage({
  searchParams,
}: {
  searchParams: Promise<{ enfant?: string }>;
}) {
  const sp = await searchParams;
  const enfant = await resoudreEnfant(sp.enfant);
  if (!enfant) return <AucunEnfant />;

  const [paiements, ctx] = await Promise.all([
    getPaiementsEnfant(enfant.id),
    getContexteParent(),
  ]);

  return (
    <ParentShell>
      <PaiementsParentView
        paiements={paiements}
        enfantNom={`${enfant.nomComplet} · ${enfant.classe}`}
        peutPayer={!ctx.estEleve}
      />
    </ParentShell>
  );
}
