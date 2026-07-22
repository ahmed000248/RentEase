"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface ScrollTextPanelProps {
  badge?: string;
  title: string;
  subhead?: string;
  position?: "left" | "right" | "center";
  active: boolean;
}

export default function ScrollTextPanel({
  badge,
  title,
  subhead,
  position = "left",
  active,
}: ScrollTextPanelProps) {
  const positionClasses = {
    left: "items-start text-left justify-center md:justify-start md:pl-16 lg:pl-24",
    right: "items-end text-right justify-center md:justify-end md:pr-16 lg:pr-24",
    center: "items-center text-center justify-center",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.96 }}
      animate={
        active
          ? { opacity: 1, y: 0, scale: 1 }
          : { opacity: 0, y: -20, scale: 0.96 }
      }
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={`pointer-events-none absolute inset-0 z-20 flex px-6 py-12 flex-col ${positionClasses[position]}`}
    >
      <div className="max-w-xl rounded-3xl border border-white/10 bg-black/60 p-8 md:p-10 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.7)]">
        {badge && (
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-green/30 bg-brand-green/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-brand-green backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5" />
            <span>{badge}</span>
          </div>
        )}

        <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white leading-tight mb-4">
          {title}
        </h2>

        {subhead && (
          <p className="text-base md:text-lg text-white/80 font-normal leading-relaxed">
            {subhead}
          </p>
        )}
      </div>
    </motion.div>
  );
}
