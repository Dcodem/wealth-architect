import { notFound } from "next/navigation";
import { getOrgId } from "@/lib/db/queries/helpers";
import { getTenant } from "@/lib/db/queries/tenants";
import { getProperty } from "@/lib/db/queries/properties";
import { listProperties } from "@/lib/db/queries/properties";
import { listCasesByTenant } from "@/lib/db/queries/cases";
import { getMessagesByCase } from "@/lib/db/queries/messages";
import { TenantDetailClient } from "./page-client";

export default async function TenantDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const orgId = await getOrgId();

  const tenant = await getTenant(id, orgId);
  if (!tenant) notFound();

  const [property, cases, properties] = await Promise.all([
    getProperty(tenant.propertyId, orgId),
    listCasesByTenant(tenant.id, orgId),
    listProperties(orgId),
  ]);

  // Fetch messages for each case
  const casesWithMessages = await Promise.all(
    cases.map(async (c) => {
      const messages = await getMessagesByCase(c.id, orgId);
      return {
        ...c,
        createdAt: c.createdAt.toISOString(),
        updatedAt: c.updatedAt.toISOString(),
        resolvedAt: c.resolvedAt?.toISOString() ?? null,
        closedAt: c.closedAt?.toISOString() ?? null,
        messages: messages.map((m) => ({
          ...m,
          createdAt: m.createdAt.toISOString(),
          updatedAt: m.updatedAt.toISOString(),
        })),
      };
    })
  );

  // Serialize dates for client component
  const serializedTenant = {
    ...tenant,
    leaseStart: tenant.leaseStart?.toISOString() ?? null,
    leaseEnd: tenant.leaseEnd?.toISOString() ?? null,
    createdAt: tenant.createdAt.toISOString(),
    updatedAt: tenant.updatedAt.toISOString(),
  };

  const serializedProperty = property
    ? {
        ...property,
        createdAt: property.createdAt.toISOString(),
        updatedAt: property.updatedAt.toISOString(),
      }
    : null;

  return (
    <TenantDetailClient
      tenant={serializedTenant}
      property={serializedProperty}
      cases={casesWithMessages}
      properties={properties}
    />
  );
}
