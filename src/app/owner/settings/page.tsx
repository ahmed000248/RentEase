import { redirect } from "next/navigation";
import { getCurrentUser, hasRole } from "@/lib/auth/server";
import { isAdminConfigured } from "@/lib/firebase/admin";
import OwnerSettingsClient from "@/components/owner/OwnerSettingsClient";
import BackendNotConfigured from "@/components/ui/BackendNotConfigured";

export const metadata = { title: "Settings | Owner Portal — RentEase", description: "Manage your professional profile, notification preferences, and account security." };

export default async function OwnerSettingsPage() {
  if (!isAdminConfigured()) {
    return (
      <div className="min-h-screen bg-[#060606] flex items-center justify-center">
        <BackendNotConfigured message="The owner settings page reads live data from Firestore, but no Firebase credentials are configured yet." />
      </div>
    );
  }

  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/owner/settings");
  if (user.suspended || !hasRole(user, "owner")) redirect("/");

  return <OwnerSettingsClient />;
}
