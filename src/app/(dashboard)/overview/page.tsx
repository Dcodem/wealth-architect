import { getOrgId } from "@/lib/db/queries/helpers";
import { listCases } from "@/lib/db/queries/cases";
import { listProperties } from "@/lib/db/queries/properties";
import { listTenants } from "@/lib/db/queries/tenants";
import { OverviewClient } from "./overview-client";

export const metadata = { title: "Dashboard | The Wealth Architect" };

export default async function OverviewPage() {
  const orgId = await getOrgId();

  const [cases, properties, tenants] = await Promise.all([
    listCases(orgId),
    listProperties(orgId),
    listTenants(orgId),
  ]);

  return (
    <OverviewClient
      cases={cases}
      properties={properties}
      tenants={tenants}
    />
  );
}
