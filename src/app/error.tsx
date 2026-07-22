"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RefreshCw, Home } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App Error Boundary Caught:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mb-6">
        <AlertCircle className="w-8 h-8" />
      </div>
      <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">Something went wrong</h1>
      <p className="text-white/60 max-w-md text-sm sm:text-base leading-relaxed mb-8">
        An unexpected error occurred. You can try refreshing the page or navigating back to safety.
      </p>
      <div className="flex items-center gap-4 flex-wrap justify-center">
        <button
          onClick={() => reset()}
          className="inline-flex items-center gap-2 bg-brand-green text-black px-6 py-3 rounded-full text-sm font-bold hover:bg-white transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Try Again</span>
        </button>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-white/10 border border-white/15 text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-white/20 transition-colors"
        >
          <Home className="w-4 h-4" />
          <span>Go Home</span>
        </Link>
      </div>
    </div>
  );
}
