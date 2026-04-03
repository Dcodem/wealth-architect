import { getConfidenceTier } from "@/lib/ai/confidence";
import type { ClassificationResult, DecisionResult, ConfidenceTier } from "./types";

export function makeDecision(
  classification: ClassificationResult,
  thresholds: { high: number; medium: number }
): DecisionResult {
  const tier = getConfidenceTier(classification.confidenceScore, thresholds);

  switch (tier) {
    case "high":
      return {
        tier,
        actionsToExecute: classification.suggestedActions,
        actionsToEscalate: [],
        shouldNotifyPm: false,
        caseId: "", // Set by caller
      };

    case "medium":
      return {
        tier,
        actionsToExecute: classification.suggestedActions,
        actionsToEscalate: [],
        shouldNotifyPm: true, // Act + notify
        caseId: "",
      };

    case "low":
      return {
        tier,
        actionsToExecute: [], // Don't act
        actionsToEscalate: classification.suggestedActions,
        shouldNotifyPm: true, // Ask PM
        caseId: "",
      };
  }
}
