"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FormulairePreinscription } from "@/components/ecole/FormulairePreinscription";
import {
  ShieldCheck,
  Clock,
  Users,
  Wallet,
  Sparkles,
  Medal,
  ArrowRight,
  Globe,
  Microscope,
  Palette,
  MonitorPlay
} from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function PreinscriptionPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero Animation
      gsap.fromTo(
        ".hero-el",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: "power3.out" }
      );

      // Features Cards Animation
      gsap.fromTo(
        ".feat-card",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, delay: 0.4, ease: "back.out(1.5)" }
      );

      // Form Container Animation
      gsap.fromTo(
        ".form-container",
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1, delay: 0.6, ease: "power3.out" }
      );

      // Pricing Section Animation (Using fromTo for safety in React 18)
      gsap.fromTo(".pricing-header", 
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out", scrollTrigger: { trigger: ".pricing-section", start: "top 85%" } }
      );

      gsap.fromTo(".pricing-row", 
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.6, stagger: 0.1, ease: "power2.out", scrollTrigger: { trigger: ".pricing-section", start: "top 75%" } }
      );

      // Pedagogy Cards Animation
      gsap.fromTo(
        ".pedagogy-card",
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 0.8, stagger: 0.2, ease: "back.out(1.2)",
          scrollTrigger: {
            trigger: ".pedagogy-section",
            start: "top 80%",
          }
        }
      );

      // CTA Animation
      gsap.fromTo(
        ".cta-el",
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: "power2.out",
          scrollTrigger: {
            trigger: ".cta-section",
            start: "top 80%",
          }
        }
      );

    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen bg-paper-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 pt-20 pb-16">
        {/* HERO SECTION */}
        <section className="relative px-6 pb-10 overflow-hidden">
          {/* SAIMO style glowing background blobs */}
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[100%] rounded-full bg-blue-600/5 blur-[120px] pointer-events-none" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[100%] rounded-full bg-orange-500/5 blur-[120px] pointer-events-none" />
          
          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <span className="hero-el inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-4">
              <Sparkles className="h-4 w-4 text-orange-500" /> ANNÉE SCOLAIRE 2026 — 2027
            </span>
            
            <h1 className="hero-el font-display text-4xl sm:text-5xl md:text-6xl font-extrabold text-navy-900 mb-4 tracking-tight leading-tight">
              Pré-inscription <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-orange-500">en ligne</span>
            </h1>
            
            <p className="hero-el text-base md:text-lg text-slate-600 max-w-3xl mx-auto mb-10 leading-relaxed">
              Soumettez votre demande en quelques minutes. Vous pouvez inscrire <strong className="text-navy-900">plusieurs enfants</strong> en une seule demande. Réponse de notre équipe sous <strong className="text-navy-900">48 h ouvrées</strong>.
            </p>

            {/* Feature Cards (SAIMO Style) */}
            <div className="flex flex-wrap justify-center gap-3 md:gap-4 mb-10">
              <div className="feat-card bg-white rounded-2xl p-6 shadow-sm border border-neutral-100 flex flex-col items-center gap-3 min-w-[160px] hover:shadow-md transition-shadow">
                <div className="h-12 w-12 rounded-full bg-green-50 flex items-center justify-center text-green-600 mb-2">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <span className="text-sm font-bold text-navy-900">Données sécurisées</span>
              </div>
              <div className="feat-card bg-white rounded-2xl p-6 shadow-sm border border-neutral-100 flex flex-col items-center gap-3 min-w-[160px] hover:shadow-md transition-shadow">
                <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 mb-2">
                  <Clock className="h-6 w-6" />
                </div>
                <span className="text-sm font-bold text-navy-900">Réponse sous 48 h</span>
              </div>
              <div className="feat-card bg-white rounded-2xl p-6 shadow-sm border border-neutral-100 flex flex-col items-center gap-3 min-w-[160px] hover:shadow-md transition-shadow">
                <div className="h-12 w-12 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 mb-2">
                  <Users className="h-6 w-6" />
                </div>
                <span className="text-sm font-bold text-navy-900">Plusieurs enfants</span>
              </div>
              <div className="feat-card bg-white rounded-2xl p-6 shadow-sm border border-neutral-100 flex flex-col items-center gap-3 min-w-[160px] hover:shadow-md transition-shadow">
                <div className="h-12 w-12 rounded-full bg-teal-50 flex items-center justify-center text-teal-600 mb-2">
                  <Wallet className="h-6 w-6" />
                </div>
                <span className="text-sm font-bold text-navy-900">Paiement flexible</span>
              </div>
            </div>
          </div>
        </section>

        {/* MULTISTEP FORM SECTION - SIDE BY SIDE LAYOUT */}
        <section className="px-6 pb-24 relative z-20">
          <div className="form-container max-w-6xl mx-auto bg-white rounded-[2rem] shadow-[0_20px_50px_-20px_rgba(15,42,74,0.1)] border border-neutral-100 overflow-hidden">
            
            <FormulairePreinscription accueilHref="/" />
        </div>
        </section>

        {/* TARIFICATION TABLE SECTION */}
        <section className="pricing-section py-24 relative bg-paper-50 border-y border-neutral-200 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="pricing-header text-center mb-16">
              <span className="inline-block uppercase text-[10px] sm:text-xs font-bold tracking-wider text-orange-600 border border-orange-200 bg-orange-50 px-4 py-1.5 rounded-full mb-4 shadow-sm">
                Tarification Transparente
              </span>
              <h2 className="font-display text-3xl md:text-5xl font-bold text-navy-900 mb-4">Nos frais de scolarité <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-yellow-500">2026 — 2027</span></h2>
              <p className="text-slate-600 text-base md:text-lg max-w-2xl mx-auto">Frais d'inscription unique + scolarité annuelle. Possibilité de paiement échelonné pour plus de flexibilité.</p>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-[2.5rem] shadow-[0_20px_50px_-20px_rgba(15,42,74,0.05)] border border-neutral-200 p-4 md:p-8">
              <div className="space-y-4">
                {/* Table Header (Desktop only) */}
                <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <div className="col-span-5">Cycle & Classes</div>
                  <div className="col-span-4 text-right">Nouvelle Inscription</div>
                  <div className="col-span-3 text-right">Réinscription</div>
                </div>

                {/* Pricing Rows - Individual Cards */}
                {[
                  { icon: "🤍", name: "Maternelle", classes: "Crèche, Petite & Grande Section", priceNew: "5 800 000 GNF", priceRe: "5 600 000 GNF", color: "text-red-600", bg: "bg-red-50", border: "border-red-100" },
                  { icon: "🌐", name: "Primaire", classes: "CP1, CP2, CE1, CE2, CM1", priceNew: "6 300 000 GNF", priceRe: "6 100 000 GNF", color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100" },
                  { icon: "🏆", name: "Examen Primaire", classes: "CM2 (6ème Année)", priceNew: "8 300 000 GNF", priceRe: "7 100 000 GNF", color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100", highlight: true },
                  { icon: "🧠", name: "Collège", classes: "7ème, 8ème, 9ème Année", priceNew: "7 800 000 GNF", priceRe: "7 600 000 GNF", color: "text-orange-500", bg: "bg-orange-50", border: "border-orange-100" },
                  { icon: "🏅", name: "Examen Collège", classes: "10ème Année", priceNew: "9 800 000 GNF", priceRe: "8 600 000 GNF", color: "text-orange-500", bg: "bg-orange-50", border: "border-orange-100", highlight: true },
                  { icon: "⚡", name: "Lycée", classes: "11ème & 12ème Année", priceNew: "8 300 000 GNF", priceRe: "8 100 000 GNF", color: "text-teal-600", bg: "bg-teal-50", border: "border-teal-100" },
                  { icon: "🎓", name: "Examen Lycée", classes: "Terminale", priceNew: "10 300 000 GNF", priceRe: "9 100 000 GNF", color: "text-teal-600", bg: "bg-teal-50", border: "border-teal-100", highlight: true },
                ].map((row, i) => (
                  <div key={i} className={`pricing-row relative grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-white border ${row.highlight ? 'border-orange-200 shadow-md' : 'border-neutral-200 shadow-sm'} rounded-2xl p-4 md:p-5 hover:shadow-lg hover:scale-[1.01] transition-all duration-300`}>
                    {row.highlight && <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-10 bg-orange-400 rounded-r-md" />}
                    
                    <div className="col-span-5 flex items-center gap-4">
                      <div className={`h-14 w-14 rounded-2xl ${row.bg} ${row.border} border flex items-center justify-center text-2xl shadow-sm shrink-0`}>
                        {row.icon}
                      </div>
                      <div>
                        <h4 className="font-display font-bold text-navy-900 text-lg">{row.name}</h4>
                        <p className="text-xs text-slate-500 font-medium">{row.classes}</p>
                      </div>
                    </div>
                    
                    <div className="col-span-4 flex justify-between md:justify-end items-center md:border-l border-neutral-100 md:pl-6">
                      <span className="md:hidden text-xs text-slate-400 font-bold uppercase">Nouvelle Insc.</span>
                      <span className="font-display font-bold text-navy-900 text-lg md:text-xl tracking-tight">{row.priceNew}</span>
                    </div>
                    
                    <div className="col-span-3 flex justify-between md:justify-end items-center md:border-l border-neutral-100 md:pl-6">
                      <span className="md:hidden text-xs text-slate-400 font-bold uppercase">Réinscription</span>
                      <span className={`font-display font-bold text-lg md:text-xl tracking-tight ${row.color}`}>{row.priceRe}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Table Footer attached directly inside the cadre */}
              <div className="pricing-row mt-8 bg-white border border-neutral-200 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center gap-6 shadow-sm">
                <div className="h-12 w-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                  <Wallet className="h-6 w-6"/>
                </div>
                <div>
                  <h4 className="font-bold text-navy-900 text-lg mb-1">Paiement échelonné disponible</h4>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Vous avez la possibilité de régler la scolarité par <strong>trimestre</strong> ou par <strong>mois</strong>. Des réductions exclusives sont appliquées automatiquement à partir du 2ème enfant inscrit (fratrie). Les frais de cantine, transport et tenues sont facturés séparément en option.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PEDAGOGIE SECTION */}
        <section className="pedagogy-section py-32 bg-paper-100 px-6 relative overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute top-20 left-[-10%] w-96 h-96 bg-blue-600/5 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-20 right-[-10%] w-96 h-96 bg-teal-500/5 rounded-full blur-[100px] pointer-events-none" />

          <div className="max-w-6xl mx-auto relative z-10">
            <div className="text-center mb-20">
              <span className="pedagogy-card inline-block uppercase text-xs font-bold tracking-wider text-blue-700 border border-blue-200 bg-blue-50 px-4 py-1.5 rounded-full mb-4 shadow-sm">
                Excellence Éducative
              </span>
              <h2 className="pedagogy-card font-display text-4xl md:text-5xl font-bold text-navy-900 mb-6">Une pédagogie <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-orange-500">complète</span></h2>
              <p className="pedagogy-card text-slate-600 text-lg max-w-2xl mx-auto">Un environnement stimulant où chaque enfant développe son plein potentiel à travers des méthodes modernes et adaptées.</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-6 md:gap-8">
              {[
                { title: "Bilinguisme Actif", desc: "Immersion totale avec le Français & l'Anglais maîtrisés dès la maternelle. Nos élèves pensent et parlent dans les deux langues.", icon: <Globe className="h-8 w-8 text-blue-600"/>, color: "bg-blue-50 border-blue-100", accent: "bg-blue-600" },
                { title: "Sciences & Tech", desc: "Laboratoires équipés et cours de code dès le primaire. Nous préparons nos élèves aux défis technologiques de demain.", icon: <Microscope className="h-8 w-8 text-orange-500"/>, color: "bg-orange-50 border-orange-100", accent: "bg-orange-500" },
                { title: "Arts & Culture", desc: "Théâtre, musique, dessin créatif et expression corporelle pour développer la sensibilité et la confiance en soi.", icon: <Palette className="h-8 w-8 text-teal-600"/>, color: "bg-teal-50 border-teal-100", accent: "bg-teal-600" },
                { title: "E-Learning Avancé", desc: "Plateforme interactive et contenus pédagogiques disponibles 24h/24 pour un suivi continu même à la maison.", icon: <MonitorPlay className="h-8 w-8 text-indigo-600"/>, color: "bg-indigo-50 border-indigo-100", accent: "bg-indigo-600" }
              ].map((card, i) => (
                <div key={i} className="pedagogy-card relative bg-white rounded-[2rem] p-8 md:p-10 shadow-[0_10px_40px_-10px_rgba(15,42,74,0.06)] border border-neutral-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group flex flex-col sm:flex-row gap-6 md:gap-8 items-start overflow-hidden cursor-pointer">
                  
                  {/* Decorative accent shape */}
                  <div className={`absolute top-0 right-0 w-32 h-32 ${card.accent} opacity-[0.03] rounded-bl-[100px] -mr-4 -mt-4 transition-transform group-hover:scale-110 duration-500`} />
                  
                  <div className={`h-20 w-20 shrink-0 rounded-[1.5rem] ${card.color} border flex items-center justify-center shadow-sm group-hover:rotate-6 transition-transform duration-300`}>
                    {card.icon}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-display font-bold text-navy-900 text-2xl mb-3 group-hover:text-blue-600 transition-colors">{card.title}</h3>
                    <p className="text-base text-slate-600 leading-relaxed mb-6">{card.desc}</p>
                    
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-400 group-hover:text-blue-600 transition-colors">
                      Découvrir le programme <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* BOTTOM CTA */}
        <section className="cta-section py-24 bg-navy-950 px-6 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
          <div className="absolute top-[-50%] left-[-10%] w-[50%] h-[200%] rounded-full bg-blue-600/20 blur-[100px] pointer-events-none" />
          <div className="absolute bottom-[-50%] right-[-10%] w-[50%] h-[200%] rounded-full bg-orange-500/20 blur-[100px] pointer-events-none" />
          
          <div className="relative z-10 max-w-3xl mx-auto">
            <div className="cta-el mx-auto h-16 w-16 rounded-full border border-orange-500/30 bg-orange-500/10 text-orange-400 flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(249,115,22,0.2)]">
              <Medal className="h-8 w-8" />
            </div>
            <h2 className="cta-el font-display text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Prêt à offrir le meilleur <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-300">à vos enfants ?</span>
            </h2>
            <p className="cta-el text-slate-300 text-lg mb-10 max-w-xl mx-auto">Commencez les démarches dès aujourd'hui pour sécuriser la place de votre enfant pour l'année scolaire 2026 — 2027.</p>
            <div className="cta-el flex flex-col sm:flex-row items-center justify-center gap-4">
              <button onClick={() => { window.scrollTo({ top: 0, behavior: "smooth" }); }} className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-10 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/30 hover:scale-105">
                S'INSCRIRE <ArrowRight className="h-5 w-5" />
              </button>
              <button className="w-full sm:w-auto bg-white/5 hover:bg-white/10 border border-white/20 text-white font-bold py-4 px-10 rounded-xl transition-all backdrop-blur-sm">
                NOUS CONTACTER
              </button>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
