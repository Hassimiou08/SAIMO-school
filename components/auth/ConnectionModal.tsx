"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import Link from "next/link";
import { Building2, Users } from "lucide-react";
import { LogoLockup } from "@/components/Logo";

export function ConnectionModal() {
  const rootRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      
      // Animation du backdrop
      tl.from(".modal-backdrop", { opacity: 0, duration: 0.3 })
      // Animation du container
        .from(".modal-container", { scale: 0.95, opacity: 0, duration: 0.4 }, "-=0.2")
      // Animation du logo
        .from(".modal-logo", { y: 12, opacity: 0, duration: 0.3 }, "-=0.25")
      // Animation du titre
        .from(".modal-title", { y: 10, opacity: 0, duration: 0.3 }, "-=0.2")
      // Animation des boutons
        .from(".modal-button", { y: 15, opacity: 0, duration: 0.3, stagger: 0.1 }, "-=0.2");
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div className="modal-backdrop absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal Container */}
      <div className="modal-container relative flex min-h-screen items-center justify-center px-6 py-16">
        <div className="w-full max-w-md rounded-3xl border border-white/10 bg-gradient-to-br from-neutral-950 via-primary-950 to-neutral-900 p-10 shadow-2xl backdrop-blur-xl">
          {/* Logo */}
          <div className="modal-logo mb-8 flex justify-center">
            <LogoLockup variant="light" />
          </div>

          {/* Title */}
          <div className="modal-title mb-10 text-center">
            <h1 className="font-display text-2xl font-bold text-white">
              Bienvenue
            </h1>
            <p className="mt-2 text-sm text-neutral-300">
              Connectez-vous à SAIMO
            </p>
          </div>

          {/* Buttons Container */}
          <div className="space-y-4">
            {/* Administrations Button */}
            <Link href="/connexion/administrations">
              <button className="modal-button w-full group relative overflow-hidden rounded-2xl bg-gradient-primary-secondary p-0.5 transition-all hover:shadow-lg hover:shadow-primary-500/50">
                {/* Inner gradient background */}
                <div className="relative flex items-center justify-center gap-3 rounded-2xl bg-neutral-950 px-6 py-4 transition-colors group-hover:bg-neutral-900">
                  <Building2 className="h-5 w-5 text-secondary-500" />
                  <div className="text-left">
                    <div className="font-semibold text-white">Administrations</div>
                    <div className="text-xs text-neutral-400">
                      Accès établissements
                    </div>
                  </div>
                </div>
              </button>
            </Link>

            {/* Visitors Button */}
            <Link href="/connexion/visiteurs">
              <button className="modal-button w-full group relative overflow-hidden rounded-2xl border-2 border-primary-500/50 transition-all hover:border-primary-400 hover:shadow-lg hover:shadow-primary-500/30">
                <div className="flex items-center justify-center gap-3 px-6 py-4">
                  <Users className="h-5 w-5 text-primary-400" />
                  <div className="text-left">
                    <div className="font-semibold text-white">Visiteurs</div>
                    <div className="text-xs text-neutral-400">
                      Parents, Élèves, Enseignants
                    </div>
                  </div>
                </div>
              </button>
            </Link>
          </div>

          {/* Footer */}
          <div className="mt-8 border-t border-white/10 pt-6">
            <Link href="/">
              <p className="text-center text-xs text-neutral-400 hover:text-neutral-300 transition-colors cursor-pointer">
                ← Retour à l&apos;accueil
              </p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
