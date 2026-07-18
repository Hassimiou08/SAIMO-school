import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

/**
 * @swagger
 * /api/presences:
 *   post:
 *     summary: Enregistrer la présence pour une séance
 *     description: Marque les présences, absences ou retards pour une séance donnée.
 *     tags:
 *       - Presences
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - seanceId
 *               - classeId
 *               - presences
 *             properties:
 *               seanceId:
 *                 type: string
 *               classeId:
 *                 type: string
 *               periodeId:
 *                 type: string
 *               presences:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     eleveId:
 *                       type: string
 *                     statut:
 *                       type: string
 *                       enum: [present, absent, retard]
 *                     motif:
 *                       type: string
 *     responses:
 *       201:
 *         description: Présences enregistrées avec succès
 *       401:
 *         description: Non authentifié
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.etablissementId) {
      return NextResponse.json({ erreur: "Non authentifié" }, { status: 401 });
    }

    const body = await request.json();
    const { seanceId, classeId, periodeId, presences } = body;

    const data = presences.map((p: any) => ({
      seanceId,
      classeId,
      periodeId,
      eleveId: p.eleveId,
      statut: p.statut,
      motif: p.motif,
      enregistrePar: session.user?.id,
    }));

    // RM-14 : l'enregistrement des absences fait l'objet de journalisation implicite via Prisma ou audit métier si nécessaire
    await prisma.$transaction(
      data.map((item: any) =>
        prisma.presence.upsert({
          where: { seanceId_eleveId: { seanceId: item.seanceId, eleveId: item.eleveId } },
          create: item,
          update: {
            statut: item.statut,
            motif: item.motif,
            enregistrePar: item.enregistrePar,
          },
        })
      )
    );

    return NextResponse.json({ succes: true }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { erreur: error instanceof Error ? error.message : "Erreur serveur" },
      { status: 400 }
    );
  }
}

/**
 * @swagger
 * /api/presences:
 *   get:
 *     summary: Liste des absences non justifiées
 *     description: Récupère les absences d'une classe ou d'un élève.
 *     tags:
 *       - Presences
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: classeId
 *         required: false
 *         schema:
 *           type: string
 *       - in: query
 *         name: eleveId
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Liste des présences récupérée
 *       401:
 *         description: Non authentifié
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.etablissementId) {
      return NextResponse.json({ erreur: "Non authentifié" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const classeId = searchParams.get("classeId");
    const eleveId = searchParams.get("eleveId");

    const presences = await prisma.presence.findMany({
      where: {
        classe: { etablissementId: session.user.etablissementId },
        ...(classeId && { classeId }),
        ...(eleveId && { eleveId }),
        statut: { in: ["absent", "retard"] },
        justifie: false,
      },
      include: {
        eleve: true,
        seance: { include: { matiere: true } }
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(presences);
  } catch (error) {
    return NextResponse.json({ erreur: "Erreur serveur" }, { status: 500 });
  }
}
