import { notFound } from "next/navigation";
import { getOrgId } from "@/lib/db/queries/helpers";
import { getProperty } from "@/lib/db/queries/properties";
import { listCases } from "@/lib/db/queries/cases";
import { listTenantsByProperty } from "@/lib/db/queries/tenants";
import { PropertyAnalyticsClient } from "@/components/properties/property-analytics-client";

export default async function PropertyAnalyticsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const orgId = await getOrgId();
  const property = await getProperty(id, orgId);
  if (!property) notFound();

  const [cases, tenants] = await Promise.all([
    listCases(orgId, { propertyId: id }),
    listTenantsByProperty(id, orgId),
  ]);

  return <PropertyAnalyticsClient property={property} cases={cases} tenants={tenants} />;
}
