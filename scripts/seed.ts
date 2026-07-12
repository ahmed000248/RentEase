import "dotenv/config";
import { cert, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import type { UserDoc, PropertyDoc } from "../src/lib/firebase/types";

const raw = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
if (!raw) {
  console.error("FIREBASE_SERVICE_ACCOUNT_KEY is not set (check .env.local).");
  process.exit(1);
}

const app = initializeApp({
  credential: cert(JSON.parse(raw)),
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
});
const auth = getAuth(app);
const db = getFirestore(app);

const DEMO_PASSWORD = "RentEase!2026";

async function upsertUser(params: {
  email: string;
  name: string;
  roles: UserDoc["roles"];
  admin?: boolean;
}): Promise<string> {
  let userRecord;
  try {
    userRecord = await auth.getUserByEmail(params.email);
  } catch {
    userRecord = await auth.createUser({
      email: params.email,
      password: DEMO_PASSWORD,
      displayName: params.name,
      emailVerified: true,
    });
  }

  if (params.admin) {
    await auth.setCustomUserClaims(userRecord.uid, { admin: true });
  }

  const userDoc: UserDoc = {
    uid: userRecord.uid,
    name: params.name,
    email: params.email,
    phone: null,
    roles: params.roles,
    emailVerified: true,
    photoURL: null,
    suspended: false,
    createdAt: Date.now(),
  };
  await db.collection("users").doc(userRecord.uid).set(userDoc, { merge: true });
  console.log(`Seeded ${params.admin ? "admin" : params.roles.join("+")} user: ${params.email}`);
  return userRecord.uid;
}

async function seedProperty(ownerId: string) {
  const ref = db.collection("properties").doc();
  const property: PropertyDoc = {
    id: ref.id,
    ownerId,
    title: "Sunlit 2-Bed Apartment near Downtown",
    description:
      "A bright, freshly renovated 2-bedroom apartment with modern fittings, close to transit and shopping.",
    type: "apartment",
    price: 950,
    city: "Lahore",
    location: "Gulberg III",
    bedrooms: 2,
    bathrooms: 2,
    areaSqFt: 1100,
    furnishing: "semi-furnished",
    preferredFor: "any",
    amenities: ["Car Parking", "WiFi", "Electricity", "Water Supply", "Sui Gas"],
    images: [],
    status: "approved",
    rejectionReason: null,
    featured: true,
    ratingAvg: 0,
    ratingCount: 0,
    createdAt: Date.now(),
  };
  await ref.set(property);
  console.log(`Seeded demo property: ${property.title}`);
}

async function main() {
  await upsertUser({ email: "admin@rentease.demo", name: "RentEase Admin", roles: ["tenant"], admin: true });
  const ownerId = await upsertUser({ email: "owner@rentease.demo", name: "Demo Owner", roles: ["owner"] });
  await upsertUser({ email: "tenant@rentease.demo", name: "Demo Tenant", roles: ["tenant"] });
  await seedProperty(ownerId);

  console.log("\nDemo accounts (password for all: " + DEMO_PASSWORD + "):");
  console.log("  admin@rentease.demo");
  console.log("  owner@rentease.demo");
  console.log("  tenant@rentease.demo");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
