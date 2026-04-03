interface WorkOrderContext {
  vendorName: string;
  address: string;
  unitNumber?: string;
  issueDescription: string;
  priority: string;
  accessInstructions?: string;
  parkingInstructions?: string;
  specialInstructions?: string;
  caseRef: string;
}

interface PmNotificationContext {
  urgencyEmoji: string;
  urgency: string;
  unitNumber?: string;
  address: string;
  tenantName: string;
  issueSummary: string;
  actionsTaken: string[];
  pendingActions: string[];
}

export function vendorWorkOrder(ctx: WorkOrderContext): string {
  const lines = [
    `Work Order — ${ctx.vendorName}`,
    `Property: ${ctx.address}${ctx.unitNumber ? `, Unit ${ctx.unitNumber}` : ""}`,
    `Issue: ${ctx.issueDescription}`,
    `Priority: ${ctx.priority.toUpperCase()}`,
    "",
  ];

  if (ctx.accessInstructions) {
    lines.push(`Access: ${ctx.accessInstructions}`);
  }
  if (ctx.parkingInstructions) {
    lines.push(`Parking: ${ctx.parkingInstructions}`);
  }
  if (ctx.specialInstructions) {
    lines.push(`Note: ${ctx.specialInstructions}`);
  }

  lines.push("");
  lines.push(`Ref: ${ctx.caseRef}`);
  lines.push("Reply here with questions or updates.");

  return lines.join("\n");
}

export function pmNotification(ctx: PmNotificationContext): string {
  const lines = [
    `${ctx.urgencyEmoji} ${ctx.urgency.toUpperCase()} — ${ctx.unitNumber ? `Unit ${ctx.unitNumber}, ` : ""}${ctx.address}`,
    `Tenant: ${ctx.tenantName}`,
    `Issue: ${ctx.issueSummary}`,
    "",
  ];

  if (ctx.actionsTaken.length > 0) {
    lines.push("Actions taken:");
    ctx.actionsTaken.forEach((a) => lines.push(`✅ ${a}`));
    lines.push("");
  }

  if (ctx.pendingActions.length > 0) {
    lines.push("Pending:");
    ctx.pendingActions.forEach((a) => lines.push(`→ ${a}`));
    lines.push("");
  }

  lines.push("Reply YES to approve / NO to pause / EDIT to change");

  return lines.join("\n");
}

export function urgencyEmoji(urgency: string): string {
  switch (urgency) {
    case "critical":
      return "🚨";
    case "high":
      return "⚠️";
    case "medium":
      return "📋";
    case "low":
      return "📝";
    default:
      return "📋";
  }
}
