import { ParentShell } from "@/components/parent/ParentShell";
import { MessagerieView } from "@/components/portal/MessagerieView";
import { listerConversations, listerContactsMessagerie } from "@/server/dal/admin";

export const metadata = { title: "Messagerie — Espace Parent SAIMO" };

export default async function MessagerieParentPage() {
  const [conversations, contacts] = await Promise.all([
    listerConversations(),
    listerContactsMessagerie(),
  ]);

  return (
    <ParentShell max="max-w-3xl">
      <div className="mb-7">
        <h1 className="font-display text-2xl font-bold tracking-tight text-neutral-900">Messagerie</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Contactez l&rsquo;administration et les enseignants.
        </p>
      </div>
      <MessagerieView
        conversations={conversations}
        contacts={contacts}
        basePath="/parent/messagerie"
      />
    </ParentShell>
  );
}
