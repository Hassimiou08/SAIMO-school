import type { Metadata } from "next";
import { Sidebar } from "@/components/portal/Sidebar";
import { Topbar } from "@/components/portal/Topbar";
import { AffectationsManager } from "@/components/portal/AffectationsManager";
import {
  listerAffectations,
  listerClassesOptions,
  listerMatieresOptions,
  listerEnseignantsOptions,
} from "@/server/dal/pedagogie";

export const metadata: Metadata = { title: "Affectations — Portail SAIMO" };

export default async function AffectationsPage() {
  const [affectations, classes, matieres, enseignants] = await Promise.all([
    listerAffectations(),
    listerClassesOptions(),
    listerMatieresOptions(),
    listerEnseignantsOptions(),
  ]);
  return (
    <div className="min-h-screen bg-paper-100">
      <Sidebar />
      <div className="lg:pl-64">
        <Topbar />
        <main className="mx-auto max-w-5xl px-6 py-8 lg:px-10">
          <div className="mb-7">
            <h1 className="font-display text-2xl font-bold tracking-tight text-navy-900">Affectations</h1>
            <p className="mt-1 text-sm text-ink-500">Qui enseigne quoi, dans quelle classe.</p>
          </div>
          <AffectationsManager affectations={affectations} classes={classes} matieres={matieres} enseignants={enseignants} />
        </main>
      </div>
    </div>
  );
}
