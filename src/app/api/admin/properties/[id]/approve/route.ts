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

  const propRef = adminDb().collection("properties").doc(id);
  const propSnap = await propRef.get();

  if (!propSnap.exists) {
    return NextResponse.json({ error: "Property not found" }, { status: 404 });
  }

  const now = Date.now();

  await propRef.update({
    status: "approved",
    rejectionReason: null,
    moderatedBy: admin.uid,
    moderatedAt: now,
  });

  await writeModerationLog({
    propertyId: id,
    action: "approve",
    adminUid: admin.uid,
    adminEmail: admin.email,
    createdAt: now,
  });

  return NextResponse.json({ ok: true, status: "approved" });
}
