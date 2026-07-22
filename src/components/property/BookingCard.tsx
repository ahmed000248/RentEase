"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, CreditCard, Loader2, CheckCircle2, ShieldCheck } from "lucide-react";
import { formatPrice } from "@/lib/format";
import { useAuth } from "@/lib/auth/AuthContext";

interface BookingCardProps {
  propertyId: string;
  pricePerMonth: number;
}

export default function BookingCard({ propertyId, pricePerMonth }: BookingCardProps) {
  const router = useRouter();
  const { userDoc } = useAuth();

  const todayStr = new Date().toISOString().split("T")[0];
  const defaultEndStr = new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0];

  const [startDateStr, setStartDateStr] = useState(todayStr);
  const [endDateStr, setEndDateStr] = useState(defaultEndStr);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const startMs = new Date(startDateStr).getTime();
  const endMs = new Date(endDateStr).getTime();
  const nights = Math.max(1, Math.ceil((endMs - startMs) / (1000 * 60 * 60 * 24)));
  const dailyRate = pricePerMonth / 30;
  const estimatedTotal = Math.round(nights * dailyRate);

  const handleBookNow = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userDoc) {
      router.push(`/login?next=/properties/${propertyId}`);
      return;
    }

    if (endMs <= startMs) {
      setError("Check-out date must be after check-in date.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/bookings/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyId,
          startDate: startMs,
          endDate: endMs,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create booking request.");
      }

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        setSuccess(true);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#0d0d0d] border border-white/10 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
      <div className="flex items-center justify-between mb-5 border-b border-white/5 pb-4">
        <div>
          <span className="text-2xl font-extrabold text-brand-green">{formatPrice(pricePerMonth)}</span>
          <span className="text-xs text-white/50"> / month</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-teal-400 font-semibold bg-teal-400/10 px-2.5 py-1 rounded-full border border-teal-400/20">
          <ShieldCheck className="w-3.5 h-3.5" />
          Verified Rental
        </div>
      </div>

      {success ? (
        <div className="py-6 text-center">
          <CheckCircle2 className="w-12 h-12 text-brand-green mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white mb-1">Booking Request Received!</h3>
          <p className="text-xs text-white/60 mb-4">
            Your reservation request has been created. The landlord will contact you shortly.
          </p>
          <button
            type="button"
            onClick={() => setSuccess(false)}
            className="text-xs font-semibold text-brand-green hover:underline cursor-pointer"
          >
            Create Another Reservation
          </button>
        </div>
      ) : (
        <form onSubmit={handleBookNow} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-white/60 mb-1">Check-in</label>
              <div className="relative">
                <input
                  type="date"
                  value={startDateStr}
                  min={todayStr}
                  onChange={(e) => setStartDateStr(e.target.value)}
                  className="w-full bg-[#141417] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-green"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-white/60 mb-1">Check-out</label>
              <div className="relative">
                <input
                  type="date"
                  value={endDateStr}
                  min={startDateStr}
                  onChange={(e) => setEndDateStr(e.target.value)}
                  className="w-full bg-[#141417] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-green"
                  required
                />
              </div>
            </div>
          </div>

          <div className="bg-[#141417] rounded-xl p-3 border border-white/5 space-y-1.5 text-xs text-white/70">
            <div className="flex justify-between">
              <span>Lease duration</span>
              <span className="font-semibold text-white">{nights} days</span>
            </div>
            <div className="flex justify-between">
              <span>Daily pro-rated rate</span>
              <span>${dailyRate.toFixed(2)}/day</span>
            </div>
            <div className="flex justify-between border-t border-white/5 pt-1.5 text-sm font-bold text-white">
              <span>Estimated Total</span>
              <span className="text-brand-green">${estimatedTotal.toLocaleString()}</span>
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl p-3">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-green text-black font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 hover:bg-brand-green/90 transition-all duration-200 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <CreditCard className="w-4 h-4" />
                <span>Reserve Property</span>
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
