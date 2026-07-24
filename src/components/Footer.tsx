"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { LogoLockup } from "./Logo";
import { MapPin, Phone, Mail, ArrowRight } from "lucide-react";
import Link from "next/link";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function Footer() {
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".footer-col",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top 90%",
          },
        }
      );
      
      gsap.fromTo(
        ".footer-bottom",
        { opacity: 0 },
        {
          opacity: 1,
          duration: 1,
          delay: 0.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top 95%",
          },
        }
      );
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer ref={footerRef} className="bg-slate-50 pt-20 pb-10 border-t border-neutral-200 relative overflow-hidden text-slate-600">
      {/* Lueur d'arrière-plan douce */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent"></div>
      
      <div className="mx-auto max-w-7xl px-6 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
          
          {/* Colonne 1 : Marque & Description (Prend plus de place) */}
          <div className="footer-col lg:col-span-4 flex flex-col items-start lg:pr-8">
            <div className="bg-white p-4 rounded-2xl border border-neutral-100 mb-6 shadow-sm">
              <LogoLockup variant="dark" />
            </div>
            <p className="text-sm leading-relaxed text-slate-500 mb-8 max-w-sm">
              L'innovation au service du développement. Le Groupe SAIMO s'engage à offrir une éducation de classe mondiale, alliant excellence académique et épanouissement personnel.
            </p>
            {/* Réseaux Sociaux (SVG bruts pour la compatibilité) */}
            <div className="flex items-center gap-4">
              <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 border border-neutral-200 text-slate-500 transition-all hover:bg-blue-600 hover:border-blue-500 hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
              <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 border border-neutral-200 text-slate-500 transition-all hover:bg-orange-500 hover:border-orange-400 hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 border border-neutral-200 text-slate-500 transition-all hover:bg-blue-400 hover:border-blue-300 hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </a>
            </div>
          </div>

          {/* Colonne 2 : Navigation Rapide */}
          <div className="footer-col lg:col-span-2 lg:border-l lg:border-neutral-200 lg:pl-8">
            <h4 className="text-navy-900 font-bold mb-6 text-sm uppercase tracking-wider">Navigation</h4>
            <ul className="space-y-4">
              <li><Link href="#galerie" className="text-sm text-slate-500 transition-colors hover:text-blue-600">Galerie</Link></li>
              <li><Link href="#tarifs" className="text-sm text-slate-500 transition-colors hover:text-blue-600">Tarifs & Programmes</Link></li>
              <li><Link href="#modules" className="text-sm text-slate-500 transition-colors hover:text-blue-600">Nos Modules</Link></li>
              <li><Link href="/contact" className="text-sm text-slate-500 transition-colors hover:text-blue-600">Contact</Link></li>
            </ul>
          </div>

          {/* Colonne 3 : Portails & Accès */}
          <div className="footer-col lg:col-span-3 lg:border-l lg:border-neutral-200 lg:pl-8">
            <h4 className="text-navy-900 font-bold mb-6 text-sm uppercase tracking-wider">Vos Espaces</h4>
            <ul className="space-y-4">
              <li>
                <Link href="/login?role=eleve" className="group flex items-center gap-2 text-sm text-slate-500 transition-colors hover:text-blue-600">
                  <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" /> Espace Élève
                </Link>
              </li>
              <li>
                <Link href="/login?role=parent" className="group flex items-center gap-2 text-sm text-slate-500 transition-colors hover:text-blue-600">
                  <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" /> Espace Parent
                </Link>
              </li>
              <li>
                <Link href="/login?role=professeur" className="group flex items-center gap-2 text-sm text-slate-500 transition-colors hover:text-blue-600">
                  <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" /> Portail Employé
                </Link>
              </li>
              <li>
                <Link href="/login?role=admin" className="group flex items-center gap-2 text-sm text-slate-500 transition-colors hover:text-blue-600">
                  <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" /> Administration
                </Link>
              </li>
            </ul>
          </div>

          {/* Colonne 4 : Contact */}
          <div className="footer-col lg:col-span-3 lg:border-l lg:border-neutral-200 lg:pl-8">
            <h4 className="text-navy-900 font-bold mb-6 text-sm uppercase tracking-wider">Nous Contacter</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
                <span className="text-sm text-slate-500">Conakry, République de Guinée</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-orange-500 shrink-0" />
                <a href="tel:+22400000000" className="text-sm text-slate-500 transition-colors hover:text-blue-600">+224 00 00 00 00</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-orange-500 shrink-0" />
                <a href="mailto:contact@saimo.education" className="text-sm text-slate-500 transition-colors hover:text-blue-600">contact@saimo.education</a>
              </li>
            </ul>
          </div>

        </div>

        {/* Ligne inférieure : Copyright et Mentions légales */}
        <div className="footer-bottom flex flex-col md:flex-row items-center justify-between gap-4 border-t border-neutral-200 pt-8 mt-8">
          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} Groupe SAIMO. Tous droits réservés.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-xs text-slate-400 hover:text-blue-600 transition-colors">Politique de confidentialité</Link>
            <Link href="/terms" className="text-xs text-slate-400 hover:text-blue-600 transition-colors">Conditions d'utilisation</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
