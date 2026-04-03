import { db } from "@/lib/db";
import { organizations, users, properties, tenants, vendors } from "@/lib/db/schema";
import { sql } from "drizzle-orm";

// Tests use direct DB connection (bypasses RLS intentionally)

export async function createTestOrg(overrides?: Partial<typeof organizations.$inferInsert>) {
  const [org] = await db
    .insert(organizations)
    .values({
      name: "Test PM Company",
      slug: `test-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
      ...overrides,
    })
    .returning();
  return org;
}

export async function createTestProperty(
  orgId: string,
  overrides?: Partial<typeof properties.$inferInsert>
) {
  const [property] = await db
    .insert(properties)
    .values({
      orgId,
      address: "123 Main St",
      ...overrides,
    })
    .returning();
  return property;
}

export async function createTestTenant(
  propertyId: string,
  orgId: string,
  overrides?: Partial<typeof tenants.$inferInsert>
) {
  const [tenant] = await db
    .insert(tenants)
    .values({
      propertyId,
      orgId,
      name: "Test Tenant",
      email: `tenant-${Date.now()}-${Math.random().toString(36).slice(2, 6)}@example.com`,
      phone: "+15551234567",
      unitNumber: "1A",
      ...overrides,
    })
    .returning();
  return tenant;
}

export async function createTestVendor(
  orgId: string,
  overrides?: Partial<typeof vendors.$inferInsert>
) {
  const [vendor] = await db
    .insert(vendors)
    .values({
      orgId,
      name: "Test Plumber",
      trade: "plumber",
      phone: "+15559876543",
      ...overrides,
    })
    .returning();
  return vendor;
}

export async function cleanupTestData() {
  await db.execute(sql`DELETE FROM message_log`);
  await db.execute(sql`DELETE FROM case_timeline`);
  await db.execute(sql`DELETE FROM cases`);
  await db.execute(sql`DELETE FROM tenants`);
  await db.execute(sql`DELETE FROM vendors`);
  await db.execute(sql`DELETE FROM properties`);
  await db.execute(sql`DELETE FROM users`);
  await db.execute(sql`DELETE FROM processed_messages`);
  await db.execute(sql`DELETE FROM organizations`);
}
