import { describe, it, expect } from "vitest";
import { parseInboundEmail } from "@/lib/messaging/email";

describe("email adapter", () => {
  describe("parseInboundEmail", () => {
    it("parses a SendGrid inbound parse payload", () => {
      const payload = {
        headers: "Message-ID: <abc123@mail.example.com>\r\nFrom: tenant@example.com",
        from: "Alice Smith <tenant@example.com>",
        to: "acme@propagent.ai",
        subject: "Burst pipe in kitchen!",
        text: "Help! My kitchen pipe burst and water is everywhere.",
        envelope: JSON.stringify({
          from: "tenant@example.com",
          to: ["acme@propagent.ai"],
        }),
      };

      const msg = parseInboundEmail(payload);
      expect(msg.channel).toBe("email");
      expect(msg.from).toBe("tenant@example.com");
      expect(msg.to).toBe("acme@propagent.ai");
      expect(msg.subject).toBe("Burst pipe in kitchen!");
      expect(msg.body).toBe("Help! My kitchen pipe burst and water is everywhere.");
      expect(msg.externalMessageId).toBe("<abc123@mail.example.com>");
    });

    it("extracts email from display name format", () => {
      const payload = {
        headers: "Message-ID: <def456@mail.example.com>",
        from: "Bob Jones <bob@example.com>",
        to: "acme@propagent.ai",
        subject: "Noise complaint",
        text: "My neighbor is very loud.",
        envelope: JSON.stringify({
          from: "bob@example.com",
          to: ["acme@propagent.ai"],
        }),
      };

      const msg = parseInboundEmail(payload);
      expect(msg.from).toBe("bob@example.com");
    });

    it("generates a fallback message ID if not in headers", () => {
      const payload = {
        headers: "From: test@example.com",
        from: "test@example.com",
        to: "acme@propagent.ai",
        subject: "Test",
        text: "Test body",
        envelope: JSON.stringify({
          from: "test@example.com",
          to: ["acme@propagent.ai"],
        }),
      };

      const msg = parseInboundEmail(payload);
      expect(msg.externalMessageId).toMatch(/^fallback-/);
    });
  });
});
