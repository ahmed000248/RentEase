import "server-only";
import { adminDb } from "@/lib/firebase/admin";
import type { Furnishing, PreferredFor, PropertyDoc, ReviewDoc, UserDoc } from "@/lib/firebase/types";
import { MOCK_PROPERTIES, MOCK_OWNER, MOCK_REVIEWS, MOCK_TENANTS, DEMO_DATA_ENABLED } from "@/lib/data/mockProperties";

interface Viewer {
  uid: string;
  isAdmin: boolean;
}

/**
 * Approved listings are public. Pending/rejected listings are only visible
 * to their owner or an admin (e.g. owner previewing their own submission).
 */
export async function getPropertyById(id: string, viewer?: Viewer | null): Promise<PropertyDoc | null> {
  // Check Firestore database first
  const snap = await adminDb().collection("properties").doc(id).get();
  if (snap.exists) {
    const property = { ...(snap.data() as PropertyDoc), id: snap.id };
    const canViewUnapproved = viewer && (viewer.isAdmin || viewer.uid === property.ownerId);
    if (property.status === "approved" || canViewUnapproved) {
      return property;
    }
  }

  // Fall back to mock property definitions if not found in Firestore (e.g. homepage showcase cards)
  const mockProp = MOCK_PROPERTIES.find((p) => p.id === id);
  if (mockProp) return mockProp;

  return null;
}

export async function getProperties(
  filters?: {
    type?: string;
    city?: string;
    bedrooms?: number;
    minPrice?: number;
    maxPrice?: number;
    searchQuery?: string;
    furnishing?: Furnishing;
    preferredFor?: PreferredFor;
  },
  limitCount = 48
): Promise<PropertyDoc[]> {
  // Build an indexed Firestore query — only fall back to in-memory for text search
  // which cannot be indexed without a dedicated search service.
  let query = adminDb()
    .collection("properties")
    .where("status", "==", "approved") as FirebaseFirestore.Query;

  if (filters?.type)        query = query.where("type", "==", filters.type);
  if (filters?.city)        query = query.where("city", "==", filters.city);
  if (filters?.bedrooms && filters.bedrooms > 0)
                            query = query.where("bedrooms", "==", filters.bedrooms);
  if (filters?.furnishing)  query = query.where("furnishing", "==", filters.furnishing);
  if (filters?.preferredFor && filters.preferredFor !== "any")
                            query = query.where("preferredFor", "==", filters.preferredFor);
  if (filters?.minPrice !== undefined)
                            query = query.where("price", ">=", filters.minPrice);
  if (filters?.maxPrice !== undefined)
                            query = query.where("price", "<=", filters.maxPrice);

  query = query.orderBy("createdAt", "desc").limit(limitCount);

  const snap = await query.get();
  let properties = snap.docs.map((doc) => ({
    ...(doc.data() as PropertyDoc),
    id: doc.id,
  }));

  // Text search: in-memory only (not indexable without Algolia/Typesense/etc.)
  if (filters?.searchQuery) {
    const q = filters.searchQuery.toLowerCase();
    properties = properties.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q)
    );
  }

  return properties;
}

export async function getUserById(uid: string): Promise<UserDoc | null> {
  if (DEMO_DATA_ENABLED && uid === "owner_mock") return MOCK_OWNER;

  const snap = await adminDb().collection("users").doc(uid).get();
  if (!snap.exists) return null;
  return snap.data() as UserDoc;
}

export async function getReviewsForProperty(propertyId: string): Promise<ReviewDoc[]> {
  if (DEMO_DATA_ENABLED && (propertyId.startsWith("p") || propertyId.startsWith("l"))) {
    return MOCK_REVIEWS.filter((r) => r.propertyId === propertyId);
  }

  const snap = await adminDb()
    .collection("reviews")
    .where("propertyId", "==", propertyId)
    .orderBy("createdAt", "desc")
    .get();
  return snap.docs.map((doc) => doc.data() as ReviewDoc);
}

export async function getReviewersById(uids: string[]): Promise<Map<string, UserDoc>> {
  const uniqueUids = Array.from(new Set(uids));
  const map = new Map<string, UserDoc>();
  if (uniqueUids.length === 0) return map;

  const dbUids: string[] = [];
  for (const uid of uniqueUids) {
    if (DEMO_DATA_ENABLED) {
      const mockTenant = MOCK_TENANTS.get(uid);
      if (mockTenant) {
        map.set(uid, mockTenant);
        continue;
      }
    }
    dbUids.push(uid);
  }

  if (dbUids.length > 0) {
    const snaps = await Promise.all(dbUids.map((uid) => adminDb().collection("users").doc(uid).get()));
    for (const snap of snaps) {
      if (snap.exists) map.set(snap.id, snap.data() as UserDoc);
    }
  }

  return map;
}

export async function isPropertyFavorited(uid: string, propertyId: string): Promise<boolean> {
  const snap = await adminDb().collection("favorites").doc(`${uid}_${propertyId}`).get();
  return snap.exists;
}
