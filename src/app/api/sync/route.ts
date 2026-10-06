import { NextResponse } from "next/server";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { messageErreur } from "@/server/errors";
import { estTypeOperation, executerHandler } from "@/server/sync/handlers";
import type { ResultatOperation } from "@/lib/offline/operations";

// Synchronisation des opérations saisies sur un appareil (mode hors ligne).
// Les opérations sont appliquées dans l'ordre reçu ; chaque id n'est appliqué
// qu'une seule fois, même si l'appareil le renvoie (connexion coupée pendant
// la réponse, plusieurs onglets…).

const schemaCorps = z.object({
  operations: z
    .array(
      z.object({
        id: z.string().uuid(),
        type: z.string(),
        payload: z.unknown(),
        saisieLe: z.string(),
      }),
    )
    .max(50),
});

// Au-delà, une opération « en cours » est considérée comme abandonnée
// (serveur interrompu) et peut être rejouée.
const ABANDON_MS = 5 * 60_000;
// Fenêtre acceptée pour la date de saisie hors ligne.
const ANCIENNETE_MAX_MS = 90 * 24 * 3600_000;

function dateDeSaisie(iso: string): Date {
  const d = new Date(iso);
  const maintenant = Date.now();
  if (Number.isNaN(d.getTime())) return new Date();
  if (d.getTime() > maintenant || d.getTime() < maintenant - ANCIENNETE_MAX_MS) {
    return new Date();
  }
  return d;
}

export async function POST(request: Request) {
  const session = await auth();
  const utilisateurId = session?.user?.id;
  const etablissementId = session?.user?.etablissementId;
  if (!utilisateurId || !etablissementId) {
    return NextResponse.json({ erreur: "Non connecté" }, { status: 401 });
  }

  const parsed = schemaCorps.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ erreur: "Requête invalide" }, { status: 400 });
  }

  const resultats: ResultatOperation[] = [];
  for (const op of parsed.data.operations) {
    resultats.push(await appliquer(op, utilisateurId, etablissementId));
  }
  return NextResponse.json({ resultats });
}

async function appliquer(
  op: { id: string; type: string; payload: unknown; saisieLe: string },
  utilisateurId: string,
  etablissementId: string,
): Promise<ResultatOperation> {
  if (!estTypeOperation(op.type)) {
    return { id: op.id, succes: false, erreur: "Type d'opération inconnu." };
  }

  // 1. Déjà vue ?
  const existante = await prisma.operationSync.findUnique({ where: { id: op.id } });
  if (existante) {
    if (existante.utilisateurId !== utilisateurId) {
      return { id: op.id, succes: false, erreur: "Opération invalide." };
    }
    if (existante.statut === "appliquee") {
      return { id: op.id, succes: true, data: existante.resultat };
    }
    if (Date.now() - existante.synchroniseLe.getTime() < ABANDON_MS) {
      return { id: op.id, succes: false, erreur: "Opération déjà en cours de traitement, réessayez dans un instant." };
    }
    await prisma.operationSync.delete({ where: { id: op.id } });
  }

  // 2. La réserver (un seul traitement à la fois pour cet id).
  const saisieLe = dateDeSaisie(op.saisieLe);
  try {
    await prisma.operationSync.create({
      data: { id: op.id, utilisateurId, etablissementId, type: op.type, saisieLe },
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return { id: op.id, succes: false, erreur: "Opération déjà en cours de traitement, réessayez dans un instant." };
    }
    throw e;
  }

  // 3. L'appliquer avec la logique habituelle de l'écran.
  let r;
  try {
    r = await executerHandler(op.type, op.payload, saisieLe);
  } catch (e) {
    r = { succes: false as const, erreur: messageErreur(e) };
  }

  if (r.succes) {
    const data = r.data ?? null;
    await prisma.operationSync.update({
      where: { id: op.id },
      data: {
        statut: "appliquee",
        resultat: data === null ? Prisma.JsonNull : (data as Prisma.InputJsonValue),
      },
    });
    return { id: op.id, succes: true, data };
  }

  // Refusée : rien n'a été appliqué, l'opération pourra être corrigée et renvoyée.
  await prisma.operationSync.delete({ where: { id: op.id } });
  return { id: op.id, succes: false, erreur: r.erreur };
}
