import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { adminDb } from "@/lib/firebase/admin";

function verifyStripeSignature(bodyText: string, sigHeader: string, secret: string): boolean {
  try {
    const items = sigHeader.split(",").reduce((acc: Record<string, string>, item) => {
      const [key, val] = item.split("=");
      if (key && val) acc[key.trim()] = val.trim();
      return acc;
    }, {});

    const timestamp = items["t"];
    const signature = items["v1"];
    if (!timestamp || !signature) return false;

    const payload = `${timestamp}.${bodyText}`;
    const expected = crypto.createHmac("sha256", secret).update(payload).digest("hex");

    const sigBuf = Buffer.from(signature);
    const expBuf = Buffer.from(expected);
    if (sigBuf.length !== expBuf.length) return false;

    return crypto.timingSafeEqual(sigBuf, expBuf);
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  const bodyText = await request.text();
  const sig = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret || !sig) {
    return NextResponse.json(
      { error: "Webhook secret or signature missing. Unverified webhooks are rejected." },
      { status: 400 }
    );
  }

  const isValid = verifyStripeSignature(bodyText, sig, webhookSecret);
  if (!isValid) {
    return NextResponse.json({ error: "Invalid Stripe signature" }, { status: 400 });
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
