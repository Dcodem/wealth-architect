import { db } from "@/lib/db";
import { processedMessages } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import type { Channel } from "./types";

export async function isDuplicate(
  externalMessageId: string,
  orgId: string
): Promise<boolean> {
  const [existing] = await db
    .select({ id: processedMessages.id })
    .from(processedMessages)
    .where(
      and(
        eq(processedMessages.externalMessageId, externalMessageId),
        eq(processedMessages.orgId, orgId)
      )
    )
    .limit(1);

  return !!existing;
}

export async function markProcessed(
  externalMessageId: string,
  orgId: string,
  source: Channel
): Promise<void> {
  await db.insert(processedMessages).values({
    externalMessageId,
    orgId,
    source,
  });
}
