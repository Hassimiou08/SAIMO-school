import type { Metadata } from "next";
import { EnseignantShell } from "@/components/enseignant/Shell";
import { MessagerieView } from "@/components/portal/MessagerieView";
import { listerConversations, listerContactsMessagerie } from "@/server/dal/admin";

export const metadata: Metadata = { title: "Messagerie — Enseignant SAIMO" };

export default async function MessagerieEnseignantPage() {
  const [conversations, contacts] = await Promise.all([
    listerConversations(),
    listerContactsMessagerie(),
  ]);

  return (
    <EnseignantShell titre="Messagerie" sous="Échanges avec l'équipe et l'administration.">
      <MessagerieView
        conversations={conversations}
        contacts={contacts}
        basePath="/enseignant/messagerie"
      />
    </EnseignantShell>
  );
}
