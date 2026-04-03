import type { InboundMessage, Channel } from "@/lib/messaging/types";
import type { Tenant, Property, Organization, Vendor, Case } from "@/lib/db/schema";

export interface PipelineContext {
  message: InboundMessage;
  orgId: string;
  org: Organization;
  tenant: Tenant | null;
  property: Property | null;
  existingCases: Case[];
  isNewTenant: boolean;
}

export interface ClassificationResult {
  category: string;
  urgency: "critical" | "high" | "medium" | "low";
  confidenceScore: number;
  suggestedActions: SuggestedAction[];
  tenantReply: string;
  summary: string;
}

export type SuggestedAction =
  | { type: "reply_to_tenant"; message: string; channel: Channel }
  | { type: "notify_pm"; message: string }
  | { type: "dispatch_vendor"; trade: string; description: string }
  | { type: "schedule_followup"; delayMs: number; message: string };

export type ConfidenceTier = "high" | "medium" | "low";

export interface DecisionResult {
  tier: ConfidenceTier;
  actionsToExecute: SuggestedAction[];
  actionsToEscalate: SuggestedAction[];
  shouldNotifyPm: boolean;
  caseId: string;
}

export const DEFAULT_URGENCY_TIMERS = {
  critical: { vendorResponse: 10 * 60_000, reminder: 15 * 60_000, nextVendor: 20 * 60_000, pmEscalation: 30 * 60_000 },
  high: { vendorResponse: 30 * 60_000, reminder: 60 * 60_000, nextVendor: 2 * 60 * 60_000, pmEscalation: 3 * 60 * 60_000 },
  medium: { vendorResponse: 24 * 60 * 60_000, reminder: 36 * 60 * 60_000, nextVendor: 48 * 60 * 60_000, pmEscalation: 48 * 60 * 60_000 },
  low: { vendorResponse: 48 * 60 * 60_000, reminder: 72 * 60 * 60_000, nextVendor: 7 * 24 * 60 * 60_000, pmEscalation: 7 * 24 * 60 * 60_000 },
} as const;
