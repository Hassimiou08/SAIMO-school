import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "@/auth.config";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          
          const user = await prisma.utilisateur.findUnique({
            where: { email },
            include: { etablissements: true }
          });
          
          if (!user || !user.motDePasseHash) return null;
          
          const passwordsMatch = await bcrypt.compare(password, user.motDePasseHash);
          
          if (passwordsMatch) {
            // Update last login
            await prisma.utilisateur.update({
              where: { id: user.id },
              data: {
                derniereConnexion: new Date(),
                tentativesConnexion: 0
              }
            });
            
            // Format user for session
            const userEtablissements = user.etablissements.filter(e => e.actif);
            
            return {
              id: user.id,
              email: user.email,
              name: `${user.prenom} ${user.nom}`,
              // Provide default establishment if available
              etablissementId: userEtablissements.length > 0 ? userEtablissements[0].etablissementId : undefined,
              role: userEtablissements.length > 0 ? userEtablissements[0].role : undefined,
            };
          }
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.etablissementId = user.etablissementId;
        token.role = user.role;
      }
      if (trigger === "update" && session?.etablissementId) {
        token.etablissementId = session.etablissementId;
        token.role = session.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      if (token.role && session.user) {
        session.user.role = token.role as any;
      }
      if (token.etablissementId && session.user) {
        session.user.etablissementId = token.etablissementId as string;
      }
      return session;
    },
  },
  session: { strategy: "jwt" },
});
