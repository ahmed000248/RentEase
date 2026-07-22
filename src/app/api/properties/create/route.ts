import { NextRequest, NextResponse } from "next/server";
import { requireUser, hasRole } from "@/lib/auth/server";
import { adminDb } from "@/lib/firebase/admin";
import type { PropertyDoc } from "@/lib/firebase/types";

const FALLBACK_IMAGE = "/images/property_apartment.png";

export async function POST(request: NextRequest) {
  let user;
  try {
    user = await requireUser();
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unauthorized";
    return NextResponse.json({ error: msg }, { status: 401 });
  }

  if (!hasRole(user, "owner")) {
    return NextResponse.json({ error: "Only property owners can publish listings" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const {
      title,
      description,
      type,
      price,
      city,
      location,
      neighbourhood,
      bedrooms,
      bathrooms,
      areaSqFt,
      furnishing,
      preferredFor,
      amenities,
      images,
    } = body;

    if (!title || !price || !city || !location) {
      return NextResponse.json({ error: "Missing required property fields" }, { status: 400 });
    }

    const docRef = adminDb().collection("properties").doc();
    const now = Date.now();

    const formattedLocation = neighbourhood
      ? `${location}, ${neighbourhood}`
      : location;

    const propertyImages = Array.isArray(images) && images.length > 0
      ? images
      : [FALLBACK_IMAGE];

    const propertyDoc: PropertyDoc = {
      id: docRef.id,
      ownerId: user.uid,
      title: String(title).trim(),
      description: String(description || "").trim(),
      type: type || "apartment",
      price: Number(price),
      city: String(city).trim(),
      location: formattedLocation,
      bedrooms: Number(bedrooms || 1),
      bathrooms: Number(bathrooms || 1),
      areaSqFt: Number(areaSqFt || 500),
      furnishing: furnishing || "unfurnished",
      preferredFor: preferredFor || "any",
      amenities: Array.isArray(amenities) ? amenities : [],
      images: propertyImages,
      status: "pending",
      rejectionReason: null,
      featured: false,
      ratingAvg: 0,
      ratingCount: 0,
      createdAt: now,
    };

    await docRef.set(propertyDoc);

    return NextResponse.json({ ok: true, propertyId: docRef.id, property: propertyDoc });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to create property listing";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
