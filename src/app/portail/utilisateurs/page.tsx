import type { Metadata } from "next";
import { Sidebar } from "@/components/portal/Sidebar";
import { Topbar } from "@/components/portal/Topbar";
import { UtilisateursManager } from "@/components/portal/UtilisateursManager";
import { listerUtilisateurs } from "@/server/dal/admin";

export const metadata: Metadata = { title: "Utilisateurs — Portail SAIMO" };

export default async function UtilisateursPage() {
  const utilisateurs = await listerUtilisateurs();
  return (
    <div className="min-h-screen bg-paper-100">
      <Sidebar />
      <div className="lg:pl-64">
        <Topbar />
        <main className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
          <div className="mb-7">
            <h1 className="font-display text-2xl font-bold tracking-tight text-navy-900">Utilisateurs &amp; Accès</h1>
            <p className="mt-1 text-sm text-ink-500">{utilisateurs.length} compte{utilisateurs.length > 1 ? "s" : ""} rattaché{utilisateurs.length > 1 ? "s" : ""} à l&rsquo;établissement.</p>
          </div>
          <UtilisateursManager utilisateurs={utilisateurs} />
        </main>
      </div>
    </div>
  );
}
