import { db } from "@/lib/db";
import { cases, caseTimeline, type NewCase, type NewCaseTimelineEntry } from "@/lib/db/schema";
import { eq, and, inArray, notInArray, desc, sql } from "drizzle-orm";

export async function listCases(
  orgId: string,
  filters?: { status?: typeof cases.$inferSelect.status; urgency?: typeof cases.$inferSelect.urgency; propertyId?: string }
) {
  const conditions = [eq(cases.orgId, orgId)];
  if (filters?.status) conditions.push(eq(cases.status, filters.status));
  if (filters?.urgency) conditions.push(eq(cases.urgency, filters.urgency));
  if (filters?.propertyId) conditions.push(eq(cases.propertyId, filters.propertyId));

  return db.select().from(cases).where(and(...conditions)).orderBy(desc(cases.createdAt));
}

export async function getCase(id: string, orgId: string) {
  const [result] = await db.select().from(cases)
    .where(and(eq(cases.id, id), eq(cases.orgId, orgId))).limit(1);
  return result ?? null;
}

export async function getCaseWithTimeline(id: string, orgId: string) {
  const caseResult = await getCase(id, orgId);
  if (!caseResult) return null;

  const timeline = await db.select().from(caseTimeline)
    .where(eq(caseTimeline.caseId, id)).orderBy(caseTimeline.createdAt);

  return { case: caseResult, timeline };
}

export async function createCase(
  orgId: string,
  data: Omit<NewCase, "id" | "orgId" | "createdAt" | "updatedAt">
) {
  const [newCase] = await db.insert(cases).values({ ...data, orgId }).returning();
  return newCase;
}

export async function updateCase(
  id: string, orgId: string,
  data: Partial<Omit<NewCase, "id" | "orgId" | "createdAt" | "updatedAt">>
) {
  const [updated] = await db.update(cases)
    .set({ ...data, updatedAt: new Date() })
    .where(and(eq(cases.id, id), eq(cases.orgId, orgId))).returning();
  return updated ?? null;
}

export async function addTimelineEntry(
  caseId: string,
  data: Omit<NewCaseTimelineEntry, "id" | "caseId" | "createdAt">
) {
  const [entry] = await db.insert(caseTimeline).values({ ...data, caseId }).returning();
  return entry;
}

export async function findOpenCasesByTenant(tenantId: string, orgId: string) {
  return db.select().from(cases)
    .where(and(
      eq(cases.tenantId, tenantId),
      eq(cases.orgId, orgId),
      inArray(cases.status, ["open", "in_progress", "waiting_on_vendor", "waiting_on_tenant"])
    ))
    .orderBy(desc(cases.createdAt));
}

export async function countActiveCasesByProperty(orgId: string) {
  const result = await db
    .select({
      propertyId: cases.propertyId,
      count: sql<number>`count(*)::int`,
    })
    .from(cases)
    .where(
      and(
        eq(cases.orgId, orgId),
        notInArray(cases.status, ["resolved", "closed"])
      )
    )
    .groupBy(cases.propertyId);

  const map = new Map<string, number>();
  for (const row of result) {
    if (row.propertyId) map.set(row.propertyId, row.count);
  }
  return map;
}

export async function listCasesByTenant(tenantId: string, orgId: string) {
  return db
    .select()
    .from(cases)
    .where(and(eq(cases.orgId, orgId), eq(cases.tenantId, tenantId)))
    .orderBy(desc(cases.createdAt));
}
