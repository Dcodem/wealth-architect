import type { Property, Tenant, Case } from "@/lib/db/schema";

export const CLASSIFICATION_SYSTEM_PROMPT = `You are an AI assistant for a property management company. Your job is to classify incoming tenant messages and generate appropriate responses.

You will receive a tenant message along with context about the property and tenant history. You must:

1. Classify the message into a category
2. Assess urgency
3. Provide a confidence score (0-1) for your classification
4. Suggest actions to take
5. Draft a reply to the tenant

Categories: maintenance, noise_complaint, lease_question, payment, emergency, general

Urgency levels:
- critical: Immediate danger or severe property damage (burst pipe, fire, gas leak, flood, no heat in winter)
- high: Significant inconvenience but not dangerous (no hot water, AC out in summer, broken lock, major appliance failure)
- medium: Needs attention but can wait (fridge issues, dishwasher problems, slow drain)
- low: Minor or cosmetic (squeaky door, paint touch-up, minor repairs)

Respond in JSON format:
{
  "category": "maintenance" | "noise_complaint" | "lease_question" | "payment" | "emergency" | "general",
  "urgency": "critical" | "high" | "medium" | "low",
  "confidenceScore": 0.0-1.0,
  "summary": "Brief one-line summary of the issue",
  "suggestedActions": [
    { "type": "reply_to_tenant", "message": "Your reply text" },
    { "type": "dispatch_vendor", "trade": "plumber|electrician|hvac|general|locksmith|appliance_repair|pest_control|cleaning|other", "description": "What needs to be done" },
    { "type": "notify_pm", "message": "Summary for property manager" }
  ],
  "tenantReply": "The full reply to send to the tenant"
}`;

export function buildClassificationPrompt(params: {
  message: string;
  tenant: Tenant | null;
  property: Property | null;
  recentCases: Case[];
  channel: "email" | "sms";
}): string {
  const lines: string[] = [];

  lines.push(`--- INCOMING MESSAGE (via ${params.channel}) ---`);
  lines.push(params.message);
  lines.push("");

  if (params.tenant) {
    lines.push("--- TENANT INFO ---");
    lines.push(`Name: ${params.tenant.name}`);
    if (params.tenant.unitNumber) lines.push(`Unit: ${params.tenant.unitNumber}`);
    lines.push("");
  } else {
    lines.push("--- TENANT INFO ---");
    lines.push("Unknown sender — not matched to an existing tenant.");
    lines.push("");
  }

  if (params.property) {
    lines.push("--- PROPERTY INFO ---");
    lines.push(`Address: ${params.property.address}`);
    if (params.property.notes) lines.push(`Notes: ${params.property.notes}`);
    lines.push("");
  }

  if (params.recentCases.length > 0) {
    lines.push("--- RECENT CASES ---");
    for (const c of params.recentCases.slice(0, 5)) {
      lines.push(`- [${c.status}] ${c.category || "uncategorized"} (${c.urgency || "unknown"}): ${c.rawMessage.substring(0, 100)}`);
    }
    lines.push("");
  }

  lines.push("Classify this message and suggest actions. Respond in JSON only.");

  return lines.join("\n");
}
