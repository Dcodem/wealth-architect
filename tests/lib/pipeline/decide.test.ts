import { describe, it, expect } from "vitest";
import { makeDecision } from "@/lib/pipeline/decide";
import type { ClassificationResult } from "@/lib/pipeline/types";

const baseClassification: ClassificationResult = {
  category: "maintenance",
  urgency: "high",
  confidenceScore: 0.92,
  summary: "Burst pipe",
  suggestedActions: [
    { type: "reply_to_tenant", message: "Help is on the way.", channel: "sms" },
    { type: "dispatch_vendor", trade: "plumber", description: "Emergency pipe repair" },
    { type: "notify_pm", message: "Critical: burst pipe" },
  ],
  tenantReply: "Help is on the way.",
};

describe("makeDecision", () => {
  it("executes all actions at high confidence", () => {
    const result = makeDecision(baseClassification, { high: 0.85, medium: 0.5 });
    expect(result.tier).toBe("high");
    expect(result.actionsToExecute).toHaveLength(3);
    expect(result.actionsToEscalate).toHaveLength(0);
    expect(result.shouldNotifyPm).toBe(false); // high = autonomous
  });

  it("executes but notifies PM at medium confidence", () => {
    const medClassification = { ...baseClassification, confidenceScore: 0.7 };
    const result = makeDecision(medClassification, { high: 0.85, medium: 0.5 });
    expect(result.tier).toBe("medium");
    expect(result.actionsToExecute).toHaveLength(3);
    expect(result.shouldNotifyPm).toBe(true);
  });

  it("escalates all actions at low confidence", () => {
    const lowClassification = { ...baseClassification, confidenceScore: 0.3 };
    const result = makeDecision(lowClassification, { high: 0.85, medium: 0.5 });
    expect(result.tier).toBe("low");
    expect(result.actionsToExecute).toHaveLength(0);
    expect(result.actionsToEscalate).toHaveLength(3);
    expect(result.shouldNotifyPm).toBe(true);
  });
});
