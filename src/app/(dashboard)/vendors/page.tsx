import { getOrgId } from "@/lib/db/queries/helpers";
import { listVendors } from "@/lib/db/queries/vendors";
import { VendorsPageClient } from "./page-client";

export const metadata = { title: "Vendors Roster | The Wealth Architect" };

export default async function VendorsPage() {
  const orgId = await getOrgId();
  const vendors = await listVendors(orgId);

  return <VendorsPageClient vendors={vendors} />;
}
