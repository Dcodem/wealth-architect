export type Channel = "email" | "sms";

/**
 * Normalized inbound message — same shape regardless of whether
 * it came from SendGrid (email) or Twilio (SMS).
 */
export interface InboundMessage {
  externalMessageId: string;
  channel: Channel;
  from: string; // email address or phone number
  to: string; // org email address or Twilio number
  subject?: string; // email only
  body: string; // plain text body
  rawPayload: Record<string, unknown>; // full provider payload for debugging
  receivedAt: Date;
}

/**
 * What the send() function needs to deliver a message.
 */
export interface OutboundMessage {
  channel: Channel;
  to: string; // email address or phone number
  from: string; // org email address or Twilio number
  subject?: string; // email only
  body: string;
  orgId: string;
  caseId?: string; // link to case for tracking
  messageType: MessageType;
}

export type MessageType =
  | "tenant_reply"
  | "tenant_update"
  | "pm_notification"
  | "vendor_dispatch"
  | "vendor_followup"
  | "system";

/**
 * Result of sending a message.
 */
export interface SendResult {
  success: boolean;
  externalMessageId?: string;
  error?: string;
  channel: Channel;
}

/**
 * Delivery status update from provider callbacks.
 */
export interface DeliveryStatus {
  externalMessageId: string;
  channel: Channel;
  status: "delivered" | "failed" | "bounced" | "undelivered";
  errorMessage?: string;
  timestamp: Date;
}
