"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { User, Bell, Shield, Camera, AlertTriangle, Save } from "lucide-react";
import OwnerSidebar from "./OwnerSidebar";

interface Toggle { label: string; desc: string; key: string; }

const TOGGLES: Toggle[] = [
  { label: "New Inquiries", desc: "Receive alerts when potential tenants message you.", key: "inquiries" },
  { label: "Payment Alerts", desc: "Get notified when a payment is processed or fails.", key: "payments" },
  { label: "Property Insights", desc: "Weekly analytics reports for your active listings.", key: "insights" },
];

function ToggleSwitch({ on, onChange }: { on: boolean; onChange: () => void }) {
  return (
    <button onClick={onChange}
      className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${on ? "bg-[#00C853]" : "bg-[#232323]"}`}
      role="switch" aria-checked={on}>
      <motion.span className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm"
        animate={{ x: on ? 20 : 0 }} transition={{ type: "spring", stiffness: 500, damping: 30 }} />
    </button>
  );
}

export default function OwnerSettingsClient() {
  const [notifications, setNotifications] = useState<Record<string, boolean>>({ inquiries: true, payments: true, insights: false });
  const [firstName, setFirstName] = useState("Alex");
  const [lastName, setLastName] = useState("Rivera");
  const [email, setEmail] = useState("alex.rivera@example.com");
  const [phone, setPhone] = useState("+1 (555) 234-5678");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const toggle = (key: string) => setNotifications((n) => ({ ...n, [key]: !n[key] }));

  return (
    <div className="min-h-screen bg-[#0d0e10] flex">
      <div className="fixed left-4 top-4 bottom-4 z-20 hidden lg:block">
        <OwnerSidebar active="settings" />
      </div>

      <main className="flex-1 lg:pl-[100px] p-6 lg:p-8 max-w-4xl">
        <motion.div className="mb-8" initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}>
          <h1 className="font-heading text-3xl font-bold text-white">Account Settings</h1>
          <p className="text-[#6b7280] text-sm mt-1">Manage your professional profile and global preferences.</p>
        </motion.div>

        <div className="space-y-6">
          {/* Profile */}
          <motion.div className="bg-[#131313] border border-[#232323] rounded-2xl p-6"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}>
            <div className="flex items-center gap-2 mb-6">
              <User className="w-4 h-4 text-[#00C853]" />
              <h2 className="font-heading text-lg font-semibold text-white">Profile Information</h2>
            </div>

            {/* Avatar */}
            <div className="flex items-center gap-5 mb-6">
              <div className="relative group">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#00C853] to-[#006e27] flex items-center justify-center text-2xl font-bold text-[#0d0d0d]">
                  {firstName[0]}{lastName[0]}
                </div>
                <button className="absolute inset-0 rounded-2xl bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Camera className="w-5 h-5 text-white" />
                </button>
              </div>
              <div>
                <p className="text-sm font-medium text-white">{firstName} {lastName}</p>
                <p className="text-xs text-[#6b7280] mt-0.5">Enterprise Plan</p>
                <label className="mt-2 inline-flex items-center gap-1.5 text-xs text-[#00C853] cursor-pointer hover:text-[#00ff66] transition-colors">
                  <Camera className="w-3 h-3" /> Upload Photo
                  <input type="file" className="sr-only" accept=".jpg,.png" />
                </label>
                <p className="text-[10px] text-[#4a5568] mt-0.5">JPG, PNG UP TO 2MB</p>
              </div>
            </div>

            {/* Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: "First Name", value: firstName, set: setFirstName },
                { label: "Last Name", value: lastName, set: setLastName },
                { label: "Email Address", value: email, set: setEmail },
                { label: "Phone Number", value: phone, set: setPhone },
              ].map((field) => (
                <div key={field.label}>
                  <label className="block text-xs font-medium text-[#6b7280] uppercase tracking-wide mb-1.5">{field.label}</label>
                  <input value={field.value} onChange={(e) => field.set(e.target.value)}
                    className="w-full bg-[#1a1c1e] border border-[#232323] rounded-xl px-4 py-2.5 text-sm text-white placeholder-[#4a5568] focus:outline-none focus:border-[#00C853]/50 transition-colors" />
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end">
              <button className="flex items-center gap-2 bg-[#00C853] text-[#0d0d0d] rounded-xl px-5 py-2.5 text-sm font-semibold hover:bg-[#00ff66] transition-colors">
                <Save className="w-4 h-4" /> Save Changes
              </button>
            </div>
          </motion.div>

          {/* Notifications */}
          <motion.div className="bg-[#131313] border border-[#232323] rounded-2xl p-6"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}>
            <div className="flex items-center gap-2 mb-6">
              <Bell className="w-4 h-4 text-[#00C853]" />
              <h2 className="font-heading text-lg font-semibold text-white">Notification Preferences</h2>
            </div>
            <p className="text-sm text-[#6b7280] mb-5">Control how you receive alerts and updates from the portal.</p>
            <div className="space-y-4">
              {TOGGLES.map((t, i) => (
                <motion.div key={t.key} className="flex items-center justify-between gap-4 py-3 border-b border-[#1a1c1e] last:border-0"
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.22 + i * 0.06 }}>
                  <div>
                    <p className="text-sm font-medium text-white">{t.label}</p>
                    <p className="text-xs text-[#6b7280] mt-0.5">{t.desc}</p>
                  </div>
                  <ToggleSwitch on={notifications[t.key]} onChange={() => toggle(t.key)} />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Security */}
          <motion.div className="bg-[#131313] border border-[#232323] rounded-2xl p-6"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.26, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}>
            <div className="flex items-center gap-2 mb-6">
              <Shield className="w-4 h-4 text-[#00C853]" />
              <h2 className="font-heading text-lg font-semibold text-white">Security</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#6b7280] uppercase tracking-wide mb-1.5">Current Password</label>
                <input type="password" placeholder="••••••••" className="w-full bg-[#1a1c1e] border border-[#232323] rounded-xl px-4 py-2.5 text-sm text-white placeholder-[#4a5568] focus:outline-none focus:border-[#00C853]/50 transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#6b7280] uppercase tracking-wide mb-1.5">New Password</label>
                <input type="password" placeholder="••••••••" className="w-full bg-[#1a1c1e] border border-[#232323] rounded-xl px-4 py-2.5 text-sm text-white placeholder-[#4a5568] focus:outline-none focus:border-[#00C853]/50 transition-colors" />
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button className="bg-[#1a1c1e] border border-[#232323] text-white rounded-xl px-5 py-2.5 text-sm font-medium hover:border-[#333] transition-colors">Update Password</button>
            </div>
          </motion.div>

          {/* Danger Zone */}
          <motion.div className="bg-[#131313] border border-[#ef4444]/30 rounded-2xl p-6"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.34, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}>
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-[#ef4444]" />
              <h2 className="font-heading text-lg font-semibold text-[#ef4444]">Danger Zone</h2>
            </div>
            <p className="text-sm text-[#6b7280] mb-5">Actions performed here are permanent and cannot be undone.</p>
            {!showDeleteConfirm ? (
              <button onClick={() => setShowDeleteConfirm(true)}
                className="bg-[#1a1c1e] border border-[#ef4444]/30 text-[#ef4444] rounded-xl px-5 py-2.5 text-sm font-medium hover:bg-[#ef4444]/10 transition-colors">
                Delete Account
              </button>
            ) : (
              <div className="bg-[#1a1c1e] border border-[#ef4444]/40 rounded-xl p-4">
                <p className="text-sm text-white mb-3">Are you sure? This will permanently delete your profile and all associated property data.</p>
                <div className="flex gap-3">
                  <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 bg-[#232323] text-white rounded-xl py-2 text-sm hover:bg-[#2a2a2a] transition-colors">Cancel</button>
                  <button className="flex-1 bg-[#ef4444] text-white rounded-xl py-2 text-sm font-semibold hover:bg-[#dc2626] transition-colors">Delete Permanently</button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
