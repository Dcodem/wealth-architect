import { describe, it, expect, vi, beforeEach, afterAll } from "vitest";
import { createTestOrg, cleanupTestData } from "../../helpers/seed";

// Mock the adapters before importing send
vi.mock("@/lib/messaging/email", () => ({
  sendEmail: vi.fn().mockResolvedValue({
    success: true,
    externalMessageId: "sg-mock-123",
    channel: "email",
  }),
}));

vi.mock("@/lib/messaging/sms", () => ({
  sendSms: vi.fn().mockResolvedValue({
    success: true,
    externalMessageId: "SM-mock-456",
    channel: "sms",
  }),
}));

import { send } from "@/lib/messaging/send";
import { sendEmail } from "@/lib/messaging/email";
import { sendSms } from "@/lib/messaging/sms";

describe("unified send", () => {
  let orgId: string;

  beforeEach(async () => {
    vi.clearAllMocks();
    await cleanupTestData();
    const org = await createTestOrg();
    orgId = org.id;
  });

  afterAll(async () => {
    await cleanupTestData();
  });

  it("sends an email and logs it", async () => {
    const result = await send({
      channel: "email",
      to: "tenant@example.com",
      from: "acme@propagent.ai",
      subject: "Your maintenance request",
      body: "We received your request.",
      orgId,
      messageType: "tenant_reply",
    });

    expect(result.success).toBe(true);
    expect(result.channel).toBe("email");
    expect(sendEmail).toHaveBeenCalledWith(
      "tenant@example.com",
      "acme@propagent.ai",
      "Your maintenance request",
      "We received your request."
    );
  });

  it("sends an SMS and logs it", async () => {
    const result = await send({
      channel: "sms",
      to: "+15559876543",
      from: "+15551234567",
      body: "Your plumber is on the way.",
      orgId,
      messageType: "tenant_update",
    });

    expect(result.success).toBe(true);
    expect(result.channel).toBe("sms");
    expect(sendSms).toHaveBeenCalledWith(
      "+15559876543",
      "+15551234567",
      "Your plumber is on the way."
    );
  });
});
