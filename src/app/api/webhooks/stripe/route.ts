import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";

export async function POST(request: NextRequest) {
  const bodyText = await request.text();
  const sig = request.headers.get("stripe-signature");

  // If webhook secret isn't configured, acknowledge receipt gracefully
  if (!process.env.STRIPE_WEBHOOK_SECRET || !sig) {
    return NextResponse.json({ received: true, note: "Webhook secret or signature missing" });
  }

  try {
    const payload = JSON.parse(bodyText);
    const eventType = payload.type;

    if (eventType === "checkout.session.completed") {
      const session = payload.data?.object;
      const bookingId = session?.metadata?.bookingId || session?.client_reference_id;
      const paymentIntentId = session?.payment_intent;

      if (bookingId) {
        await adminDb().collection("bookings").doc(bookingId).update({
          status: "confirmed",
          paymentIntentId: paymentIntentId || null,
        });
      }
    } else if (eventType === "payment_intent.payment_failed") {
      const intent = payload.data?.object;
      const bookingId = intent?.metadata?.bookingId;

      if (bookingId) {
        await adminDb().collection("bookings").doc(bookingId).update({
          status: "cancelled",
        });
      }
    }

    return NextResponse.json({ received: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Webhook handler failed";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
