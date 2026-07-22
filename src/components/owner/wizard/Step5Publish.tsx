"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useWizard } from "./WizardContext";
import {
  collection, addDoc, serverTimestamp,
} from "firebase/firestore";
import {
  ref, uploadBytes, getDownloadURL,
} from "firebase/storage";
import { getFirebaseDb, getFirebaseStorage } from "@/lib/firebase/client";

interface Props {
  ownerId: string;
}

const FURNISHING_LABEL: Record<string, string> = {
  "unfurnished":   "Unfurnished",
  "semi-furnished": "Semi-Furnished",
  "furnished":     "Fully Furnished",
};
const PREFERRED_LABEL: Record<string, string> = {
  any:      "Anyone",
  male:     "Male",
  female:   "Female",
  family:   "Family",
  students: "Students",
};

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] text-[#b9ccb5] uppercase font-bold tracking-widest">{label}</p>
      <p className="text-[#e3e2e5] text-sm mt-0.5">{value}</p>
    </div>
  );
}

export default function Step5Publish({ ownerId }: Props) {
  const { data, prev } = useWizard();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handlePublish() {
    setLoading(true);
    setError(null);
    try {
      const imageUrls: string[] = [];

      // Attempt image upload to storage if configured
      try {
        const storage = getFirebaseStorage();
        for (const file of data.images) {
          const storageRef = ref(storage, `properties/${ownerId}/${Date.now()}_${file.name}`);
          const snap = await uploadBytes(storageRef, file);
          const url = await getDownloadURL(snap.ref);
          imageUrls.push(url);
        }
      } catch {
        // Fallback to stock property image if Storage is unconfigured
        imageUrls.push("/images/property_apartment.png");
      }

      const res = await fetch("/api/properties/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: data.title,
          description: data.description,
          type: data.type,
          price: Number(data.price),
          city: data.city,
          location: data.location,
          neighbourhood: data.neighbourhood,
          bedrooms: data.bedrooms,
          bathrooms: data.bathrooms,
          areaSqFt: Number(data.areaSqFt),
          furnishing: data.furnishing,
          preferredFor: data.preferredFor,
          amenities: data.amenities,
          images: imageUrls.length > 0 ? imageUrls : ["/images/property_apartment.png"],
        }),
      });

      const responseData = await res.json();
      if (!res.ok) {
        throw new Error(responseData.error || "Failed to publish listing.");
      }

      setDone(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to publish. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const previewImage = data.images[0] ? URL.createObjectURL(data.images[0]) : null;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header className="space-y-2">
        <span className="text-[11px] font-bold text-[#00ff66] uppercase tracking-widest">Step 5 of 5</span>
        <h1 className="text-[32px] font-heading font-bold text-[#e3e2e5] leading-tight -tracking-wide">Final Review</h1>
        <p className="text-[16px] text-[#b9ccb5]">
          Review the details below before making your listing live to prospective tenants.
        </p>
      </header>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left – Summary */}
        <div className="flex-1 space-y-5">
          {/* Validation */}
          <div className="p-5 bg-[#1f2022] rounded-xl border border-[#3b4b3a]">
            <h3 className="text-[11px] font-bold text-[#e3e2e5] uppercase tracking-widest mb-4">Listing Status</h3>
            {[
              { label: "Basic details verified",     ok: !!data.title && !!data.type },
              { label: "Specifications complete",    ok: !!data.price && !!data.furnishing },
              { label: "Location confirmed",         ok: !!data.city && !!data.location },
              { label: `${data.images.length} photo(s) uploaded`, ok: data.images.length > 0 },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3 py-1.5">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center ${item.ok ? "bg-[#00ff66]/20 text-[#00ff66]" : "bg-[#93000a]/20 text-[#ffb4ab]"}`}>
                  <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    {item.ok ? "check_circle" : "error"}
                  </span>
                </div>
                <span className="text-sm text-[#e3e2e5]">{item.label}</span>
              </div>
            ))}
          </div>

          {/* Property Summary */}
          <div className="p-5 bg-[#1f2022] rounded-xl border border-[#3b4b3a]">
            <h3 className="text-[11px] font-bold text-[#e3e2e5] uppercase tracking-widest mb-4">Property Summary</h3>
            <div className="grid grid-cols-2 gap-4">
              <Row label="Property Type"    value={data.type || "—"} />
              <Row label="Monthly Rent"     value={data.price ? `₨${Number(data.price).toLocaleString()}` : "—"} />
              <Row label="Bedrooms/Baths"   value={`${data.bedrooms} bd / ${data.bathrooms} ba`} />
              <Row label="Area"             value={data.areaSqFt ? `${data.areaSqFt} sq ft` : "—"} />
              <Row label="Furnishing"       value={FURNISHING_LABEL[data.furnishing] ?? "—"} />
              <Row label="Preferred For"    value={PREFERRED_LABEL[data.preferredFor] ?? "—"} />
              <div className="col-span-2">
                <Row label="Address" value={[data.location, data.neighbourhood, data.city, data.postalCode].filter(Boolean).join(", ") || "—"} />
              </div>
              {data.amenities.length > 0 && (
                <div className="col-span-2">
                  <p className="text-[10px] text-[#b9ccb5] uppercase font-bold tracking-widest">Amenities</p>
                  <p className="text-[#e3e2e5] text-sm mt-0.5">{data.amenities.join(", ")}</p>
                </div>
              )}
            </div>
          </div>

          {error && (
            <div className="p-4 bg-[#93000a]/20 border border-[#ffb4ab]/30 rounded-xl text-[#ffb4ab] text-sm">
              {error}
            </div>
          )}

          <div className="flex items-center gap-4 pt-2">
            <button
              onClick={prev}
              disabled={loading}
              className="px-8 py-4 rounded-xl border border-[#3b4b3a] text-[#e3e2e5] font-bold hover:bg-[#343537] transition-colors flex items-center gap-2 group"
            >
              <span className="material-symbols-outlined transition-transform group-hover:-translate-x-1">arrow_back</span>
              Back
            </button>
            <button
              onClick={handlePublish}
              disabled={loading || done}
              className="flex-1 px-8 py-4 rounded-xl font-black text-[#003911] transition-all flex items-center justify-center gap-2 relative overflow-hidden disabled:opacity-60"
              style={{ background: "linear-gradient(135deg,#00FF66 0%,#00CC52 100%)" }}
            >
              {loading ? (
                <>
                  <span className="material-symbols-outlined animate-spin">refresh</span>
                  Publishing…
                </>
              ) : done ? (
                <>
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  Published!
                </>
              ) : (
                "Publish Listing"
              )}
            </button>
          </div>
        </div>

        {/* Right – Preview Card */}
        <div className="w-full lg:w-80 shrink-0">
          <div className="bg-[#1b1c1e] rounded-[32px] overflow-hidden border border-[#3b4b3a] shadow-2xl">
            <div className="relative h-56">
              {previewImage ? (
                <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-[#0d0e10] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[48px] text-[#3b4b3a]">image</span>
                </div>
              )}
              <div className="absolute top-4 left-4 flex items-center gap-1.5 px-2.5 py-1 bg-black/50 backdrop-blur-md rounded-full border border-white/10">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00ff66] animate-pulse" />
                <span className="text-[11px] font-bold text-white">Live Preview</span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#1b1c1e]" />
            </div>
            <div className="p-6 -mt-8 relative z-10 space-y-3">
              <h4 className="font-heading font-bold text-[#e3e2e5] text-lg truncate">
                {data.title || "Your Listing Title"}
              </h4>
              <p className="text-[13px] text-[#b9ccb5] flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px]">location_on</span>
                {data.city || "City"}{data.neighbourhood ? ` • ${data.neighbourhood}` : ""}
              </p>
              <div className="flex items-center gap-4 py-3 border-y border-[#3b4b3a]">
                <div className="flex items-center gap-1 text-[#b9ccb5] text-xs">
                  <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>bed</span>
                  {data.bedrooms} Beds
                </div>
                <div className="flex items-center gap-1 text-[#b9ccb5] text-xs">
                  <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>bathtub</span>
                  {data.bathrooms} Baths
                </div>
                {data.areaSqFt && (
                  <div className="flex items-center gap-1 text-[#b9ccb5] text-xs">
                    <span className="material-symbols-outlined text-[16px]">square_foot</span>
                    {data.areaSqFt} sqft
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-[#b9ccb5] uppercase tracking-widest">Monthly</p>
                  <p className="text-[#00ff66] font-heading font-bold text-lg">
                    {data.price ? `₨${Number(data.price).toLocaleString()}` : "—"}
                  </p>
                </div>
                <span className="text-[10px] font-bold text-[#b9ccb5] uppercase tracking-widest bg-[#1f2022] border border-[#3b4b3a] px-2 py-1 rounded">
                  Pending Review
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {done && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-center justify-center p-6">
          <div className="max-w-sm w-full bg-[#1f2022] rounded-[40px] p-10 border border-[#00ff66]/20 text-center shadow-[0_0_60px_rgba(0,255,102,0.1)]">
            <div className="w-24 h-24 rounded-full bg-[#00ff66]/10 flex items-center justify-center mx-auto mb-6">
              <span className="material-symbols-outlined text-6xl text-[#00ff66] animate-bounce" style={{ fontVariationSettings: "'FILL' 1" }}>
                check_circle
              </span>
            </div>
            <h2 className="font-heading font-bold text-[#e3e2e5] text-3xl mb-2">Submitted!</h2>
            <p className="text-[#b9ccb5] text-sm mb-8">
              Your listing is under review. You'll be notified once it's approved and visible to tenants.
            </p>
            <button
              onClick={() => router.push("/owner/listings")}
              className="w-full py-4 bg-[#00ff66] text-[#003911] rounded-2xl font-black hover:brightness-105 transition-all"
            >
              Go to My Listings
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
