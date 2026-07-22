"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, BedDouble, Bath, Maximize2, X, ArrowUpRight } from "lucide-react";
import type { PropertyDoc } from "@/lib/firebase/types";

interface PropertyExpandCardProps {
  property: PropertyDoc | {
    id: string;
    title: string;
    price: number;
    location: string;
    city: string;
    bedrooms: number;
    bathrooms: number;
    areaSqFt: number;
    images: string[];
    tag?: string;
  };
  rect: { top: number; left: number; width: number; height: number };
  onClose: () => void;
}

const EASE = [0.16, 1, 0.3, 1] as const;
const FALLBACK_IMAGE = "/images/property_apartment.png";

export default function PropertyExpandCard({ property, rect, onClose }: PropertyExpandCardProps) {
  const [textVisible, setTextVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  // Lock document body scroll while open
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTextVisible(false);
    onClose();
  };

  return (
    <div key={property.id}>
      {/* Backdrop */}
      <motion.div
        onClick={handleClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[998]"
      />

      {/* Main Expanded Container */}
      <motion.div
        initial={{
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
          borderRadius: 24,
        }}
        animate={{
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          borderRadius: 0,
        }}
        exit={{
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
          borderRadius: 24,
        }}
        transition={{ duration: 0.45, ease: EASE }}
        onAnimationComplete={(definition) => {
          if (!isClosing && definition !== "exit") {
            setTextVisible(true);
          }
        }}
        className="fixed z-[999] bg-[#0d0d10] border border-white/10 shadow-2xl overflow-hidden flex flex-col md:flex-row"
      >
        {/* Detail Content Section */}
        <motion.div
          animate={{ opacity: textVisible && !isClosing ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="flex-1 min-w-0 flex flex-col justify-center p-8 md:p-16 overflow-y-auto"
        >
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close modal"
            className="self-start bg-white/10 border border-white/15 text-white w-11 h-11 rounded-full flex items-center justify-center mb-8 hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {property.tag && (
            <span className="text-xs font-bold uppercase tracking-widest text-brand-green mb-3 block">
              {property.tag}
            </span>
          )}

          <div className="text-3xl md:text-4xl font-extrabold text-brand-green">
            ${property.price.toLocaleString()}
            <span className="text-base font-medium text-white/60">/mo</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-extrabold text-white mt-3 mb-2 tracking-tight">
            {property.title}
          </h2>

          <div className="flex items-center gap-2 text-base text-white/60 mb-8">
            <MapPin className="w-4 h-4 text-brand-green flex-shrink-0" />
            <span>{property.location}, {property.city}</span>
          </div>

          <div className="grid grid-cols-3 gap-4 py-6 border-y border-white/10 text-sm text-white/80 max-w-lg mb-8">
            <div className="flex items-center gap-2">
              <BedDouble className="w-5 h-5 text-brand-green" />
              <span>{property.bedrooms} Bed{property.bedrooms === 1 ? "" : "s"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Bath className="w-5 h-5 text-brand-green" />
              <span>{property.bathrooms} Bath{property.bathrooms === 1 ? "" : "s"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Maximize2 className="w-5 h-5 text-brand-green" />
              <span>{property.areaSqFt.toLocaleString()} sqft</span>
            </div>
          </div>

          <Link
            href={`/properties/${property.id}`}
            className="group inline-flex items-center justify-center gap-2 w-fit bg-brand-green text-black text-base font-bold px-8 py-4 rounded-full hover:bg-white transition-colors"
          >
            <span>View Full Listing</span>
            <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </motion.div>

        {/* Media Image Section */}
        <div className="flex-1 min-w-0 relative h-64 md:h-auto border-t md:border-t-0 md:border-l border-white/10">
          <Image
            src={property.images[0] || FALLBACK_IMAGE}
            alt={property.title}
            fill
            priority
            className="object-cover"
          />
        </div>
      </motion.div>
    </div>
  );
}
