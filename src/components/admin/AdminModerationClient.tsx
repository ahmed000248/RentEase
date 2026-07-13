"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, Flag, AlertTriangle, Check, X, Activity, Zap, Home } from "lucide-react";
import AdminSidebar from "./AdminSidebar";

interface FlaggedItem {
  id: string;
  title: string;
  reason: string;
  score: number;
  status: "pending" | "approved" | "rejected";
}

const FLAGGED: FlaggedItem[] = [
  { id: "#PH-9901", title: "Penthouse Skyline Suite", reason: "Misleading imagery & inflated pricing claims", score: 94, status: "pending" },
  { id: "#OI-4421", title: "Oceanview Infinity Estate", reason: "Potential duplicate listing detected", score: 87, status: "pending" },
  { id: "#ML-3312", title: "Modern Minimalist Loft", reason: "Keyword spam in description", score: 71, status: "pending" },
];

const ACTIVITY_SPECTRUM = [
  { label: "Approved", count: 847, color: "#00C853", pct: 68 },
  { label: "Rejected", count: 234, color: "#ef4444", pct: 19 },
  { label: "In Review", count: 163, color: "#f59e0b", pct: 13 },
];

function ScoreMeter({ score }: { score: number }) {
  const color = score >= 85 ? "#ef4444" : score >= 70 ? "#f59e0b" : "#00C853";
  return (
    <div className="flex items-center gap-2">
      <div className="relative w-8 h-8">
        <svg viewBox="0 0 32 32" className="w-full h-full -rotate-90">
          <circle cx="16" cy="16" r="12" fill="none" stroke="#232323" strokeWidth="4" />
          <motion.circle cx="16" cy="16" r="12" fill="none" stroke={color} strokeWidth="4"
            strokeDasharray={`${2 * Math.PI * 12}`}
            initial={{ strokeDashoffset: 2 * Math.PI * 12 }}
            animate={{ strokeDashoffset: 2 * Math.PI * 12 * (1 - score / 100) }}
            transition={{ delay: 0.5, duration: 0.8, ease: [0.23, 1, 0.32, 1] }} />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-[8px] font-bold" style={{ color }}>{score}</span>
      </div>
    </div>
  );
}

export default function AdminModerationClient() {
  const [items, setItems] = useState(FLAGGED);

  const updateStatus = (id: string, status: "approved" | "rejected") =>
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, status } : item)));

  return (
    <div className="min-h-screen bg-[#0d0e10] flex">
      <div className="fixed left-4 top-4 bottom-4 z-20 hidden lg:block">
        <AdminSidebar active="moderation" />
      </div>

      <main className="flex-1 lg:pl-[100px] p-6 lg:p-8">
        {/* Header */}
        <motion.div className="mb-8" initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}>
          <h1 className="font-heading text-3xl font-bold text-white">AI Moderation Center</h1>
          <p className="text-[#6b7280] text-sm mt-1">Intelligent content review powered by Vigilant-X AI</p>
        </motion.div>

        {/* KPI Row */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <motion.div className="bg-[#131313] border border-[#ef4444]/20 rounded-2xl p-5"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.35 }}>
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="w-4 h-4 text-[#ef4444]" />
              <span className="text-xs text-[#6b7280] uppercase tracking-wide font-medium">Policy Violations</span>
            </div>
            <p className="font-heading text-3xl font-bold text-white">1,284</p>
          </motion.div>
          <motion.div className="bg-[#131313] border border-[#f59e0b]/20 rounded-2xl p-5"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16, duration: 0.35 }}>
            <div className="flex items-center gap-2 mb-1">
              <Shield className="w-4 h-4 text-[#f59e0b]" />
              <span className="text-xs text-[#6b7280] uppercase tracking-wide font-medium">Fraud Detection</span>
            </div>
            <p className="font-heading text-3xl font-bold text-white">42</p>
          </motion.div>
        </div>

        {/* AI Shield Banner */}
        <motion.div className="bg-gradient-to-r from-[#00C853]/10 to-transparent border border-[#00C853]/20 rounded-2xl p-5 mb-6 flex items-center gap-4"
          initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.22, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}>
          <div className="w-10 h-10 rounded-xl bg-[#00C853]/10 flex items-center justify-center flex-shrink-0">
            <Zap className="w-5 h-5 text-[#00C853]" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[#00C853]">Automated Shield Active</p>
            <p className="text-xs text-[#a0aec0] mt-0.5">AI has successfully auto-suspended <strong className="text-white">12 accounts</strong> with high fraud probability in the last hour.</p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Flagged Listings */}
          <motion.div className="lg:col-span-2 bg-[#131313] border border-[#232323] rounded-2xl overflow-hidden"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}>
            <div className="flex items-center gap-2 px-5 py-4 border-b border-[#1f1f1f]">
              <Flag className="w-4 h-4 text-[#ef4444]" />
              <h2 className="font-heading text-base font-semibold text-white">Flagged Listings</h2>
              <span className="ml-auto text-xs font-semibold bg-[#ef4444]/10 text-[#ef4444] border border-[#ef4444]/20 px-2 py-0.5 rounded-full">
                {items.filter(i => i.status === "pending").length} Pending
              </span>
            </div>
            <div className="divide-y divide-[#1a1a1a]">
              {items.map((item, i) => (
                <motion.div key={item.id} className="p-5 flex gap-4"
                  initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.32 + i * 0.07, duration: 0.3 }}>
                  <div className="w-10 h-10 rounded-xl bg-[#1a1c1e] flex items-center justify-center flex-shrink-0">
                    <Home className="w-5 h-5 text-[#ef4444]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div>
                        <p className="text-sm font-semibold text-white">{item.title}</p>
                        <p className="text-xs text-[#4a5568] font-mono">{item.id}</p>
                      </div>
                      <ScoreMeter score={item.score} />
                    </div>
                    <p className="text-xs text-[#6b7280] mb-3">{item.reason}</p>
                    {item.status === "pending" ? (
                      <div className="flex gap-2">
                        <button onClick={() => updateStatus(item.id, "approved")}
                          className="flex items-center gap-1.5 bg-[#00C853]/10 border border-[#00C853]/20 text-[#00C853] text-xs font-semibold rounded-lg px-3 py-1.5 hover:bg-[#00C853]/20 transition-colors">
                          <Check className="w-3 h-3" /> Approve
                        </button>
                        <button onClick={() => updateStatus(item.id, "rejected")}
                          className="flex items-center gap-1.5 bg-[#ef4444]/10 border border-[#ef4444]/20 text-[#ef4444] text-xs font-semibold rounded-lg px-3 py-1.5 hover:bg-[#ef4444]/20 transition-colors">
                          <X className="w-3 h-3" /> Reject
                        </button>
                      </div>
                    ) : (
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${item.status === "approved" ? "bg-[#00C853]/10 text-[#00C853] border-[#00C853]/20" : "bg-[#ef4444]/10 text-[#ef4444] border-[#ef4444]/20"}`}>
                        {item.status === "approved" ? "✓ Approved" : "✕ Rejected"}
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right panel */}
          <div className="space-y-5">
            {/* Activity Spectrum */}
            <motion.div className="bg-[#131313] border border-[#232323] rounded-2xl p-5"
              initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}>
              <div className="flex items-center gap-2 mb-4">
                <Activity className="w-4 h-4 text-[#00C853]" />
                <h2 className="font-heading text-base font-semibold text-white">Real-time Activity Spectrum</h2>
              </div>
              <div className="space-y-3">
                {ACTIVITY_SPECTRUM.map((a, i) => (
                  <div key={a.label} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-[#a0aec0]">{a.label}</span>
                      <span className="font-semibold" style={{ color: a.color }}>{a.count.toLocaleString()}</span>
                    </div>
                    <div className="h-2 rounded-full bg-[#1a1c1e] overflow-hidden">
                      <motion.div className="h-full rounded-full"
                        style={{ backgroundColor: a.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${a.pct}%` }}
                        transition={{ delay: 0.4 + i * 0.1, duration: 0.7, ease: [0.23, 1, 0.32, 1] }} />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* AI Training Status */}
            <motion.div className="bg-[#131313] border border-[#232323] rounded-2xl p-5"
              initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.45, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-[#00C853] animate-pulse" />
                <p className="text-xs font-semibold text-[#00C853] uppercase tracking-wide">AI Training Status</p>
              </div>
              <p className="text-xs text-[#a0aec0] leading-relaxed">
                Model <strong className="text-white">Vigilant-X</strong> is currently processing <strong className="text-[#00C853]">4.2TB</strong> of regional market data to refine detection thresholds.
              </p>
              <div className="mt-3 h-1.5 rounded-full bg-[#1a1c1e] overflow-hidden">
                <motion.div className="h-full rounded-full bg-gradient-to-r from-[#00C853] to-[#00ff66]"
                  initial={{ width: 0 }} animate={{ width: "73%" }}
                  transition={{ delay: 0.6, duration: 1.2, ease: [0.23, 1, 0.32, 1] }} />
              </div>
              <p className="text-[10px] text-[#4a5568] mt-1.5">73% complete</p>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
