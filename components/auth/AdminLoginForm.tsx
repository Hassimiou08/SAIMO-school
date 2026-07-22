"use client";

import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import Link from "next/link";
import {
  ArrowLeft,
  Mail,
  Lock,
  Building2,
  Eye,
  EyeOff,
  Fingerprint,
  Mic,
  Loader2,
} from "lucide-react";
import { LogoLockup } from "@/components/Logo";

export function AdminLoginForm() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [establishment, setEstablishment] = useState("");
  const [accountType, setAccountType] = useState<"admin" | "teacher" | "student" | "parent">("admin");
  const [role, setRole] = useState<"super_admin" | "directeur" | "secretaire" | "comptable" | "enseignant" | "parent" | "eleve">("directeur");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"credentials" | "biometric">("credentials");
  const [biometricStatus, setBiometricStatus] = useState<"idle" | "listening" | "processing" | "success" | "error">("idle");
  const [error, setError] = useState("");

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

  const getRoleFromAccountType = (type: typeof accountType) => {
    switch (type) {
      case "admin":
        return "directeur";
      case "teacher":
        return "enseignant";
      case "student":
        return "eleve";
      case "parent":
        return "parent";
      default:
        return "directeur";
    }
  };

  const getRedirectPath = (type: typeof accountType) => {
    switch (type) {
      case "admin":
        return "/portail";
      case "teacher":
        return "/portail";
      case "student":
        return "/portail/eleves";
      case "parent":
        return "/portail";
      default:
        return "/portail";
    }
  };

  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const resolvedRole = getRoleFromAccountType(accountType);
    setRole(resolvedRole);

    // Simulation d'authentification - À remplacer par Auth0 réel
    setTimeout(() => {
      if (email && password && establishment) {
        setBiometricStatus("success");
        window.localStorage.setItem("saimo-portal-role", resolvedRole);
        setTimeout(() => {
          window.location.href = getRedirectPath(accountType);
        }, 1500);
      } else {
        setError("Veuillez remplir tous les champs");
        setIsLoading(false);
      }
    }, 1500);
  };

  const handleBiometricAuth = async (type: "fingerprint" | "voice") => {
    setBiometricStatus("listening");
    setError("");

    // Simulation de l&apos;authentification biométrique
    const resolvedRole = getRoleFromAccountType(accountType);
    setRole(resolvedRole);

    setTimeout(() => {
      setBiometricStatus("processing");
      setTimeout(() => {
        if (Math.random() > 0.3) {
          // 70% de succès simulé
          setBiometricStatus("success");
          window.localStorage.setItem("saimo-portal-role", resolvedRole);
          setTimeout(() => {
            window.location.href = getRedirectPath(accountType);
          }, 1500);
        } else {
          setBiometricStatus("error");
          setError(
            type === "fingerprint"
              ? "Empreinte non reconnue. Veuillez réessayer."
              : "Voix non reconnue. Veuillez réessayer."
          );
        }
      }, 1500);
    }, 1500);
  };

  const resetBiometric = () => {
    setBiometricStatus("idle");
    setError("");
  };

  return (
    <div ref={rootRef} className="w-full max-w-3xl" suppressHydrationWarning>
      <div className="login-badge mb-8 flex justify-center">
        <LogoLockup variant="light" />
      </div>

      <div className="login-card rounded-2xl border border-primary-500/20 bg-gradient-to-br from-neutral-900/80 via-primary-950/60 to-neutral-900/80 p-8 shadow-2xl backdrop-blur">
        <h1 className="font-display text-xl font-semibold text-white">
          Espace Administrateur
        </h1>
        <p className="mt-1.5 text-sm text-neutral-300">
          Connectez-vous avec vos identifiants ou via biométrie.
        </p>

        {/* Tabs */}
        <div className="mt-6 flex gap-2 rounded-xl border border-primary-500/20 bg-neutral-900/50 p-1">
          <button
            onClick={() => {
              setActiveTab("credentials");
              resetBiometric();
            }}
            className={`flex-1 rounded-lg py-2 text-xs font-medium transition-all ${
              activeTab === "credentials"
                ? "bg-gradient-primary-secondary text-white shadow-lg shadow-primary-500/30"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            Identifiants
          </button>
          <button
            onClick={() => {
              setActiveTab("biometric");
              resetBiometric();
            }}
            className={`flex-1 rounded-lg py-2 text-xs font-medium transition-all ${
              activeTab === "biometric"
                ? "bg-gradient-primary-secondary text-white shadow-lg shadow-primary-500/30"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            Biométrie
          </button>
        </div>

        {/* Credentials Tab */}
        {activeTab === "credentials" && (
          <form className="mt-6 space-y-4" onSubmit={handleCredentialsSubmit}>
            <div className="login-field">
              <label htmlFor="établissement" className="mb-1.5 block text-xs font-medium text-neutral-300">
                Établissement
              </label>
              <div className="relative">
                <Building2 className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-primary-400/50" />
                <input
                  id="établissement"
                  type="text"
                  placeholder="Nom de l'établissement"
                  value={establishment}
                  onChange={(e) => setEstablishment(e.target.value)}
                  className="w-full rounded-xl border border-primary-500/20 bg-white/[0.03] py-3 pl-10 pr-3.5 text-sm text-white placeholder:text-neutral-500 outline-none transition-all focus:border-primary-400/60 focus:bg-white/[0.05]"
                />
              </div>
            </div>

            <div className="login-field">
              <label htmlFor="email" className="mb-1.5 block text-xs font-medium text-neutral-300">
                Adresse e-mail
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-primary-400/50" />
                <input
                  id="email"
                  type="email"
                  placeholder="admin@etablissement.gn"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-primary-500/20 bg-white/[0.03] py-3 pl-10 pr-3.5 text-sm text-white placeholder:text-neutral-500 outline-none transition-all focus:border-primary-400/60 focus:bg-white/[0.05]"
                />
              </div>
            </div>

            <div className="login-field">
              <label htmlFor="accountType" className="mb-1.5 block text-xs font-medium text-neutral-300">
                Type de compte
              </label>
              <select
                id="accountType"
                value={accountType}
                onChange={(e) => setAccountType(e.target.value as typeof accountType)}
                className="w-full rounded-xl border border-primary-500/20 bg-white/[0.03] py-3 px-3.5 text-sm text-white outline-none transition-all focus:border-primary-400/60 focus:bg-white/[0.05]"
              >
                <option value="admin" className="bg-neutral-900">Administrateur</option>
                <option value="teacher" className="bg-neutral-900">Enseignant</option>
                <option value="student" className="bg-neutral-900">Élève</option>
                <option value="parent" className="bg-neutral-900">Parent</option>
              </select>
            </div>

            <div className="login-field">
              <div className="mb-1.5 flex items-center justify-between">
                <label htmlFor="password" className="block text-xs font-medium text-neutral-300">
                  Mot de passe
                </label>
                <button
                  type="button"
                  className="text-xs font-medium text-primary-400 hover:text-primary-300 transition-colors"
                >
                  Oublié ?
                </button>
              </div>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-primary-400/50" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-primary-500/20 bg-white/[0.03] py-3 pl-10 pr-10 text-sm text-white placeholder:text-neutral-500 outline-none transition-all focus:border-primary-400/60 focus:bg-white/[0.05]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-200 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-lg border border-error-500/30 bg-error-500/10 p-3 text-xs text-error-300">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl bg-gradient-primary-secondary py-3 font-medium text-white transition-all hover:shadow-lg hover:shadow-secondary-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Connexion...
                </>
              ) : (
                "Se connecter"
              )}
            </button>
          </form>
        )}

        {/* Biometric Tab */}
        {activeTab === "biometric" && (
          <div className="mt-6 space-y-4">
            <div className="rounded-xl border border-primary-500/20 bg-neutral-900/50 p-6 text-center">
              {biometricStatus === "idle" ? (
                <>
                  <p className="mb-6 text-sm text-neutral-300">
                    Sélectionnez une méthode d&apos;authentification biométrique
                  </p>
                  <div className="space-y-3">
                    <button
                      onClick={() => handleBiometricAuth("fingerprint")}
                      className="w-full flex items-center justify-center gap-3 rounded-xl border border-primary-500/30 bg-primary-900/20 py-4 hover:border-primary-400/60 hover:bg-primary-900/40 transition-all group"
                    >
                      <Fingerprint className="h-5 w-5 text-primary-400 group-hover:scale-110 transition-transform" />
                      <div>
                        <div className="font-medium text-white">Empreinte Digitale</div>
                        <div className="text-xs text-neutral-400">
                          Posez votre doigt
                        </div>
                      </div>
                    </button>
                    <button
                      onClick={() => handleBiometricAuth("voice")}
                      className="w-full flex items-center justify-center gap-3 rounded-xl border border-secondary-500/30 bg-secondary-900/20 py-4 hover:border-secondary-400/60 hover:bg-secondary-900/40 transition-all group"
                    >
                      <Mic className="h-5 w-5 text-secondary-400 group-hover:scale-110 transition-transform" />
                      <div>
                        <div className="font-medium text-white">Reconnaissance Vocale</div>
                        <div className="text-xs text-neutral-400">
                          Dites &quot;Authentifier&quot;
                        </div>
                      </div>
                    </button>
                  </div>
                </>
              ) : biometricStatus === "listening" ? (
                <div className="py-8">
                  <div className="mb-4 flex justify-center">
                    <div className="relative h-16 w-16">
                      <div className="absolute inset-0 animate-pulse rounded-full bg-primary-500/20" />
                      <div className="absolute inset-2 animate-pulse rounded-full bg-primary-500/30 delay-100" />
                      <div className="absolute inset-4 rounded-full bg-primary-500" />
                    </div>
                  </div>
                  <p className="text-sm text-neutral-300">
                    Authentification en cours...
                  </p>
                </div>
              ) : biometricStatus === "processing" ? (
                <div className="py-8">
                  <div className="mb-4 flex justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary-400" />
                  </div>
                  <p className="text-sm text-neutral-300">
                    Vérification...
                  </p>
                </div>
              ) : biometricStatus === "success" ? (
                <div className="py-8">
                  <div className="mb-4 flex justify-center">
                    <div className="rounded-full bg-success-500/20 p-3">
                      <div className="relative h-8 w-8 flex items-center justify-center">
                        <div className="absolute inset-0 animate-pulse rounded-full bg-success-500" />
                        <div className="relative text-success-400">✓</div>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-success-400">
                    Authentification réussie!
                  </p>
                </div>
              ) : (
                <div className="py-8">
                  <div className="mb-4 flex justify-center">
                    <div className="rounded-full bg-error-500/20 p-3">
                      <div className="h-8 w-8 flex items-center justify-center text-error-400">
                        ✕
                      </div>
                    </div>
                  </div>
                  <p className="mb-4 text-sm text-error-300">
                    {error}
                  </p>
                  <button
                    onClick={resetBiometric}
                    className="w-full rounded-lg bg-primary-600 py-2 text-sm font-medium text-white hover:bg-primary-500 transition-colors"
                  >
                    Réessayer
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 border-t border-primary-500/20 pt-6">
          <Link href="/connexion">
            <p className="flex items-center gap-2 text-center text-xs text-neutral-400 hover:text-neutral-300 transition-colors cursor-pointer">
              <ArrowLeft className="h-3 w-3" />
              Retour
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
