import type { Metadata } from "next";
import VisitorsPageClient from "@/components/auth/VisitorsPageClient";

export const metadata: Metadata = {
  title: "Portail Famille — SAIMO",
  description: "Connectez-vous à votre espace personnel.",
};

export default function VisitorsPage() {
  return (
    <main className="min-h-screen w-full bg-[#FDF8F0]" suppressHydrationWarning>
      <VisitorsPageClient />
    </main>
  );
}
