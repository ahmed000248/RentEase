"use client";

import Link from "next/link";
import {
  Home,
  Building2,
  MessageSquare,
  BarChart3,
  Calendar,
  Settings,
} from "lucide-react";

interface NavItem {
  icon: typeof Home;
  label: string;
  href: string;
}

const NAV_ITEMS: NavItem[] = [
  { icon: Home, label: "Dashboard", href: "/owner/dashboard" },
  { icon: Building2, label: "Listings", href: "/owner/listings" },
  { icon: MessageSquare, label: "Messages", href: "/owner/messages" },
  { icon: BarChart3, label: "Analytics", href: "/owner/analytics" },
  { icon: Calendar, label: "Calendar", href: "/owner/calendar" },
  { icon: Settings, label: "Settings", href: "/owner/settings" },
];

interface Props {
  active: "dashboard" | "listings" | "messages" | "analytics" | "calendar" | "settings";
}

export default function OwnerSidebar({ active }: Props) {
  return (
    <div className="flex-shrink-0 lg:w-[76px] w-full bg-[#131313] border border-[#232323] rounded-[22px] flex lg:flex-col items-center justify-between lg:justify-start px-3 lg:px-0 py-3 lg:py-5 gap-2">
      <div className="w-[38px] h-[38px] rounded-[10px] bg-brand-green flex items-center justify-center font-heading font-bold text-[#0c0c0c] text-base lg:mb-4">
        R
      </div>

      <div className="flex lg:flex-col items-center gap-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = item.label.toLowerCase() === active;
          return (
            <Link
              key={item.label}
              href={item.href}
              aria-label={item.label}
              title={item.label}
              className={`w-11 h-11 rounded-xl flex items-center justify-center transition-colors cursor-pointer ${
                isActive
                  ? "bg-brand-green text-[#0c0c0c]"
                  : "text-[#7a7a7a] hover:bg-[#1c1c1c] hover:text-[#e8e8e8]"
              }`}
            >
              <Icon className="w-[18px] h-[18px]" />
            </Link>
          );
        })}
      </div>

      <div className="hidden lg:block lg:flex-1" />
    </div>
  );
}
