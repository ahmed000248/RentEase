import { redirect } from "next/navigation";
import { getCurrentUser, hasRole } from "@/lib/auth/server";
import { isAdminConfigured } from "@/lib/firebase/admin";
import { getPropertiesByOwner } from "@/lib/data/owner";
import OwnerListingsClient from "@/components/owner/OwnerListingsClient";
import BackendNotConfigured from "@/components/ui/BackendNotConfigured";

export const metadata = {
  title: "My Listings — Owner Portal",
  description: "Manage your property listings on RentEase.",
};

export default async function OwnerListingsPage() {
  if (!isAdminConfigured()) {
    return (
      <div className="min-h-screen bg-[#060606] flex items-center justify-center">
        <BackendNotConfigured message="The owner listings dashboard reads live data from Firestore, but no Firebase credentials are configured yet. Please configure the service account credentials first." />
      </div>
    );
  }

  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/owner/listings");
  if (user.suspended || !hasRole(user, "owner")) redirect("/");

  const properties = await getPropertiesByOwner(user.uid);

  return <OwnerListingsClient ownerName={user.name} properties={properties} />;
}
