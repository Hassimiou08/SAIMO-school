import { redirect } from "next/navigation";
import { getCurrentUserView, homeForRole } from "@/server/context";
import { UserProvider } from "@/components/providers/UserProvider";
import { EnfantsProvider } from "@/components/parent/EnfantsProvider";
import { mesEnfants, getContexteParent } from "@/server/dal/parent";

export default async function ParentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const view = await getCurrentUserView();

  if (view.role !== "PARENT" && view.role !== "ELEVE") {
    redirect(homeForRole(view.role));
  }

  const [enfants, ctx] = await Promise.all([mesEnfants(), getContexteParent()]);

  return (
    <UserProvider value={view}>
      <EnfantsProvider value={{ enfants, estEleve: ctx.estEleve }}>
        {children}
      </EnfantsProvider>
    </UserProvider>
  );
}
