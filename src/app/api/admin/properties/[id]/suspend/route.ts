import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/server";
import { adminDb } from "@/lib/firebase/admin";
import { writeModerationLog } from "@/lib/data/admin";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  let admin;
  try {
    admin = await requireAdmin();
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unauthorized";
    const status = msg === "UNAUTHENTICATED" ? 401 : 403;
    return NextResponse.json({ error: msg }, { status });
  }

  const body = await request.json().catch(() => ({}));
  const reason: string | undefined =
    typeof body.reason === "string" && body.reason.trim() ? body.reason.trim() : undefined;

  const propRef = adminDb().collection("properties").doc(id);
  const propSnap = await propRef.get();

  if (!propSnap.exists) {
    return NextResponse.json({ error: "Property not found" }, { status: 404 });
  }

  const now = Date.now();

  await propRef.update({
    status: "suspended",
    rejectionReason: reason ?? null,
    moderatedBy: admin.uid,
    moderatedAt: now,
  });

  await writeModerationLog({
    propertyId: id,
    action: "suspend",
    adminUid: admin.uid,
    adminEmail: admin.email,
    reason,
    createdAt: now,
  });

  return NextResponse.json({ ok: true, status: "suspended" });
}
