import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Sidebar } from "@/components/portal/Sidebar";
import { Topbar } from "@/components/portal/Topbar";
import { StudentProfile } from "@/components/portal/StudentProfile";
import { getStudent, students } from "@/lib/mock-students";

export function generateStaticParams() {
  return students.map((s) => ({ id: s.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const student = getStudent(id);
  return {
    title: student ? `${student.firstName} ${student.lastName} — SAIMO` : "Élève introuvable — SAIMO",
  };
}

export default async function EleveDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const student = getStudent(id);

  if (!student) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-paper-100">
      <Sidebar />

      <div className="lg:pl-64">
        <Topbar />

        <main className="mx-auto max-w-5xl px-6 py-8 lg:px-10">
          <Link
            href="/portail/eleves"
            className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 transition-colors hover:text-navy-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour à la liste des élèves
          </Link>

          <StudentProfile student={student} />
        </main>
      </div>
    </div>
  );
}
