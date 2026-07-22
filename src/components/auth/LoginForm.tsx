"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { sendPasswordResetEmail } from "firebase/auth";
import {
  ArrowLeft,
  ArrowRight,
  BadgeDollarSign,
  Building2,
  Home as HomeIcon,
  Loader2,
  Lock,
  Mail,
  User,
} from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";
import { getFirebaseAuth } from "@/lib/firebase/client";
import type { UserRole } from "@/lib/firebase/types";

const ACCENT = "#1DB954";
const EASE = [0.16, 1, 0.3, 1] as const;

const STATS = [
  { icon: HomeIcon, value: "Verified", label: "LISTINGS" },
  { icon: Building2, value: "5+", label: "CITIES" },
  { icon: BadgeDollarSign, value: "$0", label: "FEES" },
];

function fieldClass() {
  return "flex items-center gap-2.5 border border-white/12 bg-[#141417] rounded-full px-5 py-3.5 focus-within:border-brand-green transition-colors";
}

function inputClass() {
  return "flex-1 bg-transparent border-none outline-none text-sm font-semibold tracking-wide text-[#f2f2f4] placeholder:text-[#6b6b72] min-w-0";
}

function friendlyAuthError(err: unknown): string {
  const code = err instanceof Error ? err.message : String(err);
  if (code.includes("auth/invalid-credential") || code.includes("auth/wrong-password") || code.includes("auth/user-not-found")) {
    return "Incorrect email or password.";
  }
  if (code.includes("auth/email-already-in-use")) return "An account with this email already exists.";
  if (code.includes("auth/weak-password")) return "Password must be at least 6 characters.";
  if (code.includes("auth/invalid-email")) return "Please enter a valid email address.";
  if (code.includes("auth/too-many-requests")) return "Too many attempts. Please try again later.";
  return "Something went wrong. Please try again.";
}

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/";
  const { signIn, signUp } = useAuth();

  const [tab, setTab] = useState<"signin" | "signup">("signin");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetNotice, setResetNotice] = useState<string | null>(null);

  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");

  const [name, setName] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<UserRole>("tenant");

  const isSignIn = tab === "signin";

  const switchTab = (t: "signin" | "signup") => {
    setTab(t);
    setError(null);
    setResetNotice(null);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResetNotice(null);
    setBusy(true);
    try {
      await signIn(signInEmail, signInPassword);
      router.push(next);
    } catch (err) {
      setError(friendlyAuthError(err));
    } finally {
      setBusy(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (signUpPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (signUpPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setBusy(true);
    try {
      await signUp({ email: signUpEmail, password: signUpPassword, name, roles: [role] });
      router.push(next);
    } catch (err) {
      setError(friendlyAuthError(err));
    } finally {
      setBusy(false);
    }
  };

  const handleForgotPassword = async () => {
    setError(null);
    if (!signInEmail.trim()) {
      setError("Enter your email above, then tap “Forgot password?” to get a reset link.");
      return;
    }
    try {
      await sendPasswordResetEmail(getFirebaseAuth(), signInEmail.trim());
      setResetNotice(`Password reset link sent to ${signInEmail.trim()}.`);
    } catch (err) {
      setError(friendlyAuthError(err));
    }
  };

  return (
    <div className="flex w-full min-h-screen overflow-hidden bg-white">
      {/* LEFT: HERO */}
      <div className="relative hidden lg:block w-[46%] h-screen flex-shrink-0 overflow-hidden">
        <motion.div
          initial={{ scale: 1 }}
          animate={{ scale: 1.09 }}
          transition={{ duration: 22, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
          className="absolute -inset-[4%]"
        >
          <Image src="/images/property_villa.png" alt="" fill priority className="object-cover" />
        </motion.div>
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(3,14,9,0.8) 0%, rgba(3,10,7,0.88) 45%, rgba(2,6,4,0.97) 100%)",
          }}
        />

        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="relative h-full flex flex-col justify-between p-11"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-[10px] bg-brand-green/25 border border-brand-green/50 flex items-center justify-center">
              <HomeIcon className="w-[18px] h-[18px] text-white" strokeWidth={2} />
            </div>
            <span className="text-white text-[15px] font-bold tracking-[0.16em]">RENTEASE</span>
          </div>

          <div>
            <h1 className="text-[34px] leading-[1.2] font-bold text-white tracking-tight mb-3.5">
              Welcome back to
              <br />
              <span className="italic text-[#e5e5e8]">your next home.</span>
            </h1>
            <p className="text-[15px] leading-[1.55] text-[#cfd3d0] max-w-[400px] mb-5.5">
              Verified houses, apartments, hostels, and shops — filtered by city, budget, and bedrooms, with direct
              owner contact and no commission.
            </p>
            <div className="flex gap-3.5">
              {STATS.map((s) => (
                <div
                  key={s.label}
                  className="flex-1 bg-white/8 border border-white/15 backdrop-blur-md rounded-xl px-4 py-3.5"
                >
                  <div className="flex items-center gap-1.5 text-[#d5d9d6] text-[11px] font-semibold tracking-[0.1em] mb-2">
                    <s.icon className="w-3 h-3" />
                    {s.label}
                  </div>
                  <div className="text-white text-[22px] font-bold">{s.value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between text-[#9aa39d] text-xs font-semibold tracking-[0.12em]">
            <span>PRIVATE WORKSPACE</span>
            <span>OWNER &middot; TENANT &middot; ADMIN</span>
          </div>
        </motion.div>
      </div>

      {/* RIGHT: FORM */}
      <div className="flex-1 min-h-screen overflow-y-auto flex items-center justify-center bg-[#0a0a0c]">
        <div className="w-full max-w-[460px] px-6 py-10">
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="flex items-center justify-between mb-8"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-[10px] flex items-center justify-center" style={{ background: ACCENT }}>
                <HomeIcon className="w-[18px] h-[18px] text-white" strokeWidth={2} />
              </div>
              <span className="text-[19px] font-bold text-white">
                Rent<span style={{ color: ACCENT }}>Ease</span>
              </span>
            </div>
            <Link href="/" className="flex items-center gap-1.5 text-[#9a9aa2] text-sm font-medium hover:text-white transition-colors">
              <ArrowLeft className="w-[13px] h-[13px]" />
              Back home
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: EASE }}
            className="relative flex bg-[#17171b] border border-white/8 rounded-full p-[5px] mb-8"
          >
            <div
              className="absolute top-[5px] bottom-[5px] left-[5px] w-[calc(50%-5px)] bg-[#2a2a30] rounded-full shadow-[0_2px_10px_rgba(0,0,0,0.3)] transition-transform duration-[350ms]"
              style={{
                transform: isSignIn ? "translateX(0)" : "translateX(100%)",
                transitionTimingFunction: "cubic-bezier(0.65,0,0.35,1)",
              }}
            />
            <button
              type="button"
              onClick={() => switchTab("signin")}
              className="relative flex-1 py-3 text-[15px] font-semibold z-[1] cursor-pointer"
              style={{ color: isSignIn ? ACCENT : "#9a9aa2" }}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => switchTab("signup")}
              className="relative flex-1 py-3 text-[15px] font-semibold z-[1] cursor-pointer"
              style={{ color: isSignIn ? "#9a9aa2" : "#fff" }}
            >
              Create Account
            </button>
          </motion.div>

          {error && (
            <div className="mb-5 text-sm text-red-400 bg-red-500/10 border border-red-500/25 rounded-xl px-4 py-3">
              {error}
            </div>
          )}
          {resetNotice && (
            <div className="mb-5 text-sm text-brand-green bg-brand-green/10 border border-brand-green/25 rounded-xl px-4 py-3">
              {resetNotice}
            </div>
          )}

          {isSignIn ? (
            <motion.form
              key="signin"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              onSubmit={handleSignIn}
            >
              <h2 className="text-[27px] font-bold text-white mb-1.5">Welcome back.</h2>
              <p className="text-base text-[#9a9aa2] mb-7">Pick up where you left off.</p>

              <label className={`${fieldClass()} mb-4`}>
                <Mail className="w-4 h-4 text-[#8a8f96] flex-shrink-0" />
                <input
                  type="email"
                  required
                  placeholder="EMAIL"
                  value={signInEmail}
                  onChange={(e) => setSignInEmail(e.target.value)}
                  className={inputClass()}
                />
              </label>

              <label className={`${fieldClass()} mb-4.5`}>
                <Lock className="w-4 h-4 text-[#8a8f96] flex-shrink-0" />
                <input
                  type="password"
                  required
                  placeholder="PASSWORD"
                  value={signInPassword}
                  onChange={(e) => setSignInPassword(e.target.value)}
                  className={inputClass()}
                />
              </label>

              <div className="flex items-center justify-between mb-6">
                <label className="flex items-center gap-2 text-sm text-[#c4c4ca] cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-[17px] h-[17px] accent-brand-green" />
                  Remember me
                </label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm font-semibold cursor-pointer"
                  style={{ color: ACCENT }}
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={busy}
                className="w-full flex items-center justify-center gap-2.5 text-white text-base font-bold py-4 rounded-full transition-transform hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0 cursor-pointer"
                style={{
                  background: `linear-gradient(135deg, ${ACCENT}, #17a34a)`,
                  boxShadow: "0 10px 24px rgba(29,185,84,0.35)",
                }}
              >
                {busy ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <p className="text-center text-sm text-[#9a9aa2] mt-5">
                New to RentEase?{" "}
                <button type="button" onClick={() => switchTab("signup")} className="font-bold cursor-pointer" style={{ color: ACCENT }}>
                  Create an account
                </button>
              </p>
            </motion.form>
          ) : (
            <motion.form
              key="signup"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              onSubmit={handleSignUp}
            >
              <h2 className="text-[27px] font-bold text-white mb-1.5">Create your account.</h2>
              <p className="text-base text-[#9a9aa2] mb-7">Find your next home in minutes.</p>

              <label className={`${fieldClass()} mb-4`}>
                <User className="w-4 h-4 text-[#8a8f96] flex-shrink-0" />
                <input
                  type="text"
                  required
                  placeholder="FULL NAME"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={inputClass()}
                />
              </label>

              <label className={`${fieldClass()} mb-4`}>
                <Mail className="w-4 h-4 text-[#8a8f96] flex-shrink-0" />
                <input
                  type="email"
                  required
                  placeholder="EMAIL"
                  value={signUpEmail}
                  onChange={(e) => setSignUpEmail(e.target.value)}
                  className={inputClass()}
                />
              </label>

              <label className={`${fieldClass()} mb-4`}>
                <Lock className="w-4 h-4 text-[#8a8f96] flex-shrink-0" />
                <input
                  type="password"
                  required
                  placeholder="PASSWORD"
                  value={signUpPassword}
                  onChange={(e) => setSignUpPassword(e.target.value)}
                  className={inputClass()}
                />
              </label>

              <label className={`${fieldClass()} mb-5`}>
                <Lock className="w-4 h-4 text-[#8a8f96] flex-shrink-0" />
                <input
                  type="password"
                  required
                  placeholder="CONFIRM PASSWORD"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={inputClass()}
                />
              </label>

              <div className="mb-6">
                <span className="block text-xs font-semibold text-[#8a8f96] tracking-wide mb-2.5">I AM A...</span>
                <div className="flex gap-2.5">
                  <button
                    type="button"
                    onClick={() => setRole("tenant")}
                    className="flex-1 rounded-full py-3 text-sm font-semibold border transition-colors cursor-pointer"
                    style={
                      role === "tenant"
                        ? { background: ACCENT, borderColor: ACCENT, color: "#04150a" }
                        : { background: "#141417", borderColor: "rgba(255,255,255,0.12)", color: "#c4c4ca" }
                    }
                  >
                    Tenant, renting a home
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole("owner")}
                    className="flex-1 rounded-full py-3 text-sm font-semibold border transition-colors cursor-pointer"
                    style={
                      role === "owner"
                        ? { background: ACCENT, borderColor: ACCENT, color: "#04150a" }
                        : { background: "#141417", borderColor: "rgba(255,255,255,0.12)", color: "#c4c4ca" }
                    }
                  >
                    Owner, listing a property
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={busy}
                className="w-full flex items-center justify-center gap-2.5 text-white text-base font-bold py-4 rounded-full transition-transform hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0 cursor-pointer"
                style={{
                  background: `linear-gradient(135deg, ${ACCENT}, #17a34a)`,
                  boxShadow: "0 10px 24px rgba(29,185,84,0.35)",
                }}
              >
                {busy ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <p className="text-center text-sm text-[#9a9aa2] mt-5">
                Already have an account?{" "}
                <button type="button" onClick={() => switchTab("signin")} className="font-bold cursor-pointer" style={{ color: ACCENT }}>
                  Sign in
                </button>
              </p>
            </motion.form>
          )}

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center text-[13px] leading-[1.6] text-[#6a6a70] mt-7"
          >
            By continuing you agree to RentEase&apos;s listing guidelines. Your account, favorites, and inquiries
            stay private to you.
          </motion.p>
        </div>
      </div>
    </div>
  );
}
