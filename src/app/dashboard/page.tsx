import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/server";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login?next=/dashboard");
  }

  if (user.suspended) {
    redirect("/");
  }

  if (user.roles.includes("owner")) {
    redirect("/owner/dashboard");
  }

  // Tenants do not have a dedicated dashboard, redirect back to home page
  redirect("/");
}
