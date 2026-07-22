"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, animate, motion } from "framer-motion";
import { MapPin, BedDouble, Bath, Maximize2, Sparkles, Star, X } from "lucide-react";
import { titleCase } from "@/lib/format";
import type { PropertyDoc } from "@/lib/firebase/types";

const FALLBACK_IMAGE = "/images/property_apartment.png";
const EASE = [0.16, 1, 0.3, 1] as const;

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: EASE } },
};

function PriceCounter({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const controls = animate(0, value, {
      duration: 1.1,
      delay: 0.15,
      ease: EASE,
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [value]);

  return <>{display.toLocaleString("en-US")}</>;
}

interface ExpandedState {
  property: PropertyDoc;
  rect: { top: number; left: number; width: number; height: number };
}

export default function PropertyListingGrid({ properties }: { properties: PropertyDoc[] }) {
  const [expanded, setExpanded] = useState<ExpandedState | null>(null);

  const openCard = (property: PropertyDoc, el: HTMLElement) => {
    const rect = el.getBoundingClientRect();
    setExpanded({
      property,
      rect: { top: rect.top, left: rect.left, width: rect.width, height: rect.height },
    });
  };

  const closeCard = () => setExpanded(null);

  return (
    <>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex-1 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
      >
        {properties.map((p) => (
          <motion.div
            key={p.id}
            variants={cardVariants}
            onClick={(e) => openCard(p, e.currentTarget)}
            className="bg-[#141417] border border-white/8 rounded-2xl overflow-hidden flex flex-col cursor-pointer hover:border-white/15 transition-colors"
          >
            <div className="relative w-full aspect-[4/3]">
              <Image
                src={p.images[0] || FALLBACK_IMAGE}
                alt={p.title}
                fill
                className="object-cover"
              />
              <span className="absolute top-3 left-3 bg-brand-green text-black text-[11px] font-bold px-2.5 py-1 rounded-full tracking-wide pointer-events-none">
                {titleCase(p.type)}
              </span>
              {p.featured ? (
                <span className="absolute top-3 right-3 flex items-center gap-1.5 bg-teal-400/15 border border-teal-400/50 text-teal-300 text-[11px] font-bold px-2.5 py-1 rounded-full backdrop-blur-sm pointer-events-none">
                  <Sparkles className="w-2.5 h-2.5" />
                  FEATURED
                </span>
              ) : p.ratingAvg > 0 ? (
                <span className="absolute top-3 right-3 flex items-center gap-1 bg-black/60 border border-white/10 text-amber-400 text-[11px] font-bold px-2.5 py-1 rounded-full backdrop-blur-sm pointer-events-none">
                  <Star className="w-3 h-3 fill-amber-400" />
                  {p.ratingAvg.toFixed(1)}
                </span>
              ) : null}
            </div>

            <div className="p-4.5 pb-5 flex flex-col flex-1">
              <div className="text-xl font-bold text-brand-green">
                $<PriceCounter value={p.price} />
                <span className="text-[13px] font-medium text-white/50">/mo</span>
              </div>
              <div className="text-[17px] font-semibold text-white mt-2 line-clamp-1">{p.title}</div>
              <div className="flex items-center gap-1.5 mt-1.5 text-[13px] text-white/50">
                <MapPin className="w-3 h-3 flex-shrink-0" />
                <span className="truncate">{p.location}, {p.city}</span>
              </div>
              <div className="flex items-center gap-4 mt-3.5 pt-3.5 border-t border-white/8 text-[13px] text-white/60">
                <span className="flex items-center gap-1.5">
                  <BedDouble className="w-3.5 h-3.5 text-teal-400" />
                  {p.bedrooms} Bed{p.bedrooms === 1 ? "" : "s"}
                </span>
                <span className="flex items-center gap-1.5">
                  <Bath className="w-3.5 h-3.5 text-teal-400" />
                  {p.bathrooms} Bath{p.bathrooms === 1 ? "" : "s"}
                </span>
                <span className="flex items-center gap-1.5">
                  <Maximize2 className="w-3.5 h-3.5 text-teal-400" />
                  {p.areaSqFt.toLocaleString()} Sq Ft
                </span>
              </div>
              <Link
                href={`/properties/${p.id}`}
                onClick={(e) => e.stopPropagation()}
                className="w-full text-center bg-brand-green text-black text-sm font-bold py-3 rounded-lg mt-4.5 hover:bg-white transition-colors"
              >
                View Details
              </Link>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <AnimatePresence>
        {expanded && <ExpandedCard state={expanded} onClose={closeCard} />}
      </AnimatePresence>
    </>
  );
}

function ExpandedCard({ state, onClose }: { state: ExpandedState; onClose: () => void }) {
  const { property, rect } = state;
  const [textVisible, setTextVisible] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setTextVisible(true), 500);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <>
      <motion.div
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.35 }}
        className="fixed inset-0 bg-black/70 z-[998]"
      />
      <motion.div
        initial={{ top: rect.top, left: rect.left, width: rect.width, height: rect.height, borderRadius: 16 }}
        animate={{ top: 0, left: 0, width: "100vw", height: "100vh", borderRadius: 0 }}
        exit={{ top: rect.top, left: rect.left, width: rect.width, height: rect.height, borderRadius: 16 }}
        transition={{ duration: 0.5, ease: EASE }}
        className="fixed z-[999] bg-[#101013] shadow-2xl overflow-hidden flex flex-col md:flex-row"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: textVisible ? 1 : 0 }}
          transition={{ duration: 0.4, delay: textVisible ? 0.05 : 0 }}
          className="flex-1 min-w-0 flex flex-col justify-center p-8 md:p-16 overflow-y-auto"
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="self-start bg-white/8 border border-white/15 text-white w-10 h-10 rounded-full flex items-center justify-center mb-8 hover:bg-white/15 transition-colors"
          >
            <X className="w-[18px] h-[18px]" />
          </button>

          <div className="text-2xl md:text-[30px] font-bold text-brand-green">
            $<PriceCounter value={property.price} />
            <span className="text-[15px] font-medium text-white/50">/mo</span>
          </div>
          <h2 className="text-2xl md:text-[34px] font-bold text-white mt-3.5 mb-1.5 tracking-tight">
            {property.title}
          </h2>
          <div className="flex items-center gap-1.5 text-[15px] text-white/60">
            <MapPin className="w-3.5 h-3.5" />
            {property.location}, {property.city}
          </div>

          <div className="flex items-center gap-6 mt-6 pt-6 border-t border-white/8 text-[15px] text-white/70">
            <span className="flex items-center gap-1.5">
              <BedDouble className="w-4 h-4 text-teal-400" />
              {property.bedrooms} Bed{property.bedrooms === 1 ? "" : "s"}
            </span>
            <span className="flex items-center gap-1.5">
              <Bath className="w-4 h-4 text-teal-400" />
              {property.bathrooms} Bath{property.bathrooms === 1 ? "" : "s"}
            </span>
            <span className="flex items-center gap-1.5">
              <Maximize2 className="w-4 h-4 text-teal-400" />
              {property.areaSqFt.toLocaleString()} Sq Ft
            </span>
          </div>

          <Link
            href={`/properties/${property.id}`}
            className="inline-flex items-center justify-center w-fit bg-brand-green text-black text-[15px] font-bold px-8 py-4 rounded-lg mt-9 hover:bg-white transition-colors"
          >
            View Details
          </Link>
        </motion.div>
        <div className="flex-1 min-w-0 relative h-56 md:h-auto">
          <Image src={property.images[0] || FALLBACK_IMAGE} alt={property.title} fill className="object-cover" />
        </div>
      </motion.div>
    </>
  );
}
