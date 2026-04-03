import { inngest } from "../client";
import { db } from "@/lib/db";
import { cases } from "@/lib/db/schema";
import { eq, and, lt } from "drizzle-orm";
import { addTimelineEntry, updateCase } from "@/lib/db/queries/cases";

export const caseAutoClose = inngest.createFunction(
  {
    id: "case-auto-close",
    triggers: [{ cron: "0 */6 * * *" }], // Run every 6 hours
  },
  async ({ step }) => {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60_000);
    const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60_000);

    // Auto-close resolved cases after 7 days
    const resolvedCases = await step.run("find-resolved-cases", async () => {
      return db
        .select()
        .from(cases)
        .where(
          and(
            eq(cases.status, "resolved"),
            lt(cases.updatedAt, sevenDaysAgo)
          )
        );
    });

    for (const c of resolvedCases) {
      await step.run(`close-resolved-${c.id}`, async () => {
        await updateCase(c.id, c.orgId, {
          status: "closed",
          closedAt: now,
        });
        await addTimelineEntry(c.id, {
          type: "resolved",
          details: "Case auto-closed after 7 days in resolved status",
        });
      });
    }

    // Auto-close waiting_on_tenant cases after 14 days
    const staleCases = await step.run("find-stale-cases", async () => {
      return db
        .select()
        .from(cases)
        .where(
          and(
            eq(cases.status, "waiting_on_tenant"),
            lt(cases.updatedAt, fourteenDaysAgo)
          )
        );
    });

    for (const c of staleCases) {
      await step.run(`close-stale-${c.id}`, async () => {
        await updateCase(c.id, c.orgId, {
          status: "closed",
          closedAt: now,
        });
        await addTimelineEntry(c.id, {
          type: "resolved",
          details: "Case auto-closed after 14 days waiting on tenant",
        });
        // TODO: Send final "closing this out" message to tenant
      });
    }

    return {
      resolvedClosed: resolvedCases.length,
      staleClosed: staleCases.length,
    };
  }
);
