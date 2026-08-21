import type { Metadata } from "next";
import { Sidebar } from "@/components/portal/Sidebar";
import { Topbar } from "@/components/portal/Topbar";
import { AIAssistant } from "@/components/portal/AIAssistant";

export const metadata: Metadata = {
  title: "Assistant IA — Portail SAIMO",
  description: "L'intelligence artificielle SAIMO pour vous assister.",
};

export default function IAPage() {
  return (
    <div className="min-h-screen bg-paper-100">
      <Sidebar />
      <div className="lg:pl-64">
        <Topbar />
        <main className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
          <div className="mb-7">
            <h1 className="font-display text-2xl font-bold tracking-tight text-navy-900">
              Intelligence Artificielle
            </h1>
            <p className="mt-1 text-sm text-ink-500">
              Votre assistant personnel pour analyser, rédiger et automatiser les tâches scolaires.
            </p>
          </div>
          
          <AIAssistant />
        </main>
      </div>
    </div>
  );
}
