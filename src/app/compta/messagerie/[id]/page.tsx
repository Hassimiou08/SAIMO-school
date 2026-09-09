import { ComptaShell } from "@/components/compta/ComptaShell";
import { MessageThread } from "@/components/portal/MessageThread";
import { getConversation } from "@/server/dal/admin";

export default async function ComptaConversationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const conversation = await getConversation(id);

  return (
    <ComptaShell wide={false}>
      <MessageThread conversation={conversation} retour="/compta/messagerie" />
    </ComptaShell>
  );
}
