import { sendEmail } from "./email";
import { sendSms } from "./sms";
import { logMessage } from "@/lib/db/queries/messages";
import type { OutboundMessage, SendResult } from "./types";

/**
 * Unified send — picks the right channel, sends, and logs to message_log.
 */
export async function send(message: OutboundMessage): Promise<SendResult> {
  let result: SendResult;

  if (message.channel === "email") {
    result = await sendEmail(
      message.to,
      message.from,
      message.subject || "The Wealth Architect Notification",
      message.body
    );
  } else {
    result = await sendSms(message.to, message.from, message.body);
  }

  // Log to message_log regardless of success/failure
  await logMessage({
    orgId: message.orgId,
    caseId: message.caseId ?? null,
    direction: "outbound",
    channel: message.channel,
    externalMessageId: result.externalMessageId ?? null,
    fromAddress: message.from,
    toAddress: message.to,
    subject: message.subject ?? null,
    body: message.body,
    messageType: message.messageType,
    status: result.success ? "sent" : "failed",
    errorMessage: result.error ?? null,
  });

  return result;
}
