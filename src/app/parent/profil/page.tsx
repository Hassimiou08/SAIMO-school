import { ParentShell } from "@/components/parent/ParentShell";
import { ProfilForm } from "@/components/portal/ProfilForm";
import { prisma } from "@/lib/prisma";
import { requireContext } from "@/server/context";
import { libelleRole } from "@/lib/roles-labels";

export const metadata = { title: "Mon profil — Espace Parent SAIMO" };

export default async function ProfilParentPage() {
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
    <ParentShell max="max-w-3xl">
      <div className="mb-7">
        <h1 className="font-display text-2xl font-bold tracking-tight text-neutral-900">Mon profil</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Vos informations personnelles et la sécurité de votre compte.
        </p>
      </div>
      <ProfilForm
        afficherSignature={false}
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
    </ParentShell>
  );
}
