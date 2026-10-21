import type { Metadata } from "next";
import AdminLoginPageClient from "@/components/auth/AdminLoginPageClient";
import { getMarqueEcole } from "@/server/dal/site-ecole";

type Props = { searchParams: Promise<{ ecole?: string }> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const marque = await getMarqueEcole((await searchParams).ecole);
  return {
    title: marque ? `Espace personnel — ${marque.nomCourt}` : "Connexion Administrations — SAIMO",
    description: "Connectez-vous à l'espace du personnel de l'établissement.",
  };
}

export default async function AdminLoginPage({ searchParams }: Props) {
  const marque = await getMarqueEcole((await searchParams).ecole);
  return (
    <main className="min-h-screen w-full bg-[#FDF8F0]" suppressHydrationWarning>
      <AdminLoginPageClient marque={marque} />
    </main>
  );
}
