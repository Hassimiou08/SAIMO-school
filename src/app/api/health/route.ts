import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Route de diagnostic temporaire — à supprimer une fois le déploiement stabilisé.
export const dynamic = "force-dynamic";

export async function GET() {
  const url = process.env.DATABASE_URL ?? "";
  const out: Record<string, unknown> = {
    hasDATABASE_URL: !!process.env.DATABASE_URL,
    hasDIRECT_URL: !!process.env.DIRECT_URL,
    hasAUTH_SECRET: !!process.env.AUTH_SECRET,
    authUrl: process.env.AUTH_URL ?? null,
    // hôte + port uniquement, identifiants masqués
    dbTarget: url.replace(/\/\/[^@]*@/, "//***@").replace(/\?.*$/, ""),
  };
  try {
    const r = await prisma.$queryRaw`select 1 as ok`;
    out.db = "ok";
    out.result = r;
  } catch (e) {
    out.db = "error";
    out.errorName = e instanceof Error ? e.name : typeof e;
    out.errorMessage = e instanceof Error ? e.message : String(e);
    const code = (e as { code?: unknown })?.code;
    if (code !== undefined) out.errorCode = code;
  }
  return NextResponse.json(out);
}
