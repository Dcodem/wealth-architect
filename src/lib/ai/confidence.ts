import type { ConfidenceTier } from "@/lib/pipeline/types";

const DEFAULT_THRESHOLDS = { high: 0.85, medium: 0.5 };

export function getConfidenceTier(
  score: number,
  thresholds?: { high: number; medium: number }
): ConfidenceTier {
  const t = thresholds || DEFAULT_THRESHOLDS;
  if (score >= t.high) return "high";
  if (score >= t.medium) return "medium";
  return "low";
}

interface SpendingCheckInput {
  confidenceTier: ConfidenceTier;
  estimatedCost: number; // cents
  orgSpendingLimit: number; // cents
  urgency: string;
  orgEmergencyLimit: number; // cents
}

interface SpendingCheckResult {
  authorized: boolean;
  reason?: string;
}

export function checkSpendingAuthority(input: SpendingCheckInput): SpendingCheckResult {
  // Only high confidence can authorize spending
  if (input.confidenceTier !== "high") {
    return { authorized: false, reason: "Insufficient confidence tier — requires PM approval" };
  }

  // Determine applicable limit
  const limit = input.urgency === "critical"
    ? input.orgEmergencyLimit
    : input.orgSpendingLimit;

  if (input.estimatedCost > limit) {
    return {
      authorized: false,
      reason: `Estimated cost ($${(input.estimatedCost / 100).toFixed(2)}) exceeds ${input.urgency === "critical" ? "emergency" : ""} limit ($${(limit / 100).toFixed(2)})`,
    };
  }

  return { authorized: true };
}
