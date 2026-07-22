import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/server";
import { adminDb } from "@/lib/firebase/admin";

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = await request.json();

  try {
    const docRef = adminDb().collection("savedSearches").doc();
    const searchData = {
      id: docRef.id,
      userId: user.uid,
      params: searchParams || {},
      createdAt: Date.now(),
    };
    await docRef.set(searchData);

    return NextResponse.json({ ok: true, savedSearch: searchData });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to save search";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
