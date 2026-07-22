import { redirect } from "next/navigation";
import { getCurrentUser, hasRole } from "@/lib/auth/server";
import { isAdminConfigured } from "@/lib/firebase/admin";
import OwnerAnalyticsClient from "@/components/owner/OwnerAnalyticsClient";
import BackendNotConfigured from "@/components/ui/BackendNotConfigured";

export const metadata = { title: "Analytics | Owner Portal — RentEase", description: "Overview of your portfolio performance including revenue, occupancy, views, and geographic distribution." };

export default async function OwnerAnalyticsPage() {
  if (!isAdminConfigured()) {
    return (
      <div className="min-h-screen bg-[#060606] flex items-center justify-center">
        <BackendNotConfigured message="The owner analytics page reads live data from Firestore, but no Firebase credentials are configured yet." />
      </div>
    );
  }

  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/owner/analytics");
  if (user.suspended || !hasRole(user, "owner")) redirect("/");

  return <OwnerAnalyticsClient />;
}
