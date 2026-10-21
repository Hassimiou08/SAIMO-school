import type { Metadata } from "next";
import ConnectionPageClient from "@/components/auth/ConnectionPageClient";
import { getMarqueEcole } from "@/server/dal/site-ecole";

type Props = { searchParams: Promise<{ ecole?: string }> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const marque = await getMarqueEcole((await searchParams).ecole);
  return {
    title: marque ? `Connexion — ${marque.nomCourt}` : "Connexion — SAIMO",
    description: marque
      ? `Connectez-vous à l'espace du ${marque.nomComplet}.`
      : "Connectez-vous au portail de votre établissement SAIMO.",
  };
}

export default async function ConnexionPage({ searchParams }: Props) {
  const marque = await getMarqueEcole((await searchParams).ecole);
  return (
    <main className="relative min-h-screen w-full bg-paper-100" suppressHydrationWarning>
      <ConnectionPageClient marque={marque} />
    </main>
  );
}
