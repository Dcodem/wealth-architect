import { notFound } from "next/navigation";
import { getOrgId } from "@/lib/db/queries/helpers";
import { getProperty } from "@/lib/db/queries/properties";
import { listTenantsByProperty } from "@/lib/db/queries/tenants";
import { listCases } from "@/lib/db/queries/cases";
import { PropertyDetailClient } from "@/components/properties/property-detail-client";

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const orgId = await getOrgId();

  const [property, tenants, cases] = await Promise.all([
    getProperty(id, orgId),
    listTenantsByProperty(id, orgId),
    listCases(orgId, { propertyId: id }),
  ]);

  if (!property) {
    notFound();
  }

  return (
    <PropertyDetailClient
      property={property}
      tenants={tenants}
      cases={cases}
    />
  );
}
