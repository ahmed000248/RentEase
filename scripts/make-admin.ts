import "dotenv/config";
import { cert, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

const raw = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
if (!raw) {
  console.error("FIREBASE_SERVICE_ACCOUNT_KEY is not set (check .env or .env.local).");
  process.exit(1);
}

const app = initializeApp({ credential: cert(JSON.parse(raw)) });
const auth = getAuth(app);

const TARGET_EMAIL = "ahmedraa0007@gmail.com";

async function main() {
  const user = await auth.getUserByEmail(TARGET_EMAIL);
  await auth.setCustomUserClaims(user.uid, { admin: true });
  console.log(`✅ Admin claim granted to ${TARGET_EMAIL} (uid: ${user.uid})`);
  console.log("⚠️  The user must sign out and sign back in for the change to take effect.");
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Error:", err.message);
  process.exit(1);
});
