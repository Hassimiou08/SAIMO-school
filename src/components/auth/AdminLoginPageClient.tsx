"use client";

import { AdminLoginForm } from "@/components/auth/AdminLoginForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AdminLoginPageClient() {
  return (
    <div className="flex min-h-screen w-full relative bg-[#FDF8F0] overflow-hidden">
      
      {/* LEFT SIDE: FORM */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center relative px-6 sm:px-12 md:px-24 py-12 z-10">
        
        {/* Navigation */}
        <div className="absolute top-8 left-6 sm:left-12 flex items-center">
          <Link href="/connexion" className="text-blue-600 hover:text-blue-800 flex items-center gap-2 text-sm font-semibold transition-colors">
            <ArrowLeft className="h-4 w-4" /> Retour au portail
          </Link>
        </div>

        {/* Form Container */}
        <div className="w-full max-w-md mx-auto">
          <AdminLoginForm />
        </div>
      </div>

      {/* RIGHT SIDE: BRANDING BANNER (Like the reference image) */}
      <div className="hidden lg:flex w-1/2 bg-blue-600 rounded-l-[4rem] flex-col items-center justify-center relative overflow-hidden shadow-[-20px_0_50px_rgba(37,99,235,0.15)]">
        
        {/* Decorative Background Elements */}
        <div className="absolute top-[-20%] right-[-10%] w-96 h-96 bg-blue-500 rounded-full blur-[80px]" />
        <div className="absolute bottom-[-20%] left-[-10%] w-96 h-96 bg-teal-500/30 rounded-full blur-[80px]" />
        
        {/* Giant decorative text */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[15rem] font-black text-white/5 whitespace-nowrap pointer-events-none select-none">
          SAIMO
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-12">
          <h2 className="font-display text-5xl font-bold text-white mb-4">
            Bienvenue dans l'espace <span className="text-orange-400">Personnel!</span>
          </h2>
          <p className="text-blue-100 mb-8 max-w-md mx-auto text-lg leading-relaxed">
            Veuillez entrer vos identifiants pour accéder au portail d'administration sécurisé de l'établissement.
          </p>
          
          <div className="flex flex-col items-center gap-4">
            <p className="text-sm text-blue-200">Vous n'avez pas de compte professionnel ?</p>
            <Link 
              href="/sections/contact" 
              className="px-8 py-3 rounded-full border-2 border-orange-400 text-orange-400 font-bold hover:bg-orange-400 hover:text-white transition-all duration-300"
            >
              Contacter le support
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}
