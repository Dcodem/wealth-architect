import { serve } from "inngest/next";
import { inngest } from "@/lib/inngest/client";
import { processMessage } from "@/lib/inngest/functions/process-message";
import { vendorTimer } from "@/lib/inngest/functions/vendor-timer";
import { pmReminder } from "@/lib/inngest/functions/pm-reminder";
import { caseAutoClose } from "@/lib/inngest/functions/case-auto-close";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [processMessage, vendorTimer, pmReminder, caseAutoClose],
});
