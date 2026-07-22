"use client";

import { motion } from "framer-motion";

interface ScrollTextPanelProps {
  title: string;
  subhead?: string;
  position?: "left" | "right" | "center";
  active: boolean;
}

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1] as const,
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    y: -16,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const },
  },
};

const wordVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export default function ScrollTextPanel({
  title,
  subhead,
  position = "left",
  active,
}: ScrollTextPanelProps) {
  const positionClasses = {
    left: "items-start text-left justify-center md:justify-start md:pl-16 lg:pl-28",
    right: "items-end text-right justify-center md:justify-end md:pr-16 lg:pr-28",
    center: "items-center text-center justify-center",
  };

  const words = title.split(" ");

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate={active ? "visible" : "exit"}
      className={`pointer-events-none absolute inset-0 z-20 flex px-6 py-12 flex-col ${positionClasses[position]}`}
    >
      <div className="max-w-2xl drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
        <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1] mb-6 flex flex-wrap gap-x-3 gap-y-1">
          {words.map((word, idx) => (
            <motion.span key={idx} variants={wordVariants} className="inline-block">
              {word}
            </motion.span>
          ))}
        </h2>

        {subhead && (
          <motion.p
            variants={wordVariants}
            className="text-lg md:text-2xl text-white/90 font-light leading-relaxed max-w-xl"
          >
            {subhead}
          </motion.p>
        )}
      </div>
    </motion.div>
  );
}
