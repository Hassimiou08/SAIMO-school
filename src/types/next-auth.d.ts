import NextAuth, { type DefaultSession } from "next-auth";
import type { RoleUtilisateur } from "@prisma/client";

declare module "next-auth" {
  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      id: string;
      etablissementId?: string;
      role?: RoleUtilisateur;
    } & DefaultSession["user"];
  }

  interface User {
    etablissementId?: string;
    role?: RoleUtilisateur;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    etablissementId?: string;
    role?: RoleUtilisateur;
  }
}
