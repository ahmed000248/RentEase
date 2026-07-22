"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Plus, Clock, Home, AlertCircle, Calendar as CalendarIcon } from "lucide-react";
import OwnerSidebar from "./OwnerSidebar";
import type { CalendarEvent } from "@/lib/data/owner";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function buildCalendar(year: number, month: number) {
  const first = new Date(year, month, 1).getDay();
  const days = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = Array(first).fill(null);
  for (let d = 1; d <= days; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

interface Props {
  initialEventsByDay: Record<string, CalendarEvent[]>;
  initialTodayEvents: CalendarEvent[];
  initialUpcomingEvents: CalendarEvent[];
}

export default function OwnerCalendarClient({
  initialEventsByDay,
  initialTodayEvents,
  initialUpcomingEvents,
}: Props) {
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const [selected, setSelected] = useState(today.getDate());
  const cells = buildCalendar(year, month);
  const monthName = new Date(year, month, 1).toLocaleString("default", { month: "long" });

  const prev = () => {
    if (month === 0) {
      setMonth(11);
      setYear((y) => y - 1);
    } else setMonth((m) => m - 1);
  };
  const next = () => {
    if (month === 11) {
      setMonth(0);
      setYear((y) => y + 1);
    } else setMonth((m) => m + 1);
  };

  return (
    <div className="min-h-screen bg-[#0d0e10] flex">
      <div className="fixed left-4 top-4 bottom-4 z-20 hidden lg:block">
        <OwnerSidebar active="calendar" />
      </div>

      <main className="flex-1 lg:pl-[100px] p-6 lg:p-8">
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-heading text-3xl font-bold text-white">Calendar</h1>
              <p className="text-[#6b7280] text-sm mt-1">Manage your property schedule and viewing inquiries</p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar grid */}
          <motion.div
            className="lg:col-span-2 bg-[#131313] border border-[#232323] rounded-2xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
          >
            {/* Month nav */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={prev}
                className="w-9 h-9 rounded-xl bg-[#1a1c1e] flex items-center justify-center text-[#6b7280] hover:text-white transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <h2 className="font-heading text-xl font-semibold text-white">
                {monthName} {year}
              </h2>
              <button
                onClick={next}
                className="w-9 h-9 rounded-xl bg-[#1a1c1e] flex items-center justify-center text-[#6b7280] hover:text-white transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 mb-2">
              {DAYS.map((d) => (
                <div key={d} className="text-center text-xs text-[#4a5568] font-semibold uppercase py-1">
                  {d}
                </div>
              ))}
            </div>

            {/* Cells */}
            <div className="grid grid-cols-7 gap-1">
              {cells.map((day, i) => {
                const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
                const isSelected = day === selected;
                const dateKey = day ? `${year}-${month}-${day}` : "";
                const evts = day ? initialEventsByDay[dateKey] : undefined;

                return (
                  <motion.button
                    key={i}
                    onClick={() => day && setSelected(day)}
                    disabled={!day}
                    className={`relative min-h-[52px] rounded-xl flex flex-col items-center justify-start pt-1.5 text-sm transition-colors ${
                      !day
                        ? "opacity-0 pointer-events-none"
                        : isToday
                        ? "bg-[#00C853] text-[#0d0d0d] font-bold"
                        : isSelected
                        ? "bg-[#1f2022] border border-[#00C853]/40 text-white"
                        : "hover:bg-[#1a1c1e] text-[#a0aec0]"
                    }`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: day ? 1 : 0, scale: 1 }}
                    transition={{ delay: i * 0.008, duration: 0.2 }}
                  >
                    {day}
                    {evts && evts.length > 0 && (
                      <div className="flex gap-0.5 mt-1 flex-wrap justify-center px-1">
                        {evts.map((e, j) => (
                          <span
                            key={j}
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: isToday ? "#0d0d0d" : e.color }}
                          />
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
            <motion.div
              className="bg-[#131313] border border-[#232323] rounded-2xl p-5"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15, duration: 0.4 }}
            >
              <h3 className="font-heading text-base font-semibold text-white mb-4">Today&apos;s Schedule</h3>
              {initialTodayEvents.length === 0 ? (
                <div className="py-6 text-center text-[#6b7280]">
                  <CalendarIcon className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  <p className="text-xs">No scheduled inquiries or events today.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {initialTodayEvents.map((ev, i) => (
                    <motion.div
                      key={i}
                      className="flex gap-3"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + i * 0.07, duration: 0.3 }}
                    >
                      <div className="w-1 self-stretch rounded-full" style={{ backgroundColor: ev.color }} />
                      <div className="flex-1 bg-[#1a1c1e] rounded-xl p-3">
                        <p className="text-xs text-[#6b7280] mb-0.5">{ev.sub}</p>
                        <p className="text-sm font-medium text-white">{ev.title}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Upcoming */}
            <motion.div
              className="bg-[#131313] border border-[#232323] rounded-2xl p-5"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25, duration: 0.4 }}
            >
              <h3 className="font-heading text-base font-semibold text-white mb-4">Upcoming Inquiries</h3>
              {initialUpcomingEvents.length === 0 ? (
                <div className="py-6 text-center text-[#6b7280]">
                  <Clock className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  <p className="text-xs">No upcoming inquiries scheduled this week.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {initialUpcomingEvents.map((ev, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: ev.color + "20" }}
                      >
                        <Home className="w-4 h-4" style={{ color: ev.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{ev.title}</p>
                        <p className="text-xs text-[#4a5568]">{ev.sub}</p>
                      </div>
                      <span className="text-xs text-[#6b7280] flex-shrink-0">
                        {ev.date.toLocaleDateString([], { month: "short", day: "numeric" })}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
