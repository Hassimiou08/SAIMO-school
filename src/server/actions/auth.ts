"use server";

import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { auth, signIn, signOut } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CLE_SLUG } from "@/lib/site-ecole";
import { getSiteEcole } from "@/server/dal/site-ecole";

async function connecter(
  formData: FormData,
  redirectTo: string,
): Promise<string | undefined> {
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      if (error.type === "CredentialsSignin") return "Identifiants invalides.";
      return "Une erreur est survenue. Veuillez réessayer.";
    }
    throw error;
  }

  // Le layout de segment renverra l'utilisateur vers l'accueil de son rôle
  // (ex. un COMPTABLE arrivé sur /portail est redirigé vers /compta).
  redirect(redirectTo);
}

export async function actionConnexionPersonnel(
  _prevState: string | undefined,
  formData: FormData,
) {
  return connecter(formData, "/portail");
}

export async function actionConnexionParent(
  _prevState: string | undefined,
  formData: FormData,
) {
  return connecter(formData, "/parent");
}

export async function actionDeconnexion() {
  // Retour sur la page de connexion de l'école de l'utilisateur, si elle a un site publié.
  let redirectTo = "/connexion";
  try {
    const session = await auth();
    const etablissementId = session?.user?.etablissementId;
    if (etablissementId) {
      const ref = await prisma.parametre.findUnique({
        where: { etablissementId_cle: { etablissementId, cle: CLE_SLUG } },
        select: { valeur: true },
      });
      if (ref && (await getSiteEcole(ref.valeur))) redirectTo = `/connexion?ecole=${encodeURIComponent(ref.valeur)}`;
    }
  } catch {
    // En cas de souci, on garde la page de connexion générique.
  }
  await signOut({ redirectTo });
}
