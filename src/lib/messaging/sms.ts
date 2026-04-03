import twilio from "twilio";
import type { InboundMessage, SendResult } from "./types";

function getTwilioClient() {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  if (!accountSid || !authToken) {
    throw new Error("Twilio credentials not configured");
  }
  return twilio(accountSid, authToken);
}

/**
 * Send an SMS via Twilio.
 */
export async function sendSms(
  to: string,
  from: string,
  body: string
): Promise<SendResult> {
  try {
    const client = getTwilioClient();
    const message = await client.messages.create({
      to,
      from,
      body,
      statusCallback: process.env.TWILIO_STATUS_CALLBACK_URL || undefined,
    });

    return {
      success: true,
      externalMessageId: message.sid,
      channel: "sms",
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown SMS send error",
      channel: "sms",
    };
  }
}

/**
 * Parse a Twilio inbound SMS webhook payload into our normalized format.
 */
export function parseInboundSms(
  payload: Record<string, string>
): InboundMessage {
  return {
    externalMessageId: payload.MessageSid || `fallback-sms-${Date.now()}`,
    channel: "sms",
    from: payload.From || "",
    to: payload.To || "",
    body: (payload.Body || "").trim(),
    rawPayload: payload,
    receivedAt: new Date(),
  };
}
