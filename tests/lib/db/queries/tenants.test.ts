import { describe, it, expect, beforeEach, afterAll } from "vitest";
import { createTestOrg, createTestProperty, createTestTenant, cleanupTestData } from "../../../helpers/seed";
import { listTenants, findTenantByEmail, findTenantByPhone } from "@/lib/db/queries/tenants";

describe("tenants queries", () => {
  let orgId: string;
  let otherOrgId: string;
  let propertyId: string;

  beforeEach(async () => {
    await cleanupTestData();
    const org = await createTestOrg();
    orgId = org.id;
    const otherOrg = await createTestOrg({ name: "Other" });
    otherOrgId = otherOrg.id;
    const property = await createTestProperty(orgId);
    propertyId = property.id;
  });

  afterAll(async () => { await cleanupTestData(); });

  it("returns tenants for the given org only", async () => {
    await createTestTenant(propertyId, orgId, { name: "Alice" });
    await createTestTenant(propertyId, orgId, { name: "Bob" });
    const otherProp = await createTestProperty(otherOrgId);
    await createTestTenant(otherProp.id, otherOrgId, { name: "Charlie" });

    const result = await listTenants(orgId);
    expect(result).toHaveLength(2);
    expect(result.map((t) => t.name)).not.toContain("Charlie");
  });

  it("finds tenant by email within org", async () => {
    await createTestTenant(propertyId, orgId, { name: "Alice", email: "alice@example.com" });
    const result = await findTenantByEmail("alice@example.com", orgId);
    expect(result).not.toBeNull();
    expect(result!.name).toBe("Alice");
  });

  it("returns null for tenant email in different org", async () => {
    const otherProp = await createTestProperty(otherOrgId);
    await createTestTenant(otherProp.id, otherOrgId, { email: "charlie@example.com" });
    const result = await findTenantByEmail("charlie@example.com", orgId);
    expect(result).toBeNull();
  });

  it("returns array for phone lookup (supports shared phones)", async () => {
    await createTestTenant(propertyId, orgId, { name: "Alice", phone: "+15551111111", unitNumber: "1A" });
    await createTestTenant(propertyId, orgId, { name: "Bob", phone: "+15551111111", unitNumber: "2B" });

    const result = await findTenantByPhone("+15551111111", orgId);
    expect(result).toHaveLength(2);
  });

  it("returns empty array when no phone match", async () => {
    const result = await findTenantByPhone("+15559999999", orgId);
    expect(result).toHaveLength(0);
  });
});
