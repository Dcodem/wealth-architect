import { findTenantByEmail, findTenantByPhone } from "@/lib/db/queries/tenants";
import { getProperty } from "@/lib/db/queries/properties";
import type { Tenant, Property } from "@/lib/db/schema";
import type { Channel } from "@/lib/messaging/types";

interface IdentifyResult {
  tenant: Tenant | null;
  property: Property | null;
  isNewTenant: boolean;
  multipleMatches: boolean;
  matchCount: number;
}

export async function identifySender(
  from: string,
  channel: Channel,
  orgId: string
): Promise<IdentifyResult> {
  if (channel === "email") {
    const tenant = await findTenantByEmail(from, orgId);
    if (tenant) {
      const property = await getProperty(tenant.propertyId, orgId);
      return { tenant, property, isNewTenant: false, multipleMatches: false, matchCount: 1 };
    }
    return { tenant: null, property: null, isNewTenant: true, multipleMatches: false, matchCount: 0 };
  }

  // SMS — phone can match multiple tenants
  const results = await findTenantByPhone(from, orgId);

  if (results.length === 0) {
    return { tenant: null, property: null, isNewTenant: true, multipleMatches: false, matchCount: 0 };
  }

  if (results.length === 1) {
    const tenant = results[0];
    const property = await getProperty(tenant.propertyId, orgId);
    return { tenant, property, isNewTenant: false, multipleMatches: false, matchCount: 1 };
  }

  // Multiple matches — return first but flag for disambiguation
  const tenant = results[0];
  const property = await getProperty(tenant.propertyId, orgId);
  return {
    tenant,
    property,
    isNewTenant: false,
    multipleMatches: true,
    matchCount: results.length,
  };
}
