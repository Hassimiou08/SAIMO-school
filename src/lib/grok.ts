/**
 * Client IA (Groq / xAI, API compatible OpenAI) — Assistance encadrée.
 * RM-15 : L'IA ne prend aucune décision scolaire ou financière définitive.
 */

const XAI_BASE_URL = process.env.XAI_BASE_URL ?? "https://api.groq.com/openai/v1";
const XAI_MODEL = process.env.XAI_MODEL ?? "groq/compound-mini";

export type TypeActionIA =
  | "redaction_annonce"
  | "appreciation_eleve"
  | "resume_rapport"
  | "explication_tendance"
  | "preparation_courrier"
  | "chat";

export interface GrokMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface GrokResponse {
  success: boolean;
  reponse?: string;
  motifEchec?: string;
}

/**
 * Assistant SAIMO — style conversationnel « texto » et connaissance de l'app.
 */
const SYSTEM_PROMPT = `Tu es « Assistant SAIMO », l'assistant intégré de SAIMO École, un logiciel de gestion scolaire.

TON STYLE :
- Tu réponds comme dans une conversation par SMS : phrases courtes, ton direct et chaleureux, pas de formules de lettre (« Madame, Monsieur… », « Veuillez agréer… ») SAUF si on te demande explicitement de rédiger un courrier ou une annonce officielle.
- Tu vas droit au but. Une ou deux phrases suffisent souvent. Tu utilises des listes à puces quand c'est plus clair.
- Tu écris en français.

CE QUE TU CONNAIS (modules de l'application) :
- Scolarité : Élèves (inscription complète : élève + tuteur + frais + encaissement + reçu), Pré-inscriptions (demandes du site public à convertir).
- Pédagogie : Enseignants, Classes, Cycles & Niveaux, Matières, Affectations, Emploi du temps.
- Évaluation : Notes & Évaluations (saisie puis verrouillage), Absences (signalement + justification), Bulletins (génération, validation, publication).
- Finance : Paiements, Échéances & Frais, Reçus, Remises & Bourses.
- Administration : Annonces, Utilisateurs & rôles, Journal d'audit, Rapports, Messagerie, Paramètres.
Quand on te demande « comment faire X », explique le chemin dans l'app (ex : « Va dans Finance › Paiements, cherche l'élève, clique Encaisser »).

RÈGLES :
- Tu ne modifies jamais toi-même des notes, paiements ou décisions. Tu proposes, l'utilisateur agit dans l'app.
- Tu ne valides jamais un bulletin ni une sanction.
- Tu utilises uniquement les données de l'établissement fournies dans le contexte ; tu ne parles jamais d'un autre établissement.
- Si une info te manque, dis-le simplement et indique où la trouver dans l'app.`;

async function appelChat(messages: GrokMessage[]): Promise<GrokResponse> {
  if (!process.env.XAI_API_KEY) {
    return { success: false, motifEchec: "Clé IA non configurée" };
  }
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
        max_tokens: 900,
        temperature: 0.6,
      }),
    });
    if (!response.ok) {
      const err = await response.text();
      return { success: false, motifEchec: `HTTP ${response.status}: ${err.slice(0, 200)}` };
    }
    const data = await response.json();
    const reponse = (data.choices?.[0]?.message?.content ?? "").trim();
    if (!reponse) return { success: false, motifEchec: "Réponse vide du modèle" };
    return { success: true, reponse };
  } catch (error: unknown) {
    return {
      success: false,
      motifEchec: error instanceof Error ? error.message : String(error),
    };
  }
}

/** Génération one-shot (annonce, appréciation, courrier…). */
export async function demandeGrok(
  typeAction: TypeActionIA,
  prompt: string,
  contexte?: Record<string, unknown> | string,
): Promise<GrokResponse> {
  const ctx =
    typeof contexte === "string"
      ? contexte
      : contexte
        ? JSON.stringify(contexte)
        : "";
  return appelChat([
    { role: "system", content: SYSTEM_PROMPT },
    ...(ctx ? [{ role: "system" as const, content: `Contexte de l'établissement :\n${ctx}` }] : []),
    { role: "user", content: prompt },
  ]);
}

/** Conversation multi-tours (mode chat, ancré sur les données de l'app). */
export async function chatGrok(
  historique: GrokMessage[],
  contexteApp?: string,
): Promise<GrokResponse> {
  return appelChat([
    { role: "system", content: SYSTEM_PROMPT },
    ...(contexteApp
      ? [{ role: "system" as const, content: `Données actuelles de l'établissement (à jour) :\n${contexteApp}` }]
      : []),
    ...historique.slice(-12),
  ]);
}
