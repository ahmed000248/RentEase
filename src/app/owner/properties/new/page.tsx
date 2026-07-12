import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/server";
import { isAdminConfigured } from "@/lib/firebase/admin";
import ListingWizardClient from "@/components/owner/ListingWizardClient";
import BackendNotConfigured from "@/components/ui/BackendNotConfigured";

export const metadata = {
  title: "Add New Listing — Owner Portal",
  description: "Create a new property listing on RentEase.",
};

export default async function NewListingPage() {
  if (!isAdminConfigured()) {
    return (
      <div className="min-h-screen bg-[#121315] flex items-center justify-center">
        <BackendNotConfigured message="The listing wizard requires Firebase credentials to save properties. Please configure the service account first." />
      </div>
    );
  }

  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/owner/properties/new");
  if (user.suspended || !user.roles.includes("owner")) redirect("/");

  return <ListingWizardClient ownerName={user.name} ownerId={user.uid} />;
}
