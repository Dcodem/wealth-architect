import { inngest } from "../client";
import { getCase, addTimelineEntry } from "@/lib/db/queries/cases";

export const pmReminder = inngest.createFunction(
  {
    id: "pm-escalation-reminder",
    retries: 1,
    triggers: [{ event: "pm/reminder-needed" }],
  },
  async ({ event, step }) => {
    const { caseId, orgId, intervals } = event.data as {
      caseId: string;
      orgId: string;
      intervals: number[]; // ms intervals for escalating reminders
    };

    for (let i = 0; i < intervals.length; i++) {
      await step.sleep(`wait-interval-${i}`, intervals[i]);

      const caseRecord = await step.run(`check-case-${i}`, async () => {
        return getCase(caseId, orgId);
      });

      // Stop if case has progressed
      if (!caseRecord || caseRecord.status !== "open") {
        return { status: "case_progressed", remindersSent: i };
      }

      await step.run(`send-reminder-${i}`, async () => {
        await addTimelineEntry(caseId, {
          type: "notified_manager",
          details: `PM reminder #${i + 1} sent (case still awaiting action)`,
        });
        // TODO: Actually send SMS/email reminder to PM
      });
    }

    return { status: "all_reminders_sent", remindersSent: intervals.length };
  }
);
