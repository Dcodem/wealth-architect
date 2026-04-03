import { describe, it, expect, beforeEach, afterAll } from "vitest";
import { createTestOrg, cleanupTestData } from "../../helpers/seed";
import { isDuplicate, markProcessed } from "@/lib/messaging/dedup";

describe("deduplication", () => {
  let orgId: string;

  beforeEach(async () => {
    await cleanupTestData();
    const org = await createTestOrg();
    orgId = org.id;
  });

  afterAll(async () => {
    await cleanupTestData();
  });

  it("returns false for a new message", async () => {
    const result = await isDuplicate("msg-001", orgId);
    expect(result).toBe(false);
  });

  it("returns true after marking as processed", async () => {
    await markProcessed("msg-002", orgId, "email");
    const result = await isDuplicate("msg-002", orgId);
    expect(result).toBe(true);
  });

  it("different orgs can process the same external ID", async () => {
    const org2 = await createTestOrg({ name: "Other Org" });
    await markProcessed("msg-003", orgId, "sms");
    const result = await isDuplicate("msg-003", org2.id);
    expect(result).toBe(false);
  });
});
