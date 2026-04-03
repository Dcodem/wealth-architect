import { NextResponse } from "next/server";
import { updateMessageStatusByExternalId } from "@/lib/db/queries/messages";

export async function POST(request: Request) {
  try {
    const events = await request.json();

    // SendGrid sends an array of event objects
    for (const event of Array.isArray(events) ? events : [events]) {
      const sgMessageId = event.sg_message_id?.split(".")[0]; // Remove ".filter" suffix
      if (!sgMessageId) continue;

      let status: "delivered" | "failed" | "bounced" | undefined;

      switch (event.event) {
        case "delivered":
          status = "delivered";
          break;
        case "bounce":
        case "blocked":
          status = "bounced";
          break;
        case "dropped":
        case "deferred":
          status = "failed";
          break;
      }

      if (status) {
        await updateMessageStatusByExternalId(
          sgMessageId,
          status,
          event.reason || event.response || undefined
        );
      }
    }

    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("Email status webhook error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
