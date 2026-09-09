import { EnseignantSidebar } from "@/components/enseignant/Sidebar";
import { EnseignantTopbar } from "@/components/enseignant/Topbar";

export function EnseignantShell({
  titre,
  sous,
  children,
  large,
}: {
  titre?: string;
  sous?: string;
  children: React.ReactNode;
  large?: boolean;
}) {
  return (
    <div className="min-h-screen bg-paper-100">
      <EnseignantSidebar />
      <div className="lg:pl-64">
        <EnseignantTopbar />
        <main
          className={`mx-auto ${large ? "max-w-7xl" : "max-w-5xl"} px-6 py-8 lg:px-10`}
        >
          {(titre || sous) && (
            <div className="mb-7">
              {titre && (
                <h1 className="font-display text-2xl font-bold tracking-tight text-navy-900">
                  {titre}
                </h1>
              )}
              {sous && <p className="mt-1 text-sm text-ink-500">{sous}</p>}
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}
