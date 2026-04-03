import { inngest } from "../client";
import { getCase, addTimelineEntry } from "@/lib/db/queries/cases";
import { selectVendor } from "@/lib/vendor/select";
import { dispatchVendor } from "@/lib/vendor/dispatch";
import { getProperty } from "@/lib/db/queries/properties";
import { getOrganization } from "@/lib/db/queries/organizations";
import { DEFAULT_URGENCY_TIMERS } from "@/lib/pipeline/types";
import type { Case } from "@/lib/db/schema";

export const vendorTimer = inngest.createFunction(
  {
    id: "vendor-response-timer",
    retries: 1,
    triggers: [{ event: "vendor/dispatched" }],
  },
  async ({ event, step }) => {
    const { caseId, orgId, vendorId, urgency } = event.data as {
      caseId: string;
      orgId: string;
      vendorId: string;
      urgency: "critical" | "high" | "medium" | "low";
    };

    const timers = DEFAULT_URGENCY_TIMERS[urgency];

    // Wait for vendor response window
    await step.sleep("wait-for-vendor-response", timers.vendorResponse);

    // Check if vendor responded
    const caseRecord = await step.run("check-vendor-response", async () => {
      return getCase(caseId, orgId);
    }) as unknown as Case | null;

    if (!caseRecord || caseRecord.status !== "waiting_on_vendor") {
      return { status: "vendor_responded_or_case_resolved" };
    }

    // Send reminder
    await step.run("send-vendor-reminder", async () => {
      await addTimelineEntry(caseId, {
        type: "dispatched_vendor",
        details: `Vendor reminder sent (no response after ${timers.vendorResponse / 60000} min)`,
      });
    });

    // Wait for reminder window
    await step.sleep("wait-after-reminder", timers.nextVendor - timers.reminder);

    // Check again
    const caseAfterReminder = await step.run("check-after-reminder", async () => {
      return getCase(caseId, orgId);
    }) as unknown as Case | null;

    if (!caseAfterReminder || caseAfterReminder.status !== "waiting_on_vendor") {
      return { status: "vendor_responded_after_reminder" };
    }

    // Try next vendor
    await step.run("try-next-vendor", async () => {
      const org = await getOrganization(orgId);
      const property = caseAfterReminder.propertyId
        ? await getProperty(caseAfterReminder.propertyId, orgId)
        : null;

      if (!org || !property) return;

      const nextVendor = await selectVendor(
        "general" as any, // TODO: store trade on case
        orgId,
        [vendorId] // exclude current vendor
      );

      if (nextVendor) {
        await dispatchVendor({
          vendor: nextVendor,
          property,
          caseRecord: caseAfterReminder,
          issueDescription: caseAfterReminder.rawMessage.substring(0, 200),
          orgId,
          orgPhoneNumber: org.twilioPhoneNumber,
          orgEmail: org.emailAddress,
        });

        await addTimelineEntry(caseId, {
          type: "vendor_declined",
          details: `Previous vendor unresponsive — dispatched ${nextVendor.name}`,
        });
      } else {
        await addTimelineEntry(caseId, {
          type: "dispatched_vendor",
          details: "No additional vendors available — escalating to PM",
        });
      }
    });

    return { status: "escalated_to_next_vendor" };
  }
);
