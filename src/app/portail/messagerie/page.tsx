import type { Metadata } from "next";
import { Sidebar } from "@/components/portal/Sidebar";
import { Topbar } from "@/components/portal/Topbar";
import { MessagerieView } from "@/components/portal/MessagerieView";
import { listerConversations, listerContactsMessagerie } from "@/server/dal/admin";

export const metadata: Metadata = { title: "Messagerie — Portail SAIMO" };

export default async function MessageriePage() {
  const [conversations, contacts] = await Promise.all([
    listerConversations(),
    listerContactsMessagerie(),
  ]);

  return (
    <div className="min-h-screen bg-paper-100">
      <Sidebar />
      <div className="lg:pl-64">
        <Topbar />
        <main className="mx-auto max-w-3xl px-6 py-8 lg:px-10">
          <div className="mb-7">
            <h1 className="font-display text-2xl font-bold tracking-tight text-navy-900">Messagerie</h1>
            <p className="mt-1 text-sm text-ink-500">Échanges internes avec l&rsquo;équipe.</p>
          </div>
          <MessagerieView conversations={conversations} contacts={contacts} />
        </main>
      </div>
    </div>
  );
}
