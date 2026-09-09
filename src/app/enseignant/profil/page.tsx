import type { Metadata } from "next";
import { EnseignantShell } from "@/components/enseignant/Shell";
import { ProfilForm } from "@/components/portal/ProfilForm";
import { prisma } from "@/lib/prisma";
import { requireContext } from "@/server/context";
import { libelleRole } from "@/lib/roles-labels";

export const metadata: Metadata = { title: "Mon profil — Enseignant SAIMO" };

export default async function ProfilEnseignantPage() {
  const ctx = await requireContext();
  const u = await prisma.utilisateur.findUniqueOrThrow({
    where: { id: ctx.utilisateurId },
    select: {
      prenom: true,
      nom: true,
      email: true,
      telephone: true,
      photo: true,
      signature: true,
    },
  });

  return (
    <EnseignantShell
      titre="Mon profil"
      sous="Vos informations, votre mot de passe et votre signature (bulletins)."
    >
      <ProfilForm
        profil={{
          prenom: u.prenom,
          nom: u.nom,
          email: u.email,
          telephone: u.telephone,
          photo: u.photo,
          signature: u.signature,
          role: libelleRole(ctx.role),
        }}
      />
    </EnseignantShell>
  );
}
