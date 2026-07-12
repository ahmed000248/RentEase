"use client";

import { useWizard } from "./WizardContext";
import type { Furnishing } from "@/lib/firebase/types";

function Counter({
  label, value, onDec, onInc,
}: { label: string; value: number; onDec: () => void; onInc: () => void }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[11px] font-bold text-[#b9ccb5] uppercase tracking-widest">{label}</label>
      <div className="flex items-center justify-between bg-[#1b1c1e] border border-[#3b4b3a] p-2 rounded-lg">
        <button
          onClick={onDec}
          className="w-10 h-10 flex items-center justify-center rounded bg-[#343537] hover:bg-[#00ff66] hover:text-[#003911] text-[#e3e2e5] transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">remove</span>
        </button>
        <span className="font-heading font-bold text-2xl text-[#e3e2e5]">{value}</span>
        <button
          onClick={onInc}
          className="w-10 h-10 flex items-center justify-center rounded bg-[#343537] hover:bg-[#00ff66] hover:text-[#003911] text-[#e3e2e5] transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
        </button>
      </div>
    </div>
  );
}

const FURNISHING: { value: Furnishing; label: string }[] = [
  { value: "unfurnished",   label: "Unfurnished" },
  { value: "semi-furnished", label: "Semi" },
  { value: "furnished",     label: "Fully" },
];

const PREFERRED: { value: string; label: string }[] = [
  { value: "any",      label: "Anyone" },
  { value: "male",     label: "Male" },
  { value: "female",   label: "Female" },
  { value: "family",   label: "Family" },
  { value: "students", label: "Students" },
];

export default function Step2Specs() {
  const { data, update, next, prev } = useWizard();

  const canProceed =
    Number(data.areaSqFt) > 0 &&
    Number(data.price) > 0 &&
    data.furnishing !== "" &&
    data.preferredFor !== "";

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <header className="space-y-2">
        <span className="text-[11px] font-bold text-[#00ff66] uppercase tracking-widest">Step 2 of 5</span>
        <h1 className="text-[40px] font-heading font-bold text-[#e3e2e5] leading-tight -tracking-wide">
          Property Specifications
        </h1>
        <p className="text-[18px] text-[#b9ccb5] leading-relaxed">
          Provide detailed measurements and occupancy details for your listing.
        </p>
      </header>

      <div className="bg-[#1f2022] border border-[#3b4b3a] rounded-xl p-6 space-y-6">
        {/* Counters */}
        <div className="grid grid-cols-2 gap-4">
          <Counter
            label="Bedrooms"
            value={data.bedrooms}
            onDec={() => update({ bedrooms: Math.max(0, data.bedrooms - 1) })}
            onInc={() => update({ bedrooms: data.bedrooms + 1 })}
          />
          <Counter
            label="Bathrooms"
            value={data.bathrooms}
            onDec={() => update({ bathrooms: Math.max(0, data.bathrooms - 1) })}
            onInc={() => update({ bathrooms: data.bathrooms + 1 })}
          />
        </div>

        {/* Area & Rent */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-bold text-[#b9ccb5] uppercase tracking-widest">Area (Sq Ft)</label>
            <div className="relative">
              <input
                type="number"
                placeholder="e.g. 1200"
                value={data.areaSqFt}
                onChange={(e) => update({ areaSqFt: e.target.value })}
                className="w-full bg-[#1b1c1e] border border-[#3b4b3a] rounded-lg p-4 text-[#e3e2e5] text-xl font-heading font-bold placeholder-[#454749] focus:outline-none focus:border-[#00ff66] transition-all"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[11px] font-bold text-[#b9ccb5] uppercase">Sq Ft</span>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-bold text-[#b9ccb5] uppercase tracking-widest">Monthly Rent (PKR)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#00ff66] text-xl font-heading font-bold">₨</span>
              <input
                type="number"
                placeholder="e.g. 45000"
                value={data.price}
                onChange={(e) => update({ price: e.target.value })}
                className="w-full bg-[#1b1c1e] border border-[#3b4b3a] rounded-lg p-4 pl-9 text-[#e3e2e5] text-xl font-heading font-bold placeholder-[#454749] focus:outline-none focus:border-[#00ff66] transition-all"
              />
            </div>
          </div>
        </div>

        {/* Furnishing */}
        <div className="flex flex-col gap-2">
          <label className="text-[11px] font-bold text-[#b9ccb5] uppercase tracking-widest">Furnishing Status</label>
          <div className="grid grid-cols-3 bg-[#1b1c1e] border border-[#3b4b3a] rounded-lg overflow-hidden">
            {FURNISHING.map((f, i) => (
              <button
                key={f.value}
                onClick={() => update({ furnishing: f.value })}
                className={`py-3 text-sm font-semibold transition-colors ${
                  i < FURNISHING.length - 1 ? "border-r border-[#3b4b3a]" : ""
                } ${data.furnishing === f.value
                    ? "bg-[#00ff66] text-[#003911] font-bold"
                    : "text-[#b9ccb5] hover:text-[#e3e2e5] hover:bg-[#292a2c]"
                  }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Preferred For */}
        <div className="flex flex-col gap-2">
          <label className="text-[11px] font-bold text-[#b9ccb5] uppercase tracking-widest">Preferred For</label>
          <div className="grid grid-cols-5 bg-[#1b1c1e] border border-[#3b4b3a] rounded-lg overflow-hidden">
            {PREFERRED.map((p, i) => (
              <button
                key={p.value}
                onClick={() => update({ preferredFor: p.value as typeof data.preferredFor })}
                className={`py-3 text-xs font-semibold transition-colors ${
                  i < PREFERRED.length - 1 ? "border-r border-[#3b4b3a]" : ""
                } ${data.preferredFor === p.value
                    ? "bg-[#00ff66] text-[#003911] font-bold"
                    : "text-[#b9ccb5] hover:text-[#e3e2e5] hover:bg-[#292a2c]"
                  }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Nav */}
      <div className="flex justify-between items-center pt-4 pb-12">
        <button
          onClick={prev}
          className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-[#b9ccb5] hover:text-[#6bff83] transition-colors"
        >
          <span className="material-symbols-outlined">arrow_back</span>
          Previous
        </button>
        <button
          onClick={next}
          disabled={!canProceed}
          className="px-10 py-4 bg-[#00ff66] text-[#003911] font-bold rounded-xl hover:brightness-105 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-[#00ff66]/20 flex items-center gap-2"
        >
          Next Step <span className="material-symbols-outlined">arrow_forward</span>
        </button>
      </div>
    </div>
  );
}
