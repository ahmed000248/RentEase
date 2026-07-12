import "server-only";
import { adminDb } from "@/lib/firebase/admin";
import type { InquiryDoc, PropertyDoc, UserDoc } from "@/lib/firebase/types";
import { MOCK_PROPERTIES } from "@/lib/data/mockProperties";
import { getReviewersById } from "@/lib/data/properties";

export async function getPropertiesByOwner(ownerId: string): Promise<PropertyDoc[]> {
  const mockOwned = MOCK_PROPERTIES.filter((p) => p.ownerId === ownerId);

  const snap = await adminDb().collection("properties").where("ownerId", "==", ownerId).get();
  const dbOwned = snap.docs.map((doc) => ({ ...(doc.data() as PropertyDoc), id: doc.id }));

  const properties = [...dbOwned, ...mockOwned];
  properties.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  return properties;
}

export interface InquiryWithTenant extends InquiryDoc {
  tenant: UserDoc | null;
  propertyTitle: string;
}

export async function getInquiriesForOwner(ownerId: string): Promise<InquiryWithTenant[]> {
  const snap = await adminDb()
    .collection("inquiries")
    .where("ownerId", "==", ownerId)
    .orderBy("createdAt", "desc")
    .limit(20)
    .get();

  const inquiries = snap.docs.map((doc) => ({ ...(doc.data() as InquiryDoc), id: doc.id }));
  if (inquiries.length === 0) return [];

  const [tenants, propertiesSnaps] = await Promise.all([
    getReviewersById(inquiries.map((i) => i.tenantId)),
    Promise.all(
      Array.from(new Set(inquiries.map((i) => i.propertyId))).map((id) =>
        adminDb().collection("properties").doc(id).get()
      )
    ),
  ]);

  const propertyTitles = new Map<string, string>();
  for (const doc of propertiesSnaps) {
    if (doc.exists) propertyTitles.set(doc.id, (doc.data() as PropertyDoc).title);
  }
  for (const mock of MOCK_PROPERTIES) propertyTitles.set(mock.id, mock.title);

  return inquiries.map((inq) => ({
    ...inq,
    tenant: tenants.get(inq.tenantId) ?? null,
    propertyTitle: propertyTitles.get(inq.propertyId) ?? "Unknown Property",
  }));
}

/** Simple deterministic string hash (djb2), used to derive stable demo metrics from a property id. */
function hashString(value: string): number {
  let hash = 5381;
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 33) ^ value.charCodeAt(i);
  }
  return Math.abs(hash);
}

export interface PropertyOccupancy {
  property: PropertyDoc;
  occupancyPct: number;
  bookedNights: number;
  totalNights: number;
  tag: string;
}

export interface RevenuePoint {
  label: string;
  revenue: number;
  bookings: number;
}

export interface OwnerAnalytics {
  occupancyByProperty: PropertyOccupancy[];
  overallOccupancyPct: number;
  monthly: RevenuePoint[];
  yearly: RevenuePoint[];
  monthlyTarget: string;
  yearlyTarget: string;
}

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/**
 * There's no booking system yet, so occupancy/revenue figures are derived
 * deterministically from each owner's real listings (price, rating, id) rather
 * than a live bookings collection. Same input always yields the same output,
 * so there's no SSR/CSR hydration mismatch.
 */
export function buildOwnerAnalytics(properties: PropertyDoc[]): OwnerAnalytics {
  const totalNights = 36;

  const occupancyByProperty: PropertyOccupancy[] = properties.map((property) => {
    const seed = hashString(property.id);
    const occupancyPct = 38 + (seed % 58); // 38–95
    const bookedNights = Math.round((occupancyPct / 100) * totalNights);
    const daysLeft = 1 + (seed % 12);
    return {
      property,
      occupancyPct,
      bookedNights,
      totalNights,
      tag: occupancyPct >= 85 ? `Renews in ${daysLeft}d` : `${daysLeft} days left`,
    };
  });

  const overallOccupancyPct = occupancyByProperty.length
    ? Math.round(occupancyByProperty.reduce((sum, p) => sum + p.occupancyPct, 0) / occupancyByProperty.length)
    : 0;

  const monthlyBase = properties.reduce((sum, p) => sum + p.price, 0);

  const now = new Date();
  const monthly: RevenuePoint[] = Array.from({ length: 7 }, (_, i) => {
    const idx = (now.getMonth() - (6 - i) + 12) % 12;
    const seed = hashString(`m-${idx}-${properties.map((p) => p.id).join(",")}`);
    const factor = 0.55 + (seed % 45) / 100; // 0.55–1.0
    return {
      label: MONTH_LABELS[idx],
      revenue: Math.round((monthlyBase * factor) / 10) * 10,
      bookings: properties.length === 0 ? 0 : Math.max(1, Math.round(properties.length * 12 * factor)),
    };
  });

  const yearlyBase = monthlyBase * 12;
  const yearly: RevenuePoint[] = Array.from({ length: 7 }, (_, i) => {
    const yearIdx = now.getFullYear() - (6 - i);
    const seed = hashString(`y-${yearIdx}-${properties.map((p) => p.id).join(",")}`);
    const growth = 1 + i * 0.12 + (seed % 10) / 100;
    return {
      label: `'${String(yearIdx).slice(-2)}`,
      revenue: Math.round((yearlyBase * growth) / 100) * 100,
      bookings: properties.length === 0 ? 0 : Math.max(1, Math.round(properties.length * 90 * growth)),
    };
  });

  const monthlyTarget = `$${Math.round((monthlyBase * 1.25) / 10) * 10}`;
  const yearlyTarget = `$${(Math.round((yearlyBase * 1.15) / 1000) * 1000).toLocaleString("en-US")}`;

  return {
    occupancyByProperty,
    overallOccupancyPct,
    monthly,
    yearly,
    monthlyTarget: formatMoney(monthlyTarget),
    yearlyTarget,
  };
}

function formatMoney(raw: string): string {
  const n = Number(raw.replace("$", ""));
  return `$${n.toLocaleString("en-US")}`;
}
