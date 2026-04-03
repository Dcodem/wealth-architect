import { db } from "@/lib/db";
import { vendors, type NewVendor } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";

export async function listVendors(orgId: string) {
  return db.select().from(vendors).where(eq(vendors.orgId, orgId)).orderBy(vendors.name);
}

export async function getVendor(id: string, orgId: string) {
  const [vendor] = await db.select().from(vendors)
    .where(and(eq(vendors.id, id), eq(vendors.orgId, orgId))).limit(1);
  return vendor ?? null;
}

export async function createVendor(
  orgId: string,
  data: Omit<NewVendor, "id" | "orgId" | "createdAt" | "updatedAt">
) {
  const [vendor] = await db.insert(vendors).values({ ...data, orgId }).returning();
  return vendor;
}

export async function updateVendor(
  id: string, orgId: string,
  data: Partial<Omit<NewVendor, "id" | "orgId" | "createdAt" | "updatedAt">>
) {
  const [vendor] = await db.update(vendors)
    .set({ ...data, updatedAt: new Date() })
    .where(and(eq(vendors.id, id), eq(vendors.orgId, orgId))).returning();
  return vendor ?? null;
}

export async function deleteVendor(id: string, orgId: string) {
  const result = await db.delete(vendors)
    .where(and(eq(vendors.id, id), eq(vendors.orgId, orgId)))
    .returning({ id: vendors.id });
  return result.length > 0;
}

export async function findVendorsByTrade(
  trade: typeof vendors.$inferSelect.trade,
  orgId: string
) {
  return db.select().from(vendors)
    .where(and(eq(vendors.trade, trade), eq(vendors.orgId, orgId)))
    .orderBy(desc(vendors.preferenceScore));
}
