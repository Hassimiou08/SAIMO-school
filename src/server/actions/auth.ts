"use server";

import { signIn, signOut } from "@/lib/auth";
import { AuthError } from "next-auth";

export async function actionConnexion(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Identifiants invalides.";
        default:
          return "Une erreur est survenue.";
      }
    }
    throw error;
  }
}

export async function actionDeconnexion() {
  await signOut();
}
