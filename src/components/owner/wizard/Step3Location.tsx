"use client";

import { useState } from "react";
import { useWizard } from "./WizardContext";

const CITIES = ["Islamabad", "Karachi", "Lahore", "Rawalpindi", "Peshawar", "Quetta", "Faisalabad"];

export default function Step3Location() {
  const { data, update, next, prev } = useWizard();
  const [showDropdown, setShowDropdown] = useState(false);
  const [cityInput, setCityInput] = useState(data.city);

  const filtered = CITIES.filter((c) =>
    c.toLowerCase().includes(cityInput.toLowerCase())
  );

  const canProceed = data.city && data.location.trim().length > 3;

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <header className="space-y-2">
        <span className="text-[11px] font-bold text-[#00ff66] uppercase tracking-widest">Step 3 of 5</span>
        <h1 className="text-[32px] font-heading font-bold text-[#e3e2e5] leading-tight -tracking-wide">
          Where is your property located?
        </h1>
        <p className="text-[16px] text-[#b9ccb5] leading-relaxed">
          Provide the exact location to help tenants find your space. Only the city and neighbourhood will be public until booking is confirmed.
        </p>
      </header>

      <div className="space-y-5">
        {/* City Search */}
        <div>
          <label className="text-[11px] font-bold text-[#b9ccb5] uppercase tracking-widest block mb-2">City</label>
          <div className="relative">
            <input
              type="text"
              placeholder="e.g. Islamabad, Karachi..."
              value={cityInput}
              onChange={(e) => {
                setCityInput(e.target.value);
                update({ city: e.target.value });
              }}
              onFocus={() => setShowDropdown(true)}
              onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
              className="w-full bg-[#1f2022] border border-[#3b4b3a] rounded-lg p-4 text-[#e3e2e5] placeholder-[#454749] focus:outline-none focus:border-[#00ff66] transition-all"
            />
            <span className="material-symbols-outlined absolute right-4 top-4 text-[#b9ccb5]">search</span>
            {showDropdown && filtered.length > 0 && (
              <div className="absolute top-full left-0 w-full mt-2 bg-[#292a2c] border border-[#3b4b3a] rounded-xl shadow-xl z-10 py-2">
                {filtered.map((c) => (
                  <div
                    key={c}
                    onMouseDown={() => {
                      setCityInput(c);
                      update({ city: c });
                      setShowDropdown(false);
                    }}
                    className="px-4 py-2 hover:bg-[#343537] cursor-pointer text-[#e3e2e5] text-sm"
                  >
                    {c}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Address Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="text-[11px] font-bold text-[#b9ccb5] uppercase tracking-widest block mb-2">Street Address</label>
            <input
              type="text"
              placeholder="House number, block, street name"
              value={data.location}
              onChange={(e) => update({ location: e.target.value })}
              className="w-full bg-[#1f2022] border border-[#3b4b3a] rounded-lg p-4 text-[#e3e2e5] placeholder-[#454749] focus:outline-none focus:border-[#00ff66] transition-all"
            />
          </div>
          <div>
            <label className="text-[11px] font-bold text-[#b9ccb5] uppercase tracking-widest block mb-2">Neighbourhood</label>
            <input
              type="text"
              placeholder="e.g. E-7, Clifton"
              value={data.neighbourhood}
              onChange={(e) => update({ neighbourhood: e.target.value })}
              className="w-full bg-[#1f2022] border border-[#3b4b3a] rounded-lg p-4 text-[#e3e2e5] placeholder-[#454749] focus:outline-none focus:border-[#00ff66] transition-all"
            />
          </div>
          <div>
            <label className="text-[11px] font-bold text-[#b9ccb5] uppercase tracking-widest block mb-2">Postal Code</label>
            <input
              type="text"
              placeholder="44000"
              value={data.postalCode}
              onChange={(e) => update({ postalCode: e.target.value })}
              className="w-full bg-[#1f2022] border border-[#3b4b3a] rounded-lg p-4 text-[#e3e2e5] placeholder-[#454749] focus:outline-none focus:border-[#00ff66] transition-all"
            />
          </div>
        </div>

        <div>
          <label className="text-[11px] font-bold text-[#b9ccb5] uppercase tracking-widest block mb-2">
            Landmark <span className="text-[#454749] normal-case font-normal">(optional)</span>
          </label>
          <input
            type="text"
            placeholder="Near Faisal Mosque, Opposite City Park"
            value={data.landmark}
            onChange={(e) => update({ landmark: e.target.value })}
            className="w-full bg-[#1f2022] border border-[#3b4b3a] rounded-lg p-4 text-[#e3e2e5] placeholder-[#454749] focus:outline-none focus:border-[#00ff66] transition-all"
          />
        </div>

        {/* Map Placeholder */}
        <div className="relative h-48 rounded-2xl border border-[#3b4b3a] overflow-hidden bg-[#0d0e10] flex items-center justify-center cursor-crosshair">
          {/* Grid lines */}
          <div className="absolute inset-0 opacity-10">
            <svg width="100%" height="100%">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-12 h-12 bg-[#00ff66] rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(0,255,102,0.6)] animate-bounce">
              <span className="material-symbols-outlined text-[#003911]" style={{ fontVariationSettings: "'FILL' 1" }}>location_on</span>
            </div>
            <div className="w-2 h-2 bg-[#00ff66] rounded-full mt-1 blur-[1px]" />
          </div>
          <div className="absolute bottom-3 left-4 right-4 flex justify-between">
            <span className="text-[10px] text-[#b9ccb5]">
              {data.city ? `📍 ${data.city}` : "City not set"}
            </span>
            <span className="text-[10px] text-[#b9ccb5]">Map preview</span>
          </div>
        </div>
      </div>

      {/* Footer Nav */}
      <div className="flex items-center gap-4 mt-8 pb-12">
        <button
          onClick={prev}
          className="px-8 py-4 bg-transparent border border-[#3b4b3a] text-[#e3e2e5] rounded-lg font-bold hover:bg-[#343537] transition-all"
        >
          Previous
        </button>
        <button
          onClick={next}
          disabled={!canProceed}
          className="px-10 py-4 bg-[#00ff66] text-[#003911] font-bold rounded-lg hover:brightness-105 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-[#00ff66]/20"
        >
          Next Step <span className="material-symbols-outlined">arrow_forward</span>
        </button>
      </div>
    </div>
  );
}
