"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Users, Home, ListChecks, Clock, DollarSign, TrendingUp, Activity, Building2, Plus, Shield } from "lucide-react";
import AdminSidebar from "./AdminSidebar";

const KPI = [
  { label: "Total Users", value: 42892, formatted: "42,892", icon: Users, color: "#00C853" },
  { label: "Active Owners", value: 8140, formatted: "8,140", icon: Shield, color: "#3b82f6" },
  { label: "Total Listings", value: 15622, formatted: "15,622", icon: Home, color: "#8b5cf6" },
  { label: "Pending Approvals", value: 148, formatted: "148", icon: Clock, color: "#f59e0b" },
  { label: "Monthly Revenue", value: 0, formatted: "$1.24M", icon: DollarSign, color: "#00C853" },
  { label: "Occupancy Rate", value: 0, formatted: "94.2%", icon: TrendingUp, color: "#10b981" },
];

const ACTIVITY = [
  { msg: "New Listing: The Obsidian Peak Villa", when: "2 mins ago", category: "Marina District", color: "#00C853", dot: "bg-[#00C853]" },
  { msg: "Owner KYC Verified: Marcus Sterling", when: "14 mins ago", category: "Legal Team", color: "#3b82f6", dot: "bg-[#3b82f6]" },
  { msg: "Payout Batch Processed: $184,200.00", when: "1 hour ago", category: "Financials", color: "#8b5cf6", dot: "bg-[#8b5cf6]" },
  { msg: "Flagged Content: Listing #4402 - Dup", when: "3 hours ago", category: "Moderator", color: "#f59e0b", dot: "bg-[#f59e0b]" },
  { msg: "System Patch v4.2.1 successfully deployed.", when: "5 hours ago", category: "DevOps", color: "#6b7280", dot: "bg-[#6b7280]" },
];

const ASSETS = [
  { name: "The Emerald Pavilion", detail: "4 Units", occ: 98, color: "#00C853" },
  { name: "Obsidian Towers", detail: "12 Commercial Suites", occ: 92, color: "#3b82f6" },
  { name: "Vanguard Isles", detail: "1 Private Estate", occ: 100, color: "#8b5cf6" },
];

const MONTHS = ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun"];
const REV = [820, 890, 940, 1020, 1142, 1080, 1195, 1210, 1180, 1240, 1200, 1260];
const REV_MAX = Math.max(...REV);

function useCounter(target: number, duration = 1200) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || target === 0) return;
    let start: number | null = null;
    const step = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.floor(ease * target).toLocaleString();
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration]);
  return ref;
}

function KpiCard({ item, index }: { item: typeof KPI[0]; index: number }) {
  const countRef = useCounter(item.value, 900 + index * 100);
  const Icon = item.icon;
  return (
    <motion.div className="bg-[#131313] border border-[#232323] rounded-2xl p-5 hover:border-[#333] transition-colors group"
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-[#6b7280] uppercase tracking-wide font-medium">{item.label}</span>
        <div className="w-8 h-8 rounded-lg bg-[#1a1c1e] flex items-center justify-center group-hover:scale-110 transition-transform">
          <Icon className="w-4 h-4" style={{ color: item.color }} />
        </div>
      </div>
      <p className="font-heading text-2xl font-bold text-white">
        {item.value > 0 ? <span ref={countRef}>0</span> : item.formatted}
      </p>
    </motion.div>
  );
}

export default function AdminDashboardClient() {
  return (
    <div className="min-h-screen bg-[#0d0e10] flex">
      <div className="fixed left-4 top-4 bottom-4 z-20 hidden lg:block">
        <AdminSidebar active="dashboard" />
      </div>

      <main className="flex-1 lg:pl-[100px] p-6 lg:p-8">
        {/* Header */}
        <motion.div className="mb-8" initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}>
          <p className="text-xs font-semibold text-[#00C853] uppercase tracking-widest mb-1">ADMIN PANEL</p>
          <h1 className="font-heading text-3xl font-bold text-white">Good Morning, Admin</h1>
          <p className="text-[#6b7280] text-sm mt-1">Comprehensive overview of your property ecosystem&apos;s performance.</p>
        </motion.div>

        {/* KPI Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
          {KPI.map((k, i) => <KpiCard key={k.label} item={k} index={i} />)}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Chart */}
          <motion.div className="lg:col-span-2 bg-[#131313] border border-[#232323] rounded-2xl p-6"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}>
            <div className="flex items-center justify-between mb-1">
              <div>
                <h2 className="font-heading text-lg font-semibold text-white">Platform Analytics</h2>
                <p className="text-xs text-[#6b7280]">Revenue growth trends across all property portfolios</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-[#6b7280]">Nov 22</p>
                <p className="text-sm font-semibold text-[#00C853]">$1,142,000</p>
              </div>
            </div>
            {/* Bar chart */}
            <div className="flex items-end gap-1.5 h-36 mt-5">
              {REV.map((v, i) => (
                <motion.div key={MONTHS[i]} className="flex-1 flex flex-col items-center gap-1">
                  <motion.div className="w-full rounded-t-md bg-gradient-to-t from-[#00C853]/60 to-[#00C853]"
                    style={{ maxWidth: 32 }}
                    initial={{ height: 0 }} animate={{ height: `${(v / REV_MAX) * 100}%` }}
                    transition={{ delay: 0.4 + i * 0.04, duration: 0.5, ease: [0.23, 1, 0.32, 1] }} />
                  <span className="text-[9px] text-[#4a5568]">{MONTHS[i]}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Live Activity */}
          <motion.div className="bg-[#131313] border border-[#232323] rounded-2xl p-5"
            initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}>
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-4 h-4 text-[#00C853]" />
              <h2 className="font-heading text-base font-semibold text-white">Live Activity</h2>
              <span className="ml-auto w-2 h-2 rounded-full bg-[#00C853] animate-pulse" />
            </div>
            <div className="space-y-3">
              {ACTIVITY.map((ev, i) => (
                <motion.div key={i} className="flex gap-3"
                  initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.45 + i * 0.06, duration: 0.3 }}>
                  <div className="flex flex-col items-center pt-1">
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${ev.dot}`} />
                    {i < ACTIVITY.length - 1 && <div className="w-px flex-1 bg-[#1f1f1f] mt-1" />}
                  </div>
                  <div className="pb-3">
                    <p className="text-xs text-white leading-snug">{ev.msg}</p>
                    <p className="text-[10px] text-[#4a5568] mt-0.5">{ev.when} • {ev.category}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Asset Distribution */}
          <motion.div className="lg:col-span-3 bg-[#131313] border border-[#232323] rounded-2xl p-6"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#00C853]" />
                <h2 className="font-heading text-base font-semibold text-white">Asset Distribution</h2>
              </div>
              <button className="flex items-center gap-1.5 text-xs text-[#00C853] hover:text-[#00ff66] transition-colors font-medium">
                <Plus className="w-3.5 h-3.5" /> Enroll New Asset
              </button>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              {ASSETS.map((a, i) => (
                <motion.div key={a.name} className="bg-[#1a1c1e] rounded-xl p-4"
                  initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.55 + i * 0.08, duration: 0.35 }}>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: a.color + "20" }}>
                      <Building2 className="w-4 h-4" style={{ color: a.color }} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white leading-tight">{a.name}</p>
                      <p className="text-xs text-[#6b7280]">{a.detail}</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-[#6b7280]">Occupancy</span>
                      <span className="font-semibold" style={{ color: a.color }}>{a.occ}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-[#232323] overflow-hidden">
                      <motion.div className="h-full rounded-full"
                        style={{ backgroundColor: a.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${a.occ}%` }}
                        transition={{ delay: 0.6 + i * 0.08, duration: 0.6, ease: [0.23, 1, 0.32, 1] }} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.p className="text-center text-[10px] text-[#2a2a2a] mt-8 tracking-widest"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
          © 2024 OWNER PORTAL TECHNOLOGIES • SECURE ADMIN CHANNEL v4.2.1
        </motion.p>
      </main>
    </div>
  );
}
