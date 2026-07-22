import "server-only";
import { adminDb } from "@/lib/firebase/admin";
import type { BookingDoc, PropertyDoc } from "@/lib/firebase/types";

/** All bookings for a tenant, ordered newest first. */
export async function getBookingsForTenant(tenantId: string): Promise<BookingDoc[]> {
  const snap = await adminDb()
    .collection("bookings")
    .where("tenantId", "==", tenantId)
    .orderBy("createdAt", "desc")
    .limit(50)
    .get();

  return snap.docs.map((doc) => ({ ...(doc.data() as BookingDoc), id: doc.id }));
}

/** All bookings for an owner (across all their properties), ordered newest first. */
export async function getBookingsForOwner(ownerId: string): Promise<BookingDoc[]> {
  const snap = await adminDb()
    .collection("bookings")
    .where("ownerId", "==", ownerId)
    .orderBy("createdAt", "desc")
    .limit(50)
    .get();

  return snap.docs.map((doc) => ({ ...(doc.data() as BookingDoc), id: doc.id }));
}

/** All confirmed bookings for a specific property (for availability checking). */
export async function getConfirmedBookingsForProperty(propertyId: string): Promise<BookingDoc[]> {
  const snap = await adminDb()
    .collection("bookings")
    .where("propertyId", "==", propertyId)
    .where("status", "==", "confirmed")
    .orderBy("startDate", "asc")
    .get();

  return snap.docs.map((doc) => ({ ...(doc.data() as BookingDoc), id: doc.id }));
}

/** Check if a date range is available for a property. */
export async function isPropertyAvailable(
  propertyId: string,
  startDate: number,
  endDate: number
): Promise<boolean> {
  const bookings = await getConfirmedBookingsForProperty(propertyId);

  return !bookings.some(
    (b) =>
      // Overlapping if: booking starts before endDate AND booking ends after startDate
      b.startDate < endDate && b.endDate > startDate
  );
}
