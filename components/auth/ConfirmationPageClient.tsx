"use client";

import Link from "next/link";
import { CheckCircle, ArrowRight } from "lucide-react";

export default function ConfirmationPageClient() {
  return (
    <>
      {/* Background Elements */}
      <div className="pointer-events-none absolute inset-0 bg-grid-faint bg-[size:44px_44px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black,transparent)]" />
      <div className="pointer-events-none absolute -top-40 right-[-10%] h-96 w-96 rounded-full bg-success-600/20 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-[-20%] left-[-10%] h-96 w-96 rounded-full bg-primary-400/10 blur-[120px]" />

      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-success-500/20 bg-gradient-to-br from-neutral-900/80 via-success-950/40 to-neutral-900/80 p-8 shadow-2xl backdrop-blur text-center">
          {/* Success Icon */}
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-success-500/20 p-4">
              <CheckCircle className="h-8 w-8 text-success-400" />
            </div>
          </div>

          {/* Message */}
          <h1 className="font-display text-2xl font-bold text-white mb-2">
            Inscription réussie!
          </h1>
          <p className="text-neutral-300 mb-6">
            Votre compte SAIMO a été créé avec succès. Vous recevrez un email de confirmation avec vos identifiants de connexion.
          </p>

          {/* Checklist */}
          <div className="mb-6 space-y-3 text-left">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-4 w-4 flex-shrink-0 text-success-400" />
              <span className="text-sm text-neutral-300">Compte créé et validé</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-4 w-4 flex-shrink-0 text-success-400" />
              <span className="text-sm text-neutral-300">Email de confirmation envoyé</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-4 w-4 flex-shrink-0 text-success-400" />
              <span className="text-sm text-neutral-300">Prêt à accéder au portail</span>
            </div>
          </div>

          {/* CTA */}
          <Link
            href="/connexion"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-primary-secondary px-6 py-3 font-medium text-white transition-all hover:shadow-lg hover:shadow-primary-500/30"
          >
            Accéder au portail
            <ArrowRight className="h-4 w-4" />
          </Link>

          {/* Footer Link */}
          <div className="mt-6 border-t border-success-500/20 pt-6">
            <Link href="/" className="text-xs text-neutral-400 hover:text-neutral-300 transition-colors">
              ← Retour à l'accueil
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
