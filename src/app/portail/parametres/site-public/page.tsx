import type { Metadata } from "next";
import { Sidebar } from "@/components/portal/Sidebar";
import { Topbar } from "@/components/portal/Topbar";
import { SitePublicForm } from "@/components/portal/SitePublicForm";
import { getSiteEcoleAdmin } from "@/server/dal/site-ecole";
import { requireContext } from "@/server/context";
import { peutFaire } from "@/server/permissions/roles";

export const metadata: Metadata = {
  title: "Site public — Portail SAIMO",
  description: "Contenu du site internet de l'établissement.",
};

export default async function SitePublicPage() {
  const [{ site, logoPortail }, ctx] = await Promise.all([getSiteEcoleAdmin(), requireContext()]);

  return (
    <div className="min-h-screen bg-paper-100">
      <Sidebar />
      <div className="lg:pl-64">
        <Topbar />
        <main className="mx-auto max-w-4xl px-6 py-8 lg:px-10">
          <div className="mb-7">
            <h1 className="font-display text-2xl font-bold tracking-tight text-navy-900">Site public de l&rsquo;école</h1>
            <p className="mt-1 text-sm text-ink-500">
              Le site internet présenté aux parents et aux visiteurs : présentation, cycles, tarifs, services et contact.
            </p>
          </div>
          <SitePublicForm
            initial={site}
            logoPortail={logoPortail}
            peutModifier={peutFaire(ctx.role, "parametres:manage")}
          />
        </main>
      </div>
    </div>
  );
}
