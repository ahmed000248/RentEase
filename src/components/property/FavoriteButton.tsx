"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { doc, setDoc, deleteDoc } from "firebase/firestore";
import { Heart, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";
import { getFirebaseDb } from "@/lib/firebase/client";

interface FavoriteButtonProps {
  propertyId: string;
  initialFavorited: boolean;
}

export default function FavoriteButton({ propertyId, initialFavorited }: FavoriteButtonProps) {
  const { firebaseUser } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [favorited, setFavorited] = useState(initialFavorited);
  const [busy, setBusy] = useState(false);

  const toggle = async () => {
    if (!firebaseUser) {
      router.push(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }
    if (busy) return;

    setBusy(true);
    const next = !favorited;
    setFavorited(next); // optimistic

    try {
      const favRef = doc(getFirebaseDb(), "favorites", `${firebaseUser.uid}_${propertyId}`);
      if (next) {
        await setDoc(favRef, { uid: firebaseUser.uid, propertyId, createdAt: Date.now() });
      } else {
        await deleteDoc(favRef);
      }
    } catch (err) {
      console.error("Failed to update favorite:", err);
      setFavorited(!next); // revert
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={busy}
      aria-pressed={favorited}
      aria-label={favorited ? "Remove from favorites" : "Save to favorites"}
      className={`w-12 h-12 rounded-full border flex items-center justify-center transition-colors duration-300 ${
        favorited
          ? "bg-brand-green border-brand-green text-black"
          : "border-white/10 text-white/70 hover:border-white/30 hover:text-white"
      }`}
    >
      {busy ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <Heart className={`w-5 h-5 ${favorited ? "fill-black" : ""}`} />
      )}
    </button>
  );
}
