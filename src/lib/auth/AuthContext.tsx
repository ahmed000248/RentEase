"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signOut as firebaseSignOut,
  type User as FirebaseUser,
} from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase/client";
import type { UserDoc, UserRole } from "@/lib/firebase/types";

interface AuthContextValue {
  firebaseUser: FirebaseUser | null;
  userDoc: UserDoc | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (params: {
    email: string;
    password: string;
    name: string;
    phone?: string;
    roles: UserRole[];
  }) => Promise<void>;
  signOutUser: () => Promise<void>;
  refreshUserDoc: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

async function establishSession(firebaseUser: FirebaseUser) {
  const idToken = await firebaseUser.getIdToken();
  await fetch("/api/auth/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
  });
}

async function fetchUserDoc(): Promise<UserDoc | null> {
  const res = await fetch("/api/auth/me");
  if (!res.ok) return null;
  const data = await res.json();
  return data.user ?? null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [userDoc, setUserDoc] = useState<UserDoc | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUserDoc = useCallback(async () => {
    setUserDoc(await fetchUserDoc());
  }, []);

  useEffect(() => {
    // Firebase not configured yet (missing/invalid env vars) — degrade to a
    // logged-out state instead of crashing every page in the app.
    let firebaseAuth;
    try {
      firebaseAuth = getFirebaseAuth();
    } catch (err) {
      console.error("Firebase Auth failed to initialize:", err);
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(
      firebaseAuth,
      async (user) => {
        setFirebaseUser(user);
        if (user) {
          await establishSession(user);
          setUserDoc(await fetchUserDoc());
        } else {
          setUserDoc(null);
        }
        setLoading(false);
      },
      (err) => {
        console.error("Firebase Auth state listener error:", err);
        setFirebaseUser(null);
        setUserDoc(null);
        setLoading(false);
      }
    );
    return unsubscribe;
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    await signInWithEmailAndPassword(getFirebaseAuth(), email, password);
  }, []);

  const signUp = useCallback(
    async ({
      email,
      password,
      name,
      phone,
      roles,
    }: {
      email: string;
      password: string;
      name: string;
      phone?: string;
      roles: UserRole[];
    }) => {
      const credential = await createUserWithEmailAndPassword(getFirebaseAuth(), email, password);
      await sendEmailVerification(credential.user);

      const idToken = await credential.user.getIdToken();
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken, name, phone, roles }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Registration failed");
      }

      await establishSession(credential.user);
      setUserDoc(await fetchUserDoc());
    },
    []
  );

  const signOutUser = useCallback(async () => {
    await fetch("/api/auth/session", { method: "DELETE" });
    await firebaseSignOut(getFirebaseAuth());
    setUserDoc(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ firebaseUser, userDoc, loading, signIn, signUp, signOutUser, refreshUserDoc }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
