"use client";

import { useRef, useEffect } from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { gsap } from "gsap";
import { Mail, Lock, Loader2 } from "lucide-react";
import { actionConnexionPersonnel } from "@/server/actions/auth";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-xl bg-blue-500 hover:bg-blue-600 py-4 font-bold text-white transition-all shadow-[0_8px_20px_-8px_rgba(59,130,246,0.6)] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
    >
      {pending ? (
        <>
          <Loader2 className="h-5 w-5 animate-spin" />
          Connexion...
        </>
      ) : (
        "Se connecter"
      )}
    </button>
  );
}

export function AdminLoginForm() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [error, formAction] = useActionState(actionConnexionPersonnel, undefined);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".step-anim",
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power3.out" },
      );
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="w-full bg-transparent" suppressHydrationWarning>
      <div className="flex flex-col">
        <div className="text-center sm:text-left mb-8 step-anim">
          <h1 className="font-display text-3xl font-bold text-blue-600 mb-2">
            Espace Sécurisé
          </h1>
          <p className="text-sm text-slate-500">
            Veuillez vous authentifier pour accéder à votre portail de gestion.
          </p>
        </div>

        <form action={formAction} className="space-y-6">
          {/* Email */}
          <div className="step-anim relative">
            <div className="absolute -top-2.5 left-3 bg-[#FDF8F0] px-1 text-xs font-semibold text-blue-600 z-10">
              Email
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="email"
                name="email"
                required
                autoComplete="email"
                placeholder="prenom.nom@saimo.gn"
                className="w-full bg-transparent rounded-xl border-2 border-blue-200 py-3.5 pl-11 pr-4 text-sm text-navy-900 placeholder:text-slate-400 outline-none transition-all focus:border-blue-500 hover:border-blue-300"
              />
            </div>
          </div>

          {/* Mot de passe */}
          <div className="step-anim relative">
            <div className="absolute -top-2.5 left-3 bg-[#FDF8F0] px-1 text-xs font-semibold text-blue-600 z-10">
              Mot de passe
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="password"
                name="password"
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full bg-transparent rounded-xl border-2 border-blue-200 py-3.5 pl-11 pr-4 text-sm text-navy-900 placeholder:text-slate-400 outline-none transition-all focus:border-blue-500 hover:border-blue-300"
              />
            </div>
          </div>

          <div className="step-anim flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 border-blue-200"
              />
              <span className="text-xs font-medium text-slate-600">
                Se souvenir de moi
              </span>
            </label>
            <a
              href="/sections/contact"
              className="text-xs font-medium text-orange-400 hover:text-orange-500 hover:underline"
            >
              Mot de passe oublié ?
            </a>
          </div>

          {error && (
            <div className="step-anim rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-600 text-center font-medium">
              {error}
            </div>
          )}

          <div className="step-anim pt-4">
            <SubmitButton />
          </div>
        </form>
      </div>
    </div>
  );
}
