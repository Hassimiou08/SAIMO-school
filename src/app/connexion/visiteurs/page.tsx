import type { Metadata } from "next";
import VisitorsPageClient from "@/components/auth/VisitorsPageClient";
import { getMarqueEcole } from "@/server/dal/site-ecole";

type Props = { searchParams: Promise<{ ecole?: string }> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const marque = await getMarqueEcole((await searchParams).ecole);
  return {
    title: marque ? `Espace familles — ${marque.nomCourt}` : "Portail Famille — SAIMO",
    description: "Connectez-vous à votre espace personnel.",
  };
}

export default async function VisitorsPage({ searchParams }: Props) {
  const marque = await getMarqueEcole((await searchParams).ecole);
  return (
    <main className="min-h-screen w-full bg-[#FDF8F0]" suppressHydrationWarning>
      <VisitorsPageClient marque={marque} />
    </main>
  );
}
