import type { Metadata } from "next";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { Sidebar } from "@/components/portal/Sidebar";
import { Topbar } from "@/components/portal/Topbar";
import { ClassesTable } from "@/components/portal/ClassesTable";

export const metadata: Metadata = {
  title: "Classes — Portail SAIMO",
  description: "Liste et gestion des classes de l'établissement.",
};

export default function ClassesPage() {
  return (
    <div className="min-h-screen bg-paper-100">
      <Sidebar />

      <div className="lg:pl-64">
        <Topbar />

        <main className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
          <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="font-display text-2xl font-bold tracking-tight text-navy-900">
                Classes
              </h1>
              <p className="mt-1 text-sm text-ink-500">
                Gestion des classes, des cycles et des effectifs.
              </p>
            </div>
          </div>

          <ClassesTable />
        </main>
      </div>
    </div>
  );
}
