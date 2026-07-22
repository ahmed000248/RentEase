"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, Eye, Flag, ChevronLeft, ChevronRight, Home, ListChecks, BarChart2, Check, X, ShieldAlert } from "lucide-react";
import AdminSidebar from "./AdminSidebar";
import type { PropertyDoc } from "@/lib/firebase/types";
import Link from "next/link";

interface Props {
  initialProperties: PropertyDoc[];
  initialStats: {
    total: number;
    active: number;
    pending: number;
    suspended: number;
  };
}

const STATUS_STYLE: Record<string, string> = {
  approved: "bg-[#00C853]/10 text-[#00C853] border-[#00C853]/20",
  pending: "bg-[#f59e0b]/10 text-[#f59e0b] border-[#f59e0b]/20",
  rejected: "bg-[#ef4444]/10 text-[#ef4444] border-[#ef4444]/20",
  suspended: "bg-[#6b7280]/10 text-[#6b7280] border-[#6b7280]/20",
};

export default function AdminListingsClient({ initialProperties, initialStats }: Props) {
  const [properties, setProperties] = useState<PropertyDoc[]>(initialProperties);
  const [stats, setStats] = useState(initialStats);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const perPage = 10;

  const handleAction = async (id: string, action: "approve" | "reject" | "suspend") => {
    try {
      const res = await fetch(`/api/admin/properties/${id}/${action}`, {
        method: "POST",
      });
      if (!res.ok) throw new Error(`${action} failed`);

      const newStatus = action === "approve" ? "approved" : action === "reject" ? "rejected" : "suspended";

      setProperties((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: newStatus as any } : p))
      );
    } catch {
      alert(`Action ${action} failed. Make sure you are authorized as admin.`);
    }
  };

  const filtered = properties.filter((l) => {
    const matchesSearch =
      l.title.toLowerCase().includes(search.toLowerCase()) ||
      l.id.toLowerCase().includes(search.toLowerCase()) ||
      l.city.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || l.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filtered.length / perPage) || 1;
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const STAT_CARDS = [
    { label: "Total Properties", value: stats.total, icon: Home, color: "#00C853" },
    { label: "Active Listings", value: stats.active, icon: ListChecks, color: "#3b82f6" },
    { label: "Pending Review", value: stats.pending, icon: BarChart2, color: "#f59e0b" },
    { label: "Suspended", value: stats.suspended, icon: ShieldAlert, color: "#ef4444" },
  ];

  return (
    <div className="min-h-screen bg-[#0d0e10] flex">
      <div className="fixed left-4 top-4 bottom-4 z-20 hidden lg:block">
        <AdminSidebar active="listings" />
      </div>

      <main className="flex-1 lg:pl-[100px] p-6 lg:p-8">
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
        >
          <h1 className="font-heading text-3xl font-bold text-white">Property Listings</h1>
          <p className="text-[#6b7280] text-sm mt-1">Manage and review all property inventory across your platform.</p>
        </motion.div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {STAT_CARDS.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.label}
                className="bg-[#131313] border border-[#232323] rounded-2xl p-4"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07, duration: 0.35 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: s.color + "20" }}
                  >
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
        <motion.div
          className="bg-[#131313] border border-[#232323] rounded-2xl overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          {/* Table header / Controls */}
          <div className="flex flex-wrap items-center gap-3 px-5 py-4 border-b border-[#1f1f1f]">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4a5568]" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search listings…"
                className="w-full bg-[#1a1c1e] border border-[#232323] rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-[#4a5568] focus:outline-none focus:border-[#00C853]/50 transition-colors"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#1a1c1e] border border-[#232323] text-sm text-white rounded-xl px-3 py-2 focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
              <option value="suspended">Suspended</option>
            </select>

            <span className="ml-auto text-xs text-[#4a5568]">
              Showing {filtered.length === 0 ? 0 : (page - 1) * perPage + 1}–
              {Math.min(page * perPage, filtered.length)} of {filtered.length}
            </span>
          </div>

          {/* Table content */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#1f1f1f]">
                  {["Property", "ID", "Price", "Location", "Status", "Actions"].map((col) => (
                    <th
                      key={col}
                      className="text-left px-5 py-3 text-xs font-semibold text-[#4a5568] uppercase tracking-wide"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-8 text-center text-[#6b7280] text-sm">
                      No listings found matching filter.
                    </td>
                  </tr>
                ) : (
                  paginated.map((listing, i) => (
                    <tr
                      key={listing.id}
                      className="border-b border-[#1a1a1a] hover:bg-[#1a1c1e] transition-colors group"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#1f2022] to-[#131313] border border-[#232323] flex items-center justify-center flex-shrink-0">
                            <Home className="w-4 h-4 text-[#00C853]" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">{listing.title}</p>
                            <p className="text-xs text-[#4a5568] capitalize">{listing.type}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-xs text-[#6b7280] font-mono">{listing.id}</td>
                      <td className="px-5 py-4 text-sm text-white">${listing.price?.toLocaleString()}/mo</td>
                      <td className="px-5 py-4 text-sm text-[#a0aec0]">{listing.city}</td>
                      <td className="px-5 py-4">
                        <span
                          className={`text-xs font-semibold px-2.5 py-1 rounded-full border capitalize ${
                            STATUS_STYLE[listing.status] || "bg-[#1a1c1e] text-[#6b7280]"
                          }`}
                        >
                          {listing.status}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/properties/${listing.id}`}
                            className="w-8 h-8 rounded-lg bg-[#232323] flex items-center justify-center text-[#6b7280] hover:text-[#00C853] transition-colors"
                            title="View Public Listing"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Link>

                          {listing.status !== "approved" && (
                            <button
                              onClick={() => handleAction(listing.id, "approve")}
                              className="w-8 h-8 rounded-lg bg-[#232323] flex items-center justify-center text-[#6b7280] hover:text-[#00C853] transition-colors"
                              title="Approve"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {listing.status !== "suspended" && (
                            <button
                              onClick={() => handleAction(listing.id, "suspend")}
                              className="w-8 h-8 rounded-lg bg-[#232323] flex items-center justify-center text-[#6b7280] hover:text-[#ef4444] transition-colors"
                              title="Suspend"
                            >
                              <Flag className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination controls */}
          <div className="flex items-center justify-between px-5 py-4 border-t border-[#1f1f1f]">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-8 h-8 rounded-lg bg-[#1a1c1e] border border-[#232323] flex items-center justify-center text-[#6b7280] hover:text-white transition-colors disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-sm text-[#6b7280] px-2">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="w-8 h-8 rounded-lg bg-[#1a1c1e] border border-[#232323] flex items-center justify-center text-[#6b7280] hover:text-white transition-colors disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
