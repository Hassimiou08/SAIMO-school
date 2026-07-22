import type { Metadata } from "next";
import ConnectionPageClient from "@/components/auth/ConnectionPageClient";

export const metadata: Metadata = {
  title: "Connexion — SAIMO",
  description: "Connectez-vous au portail de votre établissement SAIMO.",
};

export default function ConnexionPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-neutral-950 via-primary-950 to-neutral-900" suppressHydrationWarning>
      <ConnectionPageClient />
    </main>
  );
}
