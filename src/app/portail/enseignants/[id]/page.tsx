"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Mail, Phone, BookOpen, Calendar, Clock, GraduationCap, ShieldCheck } from "lucide-react";
import { Sidebar } from "@/components/portal/Sidebar";
import { Topbar } from "@/components/portal/Topbar";
import { getEnseignant } from "@/lib/mock-enseignants";

export default function EnseignantDetailPage() {
  const params = useParams();
  const enseignant = getEnseignant(params.id as string);

  if (!enseignant) {
    return (
      <div className="min-h-screen bg-paper-100 flex items-center justify-center">
        <p className="text-neutral-500">Enseignant introuvable.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper-100">
      <Sidebar />
      <div className="lg:pl-64">
        <Topbar />
        <main className="mx-auto max-w-5xl px-6 py-8 lg:px-10">
          <Link href="/portail/enseignants" className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 transition-colors hover:text-blue-600">
            <ArrowLeft className="h-4 w-4" />
            Retour à la liste des enseignants
          </Link>

          {/* En-tête profil */}
          <div className="rounded-2xl border border-neutral-200 bg-white overflow-hidden mb-6">
            <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-8">
              <div className="flex items-center gap-5">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm text-white font-display text-2xl font-bold shadow-lg">
                  {enseignant.firstName[0]}{enseignant.lastName[0]}
                </div>
                <div className="text-white">
                  <h1 className="text-2xl font-bold">{enseignant.firstName} {enseignant.lastName}</h1>
                  <p className="text-blue-100 mt-1 font-medium">{enseignant.matiere}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="bg-white/20 rounded-full px-3 py-1 text-xs font-semibold">{enseignant.matricule}</span>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${enseignant.statut === "Actif" ? "bg-green-400/20 text-green-100" : "bg-red-400/20 text-red-100"}`}>{enseignant.statut}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-neutral-100 border-b border-neutral-100">
              <div className="p-5 text-center">
                <p className="text-2xl font-black text-neutral-900">{enseignant.classes.length}</p>
                <p className="text-xs text-neutral-500 font-medium mt-1">Classes</p>
              </div>
              <div className="p-5 text-center">
                <p className="text-2xl font-black text-neutral-900">{enseignant.heuresHebdo}<span className="text-sm text-neutral-400">h</span></p>
                <p className="text-xs text-neutral-500 font-medium mt-1">Heures / Sem</p>
              </div>
              <div className="p-5 text-center">
                <p className={`text-2xl font-black ${enseignant.tauxPresence >= 95 ? "text-green-600" : enseignant.tauxPresence >= 85 ? "text-orange-500" : "text-red-500"}`}>{enseignant.tauxPresence}%</p>
                <p className="text-xs text-neutral-500 font-medium mt-1">Présence</p>
              </div>
              <div className="p-5 text-center">
                <p className="text-2xl font-black text-blue-600">{enseignant.genre}</p>
                <p className="text-xs text-neutral-500 font-medium mt-1">Genre</p>
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Coordonnées */}
            <div className="rounded-2xl border border-neutral-200 bg-white p-6">
              <h2 className="text-sm font-bold text-neutral-900 mb-5 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-blue-600" /> Informations personnelles
              </h2>
              <ul className="space-y-4">
                <li className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-blue-600"><Mail className="h-4 w-4" /></div>
                  <div>
                    <p className="text-xs text-neutral-400">Email</p>
                    <p className="text-sm font-semibold text-neutral-800">{enseignant.email}</p>
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-100 text-orange-600"><Phone className="h-4 w-4" /></div>
                  <div>
                    <p className="text-xs text-neutral-400">Téléphone</p>
                    <p className="text-sm font-semibold text-neutral-800">{enseignant.telephone}</p>
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-blue-600"><Calendar className="h-4 w-4" /></div>
                  <div>
                    <p className="text-xs text-neutral-400">Date d'embauche</p>
                    <p className="text-sm font-semibold text-neutral-800">{enseignant.dateEmbauche}</p>
                  </div>
                </li>
              </ul>

              <div className="mt-6 pt-5 border-t border-neutral-100">
                <Link href="/portail/enseignants" className="inline-flex items-center gap-2 rounded-xl bg-blue-50 border border-blue-100 px-4 py-2.5 text-sm font-semibold text-blue-600 hover:bg-blue-100 transition">
                  <GraduationCap className="h-4 w-4" />
                  Modifier les informations
                </Link>
              </div>
            </div>

            {/* Classes assignées */}
            <div className="rounded-2xl border border-neutral-200 bg-white p-6">
              <h2 className="text-sm font-bold text-neutral-900 mb-5 flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-orange-500" /> Classes assignées
              </h2>
              <div className="space-y-3">
                {enseignant.classes.map((c) => (
                  <div key={c} className="flex items-center justify-between p-4 rounded-xl bg-neutral-50 border border-neutral-100 hover:border-blue-200 hover:bg-blue-50/50 transition cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white text-xs font-bold shadow-sm">{c}</div>
                      <div>
                        <p className="text-sm font-bold text-neutral-800">{c}</p>
                        <p className="text-xs text-neutral-400">{enseignant.matiere}</p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-neutral-400 flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {Math.round(enseignant.heuresHebdo / enseignant.classes.length)}h/sem
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
