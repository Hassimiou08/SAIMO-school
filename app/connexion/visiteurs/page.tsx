import type { Metadata } from "next";
import VisitorsPageClient from "@/components/auth/VisitorsPageClient";

export const metadata: Metadata = {
  title: "Inscription Visiteurs — SAIMO",
  description: "Créez votre compte en tant que parent, élève ou enseignant.",
};

export default function VisitorsPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-neutral-950 via-primary-950 to-neutral-900 px-6 py-16" suppressHydrationWarning>
      <VisitorsPageClient />
    </main>
  );
}
