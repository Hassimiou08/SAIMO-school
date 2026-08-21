"use client";

import { User, Mail, Phone, MapPin, Shield } from "lucide-react";
import { ParentSidebar } from "@/components/parent/ParentSidebar";
import { ParentTopbar } from "@/components/parent/ParentTopbar";
import { parentInfo } from "@/lib/mock-parent";

export default function ProfilParentPage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <ParentSidebar />
      <div className="lg:pl-64">
        <ParentTopbar />
        <main className="mx-auto max-w-4xl px-6 py-8 lg:px-10">
          <div className="mb-8">
            <h1 className="font-display text-2xl font-bold tracking-tight text-neutral-900">Mon Profil</h1>
            <p className="mt-1 text-sm text-neutral-500">Gérez vos informations personnelles et préférences.</p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {/* Colonne gauche (Photo & Résumé) */}
            <div className="md:col-span-1 space-y-6">
              <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm text-center">
                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-emerald-100 text-3xl font-bold text-emerald-700">
                  {parentInfo.nom.split(" ").map(p => p[0]).join("").slice(0, 2)}
                </div>
                <h2 className="mt-4 font-bold text-neutral-900 text-lg">{parentInfo.nom}</h2>
                <p className="text-sm text-neutral-500">Parent d'élève</p>
              </div>

              <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
                <h3 className="font-bold text-neutral-900 mb-4 flex items-center gap-2">
                  <Shield className="h-4 w-4 text-emerald-600" /> Sécurité
                </h3>
                <button className="w-full rounded-xl border border-neutral-200 py-2.5 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-50">
                  Changer le mot de passe
                </button>
              </div>
            </div>

            {/* Colonne droite (Informations détaillées) */}
            <div className="md:col-span-2 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-neutral-900 text-lg">Informations de contact</h3>
                <button className="text-sm font-semibold text-emerald-600 hover:underline">Modifier</button>
              </div>

              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Nom complet</label>
                    <div className="mt-1 flex items-center gap-3 rounded-xl border border-neutral-100 bg-neutral-50 p-3 text-sm text-neutral-700">
                      <User className="h-4 w-4 text-neutral-400" /> {parentInfo.nom}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Téléphone</label>
                    <div className="mt-1 flex items-center gap-3 rounded-xl border border-neutral-100 bg-neutral-50 p-3 text-sm text-neutral-700">
                      <Phone className="h-4 w-4 text-neutral-400" /> {parentInfo.telephone}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Adresse email</label>
                  <div className="mt-1 flex items-center gap-3 rounded-xl border border-neutral-100 bg-neutral-50 p-3 text-sm text-neutral-700">
                    <Mail className="h-4 w-4 text-neutral-400" /> {parentInfo.email}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Adresse de résidence</label>
                  <div className="mt-1 flex items-center gap-3 rounded-xl border border-neutral-100 bg-neutral-50 p-3 text-sm text-neutral-700">
                    <MapPin className="h-4 w-4 text-neutral-400" /> {parentInfo.adresse}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
