"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Send, Paperclip, Phone, Video, MoreHorizontal, Calendar, Home, Star, MessageSquare } from "lucide-react";
import OwnerSidebar from "./OwnerSidebar";
import type { ConversationDoc, MessageDoc } from "@/lib/firebase/types";

interface Props {
  initialConversations: ConversationDoc[];
  initialMessages: MessageDoc[];
  currentUserId: string | null;
}

function Avatar({ name, online, size = "md" }: { name: string; online?: boolean; size?: "sm" | "md" | "lg" }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  const s = { sm: "w-8 h-8 text-xs", md: "w-10 h-10 text-sm", lg: "w-12 h-12 text-base" }[size];
  return (
    <div className="relative flex-shrink-0">
      <div className={`${s} rounded-full bg-gradient-to-br from-[#00C853] to-[#006e27] flex items-center justify-center font-semibold text-[#0d0d0d]`}>
        {initials || "U"}
      </div>
      {online !== undefined && (
        <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-[#0d0e10] ${online ? "bg-[#00C853]" : "bg-[#4a5568]"}`} />
      )}
    </div>
  );
}

export default function OwnerMessagesClient({ initialConversations, initialMessages, currentUserId }: Props) {
  const [conversations, setConversations] = useState<ConversationDoc[]>(initialConversations);
  const [activeId, setActiveId] = useState<string | null>(initialConversations[0]?.id || null);
  const [messages, setMessages] = useState<MessageDoc[]>(initialMessages);
  const [inputVal, setInputVal] = useState("");
  const [sending, setSending] = useState(false);
  const [search, setSearch] = useState("");

  const active = conversations.find((c) => c.id === activeId);

  const filteredConversations = conversations.filter(
    (c) =>
      c.tenantName.toLowerCase().includes(search.toLowerCase()) ||
      c.propertyTitle.toLowerCase().includes(search.toLowerCase()) ||
      c.lastMessage.toLowerCase().includes(search.toLowerCase())
  );

  const handleSend = async () => {
    if (!inputVal.trim() || !activeId || sending) return;
    const text = inputVal.trim();
    setInputVal("");
    setSending(true);

    const tempMessage: MessageDoc = {
      id: `temp-${Date.now()}`,
      conversationId: activeId,
      senderId: currentUserId || "owner",
      senderRole: "owner",
      text,
      createdAt: Date.now(),
    };

    setMessages((prev) => [...prev, tempMessage]);

    try {
      const res = await fetch("/api/messages/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId: activeId, text }),
      });

      if (!res.ok) throw new Error("Failed to send");

      const data = await res.json();
      setMessages((prev) => prev.map((m) => (m.id === tempMessage.id ? data.message : m)));

      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeId ? { ...c, lastMessage: text, lastMessageAt: Date.now() } : c
        )
      );
    } catch {
      // Rollback on error
      setMessages((prev) => prev.filter((m) => m.id !== tempMessage.id));
      setInputVal(text);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0e10] flex">
      <div className="fixed left-4 top-4 bottom-4 z-20 hidden lg:block">
        <OwnerSidebar active="messages" />
      </div>

      <main className="flex-1 lg:pl-[100px] flex h-screen overflow-hidden">
        {/* Inbox */}
        <motion.div
          className="w-80 flex-shrink-0 border-r border-[#1f1f1f] flex flex-col"
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
        >
          <div className="p-5 border-b border-[#1f1f1f]">
            <h2 className="font-heading text-xl font-bold text-white mb-3">Inbox</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4a5568]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search conversations…"
                className="w-full bg-[#131313] border border-[#232323] rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-[#4a5568] focus:outline-none focus:border-[#00C853]/50 transition-colors"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredConversations.length === 0 ? (
              <div className="p-6 text-center text-[#6b7280]">
                <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm font-medium">No messages yet</p>
                <p className="text-xs mt-1">Tenant inquiries will appear here.</p>
              </div>
            ) : (
              filteredConversations.map((conv, i) => (
                <motion.button
                  key={conv.id}
                  onClick={() => setActiveId(conv.id)}
                  className={`w-full text-left p-4 flex gap-3 border-b border-[#1a1a1a] transition-colors ${
                    activeId === conv.id ? "bg-[#131313] border-l-2 border-l-[#00C853]" : "hover:bg-[#111]"
                  }`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.3 }}
                >
                  <Avatar name={conv.tenantName} />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-0.5">
                      <p className="text-sm font-semibold text-white truncate">{conv.tenantName}</p>
                      <span className="text-[10px] text-[#4a5568] ml-1 flex-shrink-0">
                        {new Date(conv.lastMessageAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                    <p className="text-xs text-[#00C853] truncate mb-0.5">{conv.propertyTitle}</p>
                    <p className="text-xs text-[#6b7280] truncate">{conv.lastMessage || "No messages yet"}</p>
                  </div>
                  {conv.unreadByOwner > 0 && (
                    <span className="w-5 h-5 rounded-full bg-[#00C853] text-[#0d0d0d] text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-1">
                      {conv.unreadByOwner}
                    </span>
                  )}
                </motion.button>
              ))
            )}
          </div>
        </motion.div>

        {/* Chat window */}
        {active ? (
          <div className="flex-1 flex flex-col overflow-hidden">
            <motion.div
              className="flex items-center justify-between px-6 py-4 border-b border-[#1f1f1f]"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center gap-3">
                <Avatar name={active.tenantName} size="lg" />
                <div>
                  <p className="font-semibold text-white">{active.tenantName}</p>
                  <p className="text-xs text-[#00C853]">{active.propertyTitle}</p>
                </div>
              </div>
            </motion.div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <AnimatePresence>
                {messages.map((msg, i) => {
                  const isOwner = msg.senderRole === "owner" || msg.senderId === currentUserId;
                  return (
                    <motion.div
                      key={msg.id}
                      className={`flex ${isOwner ? "justify-end" : "justify-start"} gap-3`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04, duration: 0.3 }}
                    >
                      {!isOwner && <Avatar name={active.tenantName} size="sm" />}
                      <div className={`max-w-[70%] flex flex-col gap-1 ${isOwner ? "items-end" : "items-start"}`}>
                        <div
                          className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                            isOwner
                              ? "bg-[#00C853] text-[#0d0d0d] font-medium rounded-br-sm"
                              : "bg-[#131313] border border-[#232323] text-white rounded-bl-sm"
                          }`}
                        >
                          {msg.text}
                        </div>
                        <span className="text-[10px] text-[#4a5568]">
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Compose */}
            <div className="p-4 border-t border-[#1f1f1f]">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center gap-3 bg-[#131313] border border-[#232323] rounded-2xl px-4 py-3 focus-within:border-[#00C853]/50 transition-colors"
              >
                <input
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  placeholder="Write a message…"
                  disabled={sending}
                  className="flex-1 bg-transparent text-sm text-white placeholder-[#4a5568] focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!inputVal.trim() || sending}
                  className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                    inputVal.trim() && !sending
                      ? "bg-[#00C853] text-[#0d0d0d] hover:bg-[#00ff66]"
                      : "bg-[#1a1c1e] text-[#4a5568]"
                  }`}
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-[#6b7280]">
            <div className="text-center">
              <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p className="text-base font-medium text-white">Select a conversation</p>
              <p className="text-xs mt-1 text-[#4a5568]">Messages with prospective tenants will appear here.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
