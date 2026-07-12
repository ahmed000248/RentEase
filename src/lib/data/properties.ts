import "server-only";
import { adminDb } from "@/lib/firebase/admin";
import type { Furnishing, PreferredFor, PropertyDoc, ReviewDoc, UserDoc } from "@/lib/firebase/types";
import { MOCK_PROPERTIES, MOCK_OWNER, MOCK_REVIEWS, MOCK_TENANTS } from "@/lib/data/mockProperties";

interface Viewer {
  uid: string;
  isAdmin: boolean;
}

/**
 * Approved listings are public. Pending/rejected listings are only visible
 * to their owner or an admin (e.g. owner previewing their own submission).
 */
export async function getPropertyById(id: string, viewer?: Viewer | null): Promise<PropertyDoc | null> {
  const mockProp = MOCK_PROPERTIES.find((p) => p.id === id);
  if (mockProp) return mockProp;

  const snap = await adminDb().collection("properties").doc(id).get();
  if (!snap.exists) return null;

  const property = snap.data() as PropertyDoc;
  const canViewUnapproved = viewer && (viewer.isAdmin || viewer.uid === property.ownerId);
  if (property.status !== "approved" && !canViewUnapproved) return null;

  return property;
}

export async function getProperties(filters?: {
  type?: string;
  city?: string;
  bedrooms?: number;
  minPrice?: number;
  maxPrice?: number;
  searchQuery?: string;
  furnishing?: Furnishing;
  preferredFor?: PreferredFor;
}): Promise<PropertyDoc[]> {
  const snap = await adminDb().collection("properties").where("status", "==", "approved").get();
  let properties = snap.docs.map((doc) => {
    const data = doc.data();
    // In case the id is not stored in the document, make sure we have it
    return {
      ...data,
      id: doc.id,
    } as PropertyDoc;
  });

  // Sort by createdAt desc by default
  properties.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

  if (filters) {
    if (filters.type) {
      properties = properties.filter((p) => p.type === filters.type);
    }
    if (filters.city) {
      const cityLower = filters.city.toLowerCase();
      properties = properties.filter((p) => p.city.toLowerCase() === cityLower);
    }
    if (filters.bedrooms !== undefined && filters.bedrooms > 0) {
      properties = properties.filter((p) => p.bedrooms === filters.bedrooms);
    }
    if (filters.minPrice !== undefined) {
      properties = properties.filter((p) => p.price >= filters.minPrice!);
    }
    if (filters.maxPrice !== undefined) {
      properties = properties.filter((p) => p.price <= filters.maxPrice!);
    }
    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      properties = properties.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q) ||
          p.city.toLowerCase().includes(q)
      );
    }
    if (filters.furnishing) {
      properties = properties.filter((p) => p.furnishing === filters.furnishing);
    }
    if (filters.preferredFor) {
      properties = properties.filter((p) => p.preferredFor === filters.preferredFor);
    }
  }

  return properties;
}

export async function getUserById(uid: string): Promise<UserDoc | null> {
  if (uid === "owner_mock") return MOCK_OWNER;

  const snap = await adminDb().collection("users").doc(uid).get();
  if (!snap.exists) return null;
  return snap.data() as UserDoc;
}

export async function getReviewsForProperty(propertyId: string): Promise<ReviewDoc[]> {
  if (propertyId.startsWith("p") || propertyId.startsWith("l")) {
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
    const mockTenant = MOCK_TENANTS.get(uid);
    if (mockTenant) {
      map.set(uid, mockTenant);
    } else {
      dbUids.push(uid);
    }
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
