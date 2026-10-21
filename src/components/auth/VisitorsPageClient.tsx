"use client";

import type { CSSProperties } from "react";
import { VisitorsRegistration } from "@/components/auth/VisitorsRegistration";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { avecEcole, couleursMarque, type MarqueEcole } from "@/lib/site-ecole";

export default function VisitorsPageClient({ marque = null }: { marque?: MarqueEcole | null }) {
  return (
    <div style={couleursMarque(marque) as CSSProperties} className="flex min-h-screen w-full relative bg-[#FDF8F0] overflow-hidden">

      {/* GAUCHE : FORMULAIRE */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center relative px-6 sm:px-12 md:px-24 py-12 z-10">
        <div className="absolute top-8 left-6 sm:left-12 flex items-center">
          <Link href={avecEcole("/connexion", marque)} className="text-navy-700 hover:text-navy-900 flex items-center gap-2 text-sm font-semibold transition-colors">
            <ArrowLeft className="h-4 w-4" /> Retour au portail
          </Link>
        </div>
        <div className="w-full max-w-md mx-auto">
          <VisitorsRegistration marque={marque} />
        </div>
      </div>

      {/* DROITE : BANDEAU */}
      <div
        className="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-500 to-orange-400 rounded-l-[4rem] flex-col items-center justify-center relative overflow-hidden shadow-[-20px_0_50px_rgba(249,115,22,0.15)]"
        style={marque ? { background: "linear-gradient(150deg, var(--ec-from), var(--ec-to))" } : undefined}
      >
        {!marque && (
          <>
            <div className="absolute top-[-20%] right-[-10%] w-96 h-96 bg-blue-600/30 rounded-full blur-[80px]" />
            <div className="absolute bottom-[-20%] left-[-10%] w-96 h-96 bg-amber-500/10 rounded-full blur-[80px]" />
          </>
        )}

        <div className="relative z-10 text-center px-12">
          <h2 className="font-display text-5xl font-bold text-white mb-4">
            Bienvenue dans<br /><span className={marque ? "text-white/85" : "text-orange-200"}>l&apos;Espace Familles</span>
          </h2>
          <p className="text-white/90 mb-8 max-w-md mx-auto text-lg leading-relaxed">
            {marque
              ? `Suivez la scolarité de vos enfants au ${marque.nomComplet} : notes, bulletins, absences et paiements.`
              : "Suivez la scolarité de vos enfants, consultez les bulletins et gérez vos paiements en toute simplicité."}
          </p>

          <div className="flex flex-col items-center gap-4">
            <p className="text-sm text-white/80">Vous n&apos;avez pas de compte parent ?</p>
            <Link
              href={marque ? `/ecoles/${marque.slug}/preinscription` : "/sections/preinscription"}
              className="px-8 py-3 rounded-full border-2 border-white/30 text-white font-bold hover:bg-white hover:text-navy-900 transition-all duration-300"
            >
              Faire une préinscription
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
