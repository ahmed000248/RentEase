"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, animate, motion } from "framer-motion";
import { MapPin, BedDouble, Bath, Maximize2, Sparkles, Star, X } from "lucide-react";
import { titleCase } from "@/lib/format";
import type { PropertyDoc } from "@/lib/firebase/types";
import PropertyExpandCard from "./PropertyExpandCard";

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
        {expanded && (
          <PropertyExpandCard
            key={expanded.property.id}
            property={expanded.property}
            rect={expanded.rect}
            onClose={closeCard}
          />
        )}
      </AnimatePresence>
    </>
  );
}
