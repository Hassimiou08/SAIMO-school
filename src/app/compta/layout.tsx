import { redirect } from "next/navigation";
import { getCurrentUserView, homeForRole } from "@/server/context";
import { peutFaire } from "@/server/permissions/roles";
import { UserProvider } from "@/components/providers/UserProvider";

export default async function ComptaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const view = await getCurrentUserView();

  // Accès au portail comptable : COMPTABLE ou rôle disposant du reporting financier.
  const autorise =
    view.role === "COMPTABLE" || peutFaire(view.role, "rapport:financier");
  if (!autorise) redirect(homeForRole(view.role));

  return <UserProvider value={view}>{children}</UserProvider>;
}
