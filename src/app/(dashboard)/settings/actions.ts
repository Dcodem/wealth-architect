"use server";

import { getOrgId, getCurrentUser } from "@/lib/db/queries/helpers";
import { updateOrganization } from "@/lib/db/queries/organizations";
import { confidenceThresholdsSchema, spendingLimitsSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function updateConfidenceThresholdsAction(formData: FormData) {
  const orgId = await getOrgId();
  const high = Number(formData.get("high"));
  const medium = Number(formData.get("medium"));

  const result = confidenceThresholdsSchema.safeParse({ high, medium });
  if (!result.success) return { success: false as const, error: result.error.issues[0].message };

  await updateOrganization(orgId, { confidenceThresholds: result.data });
  revalidatePath("/settings");
  return { success: true as const };
}

export async function updateSpendingLimitsAction(formData: FormData) {
  const orgId = await getOrgId();
  const spendingLimit = Number(formData.get("spendingLimit"));
  const emergencySpendingLimit = Number(formData.get("emergencySpendingLimit"));

  const result = spendingLimitsSchema.safeParse({ spendingLimit, emergencySpendingLimit });
  if (!result.success) return { success: false as const, error: result.error.issues[0].message };

  await updateOrganization(orgId, result.data);
  revalidatePath("/settings");
  return { success: true as const };
}

export async function updateUrgencyTimersAction(formData: FormData) {
  const orgId = await getOrgId();
  const timers: Record<string, Record<string, number>> = {};

  for (const level of ["critical", "high", "medium", "low"]) {
    timers[level] = {
      vendorResponse: Number(formData.get(`${level}.vendorResponse`)),
      reminder: Number(formData.get(`${level}.reminder`)),
      nextVendor: Number(formData.get(`${level}.nextVendor`)),
      pmEscalation: Number(formData.get(`${level}.pmEscalation`)),
    };
  }

  await updateOrganization(orgId, { defaultUrgencyTimers: timers as any });
  revalidatePath("/settings");
  return { success: true as const };
}

export async function updateNotificationPrefsAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) return { success: false as const, error: "Not authenticated" };

  const prefs = {
    urgentChannel: formData.get("urgentChannel") as "sms" | "email",
    quietHoursStart: (formData.get("quietHoursStart") as string) || null,
    quietHoursEnd: (formData.get("quietHoursEnd") as string) || null,
    quietHoursTimezone: (formData.get("quietHoursTimezone") as string) || "America/New_York",
  };

  await db
    .update(users)
    .set({ notificationPreferences: prefs, updatedAt: new Date() })
    .where(eq(users.id, user.id));
  revalidatePath("/settings");
  return { success: true as const };
}
