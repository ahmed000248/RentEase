"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import type { PropertyType, Furnishing } from "@/lib/firebase/types";

export type WizardStep = 1 | 2 | 3 | 4 | 5;

export interface WizardData {
  // Step 1 – Basics
  type: PropertyType | "";
  title: string;
  description: string;
  // Step 2 – Specifications
  bedrooms: number;
  bathrooms: number;
  areaSqFt: string;
  price: string;
  furnishing: Furnishing | "";
  preferredFor: "any" | "male" | "female" | "family" | "students" | "";
  // Step 3 – Location
  city: string;
  location: string;
  neighbourhood: string;
  postalCode: string;
  landmark: string;
  // Step 4 – Amenities & Media
  amenities: string[];
  images: File[];
  // Step 5 – Review/Publish (no extra fields)
}

interface WizardCtx {
  step: WizardStep;
  data: WizardData;
  setStep: (s: WizardStep) => void;
  update: (patch: Partial<WizardData>) => void;
  next: () => void;
  prev: () => void;
}

const defaultData: WizardData = {
  type: "",
  title: "",
  description: "",
  bedrooms: 2,
  bathrooms: 1,
  areaSqFt: "",
  price: "",
  furnishing: "",
  preferredFor: "",
  city: "",
  location: "",
  neighbourhood: "",
  postalCode: "",
  landmark: "",
  amenities: [],
  images: [],
};

const WizardContext = createContext<WizardCtx | null>(null);

export function WizardProvider({ children }: { children: ReactNode }) {
  const [step, setStep] = useState<WizardStep>(1);
  const [data, setData] = useState<WizardData>(defaultData);

  const update = (patch: Partial<WizardData>) =>
    setData((prev) => ({ ...prev, ...patch }));

  const next = () => setStep((s) => Math.min(5, s + 1) as WizardStep);
  const prev = () => setStep((s) => Math.max(1, s - 1) as WizardStep);

  return (
    <WizardContext.Provider value={{ step, data, setStep, update, next, prev }}>
      {children}
    </WizardContext.Provider>
  );
}

export function useWizard() {
  const ctx = useContext(WizardContext);
  if (!ctx) throw new Error("useWizard must be used inside WizardProvider");
  return ctx;
}
