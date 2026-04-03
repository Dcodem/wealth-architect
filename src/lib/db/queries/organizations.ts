import { db } from "@/lib/db";
import { organizations, type NewOrganization } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

/**
 * Get an organization by ID.
 * IMPORTANT: Only call from auth helpers (getOrgId/getCurrentUser) where
 * the user's org_id has been verified via auth session. Do NOT call from
 * API routes with user-supplied IDs without additional auth checks.
 */
export async function getOrganization(id: string) {
  const [org] = await db.select().from(organizations)
    .where(eq(organizations.id, id)).limit(1);
  return org ?? null;
}

export async function updateOrganization(
  id: string,
  data: Partial<Omit<NewOrganization, "id" | "createdAt" | "updatedAt">>
) {
  const [org] = await db.update(organizations)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(organizations.id, id)).returning();
  return org ?? null;
}
