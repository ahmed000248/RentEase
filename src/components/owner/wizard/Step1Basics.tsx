"use client";

import { useWizard } from "./WizardContext";
import type { PropertyType } from "@/lib/firebase/types";

const TYPES: { value: PropertyType; icon: string; label: string }[] = [
  { value: "house",     icon: "home",       label: "House" },
  { value: "apartment", icon: "apartment",  label: "Apartment" },
  { value: "room",      icon: "bed",        label: "Room" },
  { value: "hostel",    icon: "groups",     label: "Hostel" },
  { value: "shop",      icon: "storefront", label: "Shop" },
];

export default function Step1Basics() {
  const { data, update, next } = useWizard();

  const canProceed = data.type && data.title.trim().length >= 10 && data.description.trim().length >= 20;

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <header className="space-y-2">
        <span className="text-[11px] font-bold text-[#00ff66] uppercase tracking-widest">Step 1 of 5</span>
        <h1 className="text-[40px] font-heading font-bold text-[#e3e2e5] leading-tight -tracking-wide">
          Tell us about your space
        </h1>
        <p className="text-[18px] text-[#b9ccb5] leading-relaxed">
          Provide the fundamental details that will help tenants find your property.
        </p>
      </header>

      {/* Property Type */}
      <div className="space-y-3">
        <label className="text-[11px] font-bold text-[#b9ccb5] uppercase tracking-widest block">
          Property Type
        </label>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
          {TYPES.map((t) => {
            const isSelected = data.type === t.value;
            return (
              <button
                key={t.value}
                onClick={() => update({ type: t.value })}
                className={`flex flex-col items-center justify-center p-5 rounded-[24px] border transition-all duration-200 group
                  ${isSelected
                    ? "border-[#00ff66] bg-[#00ff66]/10 shadow-[0_0_20px_rgba(0,255,102,0.15)]"
                    : "border-[#3b4b3a] bg-[#1f2022] hover:border-[#00ff66]/50 hover:bg-[#292a2c]"
                  }`}
              >
                <span
                  className={`material-symbols-outlined text-[36px] mb-2 transition-transform group-hover:scale-110 ${
                    isSelected ? "text-[#00ff66]" : "text-[#b9ccb5]"
                  }`}
                >
                  {t.icon}
                </span>
                <span className={`text-[11px] font-bold uppercase tracking-wide ${
                  isSelected ? "text-[#e3e2e5]" : "text-[#b9ccb5]"
                }`}>
                  {t.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Listing Title */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-bold text-[#b9ccb5] uppercase tracking-widest">
            Listing Title
          </label>
          <span className={`text-[11px] font-semibold ${
            data.title.length > 60 ? "text-[#ffb4ab]" : "text-[#b9ccb5]"
          }`}>
            {data.title.length} / 70
          </span>
        </div>
        <input
          type="text"
          maxLength={70}
          placeholder="e.g. Modern Minimalist Loft in Downtown Lahore"
          value={data.title}
          onChange={(e) => update({ title: e.target.value })}
          className="w-full bg-[#1f2022] border border-[#3b4b3a] rounded-xl px-4 py-4 text-[#e3e2e5] placeholder-[#454749] text-base focus:outline-none focus:border-[#00ff66] focus:ring-1 focus:ring-[#00ff66]/40 transition-all"
        />
        <p className="text-[13px] text-[#b9ccb5]">
          Keep it catchy! 40–70 characters recommended for best search results.
        </p>
      </div>

      {/* Description */}
      <div className="space-y-3">
        <label className="text-[11px] font-bold text-[#b9ccb5] uppercase tracking-widest block">
          Description
        </label>
        <textarea
          rows={6}
          placeholder="Share what makes your place special — the vibe, views, neighbourhood..."
          value={data.description}
          onChange={(e) => update({ description: e.target.value })}
          className="w-full bg-[#1f2022] border border-[#3b4b3a] rounded-xl px-4 py-4 text-[#e3e2e5] placeholder-[#454749] text-base focus:outline-none focus:border-[#00ff66] focus:ring-1 focus:ring-[#00ff66]/40 transition-all resize-none"
        />
      </div>

      {/* Footer Nav */}
      <div className="flex justify-end pt-4 pb-12">
        <button
          onClick={next}
          disabled={!canProceed}
          className="px-10 py-4 bg-[#00ff66] text-[#003911] font-bold rounded-xl hover:brightness-105 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-[#00ff66]/20"
        >
          Next: Specifications →
        </button>
      </div>
    </div>
  );
}
