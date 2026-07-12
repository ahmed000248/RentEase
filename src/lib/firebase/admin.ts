import "server-only";
import { cert, getApps, getApp, initializeApp, type App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

function loadServiceAccount() {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed.private_key === "string") {
      parsed.private_key = parsed.private_key.replace(/\\n/g, "\n");
    }
    return parsed;
  } catch (err) {
    try {
      const extractField = (field: string) => {
        const regex = new RegExp('"' + field + '"\\s*:\\s*"([^"\\\\]*(?:\\\\.[^"\\\\]*)*)"', "s");
        const match = raw.match(regex);
        if (match) {
          try {
            return JSON.parse('"' + match[1] + '"');
          } catch {
            return match[1];
          }
        }
        return undefined;
      };

      const projectId = extractField("project_id");
      const clientEmail = extractField("client_email");
      let privateKey = extractField("private_key");

      if (projectId && clientEmail && privateKey) {
        if (typeof privateKey === "string") {
          privateKey = privateKey.replace(/\\n/g, "\n");
        }
        return {
          project_id: projectId,
          client_email: clientEmail,
          private_key: privateKey,
          private_key_id: extractField("private_key_id"),
          type: extractField("type") || "service_account",
        };
      }
    } catch {}
    throw err;
  }
}

function getAdminApp(): App {
  if (getApps().length) return getApp();

  const serviceAccount = loadServiceAccount();
  if (!serviceAccount) {
    throw new Error(
      "Firebase Admin SDK not configured: set FIREBASE_SERVICE_ACCOUNT_KEY in your environment (see .env.example)."
    );
  }

  return initializeApp({
    credential: cert(serviceAccount),
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  });
}

export function isAdminConfigured(): boolean {
  return Boolean(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
}

export function adminAuth() {
  return getAuth(getAdminApp());
}

export function adminDb() {
  return getFirestore(getAdminApp());
}

export function adminStorage() {
  return getStorage(getAdminApp());
}
