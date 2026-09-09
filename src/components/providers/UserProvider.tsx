"use client";

import { createContext, useContext } from "react";
import type { RoleUtilisateur } from "@prisma/client";

export interface CurrentUser {
  id: string;
  name: string;
  email: string;
  photo: string | null;
  role: RoleUtilisateur;
  etablissementNom: string | null;
}

const UserContext = createContext<CurrentUser | null>(null);

export function UserProvider({
  value,
  children,
}: {
  value: CurrentUser;
  children: React.ReactNode;
}) {
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

/** Utilisateur connecté. Doit être appelé sous un <UserProvider>. */
export function useCurrentUser(): CurrentUser {
  const ctx = useContext(UserContext);
  if (!ctx) {
    throw new Error("useCurrentUser doit être utilisé dans un <UserProvider>.");
  }
  return ctx;
}

/** Variante tolérante : renvoie null hors provider (composants en transition). */
export function useCurrentUserOptional(): CurrentUser | null {
  return useContext(UserContext);
}

export { libelleRole, initiales } from "@/lib/roles-labels";
