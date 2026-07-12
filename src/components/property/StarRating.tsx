"use client";

import { useState } from "react";
import { Star } from "lucide-react";

interface StarRatingProps {
  value: number;
  size?: number;
  interactive?: boolean;
  onChange?: (value: number) => void;
}

export default function StarRating({ value, size = 16, interactive = false, onChange }: StarRatingProps) {
  const [hovered, setHovered] = useState<number | null>(null);
  const displayValue = hovered ?? value;

  return (
    <div
      className={`flex items-center gap-0.5 ${interactive ? "cursor-pointer" : ""}`}
      onMouseLeave={() => interactive && setHovered(null)}
      role={interactive ? "radiogroup" : undefined}
      aria-label={interactive ? "Rating" : `${value.toFixed(1)} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= Math.round(displayValue);
        return (
          <button
            key={star}
            type="button"
            tabIndex={interactive ? 0 : -1}
            aria-hidden={!interactive}
            disabled={!interactive}
            onMouseEnter={() => interactive && setHovered(star)}
            onClick={() => interactive && onChange?.(star)}
            className={interactive ? "p-0.5 -m-0.5" : "pointer-events-none"}
          >
            <Star
              width={size}
              height={size}
              className={filled ? "fill-brand-green text-brand-green" : "fill-transparent text-white/25"}
              strokeWidth={1.5}
            />
          </button>
        );
      })}
    </div>
  );
}
