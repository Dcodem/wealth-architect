"use server";

import { getOrgId } from "@/lib/db/queries/helpers";
import { createCase } from "@/lib/db/queries/cases";
import { addTimelineEntry } from "@/lib/db/queries/cases";
import { listTenantsByProperty } from "@/lib/db/queries/tenants";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function createCaseAction(formData: FormData) {
  const orgId = await getOrgId();

  const rawMessage = formData.get("rawMessage") as string;
  if (!rawMessage || rawMessage.trim() === "") {
    throw new Error("Description is required");
  }

  const category = (formData.get("category") as string) || null;
  const urgency = (formData.get("urgency") as string) || null;
  const propertyId = (formData.get("propertyId") as string) || null;
  const vendorId = (formData.get("vendorId") as string) || null;

  // Look up first tenant at the property for tenantId
  let tenantId: string | null = null;
  if (propertyId) {
    const tenants = await listTenantsByProperty(propertyId, orgId);
    if (tenants.length > 0) {
      tenantId = tenants[0].id;
    }
  }

  const newCase = await createCase(orgId, {
    rawMessage: rawMessage.trim(),
    category: category as any,
    urgency: urgency as any,
    source: "email",
    status: "open",
    propertyId,
    vendorId,
    tenantId,
  });

  await addTimelineEntry(newCase.id, {
    type: "case_created",
    details: "Case created manually via dashboard",
  });

  revalidatePath("/cases");
  redirect(`/cases/${newCase.id}`);
}
