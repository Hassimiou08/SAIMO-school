/**
 * Client Grok (xAI) — Assistance rédactionnelle encadrée
 * RM-15 : L'IA ne prend aucune décision scolaire ou financière définitive.
 * Toute réponse doit être validée par un humain avant usage officiel.
 */

const XAI_BASE_URL = process.env.XAI_BASE_URL ?? "https://api.x.ai/v1";
const XAI_MODEL = process.env.XAI_MODEL ?? "grok-beta";

export type TypeActionIA =
  | "redaction_annonce"
  | "appreciation_eleve"
  | "resume_rapport"
  | "explication_tendance"
  | "preparation_courrier";

interface GrokMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface GrokResponse {
  success: boolean;
  reponse?: string;
  motifEchec?: string;
}

const SYSTEM_PROMPT = `Tu es un assistant administratif pour SAIMO Ecole, un système de gestion scolaire.
Tu aides à rédiger des annonces, appréciations, résumés et courriers administratifs.
RÈGLES ABSOLUES :
- Tu ne modifies jamais directement des notes, paiements ou décisions officielles.
- Tu ne valides jamais un bulletin ou une sanction disciplinaire.
- Toutes tes réponses sont des PROPOSITIONS soumises à validation humaine.
- Tu ne divulgues jamais d'informations d'autres établissements.
- Tu restes factuel, professionnel et concis.`;

export async function demandeGrok(
  typeAction: TypeActionIA,
  prompt: string,
  contexte?: Record<string, unknown>
): Promise<GrokResponse> {
  if (!process.env.XAI_API_KEY) {
    return {
      success: false,
      motifEchec: "XAI_API_KEY non configurée (fonctionnement autonome maintenu)",
    };
  }

  const messages: GrokMessage[] = [
    { role: "system", content: SYSTEM_PROMPT },
    {
      role: "user",
      content: contexte
        ? `[Contexte : ${JSON.stringify(contexte)}]\n\n${prompt}`
        : prompt,
    },
  ];

  try {
    const response = await fetch(`${XAI_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.XAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: XAI_MODEL,
        messages,
        max_tokens: 1024,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return { success: false, motifEchec: `HTTP ${response.status}: ${err}` };
    }

    const data = await response.json();
    const reponse = data.choices?.[0]?.message?.content ?? "";
    return { success: true, reponse };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    // RM-14 : l'indisponibilité de Grok ne bloque pas les fonctions principales
    return { success: false, motifEchec: message };
  }
}
