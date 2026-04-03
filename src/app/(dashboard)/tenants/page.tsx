import { getOrgId } from "@/lib/db/queries/helpers";
import { listTenants } from "@/lib/db/queries/tenants";
import { listProperties } from "@/lib/db/queries/properties";
import { TenantsPageClient } from "./page-client";

export default async function TenantsPage() {
  const orgId = await getOrgId();

  const [tenants, properties] = await Promise.all([
    listTenants(orgId),
    listProperties(orgId),
  ]);

  return <TenantsPageClient tenants={tenants} properties={properties} />;
}
