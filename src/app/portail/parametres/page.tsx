import type { Metadata } from "next";
import { Sidebar } from "@/components/portal/Sidebar";
import { Topbar } from "@/components/portal/Topbar";
import { SettingsForm } from "@/components/portal/SettingsForm";

export const metadata: Metadata = {
  title: "Paramètres — Portail SAIMO",
  description: "Configuration du système et de l'établissement.",
};

export default function ParametresPage() {
  return (
    <div className="min-h-screen bg-paper-100">
      <Sidebar />
      <div className="lg:pl-64">
        <Topbar />
        <main className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
          <div className="mb-7">
            <h1 className="font-display text-2xl font-bold tracking-tight text-navy-900">
              Paramètres Système
            </h1>
            <p className="mt-1 text-sm text-ink-500">
              Gérez les configurations globales de l'établissement, la sécurité et l'année académique.
            </p>
          </div>
          
          <SettingsForm />
        </main>
      </div>
    </div>
  );
}
