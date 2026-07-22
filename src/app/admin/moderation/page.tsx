import AdminModerationClient from "@/components/admin/AdminModerationClient";
import { getPendingPropertiesForAdmin } from "@/lib/data/admin";
import type { PropertyDoc } from "@/lib/firebase/types";

export const metadata = {
  title: "AI Moderation Center | Admin — RentEase",
  description: "Review pending property submissions and content moderation queue.",
};

export default async function AdminModerationPage() {
  let pendingProperties: PropertyDoc[] = [];
  try {
    pendingProperties = await getPendingPropertiesForAdmin();
  } catch (err) {
    console.error("Failed to fetch pending properties for admin:", err);
  }

  return <AdminModerationClient initialPendingProperties={pendingProperties} />;
}
