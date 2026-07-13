"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Plus, Clock, Home, AlertCircle } from "lucide-react";
import OwnerSidebar from "./OwnerSidebar";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function buildCalendar(year: number, month: number) {
  const first = new Date(year, month, 1).getDay();
  const days = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = Array(first).fill(null);
  for (let d = 1; d <= days; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

const EVENTS: Record<number, { label: string; color: string }[]> = {
  8: [{ label: "Contract Signing", color: "#00C853" }],
  15: [{ label: "Key Handoff", color: "#3b82f6" }],
  22: [{ label: "Rent Due", color: "#f59e0b" }],
  24: [{ label: "Follow-up Call", color: "#6366f1" }],
  28: [{ label: "HVAC Checkup", color: "#ef4444" }],
};

const TODAY_EVENTS = [
  { time: "10:00 AM", title: "Contract Signing", sub: "Penthouse Suite · David W.", icon: Home, color: "#00C853" },
  { time: "1:30 PM", title: "Follow-up Call", sub: "Regarding unit 3B repair", icon: Clock, color: "#6366f1" },
  { time: "4:00 PM", title: "Key Handoff", sub: "Modern Apartment · Unit 12", icon: Home, color: "#3b82f6" },
];

const UPCOMING = [
  { date: "Jul 22", title: "Rent Due Date", sub: "12 Active Listings", icon: AlertCircle, color: "#f59e0b" },
  { date: "Jul 28", title: "HVAC Checkup", sub: "Luxury Condo Complex", icon: AlertCircle, color: "#ef4444" },
  { date: "Jul 31", title: "Unit Inspection", sub: "Family House · Section A", icon: Home, color: "#3b82f6" },
];

export default function OwnerCalendarClient() {
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const [selected, setSelected] = useState(today.getDate());
  const cells = buildCalendar(year, month);
  const monthName = new Date(year, month, 1).toLocaleString("default", { month: "long" });

  const prev = () => { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); };
  const next = () => { if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1); };

  return (
    <div className="min-h-screen bg-[#0d0e10] flex">
      <div className="fixed left-4 top-4 bottom-4 z-20 hidden lg:block">
        <OwnerSidebar active="calendar" />
      </div>

      <main className="flex-1 lg:pl-[100px] p-6 lg:p-8">
        <motion.div className="mb-8" initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-heading text-3xl font-bold text-white">Calendar</h1>
              <p className="text-[#6b7280] text-sm mt-1">Manage your property schedule</p>
            </div>
            <button className="flex items-center gap-2 bg-[#00C853] text-[#0d0d0d] rounded-xl px-4 py-2.5 text-sm font-semibold hover:bg-[#00ff66] transition-colors">
              <Plus className="w-4 h-4" /> Add Event
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar grid */}
          <motion.div className="lg:col-span-2 bg-[#131313] border border-[#232323] rounded-2xl p-6"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}>
            {/* Month nav */}
            <div className="flex items-center justify-between mb-6">
              <button onClick={prev} className="w-9 h-9 rounded-xl bg-[#1a1c1e] flex items-center justify-center text-[#6b7280] hover:text-white transition-colors">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <h2 className="font-heading text-xl font-semibold text-white">{monthName} {year}</h2>
              <button onClick={next} className="w-9 h-9 rounded-xl bg-[#1a1c1e] flex items-center justify-center text-[#6b7280] hover:text-white transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 mb-2">
              {DAYS.map((d) => (
                <div key={d} className="text-center text-xs text-[#4a5568] font-semibold uppercase py-1">{d}</div>
              ))}
            </div>

            {/* Cells */}
            <div className="grid grid-cols-7 gap-1">
              {cells.map((day, i) => {
                const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
                const isSelected = day === selected;
                const evts = day ? EVENTS[day] : undefined;
                return (
                  <motion.button
                    key={i}
                    onClick={() => day && setSelected(day)}
                    disabled={!day}
                    className={`relative min-h-[52px] rounded-xl flex flex-col items-center justify-start pt-1.5 text-sm transition-colors ${
                      !day ? "opacity-0 pointer-events-none" :
                      isToday ? "bg-[#00C853] text-[#0d0d0d] font-bold" :
                      isSelected ? "bg-[#1f2022] border border-[#00C853]/40 text-white" :
                      "hover:bg-[#1a1c1e] text-[#a0aec0]"
                    }`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: day ? 1 : 0, scale: 1 }}
                    transition={{ delay: i * 0.008, duration: 0.2 }}
                  >
                    {day}
                    {evts && (
                      <div className="flex gap-0.5 mt-1 flex-wrap justify-center px-1">
                        {evts.map((e, j) => (
                          <span key={j} className="w-1 h-1 rounded-full" style={{ backgroundColor: isToday ? "#0d0d0d" : e.color }} />
                        ))}
                      </div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          {/* Right panels */}
          <div className="space-y-5">
            {/* Today */}
            <motion.div className="bg-[#131313] border border-[#232323] rounded-2xl p-5"
              initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}>
              <h3 className="font-heading text-base font-semibold text-white mb-4">Today&apos;s Schedule</h3>
              <div className="space-y-3">
                {TODAY_EVENTS.map((ev, i) => (
                  <motion.div key={ev.title} className="flex gap-3"
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + i * 0.07, duration: 0.3 }}>
                    <div className="w-1 self-stretch rounded-full" style={{ backgroundColor: ev.color }} />
                    <div className="flex-1 bg-[#1a1c1e] rounded-xl p-3">
                      <p className="text-xs text-[#6b7280] mb-0.5">{ev.time}</p>
                      <p className="text-sm font-medium text-white">{ev.title}</p>
                      <p className="text-xs text-[#4a5568] mt-0.5">{ev.sub}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Upcoming */}
            <motion.div className="bg-[#131313] border border-[#232323] rounded-2xl p-5"
              initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}>
              <h3 className="font-heading text-base font-semibold text-white mb-4">Upcoming Events</h3>
              <div className="space-y-3">
                {UPCOMING.map((ev, i) => {
                  const Icon = ev.icon;
                  return (
                    <div key={ev.title} className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: ev.color + "20" }}>
                        <Icon className="w-4 h-4" style={{ color: ev.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{ev.title}</p>
                        <p className="text-xs text-[#4a5568]">{ev.sub}</p>
                      </div>
                      <span className="text-xs text-[#6b7280] flex-shrink-0">{ev.date}</span>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Sync CTA */}
            <motion.div className="bg-[#131313] border border-[#00C853]/20 rounded-2xl p-5"
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}>
              <p className="text-xs font-semibold text-[#00C853] uppercase tracking-wide mb-1">QUICK ACTION</p>
              <p className="text-sm text-[#a0aec0] mb-3">Need to sync with your external calendar?</p>
              <button className="w-full bg-[#1a1c1e] border border-[#232323] text-white rounded-xl py-2.5 text-sm font-medium hover:border-[#00C853]/30 transition-colors">
                Connect Google Calendar
              </button>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
