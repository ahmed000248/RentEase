"use client";

import { useEffect, useRef } from "react";
import {
  TrendingUp,
  Home,
  Eye,
  DollarSign,
  BarChart2,
  MapPin,
  ArrowUp,
} from "lucide-react";
import { motion } from "framer-motion";
import OwnerSidebar from "./OwnerSidebar";

// ─── Types ────────────────────────────────────────────────────────────────────

interface KpiCard {
  label: string;
  value: string;
  raw: number;
  prefix?: string;
  suffix?: string;
  icon: typeof TrendingUp;
  delta?: string;
}

interface TopProperty {
  name: string;
  location: string;
  views: number;
  change: number;
}

interface YieldItem {
  day: string;
  amount: number;
  pct: number;
}

// ─── Fake spark data (6 months) ───────────────────────────────────────────────

const SPARK_MONTHS = ["Feb", "Mar", "Apr", "May", "Jun", "Jul"];
const SPARK_VALS = [980, 1420, 1842, 1650, 2100, 2340];
const SPARK_MAX = Math.max(...SPARK_VALS);

const TOP_PROPERTIES: TopProperty[] = [
  { name: "Modern Apartment", location: "Downtown, City", views: 1245, change: 12 },
  { name: "Luxury Condo", location: "Uptown, City", views: 987, change: 8 },
  { name: "Cozy Studio", location: "Midtown, City", views: 815, change: -3 },
  { name: "Family House", location: "Suburbs, City", views: 342, change: 5 },
];

const YIELD_ITEMS: YieldItem[] = [
  { day: "Mon", amount: 3200, pct: 68 },
  { day: "Tue", amount: 4100, pct: 82 },
  { day: "Wed", amount: 2900, pct: 58 },
  { day: "Thu", amount: 4800, pct: 96 },
  { day: "Fri", amount: 4400, pct: 88 },
  { day: "Sat", amount: 5100, pct: 100 },
  { day: "Sun", amount: 3600, pct: 72 },
];

const KPI_CARDS: KpiCard[] = [
  { label: "Monthly Revenue", value: "$24,580", raw: 24580, prefix: "$", icon: DollarSign, delta: "+12%" },
  { label: "Occupancy Rate", value: "78%", raw: 78, suffix: "%", icon: Home, delta: "+3%" },
  { label: "Total Inquiries", value: "156", raw: 156, icon: TrendingUp, delta: "+18%" },
  { label: "Total Views", value: "2,847", raw: 2847, icon: Eye, delta: "+24%" },
];

// ─── Mini bar chart for yield ─────────────────────────────────────────────────

function YieldBar({ item, delay }: { item: YieldItem; delay: number }) {
  return (
    <motion.div
      className="flex flex-col items-center gap-1"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
    >
      <span className="text-[10px] text-[#6b7280] font-medium">
        ${(item.amount / 1000).toFixed(1)}k
      </span>
      <div className="relative w-8 h-24 rounded-full bg-[#1a1c1e] overflow-hidden flex items-end">
        <motion.div
          className="w-full bg-gradient-to-t from-[#00C853] to-[#00ff66] rounded-full"
          initial={{ height: 0 }}
          animate={{ height: `${item.pct}%` }}
          transition={{ delay: delay + 0.2, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        />
      </div>
      <span className="text-[10px] text-[#4a5568] font-medium">{item.day}</span>
    </motion.div>
  );
}

// ─── Sparkline SVG ────────────────────────────────────────────────────────────

function Sparkline() {
  const W = 600;
  const H = 120;
  const pts = SPARK_VALS.map((v, i) => ({
    x: (i / (SPARK_VALS.length - 1)) * W,
    y: H - (v / SPARK_MAX) * H,
  }));
  const path = pts
    .map((p, i) => (i === 0 ? `M ${p.x},${p.y}` : `L ${p.x},${p.y}`))
    .join(" ");
  const area = `${path} L ${W},${H} L 0,${H} Z`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-[120px]" preserveAspectRatio="none">
      <defs>
        <linearGradient id="spark-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#00C853" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#00C853" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#spark-grad)" />
      <path d={path} fill="none" stroke="#00C853" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {/* Active point */}
      <circle cx={pts[2].x} cy={pts[2].y} r="5" fill="#00C853" />
      <circle cx={pts[2].x} cy={pts[2].y} r="9" fill="#00C853" fillOpacity="0.2" />
    </svg>
  );
}

// ─── Counter hook ─────────────────────────────────────────────────────────────

function useCounter(target: number, duration = 1200) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let start: number | null = null;
    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(ease * target).toLocaleString();
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration]);
  return ref;
}

function KpiCardComponent({ card, index }: { card: KpiCard; index: number }) {
  const counterRef = useCounter(card.raw, 1000 + index * 150);
  const Icon = card.icon;

  return (
    <motion.div
      className="bg-[#131313] border border-[#232323] rounded-2xl p-5 flex flex-col gap-3 hover:border-[#00C853]/30 transition-colors group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs text-[#6b7280] font-medium tracking-wide uppercase">
          {card.label}
        </span>
        <div className="w-8 h-8 rounded-lg bg-[#1a1c1e] flex items-center justify-center group-hover:bg-[#00C853]/10 transition-colors">
          <Icon className="w-4 h-4 text-[#00C853]" />
        </div>
      </div>
      <div className="flex items-end gap-2">
        <span className="font-heading text-3xl font-bold text-white">
          {card.prefix}
          <span ref={counterRef}>0</span>
          {card.suffix}
        </span>
        {card.delta && (
          <span className="text-xs text-[#00C853] font-medium mb-1 flex items-center gap-0.5">
            <ArrowUp className="w-3 h-3" />
            {card.delta}
          </span>
        )}
      </div>
    </motion.div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function OwnerAnalyticsClient() {
  return (
    <div className="min-h-screen bg-[#0d0e10] flex">
      {/* Sidebar */}
      <div className="fixed left-4 top-4 bottom-4 z-20 hidden lg:block">
        <OwnerSidebar active="analytics" />
      </div>

      {/* Main content */}
      <main className="flex-1 lg:pl-[100px] p-6 lg:p-8">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
        >
          <h1 className="font-heading text-3xl font-bold text-white">Analytics</h1>
          <p className="text-[#6b7280] text-sm mt-1">Overview of your portfolio performance</p>
        </motion.div>

        {/* Demo Data Banner */}
        <motion.div
          className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 mb-6 flex items-center gap-3"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <BarChart2 className="w-5 h-5 text-amber-400 flex-shrink-0" />
          <div className="text-xs">
            <p className="font-semibold text-amber-300">Demo Analytics Data</p>
            <p className="text-amber-200/70 mt-0.5">
              These occupancy and revenue figures are simulated for demonstration. Connect a live booking system to view real earnings.
            </p>
          </div>
        </motion.div>

        {/* KPI Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {KPI_CARDS.map((card, i) => (
            <KpiCardComponent key={card.label} card={card} index={i} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Views Over Time chart (2/3 width) */}
          <motion.div
            className="lg:col-span-2 bg-[#131313] border border-[#232323] rounded-2xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
          >
            <div className="flex items-center justify-between mb-1">
              <div>
                <h2 className="font-heading text-lg font-semibold text-white">Views Over Time</h2>
                <p className="text-xs text-[#6b7280] mt-0.5">Performance metrics for the last 6 months</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-[#6b7280]">Apr 24</p>
                <p className="text-sm font-semibold text-[#00C853]">1,842 Views</p>
              </div>
            </div>

            <div className="mt-4">
              <Sparkline />
            </div>

            {/* Month labels */}
            <div className="flex justify-between mt-2">
              {SPARK_MONTHS.map((m) => (
                <span key={m} className="text-[10px] text-[#4a5568]">{m}</span>
              ))}
            </div>
          </motion.div>

          {/* Top Performing */}
          <motion.div
            className="bg-[#131313] border border-[#232323] rounded-2xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
          >
            <h2 className="font-heading text-lg font-semibold text-white mb-4">Top Performing</h2>
            <div className="space-y-3">
              {TOP_PROPERTIES.map((p, i) => (
                <motion.div
                  key={p.name}
                  className="flex items-center gap-3 group"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.07, duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
                >
                  <div className="w-9 h-9 rounded-xl bg-[#1a1c1e] flex items-center justify-center text-[#00C853] font-bold text-xs flex-shrink-0">
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{p.name}</p>
                    <p className="text-xs text-[#4a5568] flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {p.location}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-semibold text-white">{p.views.toLocaleString()}</p>
                    <p className={`text-xs ${p.change >= 0 ? "text-[#00C853]" : "text-[#ef4444]"}`}>
                      {p.change >= 0 ? "+" : ""}{p.change}%
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Geographic Distribution */}
          <motion.div
            className="bg-[#131313] border border-[#232323] rounded-2xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
          >
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-4 h-4 text-[#00C853]" />
              <h2 className="font-heading text-lg font-semibold text-white">Geographic Distribution</h2>
            </div>
            <div className="space-y-3">
              {[
                { city: "Karachi", pct: 42 },
                { city: "Lahore", pct: 31 },
                { city: "Islamabad", pct: 17 },
                { city: "Other", pct: 10 },
              ].map((item, i) => (
                <div key={item.city} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#a0aec0]">{item.city}</span>
                    <span className="text-[#00C853] font-medium">{item.pct}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-[#1a1c1e] overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-[#00C853] to-[#00ff66]"
                      initial={{ width: 0 }}
                      animate={{ width: `${item.pct}%` }}
                      transition={{ delay: 0.5 + i * 0.08, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Weekly Yield Report */}
          <motion.div
            className="lg:col-span-2 bg-[#131313] border border-[#232323] rounded-2xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
          >
            <div className="flex items-center gap-2 mb-6">
              <BarChart2 className="w-4 h-4 text-[#00C853]" />
              <h2 className="font-heading text-lg font-semibold text-white">Weekly Yield Report</h2>
            </div>
            <div className="flex items-end justify-between gap-2">
              {YIELD_ITEMS.map((item, i) => (
                <YieldBar key={item.day} item={item} delay={0.5 + i * 0.06} />
              ))}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
