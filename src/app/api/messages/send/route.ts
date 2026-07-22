import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/server";
import { adminDb } from "@/lib/firebase/admin";
import type { ConversationDoc, MessageDoc } from "@/lib/firebase/types";

export async function POST(request: NextRequest) {
  let currentUser;
  try {
    currentUser = await requireUser();
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unauthorized";
    return NextResponse.json({ error: msg }, { status: 401 });
  }

  const { conversationId, text } = await request.json();

  if (typeof text !== "string" || !text.trim()) {
    return NextResponse.json({ error: "Message text is required" }, { status: 400 });
  }
  if (typeof conversationId !== "string" || !conversationId) {
    return NextResponse.json({ error: "Missing conversationId" }, { status: 400 });
  }

  const convRef = adminDb().collection("conversations").doc(conversationId);
  const convSnap = await convRef.get();

  if (!convSnap.exists) {
    return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
  }

  const conv = convSnap.data() as ConversationDoc;

  // Verify participation
  if (currentUser.uid !== conv.ownerId && currentUser.uid !== conv.tenantId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const senderRole = currentUser.uid === conv.ownerId ? "owner" : "tenant";
  const now = Date.now();

  const msgRef = convRef.collection("messages").doc();
  const messageDoc: MessageDoc = {
    id: msgRef.id,
    conversationId,
    senderId: currentUser.uid,
    senderRole,
    text: text.trim(),
    createdAt: now,
  };

  await msgRef.set(messageDoc);

  // Update conversation summary
  const updates: Partial<ConversationDoc> = {
    lastMessage: text.trim(),
    lastMessageAt: now,
  };

  if (senderRole === "tenant") {
    updates.unreadByOwner = (conv.unreadByOwner || 0) + 1;
  } else {
    updates.unreadByTenant = (conv.unreadByTenant || 0) + 1;
  }

  await convRef.update(updates);

  return NextResponse.json({ ok: true, message: messageDoc });
}
