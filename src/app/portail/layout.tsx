import { redirect } from "next/navigation";
import { getCurrentUserView, homeForRole } from "@/server/context";
import { UserProvider } from "@/components/providers/UserProvider";

export default async function PortailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const view = await getCurrentUserView();

  // Un COMPTABLE / PARENT / ELEVE n'a rien à faire dans le portail personnel.
  const home = homeForRole(view.role);
  if (home !== "/portail") redirect(home);

  return <UserProvider value={view}>{children}</UserProvider>;
}
