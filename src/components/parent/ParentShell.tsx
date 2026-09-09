import { ParentSidebar } from "@/components/parent/ParentSidebar";
import { ParentTopbar } from "@/components/parent/ParentTopbar";

export function ParentShell({
  children,
  max = "max-w-5xl",
}: {
  children: React.ReactNode;
  max?: string;
}) {
  return (
    <div className="min-h-screen bg-neutral-50">
      <ParentSidebar />
      <div className="lg:pl-64">
        <ParentTopbar />
        <main className={`mx-auto ${max} px-6 py-8 lg:px-10`}>{children}</main>
      </div>
    </div>
  );
}

export function AucunEnfant() {
  return (
    <ParentShell>
      <div className="rounded-2xl border border-dashed border-neutral-300 bg-white p-12 text-center">
        <p className="text-sm text-neutral-600">
          Aucun élève n&rsquo;est rattaché à votre compte pour l&rsquo;année en cours.
          Contactez le secrétariat de l&rsquo;établissement.
        </p>
      </div>
    </ParentShell>
  );
}
