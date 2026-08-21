import type { Metadata } from "next";
import { Sidebar } from "@/components/portal/Sidebar";
import { Topbar } from "@/components/portal/Topbar";
import { AbsencesTable } from "@/components/portal/AbsencesTable";

export const metadata: Metadata = {
  title: "Absences — Portail SAIMO",
  description: "Suivi des présences et absences.",
};

export default function AbsencesPage() {
  return (
    <div className="min-h-screen bg-paper-100">
      <Sidebar />
      <div className="lg:pl-64">
        <Topbar />
        <main className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
          <div className="mb-7">
            <h1 className="font-display text-2xl font-bold tracking-tight text-navy-900">
              Présences & Absences
            </h1>
            <p className="mt-1 text-sm text-ink-500">
              Registre des absences, retards et justifications.
            </p>
          </div>
          <AbsencesTable />
        </main>
      </div>
    </div>
  );
}
