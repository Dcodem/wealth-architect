import { db } from "@/lib/db";
import { tenants, type NewTenant } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export async function listTenants(orgId: string) {
  return db.select().from(tenants).where(eq(tenants.orgId, orgId)).orderBy(tenants.name);
}

export async function listTenantsByProperty(propertyId: string, orgId: string) {
  return db.select().from(tenants)
    .where(and(eq(tenants.propertyId, propertyId), eq(tenants.orgId, orgId)))
    .orderBy(tenants.unitNumber);
}

export async function getTenant(id: string, orgId: string) {
  const [tenant] = await db.select().from(tenants)
    .where(and(eq(tenants.id, id), eq(tenants.orgId, orgId))).limit(1);
  return tenant ?? null;
}

export async function createTenant(
  orgId: string,
  data: Omit<NewTenant, "id" | "orgId" | "createdAt" | "updatedAt">
) {
  const [tenant] = await db.insert(tenants).values({ ...data, orgId }).returning();
  return tenant;
}

export async function updateTenant(
  id: string, orgId: string,
  data: Partial<Omit<NewTenant, "id" | "orgId" | "createdAt" | "updatedAt">>
) {
  const [tenant] = await db.update(tenants)
    .set({ ...data, updatedAt: new Date() })
    .where(and(eq(tenants.id, id), eq(tenants.orgId, orgId))).returning();
  return tenant ?? null;
}

export async function deleteTenant(id: string, orgId: string) {
  const result = await db.delete(tenants)
    .where(and(eq(tenants.id, id), eq(tenants.orgId, orgId)))
    .returning({ id: tenants.id });
  return result.length > 0;
}

export async function findTenantByEmail(email: string, orgId: string) {
  const [tenant] = await db.select().from(tenants)
    .where(and(eq(tenants.email, email), eq(tenants.orgId, orgId))).limit(1);
  return tenant ?? null;
}

export async function findTenantByPhone(phone: string, orgId: string) {
  return db.select().from(tenants)
    .where(and(eq(tenants.phone, phone), eq(tenants.orgId, orgId)));
}
