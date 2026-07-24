"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  ShieldCheck,
  Clock,
  Users,
  Wallet,
  Sparkles,
  Camera,
  Utensils,
  Bus,
  Shirt,
  Medal,
  Download,
  UploadCloud,
  ChevronRight,
  ArrowRight,
  CheckCircle2,
  FileText,
  User,
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
  const [step, setStep] = useState(1);
  const [enfants, setEnfants] = useState([1]); // Mock array of children IDs
  const [activeEnfant, setActiveEnfant] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = () => {
    setIsSubmitted(true);
    window.scrollTo({ top: 300, behavior: "smooth" });
    // Animation de succès
    setTimeout(() => {
      gsap.fromTo(".success-el", { scale: 0.8, opacity: 0, y: 20 }, { scale: 1, opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "back.out(1.5)" });
    }, 100);
  };

  const handleAddEnfant = () => {
    setEnfants([...enfants, enfants.length + 1]);
    setActiveEnfant(enfants.length);
    // Petite animation sympa pour le nouvel onglet
    setTimeout(() => {
      gsap.fromTo(".enfant-tab-new", { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(2)" });
    }, 50);
  };

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

  const handleStepChange = (newStep: number) => {
    setStep(newStep);
    window.scrollTo({ top: 300, behavior: "smooth" });
    
    // Animate content change
    gsap.fromTo(
      ".step-content",
      { opacity: 0, x: newStep > step ? 30 : -30 },
      { opacity: 1, x: 0, duration: 0.5, ease: "power2.out" }
    );
    
    // Rafraîchir ScrollTrigger car la hauteur du formulaire change
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 500);
  };

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
            
            {isSubmitted ? (
              // ÉCRAN DE SUCCÈS
              <div className="p-12 md:p-24 text-center flex flex-col items-center justify-center min-h-[500px]">
                <div className="success-el h-24 w-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-green-600/20">
                  <CheckCircle2 className="h-12 w-12" />
                </div>
                <h2 className="success-el font-display text-4xl font-bold text-navy-900 mb-4">Demande envoyée avec succès !</h2>
                <p className="success-el text-slate-600 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
                  Nous avons bien reçu votre demande de pré-inscription pour <strong className="text-navy-900">{enfants.length} enfant(s)</strong>.
                  Notre équipe d'admission va examiner votre dossier et vous contactera sous <strong className="text-navy-900">48 heures ouvrées</strong>.
                </p>
                <div className="success-el flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                  <button className="bg-white border border-neutral-200 text-navy-900 font-bold py-3.5 px-8 rounded-xl hover:bg-paper-50 transition-colors shadow-sm flex items-center justify-center gap-2">
                    <Download className="h-4 w-4" /> Récapitulatif PDF
                  </button>
                  <button onClick={() => window.location.reload()} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-8 rounded-xl transition-all shadow-md shadow-blue-600/30 hover:scale-[1.02]">
                    Retour à l'accueil
                  </button>
                </div>
              </div>
            ) : (
              // FORMULAIRE CÔTE À CÔTE
              <div className="flex flex-col md:flex-row">
                {/* LEFT SIDE: VERTICAL STEPPER */}
                <div className="w-full md:w-1/3 bg-slate-50 p-8 md:p-10 border-b md:border-b-0 md:border-r border-neutral-200">
              <h3 className="font-display font-bold text-xl text-navy-900 mb-10">Votre progression</h3>
              
              <div className="space-y-10 relative">
                {/* Vertical Line */}
                <div className="absolute left-[22px] top-[40px] bottom-[40px] w-0.5 bg-neutral-200 z-0 hidden md:block" />

                {/* Step 1 */}
                <div onClick={() => handleStepChange(1)} className={`relative z-10 flex items-start gap-4 cursor-pointer transition-all duration-300 ${step === 1 ? 'opacity-100 scale-105' : 'opacity-60 hover:opacity-100'}`}>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-colors shadow-sm ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-white border-2 border-neutral-200 text-slate-400'}`}>1</div>
                  <div className="pt-2">
                    <h4 className={`font-bold text-base mb-1 ${step >= 1 ? 'text-navy-900' : 'text-slate-500'}`}>Informations Élève</h4>
                    <p className="text-xs text-slate-500 font-medium">Identité, classe & options</p>
                  </div>
                </div>

                {/* Step 2 */}
                <div onClick={() => step >= 2 && handleStepChange(2)} className={`relative z-10 flex items-start gap-4 transition-all duration-300 ${step >= 2 ? 'cursor-pointer' : 'cursor-not-allowed'} ${step === 2 ? 'opacity-100 scale-105' : 'opacity-60 hover:opacity-100'}`}>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-colors shadow-sm ${step >= 2 ? 'bg-orange-500 text-white' : 'bg-white border-2 border-neutral-200 text-slate-400'}`}>2</div>
                  <div className="pt-2">
                    <h4 className={`font-bold text-base mb-1 ${step >= 2 ? 'text-navy-900' : 'text-slate-500'}`}>Informations Parent</h4>
                    <p className="text-xs text-slate-500 font-medium">Coordonnées & contacts</p>
                  </div>
                </div>

                {/* Step 3 */}
                <div onClick={() => step >= 3 && handleStepChange(3)} className={`relative z-10 flex items-start gap-4 transition-all duration-300 ${step >= 3 ? 'cursor-pointer' : 'cursor-not-allowed'} ${step === 3 ? 'opacity-100 scale-105' : 'opacity-60 hover:opacity-100'}`}>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-colors shadow-sm ${step >= 3 ? 'bg-teal-500 text-white' : 'bg-white border-2 border-neutral-200 text-slate-400'}`}>3</div>
                  <div className="pt-2">
                    <h4 className={`font-bold text-base mb-1 ${step >= 3 ? 'text-navy-900' : 'text-slate-500'}`}>Dossier & Fiches</h4>
                    <p className="text-xs text-slate-500 font-medium">Documents justificatifs</p>
                  </div>
                </div>
              </div>

              <div className="mt-16 p-5 bg-blue-50/50 border border-blue-100 rounded-2xl">
                <h4 className="font-bold text-navy-900 text-sm mb-2">Besoin d'aide ?</h4>
                <p className="text-xs text-slate-600">Notre équipe est disponible au <strong className="text-blue-600">+224 00 00 00 00</strong> pour vous accompagner.</p>
              </div>
            </div>

            {/* RIGHT SIDE: ACTIVE STEP CONTENT */}
            <div className="w-full md:w-2/3 p-6 md:p-10 step-content relative">
              {/* STEP 1: ENFANT */}
              {step === 1 && (
                <div>
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                    <div>
                      <h2 className="font-display text-2xl font-bold text-navy-900 mb-1">Informations de l'élève</h2>
                      <p className="text-slate-500 text-sm">Veuillez renseigner les informations concernant l'enfant à inscrire.</p>
                    </div>
                    
                    {/* Multi-enfants Tabs */}
                    <div className="flex flex-wrap items-center gap-2">
                      {enfants.map((_, index) => (
                        <button 
                          key={index} 
                          onClick={() => setActiveEnfant(index)}
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeEnfant === index ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30' : 'bg-paper-50 text-slate-500 hover:bg-neutral-100 border border-neutral-200'} ${index === enfants.length - 1 ? 'enfant-tab-new' : ''}`}
                        >
                          Enfant {index + 1}
                        </button>
                      ))}
                      <button onClick={handleAddEnfant} className="px-3 py-2 rounded-xl text-xs font-bold text-blue-600 bg-blue-50 border border-blue-200 hover:bg-blue-100 transition-colors flex items-center gap-1">
                        + Ajouter
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-6 animate-fade-in key={activeEnfant}">
                    {/* Compact Layout: Photo + Fields */}
                    <div className="border border-neutral-200 rounded-2xl p-5 md:p-6 bg-white shadow-sm hover:border-blue-200 transition-colors">
                      <div className="flex flex-col md:flex-row gap-6 items-start">
                        {/* Photo Upload (Minimalist) */}
                        <div className="w-full md:w-[120px] flex-shrink-0 flex flex-col items-center gap-3">
                          <div className="h-20 w-20 rounded-full border-2 border-dashed border-blue-300 bg-paper-50 flex items-center justify-center text-blue-500 cursor-pointer hover:bg-blue-50 transition-colors">
                            <Camera className="h-6 w-6" />
                          </div>
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">Photo <br/>(Optionnelle)</span>
                        </div>

                        {/* Info Grid (No labels, clean like Parent) */}
                        <div className="flex-1 grid md:grid-cols-2 gap-3 w-full">
                          <input type="text" className="w-full p-3 bg-paper-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none transition-all text-sm" placeholder="Prénom (Ex: Ibrahim) *" />
                          <input type="text" className="w-full p-3 bg-paper-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none transition-all text-sm" placeholder="Nom (Ex: Soumah) *" />
                          <input type="text" placeholder="Date de naissance *" onFocus={(e) => e.target.type = 'date'} onBlur={(e) => !e.target.value && (e.target.type = 'text')} className="w-full p-3 bg-paper-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none transition-all text-sm" />
                          <select defaultValue="" className="w-full p-3 bg-paper-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none transition-all text-sm text-slate-600 appearance-none">
                            <option value="" disabled>Sexe *</option>
                            <option>Masculin</option>
                            <option>Féminin</option>
                          </select>
                          <select defaultValue="" className="w-full p-3 bg-paper-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none transition-all text-sm text-slate-600 appearance-none">
                            <option value="" disabled>Niveau souhaité *</option>
                            <option>Maternelle</option>
                            <option>Primaire</option>
                            <option>Collège</option>
                            <option>Lycée</option>
                          </select>
                          <select defaultValue="" className="w-full p-3 bg-paper-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none transition-all text-sm text-slate-600 appearance-none">
                            <option value="" disabled>Classe souhaitée *</option>
                            <option>Moyenne Section</option>
                            <option>CP1</option>
                            <option>CE1</option>
                            <option>7ème Année</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* COMPACT OPTIONS GRID */}
                    <div className="pt-2">
                      <h3 className="font-bold text-navy-900 text-sm mb-3 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.5)]"/> 
                        Options pour cet enfant
                      </h3>
                      
                      <div className="grid lg:grid-cols-2 gap-3">
                        {/* Cantine */}
                        <div className="border border-neutral-200 bg-white hover:border-blue-300 transition-colors rounded-xl p-3 flex gap-3 shadow-sm items-center">
                          <input type="checkbox" className="h-4 w-4 rounded border-neutral-300 text-blue-600 focus:ring-blue-600 cursor-pointer" />
                          <div className="flex-1 flex justify-between items-center">
                            <span className="font-bold text-navy-900 text-xs flex items-center gap-1.5"><Utensils className="h-3 w-3 text-orange-400"/> Cantine</span>
                            <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded">400k / mois</span>
                          </div>
                        </div>

                        {/* Transport */}
                        <div className="border border-neutral-200 bg-white hover:border-blue-300 transition-colors rounded-xl p-3 flex gap-3 shadow-sm items-center">
                          <input type="checkbox" className="h-4 w-4 rounded border-neutral-300 text-blue-600 focus:ring-blue-600 cursor-pointer" />
                          <div className="flex-1 flex items-center gap-3">
                            <span className="font-bold text-navy-900 text-xs flex items-center gap-1.5"><Bus className="h-3 w-3 text-blue-500"/> Navette</span>
                            <div className="flex gap-2 ml-auto">
                              <label className="text-[10px] text-slate-600 cursor-pointer flex items-center gap-1"><input type="radio" name="transport" className="text-blue-600"/> 200k</label>
                              <label className="text-[10px] text-slate-600 cursor-pointer flex items-center gap-1"><input type="radio" name="transport" className="text-blue-600"/> 350k</label>
                            </div>
                          </div>
                        </div>

                        {/* Uniformes */}
                        <div className="border border-neutral-200 bg-white hover:border-blue-300 transition-colors rounded-xl p-3 flex gap-3 shadow-sm items-center">
                          <Shirt className="h-3.5 w-3.5 text-blue-600"/>
                          <div className="flex-1 flex gap-3">
                            <label className="flex items-center gap-1.5 text-[11px] text-slate-600 cursor-pointer">
                              <input type="checkbox" className="rounded border-neutral-300 text-blue-600" /> Tenues (450k)
                            </label>
                            <label className="flex items-center gap-1.5 text-[11px] text-slate-600 cursor-pointer">
                              <input type="checkbox" className="rounded border-neutral-300 text-blue-600" /> EPS (100k)
                            </label>
                          </div>
                        </div>

                        {/* Activités */}
                        <div className="border border-neutral-200 bg-white hover:border-teal-300 transition-colors rounded-xl p-3 flex gap-3 shadow-sm items-center">
                          <Medal className="h-3.5 w-3.5 text-teal-600"/>
                          <div className="flex-1 flex gap-3">
                            <label className="flex items-center gap-1.5 text-[11px] text-slate-600 cursor-pointer">
                              <input type="checkbox" className="rounded border-neutral-300 text-teal-600" /> Karaté (200k)
                            </label>
                            <label className="flex items-center gap-1.5 text-[11px] text-slate-600 cursor-pointer">
                              <input type="checkbox" className="rounded border-neutral-300 text-teal-600" /> Code (250k)
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 flex flex-col-reverse sm:flex-row justify-between items-center gap-4">
                      <button onClick={handleAddEnfant} className="text-blue-600 hover:text-blue-700 text-xs font-bold py-2.5 px-4 rounded-xl flex items-center gap-1.5 transition-colors bg-blue-50 hover:bg-blue-100 w-full sm:w-auto justify-center">
                        + Inscrire un autre enfant
                      </button>
                      <button onClick={() => handleStepChange(2)} className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-600/30 hover:scale-[1.02] text-sm">
                        Étape suivante <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: PARENT */}
              {step === 2 && (
                <div>
                  <h2 className="font-display text-2xl font-bold text-navy-900 mb-1">Informations du parent</h2>
                  <p className="text-slate-500 text-sm mb-6">Veuillez renseigner les coordonnées des responsables légaux.</p>
                  
                  <div className="space-y-6">
                    {/* Père */}
                    <div className="border border-neutral-200 rounded-2xl p-5 md:p-6 bg-white shadow-sm hover:border-blue-200 transition-colors">
                      <h3 className="font-bold text-navy-900 mb-4 flex items-center gap-2 text-sm"><User className="h-4 w-4 text-blue-600"/> Informations du Père</h3>
                      <div className="grid md:grid-cols-2 gap-3">
                        <input type="text" placeholder="Ex: Ibrahim" className="w-full p-3 bg-paper-50 border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 outline-none transition-all" />
                        <input type="text" placeholder="Ex: Soumah" className="w-full p-3 bg-paper-50 border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 outline-none transition-all" />
                        <input type="email" placeholder="Email (papa@exemple.com)" className="w-full p-3 bg-paper-50 border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 outline-none transition-all" />
                        <input type="tel" placeholder="Téléphone (+224...)" className="w-full p-3 bg-paper-50 border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 outline-none transition-all" />
                        <input type="text" placeholder="Profession" className="w-full p-3 bg-paper-50 border border-neutral-200 rounded-xl text-sm md:col-span-2 focus:ring-2 focus:ring-blue-600 outline-none transition-all" />
                      </div>
                    </div>

                    {/* Mère */}
                    <div className="border border-neutral-200 rounded-2xl p-5 md:p-6 bg-white shadow-sm hover:border-orange-200 transition-colors">
                      <h3 className="font-bold text-navy-900 mb-4 flex items-center gap-2 text-sm"><User className="h-4 w-4 text-orange-500"/> Informations de la Mère</h3>
                      <div className="grid md:grid-cols-2 gap-3">
                        <input type="text" placeholder="Ex: Kadiatou" className="w-full p-3 bg-paper-50 border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 outline-none transition-all" />
                        <input type="text" placeholder="Ex: Soumah" className="w-full p-3 bg-paper-50 border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 outline-none transition-all" />
                        <input type="email" placeholder="Email (maman@exemple.com)" className="w-full p-3 bg-paper-50 border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 outline-none transition-all" />
                        <input type="tel" placeholder="Téléphone (+224...)" className="w-full p-3 bg-paper-50 border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 outline-none transition-all" />
                        <input type="text" placeholder="Profession" className="w-full p-3 bg-paper-50 border border-neutral-200 rounded-xl text-sm md:col-span-2 focus:ring-2 focus:ring-orange-500 outline-none transition-all" />
                      </div>
                    </div>

                    {/* Addresse */}
                    <div className="space-y-3 pt-4 border-t border-neutral-100">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Adresse de la famille</label>
                        <input type="text" className="w-full p-3 bg-paper-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none transition-all text-sm" placeholder="Quartier, ville, repère..." />
                      </div>
                    </div>

                    <div className="pt-4 flex justify-between items-center">
                      <button onClick={() => handleStepChange(1)} className="text-slate-500 hover:text-navy-900 text-sm font-bold py-2.5 px-4 rounded-xl flex items-center gap-2 transition-colors">
                        <ChevronLeft className="h-4 w-4" /> Retour
                      </button>
                      <button onClick={() => handleStepChange(3)} className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold py-2.5 px-6 rounded-xl flex items-center gap-2 transition-all shadow-md shadow-orange-500/30 hover:scale-[1.02]">
                        Étape suivante <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: DOSSIER */}
              {step === 3 && (
                <div>
                  <h2 className="font-display text-2xl font-bold text-navy-900 mb-1">Dossier à fournir</h2>
                  <p className="text-slate-500 text-sm mb-6">Veuillez préparer les documents justificatifs pour finaliser l'inscription.</p>
                  
                  <div className="space-y-6">
                    <p className="text-xs text-slate-600 leading-relaxed bg-blue-50/50 p-3 rounded-xl border border-blue-100">Vous pouvez scanner ou photographier les documents. Assurez-vous qu'ils soient lisibles.</p>
                    
                    <div className="space-y-2">
                      {[
                        "Extrait de naissance",
                        "Certificat de scolarité",
                        "Bulletins (année précédente)",
                        "Photos d'identité (x4)",
                        "Carnet de vaccination",
                        "Certificat médical",
                        "Pièce d'identité parent",
                        "Justificatif de domicile"
                      ].map((doc, i) => (
                        <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-white border border-neutral-200 rounded-xl shadow-sm gap-3 hover:border-blue-200 transition-colors">
                          <span className="text-xs font-bold text-navy-900">{doc}</span>
                          <div className="flex gap-2">
                            <button className="flex items-center gap-1.5 px-2.5 py-1.5 border border-neutral-200 rounded-lg text-[10px] font-bold text-slate-600 hover:bg-blue-50 hover:border-blue-200 transition-colors"><Camera className="h-3.5 w-3.5"/> Photo</button>
                            <button className="flex items-center gap-1.5 px-2.5 py-1.5 border border-neutral-200 rounded-lg text-[10px] font-bold text-slate-600 hover:bg-blue-50 hover:border-blue-200 transition-colors"><UploadCloud className="h-3.5 w-3.5"/> Fichier</button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Fiches de renseignements */}
                    <div className="mt-6 border border-orange-200 bg-white shadow-sm rounded-2xl p-5">
                      <h3 className="font-bold text-navy-900 mb-1.5 flex items-center gap-2 text-sm"><Download className="h-4 w-4 text-orange-500"/> Fiches à télécharger</h3>
                      <p className="text-xs text-slate-600 mb-4">Remplissez ces fiches et apportez-les lors de votre rendez-vous.</p>
                      
                      <div className="space-y-2.5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-paper-50 border border-neutral-200 rounded-xl gap-3">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-red-100 text-red-600 rounded-lg shadow-sm"><FileText className="h-4 w-4"/></div>
                            <div><p className="text-xs font-bold text-navy-900">FICHE RENSEIGNEMENT 2026</p><p className="text-[10px] text-slate-500 font-semibold">PDF</p></div>
                          </div>
                          <button className="bg-white border border-neutral-200 text-navy-900 text-[10px] font-bold px-3 py-2 rounded-lg hover:bg-neutral-100 transition-colors shadow-sm">Télécharger</button>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-paper-50 border border-neutral-200 rounded-xl gap-3">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-red-100 text-red-600 rounded-lg shadow-sm"><FileText className="h-4 w-4"/></div>
                            <div><p className="text-xs font-bold text-navy-900">FICHE CLASSES D'EXAMEN</p><p className="text-[10px] text-slate-500 font-semibold">PDF</p></div>
                          </div>
                          <button className="bg-white border border-neutral-200 text-navy-900 text-[10px] font-bold px-3 py-2 rounded-lg hover:bg-neutral-100 transition-colors shadow-sm">Télécharger</button>
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 flex flex-col-reverse sm:flex-row justify-between items-center gap-4 border-t border-neutral-100">
                      <button onClick={() => handleStepChange(2)} className="text-slate-500 hover:text-navy-900 text-sm font-bold py-2.5 px-4 rounded-xl flex items-center gap-2 transition-colors">
                        <ChevronLeft className="h-4 w-4" /> Retour
                      </button>
                      <button onClick={handleSubmit} className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white text-sm font-bold py-3 px-8 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-green-600/30 hover:scale-[1.02]">
                        Soumettre la demande <CheckCircle2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          )}
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
