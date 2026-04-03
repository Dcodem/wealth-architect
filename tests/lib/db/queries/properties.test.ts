import { describe, it, expect, beforeEach, afterAll } from "vitest";
import { createTestOrg, createTestProperty, cleanupTestData } from "../../../helpers/seed";
import {
  listProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty,
} from "@/lib/db/queries/properties";

describe("properties queries", () => {
  let orgId: string;
  let otherOrgId: string;

  beforeEach(async () => {
    await cleanupTestData();
    const org = await createTestOrg();
    orgId = org.id;
    const otherOrg = await createTestOrg({ name: "Other Company" });
    otherOrgId = otherOrg.id;
  });

  afterAll(async () => {
    await cleanupTestData();
  });

  it("returns only properties for the given org", async () => {
    await createTestProperty(orgId, { address: "123 Main St" });
    await createTestProperty(orgId, { address: "456 Oak Ave" });
    await createTestProperty(otherOrgId, { address: "789 Elm Blvd" });

    const result = await listProperties(orgId);
    expect(result).toHaveLength(2);
    expect(result.map((p) => p.address)).not.toContain("789 Elm Blvd");
  });

  it("returns null for a property in a different org", async () => {
    const property = await createTestProperty(otherOrgId);
    const result = await getProperty(property.id, orgId);
    expect(result).toBeNull();
  });

  it("creates a property scoped to the org", async () => {
    const property = await createProperty(orgId, {
      address: "100 New St",
      unitCount: 4,
      type: "residential",
      accessInstructions: "Gate code: 1234",
      parkingInstructions: "Visitor lot in rear",
    });
    expect(property.orgId).toBe(orgId);
    expect(property.address).toBe("100 New St");
  });

  it("updates a property within the org", async () => {
    const property = await createTestProperty(orgId);
    const updated = await updateProperty(property.id, orgId, {
      parkingInstructions: "Street parking only",
    });
    expect(updated!.parkingInstructions).toBe("Street parking only");
  });

  it("returns null when updating a property in a different org", async () => {
    const property = await createTestProperty(otherOrgId);
    const updated = await updateProperty(property.id, orgId, { address: "Hacked" });
    expect(updated).toBeNull();
  });

  it("deletes a property and returns false for cross-org delete", async () => {
    const property = await createTestProperty(orgId);
    expect(await deleteProperty(property.id, orgId)).toBe(true);
    expect(await getProperty(property.id, orgId)).toBeNull();

    const otherProp = await createTestProperty(otherOrgId);
    expect(await deleteProperty(otherProp.id, orgId)).toBe(false);
  });
});
