import OwnerMessagesClient from "@/components/owner/OwnerMessagesClient";
import { getCurrentUser } from "@/lib/auth/server";
import { getConversationsForOwner, getMessagesForConversation } from "@/lib/data/messages";
import type { ConversationDoc, MessageDoc } from "@/lib/firebase/types";

export const metadata = {
  title: "Messages | Owner Portal — RentEase",
  description: "Communicate with prospective tenants and manage inquiries from your property portal inbox.",
};

export default async function OwnerMessagesPage() {
  const currentUser = await getCurrentUser();

  let conversations: ConversationDoc[] = [];
  let initialMessages: MessageDoc[] = [];

  if (currentUser) {
    conversations = await getConversationsForOwner(currentUser.uid);
    if (conversations.length > 0) {
      initialMessages = await getMessagesForConversation(conversations[0].id);
    }
  }

  return (
    <OwnerMessagesClient
      initialConversations={conversations}
      initialMessages={initialMessages}
      currentUserId={currentUser?.uid ?? null}
    />
  );
}
