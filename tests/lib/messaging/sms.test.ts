import { describe, it, expect } from "vitest";
import { parseInboundSms } from "@/lib/messaging/sms";

describe("sms adapter", () => {
  describe("parseInboundSms", () => {
    it("parses a Twilio inbound SMS payload", () => {
      const payload = {
        MessageSid: "SM1234567890abcdef",
        From: "+15551234567",
        To: "+15559876543",
        Body: "My kitchen pipe burst!",
        NumMedia: "0",
      };

      const msg = parseInboundSms(payload);
      expect(msg.channel).toBe("sms");
      expect(msg.externalMessageId).toBe("SM1234567890abcdef");
      expect(msg.from).toBe("+15551234567");
      expect(msg.to).toBe("+15559876543");
      expect(msg.body).toBe("My kitchen pipe burst!");
      expect(msg.subject).toBeUndefined();
    });

    it("trims whitespace from body", () => {
      const payload = {
        MessageSid: "SM-abc",
        From: "+15551111111",
        To: "+15552222222",
        Body: "  Help with my AC  ",
      };

      const msg = parseInboundSms(payload);
      expect(msg.body).toBe("Help with my AC");
    });
  });
});
