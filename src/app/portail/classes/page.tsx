import type { Metadata } from "next";
import { Sidebar } from "@/components/portal/Sidebar";
import { Topbar } from "@/components/portal/Topbar";
import { ClassesTable } from "@/components/portal/ClassesTable";
import { listerClassesDetail, listerNiveauxOptions } from "@/server/dal/pedagogie";

export const metadata: Metadata = {
  title: "Classes — Portail SAIMO",
  description: "Liste et gestion des classes de l'établissement.",
};

export default async function ClassesPage() {
  const [classes, niveaux] = await Promise.all([
    listerClassesDetail(),
    listerNiveauxOptions(),
  ]);

  return (
    <div className="min-h-screen bg-paper-100">
      <Sidebar />
      <div className="lg:pl-64">
        <Topbar />
        <main className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
          <div className="mb-7">
            <h1 className="font-display text-2xl font-bold tracking-tight text-navy-900">Classes</h1>
            <p className="mt-1 text-sm text-ink-500">
              {classes.length} classe{classes.length > 1 ? "s" : ""} pour l&rsquo;année en cours.
            </p>
          </div>
          <ClassesTable classes={classes} niveaux={niveaux} />
        </main>
      </div>
    </div>
  );
}
