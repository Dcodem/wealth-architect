import Anthropic from "@anthropic-ai/sdk";
import { CLASSIFICATION_SYSTEM_PROMPT, buildClassificationPrompt } from "./prompts";
import type { ClassificationResult } from "@/lib/pipeline/types";
import type { Property, Tenant, Case } from "@/lib/db/schema";

let anthropicClient: Anthropic | null = null;

function getClient(): Anthropic {
  if (!anthropicClient) {
    anthropicClient = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  }
  return anthropicClient;
}

export async function classifyMessage(params: {
  message: string;
  tenant: Tenant | null;
  property: Property | null;
  recentCases: Case[];
  channel: "email" | "sms";
}): Promise<ClassificationResult> {
  const client = getClient();
  const userPrompt = buildClassificationPrompt(params);

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    system: CLASSIFICATION_SYSTEM_PROMPT,
    messages: [{ role: "user", content: userPrompt }],
  });

  const text = response.content
    .filter((block) => block.type === "text")
    .map((block) => (block as { type: "text"; text: string }).text)
    .join("");

  return parseClassificationResponse(text);
}

export function parseClassificationResponse(text: string): ClassificationResult {
  try {
    // Extract JSON from markdown code blocks if present
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    const jsonStr = jsonMatch ? jsonMatch[1].trim() : text.trim();

    const parsed = JSON.parse(jsonStr);

    return {
      category: parsed.category || "general",
      urgency: parsed.urgency || "medium",
      confidenceScore: typeof parsed.confidenceScore === "number" ? parsed.confidenceScore : 0.5,
      suggestedActions: Array.isArray(parsed.suggestedActions) ? parsed.suggestedActions : [],
      tenantReply: parsed.tenantReply || "We've received your message and will get back to you shortly.",
      summary: parsed.summary || "Incoming message",
    };
  } catch {
    // Fallback for unparseable responses
    return {
      category: "general",
      urgency: "medium",
      confidenceScore: 0.3,
      suggestedActions: [
        { type: "notify_pm", message: `Could not auto-classify: ${text.substring(0, 200)}` },
      ],
      tenantReply: "We've received your message and will get back to you shortly.",
      summary: "Unclassified message — requires PM review",
    };
  }
}
