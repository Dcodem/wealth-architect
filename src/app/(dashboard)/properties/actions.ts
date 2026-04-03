"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getOrgId } from "@/lib/db/queries/helpers";
import {
  createProperty,
  updateProperty,
  deleteProperty,
} from "@/lib/db/queries/properties";
import { createTenant } from "@/lib/db/queries/tenants";
import { propertySchema, tenantSchema } from "@/lib/validations";

export async function createPropertyAction(formData: FormData) {
  const orgId = await getOrgId();

  const raw = {
    address: formData.get("address"),
    unitCount: formData.get("unitCount"),
    type: formData.get("type"),
    accessInstructions: formData.get("accessInstructions"),
    parkingInstructions: formData.get("parkingInstructions"),
    unitAccessNotes: formData.get("unitAccessNotes"),
    specialInstructions: formData.get("specialInstructions"),
    notes: formData.get("notes"),
  };

  const parsed = propertySchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false as const,
      error: parsed.error.issues[0]?.message ?? "Validation failed",
    };
  }

  await createProperty(orgId, parsed.data);
  revalidatePath("/properties");
  redirect("/properties");
}

export async function updatePropertyAction(id: string, formData: FormData) {
  const orgId = await getOrgId();

  const raw = {
    address: formData.get("address"),
    unitCount: formData.get("unitCount"),
    type: formData.get("type"),
    accessInstructions: formData.get("accessInstructions"),
    parkingInstructions: formData.get("parkingInstructions"),
    unitAccessNotes: formData.get("unitAccessNotes"),
    specialInstructions: formData.get("specialInstructions"),
    notes: formData.get("notes"),
  };

  const parsed = propertySchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false as const,
      error: parsed.error.issues[0]?.message ?? "Validation failed",
    };
  }

  await updateProperty(id, orgId, parsed.data);
  revalidatePath("/properties");
  revalidatePath(`/properties/${id}`);
  return { success: true as const };
}

export async function deletePropertyAction(id: string) {
  const orgId = await getOrgId();
  await deleteProperty(id, orgId);
  revalidatePath("/properties");
  redirect("/properties");
}

export async function addTenantToPropertyAction(formData: FormData) {
  const orgId = await getOrgId();

  const raw = {
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    propertyId: formData.get("propertyId"),
    unitNumber: formData.get("unitNumber"),
    leaseStart: formData.get("leaseStart") || undefined,
    leaseEnd: formData.get("leaseEnd") || undefined,
  };

  const parsed = tenantSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false as const,
      error: parsed.error.issues[0]?.message ?? "Validation failed",
    };
  }

  await createTenant(orgId, parsed.data);
  revalidatePath(`/properties/${parsed.data.propertyId}`);
  return { success: true as const };
}
