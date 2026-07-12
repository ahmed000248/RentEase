"use client";

import { motion } from "framer-motion";
import { useEffect } from "react";

const LETTERS = "RENTEASE".split("");
const ACCENT = "#00C853";
const EASE_LETTER: [number, number, number, number] = [0.2, 0.8, 0.2, 1];
const EASE_ZOOM: [number, number, number, number] = [0.76, 0, 0.18, 1];

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 3800);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: EASE_LETTER }}
      onClick={onComplete}
      className="font-splash fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-black cursor-pointer select-none"
    >
      {/* Zoom wrapper */}
      <motion.div
        initial={{ scale: 0.3 }}
        animate={{ scale: [0.3, 0.3, 1] }}
        transition={{ duration: 2.5, times: [0, 0.52, 1], ease: EASE_ZOOM, delay: 0.2 }}
        className="absolute inset-0 flex origin-[50%_46%] items-center justify-center"
      >
        <h1 className="m-0 -mt-[8vh] flex whitespace-nowrap text-[21.5vw] font-bold leading-none tracking-[-0.015em] text-white">
          {LETTERS.map((letter, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: "0.35em", filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.55, ease: EASE_LETTER, delay: 0.25 + i * 0.08 }}
              className="inline-block"
            >
              {letter}
            </motion.span>
          ))}
        </h1>
      </motion.div>

      {/* Tagline pill */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE_LETTER, delay: 2.75 }}
        className="absolute inset-x-0 bottom-[11vh] flex justify-center px-6"
      >
        <div
          className="rounded-full px-6 py-3 text-center text-[11px] font-semibold uppercase tracking-[0.14em] sm:px-8 sm:text-sm md:px-[34px] md:py-3.5 md:text-base"
          style={{ border: `1px solid ${ACCENT}55`, color: ACCENT }}
        >
          Curated Luxury &middot; Direct Connections &middot; Zero Commissions
        </div>
      </motion.div>

      {/* Corner mark */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE_LETTER, delay: 2.95 }}
        className="absolute bottom-6 left-7 flex h-[46px] w-[46px] items-center justify-center rounded-full border border-white/35 text-xl font-semibold text-white"
      >
        N&#824;
      </motion.div>
    </motion.div>
  );
}
