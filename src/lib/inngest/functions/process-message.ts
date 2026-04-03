import { inngest } from "../client";
import { identifySender } from "@/lib/pipeline/identify";
import { enrichContext } from "@/lib/pipeline/enrich";
import { classifyMessage } from "@/lib/ai/classify";
import { makeDecision } from "@/lib/pipeline/decide";
import { executeActions } from "@/lib/pipeline/execute";
import { createCase, addTimelineEntry } from "@/lib/db/queries/cases";
import type { InboundMessage } from "@/lib/messaging/types";
import type { PipelineContext, ClassificationResult, DecisionResult } from "@/lib/pipeline/types";

export const processMessage = inngest.createFunction(
  {
    id: "process-message",
    retries: 2,
    triggers: [{ event: "message/received" }],
  },
  async ({ event, step }) => {
    const { message, orgId } = event.data as {
      message: InboundMessage;
      orgId: string;
    };

    // Step 1: Identify sender
    const identity = await step.run("identify-sender", async () => {
      return identifySender(message.from, message.channel, orgId);
    }) as unknown as Awaited<ReturnType<typeof identifySender>>;

    // Step 2: Enrich context
    const context = await step.run("enrich-context", async () => {
      return enrichContext({
        message,
        orgId,
        tenant: identity.tenant,
        property: identity.property,
        isNewTenant: identity.isNewTenant,
      });
    }) as unknown as PipelineContext;

    // Step 3: Classify with Claude
    const classification = await step.run("classify-message", async () => {
      return classifyMessage({
        message: message.body,
        tenant: context.tenant,
        property: context.property,
        recentCases: context.existingCases,
        channel: message.channel,
      });
    }) as ClassificationResult;

    // Create or update case
    const caseRecord = await step.run("create-case", async () => {
      const newCase = await createCase(orgId, {
        tenantId: context.tenant?.id ?? null,
        propertyId: context.property?.id ?? null,
        source: message.channel,
        rawMessage: message.body,
        category: classification.category as any,
        urgency: classification.urgency as any,
        confidenceScore: classification.confidenceScore,
        status: "open",
      });

      await addTimelineEntry(newCase.id, {
        type: "classified",
        details: `${classification.category}/${classification.urgency} (confidence: ${classification.confidenceScore.toFixed(2)})`,
        metadata: {
          category: classification.category,
          urgency: classification.urgency,
          confidence: classification.confidenceScore,
          summary: classification.summary,
        },
      });

      return newCase;
    }) as unknown as Awaited<ReturnType<typeof createCase>>;

    // Step 4: Decide
    const decision = await step.run("make-decision", async () => {
      const thresholds = context.org.confidenceThresholds as { high: number; medium: number } || { high: 0.85, medium: 0.5 };
      const result = makeDecision(classification, thresholds);
      result.caseId = caseRecord.id;
      return result;
    }) as DecisionResult;

    // Step 5: Execute
    const executionResults = await step.run("execute-actions", async () => {
      return executeActions(decision, context, classification);
    });

    return {
      caseId: caseRecord.id,
      tier: decision.tier,
      classification: {
        category: classification.category,
        urgency: classification.urgency,
        confidence: classification.confidenceScore,
      },
      executionResults,
    };
  }
);
