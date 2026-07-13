"use client";

import Link from "next/link";
import { LayoutDashboard, ListFilter, Shield, Settings } from "lucide-react";

interface NavItem {
  icon: typeof LayoutDashboard;
  label: string;
  href: string;
  key: string;
}

const NAV_ITEMS: NavItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin/dashboard", key: "dashboard" },
  { icon: ListFilter, label: "Listings", href: "/admin/listings", key: "listings" },
  { icon: Shield, label: "Moderation", href: "/admin/moderation", key: "moderation" },
  { icon: Settings, label: "Settings", href: "/admin/settings", key: "settings" },
];

interface Props {
  active: "dashboard" | "listings" | "moderation" | "settings";
}

export default function AdminSidebar({ active }: Props) {
  return (
    <div className="flex-shrink-0 lg:w-[76px] w-full bg-[#131313] border border-[#232323] rounded-[22px] flex lg:flex-col items-center justify-between lg:justify-start px-3 lg:px-0 py-3 lg:py-5 gap-2">
      <div className="w-[38px] h-[38px] rounded-[10px] bg-[#ef4444] flex items-center justify-center font-heading font-bold text-white text-base lg:mb-4">
        A
      </div>

      <div className="flex lg:flex-col items-center gap-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = item.key === active;
          return (
            <Link
              key={item.key}
              href={item.href}
              aria-label={item.label}
              title={item.label}
              className={`w-11 h-11 rounded-xl flex items-center justify-center transition-colors cursor-pointer ${
                isActive
                  ? "bg-[#ef4444] text-white"
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
