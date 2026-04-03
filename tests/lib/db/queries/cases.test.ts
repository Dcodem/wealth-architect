import { describe, it, expect, beforeEach, afterAll } from "vitest";
import { createTestOrg, createTestProperty, createTestTenant, createTestVendor, cleanupTestData } from "../../../helpers/seed";
import { createCase, getCaseWithTimeline, addTimelineEntry, listCases, updateCase, findOpenCasesByTenant } from "@/lib/db/queries/cases";

describe("cases queries", () => {
  let orgId: string;
  let propertyId: string;
  let tenantId: string;

  beforeEach(async () => {
    await cleanupTestData();
    const org = await createTestOrg();
    orgId = org.id;
    const property = await createTestProperty(orgId);
    propertyId = property.id;
    const tenant = await createTestTenant(propertyId, orgId);
    tenantId = tenant.id;
  });

  afterAll(async () => { await cleanupTestData(); });

  it("creates a case and retrieves it with timeline", async () => {
    const newCase = await createCase(orgId, {
      tenantId, propertyId, source: "email",
      rawMessage: "My kitchen pipe burst!", category: "emergency",
      urgency: "critical", confidenceScore: 0.92, status: "open",
    });
    expect(newCase.orgId).toBe(orgId);

    await addTimelineEntry(newCase.id, { type: "classified", details: "emergency/critical" });
    await addTimelineEntry(newCase.id, { type: "replied_to_tenant", details: "Sent ack" });

    const full = await getCaseWithTimeline(newCase.id, orgId);
    expect(full!.timeline).toHaveLength(2);
    expect(full!.timeline[0].type).toBe("classified");
  });

  it("filters cases by status", async () => {
    await createCase(orgId, { tenantId, propertyId, source: "sms", rawMessage: "Open", status: "open" });
    await createCase(orgId, { tenantId, propertyId, source: "sms", rawMessage: "Resolved", status: "resolved" });

    const openCases = await listCases(orgId, { status: "open" });
    expect(openCases).toHaveLength(1);
    expect(openCases[0].rawMessage).toBe("Open");
  });

  it("finds open cases by tenant", async () => {
    await createCase(orgId, { tenantId, propertyId, source: "email", rawMessage: "Leaky faucet", status: "in_progress" });
    await createCase(orgId, { tenantId, propertyId, source: "email", rawMessage: "Old issue", status: "resolved" });

    const open = await findOpenCasesByTenant(tenantId, orgId);
    expect(open).toHaveLength(1);
    expect(open[0].rawMessage).toBe("Leaky faucet");
  });

  it("updates case status and vendor", async () => {
    const c = await createCase(orgId, { tenantId, propertyId, source: "sms", rawMessage: "Broken lock", status: "open" });
    const vendor = await createTestVendor(orgId, { trade: "locksmith" });
    const updated = await updateCase(c.id, orgId, { status: "waiting_on_vendor", vendorId: vendor.id });
    expect(updated!.status).toBe("waiting_on_vendor");
    expect(updated!.vendorId).toBe(vendor.id);
  });
});
