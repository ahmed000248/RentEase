"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { addDoc, collection } from "firebase/firestore";
import { Loader2, MessageSquareText } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";
import { getFirebaseDb } from "@/lib/firebase/client";
import { formatRelativeTime } from "@/lib/format";
import type { ReviewDoc } from "@/lib/firebase/types";
import StarRating from "./StarRating";

interface ReviewWithAuthor extends ReviewDoc {
  authorName: string;
}

interface ReviewsSectionProps {
  propertyId: string;
  initialReviews: ReviewWithAuthor[];
}

export default function ReviewsSection({ propertyId, initialReviews }: ReviewsSectionProps) {
  const { firebaseUser, userDoc } = useAuth();
  const pathname = usePathname();
  const [reviews, setReviews] = useState(initialReviews);
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { avg, count } = useMemo(() => {
    if (reviews.length === 0) return { avg: 0, count: 0 };
    const total = reviews.reduce((sum, r) => sum + r.rating, 0);
    return { avg: total / reviews.length, count: reviews.length };
  }, [reviews]);

  const alreadyReviewed = firebaseUser ? reviews.some((r) => r.tenantId === firebaseUser.uid) : false;

  const submitReview = async () => {
    if (!firebaseUser || rating === 0 || !text.trim() || submitting) return;
    setSubmitting(true);
    setError(null);

    const newReview: ReviewWithAuthor = {
      id: `local-${Date.now()}`,
      propertyId,
      tenantId: firebaseUser.uid,
      rating,
      text: text.trim(),
      createdAt: Date.now(),
      authorName: userDoc?.name ?? firebaseUser.displayName ?? "You",
    };

    try {
      await addDoc(collection(getFirebaseDb(), "reviews"), {
        propertyId: newReview.propertyId,
        tenantId: newReview.tenantId,
        rating: newReview.rating,
        text: newReview.text,
        createdAt: newReview.createdAt,
      });
      setReviews((prev) => [newReview, ...prev]);
      setRating(0);
      setText("");
    } catch (err) {
      console.error("Failed to submit review:", err);
      setError("Couldn't submit your review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <div className="flex items-center gap-2">
          <StarRating value={avg} size={20} />
          <span className="text-xl font-extrabold text-white">{avg > 0 ? avg.toFixed(1) : "—"}</span>
        </div>
        <span className="text-white/50 text-sm">
          {count === 0 ? "No reviews yet" : `${count} review${count === 1 ? "" : "s"}`}
        </span>
      </div>

      {/* Write a review */}
      <div className="bg-[#0d0d0d] border border-white/5 rounded-2xl p-6 mb-8">
        {!firebaseUser ? (
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <p className="text-white/60 text-sm">Log in to leave a rating and review for this property.</p>
            <Link
              href={`/login?next=${encodeURIComponent(pathname)}`}
              className="inline-flex items-center gap-2 bg-white text-black px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-brand-green transition-colors"
            >
              Log In to Review
            </Link>
          </div>
        ) : alreadyReviewed ? (
          <p className="text-white/60 text-sm flex items-center gap-2">
            <MessageSquareText className="w-4 h-4 text-brand-green" />
            You&apos;ve already reviewed this property. Thanks for sharing your experience!
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            <div>
              <span className="block text-xs font-semibold uppercase tracking-wider text-white/40 mb-2">
                Your rating
              </span>
              <StarRating value={rating} size={26} interactive onChange={setRating} />
            </div>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Share details about your experience with this property..."
              rows={3}
              maxLength={800}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-brand-green resize-none"
            />
            {error && <p className="text-red-400 text-xs">{error}</p>}
            <button
              type="button"
              onClick={submitReview}
              disabled={rating === 0 || !text.trim() || submitting}
              className="self-start inline-flex items-center gap-2 bg-brand-green text-black px-6 py-2.5 rounded-full text-sm font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white transition-colors"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              Submit Review
            </button>
          </div>
        )}
      </div>

      {/* Review list */}
      {reviews.length === 0 ? (
        <p className="text-white/40 text-sm">Be the first to review this property.</p>
      ) : (
        <div className="flex flex-col gap-6">
          {reviews.map((review) => (
            <div key={review.id} className="flex gap-4 pb-6 border-b border-white/5 last:border-0 last:pb-0">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                {review.authorName.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-3 flex-wrap mb-1">
                  <span className="font-semibold text-white text-sm">{review.authorName}</span>
                  <StarRating value={review.rating} size={13} />
                  <span className="text-white/30 text-xs">{formatRelativeTime(review.createdAt)}</span>
                </div>
                <p className="text-white/60 text-sm leading-relaxed">{review.text}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
