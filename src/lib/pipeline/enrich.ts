import { findOpenCasesByTenant } from "@/lib/db/queries/cases";
import { getOrganization } from "@/lib/db/queries/organizations";
import type { InboundMessage } from "@/lib/messaging/types";
import type { Tenant, Property } from "@/lib/db/schema";
import type { PipelineContext } from "./types";

export async function enrichContext(params: {
  message: InboundMessage;
  orgId: string;
  tenant: Tenant | null;
  property: Property | null;
  isNewTenant: boolean;
}): Promise<PipelineContext> {
  const org = await getOrganization(params.orgId);
  if (!org) throw new Error(`Organization not found: ${params.orgId}`);

  const existingCases = params.tenant
    ? await findOpenCasesByTenant(params.tenant.id, params.orgId)
    : [];

  return {
    message: params.message,
    orgId: params.orgId,
    org,
    tenant: params.tenant,
    property: params.property,
    existingCases,
    isNewTenant: params.isNewTenant,
  };
}
