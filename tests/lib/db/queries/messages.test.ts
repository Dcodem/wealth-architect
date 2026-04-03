import { describe, it, expect, beforeEach, afterAll } from "vitest";
import { createTestOrg, cleanupTestData } from "../../../helpers/seed";
import {
  logMessage,
  updateMessageStatus,
  getMessagesByCase,
} from "@/lib/db/queries/messages";

describe("messages queries", () => {
  let orgId: string;

  beforeEach(async () => {
    await cleanupTestData();
    const org = await createTestOrg();
    orgId = org.id;
  });

  afterAll(async () => {
    await cleanupTestData();
  });

  it("logs an outbound message and retrieves by case", async () => {
    const msg = await logMessage({
      orgId,
      direction: "outbound",
      channel: "sms",
      fromAddress: "+15551234567",
      toAddress: "+15559876543",
      body: "We received your request and are sending a plumber.",
      messageType: "tenant_reply",
      status: "sent",
      externalMessageId: "SM123abc",
    });

    expect(msg.id).toBeDefined();
    expect(msg.status).toBe("sent");
  });

  it("updates delivery status", async () => {
    const msg = await logMessage({
      orgId,
      direction: "outbound",
      channel: "email",
      fromAddress: "acme@propagent.ai",
      toAddress: "tenant@example.com",
      body: "Your plumber has been dispatched.",
      messageType: "tenant_update",
      status: "sent",
      externalMessageId: "sg-abc-123",
    });

    const updated = await updateMessageStatus(
      msg.id,
      "delivered"
    );
    expect(updated!.status).toBe("delivered");
  });

  it("updates status to failed with error message", async () => {
    const msg = await logMessage({
      orgId,
      direction: "outbound",
      channel: "sms",
      fromAddress: "+15551234567",
      toAddress: "+15559999999",
      body: "Test",
      messageType: "system",
      status: "sent",
      externalMessageId: "SM-fail-123",
    });

    const updated = await updateMessageStatus(
      msg.id,
      "failed",
      "Invalid phone number"
    );
    expect(updated!.status).toBe("failed");
    expect(updated!.errorMessage).toBe("Invalid phone number");
  });
});
