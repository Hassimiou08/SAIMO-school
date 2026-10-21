"use client";

import Link from "next/link";
import { useEffect, useRef, type CSSProperties } from "react";
import { gsap } from "gsap";
import { ShieldCheck, Users, ArrowRight, Home } from "lucide-react";
import { avecEcole, couleursMarque, type MarqueEcole } from "@/lib/site-ecole";
import { EcoleLogo } from "@/components/ecole/EcoleUi";

/**
 * Choix du portail (personnel ou familles). Sans `marque`, page SAIMO ;
 * avec `marque` (arrivée depuis le site d'une école), page aux couleurs de l'école.
 */
export default function ConnectionPageClient({ marque = null }: { marque?: MarqueEcole | null }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const accueil = marque ? `/ecoles/${marque.slug}` : "/";

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".left-el",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: "power3.out" }
      );
      gsap.fromTo(".portal-card",
        { opacity: 0, x: 40 },
        { opacity: 1, x: 0, duration: 0.8, stagger: 0.15, delay: 0.3, ease: "power2.out" }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      style={couleursMarque(marque) as CSSProperties}
      className="min-h-screen flex w-full font-sans bg-paper-100"
    >
      {/* GAUCHE : IDENTITÉ */}
      <div className="hidden lg:flex w-[45%] bg-navy-950 relative overflow-hidden flex-col justify-between p-12 text-white">
        <div className="absolute inset-0 z-0">
          {marque ? (
            <div
              className="absolute inset-0"
              style={{ background: "linear-gradient(150deg, var(--ec-to), var(--ec-from) 40%, #081221 90%)" }}
            />
          ) : (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80"
                alt="Campus"
                className="w-full h-full object-cover opacity-20"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-navy-950/80 via-navy-950/90 to-navy-950" />
              <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-600/30 rounded-full blur-[100px]" />
              <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-orange-500/20 rounded-full blur-[100px]" />
            </>
          )}
        </div>

        <div className="relative z-10 left-el">
          <Link href={accueil} className="inline-flex items-center gap-3 group">
            {marque ? (
              <EcoleLogo logo={marque.logo} nom={marque.nomCourt} taille={48} />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-orange-500 text-white shadow-lg transition-transform group-hover:scale-105">
                <span className="font-display font-bold">S</span>
              </div>
            )}
            <span className="font-display text-2xl font-bold tracking-tight text-white">{marque?.nomCourt ?? "SAIMO"}</span>
          </Link>
        </div>

        <div className="relative z-10 max-w-lg mt-10">
          <span
            className={`left-el inline-block uppercase text-[10px] sm:text-xs font-bold tracking-wider px-4 py-1.5 rounded-full mb-6 backdrop-blur-md border ${
              marque ? "text-white/80 border-white/20 bg-white/10" : "text-blue-300 border-blue-500/30 bg-blue-500/10"
            }`}
          >
            {marque ? "Espace sécurisé de l'école" : "Portail Sécurisé"}
          </span>
          {marque ? (
            <>
              <h1 className="left-el font-display text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                Bienvenue au <br /> {marque.nomComplet}
              </h1>
              <p className="left-el text-lg text-white/80 leading-relaxed mb-6">
                Personnel, parents et élèves : retrouvez les notes, les bulletins, les absences et les paiements de l&apos;école.
              </p>
              {marque.deviseEcole && (
                <p className="left-el text-white/80">
                  Notre devise : <strong className="font-display text-white">{marque.deviseEcole}</strong>
                </p>
              )}
            </>
          ) : (
            <>
              <h1 className="left-el font-display text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                Bienvenue dans <br/> l&apos;écosystème <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-orange-400">SAIMO</span>
              </h1>
              <p className="left-el text-lg text-blue-100/80 leading-relaxed mb-8">
                Accédez à vos outils de gestion, consultez les résultats scolaires, gérez la comptabilité et suivez l&apos;évolution de la vie scolaire en toute simplicité.
              </p>
            </>
          )}
        </div>

        <div className="relative z-10 left-el text-sm text-white/50">
          {marque ? (
            <>&copy; {new Date().getFullYear()} {marque.nomComplet} · Plateforme SAIMO</>
          ) : (
            <>&copy; {new Date().getFullYear()} SAIMO Guinée. Tous droits réservés.</>
          )}
        </div>
      </div>

      {/* DROITE : CHOIX DU PORTAIL */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 md:p-12 lg:p-24 relative">
        <div className="lg:hidden absolute top-8 left-8">
          <Link href={accueil} className="inline-flex items-center gap-2">
            {marque ? (
              <EcoleLogo logo={marque.logo} nom={marque.nomCourt} taille={36} />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-orange-500 text-white">
                <span className="font-display font-bold text-sm">S</span>
              </div>
            )}
            <span className="font-display text-xl font-bold text-navy-900">{marque?.nomCourt ?? "SAIMO"}</span>
          </Link>
        </div>

        <div className="w-full max-w-3xl pt-16 lg:pt-0">
          <div className="mb-12 text-center lg:text-left">
            <h2 className="font-display text-3xl font-bold text-navy-900 mb-3">Connexion</h2>
            <p className="text-slate-500">Veuillez sélectionner votre portail d&apos;accès pour continuer vers l&apos;espace sécurisé.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link
              href={avecEcole("/connexion/administrations", marque)}
              className="portal-card group flex flex-col bg-white p-8 rounded-3xl border border-neutral-200 shadow-sm hover:shadow-2xl hover:border-[var(--ec-primary,#93C5FD)] transition-all duration-300 relative overflow-hidden"
            >
              <div className="h-16 w-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-[var(--ec-primary,#2563EB)] transition-all duration-300 relative z-10">
                <ShieldCheck className="h-8 w-8 text-[var(--ec-primary,#2563EB)] group-hover:text-white transition-colors" />
              </div>
              <div className="relative z-10 flex-1">
                <h3 className="font-bold text-navy-900 text-xl mb-2">Portail Personnel</h3>
                <p className="text-sm text-slate-500 leading-relaxed mb-6">Direction, Enseignants, Comptabilité et équipe administrative.</p>
              </div>
              <div className="relative z-10 flex items-center text-sm font-bold text-[var(--ec-primary,#2563EB)]">
                <span>Accès personnel sécurisé</span>
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-2 transition-transform" />
              </div>
            </Link>

            <Link
              href={avecEcole("/connexion/visiteurs", marque)}
              className="portal-card group flex flex-col bg-white p-8 rounded-3xl border border-neutral-200 shadow-sm hover:shadow-2xl hover:border-orange-300 transition-all duration-300 relative overflow-hidden"
            >
              <div className="h-16 w-16 rounded-2xl bg-orange-50 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-orange-500 transition-all duration-300 relative z-10">
                <Users className="h-8 w-8 text-orange-500 group-hover:text-white transition-colors" />
              </div>
              <div className="relative z-10 flex-1">
                <h3 className="font-bold text-navy-900 text-xl mb-2">Parent ou Élève</h3>
                <p className="text-sm text-slate-500 leading-relaxed mb-6">Espace personnel simplifié pour le suivi scolaire et les finances.</p>
              </div>
              <div className="relative z-10 flex items-center text-sm font-bold text-orange-500">
                <span>Connexion familles</span>
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-2 transition-transform" />
              </div>
            </Link>
          </div>

          <div className="mt-12 text-center lg:text-left">
            <Link href={accueil} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-navy-900 transition-colors">
              <Home className="h-4 w-4" />
              {marque ? `Retour au site du ${marque.nomCourt}` : "Retour au site public"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
