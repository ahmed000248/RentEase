"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RefreshCw, Home } from "lucide-react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-6">
        <AlertCircle className="w-8 h-8" />
      </div>
      <h1 className="text-3xl font-extrabold tracking-tight mb-3">Dashboard Error</h1>
      <p className="text-white/60 max-w-md text-sm leading-relaxed mb-8">
        We encountered a problem loading your dashboard. Please try again or return home.
      </p>
      <div className="flex items-center gap-4">
        <button
          onClick={() => reset()}
          className="inline-flex items-center gap-2 bg-brand-green text-black px-6 py-3 rounded-full text-sm font-bold hover:bg-white transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Retry</span>
        </button>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-white/10 border border-white/15 text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-white/20 transition-colors"
        >
          <Home className="w-4 h-4" />
          <span>Home</span>
        </Link>
      </div>
    </div>
  );
}
