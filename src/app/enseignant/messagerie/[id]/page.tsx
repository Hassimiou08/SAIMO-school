import { EnseignantShell } from "@/components/enseignant/Shell";
import { MessageThread } from "@/components/portal/MessageThread";
import { getConversation } from "@/server/dal/admin";

export default async function ConversationEnseignantPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const conversation = await getConversation(id);

  return (
    <EnseignantShell>
      <MessageThread conversation={conversation} retour="/enseignant/messagerie" />
    </EnseignantShell>
  );
}
