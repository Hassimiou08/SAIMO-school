import { ParentShell } from "@/components/parent/ParentShell";
import { MessageThread } from "@/components/portal/MessageThread";
import { getConversation } from "@/server/dal/admin";

export default async function ConversationParentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const conversation = await getConversation(id);

  return (
    <ParentShell max="max-w-3xl">
      <MessageThread conversation={conversation} retour="/parent/messagerie" />
    </ParentShell>
  );
}
