"use client";

import { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { Mail, Lock, LogIn, Loader2 } from "lucide-react";
import { LogoLockup } from "@/components/Logo";
import Link from "next/link";

export function VisitorsRegistration() {
  const rootRef = useRef<HTMLDivElement>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".step-anim",
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power3.out" }
      );
    }, rootRef);
    return () => ctx.revert();
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Veuillez remplir tous les champs.");
      return;
    }

    setIsLoading(true);

    // Simulate login
    setTimeout(() => {
      setIsLoading(false);
      window.localStorage.setItem("saimo-portal-role", "parent");
      window.location.href = `/parent`;
    }, 1500);
  };

  return (
    <div ref={rootRef} className="w-full bg-transparent" suppressHydrationWarning>

      <div className="card-badge mb-10 flex justify-center lg:hidden step-anim">
        <Link href="/">
          <LogoLockup variant="dark" />
        </Link>
      </div>

      <div className="flex flex-col">
        <div className="text-center sm:text-left mb-8 step-anim">
          <h1 className="font-display text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-orange-500 mb-2">
            Portail Familles
          </h1>
          <p className="text-sm text-slate-500">
            Connectez-vous pour suivre la scolarité de vos enfants.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">

          {/* Email Input */}
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
                placeholder="parent@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent rounded-xl border-2 border-neutral-200 py-3.5 pl-11 pr-4 text-sm text-navy-900 placeholder:text-slate-400 outline-none transition-all focus:border-orange-400 hover:border-neutral-300"
              />
            </div>
          </div>

          {/* Password Input */}
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
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent rounded-xl border-2 border-neutral-200 py-3.5 pl-11 pr-4 text-sm text-navy-900 placeholder:text-slate-400 outline-none transition-all focus:border-orange-400 hover:border-neutral-300"
              />
            </div>
          </div>

          <div className="step-anim flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="rounded text-orange-500 focus:ring-orange-500 w-4 h-4 border-neutral-300" />
              <span className="text-xs font-medium text-slate-600">Se souvenir de moi</span>
            </label>
            <a href="#" className="text-xs font-medium text-orange-500 hover:text-orange-600 hover:underline">
              Mot de passe oublié ?
            </a>
          </div>

          {error && (
            <div className="step-anim rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-600 text-center font-medium">
              {error}
            </div>
          )}

          <div className="step-anim pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-orange-400 hover:from-blue-600 hover:to-orange-500 py-4 font-bold text-white transition-all shadow-[0_8px_20px_-8px_rgba(249,115,22,0.5)] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Connexion...
                </>
              ) : (
                "Se connecter"
              )}
            </button>
          </div>
        </form>
      </div>

    </div>
  );
}
