import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Confirmation d'inscription — SAIMO",
  description: "Votre compte a été créé avec succès.",
};

export default function ConfirmationPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-neutral-950 via-primary-950 to-neutral-900 px-6 py-16">
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
          <div className="space-y-2 mb-8 text-left">
            <div className="flex items-center gap-3">
              <span className="text-success-400">✓</span>
              <span className="text-sm text-neutral-300">Email de confirmation envoyé</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-success-400">✓</span>
              <span className="text-sm text-neutral-300">Accès au portail activé</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-success-400">✓</span>
              <span className="text-sm text-neutral-300">Profil configuré</span>
            </div>
          </div>

          {/* CTA Button */}
          <Link href="/connexion">
            <button className="w-full rounded-xl bg-gradient-primary-secondary py-3 font-medium text-white transition-all hover:shadow-lg hover:shadow-secondary-500/30 flex items-center justify-center gap-2">
              Retour à la connexion
              <ArrowRight className="h-4 w-4" />
            </button>
          </Link>

          {/* Help Link */}
          <div className="mt-6 border-t border-neutral-700 pt-6">
            <p className="text-xs text-neutral-400">
              Des questions?{" "}
              <button className="text-primary-400 hover:text-primary-300 transition-colors font-medium">
                Contactez le support
              </button>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
