import { NextResponse } from "next/server";
import { parseInboundSms } from "@/lib/messaging/sms";
import { isDuplicate, markProcessed } from "@/lib/messaging/dedup";
import { checkRateLimit } from "@/lib/messaging/rate-limit";
import { logMessage } from "@/lib/db/queries/messages";
import { db } from "@/lib/db";
import { organizations } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { inngest } from "@/lib/inngest/client";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const payload: Record<string, string> = {};
    formData.forEach((value, key) => {
      payload[key] = value.toString();
    });

    const message = parseInboundSms(payload);

    // Look up org by Twilio phone number
    const [org] = await db
      .select()
      .from(organizations)
      .where(eq(organizations.twilioPhoneNumber, message.to))
      .limit(1);

    if (!org) {
      console.warn(`No org found for inbound SMS to: ${message.to}`);
      // Return TwiML with empty response (don't reply to unknown numbers)
      return new Response(
        '<?xml version="1.0" encoding="UTF-8"?><Response></Response>',
        { headers: { "Content-Type": "text/xml" } }
      );
    }

    // Deduplicate
    if (await isDuplicate(message.externalMessageId, org.id)) {
      return new Response(
        '<?xml version="1.0" encoding="UTF-8"?><Response></Response>',
        { headers: { "Content-Type": "text/xml" } }
      );
    }

    // Rate limit
    const rateCheck = await checkRateLimit(message.from, org.id);
    if (!rateCheck.allowed) {
      return new Response(
        '<?xml version="1.0" encoding="UTF-8"?><Response></Response>',
        { headers: { "Content-Type": "text/xml" } }
      );
    }

    // Mark as processed
    await markProcessed(message.externalMessageId, org.id, "sms");

    // Log inbound message
    await logMessage({
      orgId: org.id,
      direction: "inbound",
      channel: "sms",
      externalMessageId: message.externalMessageId,
      fromAddress: message.from,
      toAddress: message.to,
      body: message.body,
      messageType: "system",
      status: "received",
    });

    await inngest.send({
      name: "message/received",
      data: { message, orgId: org.id },
    });

    // Return empty TwiML (actual reply sent asynchronously via the pipeline)
    return new Response(
      '<?xml version="1.0" encoding="UTF-8"?><Response></Response>',
      { headers: { "Content-Type": "text/xml" } }
    );
  } catch (error) {
    console.error("SMS webhook error:", error);
    return new Response(
      '<?xml version="1.0" encoding="UTF-8"?><Response></Response>',
      { headers: { "Content-Type": "text/xml" }, status: 500 }
    );
  }
}
