import "server-only";
import { adminDb } from "@/lib/firebase/admin";
import type { ModerationLogDoc, PropertyDoc } from "@/lib/firebase/types";

/** All properties regardless of status, for the admin listings panel. */
export async function getAllPropertiesForAdmin(limitCount = 100): Promise<PropertyDoc[]> {
  const snap = await adminDb()
    .collection("properties")
    .orderBy("createdAt", "desc")
    .limit(limitCount)
    .get();

  return snap.docs.map((doc) => ({ ...(doc.data() as PropertyDoc), id: doc.id }));
}

/** Properties with status === "pending", for the admin moderation queue. */
export async function getPendingPropertiesForAdmin(): Promise<PropertyDoc[]> {
  try {
    const snap = await adminDb()
      .collection("properties")
      .where("status", "==", "pending")
      .orderBy("createdAt", "asc") // oldest first — review in submission order
      .get();

    return snap.docs.map((doc) => ({ ...(doc.data() as PropertyDoc), id: doc.id }));
  } catch (error) {
    console.warn("Falling back to client-side sort for pending properties:", error);
    const snap = await adminDb()
      .collection("properties")
      .where("status", "==", "pending")
      .get();

    const docs = snap.docs.map((doc) => ({ ...(doc.data() as PropertyDoc), id: doc.id }));
    return docs.sort(
      (a, b) => new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime()
    );
  }
}

/** Summary stats for the admin listings panel. */
export async function getAdminPropertyStats(): Promise<{
  total: number;
  active: number;
  pending: number;
  suspended: number;
}> {
  const snap = await adminDb().collection("properties").get();
  const docs = snap.docs.map((d) => d.data() as PropertyDoc);

  return {
    total: docs.length,
    active: docs.filter((d) => d.status === "approved").length,
    pending: docs.filter((d) => d.status === "pending").length,
    suspended: docs.filter((d) => d.status === "suspended").length,
  };
}

/** Write a moderation log entry. */
export async function writeModerationLog(
  entry: Omit<ModerationLogDoc, "id">
): Promise<void> {
  const ref = adminDb().collection("moderationLog").doc();
  await ref.set({ ...entry, id: ref.id });
}
