import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "@/auth.config";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  // callbacks (jwt / session / authorized) sont définis dans authConfig.
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (!parsedCredentials.success) return null;

        const { email, password } = parsedCredentials.data;

        const user = await prisma.utilisateur.findUnique({
          where: { email },
          include: { etablissements: true },
        });

        if (!user || !user.motDePasseHash || !user.actif) return null;

        const passwordsMatch = await bcrypt.compare(password, user.motDePasseHash);
        if (!passwordsMatch) return null;

        await prisma.utilisateur.update({
          where: { id: user.id },
          data: { derniereConnexion: new Date(), tentativesConnexion: 0 },
        });

        const lien = user.etablissements.find((e) => e.actif);

        return {
          id: user.id,
          email: user.email,
          name: `${user.prenom} ${user.nom}`,
          etablissementId: lien?.etablissementId,
          role: lien?.role,
        };
      },
    }),
  ],
});
