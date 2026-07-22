"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, Flag, AlertTriangle, Check, X, Zap, Home, CheckCircle2 } from "lucide-react";
import AdminSidebar from "./AdminSidebar";
import type { PropertyDoc } from "@/lib/firebase/types";

interface Props {
  initialPendingProperties: PropertyDoc[];
}

export default function AdminModerationClient({ initialPendingProperties }: Props) {
  const [properties, setProperties] = useState<PropertyDoc[]>(initialPendingProperties);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const handleApprove = async (id: string) => {
    setActionLoading(id);
    try {
      const res = await fetch(`/api/admin/properties/${id}/approve`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Approve failed");

      setProperties((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert("Failed to approve property. Ensure you are logged in as admin.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id: string) => {
    const reason = prompt("Enter rejection reason (optional):") || "";
    setActionLoading(id);
    try {
      const res = await fetch(`/api/admin/properties/${id}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
      });
      if (!res.ok) throw new Error("Reject failed");

      setProperties((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert("Failed to reject property. Ensure you are logged in as admin.");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0e10] flex">
      <div className="fixed left-4 top-4 bottom-4 z-20 hidden lg:block">
        <AdminSidebar active="moderation" />
      </div>

      <main className="flex-1 lg:pl-[100px] p-6 lg:p-8">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
        >
          <h1 className="font-heading text-3xl font-bold text-white">Content Moderation Queue</h1>
          <p className="text-[#6b7280] text-sm mt-1">Review pending property submissions before they go live on public search</p>
        </motion.div>

        {/* KPI Row */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <motion.div
            className="bg-[#131313] border border-[#f59e0b]/20 rounded-2xl p-5"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.35 }}
          >
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="w-4 h-4 text-[#f59e0b]" />
              <span className="text-xs text-[#6b7280] uppercase tracking-wide font-medium">Pending Moderation</span>
            </div>
            <p className="font-heading text-3xl font-bold text-white">{properties.length}</p>
          </motion.div>

          <motion.div
            className="bg-[#131313] border border-[#00C853]/20 rounded-2xl p-5"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16, duration: 0.35 }}
          >
            <div className="flex items-center gap-2 mb-1">
              <Shield className="w-4 h-4 text-[#00C853]" />
              <span className="text-xs text-[#6b7280] uppercase tracking-wide font-medium">Protection Gate</span>
            </div>
            <p className="font-heading text-3xl font-bold text-[#00C853]">Active</p>
          </motion.div>
        </div>

        {/* Moderation List */}
        <motion.div
          className="bg-[#131313] border border-[#232323] rounded-2xl overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28, duration: 0.4 }}
        >
          <div className="flex items-center gap-2 px-5 py-4 border-b border-[#1f1f1f]">
            <Flag className="w-4 h-4 text-[#f59e0b]" />
            <h2 className="font-heading text-base font-semibold text-white">Pending Approval Queue</h2>
            <span className="ml-auto text-xs font-semibold bg-[#f59e0b]/10 text-[#f59e0b] border border-[#f59e0b]/20 px-2.5 py-0.5 rounded-full">
              {properties.length} Pending
            </span>
          </div>

          {properties.length === 0 ? (
            <div className="p-12 text-center text-[#6b7280]">
              <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-[#00C853] opacity-60" />
              <p className="text-base font-medium text-white">Queue Clear!</p>
              <p className="text-xs mt-1 text-[#4a5568]">All property submissions have been reviewed and moderated.</p>
            </div>
          ) : (
            <div className="divide-y divide-[#1a1a1a]">
              {properties.map((item, i) => (
                <motion.div
                  key={item.id}
                  className="p-5 flex gap-4 items-start"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                >
                  <div className="w-12 h-12 rounded-xl bg-[#1a1c1e] border border-[#232323] flex items-center justify-center flex-shrink-0">
                    <Home className="w-6 h-6 text-[#00C853]" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div>
                        <p className="text-sm font-semibold text-white">{item.title}</p>
                        <p className="text-xs text-[#4a5568]">
                          {item.city} · {item.type} · ${item.price?.toLocaleString()}/mo
                        </p>
                      </div>
                      <span className="text-[10px] text-[#4a5568] font-mono">{item.id}</span>
                    </div>

                    <p className="text-xs text-[#6b7280] line-clamp-2 mb-3">{item.description}</p>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApprove(item.id)}
                        disabled={actionLoading === item.id}
                        className="flex items-center gap-1.5 bg-[#00C853]/10 border border-[#00C853]/20 text-[#00C853] text-xs font-semibold rounded-lg px-3.5 py-1.5 hover:bg-[#00C853]/20 transition-colors disabled:opacity-50"
                      >
                        <Check className="w-3.5 h-3.5" /> Approve Listing
                      </button>
                      <button
                        onClick={() => handleReject(item.id)}
                        disabled={actionLoading === item.id}
                        className="flex items-center gap-1.5 bg-[#ef4444]/10 border border-[#ef4444]/20 text-[#ef4444] text-xs font-semibold rounded-lg px-3.5 py-1.5 hover:bg-[#ef4444]/20 transition-colors disabled:opacity-50"
                      >
                        <X className="w-3.5 h-3.5" /> Reject Listing
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
