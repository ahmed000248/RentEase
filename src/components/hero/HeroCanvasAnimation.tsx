"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useScrollVideoSync } from "@/hooks/useScrollVideoSync";
import ScrollTextPanel from "./ScrollTextPanel";
import {
  HERO_TIMELINE_CONFIG,
  INITIAL_HERO_COPY,
  STORY_PANELS,
  FINAL_HERO_COPY,
} from "./heroTimeline";

const TOTAL_FRAMES = 193;

interface HeroCanvasAnimationProps {
  onProgressUpdate?: (progressPercent: number, isFinal: boolean) => void;
}

export default function HeroCanvasAnimation({ onProgressUpdate }: HeroCanvasAnimationProps) {
  const {
    containerRef,
    videoRef,
    progress,
    isReducedMotion,
  } = useScrollVideoSync();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [framesLoaded, setFramesLoaded] = useState(false);

  const progressPercent = progress * 100;

  // Determine stage flags based on progress %
  const isInitialActive = progressPercent < HERO_TIMELINE_CONFIG.ranges.phase1.start;
  const isFinalActive = progressPercent >= HERO_TIMELINE_CONFIG.ranges.phase4.start;

  // Dynamic Brightness and Scrim Opacity
  // Phases 1-3 (0-74%): Full brightness (1.0), minimal scrim (0.1) for max video visibility
  // Phase 4 (75-100%): Dynamic ramp down to 0.45 brightness and scrim opacity up to 0.85
  const phase4Progress = Math.max(0, Math.min(1, (progressPercent - 74) / 20));
  const canvasBrightness = isReducedMotion ? 0.45 : 1.0 - 0.55 * phase4Progress;
  const scrimOpacity = isReducedMotion ? 0.85 : 0.1 + 0.75 * phase4Progress;

  // Opacity calculations for initial & final text content
  const initialOpacity = isReducedMotion
    ? 0
    : Math.max(0, 1 - (progressPercent - 4) / 12);

  const finalOpacity = isReducedMotion
    ? 1
    : Math.min(1, Math.max(0, (progressPercent - 75) / 15));

  // Notify parent of progress & final state for Header navbar slide-down
  useEffect(() => {
    onProgressUpdate?.(progressPercent, isFinalActive);
  }, [progressPercent, isFinalActive, onProgressUpdate]);

  // 1. Preload frame image sequence
  useEffect(() => {
    if (isReducedMotion) return;

    let loadedCount = 0;
    const loadedImages: HTMLImageElement[] = [];

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new window.Image();
      const frameNum = String(i).padStart(4, "0");
      img.src = `/frames/frame_${frameNum}.jpg`;

      img.onload = () => {
        loadedCount++;
        if (loadedCount >= Math.min(30, TOTAL_FRAMES)) {
          setFramesLoaded(true);
        }
      };

      loadedImages.push(img);
    }

    imagesRef.current = loadedImages;
  }, [isReducedMotion]);

  // 2. Draw active frame on Canvas based on scroll progress
  useEffect(() => {
    if (isReducedMotion || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const frameIndex = Math.min(
      TOTAL_FRAMES - 1,
      Math.max(0, Math.floor(progress * (TOTAL_FRAMES - 1)))
    );

    const img = imagesRef.current[frameIndex];
    if (!img || !img.complete) return;

    // Cover scale drawing calculation
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const imgWidth = img.naturalWidth || 1280;
    const imgHeight = img.naturalHeight || 720;

    const ratio = Math.max(canvasWidth / imgWidth, canvasHeight / imgHeight);
    const newWidth = imgWidth * ratio;
    const newHeight = imgHeight * ratio;
    const offsetX = (canvasWidth - newWidth) / 2;
    const offsetY = (canvasHeight - newHeight) / 2;

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.drawImage(img, offsetX, offsetY, newWidth, newHeight);
  }, [progress, isReducedMotion, framesLoaded]);

  // 3. Handle window resize to update canvas internal resolution
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden bg-[#050505] text-white select-none"
    >
      {/* Background Media Container */}
      <div className="absolute inset-0 z-0">
        {/* Canvas Frame Sequence Element with dynamic brightness */}
        {!isReducedMotion && (
          <canvas
            ref={canvasRef}
            style={{ filter: `brightness(${canvasBrightness})` }}
            className={`absolute inset-0 h-full w-full object-cover transition-all duration-300 ${
              framesLoaded ? "opacity-100" : "opacity-0"
            }`}
          />
        )}

        {/* Video Fallback Element */}
        {!isReducedMotion && !framesLoaded && (
          <video
            ref={videoRef}
            muted
            playsInline
            disablePictureInPicture
            preload="auto"
            poster="/images/hero-poster.jpg"
            style={{ filter: `brightness(${canvasBrightness})` }}
            className="absolute inset-0 h-full w-full object-cover transition-all duration-300"
          >
            <source src="/videos/hero-scrub.mp4" type="video/mp4" />
          </video>
        )}

        {/* Poster Image Fallback */}
        {(isReducedMotion || !framesLoaded) && (
          <Image
            src="/images/hero-poster.jpg"
            alt="RentEase Cinematic Villa Entrance"
            fill
            priority
            style={{ filter: `brightness(${canvasBrightness})` }}
            className="object-cover transition-all duration-300"
          />
        )}

        {/* Contrast Scrim Gradient with dynamic opacity */}
        <div
          style={{ opacity: scrimOpacity }}
          className="absolute inset-0 bg-gradient-to-t from-[#050505] via-black/40 to-[#050505]/80 z-[1] transition-opacity duration-300 pointer-events-none"
        />
      </div>

      {/* 1. INITIAL STATE (Pinned, 0% - 8% progress) */}
      {!isReducedMotion && (
        <motion.div
          style={{ opacity: initialOpacity }}
          className={`pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-6 transition-transform duration-300 ${
            isInitialActive ? "pointer-events-auto" : ""
          }`}
        >
          {/* Title */}
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter text-white drop-shadow-2xl leading-none mb-6">
            Rent<span className="font-script text-brand-green italic font-normal tracking-wide lowercase ml-2">Ease</span>
          </h1>

          {/* Subhead */}
          <p className="text-lg md:text-2xl text-white/90 max-w-xl font-light tracking-wide mb-12 drop-shadow-md">
            {INITIAL_HERO_COPY.subhead}
          </p>

          {/* Scroll Down Indicator */}
          <div className="absolute bottom-10 flex flex-col items-center gap-2 text-white/60 text-xs font-semibold tracking-widest uppercase">
            <span>Scroll to Explore</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              className="w-5 h-8 rounded-full border border-white/30 flex items-start justify-center p-1"
            >
              <div className="w-1 h-2 rounded-full bg-brand-green" />
            </motion.div>
          </div>
        </motion.div>
      )}

      {/* 2. STORY PANELS (Phase 2 & Phase 3, 30% - 74% progress) */}
      {!isReducedMotion &&
        STORY_PANELS.map((panel) => {
          const isActive =
            progressPercent >= panel.startRange && progressPercent <= panel.endRange;

          return (
            <ScrollTextPanel
              key={panel.id}
              title={panel.title}
              subhead={panel.subhead}
              position={panel.position}
              active={isActive}
            />
          );
        })}

      {/* 3. FINAL STATE REVEAL (75% - 100% progress) */}
      <motion.div
        style={{ opacity: isReducedMotion ? 1 : finalOpacity }}
        className={`absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-6 ${
          isFinalActive || isReducedMotion ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-[1.1] text-white mb-8">
            {FINAL_HERO_COPY.titleLine1}{" "}
            <span className="font-script text-brand-green italic font-normal tracking-wide px-2">
              {FINAL_HERO_COPY.scriptAccent}
            </span>{" "}
            than you think.
          </h1>

          {/* Subhead */}
          <p className="text-base sm:text-lg md:text-xl text-white/80 max-w-2xl font-light leading-relaxed mb-10">
            {FINAL_HERO_COPY.subhead}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link
              href="#featured"
              className="group inline-flex items-center gap-3 bg-brand-green text-black px-8 py-4 rounded-full text-base font-bold transition-all duration-300 hover:bg-white hover:text-black hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]"
            >
              <span>View Featured Properties</span>
              <span className="relative flex items-center justify-center w-6 h-6 rounded-full bg-black/10">
                <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
              </span>
            </Link>

            <Link
              href="/properties"
              className="group inline-flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-full text-base font-semibold transition-all duration-300 hover:bg-white/20 hover:border-brand-green/40"
            >
              <span>Explore All Listings</span>
              <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
