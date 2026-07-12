"use client";

import { useRef } from "react";
import { useWizard } from "./WizardContext";

const ALL_AMENITIES = [
  { icon: "wifi",                  label: "High-speed WiFi" },
  { icon: "pool",                  label: "Private Pool" },
  { icon: "fitness_center",        label: "Home Gym" },
  { icon: "local_parking",         label: "Free Parking" },
  { icon: "ac_unit",               label: "Air Conditioning" },
  { icon: "kitchen",               label: "Modern Kitchen" },
  { icon: "local_laundry_service", label: "Washer/Dryer" },
  { icon: "fireplace",             label: "Fireplace" },
  { icon: "balcony",               label: "Balcony" },
  { icon: "security",              label: "24/7 Security" },
  { icon: "elevator",              label: "Elevator" },
  { icon: "yard",                  label: "Garden/Yard" },
  { icon: "roofing",               label: "Rooftop Access" },
  { icon: "hot_tub",               label: "Jacuzzi" },
  { icon: "ev_station",            label: "EV Charging" },
  { icon: "pets",                  label: "Pet Friendly" },
];

export default function Step4Media() {
  const { data, update, next, prev } = useWizard();
  const fileRef = useRef<HTMLInputElement>(null);

  const toggleAmenity = (label: string) => {
    const has = data.amenities.includes(label);
    update({
      amenities: has
        ? data.amenities.filter((a) => a !== label)
        : [...data.amenities, label],
    });
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const newFiles = Array.from(files).filter((f) => f.type.startsWith("image/"));
    update({ images: [...data.images, ...newFiles].slice(0, 10) });
  };

  const removeImage = (i: number) => {
    const next = [...data.images];
    next.splice(i, 1);
    update({ images: next });
  };

  const canProceed = data.images.length >= 1;

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <header className="space-y-2">
        <span className="text-[11px] font-bold text-[#00ff66] uppercase tracking-widest">Step 4 of 5</span>
        <h1 className="text-[36px] font-heading font-bold text-[#e3e2e5] leading-tight -tracking-wide">
          Amenities & Media
        </h1>
        <p className="text-[16px] text-[#b9ccb5] leading-relaxed">
          Highlight your property's features and upload high-quality photos.
        </p>
      </header>

      {/* Amenities */}
      <div className="bg-[#1b1c1e] border border-[#3b4b3a] p-6 rounded-[24px] space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-heading font-bold text-[#e3e2e5] text-lg">Select Amenities</h3>
            <p className="text-[13px] text-[#b9ccb5] mt-0.5">Select the features that make your property stand out.</p>
          </div>
          <span className="bg-[#00ff66]/10 text-[#00ff66] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
            {data.amenities.length} Selected
          </span>
        </div>
        <div className="flex flex-wrap gap-2.5">
          {ALL_AMENITIES.map((a) => {
            const isOn = data.amenities.includes(a.label);
            return (
              <button
                key={a.label}
                onClick={() => toggleAmenity(a.label)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold transition-all duration-200 ${
                  isOn
                    ? "border-[#00ff66] bg-[#00ff66]/10 text-[#e3e2e5] shadow-[0_0_12px_rgba(0,255,102,0.12)]"
                    : "border-[#3b4b3a] bg-[#1f2022] text-[#b9ccb5] hover:border-[#00ff66]/40 hover:text-[#e3e2e5]"
                }`}
              >
                <span className={`material-symbols-outlined text-[18px] ${isOn ? "text-[#00ff66]" : ""}`}>
                  {a.icon}
                </span>
                {a.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Media Upload */}
      <div className="bg-[#1b1c1e] border border-[#3b4b3a] p-6 rounded-[24px] space-y-5">
        <div>
          <h3 className="font-heading font-bold text-[#e3e2e5] text-lg">Property Photos</h3>
          <p className="text-[13px] text-[#b9ccb5] mt-0.5">Upload at least 1 high-resolution image. Max 10.</p>
        </div>

        {/* Dropzone */}
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
          onClick={() => fileRef.current?.click()}
          className="relative h-52 flex flex-col items-center justify-center cursor-pointer rounded-[24px] border-2 border-dashed border-[#3b4b3a] hover:border-[#00ff66]/60 hover:bg-[#1f2022] transition-all group"
        >
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
          <div className="w-16 h-16 rounded-full bg-[#00ff66] flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-[#003911] text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              cloud_upload
            </span>
          </div>
          <p className="font-heading font-bold text-[#e3e2e5] text-base">Drag & drop images here</p>
          <p className="text-[13px] text-[#b9ccb5] mt-1">Supports JPG, PNG, WEBP (max 10MB each)</p>
          <button className="mt-4 px-5 py-2 border border-[#3b4b3a] rounded-lg text-[11px] font-bold text-[#e3e2e5] uppercase tracking-wide hover:bg-[#343537] transition-colors">
            Select Files
          </button>
        </div>

        {/* Previews */}
        {data.images.length > 0 && (
          <div className="grid grid-cols-4 gap-3">
            {data.images.map((file, i) => (
              <div key={i} className={`relative aspect-square rounded-xl overflow-hidden border group ${i === 0 ? "border-[#00ff66]" : "border-[#3b4b3a]"}`}>
                <img
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  className="w-full h-full object-cover"
                />
                {i === 0 && (
                  <div className="absolute top-2 left-2 px-2 py-0.5 bg-[#00ff66] text-[#003911] rounded text-[9px] font-black uppercase">
                    Cover
                  </div>
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    onClick={(e) => { e.stopPropagation(); removeImage(i); }}
                    className="w-8 h-8 rounded-full bg-[#93000a] text-[#ffdad6] flex items-center justify-center hover:scale-110 transition-transform"
                  >
                    <span className="material-symbols-outlined text-[16px]">delete</span>
                  </button>
                </div>
              </div>
            ))}
            {data.images.length < 10 && (
              <div
                onClick={() => fileRef.current?.click()}
                className="aspect-square rounded-xl border-2 border-dashed border-[#3b4b3a] flex flex-col items-center justify-center text-[#b9ccb5] hover:text-[#00ff66] hover:border-[#00ff66] cursor-pointer transition-all"
              >
                <span className="material-symbols-outlined text-[28px]">add</span>
                <span className="text-[10px] mt-1 font-bold uppercase">Add More</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer Nav */}
      <div className="flex items-center justify-between pt-4 pb-20">
        <button
          onClick={prev}
          className="px-8 py-3 rounded-lg border border-[#3b4b3a] text-[#e3e2e5] font-bold hover:bg-[#343537] transition-colors"
        >
          Previous
        </button>
        <button
          onClick={next}
          disabled={!canProceed}
          className="px-10 py-3 rounded-lg bg-[#00ff66] text-[#003911] font-bold shadow-lg hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Continue to Review →
        </button>
      </div>
    </div>
  );
}
