import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

// Next.js 16 : « middleware » est renommé « proxy ». Même fonctionnement.
// L'enforcement réel de l'autorisation se fait dans les layouts de segment
// (src/app/{portail,compta,parent}/layout.tsx) et la couche DAL (src/server).
export default NextAuth(authConfig).auth;

export const config = {
  // Ne pas exécuter le proxy sur les routes API, les assets Next et les images.
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
