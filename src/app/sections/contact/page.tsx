"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  MapPin, 
  Phone, 
  Mail, 
  Send, 
  Clock, 
  MessageSquare,
  CheckCircle2,
  Briefcase,
  Building,
  Wallet,
  MonitorPlay,
  ArrowRight
} from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ContactPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero Animation
      gsap.fromTo(".hero-el",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: "power3.out" }
      );
      
      // Main Card Animation
      gsap.fromTo(".contact-card",
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1, delay: 0.3, ease: "power3.out" }
      );
      
      // Info Items Stagger
      gsap.fromTo(".info-item",
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.6, stagger: 0.1, delay: 0.6, ease: "power2.out" }
      );
      
      // Form Items Stagger
      gsap.fromTo(".form-item",
        { opacity: 0, x: 20 },
        { opacity: 1, x: 0, duration: 0.6, stagger: 0.1, delay: 0.8, ease: "power2.out" }
      );
      
      // Channels Section Stagger
      gsap.fromTo(".channel-el",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, scrollTrigger: { trigger: ".channels-section", start: "top 85%" } }
      );
      
      gsap.fromTo(".channel-card",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, delay: 0.2, scrollTrigger: { trigger: ".channels-section", start: "top 80%" } }
      );

      // FAQ Section Stagger
      gsap.fromTo(".faq-el",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, scrollTrigger: { trigger: ".faq-section", start: "top 80%" } }
      );
      
      gsap.fromTo(".faq-card",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, delay: 0.2, scrollTrigger: { trigger: ".faq-section", start: "top 75%" } }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    
    // Animation de succès
    setTimeout(() => {
      gsap.fromTo(".success-el", 
        { scale: 0.8, opacity: 0, y: 20 }, 
        { scale: 1, opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "back.out(1.5)" }
      );
    }, 50);
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-paper-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 pt-24 pb-20 relative overflow-hidden">
        {/* Background Decorative Blurs */}
        <div className="absolute top-[-10%] left-[-5%] w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[40rem] h-[40rem] bg-orange-500/10 rounded-full blur-[120px] pointer-events-none" />

        {/* HERO SECTION */}
        <div className="max-w-4xl mx-auto text-center px-6 mb-16 relative z-10">
          <span className="hero-el inline-block uppercase text-[10px] sm:text-xs font-bold tracking-wider text-blue-700 border border-blue-200 bg-blue-50 px-4 py-1.5 rounded-full mb-4 shadow-sm">
            Contact & Support
          </span>
          <h1 className="hero-el font-display text-4xl md:text-5xl lg:text-6xl font-extrabold text-navy-900 mb-6">
            Contactez notre <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-orange-500">équipe</span>
          </h1>
          <p className="hero-el text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Que vous soyez parent d'élève, partenaire ou enseignant, notre équipe est à votre disposition pour vous accompagner avec excellence.
          </p>
        </div>

        {/* CONTACT MAIN CARD */}
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="contact-card bg-white/80 backdrop-blur-md rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(15,42,74,0.08)] border border-neutral-200 overflow-hidden flex flex-col lg:flex-row">
            
            {/* LEFT SIDE: INFORMATIONS */}
            <div className="w-full lg:w-[40%] bg-navy-950 p-10 md:p-14 text-white relative overflow-hidden">
              {/* Pattern Overlay */}
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-[80px]" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500/20 rounded-full blur-[80px]" />

              <div className="relative z-10">
                <h2 className="info-item font-display text-3xl font-bold mb-2">Nos Coordonnées</h2>
                <p className="info-item text-blue-100 text-sm mb-10 opacity-80">Notre équipe administrative vous accueille tous les jours ouvrés.</p>

                <div className="space-y-8">
                  {/* Phone */}
                  <div className="info-item flex items-start gap-4">
                    <div className="h-12 w-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/5 backdrop-blur-sm">
                      <Phone className="h-5 w-5 text-orange-400" />
                    </div>
                    <div>
                      <p className="text-xs text-blue-200 font-bold uppercase tracking-wider mb-1">Téléphone</p>
                      <p className="text-lg font-medium">+224 620 00 00 00</p>
                      <p className="text-sm text-blue-100/70">+224 660 00 00 00</p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="info-item flex items-start gap-4">
                    <div className="h-12 w-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/5 backdrop-blur-sm">
                      <Mail className="h-5 w-5 text-teal-400" />
                    </div>
                    <div>
                      <p className="text-xs text-blue-200 font-bold uppercase tracking-wider mb-1">Email</p>
                      <p className="text-lg font-medium">contact@saimo.edu.gn</p>
                      <p className="text-sm text-blue-100/70">admission@saimo.edu.gn</p>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="info-item flex items-start gap-4">
                    <div className="h-12 w-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/5 backdrop-blur-sm">
                      <MapPin className="h-5 w-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-xs text-blue-200 font-bold uppercase tracking-wider mb-1">Campus Principal</p>
                      <p className="text-lg font-medium leading-tight">Quartier Kaloum,<br/>Conakry, Guinée</p>
                    </div>
                  </div>

                  {/* Hours */}
                  <div className="info-item flex items-start gap-4">
                    <div className="h-12 w-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/5 backdrop-blur-sm">
                      <Clock className="h-5 w-5 text-yellow-400" />
                    </div>
                    <div>
                      <p className="text-xs text-blue-200 font-bold uppercase tracking-wider mb-1">Heures d'ouverture</p>
                      <p className="text-lg font-medium">Lun - Ven : 08h00 - 17h00</p>
                      <p className="text-sm text-blue-100/70">Samedi : 09h00 - 13h00</p>
                    </div>
                  </div>
                </div>

                {/* Socials */}
                <div className="info-item mt-14 pt-8 border-t border-white/10">
                  <p className="text-xs text-blue-200 font-bold uppercase tracking-wider mb-4">Suivez-nous</p>
                  <div className="flex gap-3">
                    <a href="#" className="h-10 w-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-blue-600 hover:border-blue-500 transition-all text-white">
                      <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                    </a>
                    <a href="#" className="h-10 w-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-pink-600 hover:border-pink-500 transition-all text-white">
                      <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                    </a>
                    <a href="#" className="h-10 w-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-blue-500 hover:border-blue-400 transition-all text-white">
                      <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE: FORM */}
            <div className="w-full lg:w-[60%] p-10 md:p-14 bg-white relative">
              {isSubmitted ? (
                // SUCCESS SCREEN
                <div className="h-full flex flex-col items-center justify-center text-center py-10 min-h-[400px]">
                  <div className="success-el h-24 w-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-green-600/20">
                    <CheckCircle2 className="h-12 w-12" />
                  </div>
                  <h2 className="success-el font-display text-3xl md:text-4xl font-bold text-navy-900 mb-4">Message envoyé !</h2>
                  <p className="success-el text-slate-600 text-lg max-w-md mx-auto mb-8 leading-relaxed">
                    Merci de nous avoir contactés. Notre équipe vous répondra dans les plus brefs délais à l'adresse indiquée.
                  </p>
                  <button onClick={() => setIsSubmitted(false)} className="success-el bg-paper-50 border border-neutral-200 text-navy-900 font-bold py-3 px-8 rounded-xl hover:bg-neutral-100 transition-colors shadow-sm">
                    Envoyer un autre message
                  </button>
                </div>
              ) : (
                // ACTUAL FORM
                <form onSubmit={handleSubmit} className="h-full flex flex-col justify-center">
                  <div className="form-item mb-8">
                    <h2 className="font-display text-3xl font-bold text-navy-900 mb-2 flex items-center gap-2">
                      Envoyez-nous un message <MessageSquare className="h-6 w-6 text-orange-500"/>
                    </h2>
                    <p className="text-sm text-slate-500">Remplissez le formulaire ci-dessous et nous vous recontacterons rapidement.</p>
                  </div>

                  <div className="space-y-5">
                    <div className="grid md:grid-cols-2 gap-5">
                      <div className="form-item space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Prénom <span className="text-red-500">*</span></label>
                        <input required type="text" placeholder="Votre prénom" className="w-full p-3.5 bg-paper-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none transition-all text-sm" />
                      </div>
                      <div className="form-item space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Nom <span className="text-red-500">*</span></label>
                        <input required type="text" placeholder="Votre nom" className="w-full p-3.5 bg-paper-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none transition-all text-sm" />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-5">
                      <div className="form-item space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Email <span className="text-red-500">*</span></label>
                        <input required type="email" placeholder="adresse@email.com" className="w-full p-3.5 bg-paper-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none transition-all text-sm" />
                      </div>
                      <div className="form-item space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Téléphone</label>
                        <input type="tel" placeholder="+224..." className="w-full p-3.5 bg-paper-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none transition-all text-sm" />
                      </div>
                    </div>

                    <div className="form-item space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Sujet de la demande <span className="text-red-500">*</span></label>
                      <select required defaultValue="" className="w-full p-3.5 bg-paper-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none transition-all text-sm text-slate-600 appearance-none">
                        <option value="" disabled>Sélectionnez un sujet</option>
                        <option>Demande d'admission</option>
                        <option>Informations sur la scolarité</option>
                        <option>Demande de partenariat</option>
                        <option>Recrutement</option>
                        <option>Autre</option>
                      </select>
                    </div>

                    <div className="form-item space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Votre message <span className="text-red-500">*</span></label>
                      <textarea required rows={4} placeholder="Comment pouvons-nous vous aider ?" className="w-full p-3.5 bg-paper-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none transition-all text-sm resize-none"></textarea>
                    </div>

                    <div className="form-item pt-4">
                      <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/30 hover:scale-[1.02]">
                        Envoyer le message <Send className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* OTHER CHANNELS / DEPARTMENTS SECTION */}
        <section className="channels-section max-w-6xl mx-auto px-6 relative z-10 mt-32">
          <div className="text-center mb-12">
            <span className="channel-el inline-block uppercase text-[10px] sm:text-xs font-bold tracking-wider text-orange-600 border border-orange-200 bg-orange-50 px-4 py-1.5 rounded-full mb-4 shadow-sm">
              Départements
            </span>
            <h2 className="channel-el font-display text-3xl md:text-4xl font-bold text-navy-900 mb-4">Canaux de communication</h2>
            <p className="channel-el text-slate-600 max-w-2xl mx-auto">Contactez directement le département concerné pour un traitement prioritaire de votre requête.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { 
                icon: <Phone className="h-6 w-6 text-blue-600"/>, 
                title: "Appel", 
                desc: "Assistance téléphonique directe", 
                actionText: "+224 620 00 00 00",
                link: "tel:+224620000000", 
                bg: "bg-blue-50", 
                textColor: "text-blue-600" 
              },
              { 
                icon: <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 text-emerald-600"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>, 
                title: "WhatsApp", 
                desc: "Messagerie instantanée", 
                actionText: "Discuter en direct",
                link: "https://wa.me/224620000000", 
                bg: "bg-emerald-50", 
                textColor: "text-emerald-600" 
              },
              { 
                icon: <Mail className="h-6 w-6 text-orange-600"/>, 
                title: "Email", 
                desc: "Pour vos demandes détaillées", 
                actionText: "Envoyer un email",
                link: "mailto:contact@saimo.edu.gn", 
                bg: "bg-orange-50", 
                textColor: "text-orange-600" 
              },
              { 
                icon: <MessageSquare className="h-6 w-6 text-indigo-600"/>, 
                title: "SMS", 
                desc: "Requêtes simples et rapides", 
                actionText: "Envoyer un SMS",
                link: "sms:+224620000000", 
                bg: "bg-indigo-50", 
                textColor: "text-indigo-600" 
              },
            ].map((channel, i) => (
              <div key={i} className="channel-card bg-white rounded-3xl p-6 md:p-8 border border-neutral-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                <div className={`h-14 w-14 rounded-2xl ${channel.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                  {channel.icon}
                </div>
                <h3 className="font-bold text-navy-900 text-xl mb-2">{channel.title}</h3>
                <p className="text-sm text-slate-500 mb-6 leading-relaxed">{channel.desc}</p>
                <a href={channel.link} target={channel.link.startsWith('http') ? "_blank" : undefined} rel="noopener noreferrer" className={`text-sm font-bold ${channel.textColor} flex items-center gap-2 group-hover:gap-3 transition-all`}>
                  {channel.actionText} <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ SECTION */}
        <section className="faq-section bg-paper-50 py-32 border-t border-neutral-200 mt-24">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-16">
              <span className="faq-el inline-block uppercase text-[10px] sm:text-xs font-bold tracking-wider text-blue-700 border border-blue-200 bg-blue-50 px-4 py-1.5 rounded-full mb-4 shadow-sm">
                Foire Aux Questions
              </span>
              <h2 className="faq-el font-display text-3xl md:text-4xl font-bold text-navy-900 mb-4">
                Des questions ? <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-yellow-500">Nous avons les réponses.</span>
              </h2>
              <p className="faq-el text-slate-600 max-w-xl mx-auto">Trouvez rapidement les réponses aux questions les plus fréquemment posées par les parents avant de nous contacter.</p>
            </div>

            <div className="space-y-6">
              {[
                { q: "Quels sont les délais de traitement d'une pré-inscription ?", a: "Notre équipe pédagogique étudie chaque dossier dans un délai de 48h ouvrées. Vous recevrez ensuite un email ou un appel vous indiquant la marche à suivre pour finaliser l'inscription." },
                { q: "Quels modes de paiement acceptez-vous ?", a: "Nous acceptons les virements bancaires, les chèques, les paiements mobiles (Orange Money, MTN) ainsi que les paiements en espèces directement à la caisse de l'école." },
                { q: "Est-il possible de visiter l'établissement avant l'inscription ?", a: "Absolument. Nous organisons des visites guidées. Il vous suffit de nous contacter par WhatsApp ou par téléphone pour réserver votre créneau de visite." },
                { q: "Les frais de cantine et de transport sont-ils inclus ?", a: "Non, la scolarité de base ne couvre pas ces services. La cantine, le transport et les tenues scolaires sont des services optionnels qui peuvent être ajoutés lors de l'inscription." }
              ].map((faq, i) => (
                <div key={i} className="faq-card bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-neutral-200 hover:border-blue-300 hover:shadow-md transition-all">
                  <h3 className="font-bold text-navy-900 text-lg mb-3 flex gap-4 items-start">
                    <span className="text-orange-500 font-display font-extrabold text-2xl leading-none">Q.</span> 
                    <span className="mt-0.5">{faq.q}</span>
                  </h3>
                  <p className="text-slate-600 leading-relaxed pl-9">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
