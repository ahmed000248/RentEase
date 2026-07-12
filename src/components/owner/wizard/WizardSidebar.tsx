"use client";

import { useWizard } from "./WizardContext";
import type { WizardStep } from "./WizardContext";

const STEPS: { icon: string; label: string }[] = [
  { icon: "info", label: "Basics" },
  { icon: "list_alt", label: "Specifications" },
  { icon: "location_on", label: "Location" },
  { icon: "photo_camera", label: "Media" },
  { icon: "send", label: "Publish" },
];

export default function WizardSidebar() {
  const { step, setStep } = useWizard();

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-64px)] w-64 bg-[#1b1c1e] border-r border-[#3b4b3a] flex flex-col p-4 z-40 shadow-md">
      <div className="mb-8 px-2">
        <h2 className="font-heading font-black text-[#6bff83] text-lg tracking-tight">RentEase Listing</h2>
        <p className="text-[11px] text-[#b9ccb5] uppercase tracking-widest mt-0.5">Wizard Progress</p>
      </div>

      <nav className="flex-1 space-y-1">
        {STEPS.map((s, i) => {
          const n = (i + 1) as WizardStep;
          const isActive = step === n;
          const isDone = step > n;
          return (
            <button
              key={s.label}
              onClick={() => isDone && setStep(n)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-semibold transition-all duration-200
                ${isActive
                  ? "bg-[#00ff66] text-[#003911] scale-[0.98] shadow"
                  : isDone
                    ? "text-[#b9ccb5] hover:text-[#e3e2e5] hover:bg-[#343537] cursor-pointer"
                    : "text-[#b9ccb5] opacity-50 cursor-default"
                }`}
            >
              <span className="material-symbols-outlined text-[20px]">{s.icon}</span>
              <span className="text-[12px] tracking-wide uppercase">{s.label}</span>
              {isDone && (
                <span className="ml-auto material-symbols-outlined text-[16px] text-[#00e55b]"
                  style={{ fontVariationSettings: "'FILL' 1" }}>
                  check_circle
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Progress Bar */}
      <div className="pt-4 border-t border-[#3b4b3a]">
        <div className="flex gap-1.5 mb-2">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                step > i ? "bg-[#00ff66]" : "bg-[#343537]"
              }`}
            />
          ))}
        </div>
        <p className="text-[10px] text-[#b9ccb5] uppercase tracking-widest">
          Step {step} of 5 — {Math.round(((step - 1) / 4) * 100)}% Complete
        </p>
      </div>
    </aside>
  );
}
