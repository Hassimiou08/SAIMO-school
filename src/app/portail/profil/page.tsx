import type { Metadata } from "next";
import { Sidebar } from "@/components/portal/Sidebar";
import { Topbar } from "@/components/portal/Topbar";
import { ProfilForm } from "@/components/portal/ProfilForm";
import { prisma } from "@/lib/prisma";
import { requireContext } from "@/server/context";
import { libelleRole } from "@/lib/roles-labels";

export const metadata: Metadata = {
  title: "Mon profil — Portail SAIMO",
  description: "Modifier mes informations personnelles et mon mot de passe.",
};

export default async function ProfilPage() {
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
    <div className="min-h-screen bg-paper-100">
      <Sidebar />
      <div className="lg:pl-64">
        <Topbar />
        <main className="mx-auto max-w-3xl px-6 py-8 lg:px-10">
          <div className="mb-7">
            <h1 className="font-display text-2xl font-bold tracking-tight text-navy-900">Mon profil</h1>
            <p className="mt-1 text-sm text-ink-500">
              Vos informations personnelles et la sécurité de votre compte.
            </p>
          </div>
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
        </main>
      </div>
    </div>
  );
}
