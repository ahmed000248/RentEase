import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase/admin";
import type { UserDoc, UserRole } from "@/lib/firebase/types";

const VALID_ROLES: UserRole[] = ["tenant", "owner"];

export async function POST(request: NextRequest) {
  const { idToken, name, phone, roles } = await request.json();

  if (typeof idToken !== "string" || !idToken) {
    return NextResponse.json({ error: "Missing idToken" }, { status: 400 });
  }
  if (typeof name !== "string" || !name.trim()) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }
  const cleanRoles: UserRole[] = Array.isArray(roles)
    ? roles.filter((r): r is UserRole => VALID_ROLES.includes(r))
    : [];
  if (cleanRoles.length === 0) {
    return NextResponse.json({ error: "At least one role is required" }, { status: 400 });
  }

  let decoded;
  try {
    decoded = await adminAuth().verifyIdToken(idToken);
  } catch {
    return NextResponse.json({ error: "Invalid ID token" }, { status: 401 });
  }

  const existing = await adminDb().collection("users").doc(decoded.uid).get();
  if (existing.exists) {
    return NextResponse.json({ error: "User already registered" }, { status: 409 });
  }

  const userDoc: UserDoc = {
    uid: decoded.uid,
    name: name.trim(),
    email: decoded.email ?? "",
    phone: typeof phone === "string" && phone.trim() ? phone.trim() : null,
    roles: cleanRoles,
    emailVerified: decoded.email_verified ?? false,
    photoURL: null,
    suspended: false,
    createdAt: Date.now(),
  };

  await adminDb().collection("users").doc(decoded.uid).set(userDoc);

  return NextResponse.json({ ok: true, user: userDoc });
}
