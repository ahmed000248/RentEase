/**
 * Timeline breakdown and constants for RentEase Cinematic Scroll Hero
 * Extended pacing and clean typography config
 */

export interface TextPanelData {
  id: string;
  badge?: string;
  title: string;
  subhead?: string;
  position: "left" | "right" | "center";
  startRange: number; // percentage (0-100)
  endRange: number;   // percentage (0-100)
}

export const HERO_TIMELINE_CONFIG = {
  spacerHeight: "1200vh",
  mobileSpacerHeight: "800vh",
  lerpFactor: 0.05,
  
  // Timeline Progress Ranges (%)
  ranges: {
    initial: { start: 0, end: 8 },
    phase1: { start: 8, end: 30 },
    phase2: { start: 30, end: 50 },
    phase3a: { start: 50, end: 58 },
    phase3b: { start: 58, end: 66 },
    phase3c: { start: 66, end: 74 },
    phase4: { start: 75, end: 100 },
    finalRevealStart: 88,
  },
};

export const INITIAL_HERO_COPY = {
  title: "RentEase",
  scriptAccent: "effortless",
  subhead: "Find a place that feels like home.",
};

export const STORY_PANELS: TextPanelData[] = [
  {
    id: "phase2-threshold",
    title: "Find homes built for the way you live.",
    subhead: "Step through curated spaces designed for comfort, security, and elegance.",
    position: "left",
    startRange: 30,
    endRange: 48,
  },
  {
    id: "phase3a-residences",
    title: "Homes & Apartments",
    subhead: "Explore houses, apartments, and flats in prime locations that match your lifestyle.",
    position: "left",
    startRange: 50,
    endRange: 57,
  },
  {
    id: "phase3b-co-living",
    title: "Rooms & Hostels",
    subhead: "Discover affordable, verified rooms and hostels for students and working professionals.",
    position: "right",
    startRange: 58,
    endRange: 65,
  },
  {
    id: "phase3c-commercial",
    title: "Shops & Workspaces",
    subhead: "Find high-visibility rental spaces for your store, office, or commercial venture.",
    position: "left",
    startRange: 66,
    endRange: 74,
  },
];

export const FINAL_HERO_COPY = {
  titleLine1: "Your next space is",
  titleLine2: "closer than you think",
  scriptAccent: "closer",
  subhead: "Cut out middlemen and high fees. Connect directly with verified owners, schedule instant viewings, and move in effortlessly.",
};
