import "server-only";
import { cookies } from "next/headers";
import { adminAuth, adminDb } from "@/lib/firebase/admin";
import type { UserDoc, UserRole } from "@/lib/firebase/types";
import { SESSION_COOKIE_NAME } from "@/lib/auth/constants";

import { hasRole, sanitizeRoles } from "@/lib/auth/roles";

export { SESSION_COOKIE_NAME, hasRole };

export async function getCurrentUser(): Promise<UserDoc | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!sessionCookie) return null;

  try {
    const decoded = await adminAuth().verifySessionCookie(sessionCookie, true);
    const snap = await adminDb().collection("users").doc(decoded.uid).get();
    if (!snap.exists) return null;
    const data = snap.data() as UserDoc;
    if (data && Array.isArray(data.roles)) {
      data.roles = sanitizeRoles(data.roles);
    }
    return data;
  } catch {
    return null;
  }
}

export async function requireUser(): Promise<UserDoc> {
  const user = await getCurrentUser();
  if (!user) throw new Error("UNAUTHENTICATED");
  if (user.suspended) throw new Error("SUSPENDED");
  return user;
}

export async function requireRole(role: UserRole): Promise<UserDoc> {
  const user = await requireUser();
  if (!hasRole(user, role)) throw new Error("FORBIDDEN");
  return user;
}

export async function getSessionClaims(): Promise<{ uid: string; admin: boolean } | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!sessionCookie) return null;

  try {
    const decoded = await adminAuth().verifySessionCookie(sessionCookie, true);
    return { uid: decoded.uid, admin: decoded.admin === true };
  } catch {
    return null;
  }
}

export async function requireAdmin(): Promise<{ uid: string; email: string | undefined }> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!sessionCookie) throw new Error("UNAUTHENTICATED");

  const decoded = await adminAuth().verifySessionCookie(sessionCookie, true);
  if (decoded.admin !== true) throw new Error("FORBIDDEN");
  return { uid: decoded.uid, email: decoded.email };
}
