"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Users, User, BookOpen, Clock, Settings, Pencil } from "lucide-react";
import { classes } from "@/lib/mock-classes";
import { affectations, seances } from "@/lib/mock-admin";
import { Sidebar } from "@/components/portal/Sidebar";
import { Topbar } from "@/components/portal/Topbar";
import { useParams } from "next/navigation";

export default function ClasseDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const classe = classes.find(c => c.id === id);

  const [activeTab, setActiveTab] = useState("eleves");

  if (!classe) {
    return (
      <div className="min-h-screen bg-paper-100 flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold text-navy-900 mb-4">Classe introuvable</h1>
        <Link href="/portail/classes" className="text-blue-600 hover:underline">Retour à la liste des classes</Link>
      </div>
    );
  }

  const classeAffectations = affectations.filter(a => a.classe === classe.nom);
  const classeSeances = seances.filter(s => s.classe === classe.nom);

  return (
    <div className="min-h-screen bg-paper-100">
      <Sidebar />
      <div className="lg:pl-64">
        <Topbar />
        <main className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
          
          {/* Header */}
          <div className="mb-8">
            <Link href="/portail/classes" className="inline-flex items-center gap-2 text-sm font-medium text-neutral-500 hover:text-neutral-900 mb-4 transition">
              <ArrowLeft className="h-4 w-4" /> Retour aux classes
            </Link>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex items-center gap-5">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 font-display text-2xl font-bold text-white shadow-lg shadow-blue-600/20">
                  {classe.nom.substring(0, 2)}
                </div>
                <div>
                  <h1 className="font-display text-3xl font-bold tracking-tight text-navy-900">{classe.nom}</h1>
                  <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-neutral-500">
                    <span className="flex items-center gap-1.5"><Users className="h-4 w-4" /> {classe.effectif} / {classe.capacite} Élèves</span>
                    <span>•</span>
                    <span className="font-medium">{classe.cycle}</span>
                    <span>•</span>
                    <span className="font-medium text-neutral-700">Prof: {classe.profPrincipal}</span>
                  </div>
                </div>
              </div>
              <button className="inline-flex items-center gap-2 rounded-full bg-white border border-neutral-200 px-5 py-2.5 text-sm font-semibold text-neutral-700 shadow-sm hover:bg-neutral-50 transition">
                <Pencil className="h-4 w-4 text-neutral-500" /> Modifier la classe
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-6 border-b border-neutral-200 mb-8 overflow-x-auto hide-scrollbar">
            {[
              { id: "eleves", label: "Liste des élèves", icon: User },
              { id: "matieres", label: "Équipe Pédagogique", icon: BookOpen },
              { id: "emploi", label: "Emploi du temps", icon: Clock },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 pb-4 text-sm font-semibold transition-colors border-b-2 whitespace-nowrap ${
                  activeTab === tab.id ? "border-blue-600 text-blue-600" : "border-transparent text-neutral-500 hover:text-neutral-800"
                }`}
              >
                <tab.icon className={`h-4 w-4 ${activeTab === tab.id ? "text-blue-600" : "text-neutral-400"}`} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content: Élèves */}
          {activeTab === "eleves" && (
            <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm p-8 text-center text-neutral-500">
              <Users className="h-10 w-10 mx-auto text-neutral-300 mb-3" />
              <p className="font-medium text-neutral-900">Aucun élève affecté à cette classe pour le moment.</p>
              <p className="text-sm mt-1">Vous pouvez affecter des élèves depuis l'onglet Inscriptions.</p>
            </div>
          )}

          {/* Content: Équipe Pédagogique (Affectations) */}
          {activeTab === "matieres" && (
            <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-neutral-100 bg-neutral-50/50 text-xs uppercase tracking-wide text-neutral-500">
                    <th className="px-5 py-3.5 font-semibold">Matière</th>
                    <th className="px-5 py-3.5 font-semibold">Enseignant</th>
                    <th className="px-5 py-3.5 font-semibold">Rôle</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-neutral-200">
                  {classeAffectations.map(a => (
                    <tr key={a.id} className="hover:bg-neutral-50/50 transition text-sm">
                      <td className="px-5 py-3.5 font-bold text-neutral-800">{a.matiere}</td>
                      <td className="px-5 py-3.5 text-neutral-600">{a.enseignant}</td>
                      <td className="px-5 py-3.5">
                        {a.profPrincipal 
                          ? <span className="rounded-full bg-orange-100 px-2.5 py-1 text-[11px] font-bold text-orange-700">Prof. Principal</span> 
                          : <span className="text-xs text-neutral-400">Intervenant</span>}
                      </td>
                    </tr>
                  ))}
                  {classeAffectations.length === 0 && (
                    <tr><td colSpan={3} className="px-5 py-10 text-center text-sm text-neutral-500">Aucun professeur affecté à cette classe.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Content: Emploi du temps */}
          {activeTab === "emploi" && (
            <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm overflow-hidden p-5">
              {classeSeances.length > 0 ? (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {classeSeances.map(s => (
                    <div key={s.id} className="rounded-xl border border-blue-100 bg-blue-50/30 p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-blue-600">{s.jour}</span>
                        <span className="text-xs font-medium text-neutral-500">{s.heureDebut} - {s.heureFin}</span>
                      </div>
                      <h4 className="font-bold text-neutral-900">{s.matiere}</h4>
                      <p className="text-sm text-neutral-600">{s.enseignant}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 text-neutral-500">
                  <Clock className="h-10 w-10 mx-auto text-neutral-300 mb-3" />
                  <p className="font-medium text-neutral-900">Emploi du temps vide.</p>
                  <p className="text-sm mt-1">Configurez les heures de cours depuis le module Emploi du Temps.</p>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
