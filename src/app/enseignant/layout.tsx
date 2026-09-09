import { redirect } from "next/navigation";
import { getCurrentUserView, homeForRole } from "@/server/context";
import { UserProvider } from "@/components/providers/UserProvider";

export default async function EnseignantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const view = await getCurrentUserView();

  if (view.role !== "ENSEIGNANT" && view.role !== "PROF_PRINCIPAL") {
    redirect(homeForRole(view.role));
  }

  return <UserProvider value={view}>{children}</UserProvider>;
}
