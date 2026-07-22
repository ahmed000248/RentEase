import AdminListingsClient from "@/components/admin/AdminListingsClient";
import { getAllPropertiesForAdmin, getAdminPropertyStats } from "@/lib/data/admin";
import type { PropertyDoc } from "@/lib/firebase/types";

export const metadata = {
  title: "Property Listings | Admin — RentEase",
  description: "Manage and review all property inventory across your platform.",
};

export default async function AdminListingsPage() {
  let properties: PropertyDoc[] = [];
  let stats = { total: 0, active: 0, pending: 0, suspended: 0 };

  try {
    const [props, s] = await Promise.all([
      getAllPropertiesForAdmin(),
      getAdminPropertyStats(),
    ]);
    properties = props;
    stats = s;
  } catch (err) {
    console.error("Failed to fetch admin listings:", err);
  }

  return <AdminListingsClient initialProperties={properties} initialStats={stats} />;
}
