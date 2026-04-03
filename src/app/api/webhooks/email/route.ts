import { NextResponse } from "next/server";
import { parseInboundEmail } from "@/lib/messaging/email";
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

    const message = parseInboundEmail(payload);

    // Look up org by inbound email address
    const [org] = await db
      .select()
      .from(organizations)
      .where(eq(organizations.emailAddress, message.to))
      .limit(1);

    if (!org) {
      console.warn(`No org found for inbound email to: ${message.to}`);
      return NextResponse.json({ error: "Unknown recipient" }, { status: 404 });
    }

    // Deduplicate
    if (await isDuplicate(message.externalMessageId, org.id)) {
      return NextResponse.json({ status: "duplicate", skipped: true });
    }

    // Rate limit
    const rateCheck = await checkRateLimit(message.from, org.id);
    if (!rateCheck.allowed) {
      console.warn(`Rate limit exceeded for ${message.from} in org ${org.id}`);
      return NextResponse.json({ status: "rate_limited" }, { status: 429 });
    }

    // Mark as processed
    await markProcessed(message.externalMessageId, org.id, "email");

    // Log inbound message
    await logMessage({
      orgId: org.id,
      direction: "inbound",
      channel: "email",
      externalMessageId: message.externalMessageId,
      fromAddress: message.from,
      toAddress: message.to,
      subject: message.subject ?? null,
      body: message.body,
      messageType: "system",
      status: "received",
    });

    await inngest.send({
      name: "message/received",
      data: { message, orgId: org.id },
    });

    return NextResponse.json({ status: "received", messageId: message.externalMessageId });
  } catch (error) {
    console.error("Email webhook error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
