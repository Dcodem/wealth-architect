import sgMail from "@sendgrid/mail";
import type { InboundMessage, SendResult } from "./types";

// Initialize SendGrid if API key is available
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

/**
 * Send an email via SendGrid.
 */
export async function sendEmail(
  to: string,
  from: string,
  subject: string,
  body: string
): Promise<SendResult> {
  try {
    const [response] = await sgMail.send({
      to,
      from,
      subject,
      text: body,
    });

    return {
      success: true,
      externalMessageId: response.headers["x-message-id"] as string,
      channel: "email",
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown email send error",
      channel: "email",
    };
  }
}

/**
 * Parse a SendGrid Inbound Parse webhook payload into our normalized format.
 */
export function parseInboundEmail(
  payload: Record<string, string>
): InboundMessage {
  const headers = payload.headers || "";
  const messageIdMatch = headers.match(/Message-ID:\s*(<[^>]+>)/i);
  const externalMessageId =
    messageIdMatch?.[1] || `fallback-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  // Extract plain email from "Display Name <email>" format
  const fromRaw = payload.from || "";
  const emailMatch = fromRaw.match(/<([^>]+)>/);
  const from = emailMatch ? emailMatch[1] : fromRaw.trim();

  // Extract recipient
  let to = payload.to || "";
  const toEmailMatch = to.match(/<([^>]+)>/);
  if (toEmailMatch) to = toEmailMatch[1];

  return {
    externalMessageId,
    channel: "email",
    from: from.toLowerCase(),
    to: to.toLowerCase(),
    subject: payload.subject || undefined,
    body: payload.text || payload.html || "",
    rawPayload: payload,
    receivedAt: new Date(),
  };
}
