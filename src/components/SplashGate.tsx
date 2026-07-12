"use client";

import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import SplashScreen from "./SplashScreen";

export default function SplashGate({ children }: { children: React.ReactNode }) {
  const [showSplash, setShowSplash] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const hasSeen = sessionStorage.getItem("hasSeenIntro");
    if (!hasSeen) {
      setShowSplash(true);
      sessionStorage.setItem("hasSeenIntro", "true");
    }
  }, []);

  useEffect(() => {
    if (isClient) {
      document.body.style.overflow = showSplash ? "hidden" : "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showSplash, isClient]);

  return (
    <>
      <AnimatePresence>
        {isClient && showSplash && (
          <SplashScreen onComplete={() => setShowSplash(false)} />
        )}
      </AnimatePresence>
      {children}
    </>
  );
}
