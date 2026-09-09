import { Sidebar } from "@/components/portal/Sidebar";
import { Topbar } from "@/components/portal/Topbar";
import { MessageThread } from "@/components/portal/MessageThread";
import { getConversation } from "@/server/dal/admin";

export default async function ConversationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const conversation = await getConversation(id);

  return (
    <div className="min-h-screen bg-paper-100">
      <Sidebar />
      <div className="lg:pl-64">
        <Topbar />
        <main className="mx-auto max-w-3xl px-6 py-8 lg:px-10">
          <MessageThread conversation={conversation} />
        </main>
      </div>
    </div>
  );
}
