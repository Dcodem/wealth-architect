import { db } from "@/lib/db";
import { messageLog, type NewMessageLog } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";

export async function logMessage(
  data: Omit<NewMessageLog, "id" | "createdAt" | "updatedAt">
) {
  const [msg] = await db.insert(messageLog).values(data).returning();
  return msg;
}

export async function updateMessageStatus(
  id: string,
  status: "delivered" | "failed" | "bounced",
  errorMessage?: string
) {
  const [msg] = await db
    .update(messageLog)
    .set({
      status,
      errorMessage: errorMessage ?? null,
      updatedAt: new Date(),
    })
    .where(eq(messageLog.id, id))
    .returning();
  return msg ?? null;
}

export async function updateMessageStatusByExternalId(
  externalMessageId: string,
  status: "delivered" | "failed" | "bounced",
  errorMessage?: string
) {
  const [msg] = await db
    .update(messageLog)
    .set({
      status,
      errorMessage: errorMessage ?? null,
      updatedAt: new Date(),
    })
    .where(eq(messageLog.externalMessageId, externalMessageId))
    .returning();
  return msg ?? null;
}

export async function getMessagesByCase(caseId: string, orgId: string) {
  return db
    .select()
    .from(messageLog)
    .where(and(eq(messageLog.caseId, caseId), eq(messageLog.orgId, orgId)))
    .orderBy(desc(messageLog.createdAt));
}

export async function findMessageByExternalId(externalMessageId: string) {
  const [msg] = await db
    .select()
    .from(messageLog)
    .where(eq(messageLog.externalMessageId, externalMessageId))
    .limit(1);
  return msg ?? null;
}
