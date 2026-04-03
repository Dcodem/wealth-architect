import { send } from "@/lib/messaging/send";
import { addTimelineEntry, updateCase } from "@/lib/db/queries/cases";
import { dispatchVendor } from "@/lib/vendor/dispatch";
import { selectVendor } from "@/lib/vendor/select";
import { pmNotification, urgencyEmoji } from "@/lib/messaging/templates";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import type { DecisionResult, PipelineContext, ClassificationResult } from "./types";

export async function executeActions(
  decision: DecisionResult,
  context: PipelineContext,
  classification: ClassificationResult
) {
  const results: Array<{ action: string; success: boolean; error?: string }> = [];

  for (const action of decision.actionsToExecute) {
    switch (action.type) {
      case "reply_to_tenant": {
        if (!context.tenant) break;
        const to = context.message.channel === "email"
          ? context.tenant.email
          : context.tenant.phone;
        const from = context.message.channel === "email"
          ? context.org.emailAddress
          : context.org.twilioPhoneNumber;

        if (to && from) {
          const result = await send({
            channel: context.message.channel,
            to,
            from,
            subject: context.message.channel === "email" ? "Re: Your maintenance request" : undefined,
            body: classification.tenantReply,
            orgId: context.orgId,
            caseId: decision.caseId,
            messageType: "tenant_reply",
          });

          await addTimelineEntry(decision.caseId, {
            type: "replied_to_tenant",
            details: `Replied via ${context.message.channel}`,
            metadata: { success: result.success },
          });

          results.push({ action: "reply_to_tenant", success: result.success });
        }
        break;
      }

      case "dispatch_vendor": {
        if (!context.property) break;

        const vendor = await selectVendor(action.trade as any, context.orgId);
        if (vendor) {
          const caseRecord = await import("@/lib/db/queries/cases").then(m => m.getCase(decision.caseId, context.orgId));
          if (caseRecord) {
            const result = await dispatchVendor({
              vendor,
              property: context.property,
              caseRecord,
              issueDescription: action.description,
              orgId: context.orgId,
              orgPhoneNumber: context.org.twilioPhoneNumber,
              orgEmail: context.org.emailAddress,
            });
            results.push({ action: "dispatch_vendor", success: result.success });
          }
        } else {
          await addTimelineEntry(decision.caseId, {
            type: "dispatched_vendor",
            details: `No ${action.trade} vendor available — escalating to PM`,
          });
          results.push({ action: "dispatch_vendor", success: false, error: "No vendor available" });
        }
        break;
      }

      case "notify_pm": {
        // Handled below if shouldNotifyPm is true
        break;
      }

      case "schedule_followup": {
        // Will be handled by Inngest delayed step
        await addTimelineEntry(decision.caseId, {
          type: "follow_up_scheduled",
          details: `Follow-up scheduled in ${action.delayMs / 60000} minutes`,
        });
        results.push({ action: "schedule_followup", success: true });
        break;
      }
    }
  }

  // Notify PM if required (medium confidence, or any escalation)
  if (decision.shouldNotifyPm) {
    await notifyPropertyManager(decision, context, classification);
  }

  return results;
}

async function notifyPropertyManager(
  decision: DecisionResult,
  context: PipelineContext,
  classification: ClassificationResult
) {
  // Get PM user
  const [pmUser] = await db
    .select()
    .from(users)
    .where(eq(users.orgId, context.orgId))
    .limit(1);

  if (!pmUser?.phone && !pmUser?.email) return;

  const actionsTaken = decision.actionsToExecute.map((a) => {
    switch (a.type) {
      case "reply_to_tenant": return "Replied to tenant";
      case "dispatch_vendor": return `Dispatched ${a.trade}`;
      case "notify_pm": return a.message;
      default: return "Action taken";
    }
  });

  const pendingActions = decision.actionsToEscalate.map((a) => {
    switch (a.type) {
      case "reply_to_tenant": return "Reply to tenant (awaiting approval)";
      case "dispatch_vendor": return `Dispatch ${a.trade} (awaiting approval)`;
      case "notify_pm": return a.message;
      default: return "Action pending";
    }
  });

  const body = pmNotification({
    urgencyEmoji: urgencyEmoji(classification.urgency),
    urgency: classification.urgency,
    unitNumber: context.tenant?.unitNumber || undefined,
    address: context.property?.address || "Unknown property",
    tenantName: context.tenant?.name || "Unknown tenant",
    issueSummary: classification.summary,
    actionsTaken,
    pendingActions,
  });

  // Prefer SMS for urgent, email for non-urgent
  const isUrgent = classification.urgency === "critical" || classification.urgency === "high";
  const channel = isUrgent && pmUser.phone ? "sms" : "email";
  const to = channel === "sms" ? pmUser.phone! : pmUser.email;
  const from = channel === "sms"
    ? context.org.twilioPhoneNumber
    : context.org.emailAddress;

  if (from) {
    await send({
      channel,
      to,
      from,
      subject: channel === "email" ? `[The Wealth Architect] ${classification.urgency.toUpperCase()}: ${classification.summary}` : undefined,
      body,
      orgId: context.orgId,
      caseId: decision.caseId,
      messageType: "pm_notification",
    });

    await addTimelineEntry(decision.caseId, {
      type: "notified_manager",
      details: `Notified PM via ${channel} (${decision.tier} confidence)`,
    });
  }
}
