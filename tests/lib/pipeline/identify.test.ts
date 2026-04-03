import { describe, it, expect, beforeEach, afterAll } from "vitest";
import { createTestOrg, createTestProperty, createTestTenant, cleanupTestData } from "../../helpers/seed";
import { identifySender } from "@/lib/pipeline/identify";

describe("identifySender", () => {
  let orgId: string;
  let propertyId: string;

  beforeEach(async () => {
    await cleanupTestData();
    const org = await createTestOrg();
    orgId = org.id;
    const property = await createTestProperty(orgId);
    propertyId = property.id;
  });

  afterAll(async () => { await cleanupTestData(); });

  it("identifies a tenant by email", async () => {
    const tenant = await createTestTenant(propertyId, orgId, {
      name: "Alice",
      email: "alice@example.com",
    });

    const result = await identifySender("alice@example.com", "email", orgId);
    expect(result.tenant).not.toBeNull();
    expect(result.tenant!.id).toBe(tenant.id);
    expect(result.isNewTenant).toBe(false);
  });

  it("identifies a tenant by phone", async () => {
    const tenant = await createTestTenant(propertyId, orgId, {
      name: "Bob",
      phone: "+15551234567",
    });

    const result = await identifySender("+15551234567", "sms", orgId);
    expect(result.tenant).not.toBeNull();
    expect(result.tenant!.id).toBe(tenant.id);
  });

  it("returns null tenant for unknown sender", async () => {
    const result = await identifySender("unknown@example.com", "email", orgId);
    expect(result.tenant).toBeNull();
    expect(result.isNewTenant).toBe(true);
  });

  it("returns multiple matches for shared phone", async () => {
    await createTestTenant(propertyId, orgId, { name: "Alice", phone: "+15559999999", unitNumber: "1A" });
    await createTestTenant(propertyId, orgId, { name: "Bob", phone: "+15559999999", unitNumber: "2B" });

    const result = await identifySender("+15559999999", "sms", orgId);
    expect(result.multipleMatches).toBe(true);
    expect(result.matchCount).toBe(2);
  });
});
