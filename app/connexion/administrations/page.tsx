import type { Metadata } from "next";
import AdminLoginPageClient from "@/components/auth/AdminLoginPageClient";

export const metadata: Metadata = {
  title: "Connexion Administrations — SAIMO",
  description: "Connectez-vous en tant qu'administrateur SAIMO.",
};

export default function AdminLoginPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-neutral-950 via-primary-950 to-neutral-900 px-6 py-16" suppressHydrationWarning>
      <AdminLoginPageClient />
    </main>
  );
};
