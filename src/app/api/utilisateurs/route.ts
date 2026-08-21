import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import bcrypt from "bcryptjs";

/**
 * @swagger
 * /api/utilisateurs:
 *   post:
 *     summary: Créer un utilisateur (Staff)
 *     description: Crée un compte utilisateur (ex: Directeur, Secrétaire) et lui assigne un rôle dans l'établissement.
 *     tags:
 *       - Sécurité
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - prenom
 *               - nom
 *               - role
 *             properties:
 *               email:
 *                 type: string
 *               prenom:
 *                 type: string
 *               nom:
 *                 type: string
 *               telephone:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [ADMIN_ETABLISSEMENT, DIRECTEUR, SECRETAIRE, COMPTABLE, ENSEIGNANT]
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès
 *       400:
 *         description: Email déjà utilisé
 *       401:
 *         description: Non authentifié
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.etablissementId) {
      return NextResponse.json({ erreur: "Non authentifié" }, { status: 401 });
    }

    const { email, prenom, nom, telephone, role } = await request.json();

    const existant = await prisma.utilisateur.findUnique({ where: { email } });
    if (existant) {
      return NextResponse.json({ erreur: "Cet email est déjà utilisé" }, { status: 400 });
    }

    // Mot de passe par défaut pour le nouveau staff
    const motDePasseHash = await bcrypt.hash("Bienvenue123!", 10);

    const utilisateur = await prisma.utilisateur.create({
      data: {
        email,
        prenom,
        nom,
        telephone,
        motDePasseHash,
        etablissements: {
          create: {
            etablissementId: session.user.etablissementId,
            role,
          }
        }
      }
    });

    // Si c'est un enseignant, créer l'entrée correspondante
    if (role === "ENSEIGNANT" || role === "PROF_PRINCIPAL") {
      await prisma.enseignant.create({
        data: {
          utilisateurId: utilisateur.id,
          etablissementId: session.user.etablissementId,
        }
      });
    }

    return NextResponse.json({ id: utilisateur.id, email: utilisateur.email, role }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ erreur: "Erreur serveur" }, { status: 500 });
  }
}
