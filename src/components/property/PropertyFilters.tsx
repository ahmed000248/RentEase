"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition, useEffect } from "react";
import { SlidersHorizontal } from "lucide-react";

interface PropertyFiltersProps {
  cities: string[];
  types: string[];
}

const BEDROOM_OPTIONS = [1, 2, 3, 4, 5];
const FURNISHING_OPTIONS = [
  { value: "furnished", label: "Furnished" },
  { value: "semi-furnished", label: "Semi-Furnished" },
  { value: "unfurnished", label: "Unfurnished" },
];
const PREFERRED_FOR_OPTIONS = [
  { value: "any", label: "Any" },
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
];

export default function PropertyFilters({ cities, types }: PropertyFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [query, setQuery] = useState(searchParams.get("query") || "");
  const [city, setCity] = useState(searchParams.get("city") || "");
  const [type, setType] = useState(searchParams.get("type") || "");
  const [bedrooms, setBedrooms] = useState(searchParams.get("bedrooms") || "");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [furnishing, setFurnishing] = useState(searchParams.get("furnishing") || "");
  const [preferredFor, setPreferredFor] = useState(searchParams.get("preferredFor") || "");

  useEffect(() => {
    setQuery(searchParams.get("query") || "");
    setCity(searchParams.get("city") || "");
    setType(searchParams.get("type") || "");
    setBedrooms(searchParams.get("bedrooms") || "");
    setMinPrice(searchParams.get("minPrice") || "");
    setMaxPrice(searchParams.get("maxPrice") || "");
    setFurnishing(searchParams.get("furnishing") || "");
    setPreferredFor(searchParams.get("preferredFor") || "");
  }, [searchParams]);

  const hasActiveFilters = Boolean(
    query || city || type || bedrooms || minPrice || maxPrice || furnishing || preferredFor
  );

  const applyFilters = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    const sort = params.get("sort");
    const next = new URLSearchParams();
    if (sort) next.set("sort", sort);
    if (query.trim()) next.set("query", query.trim());
    if (city) next.set("city", city);
    if (type) next.set("type", type);
    if (bedrooms) next.set("bedrooms", bedrooms);
    if (minPrice) next.set("minPrice", minPrice);
    if (maxPrice) next.set("maxPrice", maxPrice);
    if (furnishing) next.set("furnishing", furnishing);
    if (preferredFor) next.set("preferredFor", preferredFor);

    startTransition(() => {
      router.push(`/properties?${next.toString()}`);
    });
  };

  const resetAll = () => {
    setQuery("");
    setCity("");
    setType("");
    setBedrooms("");
    setMinPrice("");
    setMaxPrice("");
    setFurnishing("");
    setPreferredFor("");
    startTransition(() => {
      router.push("/properties");
    });
  };

  const fieldLabelClass = "block text-xs font-semibold text-white/50 mb-2";
  const inputClass =
    "w-full bg-black/40 border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-brand-green transition-colors";
  const selectClass = `${inputClass} appearance-none cursor-pointer`;

  return (
    <aside className="w-full lg:w-72 flex-shrink-0 bg-[#111113] border border-white/8 rounded-2xl p-6 h-fit lg:sticky lg:top-24">
      <div className="flex items-center gap-2.5 mb-6">
        <SlidersHorizontal className="w-[18px] h-[18px] text-brand-green" />
        <span className="text-base font-semibold text-white">Filter Search</span>
      </div>

      <form onSubmit={applyFilters}>
        <div className="mb-4">
          <label className={fieldLabelClass}>Keyword</label>
          <input
            type="text"
            placeholder="e.g. pool, modern"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="mb-4">
          <label className={fieldLabelClass}>City</label>
          <select value={city} onChange={(e) => setCity(e.target.value)} className={selectClass}>
            <option value="" className="bg-[#111113]">All Cities</option>
            {cities.map((c) => (
              <option key={c} value={c} className="bg-[#111113]">{c}</option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className={fieldLabelClass}>Property Type</label>
          <select value={type} onChange={(e) => setType(e.target.value)} className={selectClass}>
            <option value="" className="bg-[#111113]">All Types</option>
            {types.map((t) => (
              <option key={t} value={t} className="bg-[#111113]">
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className={fieldLabelClass}>Monthly Rent Range</label>
          <div className="flex gap-2.5">
            <input
              type="number"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className={`${inputClass} w-1/2`}
            />
            <input
              type="number"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className={`${inputClass} w-1/2`}
            />
          </div>
        </div>

        <div className="mb-4">
          <label className={fieldLabelClass}>Bedrooms</label>
          <select value={bedrooms} onChange={(e) => setBedrooms(e.target.value)} className={selectClass}>
            <option value="" className="bg-[#111113]">Any Bedrooms</option>
            {BEDROOM_OPTIONS.map((num) => (
              <option key={num} value={String(num)} className="bg-[#111113]">
                {num} {num === 1 ? "Bedroom" : "Bedrooms"}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className={fieldLabelClass}>Furnishing</label>
          <select value={furnishing} onChange={(e) => setFurnishing(e.target.value)} className={selectClass}>
            <option value="" className="bg-[#111113]">Any</option>
            {FURNISHING_OPTIONS.map((f) => (
              <option key={f.value} value={f.value} className="bg-[#111113]">{f.label}</option>
            ))}
          </select>
        </div>

        <div className="mb-5">
          <label className={fieldLabelClass}>Preferred For (rooms/hostels)</label>
          <select value={preferredFor} onChange={(e) => setPreferredFor(e.target.value)} className={selectClass}>
            {PREFERRED_FOR_OPTIONS.map((p) => (
              <option key={p.value} value={p.value === "any" ? "" : p.value} className="bg-[#111113]">
                {p.label}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-brand-green text-black text-sm font-bold py-3 rounded-lg hover:bg-white transition-colors disabled:opacity-50"
        >
          {isPending ? "Applying..." : "Apply Filters"}
        </button>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={resetAll}
            disabled={isPending}
            className="w-full text-center text-xs text-white/40 hover:text-white transition-colors mt-3.5 cursor-pointer"
          >
            Reset All
          </button>
        )}
      </form>
    </aside>
  );
}
