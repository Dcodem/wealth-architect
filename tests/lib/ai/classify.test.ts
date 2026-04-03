import { describe, it, expect, vi } from "vitest";
import { parseClassificationResponse } from "@/lib/ai/classify";

describe("classification", () => {
  describe("parseClassificationResponse", () => {
    it("parses valid JSON response", () => {
      const response = JSON.stringify({
        category: "maintenance",
        urgency: "critical",
        confidenceScore: 0.95,
        summary: "Burst pipe in kitchen",
        suggestedActions: [
          { type: "reply_to_tenant", message: "We're sending help right away." },
          { type: "dispatch_vendor", trade: "plumber", description: "Emergency pipe repair" },
          { type: "notify_pm", message: "Critical: burst pipe at Unit 4B" },
        ],
        tenantReply: "We've received your emergency report about the burst pipe. A plumber is being dispatched immediately.",
      });

      const result = parseClassificationResponse(response);
      expect(result.category).toBe("maintenance");
      expect(result.urgency).toBe("critical");
      expect(result.confidenceScore).toBe(0.95);
      expect(result.suggestedActions).toHaveLength(3);
      expect(result.tenantReply).toContain("plumber");
    });

    it("extracts JSON from markdown code blocks", () => {
      const response = '```json\n{"category":"general","urgency":"low","confidenceScore":0.6,"summary":"General inquiry","suggestedActions":[],"tenantReply":"Thanks for reaching out."}\n```';
      const result = parseClassificationResponse(response);
      expect(result.category).toBe("general");
    });

    it("returns fallback for unparseable response", () => {
      const result = parseClassificationResponse("I don't understand");
      expect(result.category).toBe("general");
      expect(result.urgency).toBe("medium");
      expect(result.confidenceScore).toBeLessThan(0.5);
    });
  });
});
