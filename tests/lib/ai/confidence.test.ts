import { describe, it, expect } from "vitest";
import { getConfidenceTier, checkSpendingAuthority } from "@/lib/ai/confidence";

describe("confidence tiers", () => {
  it("returns high for score >= 0.85", () => {
    expect(getConfidenceTier(0.92)).toBe("high");
    expect(getConfidenceTier(0.85)).toBe("high");
  });

  it("returns medium for score 0.5-0.85", () => {
    expect(getConfidenceTier(0.7)).toBe("medium");
    expect(getConfidenceTier(0.5)).toBe("medium");
  });

  it("returns low for score < 0.5", () => {
    expect(getConfidenceTier(0.3)).toBe("low");
    expect(getConfidenceTier(0)).toBe("low");
  });

  it("uses custom thresholds", () => {
    expect(getConfidenceTier(0.8, { high: 0.9, medium: 0.6 })).toBe("medium");
    expect(getConfidenceTier(0.5, { high: 0.9, medium: 0.6 })).toBe("low");
  });
});

describe("spending authority", () => {
  it("allows spending under org limit with high confidence", () => {
    const result = checkSpendingAuthority({
      confidenceTier: "high",
      estimatedCost: 30000, // $300 in cents
      orgSpendingLimit: 50000, // $500
      urgency: "high",
      orgEmergencyLimit: 100000,
    });
    expect(result.authorized).toBe(true);
  });

  it("denies spending with medium confidence", () => {
    const result = checkSpendingAuthority({
      confidenceTier: "medium",
      estimatedCost: 30000,
      orgSpendingLimit: 50000,
      urgency: "high",
      orgEmergencyLimit: 100000,
    });
    expect(result.authorized).toBe(false);
    expect(result.reason).toContain("confidence");
  });

  it("denies spending over org limit", () => {
    const result = checkSpendingAuthority({
      confidenceTier: "high",
      estimatedCost: 60000,
      orgSpendingLimit: 50000,
      urgency: "high",
      orgEmergencyLimit: 100000,
    });
    expect(result.authorized).toBe(false);
  });

  it("uses emergency limit for critical urgency", () => {
    const result = checkSpendingAuthority({
      confidenceTier: "high",
      estimatedCost: 80000, // $800 — over normal $500, under emergency $1000
      orgSpendingLimit: 50000,
      urgency: "critical",
      orgEmergencyLimit: 100000,
    });
    expect(result.authorized).toBe(true);
  });
});
