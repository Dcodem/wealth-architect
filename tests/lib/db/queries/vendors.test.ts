import { describe, it, expect, beforeEach, afterAll } from "vitest";
import { createTestOrg, createTestVendor, cleanupTestData } from "../../../helpers/seed";
import { createVendor, getVendor, updateVendor, deleteVendor, findVendorsByTrade } from "@/lib/db/queries/vendors";

describe("vendors queries", () => {
  let orgId: string;
  let otherOrgId: string;

  beforeEach(async () => {
    await cleanupTestData();
    const org = await createTestOrg();
    orgId = org.id;
    const otherOrg = await createTestOrg({ name: "Other" });
    otherOrgId = otherOrg.id;
  });

  afterAll(async () => { await cleanupTestData(); });

  it("finds vendors by trade ordered by preference score desc", async () => {
    await createTestVendor(orgId, { name: "Joe Plumbing", trade: "plumber", preferenceScore: 0.3 });
    await createTestVendor(orgId, { name: "AceFix", trade: "plumber", preferenceScore: 0.9 });
    await createTestVendor(orgId, { name: "Sparky", trade: "electrician" });

    const result = await findVendorsByTrade("plumber", orgId);
    expect(result).toHaveLength(2);
    expect(result[0].name).toBe("AceFix");
  });

  it("does not return vendors from another org", async () => {
    await createTestVendor(orgId, { name: "Our Plumber", trade: "plumber" });
    await createTestVendor(otherOrgId, { name: "Their Plumber", trade: "plumber" });

    const result = await findVendorsByTrade("plumber", orgId);
    expect(result).toHaveLength(1);
  });

  it("CRUD lifecycle works", async () => {
    const vendor = await createVendor(orgId, { name: "New Plumber", trade: "plumber", phone: "+15551234567" });
    expect(vendor.orgId).toBe(orgId);

    const updated = await updateVendor(vendor.id, orgId, { rateNotes: "$80/hr" });
    expect(updated!.rateNotes).toBe("$80/hr");

    expect(await deleteVendor(vendor.id, orgId)).toBe(true);
    expect(await getVendor(vendor.id, orgId)).toBeNull();
  });
});
