"use client";

import Link from "next/link";
import { ConnectionModal } from "@/components/auth/ConnectionModal";

export default function ConnectionPageClient() {
  return (
    <>
      {/* Background Elements */}
      <div className="pointer-events-none absolute inset-0 bg-grid-faint bg-[size:44px_44px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black,transparent)]" />
      <div className="pointer-events-none absolute -top-40 right-[-10%] h-96 w-96 rounded-full bg-primary-600/20 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-[-20%] left-[-10%] h-96 w-96 rounded-full bg-secondary-400/10 blur-[120px]" />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-6 py-16">
        <div className="w-full max-w-md rounded-3xl border border-white/10 bg-gradient-to-br from-neutral-950 via-primary-950 to-neutral-900 p-10 shadow-2xl backdrop-blur-xl">
          <div className="mb-8 flex justify-center">
            <h1 className="font-display text-2xl font-bold text-white">Bienvenue</h1>
          </div>
          <p className="mb-6 text-center text-sm text-neutral-300">Connectez-vous à SAIMO</p>

          <div className="space-y-4">
            <Link href="/connexion/administrations" className="w-full block text-center rounded-2xl bg-gradient-primary-secondary px-6 py-4 font-semibold text-white">Administrations</Link>

            <Link href="/connexion/visiteurs" className="w-full block text-center rounded-2xl border-2 border-primary-500/50 px-6 py-4 font-semibold text-white">Visiteurs</Link>
          </div>

          <div className="mt-8 border-t border-white/10 pt-6 text-center">
            <Link href="/" className="text-xs text-neutral-400 hover:text-neutral-300">← Retour à l'accueil</Link>
          </div>
        </div>
      </div>
    </>
  );
}
