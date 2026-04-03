import { NextResponse } from "next/server";
import { updateMessageStatusByExternalId } from "@/lib/db/queries/messages";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const messageSid = formData.get("MessageSid")?.toString();
    const messageStatus = formData.get("MessageStatus")?.toString();
    const errorMessage = formData.get("ErrorMessage")?.toString();

    if (!messageSid || !messageStatus) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    let status: "delivered" | "failed" | "bounced" | undefined;

    switch (messageStatus) {
      case "delivered":
        status = "delivered";
        break;
      case "failed":
      case "undelivered":
        status = "failed";
        break;
    }

    if (status) {
      await updateMessageStatusByExternalId(messageSid, status, errorMessage);
    }

    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("SMS status webhook error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
