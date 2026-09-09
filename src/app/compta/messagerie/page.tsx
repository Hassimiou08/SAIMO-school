import type { Metadata } from "next";
import { ComptaShell } from "@/components/compta/ComptaShell";
import { MessagerieView } from "@/components/portal/MessagerieView";
import {
  listerConversations,
  listerContactsMessagerie,
} from "@/server/dal/admin";

export const metadata: Metadata = {
  title: "Messagerie — Portail comptable SAIMO",
};

export default async function ComptaMessageriePage() {
  const [conversations, contacts] = await Promise.all([
    listerConversations(),
    listerContactsMessagerie(),
  ]);

  return (
    <ComptaShell wide={false}>
      <div className="mb-7">
        <h1 className="font-display text-2xl font-bold tracking-tight text-neutral-900">
          Messagerie
        </h1>
        <p className="mt-1 text-sm text-neutral-500">
          Échanges internes avec l&rsquo;équipe.
        </p>
      </div>
      <MessagerieView
        conversations={conversations}
        contacts={contacts}
        basePath="/compta/messagerie"
      />
    </ComptaShell>
  );
}
