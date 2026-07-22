import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";

/**
 * Firestore-backed rate limiter.
 * Keyed by an arbitrary string (e.g. "register:1.2.3.4").
 * Uses a sliding window: resets after windowMs milliseconds.
 */
export async function checkRateLimit(
  key: string,
  windowMs: number,
  maxRequests: number
): Promise<{ allowed: boolean; retryAfter?: number }> {
  const docRef = adminDb().collection("rateLimits").doc(key);

  return adminDb().runTransaction(async (tx) => {
    const doc = await tx.get(docRef);
    const now = Date.now();

    if (!doc.exists) {
      tx.set(docRef, { count: 1, windowStart: now, expiresAt: now + windowMs });
      return { allowed: true };
    }

    const data = doc.data()!;
    const windowStart: number = data.windowStart;
    const count: number = data.count;

    if (now - windowStart >= windowMs) {
      // Window expired — reset
      tx.set(docRef, { count: 1, windowStart: now, expiresAt: now + windowMs });
      return { allowed: true };
    }

    if (count >= maxRequests) {
      const retryAfter = Math.ceil((windowStart + windowMs - now) / 1000);
      return { allowed: false, retryAfter };
    }

    tx.update(docRef, { count: count + 1 });
    return { allowed: true };
  });
}

/**
 * Convenience helper to apply rate limiting in a Next.js route handler.
 * Returns a 429 Response if the limit is exceeded, null otherwise.
 */
export async function applyRateLimit(
  request: NextRequest,
  prefix: string,
  windowMs = 60_000,
  maxRequests = 5
): Promise<NextResponse | null> {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown";
  const key = `${prefix}:${ip}`;

  const { allowed, retryAfter } = await checkRateLimit(key, windowMs, maxRequests);

  if (!allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      {
        status: 429,
        headers: retryAfter
          ? { "Retry-After": String(retryAfter), "X-RateLimit-Limit": String(maxRequests) }
          : {},
      }
    );
  }

  return null;
}
