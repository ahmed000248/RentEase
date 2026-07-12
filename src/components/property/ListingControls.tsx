"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { Bookmark, Check } from "lucide-react";

export default function ListingControls() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  const sort = searchParams.get("sort") || "newest";

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "newest") {
      params.delete("sort");
    } else {
      params.set("sort", value);
    }
    startTransition(() => {
      router.push(`/properties?${params.toString()}`);
    });
  };

  const handleSaveSearch = () => {
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="flex items-center gap-3.5">
      <button
        type="button"
        onClick={handleSaveSearch}
        className="flex items-center gap-2 bg-transparent border border-brand-green text-brand-green text-sm font-semibold px-4.5 py-2.5 rounded-lg hover:bg-brand-green/10 transition-colors cursor-pointer"
      >
        {saved ? <Check className="w-[15px] h-[15px]" /> : <Bookmark className="w-[15px] h-[15px]" />}
        {saved ? "Saved" : "Save Search"}
      </button>
      <div className="flex items-center gap-2.5">
        <span className="text-sm text-white/50">Sort By:</span>
        <select
          value={sort}
          onChange={(e) => handleSortChange(e.target.value)}
          className="bg-[#141417] text-white/90 border border-white/12 rounded-lg px-3.5 py-2.5 text-sm cursor-pointer focus:outline-none focus:border-brand-green appearance-none"
        >
          <option value="newest" className="bg-[#141417]">Newest First</option>
          <option value="price-asc" className="bg-[#141417]">Price: Low to High</option>
          <option value="price-desc" className="bg-[#141417]">Price: High to Low</option>
        </select>
      </div>
    </div>
  );
}
