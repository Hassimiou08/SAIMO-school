"use client";

import { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { Mail, Lock, Building2, ShieldCheck, Loader2, ArrowRight } from "lucide-react";

const ROLES = [
  { id: "directeur", label: "Direction" },
  { id: "enseignant", label: "Enseignant" },
  { id: "comptable", label: "Comptabilité" },
  { id: "secretaire", label: "Secrétariat" },
  { id: "super_admin", label: "Super Admin" },
];

export function AdminLoginForm() {
  const rootRef = useRef<HTMLDivElement>(null);
  
  // Steps: 1 = Role Selection, 2 = Credentials/Biometrics
  const [step, setStep] = useState<1 | 2>(1);
  const [role, setRole] = useState("directeur");
  
  const [activeTab, setActiveTab] = useState<"credentials" | "biometric">("credentials");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  // 2FA state
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".step-anim",
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power3.out" }
      );
    }, rootRef);
    return () => ctx.revert();
  }, [step, activeTab]);

  const handleRoleSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRole(e.target.value);
  };

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Veuillez remplir tous les champs.");
      return;
    }

    setIsLoading(true);
    
    // Simulate checking credentials before asking for 2FA
    setTimeout(() => {
      setIsLoading(false);
      setActiveTab("biometric");
    }, 1000);
  };

  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const code = otp.join("");
    
    if (code.length < 6) {
      setError("Veuillez entrer le code à 6 chiffres.");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      window.localStorage.setItem("saimo-portal-role", role);
      window.location.href = `/portail`;
    }, 1500);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.slice(value.length - 1);
    }
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value !== "" && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div ref={rootRef} className="w-full bg-transparent" suppressHydrationWarning>
      {activeTab === "credentials" ? (
        <div className="flex flex-col">
          <div className="text-center sm:text-left mb-8 step-anim">
            <h1 className="font-display text-3xl font-bold text-blue-600 mb-2">
              Espace Sécurisé
            </h1>
            <p className="text-sm text-slate-500">
              Veuillez vous authentifier pour accéder à votre portail de gestion.
            </p>
          </div>

          <form onSubmit={handleStep1Submit} className="space-y-6">
            
            {/* Rôle Dropdown */}
            <div className="step-anim relative">
              <div className="absolute -top-2.5 left-3 bg-[#FDF8F0] px-1 text-xs font-semibold text-blue-600 z-10">
                Rôle
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Building2 className="h-5 w-5 text-slate-400" />
                </div>
                <select
                  value={role}
                  onChange={handleRoleSelection}
                  className="w-full bg-transparent rounded-xl border-2 border-blue-200 py-3.5 pl-11 pr-4 text-sm text-navy-900 outline-none transition-all focus:border-blue-500 appearance-none hover:border-blue-300"
                >
                  {ROLES.map(r => (
                    <option key={r.id} value={r.id}>{r.label}</option>
                  ))}
                </select>
              </div>
            </div>

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
                  placeholder="admin@saimo.gn"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent rounded-xl border-2 border-blue-200 py-3.5 pl-11 pr-4 text-sm text-navy-900 placeholder:text-slate-400 outline-none transition-all focus:border-blue-500 hover:border-blue-300"
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
                  className="w-full bg-transparent rounded-xl border-2 border-blue-200 py-3.5 pl-11 pr-4 text-sm text-navy-900 placeholder:text-slate-400 outline-none transition-all focus:border-blue-500 hover:border-blue-300"
                />
              </div>
            </div>

            <div className="step-anim flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 border-blue-200" />
                <span className="text-xs font-medium text-slate-600">Se souvenir de moi</span>
              </label>
              <a href="#" className="text-xs font-medium text-orange-400 hover:text-orange-500 hover:underline">
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
                className="w-full rounded-xl bg-blue-500 hover:bg-blue-600 py-4 font-bold text-white transition-all shadow-[0_8px_20px_-8px_rgba(59,130,246,0.6)] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
      ) : (
        <div className="flex flex-col">
          <div className="text-center sm:text-left mb-8 step-anim flex flex-col items-center sm:items-start">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 border border-blue-200 text-blue-600">
              <ShieldCheck className="h-8 w-8" />
            </div>
            <h1 className="font-display text-3xl font-bold text-blue-600 mb-2">
              Double Facteur
            </h1>
            <p className="text-sm text-slate-500 max-w-[280px]">
              Entrez le code à 6 chiffres généré par votre application d'authentification.
            </p>
          </div>

          <form onSubmit={handleStep2Submit} className="space-y-8 flex-1 flex flex-col justify-center">
            <div className="step-anim flex justify-center sm:justify-start gap-2">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => {
                    otpRefs.current[idx] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                  className="w-10 h-14 sm:w-12 sm:h-16 rounded-xl border-2 border-blue-200 bg-transparent text-center text-xl font-bold text-blue-900 outline-none transition-all focus:border-blue-500"
                />
              ))}
            </div>

            {error && (
              <div className="step-anim rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-600 text-center font-medium">
                {error}
              </div>
            )}

            <div className="step-anim pt-4">
              <button
                type="submit"
                disabled={isLoading || otp.join("").length < 6}
                className="w-full rounded-xl bg-blue-500 hover:bg-blue-600 py-4 font-bold text-white transition-all shadow-[0_8px_20px_-8px_rgba(59,130,246,0.6)] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>Vérifier <ArrowRight className="h-5 w-5" /></>
                )}
              </button>
              
              <button 
                type="button"
                onClick={() => { setActiveTab("credentials"); setOtp(["", "", "", "", "", ""]); }}
                className="w-full mt-4 py-2 text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
