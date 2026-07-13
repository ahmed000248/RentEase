"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, Eye, Flag, ChevronLeft, ChevronRight, Home, ListChecks, BarChart2, Activity } from "lucide-react";
import AdminSidebar from "./AdminSidebar";

interface Listing {
  id: string;
  name: string;
  views: string;
  reports: number;
  status: "Active" | "Pending" | "Flagged" | "Suspended";
}

const LISTINGS: Listing[] = [
  { id: "#PH-2041", name: "The Obsidian Heights", views: "4.2k", reports: 0, status: "Active" },
  { id: "#SL-8812", name: "Emerald Skyline Loft", views: "842", reports: 0, status: "Active" },
  { id: "#CB-1102", name: "Cliffside Brutalist", views: "3.1k", reports: 12, status: "Flagged" },
  { id: "#HQ-9901", name: "Carbon HQ Complex", views: "1.9k", reports: 0, status: "Active" },
  { id: "#GL-3344", name: "Glass Nexus Tower", views: "2.3k", reports: 2, status: "Pending" },
  { id: "#MV-0112", name: "Marble Vista Estate", views: "980", reports: 0, status: "Active" },
  { id: "#SU-7788", name: "Suspended Skypad", views: "410", reports: 18, status: "Suspended" },
];

const STATUS_STYLE: Record<string, string> = {
  Active: "bg-[#00C853]/10 text-[#00C853] border-[#00C853]/20",
  Pending: "bg-[#f59e0b]/10 text-[#f59e0b] border-[#f59e0b]/20",
  Flagged: "bg-[#ef4444]/10 text-[#ef4444] border-[#ef4444]/20",
  Suspended: "bg-[#6b7280]/10 text-[#6b7280] border-[#6b7280]/20",
};

const STAT_CARDS = [
  { label: "Total Properties", value: "1,284", icon: Home, color: "#00C853" },
  { label: "Active Listings", value: "1,208", icon: ListChecks, color: "#3b82f6" },
  { label: "Queue Size", value: "42", icon: BarChart2, color: "#f59e0b" },
  { label: "Reported Listings", value: "15", icon: Flag, color: "#ef4444" },
];

export default function AdminListingsClient() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 10;

  const filtered = LISTINGS.filter((l) =>
    l.name.toLowerCase().includes(search.toLowerCase()) || l.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0d0e10] flex">
      <div className="fixed left-4 top-4 bottom-4 z-20 hidden lg:block">
        <AdminSidebar active="listings" />
      </div>

      <main className="flex-1 lg:pl-[100px] p-6 lg:p-8">
        <motion.div className="mb-8" initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}>
          <h1 className="font-heading text-3xl font-bold text-white">Property Listings</h1>
          <p className="text-[#6b7280] text-sm mt-1">Manage and review all property inventory across your premium portfolio.</p>
        </motion.div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {STAT_CARDS.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div key={s.label} className="bg-[#131313] border border-[#232323] rounded-2xl p-4"
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07, duration: 0.35, ease: [0.23, 1, 0.32, 1] }}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: s.color + "20" }}>
                    <Icon className="w-4 h-4" style={{ color: s.color }} />
                  </div>
                  <span className="text-xs text-[#6b7280] font-medium">{s.label}</span>
                </div>
                <p className="font-heading text-2xl font-bold text-white">{s.value}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Table */}
        <motion.div className="bg-[#131313] border border-[#232323] rounded-2xl overflow-hidden"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}>
          {/* Table header */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-[#1f1f1f]">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4a5568]" />
              <input value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search listings…"
                className="w-full bg-[#1a1c1e] border border-[#232323] rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-[#4a5568] focus:outline-none focus:border-[#00C853]/50 transition-colors" />
            </div>
            <button className="flex items-center gap-2 bg-[#1a1c1e] border border-[#232323] text-[#6b7280] rounded-xl px-3 py-2 text-sm hover:border-[#333] transition-colors">
              <Filter className="w-4 h-4" /> Filter
            </button>
            <span className="ml-auto text-xs text-[#4a5568]">Showing 1-10 of 1,284</span>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#1f1f1f]">
                  {["Property", "Listing ID", "Views", "Reports", "Status", "Actions"].map((col) => (
                    <th key={col} className="text-left px-5 py-3 text-xs font-semibold text-[#4a5568] uppercase tracking-wide">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((listing, i) => (
                  <motion.tr key={listing.id}
                    className="border-b border-[#1a1a1a] hover:bg-[#1a1c1e] transition-colors group"
                    initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.35 + i * 0.04, duration: 0.3 }}>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#1f2022] to-[#131313] border border-[#232323] flex items-center justify-center flex-shrink-0">
                          <Home className="w-4 h-4 text-[#00C853]" />
                        </div>
                        <p className="text-sm font-medium text-white">{listing.name}</p>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-[#6b7280] font-mono">{listing.id}</td>
                    <td className="px-5 py-4 text-sm text-white">{listing.views} Views</td>
                    <td className="px-5 py-4">
                      {listing.reports > 0 ? (
                        <span className="flex items-center gap-1 text-sm text-[#ef4444]">
                          <Flag className="w-3 h-3" /> {listing.reports}
                        </span>
                      ) : (
                        <span className="text-sm text-[#4a5568]">0</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${STATUS_STYLE[listing.status]}`}>
                        {listing.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="w-8 h-8 rounded-lg bg-[#232323] flex items-center justify-center text-[#6b7280] hover:text-[#00C853] transition-colors" title="View">
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button className="w-8 h-8 rounded-lg bg-[#232323] flex items-center justify-center text-[#6b7280] hover:text-[#ef4444] transition-colors" title="Flag">
                          <Flag className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-5 py-4 border-t border-[#1f1f1f]">
            <div className="flex items-center gap-2 text-xs text-[#6b7280]">
              Rows per page:
              <select className="bg-[#1a1c1e] border border-[#232323] text-white rounded-lg px-2 py-1 text-xs focus:outline-none">
                <option>10</option><option>25</option><option>50</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))}
                className="w-8 h-8 rounded-lg bg-[#1a1c1e] border border-[#232323] flex items-center justify-center text-[#6b7280] hover:text-white transition-colors">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-sm text-[#6b7280] px-2">{page} of 129</span>
              <button onClick={() => setPage(p => p + 1)}
                className="w-8 h-8 rounded-lg bg-[#1a1c1e] border border-[#232323] flex items-center justify-center text-[#6b7280] hover:text-white transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
