"use client";

import { Plus, Megaphone, Calendar } from "lucide-react";
import { annonces } from "@/lib/mock-admin";
import { Sidebar } from "@/components/portal/Sidebar";
import { Topbar } from "@/components/portal/Topbar";

export default function AnnoncesPage() {
  return (
    <div className="min-h-screen bg-paper-100">
      <Sidebar />
      <div className="lg:pl-64">
        <Topbar />
        <main className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
          <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="font-display text-2xl font-bold tracking-tight text-navy-900">Annonces</h1>
              <p className="mt-1 text-sm text-ink-500">Communication officielle vers les parents, élèves et enseignants.</p>
            </div>
            <button className="inline-flex items-center gap-2 self-start rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-600/20 hover:bg-blue-700 transition">
              <Plus className="h-4 w-4" /> Rédiger une annonce
            </button>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {annonces.map(a => (
              <div key={a.id} className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
                <div className="flex items-start justify-between mb-4">
                  <h2 className="font-bold text-lg text-neutral-900 leading-tight">{a.titre}</h2>
                  {a.publie
                    ? <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-green-700">Publié</span>
                    : <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-neutral-500">Brouillon</span>
                  }
                </div>
                <p className="text-sm text-neutral-600 mb-6">{a.contenu}</p>
                <div className="flex items-center justify-between border-t border-neutral-100 pt-4">
                  <div className="flex gap-2">
                    {a.cibles.map(c => (
                      <span key={c} className="rounded bg-neutral-100 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-neutral-500">{c}</span>
                    ))}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-neutral-400">
                    {a.date && (
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {new Date(a.date).toLocaleDateString("fr-FR")}</span>
                    )}
                    <span className="font-medium text-neutral-500">{a.auteur}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
