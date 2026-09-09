import type { Metadata } from "next";
import { EnseignantShell } from "@/components/enseignant/Shell";
import { AIAssistant } from "@/components/portal/AIAssistant";

export const metadata: Metadata = { title: "Assistant IA — Enseignant SAIMO" };

export default function IAEnseignantPage() {
  return (
    <EnseignantShell
      large
      titre="Assistant IA"
      sous="Aide à la rédaction d'appréciations, de sujets, de messages aux familles. Il s'appuie sur vos classes."
    >
      <AIAssistant />
    </EnseignantShell>
  );
}
