"use client";

import HeroCanvasAnimation from "./HeroCanvasAnimation";

interface HeroScrollAnimationProps {
  skipIntro?: boolean;
  onProgressUpdate?: (progressPercent: number, isFinal: boolean) => void;
}

export default function HeroScrollAnimation({ skipIntro = false, onProgressUpdate }: HeroScrollAnimationProps) {
  return <HeroCanvasAnimation skipIntro={skipIntro} onProgressUpdate={onProgressUpdate} />;
}
