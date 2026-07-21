import type { Metadata } from "next";
import { VisitorsRegistration } from "@/components/auth/VisitorsRegistration";

export const metadata: Metadata = {
  title: "Inscription Visiteurs — SAIMO",
  description: "Créez votre compte en tant que parent, élève ou enseignant.",
};

export default function VisitorsPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-neutral-950 via-primary-950 to-neutral-900 px-6 py-16">
      {/* Background Elements */}
      <div className="pointer-events-none absolute inset-0 bg-grid-faint bg-[size:44px_44px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black,transparent)]" />
      <div className="pointer-events-none absolute -top-40 right-[-10%] h-96 w-96 rounded-full bg-primary-600/20 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-[-20%] left-[-10%] h-96 w-96 rounded-full bg-secondary-400/10 blur-[120px]" />

      <div className="relative">
        <VisitorsRegistration />
      </div>
    </main>
  );
}
