import { describe, it, expect, vi } from "vitest";
import { buildOwnerAnalytics } from "@/lib/data/owner";
import type { PropertyDoc } from "@/lib/firebase/types";

describe("buildOwnerAnalytics", () => {
  const sampleProperties: PropertyDoc[] = [
    {
      id: "prop1",
      ownerId: "owner1",
      title: "Penthouse Suite",
      description: "Luxury penthouse",
      type: "apartment",
      price: 2500,
      city: "New York",
      location: "Downtown",
      bedrooms: 3,
      bathrooms: 2,
      areaSqFt: 1800,
      furnishing: "furnished",
      preferredFor: "any",
      amenities: ["wifi", "pool"],
      images: ["img1.jpg"],
      status: "approved",
      rejectionReason: null,
      featured: true,
      ratingAvg: 4.8,
      ratingCount: 12,
      createdAt: 1700000000000,
    },
  ];

  it("should mark analytics as demo data", () => {
    const analytics = buildOwnerAnalytics(sampleProperties);
    expect(analytics.isDemoData).toBe(true);
  });

  it("should calculate occupancy and targets deterministically", () => {
    const analytics1 = buildOwnerAnalytics(sampleProperties);
    const analytics2 = buildOwnerAnalytics(sampleProperties);

    expect(analytics1.overallOccupancyPct).toEqual(analytics2.overallOccupancyPct);
    expect(analytics1.monthlyTarget).toEqual(analytics2.monthlyTarget);
  });

  it("should handle empty property array without crashing", () => {
    const analytics = buildOwnerAnalytics([]);
    expect(analytics.overallOccupancyPct).toBe(0);
    expect(analytics.occupancyByProperty).toHaveLength(0);
    expect(analytics.isDemoData).toBe(true);
  });
});
