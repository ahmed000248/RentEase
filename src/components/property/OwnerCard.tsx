"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { addDoc, collection } from "firebase/firestore";
import { Lock, MessageCircle, Send, CheckCircle2, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";
import { getFirebaseDb } from "@/lib/firebase/client";
import { formatJoinedDate, maskPhone } from "@/lib/format";
import type { UserDoc } from "@/lib/firebase/types";

interface OwnerCardProps {
  owner: UserDoc;
  ownerId: string;
  propertyId: string;
  propertyTitle: string;
}

export default function OwnerCard({ owner, ownerId, propertyId, propertyTitle }: OwnerCardProps) {
  const { firebaseUser } = useAuth();
  const pathname = usePathname();
  const [composerOpen, setComposerOpen] = useState(false);
  const [message, setMessage] = useState(`Hi ${owner.name.split(" ")[0]}, I'm interested in "${propertyTitle}". Is it still available?`);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isSignedIn = Boolean(firebaseUser);
  const isOwnListing = firebaseUser?.uid === ownerId;
  const whatsappDigits = owner.phone?.replace(/\D/g, "");

  const sendInquiry = async () => {
    if (!firebaseUser || !message.trim() || sending) return;
    setSending(true);
    setError(null);
    try {
      await addDoc(collection(getFirebaseDb(), "inquiries"), {
        propertyId,
        ownerId,
        tenantId: firebaseUser.uid,
        message: message.trim(),
        reply: null,
        status: "sent",
        createdAt: Date.now(),
      });
      setSent(true);
      setComposerOpen(false);
    } catch (err) {
      console.error("Failed to send inquiry:", err);
      setError("Couldn't send your inquiry. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-[#0d0d0d] border border-white/5 rounded-3xl p-6">
      <span className="text-xs font-bold uppercase tracking-widest text-white/40 mb-4 block">Listed By</span>

      <div className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 rounded-full bg-brand-green/15 border border-brand-green/30 flex items-center justify-center text-lg font-extrabold text-brand-green flex-shrink-0">
          {owner.name.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0">
          <p className="font-bold text-white truncate">{owner.name}</p>
          <p className="text-xs text-white/40">Member since {formatJoinedDate(owner.createdAt)}</p>
        </div>
      </div>

      {isOwnListing ? (
        <p className="text-white/40 text-sm border-t border-white/5 pt-5">This is your listing.</p>
      ) : !isSignedIn ? (
        <div className="border-t border-white/5 pt-5">
          <div className="flex items-center gap-2 text-white/50 text-sm mb-4">
            <Lock className="w-4 h-4" />
            <span>Log in to view contact details &amp; message the owner</span>
          </div>
          <Link
            href={`/login?next=${encodeURIComponent(pathname)}`}
            className="w-full inline-flex items-center justify-center gap-2 bg-white text-black px-6 py-3 rounded-full text-sm font-bold hover:bg-brand-green transition-colors"
          >
            Log In
          </Link>
        </div>
      ) : (
        <div className="border-t border-white/5 pt-5 flex flex-col gap-3">
          {owner.phone && (
            <p className="text-sm text-white/60">
              Phone: <span className="text-white font-medium tracking-wide">{maskPhone(owner.phone)}</span>
            </p>
          )}

          {sent && (
            <p className="flex items-center gap-2 text-sm text-brand-green bg-brand-green/10 border border-brand-green/20 rounded-xl px-4 py-3">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              Inquiry sent to the owner.
            </p>
          )}

          {!composerOpen ? (
            <button
              type="button"
              onClick={() => setComposerOpen(true)}
              className="w-full inline-flex items-center justify-center gap-2 bg-brand-green text-black px-6 py-3 rounded-full text-sm font-bold hover:bg-white transition-colors"
            >
              <Send className="w-4 h-4" />
              Send Owner an Inquiry
            </button>
          ) : (
            <div className="flex flex-col gap-3">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                maxLength={600}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-brand-green resize-none"
              />
              {error && <p className="text-red-400 text-xs">{error}</p>}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={sendInquiry}
                  disabled={!message.trim() || sending}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-brand-green text-black px-6 py-2.5 rounded-full text-sm font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white transition-colors"
                >
                  {sending && <Loader2 className="w-4 h-4 animate-spin" />}
                  Send
                </button>
                <button
                  type="button"
                  onClick={() => setComposerOpen(false)}
                  className="px-5 py-2.5 rounded-full text-sm font-semibold text-white/60 border border-white/10 hover:text-white hover:border-white/30 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {whatsappDigits && (
            <a
              href={`https://wa.me/${whatsappDigits}?text=${encodeURIComponent(
                `Hi ${owner.name.split(" ")[0]}, I'm interested in "${propertyTitle}".`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 border border-white/10 text-white px-6 py-3 rounded-full text-sm font-bold hover:border-brand-green hover:text-brand-green transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              Chat on WhatsApp
            </a>
          )}
        </div>
      )}
    </div>
  );
}
