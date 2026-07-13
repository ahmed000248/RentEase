"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Send, Paperclip, Phone, Video, MoreHorizontal, Calendar, Home, Star } from "lucide-react";
import OwnerSidebar from "./OwnerSidebar";

interface Conversation {
  id: string;
  name: string;
  listing: string;
  preview: string;
  time: string;
  unread: number;
  online: boolean;
}

interface Message {
  id: string;
  sender: "owner" | "tenant";
  text: string;
  time: string;
}

const CONVERSATIONS: Conversation[] = [
  { id: "1", name: "Sarah Johnson", listing: "Modern Glass Penthouse", preview: "How about tomorrow at 2 PM?", time: "2 min", unread: 2, online: true },
  { id: "2", name: "Marcus Chen", listing: "Industrial Loft Suite", preview: "Is the utility fee included?", time: "18 min", unread: 1, online: true },
  { id: "3", name: "The Thompsons", listing: "Suburban Family Estate", preview: "Thank you for the quick tour!", time: "1 hr", unread: 0, online: false },
];

const THREAD: Message[] = [
  { id: "1", sender: "tenant", text: "Hi, I'm interested in your penthouse listing. Is it still available for a viewing this week?", time: "10:24 AM" },
  { id: "2", sender: "owner", text: "Yes, it is still available! Would you like to schedule a viewing? I have slots tomorrow afternoon.", time: "10:31 AM" },
  { id: "3", sender: "tenant", text: "That would be great! What times work best for you?", time: "10:45 AM" },
  { id: "4", sender: "tenant", text: "How about tomorrow at 2 PM?", time: "10:46 AM" },
];

function Avatar({ name, online, size = "md" }: { name: string; online?: boolean; size?: "sm" | "md" | "lg" }) {
  const initials = name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  const s = { sm: "w-8 h-8 text-xs", md: "w-10 h-10 text-sm", lg: "w-12 h-12 text-base" }[size];
  return (
    <div className="relative flex-shrink-0">
      <div className={`${s} rounded-full bg-gradient-to-br from-[#00C853] to-[#006e27] flex items-center justify-center font-semibold text-[#0d0d0d]`}>{initials}</div>
      {online !== undefined && <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-[#0d0e10] ${online ? "bg-[#00C853]" : "bg-[#4a5568]"}`} />}
    </div>
  );
}

export default function OwnerMessagesClient() {
  const [activeId, setActiveId] = useState("1");
  const [inputVal, setInputVal] = useState("");
  const active = CONVERSATIONS.find((c) => c.id === activeId)!;

  return (
    <div className="min-h-screen bg-[#0d0e10] flex">
      <div className="fixed left-4 top-4 bottom-4 z-20 hidden lg:block">
        <OwnerSidebar active="messages" />
      </div>

      <main className="flex-1 lg:pl-[100px] flex h-screen overflow-hidden">
        {/* Inbox */}
        <motion.div className="w-80 flex-shrink-0 border-r border-[#1f1f1f] flex flex-col"
          initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}>
          <div className="p-5 border-b border-[#1f1f1f]">
            <h2 className="font-heading text-xl font-bold text-white mb-3">Inbox</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4a5568]" />
              <input type="text" placeholder="Search…" className="w-full bg-[#131313] border border-[#232323] rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-[#4a5568] focus:outline-none focus:border-[#00C853]/50 transition-colors" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {CONVERSATIONS.map((conv, i) => (
              <motion.button key={conv.id} onClick={() => setActiveId(conv.id)}
                className={`w-full text-left p-4 flex gap-3 border-b border-[#1a1a1a] transition-colors ${activeId === conv.id ? "bg-[#131313] border-l-2 border-l-[#00C853]" : "hover:bg-[#111]"}`}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06, duration: 0.3, ease: [0.23, 1, 0.32, 1] }}>
                <Avatar name={conv.name} online={conv.online} />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-0.5">
                    <p className="text-sm font-semibold text-white truncate">{conv.name}</p>
                    <span className="text-[10px] text-[#4a5568] ml-1 flex-shrink-0">{conv.time}</span>
                  </div>
                  <p className="text-xs text-[#00C853] truncate mb-0.5">{conv.listing}</p>
                  <p className="text-xs text-[#6b7280] truncate">{conv.preview}</p>
                </div>
                {conv.unread > 0 && (
                  <span className="w-5 h-5 rounded-full bg-[#00C853] text-[#0d0d0d] text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-1">{conv.unread}</span>
                )}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Chat */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <motion.div className="flex items-center justify-between px-6 py-4 border-b border-[#1f1f1f]"
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}>
            <div className="flex items-center gap-3">
              <Avatar name={active.name} online={active.online} size="lg" />
              <div>
                <p className="font-semibold text-white">{active.name}</p>
                <p className="text-xs text-[#00C853]">{active.listing}</p>
              </div>
            </div>
            <div className="flex gap-2">
              {[Phone, Video, MoreHorizontal].map((Icon, i) => (
                <button key={i} className="w-9 h-9 rounded-xl bg-[#131313] border border-[#232323] flex items-center justify-center text-[#6b7280] hover:text-[#00C853] hover:border-[#00C853]/30 transition-colors">
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </motion.div>

          <div className="px-6 py-3 border-b border-[#1f1f1f]">
            <div className="bg-[#131313] border border-[#00C853]/20 rounded-xl p-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#00C853]/10 flex items-center justify-center">
                <Calendar className="w-4 h-4 text-[#00C853]" />
              </div>
              <div>
                <p className="text-xs font-semibold text-[#00C853]">Appointment Confirmed</p>
                <p className="text-sm text-white">Property Viewing at 2:00 PM</p>
                <p className="text-xs text-[#6b7280]">Tomorrow, October 24th</p>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <AnimatePresence>
              {THREAD.map((msg, i) => (
                <motion.div key={msg.id} className={`flex ${msg.sender === "owner" ? "justify-end" : "justify-start"} gap-3`}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.35, ease: [0.23, 1, 0.32, 1] }}>
                  {msg.sender === "tenant" && <Avatar name={active.name} size="sm" />}
                  <div className={`max-w-[70%] flex flex-col gap-1 ${msg.sender === "owner" ? "items-end" : "items-start"}`}>
                    <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${msg.sender === "owner" ? "bg-[#00C853] text-[#0d0d0d] font-medium rounded-br-sm" : "bg-[#131313] border border-[#232323] text-white rounded-bl-sm"}`}>
                      {msg.text}
                    </div>
                    <span className="text-[10px] text-[#4a5568]">{msg.time}</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="p-4 border-t border-[#1f1f1f]">
            <div className="flex items-center gap-3 bg-[#131313] border border-[#232323] rounded-2xl px-4 py-3 focus-within:border-[#00C853]/50 transition-colors">
              <button className="text-[#4a5568] hover:text-[#00C853] transition-colors"><Paperclip className="w-4 h-4" /></button>
              <input value={inputVal} onChange={(e) => setInputVal(e.target.value)} placeholder="Write a message…"
                className="flex-1 bg-transparent text-sm text-white placeholder-[#4a5568] focus:outline-none" />
              <button className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${inputVal.trim() ? "bg-[#00C853] text-[#0d0d0d]" : "bg-[#1a1c1e] text-[#4a5568]"}`}>
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right panel */}
        <motion.div className="hidden xl:flex w-72 flex-shrink-0 border-l border-[#1f1f1f] flex-col p-5 gap-5"
          initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15, duration: 0.45, ease: [0.23, 1, 0.32, 1] }}>
          <div className="text-center">
            <div className="flex justify-center"><Avatar name={active.name} size="lg" /></div>
            <p className="font-semibold text-white mt-3">{active.name}</p>
            <p className="text-xs text-[#6b7280] mt-0.5">Prospective Tenant since 2023</p>
            <div className="flex items-center justify-center gap-1 mt-1">
              {[1,2,3,4,5].map((s) => <Star key={s} className={`w-3 h-3 ${s<=4?"text-[#00C853] fill-[#00C853]":"text-[#232323]"}`} />)}
            </div>
          </div>
          <div className="bg-[#131313] border border-[#232323] rounded-2xl p-4">
            <p className="text-xs font-semibold text-[#6b7280] uppercase tracking-wide mb-3">Contact Details</p>
            <div className="space-y-2 text-sm">
              <div><p className="text-[10px] text-[#4a5568]">Email</p><p className="text-white">sarah.j@outlook.com</p></div>
              <div><p className="text-[10px] text-[#4a5568]">Phone</p><p className="text-white">+1 (555) 012-3456</p></div>
            </div>
          </div>
          <div className="bg-[#131313] border border-[#232323] rounded-2xl p-4">
            <p className="text-xs font-semibold text-[#6b7280] uppercase tracking-wide mb-3">Active Listing</p>
            <div className="flex gap-2 items-start">
              <div className="w-8 h-8 rounded-lg bg-[#1a1c1e] flex items-center justify-center flex-shrink-0"><Home className="w-4 h-4 text-[#00C853]" /></div>
              <div><p className="text-sm font-medium text-white">Modern Glass Penthouse</p><p className="text-xs text-[#00C853] mt-0.5">Active</p></div>
            </div>
          </div>
          <div className="space-y-2">
            <button className="w-full bg-[#00C853] text-[#0d0d0d] rounded-xl py-2.5 text-sm font-semibold hover:bg-[#00ff66] transition-colors">Schedule Viewing</button>
            <button className="w-full bg-[#131313] border border-[#232323] text-white rounded-xl py-2.5 text-sm font-medium hover:border-[#333] transition-colors">Shared Files (3)</button>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
