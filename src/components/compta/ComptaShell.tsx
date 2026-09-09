import type { ReactNode } from "react";
import { ComptaSidebar } from "@/components/compta/ComptaSidebar";
import { ComptaTopbar } from "@/components/compta/ComptaTopbar";

/**
 * Chrome commun des pages du portail comptable : sidebar + topbar + zone principale.
 * Les pages passent leur contenu en enfants ; `wide` élargit la colonne (tableaux).
 */
export function ComptaShell({
  children,
  wide = true,
}: {
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <div className="min-h-screen bg-neutral-50/50">
      <ComptaSidebar />
      <div className="lg:pl-64">
        <ComptaTopbar />
        <main className={`mx-auto ${wide ? "max-w-7xl" : "max-w-3xl"} px-6 py-8 lg:px-10`}>
          {children}
        </main>
      </div>
    </div>
  );
}
