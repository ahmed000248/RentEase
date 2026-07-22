"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { HERO_TIMELINE_CONFIG } from "@/components/hero/heroTimeline";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export interface UseScrollVideoSyncReturn {
  containerRef: React.RefObject<HTMLDivElement | null>;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  progress: number;
  videoReady: boolean;
  videoFailed: boolean;
  isReducedMotion: boolean;
  isMobile: boolean;
}

export function useScrollVideoSync(disabled: boolean = false): UseScrollVideoSyncReturn {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [progress, setProgress] = useState<number>(disabled ? 1 : 0);
  const [videoReady, setVideoReady] = useState<boolean>(false);
  const [videoFailed, setVideoFailed] = useState<boolean>(false);
  const [isReducedMotion, setIsReducedMotion] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  const targetTimeRef = useRef<number>(0);

  // 1. Detect media queries on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobileQuery = window.matchMedia("(max-width: 768px)");

    setIsReducedMotion(motionQuery.matches);
    setIsMobile(mobileQuery.matches);

    const handleMotionChange = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    const handleMobileChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);

    motionQuery.addEventListener("change", handleMotionChange);
    mobileQuery.addEventListener("change", handleMobileChange);

    return () => {
      motionQuery.removeEventListener("change", handleMotionChange);
      mobileQuery.removeEventListener("change", handleMobileChange);
    };
  }, []);

  // 2. Setup GSAP ScrollTrigger + Ticker sync
  useEffect(() => {
    if (disabled || isReducedMotion || !containerRef.current) return;

    const video = videoRef.current;
    const pinDistance = isMobile
      ? HERO_TIMELINE_CONFIG.mobileSpacerHeight
      : HERO_TIMELINE_CONFIG.spacerHeight;

    const ctx = gsap.context(() => {
      // Create master pinning ScrollTrigger
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: `+=${pinDistance}`,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        onUpdate: (self) => {
          const currentProgress = self.progress;
          setProgress(currentProgress);

          if (video && video.duration && !isNaN(video.duration) && isFinite(video.duration)) {
            targetTimeRef.current = currentProgress * video.duration;
          }
        },
      });

      // Ticker callback for smooth video currentTime scrubbing lerp
      const tickerCallback = () => {
        if (!video || !videoReady || videoFailed || !video.duration) return;

        const target = targetTimeRef.current;
        const current = video.currentTime;
        const diff = target - current;

        if (Math.abs(diff) > 0.001) {
          video.currentTime = current + diff * HERO_TIMELINE_CONFIG.lerpFactor;
        }
      };

      gsap.ticker.add(tickerCallback);

      return () => {
        gsap.ticker.remove(tickerCallback);
      };
    }, containerRef);

    return () => ctx.revert();
  }, [disabled, isReducedMotion, isMobile, videoReady, videoFailed]);

  // 3. Handle video event listeners
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      setVideoReady(true);
      setVideoFailed(false);
    };

    const handleError = () => {
      setVideoFailed(true);
      setVideoReady(false);
    };

    if (video.readyState >= 1) {
      handleLoadedMetadata();
    } else {
      video.addEventListener("loadedmetadata", handleLoadedMetadata);
    }
    video.addEventListener("error", handleError);

    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("error", handleError);
    };
  }, []);

  return {
    containerRef,
    videoRef,
    progress: disabled ? 1 : progress,
    videoReady,
    videoFailed,
    isReducedMotion,
    isMobile,
  };
}
