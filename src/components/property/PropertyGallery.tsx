"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X, ImageOff } from "lucide-react";

const FALLBACK_IMAGE = "/images/property_apartment.png";

export default function PropertyGallery({ images, title }: { images: string[]; title: string }) {
  const validImages = images && images.length > 0 ? images.filter((img) => Boolean(img && img.trim())) : [];
  const gallery = validImages.length > 0 ? validImages : [FALLBACK_IMAGE];
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const goTo = (index: number) => setActiveIndex((index + gallery.length) % gallery.length);

  return (
    <div>
      <div className="relative h-72 sm:h-[420px] w-full overflow-hidden rounded-3xl border border-white/5 bg-[#0d0d0d]">
        <button
          type="button"
          onClick={() => setLightboxOpen(true)}
          className="absolute inset-0 z-10 cursor-zoom-in"
          aria-label="Open image fullscreen"
        />
        <Image
          src={gallery[activeIndex]}
          alt={`${title} — photo ${activeIndex + 1} of ${gallery.length}`}
          fill
          priority
          className="object-cover"
        />
        {images.length === 0 && (
          <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full text-xs font-semibold text-white/60">
            <ImageOff className="w-3.5 h-3.5" />
            No photos yet
          </div>
        )}

        {gallery.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => goTo(activeIndex - 1)}
              aria-label="Previous photo"
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-brand-green hover:text-black hover:border-brand-green transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => goTo(activeIndex + 1)}
              aria-label="Next photo"
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-brand-green hover:text-black hover:border-brand-green transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <div className="absolute bottom-4 right-4 z-20 bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full text-xs font-semibold text-white/80">
              {activeIndex + 1} / {gallery.length}
            </div>
          </>
        )}
      </div>

      {gallery.length > 1 && (
        <div className="flex gap-3 mt-4 overflow-x-auto no-scrollbar pb-1">
          {gallery.map((src, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveIndex(idx)}
              className={`relative flex-shrink-0 w-20 h-16 rounded-xl overflow-hidden border transition-colors ${
                idx === activeIndex ? "border-brand-green" : "border-white/10 hover:border-white/30"
              }`}
            >
              <Image src={src} alt={`${title} thumbnail ${idx + 1}`} fill className="object-cover" />
            </button>
          ))}
        </div>
      )}

      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[80] bg-black/95 flex items-center justify-center px-4"
            onClick={() => setLightboxOpen(false)}
          >
            <button
              type="button"
              onClick={() => setLightboxOpen(false)}
              aria-label="Close fullscreen photo"
              className="absolute top-6 right-6 w-11 h-11 rounded-full border border-white/15 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {gallery.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    goTo(activeIndex - 1);
                  }}
                  aria-label="Previous photo"
                  className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full border border-white/15 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    goTo(activeIndex + 1);
                  }}
                  aria-label="Next photo"
                  className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full border border-white/15 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            <div
              className="relative w-full max-w-4xl h-[70vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={gallery[activeIndex]}
                alt={`${title} — photo ${activeIndex + 1} of ${gallery.length}, fullscreen`}
                fill
                className="object-contain"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
