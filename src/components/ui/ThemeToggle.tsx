"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={`w-10 h-10 rounded-full border border-white/10 bg-white/5 animate-pulse ${className}`} />
    );
  }

  const isDark = (theme === "system" ? resolvedTheme : theme) === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Toggle light/dark theme"
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      className={`w-10 h-10 rounded-full border border-white/15 dark:border-white/15 bg-white/10 dark:bg-white/10 text-white flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 ${className}`}
    >
      {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-teal-400" />}
    </button>
  );
}
