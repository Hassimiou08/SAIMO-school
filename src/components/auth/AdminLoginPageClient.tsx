"use client";

import type { CSSProperties } from "react";
import { AdminLoginForm } from "@/components/auth/AdminLoginForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { avecEcole, couleursMarque, type MarqueEcole } from "@/lib/site-ecole";
import { Lueurs } from "@/components/ecole/EcoleUi";

export default function AdminLoginPageClient({ marque = null }: { marque?: MarqueEcole | null }) {
  return (
    <div style={couleursMarque(marque) as CSSProperties} className="flex min-h-screen w-full relative bg-[#FDF8F0] overflow-hidden">

      {/* GAUCHE : FORMULAIRE */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center relative px-6 sm:px-12 md:px-24 py-12 z-10">
        <div className="absolute top-8 left-6 sm:left-12 flex items-center">
          <Link href={avecEcole("/connexion", marque)} className="text-[var(--ec-primary,#2563EB)] hover:opacity-80 flex items-center gap-2 text-sm font-semibold transition-colors">
            <ArrowLeft className="h-4 w-4" /> Retour au portail
          </Link>
        </div>
        <div className="w-full max-w-md mx-auto">
          <AdminLoginForm marque={marque} />
        </div>
      </div>

      {/* DROITE : BANDEAU */}
      <div
        className="hidden lg:flex w-1/2 bg-blue-600 rounded-l-[4rem] flex-col items-center justify-center relative overflow-hidden shadow-[-20px_0_50px_rgba(37,99,235,0.15)]"
        style={marque ? { background: "var(--ec-primary)" } : undefined}
      >
        {marque && <Lueurs />}
        {!marque && (
          <>
            <div className="absolute top-[-20%] right-[-10%] w-96 h-96 bg-blue-500 rounded-full blur-[80px]" />
            <div className="absolute bottom-[-20%] left-[-10%] w-96 h-96 bg-teal-500/30 rounded-full blur-[80px]" />
          </>
        )}

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[15rem] font-black text-white/5 whitespace-nowrap pointer-events-none select-none">
          {marque?.nomCourt ?? "SAIMO"}
        </div>

        <div className="relative z-10 text-center px-12">
          <h2 className="font-display text-5xl font-bold text-white mb-4">
            Bienvenue dans l&apos;espace <span className={marque ? "text-white/80" : "text-orange-400"}>Personnel !</span>
          </h2>
          <p className="text-white/80 mb-8 max-w-md mx-auto text-lg leading-relaxed">
            {marque
              ? `Direction, enseignants, comptabilité et administration du ${marque.nomComplet} : connectez-vous avec vos identifiants.`
              : "Veuillez entrer vos identifiants pour accéder au portail d'administration sécurisé de l'établissement."}
          </p>

          <div className="flex flex-col items-center gap-4">
            <p className="text-sm text-white/70">Vous n&apos;avez pas de compte professionnel ?</p>
            <Link
              href={marque ? `/ecoles/${marque.slug}/contact` : "/sections/contact"}
              className={`px-8 py-3 rounded-full border-2 font-bold transition-all duration-300 ${
                marque
                  ? "border-white/40 text-white hover:bg-white hover:text-navy-900"
                  : "border-orange-400 text-orange-400 hover:bg-orange-400 hover:text-white"
              }`}
            >
              {marque ? "Contacter l'administration" : "Contacter le support"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
