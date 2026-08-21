import type { Metadata } from "next";
import ConnectionPageClient from "@/components/auth/ConnectionPageClient";

export const metadata: Metadata = {
  title: "Connexion — SAIMO",
  description: "Connectez-vous au portail de votre établissement SAIMO.",
};

export default function ConnexionPage() {
  return (
    <main className="relative min-h-screen w-full bg-paper-100" suppressHydrationWarning>
      <ConnectionPageClient />
    </main>
  );
}
