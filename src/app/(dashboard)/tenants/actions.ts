"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getOrgId } from "@/lib/db/queries/helpers";
import { createTenant, updateTenant, deleteTenant } from "@/lib/db/queries/tenants";
import { tenantSchema } from "@/lib/validations";

export async function createTenantAction(formData: FormData) {
  const orgId = await getOrgId();

  const parsed = tenantSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    propertyId: formData.get("propertyId"),
    unitNumber: formData.get("unitNumber"),
    leaseStart: formData.get("leaseStart") || undefined,
    leaseEnd: formData.get("leaseEnd") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  await createTenant(orgId, parsed.data);
  revalidatePath("/tenants");
  return { success: true };
}

export async function updateTenantAction(id: string, formData: FormData) {
  const orgId = await getOrgId();

  const parsed = tenantSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    propertyId: formData.get("propertyId"),
    unitNumber: formData.get("unitNumber"),
    leaseStart: formData.get("leaseStart") || undefined,
    leaseEnd: formData.get("leaseEnd") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  await updateTenant(id, orgId, parsed.data);
  revalidatePath("/tenants");
  revalidatePath(`/tenants/${id}`);
  return { success: true };
}

export async function deleteTenantAction(id: string) {
  const orgId = await getOrgId();
  await deleteTenant(id, orgId);
  redirect("/tenants");
}
