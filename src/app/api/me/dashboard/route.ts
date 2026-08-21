import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  obtenirDashboardEnseignant,
  obtenirDashboardEleve,
  obtenirDashboardParent,
  obtenirDashboardComptable,
} from "@/server/services/dashboard.service";

/**
 * @swagger
 * /api/me/dashboard:
 *   get:
 *     summary: Tableau de bord personnalisé
 *     description: Renvoie les données du tableau de bord adaptées au rôle de l'utilisateur connecté.
 *     tags:
 *       - Utilisateurs
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Données du tableau de bord
 *       401:
 *         description: Non authentifié
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id || !session?.user?.etablissementId) {
      return NextResponse.json({ erreur: "Non authentifié" }, { status: 401 });
    }

    const userId = session.user.id;
    const role = session.user.role;
    const etablissementId = session.user.etablissementId;

    if (role === "ENSEIGNANT" || role === "PROF_PRINCIPAL") {
      const data = await obtenirDashboardEnseignant(userId);
      return NextResponse.json({ type: "ENSEIGNANT", mesClasses: data });
    }

    if (role === "ELEVE") {
      const data = await obtenirDashboardEleve(userId);
      return NextResponse.json({ type: "ELEVE", ...data });
    }

    if (role === "PARENT") {
      const data = await obtenirDashboardParent(userId);
      return NextResponse.json({ type: "PARENT", enfants: data });
    }

    if (role === "COMPTABLE") {
      const data = await obtenirDashboardComptable(etablissementId);
      return NextResponse.json({ type: "COMPTABLE", ...data });
    }

    return NextResponse.json({ type: "AUTRE", message: "Utilisez le dashboard admin classique." });
  } catch (error) {
    return NextResponse.json({ erreur: "Erreur serveur" }, { status: 500 });
  }
}
