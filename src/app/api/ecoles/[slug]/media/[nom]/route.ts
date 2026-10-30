import { NextResponse } from "next/server";
import { getMediaSiteEcole } from "@/server/dal/site-ecole";

/**
 * Sert une image du site public d'une école (logo, photo d'accueil, galerie).
 * L'adresse contient une empreinte (?v=…) qui change avec l'image : on peut donc
 * la mettre en cache longtemps sans risque de montrer une version périmée.
 */
export async function GET(_req: Request, { params }: { params: Promise<{ slug: string; nom: string }> }) {
  const { slug, nom } = await params;
  const dataUri = await getMediaSiteEcole(slug, nom);
  const m = dataUri ? /^data:(image\/(?:png|jpeg|webp));base64,(.+)$/.exec(dataUri) : null;
  if (!m) return NextResponse.json({ erreur: "Image introuvable" }, { status: 404 });

  return new NextResponse(Buffer.from(m[2], "base64"), {
    headers: {
      "Content-Type": m[1],
      "Cache-Control": "public, max-age=86400, s-maxage=31536000, stale-while-revalidate=604800",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
