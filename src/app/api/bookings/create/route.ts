import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/server";
import { adminDb } from "@/lib/firebase/admin";
import type { BookingDoc, PropertyDoc } from "@/lib/firebase/types";
import { isPropertyAvailable } from "@/lib/data/bookings";

export async function POST(request: NextRequest) {
  let user;
  try {
    user = await requireUser();
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unauthorized";
    return NextResponse.json({ error: msg }, { status: 401 });
  }

  const { propertyId, startDate, endDate } = await request.json();

  if (!propertyId || typeof startDate !== "number" || typeof endDate !== "number") {
    return NextResponse.json({ error: "Missing required booking details" }, { status: 400 });
  }

  if (startDate >= endDate || startDate < Date.now() - 86400000) {
    return NextResponse.json({ error: "Invalid date range" }, { status: 400 });
  }

  const propSnap = await adminDb().collection("properties").doc(propertyId).get();
  if (!propSnap.exists) {
    return NextResponse.json({ error: "Property not found" }, { status: 404 });
  }

  const property = propSnap.data() as PropertyDoc;
  if (property.status !== "approved") {
    return NextResponse.json({ error: "Property is not available for booking" }, { status: 400 });
  }

  // Check date collision
  const available = await isPropertyAvailable(propertyId, startDate, endDate);
  if (!available) {
    return NextResponse.json({ error: "Property is already booked for selected dates" }, { status: 409 });
  }

  // Calculate amount (days * price per night in cents/units)
  const nights = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
  const amount = Math.round(nights * property.price * 100);

  const now = Date.now();
  const bookingRef = adminDb().collection("bookings").doc();

  const bookingDoc: BookingDoc = {
    id: bookingRef.id,
    propertyId,
    tenantId: user.uid,
    ownerId: property.ownerId,
    startDate,
    endDate,
    status: "pending_payment",
    amount,
    paymentIntentId: null,
    stripeSessionId: null,
    createdAt: now,
  };

  // Stripe Checkout Session Integration (if key provided)
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  let checkoutUrl: string | null = null;

  if (stripeSecretKey) {
    try {
      // Dynamic import of Stripe to avoid build error when package not installed
      // Node fetch fallback to Stripe REST API directly if stripe SDK not installed
      const stripeRes = await fetch("https://api.stripe.com/v1/checkout/sessions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${stripeSecretKey}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          "payment_method_types[0]": "card",
          "line_items[0][price_data][currency]": "usd",
          "line_items[0][price_data][product_data][name]": `Reservation: ${property.title}`,
          "line_items[0][price_data][unit_amount]": String(amount),
          "line_items[0][quantity]": "1",
          mode: "payment",
          success_url: `${request.nextUrl.origin}/owner/dashboard?booking=success`,
          cancel_url: `${request.nextUrl.origin}/properties/${propertyId}?booking=cancelled`,
          client_reference_id: bookingRef.id,
          "metadata[bookingId]": bookingRef.id,
        }).toString(),
      });

      const session = await stripeRes.json();
      if (session.url) {
        checkoutUrl = session.url;
        bookingDoc.stripeSessionId = session.id;
      }
    } catch {
      console.warn("Stripe Checkout Session creation failed, falling back to pending status.");
    }
  }

  await bookingRef.set(bookingDoc);

  return NextResponse.json({
    ok: true,
    booking: bookingDoc,
    checkoutUrl,
  });
}
