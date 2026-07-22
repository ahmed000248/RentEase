import "server-only";
import { adminDb } from "@/lib/firebase/admin";
import type { ConversationDoc, MessageDoc, UserDoc } from "@/lib/firebase/types";
import { getReviewersById } from "@/lib/data/properties";

/** All conversations for an owner, ordered by most recent message. */
export async function getConversationsForOwner(ownerId: string): Promise<ConversationDoc[]> {
  const snap = await adminDb()
    .collection("conversations")
    .where("ownerId", "==", ownerId)
    .orderBy("lastMessageAt", "desc")
    .limit(50)
    .get();

  return snap.docs.map((doc) => ({ ...(doc.data() as ConversationDoc), id: doc.id }));
}

/** All conversations for a tenant, ordered by most recent message. */
export async function getConversationsForTenant(tenantId: string): Promise<ConversationDoc[]> {
  const snap = await adminDb()
    .collection("conversations")
    .where("tenantId", "==", tenantId)
    .orderBy("lastMessageAt", "desc")
    .limit(50)
    .get();

  return snap.docs.map((doc) => ({ ...(doc.data() as ConversationDoc), id: doc.id }));
}

/** Messages in a conversation, ordered chronologically. */
export async function getMessagesForConversation(conversationId: string): Promise<MessageDoc[]> {
  const snap = await adminDb()
    .collection("conversations")
    .doc(conversationId)
    .collection("messages")
    .orderBy("createdAt", "asc")
    .limit(100)
    .get();

  return snap.docs.map((doc) => ({ ...(doc.data() as MessageDoc), id: doc.id }));
}

export interface ConversationWithMessages {
  conversation: ConversationDoc;
  messages: MessageDoc[];
  otherParty: UserDoc | null;
}

/** Find or create a conversation between owner and tenant about a property. Returns conversationId. */
export async function findOrCreateConversation(
  ownerId: string,
  tenantId: string,
  propertyId: string,
  propertyTitle: string,
  tenantName: string,
  ownerName: string
): Promise<string> {
  // Check if conversation already exists
  const existing = await adminDb()
    .collection("conversations")
    .where("ownerId", "==", ownerId)
    .where("tenantId", "==", tenantId)
    .where("propertyId", "==", propertyId)
    .limit(1)
    .get();

  if (!existing.empty) return existing.docs[0].id;

  // Create new conversation
  const now = Date.now();
  const convRef = adminDb().collection("conversations").doc();
  const convDoc: Omit<ConversationDoc, "id"> = {
    ownerId,
    tenantId,
    propertyId,
    propertyTitle,
    tenantName,
    ownerName,
    lastMessage: "",
    lastMessageAt: now,
    unreadByOwner: 0,
    unreadByTenant: 0,
    createdAt: now,
  };

  await convRef.set(convDoc);
  return convRef.id;
}
