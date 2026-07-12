import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/server";
import { isAdminConfigured } from "@/lib/firebase/admin";
import { getPropertiesByOwner, getInquiriesForOwner, buildOwnerAnalytics } from "@/lib/data/owner";
import OwnerDashboardClient from "@/components/owner/OwnerDashboardClient";
import BackendNotConfigured from "@/components/ui/BackendNotConfigured";

export const metadata = {
  title: "Owner Dashboard — RentEase",
  description: "Track revenue, occupancy, and tenant inquiries across your RentEase listings.",
};

export default async function OwnerDashboardPage() {
  if (!isAdminConfigured()) {
    return (
      <div className="min-h-screen bg-[#060606] flex items-center justify-center">
        <BackendNotConfigured message="The owner dashboard reads live data from Firestore, but no Firebase credentials are configured yet. Please configure the service account credentials first." />
      </div>
    );
  }

  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/owner/dashboard");
  if (user.suspended || !user.roles.includes("owner")) redirect("/");

  const properties = await getPropertiesByOwner(user.uid);
  const inquiries = await getInquiriesForOwner(user.uid);
  const analytics = buildOwnerAnalytics(properties);

  return (
    <OwnerDashboardClient
      ownerName={user.name}
      properties={properties}
      occupancyByProperty={analytics.occupancyByProperty}
      overallOccupancyPct={analytics.overallOccupancyPct}
      monthly={analytics.monthly}
      yearly={analytics.yearly}
      monthlyTarget={analytics.monthlyTarget}
      yearlyTarget={analytics.yearlyTarget}
      inquiries={inquiries}
    />
  );
}
