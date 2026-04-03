"use server";

import { revalidatePath } from "next/cache";
import { getOrgId } from "@/lib/db/queries/helpers";
import { createVendor, updateVendor, deleteVendor } from "@/lib/db/queries/vendors";
import { vendorSchema } from "@/lib/validations";

export async function createVendorAction(formData: FormData) {
  const orgId = await getOrgId();

  const parsed = vendorSchema.safeParse({
    name: formData.get("name"),
    trade: formData.get("trade"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    rateNotes: formData.get("rateNotes"),
    availabilityNotes: formData.get("availabilityNotes"),
    preferenceScore: formData.get("preferenceScore") || 0.5,
  });

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  await createVendor(orgId, parsed.data);
  revalidatePath("/vendors");
  return { success: true };
}

export async function updateVendorAction(id: string, formData: FormData) {
  const orgId = await getOrgId();

  const parsed = vendorSchema.safeParse({
    name: formData.get("name"),
    trade: formData.get("trade"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    rateNotes: formData.get("rateNotes"),
    availabilityNotes: formData.get("availabilityNotes"),
    preferenceScore: formData.get("preferenceScore") || 0.5,
  });

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  await updateVendor(id, orgId, parsed.data);
  revalidatePath("/vendors");
  return { success: true };
}

export async function deleteVendorAction(id: string) {
  const orgId = await getOrgId();
  await deleteVendor(id, orgId);
  revalidatePath("/vendors");
}
