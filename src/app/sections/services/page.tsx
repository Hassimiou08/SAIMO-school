"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  Utensils,
  Bus,
  Shirt,
  Stethoscope,
  BookOpen,
  Trophy,
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from "lucide-react";
import Link from "next/link";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ServicesPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero Animation
      gsap.fromTo(".hero-el",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: "power3.out" }
      );
      
      // Featured Services Animation
      gsap.fromTo(".featured-card",
        { opacity: 0, y: 40 },
        { 
          opacity: 1, y: 0, duration: 0.8, stagger: 0.2, ease: "power2.out",
          scrollTrigger: { trigger: ".featured-section", start: "top 75%" }
        }
      );
      
      // Grid Services Animation
      gsap.fromTo(".service-card",
        { opacity: 0, scale: 0.95 },
        { 
          opacity: 1, scale: 1, duration: 0.6, stagger: 0.1, ease: "power2.out",
          scrollTrigger: { trigger: ".grid-section", start: "top 75%" }
        }
      );

      // Bottom CTA Animation
      gsap.fromTo(".cta-el",
        { opacity: 0, y: 30 },
        { 
          opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: "back.out(1.2)",
          scrollTrigger: { trigger: ".cta-section", start: "top 85%" }
        }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen bg-paper-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative pt-32 pb-48 overflow-hidden">
          {/* Premium Background Image with Overlay */}
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=2000&q=80" 
              alt="Services et infrastructures SAIMO" 
              className="w-full h-full object-cover animate-fade-in"
            />
            <div className="absolute inset-0 bg-navy-950/85 backdrop-blur-[2px]" />
            <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-paper-100 to-transparent" />
            
            {/* Subtle Brand Accents */}
            <div className="absolute top-0 left-0 w-[50%] h-[100%] rounded-full bg-blue-500/10 blur-[120px]" />
            <div className="absolute bottom-0 right-0 w-[50%] h-[100%] rounded-full bg-orange-500/10 blur-[120px]" />
          </div>
          
          <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
            <span className="hero-el inline-block px-4 py-1.5 rounded-full bg-white/10 text-white text-xs font-bold uppercase tracking-wider mb-6 border border-white/20 backdrop-blur-md shadow-sm">
              Services & Vie Scolaire
            </span>
            <h1 className="hero-el font-display text-4xl md:text-5xl lg:text-7xl font-extrabold text-white mb-6 leading-tight">
              Plus qu'une école, <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-orange-400">un écosystème complet</span>
            </h1>
            <p className="hero-el text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
              Nous offrons un ensemble de services premium pensés pour le bien-être de vos enfants et la tranquillité d'esprit des parents.
            </p>
          </div>
        </section>

        {/* FEATURED SERVICES (CANTINE & TRANSPORT) - Pulling up over the hero */}
        <section className="featured-section relative z-20 -mt-20 px-6 max-w-7xl mx-auto mb-24">
          <div className="grid md:grid-cols-2 gap-8">
            
            {/* CANTINE */}
            <div className="featured-card bg-white rounded-[2.5rem] p-8 md:p-12 shadow-[0_20px_50px_-20px_rgba(15,42,74,0.1)] border border-neutral-100 flex flex-col group hover:-translate-y-2 transition-transform duration-500 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-orange-500/5 rounded-bl-full transition-transform group-hover:scale-110 duration-700" />
              
              <div className="h-16 w-16 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center mb-8 shrink-0 relative z-10">
                <Utensils className="h-8 w-8 text-orange-500" />
              </div>
              
              <h2 className="font-display text-3xl font-bold text-navy-900 mb-4 relative z-10">Restaurant Scolaire</h2>
              <p className="text-slate-600 leading-relaxed mb-8 relative z-10 flex-1">
                Des repas équilibrés, préparés sur place par notre chef cuisinier. Menus validés par un nutritionniste, avec des produits frais et locaux pour garantir l'énergie nécessaire à une journée d'apprentissage.
              </p>
              
              <div className="space-y-3 relative z-10">
                <div className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-orange-500"/><span className="text-sm font-medium text-slate-700">Menus diététiques & variés</span></div>
                <div className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-orange-500"/><span className="text-sm font-medium text-slate-700">Contrôle d'hygiène rigoureux</span></div>
                <div className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-orange-500"/><span className="text-sm font-medium text-slate-700">Prise en compte des allergies</span></div>
              </div>
            </div>

            {/* TRANSPORT */}
            <div className="featured-card bg-white rounded-[2.5rem] p-8 md:p-12 shadow-[0_20px_50px_-20px_rgba(15,42,74,0.1)] border border-neutral-100 flex flex-col group hover:-translate-y-2 transition-transform duration-500 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-blue-600/5 rounded-bl-full transition-transform group-hover:scale-110 duration-700" />
              
              <div className="h-16 w-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center mb-8 shrink-0 relative z-10">
                <Bus className="h-8 w-8 text-blue-600" />
              </div>
              
              <h2 className="font-display text-3xl font-bold text-navy-900 mb-4 relative z-10">Transport Sécurisé</h2>
              <p className="text-slate-600 leading-relaxed mb-8 relative z-10 flex-1">
                Une flotte de bus modernes climatisés, desservant les principaux axes de la ville. Chauffeurs professionnels et accompagnatrices à bord pour assurer la sécurité de vos enfants du domicile à l'école.
              </p>
              
              <div className="space-y-3 relative z-10">
                <div className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-blue-600"/><span className="text-sm font-medium text-slate-700">Flotte de bus climatisés</span></div>
                <div className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-blue-600"/><span className="text-sm font-medium text-slate-700">Accompagnatrices dédiées</span></div>
                <div className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-blue-600"/><span className="text-sm font-medium text-slate-700">Itinéraires optimisés</span></div>
              </div>
            </div>

          </div>
        </section>

        {/* OTHER SERVICES GRID */}
        <section className="grid-section py-24 bg-white border-y border-neutral-200 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-display text-4xl font-bold text-navy-900 mb-4">Infrastructures & Avantages</h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Tout est pensé pour que votre enfant évolue dans un cadre sécurisé, stimulant et épanouissant.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {[
                { title: "Tenues & Uniformes", desc: "Des uniformes élégants et confortables, renforçant le sentiment d'appartenance et l'égalité entre les élèves.", icon: <Shirt className="h-7 w-7 text-indigo-600"/>, bg: "bg-indigo-50", color: "indigo" },
                { title: "Infirmerie Médicale", desc: "Une infirmière diplômée présente à plein temps pour les premiers soins et le suivi médical régulier.", icon: <Stethoscope className="h-7 w-7 text-red-500"/>, bg: "bg-red-50", color: "red" },
                { title: "Bibliothèque", desc: "Un espace calme et inspirant avec des milliers d'ouvrages en français et en anglais pour cultiver l'amour de la lecture.", icon: <BookOpen className="h-7 w-7 text-amber-500"/>, bg: "bg-amber-50", color: "amber" },
                { title: "Activités Sportives", desc: "Terrains multisports et encadrement professionnel pour développer l'esprit d'équipe et la motricité.", icon: <Trophy className="h-7 w-7 text-emerald-600"/>, bg: "bg-emerald-50", color: "emerald" },
                { title: "Sécurité Maximale", desc: "Campus clôturé, vidéosurveillance 24/7 et agents de sécurité qualifiés aux accès.", icon: <ShieldCheck className="h-7 w-7 text-slate-700"/>, bg: "bg-slate-100", color: "slate" },
                { title: "Clubs Pédagogiques", desc: "Club échecs, coding, théâtre, art plastique... Des activités extrascolaires pour tous les talents.", icon: <Utensils className="h-7 w-7 text-fuchsia-600"/>, bg: "bg-fuchsia-50", color: "fuchsia" },
              ].map((svc, i) => (
                <div key={i} className="service-card p-8 rounded-3xl bg-paper-50 border border-neutral-100 hover:shadow-lg hover:border-neutral-200 transition-all group">
                  <div className={`h-14 w-14 rounded-2xl ${svc.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    {svc.icon}
                  </div>
                  <h3 className="font-bold text-navy-900 text-xl mb-3">{svc.title}</h3>
                  <p className="text-slate-600 leading-relaxed text-sm">{svc.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* BOTTOM CTA */}
        <section className="cta-section py-24 bg-paper-100 text-center px-6">
          <div className="mx-auto max-w-3xl">
            <h2 className="cta-el font-display text-3xl font-bold text-navy-900 mb-6">Convaincu par notre cadre d'excellence ?</h2>
            <p className="cta-el text-lg text-slate-600 mb-10">
              Ces services sont disponibles en option lors de l'inscription de votre enfant.
            </p>
            <div className="cta-el flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                href="/sections/preinscription" 
                className="inline-flex justify-center items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-orange-500 px-8 py-4 text-lg font-bold text-white shadow-lg transition-all hover:scale-105 hover:shadow-[0_20px_40px_-15px_rgba(249,115,22,0.6)]"
              >
                Préinscrire mon enfant
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link 
                href="/sections/contact" 
                className="inline-flex justify-center items-center gap-2 rounded-2xl bg-white border border-neutral-200 px-8 py-4 text-lg font-bold text-navy-900 shadow-sm transition-all hover:bg-neutral-50 hover:shadow-md hover:-translate-y-1"
              >
                Nous contacter
              </Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
