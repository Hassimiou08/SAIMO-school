import type { Metadata } from "next";
import { Sidebar } from "@/components/portal/Sidebar";
import { Topbar } from "@/components/portal/Topbar";
import { AIAssistant } from "@/components/portal/AIAssistant";

export const metadata: Metadata = {
  title: "Assistant IA — Portail SAIMO",
  description: "Assistant conversationnel connecté aux données de l'établissement.",
};

export default function IAPage() {
  return (
    <div className="min-h-screen bg-paper-100">
      <Sidebar />
      <div className="lg:pl-64">
        <Topbar />
        <main className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
          <div className="mb-6">
            <h1 className="font-display text-2xl font-bold tracking-tight text-navy-900">Assistant IA</h1>
            <p className="mt-1 text-sm text-ink-500">
              Posez vos questions sur l&rsquo;établissement ou demandez une rédaction. L&rsquo;assistant s&rsquo;appuie sur vos données réelles ; il propose, il ne décide pas.
            </p>
          </div>
          <AIAssistant />
        </main>
      </div>
    </div>
  );
}
