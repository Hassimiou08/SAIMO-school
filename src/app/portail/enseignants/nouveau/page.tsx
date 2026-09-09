import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, GraduationCap } from "lucide-react";
import { Sidebar } from "@/components/portal/Sidebar";
import { Topbar } from "@/components/portal/Topbar";
import { NouvelEnseignantForm } from "@/components/portal/NouvelEnseignantForm";

export const metadata: Metadata = { title: "Nouvel enseignant — Portail SAIMO" };

export default function NouvelEnseignantPage() {
  return (
    <div className="min-h-screen bg-paper-100">
      <Sidebar />
      <div className="lg:pl-64">
        <Topbar />
        <main className="mx-auto max-w-5xl px-6 py-8 lg:px-10">
          <div className="mb-8">
            <Link href="/portail/enseignants" className="inline-flex items-center gap-2 text-sm font-semibold text-ink-500 hover:text-blue-600 transition-colors mb-4">
              <ArrowLeft className="h-4 w-4" /> Retour à la liste des enseignants
            </Link>
            <h1 className="font-display text-2xl font-bold tracking-tight text-navy-900 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 shadow-md shadow-orange-500/20">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              Nouvel enseignant
            </h1>
          </div>
          <NouvelEnseignantForm />
        </main>
      </div>
    </div>
  );
}
