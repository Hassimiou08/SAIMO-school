import type { Metadata } from "next";
import ConfirmationPageClient from "@/components/auth/ConfirmationPageClient";

export const metadata: Metadata = {
  title: "Confirmation d'inscription — SAIMO",
  description: "Votre compte a été créé avec succès.",
};

export default function ConfirmationPage() {
  return (
    <main
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-neutral-950 via-primary-950 to-neutral-900 px-6 py-16"
      suppressHydrationWarning
    >
      <ConfirmationPageClient />
    </main>
  );
}
