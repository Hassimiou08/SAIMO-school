"use client";

import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import Link from "next/link";
import { ArrowLeft, Users, BookOpen, HeartHandshake } from "lucide-react";
import { LogoLockup } from "@/components/Logo";

type AccountType = "enseignant" | "eleve" | "parent" | null;

export function VisitorsRegistration() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [selectedType, setSelectedType] = useState<AccountType>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .from(".card-badge", { y: 12, opacity: 0, duration: 0.4 })
        .from(".card-header", { y: 20, opacity: 0, duration: 0.55 }, "-=0.15")
        .from(".account-type", { y: 15, opacity: 0, duration: 0.4, stagger: 0.1 }, "-=0.25");
    }, rootRef);
    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!selectedType) {
      setError("Veuillez sélectionner un type de compte");
      return;
    }

    if (!name || !email) {
      setError("Veuillez remplir tous les champs");
      return;
    }

    setIsLoading(true);

    // Simulation de l'inscription
    setTimeout(() => {
      setSuccess(true);
      setTimeout(() => {
        // Redirection vers la confirmation
        window.location.href = `/connexion/visiteurs/confirmation?type=${selectedType}`;
      }, 1500);
    }, 1500);
  };

  const accountTypes = [
    {
      id: "enseignant",
      label: "Enseignant",
      description: "Accès au portail d'enseignant",
      icon: BookOpen,
      color: "primary",
    },
    {
      id: "eleve",
      label: "Élève",
      description: "Suivi académique et notes",
      icon: Users,
      color: "primary",
    },
    {
      id: "parent",
      label: "Parent/Tuteur",
      description: "Suivi de votre enfant",
      icon: HeartHandshake,
      color: "secondary",
    },
  ];

  return (
    <div ref={rootRef} className="w-full max-w-2xl">
      <div className="card-badge mb-8 flex justify-center">
        <LogoLockup variant="light" />
      </div>

      <div className="rounded-2xl border border-primary-500/20 bg-gradient-to-br from-neutral-900/80 via-primary-950/60 to-neutral-900/80 p-8 shadow-2xl backdrop-blur">
        <div className="card-header">
          <h1 className="font-display text-xl font-semibold text-white">
            Créer votre compte
          </h1>
          <p className="mt-1.5 text-sm text-neutral-300">
            Sélectionnez votre profil pour accéder à SAIMO
          </p>
        </div>

        {!success ? (
          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            {/* Account Type Selection */}
            <div>
              <label className="mb-4 block text-sm font-medium text-neutral-200">
                Type de compte
              </label>
              <div className="grid gap-3 sm:grid-cols-3">
                {accountTypes.map((type) => {
                  const Icon = type.icon;
                  const isSelected = selectedType === type.id;
                  const bgColor =
                    type.color === "primary"
                      ? "border-primary-500/50 bg-primary-900/20 hover:bg-primary-900/40"
                      : "border-secondary-500/50 bg-secondary-900/20 hover:bg-secondary-900/40";

                  return (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setSelectedType(type.id as AccountType)}
                      className={`account-type group rounded-xl border-2 p-4 text-left transition-all ${
                        isSelected
                          ? `border-${type.color}-400 ${
                              type.color === "primary"
                                ? "bg-gradient-to-br from-primary-600/30 to-primary-600/10"
                                : "bg-gradient-to-br from-secondary-600/30 to-secondary-600/10"
                            } shadow-lg shadow-${type.color}-500/20`
                          : bgColor
                      }`}
                    >
                      <Icon
                        className={`mb-2 h-5 w-5 transition-transform ${
                          type.color === "primary"
                            ? "text-primary-400 group-hover:scale-110 group-hover:text-primary-300"
                            : "text-secondary-400 group-hover:scale-110 group-hover:text-secondary-300"
                        }`}
                      />
                      <div className="font-medium text-white">{type.label}</div>
                      <div className="text-xs text-neutral-400">
                        {type.description}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Form Fields */}
            {selectedType && (
              <>
                <div>
                  <label
                    htmlFor="name"
                    className="mb-1.5 block text-xs font-medium text-neutral-300"
                  >
                    Nom complet
                  </label>
                  <input
                    id="name"
                    type="text"
                    placeholder="Votre nom complet"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-primary-500/20 bg-white/[0.03] py-3 px-4 text-sm text-white placeholder:text-neutral-500 outline-none transition-all focus:border-primary-400/60 focus:bg-white/[0.05]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="mb-1.5 block text-xs font-medium text-neutral-300"
                  >
                    Adresse e-mail
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="votre@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-primary-500/20 bg-white/[0.03] py-3 px-4 text-sm text-white placeholder:text-neutral-500 outline-none transition-all focus:border-primary-400/60 focus:bg-white/[0.05]"
                  />
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
                      <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Création...
                    </>
                  ) : (
                    "Créer mon compte"
                  )}
                </button>
              </>
            )}
          </form>
        ) : (
          <div className="py-8 text-center">
            <div className="mb-4 flex justify-center">
              <div className="rounded-full bg-success-500/20 p-3">
                <div className="relative h-8 w-8 flex items-center justify-center">
                  <div className="absolute inset-0 animate-pulse rounded-full bg-success-500" />
                  <div className="relative text-success-400">✓</div>
                </div>
              </div>
            </div>
            <p className="text-sm font-medium text-success-400">
              Compte créé avec succès!
            </p>
            <p className="mt-2 text-xs text-neutral-400">
              Redirection...
            </p>
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
