import { describe, it, expect, beforeEach, afterAll } from "vitest";
import { createTestOrg, createTestVendor, cleanupTestData } from "../../helpers/seed";
import { selectVendor } from "@/lib/vendor/select";

describe("selectVendor", () => {
  let orgId: string;

  beforeEach(async () => {
    await cleanupTestData();
    const org = await createTestOrg();
    orgId = org.id;
  });

  afterAll(async () => { await cleanupTestData(); });

  it("selects the highest-rated vendor for the trade", async () => {
    await createTestVendor(orgId, { name: "Joe", trade: "plumber", preferenceScore: 0.3 });
    await createTestVendor(orgId, { name: "AceFix", trade: "plumber", preferenceScore: 0.9 });

    const vendor = await selectVendor("plumber", orgId);
    expect(vendor).not.toBeNull();
    expect(vendor!.name).toBe("AceFix");
  });

  it("skips excluded vendor IDs", async () => {
    const joe = await createTestVendor(orgId, { name: "Joe", trade: "plumber", preferenceScore: 0.3 });
    const ace = await createTestVendor(orgId, { name: "AceFix", trade: "plumber", preferenceScore: 0.9 });

    const vendor = await selectVendor("plumber", orgId, [ace.id]);
    expect(vendor).not.toBeNull();
    expect(vendor!.name).toBe("Joe");
  });

  it("returns null when no vendors available", async () => {
    const vendor = await selectVendor("plumber", orgId);
    expect(vendor).toBeNull();
  });
});
