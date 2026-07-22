import { redirect } from "next/navigation";
import OwnerMessagesClient from "@/components/owner/OwnerMessagesClient";
import { getCurrentUser, hasRole } from "@/lib/auth/server";
import { isAdminConfigured } from "@/lib/firebase/admin";
import { getConversationsForOwner, getMessagesForConversation } from "@/lib/data/messages";
import type { ConversationDoc, MessageDoc } from "@/lib/firebase/types";
import BackendNotConfigured from "@/components/ui/BackendNotConfigured";

export const metadata = {
  title: "Messages | Owner Portal — RentEase",
  description: "Communicate with prospective tenants and manage inquiries from your property portal inbox.",
};

export default async function OwnerMessagesPage() {
  if (!isAdminConfigured()) {
    return (
      <div className="min-h-screen bg-[#060606] flex items-center justify-center">
        <BackendNotConfigured message="The owner messages portal reads live data from Firestore, but no Firebase credentials are configured yet." />
      </div>
    );
  }

  const currentUser = await getCurrentUser();
  if (!currentUser) redirect("/login?next=/owner/messages");
  if (currentUser.suspended || !hasRole(currentUser, "owner")) redirect("/");

  let conversations: ConversationDoc[] = [];
  let initialMessages: MessageDoc[] = [];

  try {
    conversations = await getConversationsForOwner(currentUser.uid);
    if (conversations.length > 0) {
      initialMessages = await getMessagesForConversation(conversations[0].id);
    }
  } catch {
    conversations = [];
    initialMessages = [];
  }

  return (
    <OwnerMessagesClient
      initialConversations={conversations}
      initialMessages={initialMessages}
      currentUserId={currentUser.uid}
    />
  );
}
