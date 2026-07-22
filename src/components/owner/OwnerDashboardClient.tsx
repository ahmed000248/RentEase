"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import OwnerSidebar from "./OwnerSidebar";
import { AnimatePresence, animate, motion } from "framer-motion";
import {
  Bell,
  Search,
  Plus,
  MoreVertical,
  Home,
  Building2,
  MessageSquare,
  BarChart3,
  Calendar,
  Settings,
  MapPin,
  Store,
  BedDouble,
  Hotel,
} from "lucide-react";
import type { PropertyDoc, PropertyType } from "@/lib/firebase/types";
import type { InquiryWithTenant, PropertyOccupancy, RevenuePoint } from "@/lib/data/owner";
import { formatRelativeTime } from "@/lib/format";

const EASE = [0.16, 1, 0.3, 1] as const;

const TYPE_ICON: Record<PropertyType, typeof Home> = {
  house: Home,
  apartment: Building2,
  room: BedDouble,
  hostel: Hotel,
  shop: Store,
  villa: Home,
  penthouse: Building2,
};

interface NavItem {
  icon: typeof Home;
  label: string;
  href?: string;
}

const NAV_ITEMS: NavItem[] = [
  { icon: Home, label: "Dashboard", href: "/owner/dashboard" },
  { icon: Building2, label: "Listings" },
  { icon: MessageSquare, label: "Messages" },
  { icon: BarChart3, label: "Analytics" },
  { icon: Calendar, label: "Calendar" },
  { icon: Settings, label: "Settings" },
];

function buildSmoothPath(points: { x: number; y: number }[], close: boolean): string {
  if (!points.length) return "";
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];
    const mx = (p0.x + p1.x) / 2;
    d += ` Q ${p0.x} ${p0.y} ${mx} ${(p0.y + p1.y) / 2}`;
  }
  const last = points[points.length - 1];
  d += ` T ${last.x} ${last.y}`;
  if (close) d += ` L ${last.x} 150 L ${points[0].x} 150 Z`;
  return d;
}

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase() || "?";
}

function CountUp({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const controls = animate(0, value, {
      duration: 1.2,
      delay: 0.35,
      ease: EASE,
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [value]);
  return (
    <>
      {display}
      {suffix}
    </>
  );
}

interface Props {
  ownerName: string;
  properties: PropertyDoc[];
  occupancyByProperty: PropertyOccupancy[];
  overallOccupancyPct: number;
  monthly: RevenuePoint[];
  yearly: RevenuePoint[];
  monthlyTarget: string;
  yearlyTarget: string;
  inquiries: InquiryWithTenant[];
}

export default function OwnerDashboardClient({
  ownerName,
  properties,
  occupancyByProperty,
  overallOccupancyPct,
  monthly,
  yearly,
  monthlyTarget,
  yearlyTarget,
  inquiries,
}: Props) {
  const [period, setPeriod] = useState<"Monthly" | "Yearly">("Monthly");
  const [activeIdx, setActiveIdx] = useState(Math.min(3, monthly.length - 1));
  const [inquiryTab, setInquiryTab] = useState<"New" | "All">("New");

  const dataset = period === "Monthly" ? monthly : yearly;
  const target = period === "Monthly" ? monthlyTarget : yearlyTarget;
  const idx = Math.min(activeIdx, dataset.length - 1);

  const chart = useMemo(() => {
    const w = 560;
    const h = 150;
    const maxV = Math.max(...dataset.map((d) => d.revenue), 1) * 1.15;
    const step = dataset.length > 1 ? w / (dataset.length - 1) : 0;
    const points = dataset.map((d, i) => ({
      x: i * step,
      y: h - (d.revenue / maxV) * (h - 20) - 10,
    }));
    return {
      linePath: buildSmoothPath(points, false),
      areaPath: buildSmoothPath(points, true),
      points,
    };
  }, [dataset]);

  const active = dataset[idx];
  const activePoint = chart.points[idx] ?? { x: 0, y: 150 };

  const sparkline = useMemo(() => {
    const w = 220;
    const h = 46;
    const values = monthly.map((m) => m.revenue);
    const maxV = Math.max(...values, 1);
    const minV = Math.min(...values, 0);
    const range = Math.max(maxV - minV, 1);
    const step = values.length > 1 ? w / (values.length - 1) : 0;
    const points = values.map((v, i) => ({
      x: i * step,
      y: h - ((v - minV) / range) * (h - 8) - 4,
    }));
    return buildSmoothPath(points, false);
  }, [monthly]);

  const visibleInquiries = inquiryTab === "New" ? inquiries.filter((i) => i.status === "sent") : inquiries;

  return (
    <div className="w-full min-h-screen bg-[#060606] p-4 sm:p-7 flex justify-center font-dashboard">
      <div className="w-full max-w-[1480px] flex flex-col lg:flex-row gap-5 bg-[#0c0c0c] border border-[#1e1e1e] rounded-[28px] p-4 sm:p-5 shadow-[0_40px_100px_rgba(0,0,0,0.55)]">
        <OwnerSidebar active="dashboard" />

        {/* MAIN */}
        <div className="flex-1 min-w-0 flex flex-col gap-4">
          {/* TOP BAR */}
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <div className="text-xs text-brand-green tracking-[0.08em] uppercase font-semibold mb-1">
                Owner Portal
              </div>
              <div className="font-heading text-2xl sm:text-[26px] font-bold text-[#f4f4ef]">Dashboard</div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="hidden sm:flex items-center gap-2 bg-[#161616] border border-[#262626] rounded-xl px-4 py-2.5 w-[260px]">
                <Search className="w-4 h-4 text-[#666] flex-shrink-0" />
                <span className="text-[#666] text-[13px]">Search properties, tenants…</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-[#161616] border border-[#262626] flex items-center justify-center relative cursor-pointer hover:border-[#3a3a3a] transition-colors">
                <Bell className="w-[17px] h-[17px] text-[#aaa]" />
                {inquiries.some((i) => i.status === "sent") && (
                  <div className="absolute top-2 right-2.5 w-[7px] h-[7px] rounded-full bg-brand-green" />
                )}
              </div>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-green to-[#03954a] flex items-center justify-center font-heading font-bold text-[#0c0c0c] text-sm cursor-pointer">
                {initialsOf(ownerName)}
              </div>
            </div>
          </div>

          {/* ROW 1: chart + stat cards */}
          <div className="flex flex-col md:flex-row gap-4 items-stretch">
            {/* Revenue chart */}
            <div className="flex-[1.55] bg-[#141410] border border-[#232323] rounded-[20px] p-5 sm:p-6 relative overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-[11px] text-[#7a7a7a] uppercase tracking-[0.06em] mb-0.5">Overview</div>
                  <div className="font-heading text-lg font-bold text-[#f4f4ef]">Revenue</div>
                </div>
                <div className="flex bg-[#1c1c1c] border border-[#2a2a2a] rounded-[10px] p-[3px]">
                  {(["Monthly", "Yearly"] as const).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => {
                        setPeriod(p);
                        setActiveIdx(3);
                      }}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                        period === p ? "bg-brand-green text-[#0c0c0c]" : "text-[#8c8c8c] hover:text-[#e8e8e8]"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative h-[150px] mb-2">
                <svg width="100%" height="150" viewBox="0 0 560 150" preserveAspectRatio="none" style={{ overflow: "visible" }}>
                  <defs>
                    <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#00C853" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="#00C853" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <motion.path
                    key={`area-${period}`}
                    d={chart.areaPath}
                    fill="url(#areaFill)"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.9, delay: 0.3, ease: EASE }}
                  />
                  <motion.path
                    key={`line-${period}`}
                    d={chart.linePath}
                    fill="none"
                    stroke="#00C853"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.1, ease: EASE }}
                  />
                  <circle cx={activePoint.x} cy={activePoint.y} r="5.5" fill="#0c0c0c" stroke="#00C853" strokeWidth="3" />
                </svg>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${period}-${idx}`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ duration: 0.35, ease: "backOut" }}
                    className="absolute font-heading text-xs font-bold text-[#0c0c0c] bg-brand-green rounded-[10px] px-3 py-1.5 whitespace-nowrap"
                    style={{
                      left: `${(activePoint.x / 560) * 100}%`,
                      top: activePoint.y,
                      transform: "translate(-50%, -135%)",
                    }}
                  >
                    ${(active?.revenue ?? 0).toLocaleString("en-US")}
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="flex justify-between mb-5 overflow-x-auto no-scrollbar">
                {dataset.map((d, i) => (
                  <button
                    key={d.label}
                    type="button"
                    onClick={() => setActiveIdx(i)}
                    className={`text-xs px-2.5 py-1 rounded-[7px] font-medium transition-colors flex-shrink-0 ${
                      i === idx ? "bg-brand-green text-[#0c0c0c] font-bold" : "text-[#8c8c8c] hover:text-[#e8e8e8]"
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>

              <div className="flex border-t border-[#232323] pt-4">
                <div className="flex-1">
                  <div className="text-[11px] text-[#7a7a7a] mb-1.5">Total Revenue · {period}</div>
                  <div className="font-heading text-xl font-bold text-[#f4f4ef]">
                    ${(active?.revenue ?? 0).toLocaleString("en-US")}
                  </div>
                </div>
                <div className="flex-1 border-l border-[#232323] pl-5">
                  <div className="text-[11px] text-[#7a7a7a] mb-1.5">Bookings · {period}</div>
                  <div className="font-heading text-xl font-bold text-[#f4f4ef]">{active?.bookings ?? 0}</div>
                </div>
                <div className="flex-1 border-l border-[#232323] pl-5">
                  <div className="text-[11px] text-[#7a7a7a] mb-1.5">Target</div>
                  <div className="font-heading text-xl font-bold text-brand-green">{target}</div>
                </div>
              </div>
            </div>

            {/* Side stat cards */}
            <div className="flex-1 flex flex-col gap-4">
              <Link
                href="/owner/properties/new"
                className="flex-1 bg-gradient-to-br from-[#1b2a0c] to-[#0f1608] border border-[#2a3d15] rounded-2xl p-4.5 flex items-center gap-3 cursor-pointer hover:border-brand-green transition-colors"
              >
                <div className="w-[42px] h-[42px] rounded-xl bg-brand-green flex items-center justify-center flex-shrink-0">
                  <Plus className="w-5 h-5 text-[#0c0c0c]" strokeWidth={2.4} />
                </div>
                <div className="min-w-0">
                  <div className="font-heading font-bold text-sm text-[#f4f4ef]">Add New Listing</div>
                  <div className="text-xs text-[#9db27a]">List a property in minutes</div>
                </div>
              </Link>

              <div className="flex-[1.6] bg-[#161b0e] border border-[#262f14] rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div className="text-[13px] font-semibold text-[#cdeaa0]">Occupancy Rate</div>
                  <div className="w-[30px] h-[30px] rounded-full bg-brand-green flex items-center justify-center">
                    <BarChart3 className="w-3.5 h-3.5 text-[#0c0c0c]" strokeWidth={2.4} />
                  </div>
                </div>
                <svg width="100%" height="46" viewBox="0 0 220 46" preserveAspectRatio="none" className="my-2.5">
                  <path d={sparkline} fill="none" stroke="#00C853" strokeWidth="2.5" strokeLinecap="round" opacity="0.85" />
                </svg>
                <div>
                  <div className="text-[11px] text-[#8fae6c] mb-0.5">Across {properties.length} propert{properties.length === 1 ? "y" : "ies"}</div>
                  <div className="font-heading text-[28px] sm:text-[30px] font-bold text-[#f4f4ef]">
                    <CountUp value={overallOccupancyPct} suffix="%" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ROW 2: property occupancy cards */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
          >
            {occupancyByProperty.length === 0 ? (
              <div className="sm:col-span-2 xl:col-span-3 bg-[#141414] border border-[#232323] rounded-2xl p-10 text-center text-[#7a7a7a] text-sm">
                You haven&apos;t listed any properties yet.
              </div>
            ) : (
              occupancyByProperty.map(({ property, occupancyPct, bookedNights, totalNights, tag }) => {
                const Icon = TYPE_ICON[property.type] ?? Home;
                return (
                  <motion.div
                    key={property.id}
                    variants={{
                      hidden: { opacity: 0, y: 16, scale: 0.96 },
                      visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: EASE } },
                    }}
                    className="bg-[#141414] border border-[#232323] rounded-2xl p-4.5 flex flex-col gap-3.5 cursor-pointer hover:border-[#3a3a3a] transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="w-[42px] h-[42px] rounded-xl bg-[#2a3d15] flex items-center justify-center">
                        <Icon className="w-5 h-5 text-brand-green" />
                      </div>
                      <MoreVertical className="w-[18px] h-[18px] text-[#666]" />
                    </div>
                    <div>
                      <div className="font-heading font-bold text-[15px] text-[#f4f4ef] mb-0.5 line-clamp-1">
                        {property.title}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-[#7a7a7a]">
                        <MapPin className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{property.location}, {property.city}</span>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-[11px] text-[#8c8c8c] mb-1.5">
                        <span>Occupancy</span>
                        <span className="text-[#f4f4ef] font-semibold">{occupancyPct}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-[#242424] overflow-hidden">
                        <motion.div
                          className="h-full rounded-full bg-brand-green"
                          initial={{ width: "0%" }}
                          animate={{ width: `${occupancyPct}%` }}
                          transition={{ duration: 1, ease: EASE, delay: 0.3 }}
                        />
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-[#7a7a7a]">
                        {bookedNights} / {totalNights} nights
                      </span>
                      <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[rgba(0,200,83,0.14)] text-brand-green">
                        {tag}
                      </span>
                    </div>
                  </motion.div>
                );
              })
            )}
          </motion.div>
        </div>

        {/* RIGHT PANEL */}
        <div className="lg:w-[300px] w-full flex-shrink-0 flex flex-col gap-4">
          <div className="bg-[#141414] border border-[#232323] rounded-[20px] p-4.5 flex-1 flex flex-col min-h-0">
            <div className="flex items-center justify-between mb-3.5">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-[17px] h-[17px] text-brand-green" />
                <span className="font-heading font-bold text-[15px] text-[#f4f4ef]">Inquiries</span>
              </div>
              <span className="text-xs text-brand-green font-semibold cursor-pointer">View All</span>
            </div>

            <div className="flex bg-[#1c1c1c] border border-[#2a2a2a] rounded-[10px] p-[3px] mb-3.5">
              {(["New", "All"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setInquiryTab(t)}
                  className={`flex-1 text-center py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    inquiryTab === t ? "bg-brand-green text-[#0c0c0c]" : "text-[#8c8c8c] hover:text-[#e8e8e8]"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <motion.div
              key={inquiryTab}
              initial="hidden"
              animate="visible"
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }}
              className="flex flex-col gap-0.5 overflow-y-auto max-h-[360px]"
            >
              {visibleInquiries.length === 0 ? (
                <p className="text-xs text-[#7a7a7a] py-6 text-center">No inquiries here.</p>
              ) : (
                visibleInquiries.map((inq) => {
                  const name = inq.tenant?.name ?? "Unknown Tenant";
                  return (
                    <motion.div
                      key={inq.id}
                      variants={{
                        hidden: { opacity: 0, x: 20 },
                        visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } },
                      }}
                      className="flex items-start gap-2.5 p-2.5 rounded-[10px] cursor-pointer hover:bg-[#1a1a1a] transition-colors"
                    >
                      <div className="w-[34px] h-[34px] rounded-full bg-[#6b7a55] flex items-center justify-center text-xs font-bold text-[#0c0c0c] flex-shrink-0 font-heading">
                        {initialsOf(name)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1.5">
                          <span className="text-[13px] font-semibold text-[#f4f4ef] truncate">{name}</span>
                          <span className="text-[10px] text-[#666] flex-shrink-0">
                            {formatRelativeTime(inq.createdAt)}
                          </span>
                        </div>
                        <div className="text-[11px] text-[#7a7a7a] truncate my-0.5">{inq.propertyTitle}</div>
                        <div className="text-xs text-[#9a9a9a] truncate">{inq.message}</div>
                      </div>
                      {inq.status === "sent" && (
                        <div className="w-2 h-2 rounded-full bg-brand-green mt-1 flex-shrink-0" />
                      )}
                    </motion.div>
                  );
                })
              )}
            </motion.div>
          </div>

          <div className="bg-[#141414] border border-[#232323] rounded-[20px] p-4 pb-0 overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand-green" />
                <span className="font-heading font-bold text-sm text-[#f4f4ef]">Live Map</span>
              </div>
              <span className="text-xs text-brand-green font-semibold cursor-pointer">View</span>
            </div>
            <div
              className="h-[130px] -mx-4 relative overflow-hidden"
              style={{ background: "radial-gradient(circle at 30% 30%, #1c2b0f, #0c0c0c 70%)" }}
            >
              <svg width="100%" height="100%" viewBox="0 0 300 130" preserveAspectRatio="none" className="absolute inset-0 opacity-50">
                <path d="M0 40 L300 20" stroke="#2a2a2a" strokeWidth="1" />
                <path d="M0 80 L300 95" stroke="#2a2a2a" strokeWidth="1" />
                <path d="M60 0 L40 130" stroke="#2a2a2a" strokeWidth="1" />
                <path d="M220 0 L240 130" stroke="#2a2a2a" strokeWidth="1" />
              </svg>
              <motion.div
                animate={{ scale: [1, 1.18, 1] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute left-[38%] top-[36%] w-[22px] h-[22px] rounded-full bg-brand-green flex items-center justify-center"
                style={{ boxShadow: "0 0 0 6px rgba(0,200,83,0.18)" }}
              >
                <MapPin className="w-2.5 h-2.5 text-[#0c0c0c]" fill="#0c0c0c" />
              </motion.div>
              <div className="absolute left-[65%] top-[58%] w-4 h-4 rounded-full bg-[#f4f4ef] opacity-85" />
              <div className="absolute left-[20%] top-[70%] w-4 h-4 rounded-full bg-[#f4f4ef] opacity-85" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
