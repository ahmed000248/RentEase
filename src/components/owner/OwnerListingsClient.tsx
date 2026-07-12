"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import OwnerSidebar from "./OwnerSidebar";
import {
  Bell,
  Search,
  Plus,
  MoreVertical,
  MapPin,
  Building2,
  Trash2,
  ExternalLink,
  Edit,
  Eye,
  TrendingUp,
  CheckCircle,
  SlidersHorizontal,
  ChevronDown,
} from "lucide-react";
import type { PropertyDoc, PropertyType } from "@/lib/firebase/types";

interface Props {
  ownerName: string;
  properties: PropertyDoc[];
}

const TYPE_LABELS: Record<PropertyType, string> = {
  house: "House",
  apartment: "Apartment",
  room: "Room",
  hostel: "Hostel",
  shop: "Shop",
};

export default function OwnerListingsClient({ ownerName, properties: initialProperties }: Props) {
  const [properties, setProperties] = useState<PropertyDoc[]>(initialProperties);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "approved" | "pending" | "rejected">("all");
  const [sortBy, setSortBy] = useState<"latest" | "price-desc" | "price-asc" | "title">("latest");
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Derive stats
  const totalCount = properties.length;
  const activeCount = properties.filter((p) => p.status === "approved").length;
  const pendingCount = properties.filter((p) => p.status === "pending").length;
  const rejectedCount = properties.filter((p) => p.status === "rejected").length;
  
  // Calculate average rental price
  const avgRent = totalCount
    ? Math.round(properties.reduce((sum, p) => sum + p.price, 0) / totalCount)
    : 0;

  // Filter & Sort properties
  const filteredAndSorted = useMemo(() => {
    let result = [...properties];

    // Status filter
    if (statusFilter !== "all") {
      result = result.filter((p) => p.status === statusFilter);
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.city.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q)
      );
    }

    // Sorting
    if (sortBy === "latest") {
      result.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "price-asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "title") {
      result.sort((a, b) => a.title.localeCompare(b.title));
    }

    return result;
  }, [properties, searchQuery, statusFilter, sortBy]);

  // Actions
  const toggleStatus = (id: string, current: PropertyDoc["status"]) => {
    const nextStatus: PropertyDoc["status"] = current === "approved" ? "pending" : "approved";
    setProperties((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: nextStatus } : p))
    );
    setActiveMenuId(null);
  };

  const deleteProperty = (id: string) => {
    if (confirm("Are you sure you want to delete this listing?")) {
      setProperties((prev) => prev.filter((p) => p.id !== id));
      setActiveMenuId(null);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#060606] p-4 sm:p-7 flex justify-center font-dashboard text-on-surface">
      <div className="w-full max-w-[1480px] flex flex-col lg:flex-row gap-5 bg-[#0c0c0c] border border-[#1e1e1e] rounded-[28px] p-4 sm:p-5 shadow-[0_40px_100px_rgba(0,0,0,0.55)]">
        <OwnerSidebar active="listings" />

        {/* MAIN PANEL */}
        <div className="flex-1 min-w-0 flex flex-col gap-5">
          {/* HEADER BAR */}
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <div className="text-xs text-brand-green tracking-[0.08em] uppercase font-semibold mb-1">
                Owner Portal
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                My Property Listings
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666]" />
                <input
                  type="text"
                  placeholder="Search listings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-[#131313] border border-[#232323] rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-[#555] focus:outline-none focus:border-[#444] w-[200px] sm:w-[260px] transition-colors"
                />
              </div>

              <Link
                href="/owner/properties/new"
                className="flex items-center gap-1.5 px-4 py-2 bg-brand-green hover:bg-[#00b543] active:scale-[0.98] transition-all text-[#0c0c0c] text-sm font-semibold rounded-xl"
              >
                <Plus className="w-4 h-4" />
                Add Listing
              </Link>
            </div>
          </div>

          {/* STATS OVERVIEW CARDS */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#131313] border border-[#222] rounded-[18px] p-4 flex flex-col justify-between group hover:border-[#333] transition-all duration-300">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-semibold text-[#888] tracking-wider">
                  Total Listings
                </span>
                <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-[#ccc]">
                  <Building2 className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <h3 className="text-2xl font-bold text-white">{totalCount}</h3>
                <p className="text-[10px] text-[#555] mt-0.5">Properties registered</p>
              </div>
            </div>

            <div className="bg-[#131313] border border-[#222] rounded-[18px] p-4 flex flex-col justify-between group hover:border-[#333] transition-all duration-300">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-semibold text-brand-green tracking-wider">
                  Active / Approved
                </span>
                <div className="w-7 h-7 rounded-lg bg-brand-green/10 flex items-center justify-center text-brand-green">
                  <CheckCircle className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <h3 className="text-2xl font-bold text-white">{activeCount}</h3>
                <p className="text-[10px] text-[#555] mt-0.5">Live on public portal</p>
              </div>
            </div>

            <div className="bg-[#131313] border border-[#222] rounded-[18px] p-4 flex flex-col justify-between group hover:border-[#333] transition-all duration-300">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-semibold text-[#e7c17d] tracking-wider">
                  Pending Review
                </span>
                <div className="w-7 h-7 rounded-lg bg-[#e7c17d]/10 flex items-center justify-center text-[#e7c17d]">
                  <SlidersHorizontal className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <h3 className="text-2xl font-bold text-white">{pendingCount}</h3>
                <p className="text-[10px] text-[#555] mt-0.5">Draft or verification stage</p>
              </div>
            </div>

            <div className="bg-[#131313] border border-[#222] rounded-[18px] p-4 flex flex-col justify-between group hover:border-[#333] transition-all duration-300">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-semibold text-[#ffb4ab] tracking-wider">
                  Avg. Monthly Rent
                </span>
                <div className="w-7 h-7 rounded-lg bg-[#ffb4ab]/10 flex items-center justify-center text-[#ffb4ab]">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <h3 className="text-2xl font-bold text-white">
                  ${avgRent.toLocaleString()}
                </h3>
                <p className="text-[10px] text-[#555] mt-0.5">Portfolio average price</p>
              </div>
            </div>
          </div>

          {/* LISTINGS TABLE/GRID SECTION */}
          <div className="bg-[#131313] border border-[#232323] rounded-2xl overflow-hidden flex flex-col">
            {/* Filter Headers */}
            <div className="px-5 py-4 border-b border-[#232323] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-1 bg-[#1a1a1a] p-1 rounded-xl w-fit">
                <button
                  onClick={() => setStatusFilter("all")}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                    statusFilter === "all"
                      ? "bg-[#292a2c] text-white"
                      : "text-[#777] hover:text-white"
                  }`}
                >
                  All ({totalCount})
                </button>
                <button
                  onClick={() => setStatusFilter("approved")}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                    statusFilter === "approved"
                      ? "bg-brand-green/20 text-brand-green"
                      : "text-[#777] hover:text-white"
                  }`}
                >
                  Active ({activeCount})
                </button>
                <button
                  onClick={() => setStatusFilter("pending")}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                    statusFilter === "pending"
                      ? "bg-[#e7c17d]/20 text-[#e7c17d]"
                      : "text-[#777] hover:text-white"
                  }`}
                >
                  Pending ({pendingCount})
                </button>
                <button
                  onClick={() => setStatusFilter("rejected")}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                    statusFilter === "rejected"
                      ? "bg-[#ffb4ab]/20 text-[#ffb4ab]"
                      : "text-[#777] hover:text-white"
                  }`}
                >
                  Rejected ({rejectedCount})
                </button>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto text-xs">
                <span className="text-[#666] font-semibold">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e: any) => setSortBy(e.target.value)}
                  className="bg-[#1a1a1a] border border-[#2c2c2c] text-[#ccc] rounded-lg px-2.5 py-1.5 font-semibold focus:outline-none focus:border-[#444]"
                >
                  <option value="latest">Latest Created</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="title">Title A-Z</option>
                </select>
              </div>
            </div>

            {/* List Table */}
            <div className="overflow-x-auto">
              {filteredAndSorted.length === 0 ? (
                <div className="p-12 text-center text-[#555] flex flex-col items-center justify-center gap-2">
                  <Building2 className="w-10 h-10 stroke-[1.5]" />
                  <p className="text-sm">No properties found matching your selection.</p>
                </div>
              ) : (
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="border-b border-[#232323] text-[10px] uppercase font-bold text-[#666] bg-[#0c0c0c]/40">
                      <th className="px-6 py-4">Property</th>
                      <th className="px-6 py-4">Location</th>
                      <th className="px-6 py-4">Specs</th>
                      <th className="px-6 py-4">Rent Price</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#232323]/40">
                    {filteredAndSorted.map((property) => {
                      const image = property.images?.[0] || "";
                      return (
                        <tr key={property.id} className="hover:bg-[#1a1a1a]/30 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-9 rounded-lg bg-[#222] border border-[#333] overflow-hidden shrink-0">
                                {image ? (
                                  <img
                                    src={image}
                                    alt={property.title}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-[#555]">
                                    <Building2 className="w-4 h-4" />
                                  </div>
                                )}
                              </div>
                              <div>
                                <h4 className="text-sm font-semibold text-white leading-tight">
                                  {property.title}
                                </h4>
                                <span className="text-[10px] text-[#666]">
                                  {TYPE_LABELS[property.type]}
                                </span>
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <div className="flex items-center gap-1 text-xs text-[#aaa]">
                              <MapPin className="w-3.5 h-3.5 text-[#555] shrink-0" />
                              <span>
                                {property.location}, {property.city}
                              </span>
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <div className="text-xs text-[#888]">
                              {property.bedrooms} Beds • {property.bathrooms} Baths • {property.areaSqFt} sqft
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <span className="text-sm font-bold text-white">
                              ${property.price.toLocaleString()}
                            </span>
                            <span className="text-[10px] text-[#666]">/mo</span>
                          </td>

                          <td className="px-6 py-4">
                            {property.status === "approved" && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-brand-green/10 text-brand-green border border-brand-green/20">
                                Active
                              </span>
                            )}
                            {property.status === "pending" && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-[#e7c17d]/10 text-[#e7c17d] border border-[#e7c17d]/20">
                                Pending
                              </span>
                            )}
                            {property.status === "rejected" && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-[#ffb4ab]/10 text-[#ffb4ab] border border-[#ffb4ab]/20">
                                Rejected
                              </span>
                            )}
                          </td>

                          <td className="px-6 py-4 text-right">
                            <div className="relative inline-block text-left">
                              <button
                                onClick={() =>
                                  setActiveMenuId(activeMenuId === property.id ? null : property.id)
                                }
                                className="p-1.5 hover:bg-[#222] text-[#777] hover:text-white rounded-lg transition-colors"
                              >
                                <MoreVertical className="w-4 h-4" />
                              </button>

                              {activeMenuId === property.id && (
                                <>
                                  <div
                                    className="fixed inset-0 z-10"
                                    onClick={() => setActiveMenuId(null)}
                                  />
                                  <div className="absolute right-0 mt-1 w-44 bg-[#181818] border border-[#2a2a2a] rounded-xl shadow-xl z-20 py-1 text-left">
                                    <Link
                                      href={`/properties/${property.id}`}
                                      target="_blank"
                                      className="flex items-center gap-2 px-3.5 py-2 text-xs text-[#bbb] hover:text-white hover:bg-white/5 transition-colors"
                                    >
                                      <ExternalLink className="w-3.5 h-3.5" />
                                      View Public Page
                                    </Link>
                                    <button
                                      onClick={() => toggleStatus(property.id, property.status)}
                                      className="flex items-center gap-2 w-full px-3.5 py-2 text-xs text-[#bbb] hover:text-white hover:bg-white/5 transition-colors"
                                    >
                                      <Edit className="w-3.5 h-3.5" />
                                      {property.status === "approved" ? "Set to Pending" : "Set to Active"}
                                    </button>
                                    <div className="border-t border-[#222] my-1" />
                                    <button
                                      onClick={() => deleteProperty(property.id)}
                                      className="flex items-center gap-2 w-full px-3.5 py-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-colors"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                      Delete Listing
                                    </button>
                                  </div>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
