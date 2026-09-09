"use server";

import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { signIn, signOut } from "@/lib/auth";

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
  await signOut({ redirectTo: "/connexion" });
}
