"use client";

import HeroCanvasAnimation from "./HeroCanvasAnimation";

interface HeroScrollAnimationProps {
  onProgressUpdate?: (progressPercent: number, isFinal: boolean) => void;
}

export default function HeroScrollAnimation({ onProgressUpdate }: HeroScrollAnimationProps) {
  return <HeroCanvasAnimation onProgressUpdate={onProgressUpdate} />;
}
