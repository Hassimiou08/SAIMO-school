import type { Metadata } from "next";
import AdminLoginPageClient from "@/components/auth/AdminLoginPageClient";

export const metadata: Metadata = {
  title: "Connexion Administrations — SAIMO",
  description: "Connectez-vous en tant qu'administrateur SAIMO.",
};

export default function AdminLoginPage() {
  return (
    <main className="min-h-screen w-full bg-[#FDF8F0]" suppressHydrationWarning>
      <AdminLoginPageClient />
    </main>
  );
};
