import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/server";
import { isAdminConfigured } from "@/lib/firebase/admin";
import BackendNotConfigured from "@/components/ui/BackendNotConfigured";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  if (!isAdminConfigured()) {
    return <BackendNotConfigured message="Firebase Admin SDK is not configured." />;
  }

  const user = await getCurrentUser();
  if (!user) {
    redirect("/login?next=/dashboard");
  }

  if (user.suspended) {
    redirect("/?suspended=1");
  }

  if (user.roles.includes("owner")) {
    redirect("/owner/dashboard");
  }

  // Redirect tenants to property search with tenant welcome indicator
  redirect("/properties?tenant=1");
}
