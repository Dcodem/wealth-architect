import { db } from "@/lib/db";
import { properties, type NewProperty } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export async function listProperties(orgId: string) {
  return db
    .select()
    .from(properties)
    .where(eq(properties.orgId, orgId))
    .orderBy(properties.address);
}

export async function getProperty(id: string, orgId: string) {
  const [property] = await db
    .select()
    .from(properties)
    .where(and(eq(properties.id, id), eq(properties.orgId, orgId)))
    .limit(1);
  return property ?? null;
}

export async function createProperty(
  orgId: string,
  data: Omit<NewProperty, "id" | "orgId" | "createdAt" | "updatedAt">
) {
  const [property] = await db
    .insert(properties)
    .values({ ...data, orgId })
    .returning();
  return property;
}

export async function updateProperty(
  id: string,
  orgId: string,
  data: Partial<Omit<NewProperty, "id" | "orgId" | "createdAt" | "updatedAt">>
) {
  const [property] = await db
    .update(properties)
    .set({ ...data, updatedAt: new Date() })
    .where(and(eq(properties.id, id), eq(properties.orgId, orgId)))
    .returning();
  return property ?? null;
}

export async function deleteProperty(id: string, orgId: string) {
  const result = await db
    .delete(properties)
    .where(and(eq(properties.id, id), eq(properties.orgId, orgId)))
    .returning({ id: properties.id });
  return result.length > 0;
}
