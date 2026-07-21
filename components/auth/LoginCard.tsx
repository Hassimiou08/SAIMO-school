"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ArrowRight, Mail, Lock, Building2, Eye, EyeOff } from "lucide-react";
import { LogoLockup } from "@/components/Logo";

export function LoginCard() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .from(".login-badge", { y: 12, opacity: 0, duration: 0.4 })
        .from(".login-card", { y: 20, opacity: 0, duration: 0.55 }, "-=0.15")
        .from(".login-field", { y: 10, opacity: 0, duration: 0.4, stagger: 0.07 }, "-=0.25");
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="w-full max-w-md">
      <div className="login-badge mb-8 flex justify-center">
        <LogoLockup variant="light" />
      </div>

      <div className="login-card rounded-2xl border border-white/10 bg-white/[0.04] p-8 shadow-panel backdrop-blur">
        <h1 className="font-display text-xl font-semibold text-white">
          Connexion à votre espace
        </h1>
        <p className="mt-1.5 text-sm text-white/50">
          Accédez au portail de votre établissement.
        </p>

        <form
          className="mt-7 space-y-4"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="login-field">
            <label
              htmlFor="etablissement"
              className="mb-1.5 block text-xs font-medium text-white/60"
            >
              Établissement
            </label>
            <div className="relative">
              <Building2 className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
              <input
                id="etablissement"
                type="text"
                placeholder="Nom de l'établissement"
                className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-3 pl-10 pr-3.5 text-sm text-white placeholder:text-white/30 outline-none transition-colors focus:border-teal-400/60"
              />
            </div>
          </div>

          <div className="login-field">
            <label
              htmlFor="email"
              className="mb-1.5 block text-xs font-medium text-white/60"
            >
              Adresse e-mail
            </label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
              <input
                id="email"
                type="email"
                placeholder="vous@etablissement.gn"
                className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-3 pl-10 pr-3.5 text-sm text-white placeholder:text-white/30 outline-none transition-colors focus:border-teal-400/60"
              />
            </div>
          </div>

          <div className="login-field">
            <div className="mb-1.5 flex items-center justify-between">
              <label htmlFor="password" className="block text-xs font-medium text-white/60">
                Mot de passe
              </label>
              <a href="#" className="text-xs font-medium text-teal-300 hover:text-teal-200">
                Mot de passe oublié ?
              </a>
            </div>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-3 pl-10 pr-10 text-sm text-white placeholder:text-white/30 outline-none transition-colors focus:border-teal-400/60"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/35 hover:text-white/60"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="login-field group mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-white py-3.5 text-sm font-semibold text-navy-950 transition-transform hover:-translate-y-0.5"
          >
            Se connecter
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </form>

        <p className="login-field mt-6 text-center text-xs text-white/40">
          Accès réservé aux administrateurs, enseignants, secrétariat,
          comptabilité, parents et élèves des établissements partenaires.
        </p>
      </div>

      <p className="mt-6 text-center text-xs text-white/35">
        Besoin d&rsquo;un accès ?{" "}
        <a href="/#pilote" className="font-medium text-white/60 hover:text-white">
          Contactez votre administration
        </a>
      </p>
    </div>
  );
}
