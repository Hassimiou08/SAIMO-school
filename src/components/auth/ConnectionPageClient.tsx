"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ShieldCheck, Users, ArrowRight, Home } from "lucide-react";

export default function ConnectionPageClient() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Left side text animation
      gsap.fromTo(".left-el",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: "power3.out" }
      );
      
      // Right side cards animation
      gsap.fromTo(".portal-card",
        { opacity: 0, x: 40 },
        { opacity: 1, x: 0, duration: 0.8, stagger: 0.15, delay: 0.3, ease: "power2.out" }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen flex w-full font-sans bg-paper-100">
      
      {/* LEFT SIDE: BRANDING & VISUALS */}
      <div className="hidden lg:flex w-[45%] bg-navy-950 relative overflow-hidden flex-col justify-between p-12 text-white">
        {/* Background Effects */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80" 
            alt="Campus" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-navy-950/80 via-navy-950/90 to-navy-950" />
          {/* Orbs */}
          <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-600/30 rounded-full blur-[100px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-orange-500/20 rounded-full blur-[100px]" />
        </div>

        {/* Top Logo */}
        <div className="relative z-10 left-el">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-orange-500 text-white shadow-lg transition-transform group-hover:scale-105">
              <span className="font-display font-bold">S</span>
            </div>
            <span className="font-display text-2xl font-bold tracking-tight text-white">SAIMO</span>
          </Link>
        </div>

        {/* Center Content */}
        <div className="relative z-10 max-w-lg mt-10">
          <span className="left-el inline-block uppercase text-[10px] sm:text-xs font-bold tracking-wider text-blue-300 border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 rounded-full mb-6 backdrop-blur-md">
            Portail Sécurisé
          </span>
          <h1 className="left-el font-display text-4xl lg:text-5xl font-bold mb-6 leading-tight">
            Bienvenue dans <br/> l'écosystème <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-orange-400">SAIMO</span>
          </h1>
          <p className="left-el text-lg text-blue-100/80 leading-relaxed mb-8">
            Accédez à vos outils de gestion, consultez les résultats scolaires, gérez la comptabilité et suivez l'évolution de la vie scolaire en toute simplicité.
          </p>
        </div>

        {/* Bottom Credits */}
        <div className="relative z-10 left-el text-sm text-blue-200/50">
          &copy; {new Date().getFullYear()} SAIMO Guinée. Tous droits réservés.
        </div>
      </div>

      {/* RIGHT SIDE: PORTAL SELECTION */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 md:p-12 lg:p-24 relative">
        
        {/* Mobile Logo */}
        <div className="lg:hidden absolute top-8 left-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-orange-500 text-white">
              <span className="font-display font-bold text-sm">S</span>
            </div>
            <span className="font-display text-xl font-bold text-navy-900">SAIMO</span>
          </Link>
        </div>

        <div className="w-full max-w-3xl">
          <div className="mb-12 text-center lg:text-left">
            <h2 className="font-display text-3xl font-bold text-navy-900 mb-3">Connexion</h2>
            <p className="text-slate-500">Veuillez sélectionner votre portail d'accès pour continuer vers l'espace sécurisé.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* ADMIN / PERSONNEL PORTAL */}
            <Link 
              href="/connexion/administrations" 
              className="portal-card group flex flex-col bg-white p-8 rounded-3xl border border-neutral-200 shadow-sm hover:shadow-2xl hover:border-blue-300 transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute -right-6 -top-6 w-32 h-32 bg-blue-50 rounded-full blur-3xl group-hover:bg-blue-100 transition-colors" />
              
              <div className="h-16 w-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-blue-600 transition-all duration-300 relative z-10">
                <ShieldCheck className="h-8 w-8 text-blue-600 group-hover:text-white transition-colors" />
              </div>
              
              <div className="relative z-10 flex-1">
                <h3 className="font-bold text-navy-900 text-xl mb-2 group-hover:text-blue-600 transition-colors">Portail Personnel</h3>
                <p className="text-sm text-slate-500 leading-relaxed mb-6">Direction, Enseignants, Comptabilité et équipe administrative.</p>
              </div>

              <div className="relative z-10 flex items-center text-sm font-bold text-blue-600">
                <span>Accès personnel sécurisé</span>
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-2 transition-transform" />
              </div>
            </Link>

            {/* PARENT / ELEVE PORTAL */}
            <Link 
              href="/connexion/visiteurs" 
              className="portal-card group flex flex-col bg-white p-8 rounded-3xl border border-neutral-200 shadow-sm hover:shadow-2xl hover:border-orange-300 transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute -right-6 -top-6 w-32 h-32 bg-orange-50 rounded-full blur-3xl group-hover:bg-orange-100 transition-colors" />
              
              <div className="h-16 w-16 rounded-2xl bg-orange-50 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-orange-500 transition-all duration-300 relative z-10">
                <Users className="h-8 w-8 text-orange-500 group-hover:text-white transition-colors" />
              </div>
              
              <div className="relative z-10 flex-1">
                <h3 className="font-bold text-navy-900 text-xl mb-2 group-hover:text-orange-600 transition-colors">Parent ou Élève</h3>
                <p className="text-sm text-slate-500 leading-relaxed mb-6">Espace personnel simplifié pour le suivi scolaire et les finances.</p>
              </div>

              <div className="relative z-10 flex items-center text-sm font-bold text-orange-500">
                <span>Connexion familles</span>
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-2 transition-transform" />
              </div>
            </Link>

          </div>

          <div className="mt-12 text-center lg:text-left">
            <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-navy-900 transition-colors">
              <Home className="h-4 w-4" />
              Retour au site public
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
