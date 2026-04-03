import { cn, formatEnum } from "@/lib/utils";

const URGENCY_STYLES = {
  critical: { bg: "bg-error-container", text: "text-on-error-container", dot: "bg-error", border: "border-error-border" },
  high: { bg: "bg-caution-container", text: "text-on-caution-container", dot: "bg-caution", border: "border-caution-border" },
  medium: { bg: "bg-warning-container", text: "text-on-warning-container", dot: "bg-warning-dim", border: "border-warning-border" },
  low: { bg: "bg-success-container", text: "text-on-success-container", dot: "bg-success-dim", border: "border-success-border" },
} as const;

const STATUS_STYLES = {
  open: { bg: "bg-info-container", text: "text-on-info-container", dot: "bg-info-dot", border: "border-info-border" },
  in_progress: { bg: "bg-purple-container", text: "text-on-purple-container", dot: "bg-purple", border: "border-purple-border" },
  waiting_on_vendor: { bg: "bg-caution-container", text: "text-on-caution-container", dot: "bg-caution", border: "border-caution-border" },
  waiting_on_tenant: { bg: "bg-warning-container", text: "text-on-warning-container", dot: "bg-warning-dim", border: "border-warning-border" },
  resolved: { bg: "bg-success-container", text: "text-on-success-container", dot: "bg-success-dim", border: "border-success-border" },
  closed: { bg: "bg-neutral-container", text: "text-on-neutral-container", dot: "bg-neutral", border: "border-neutral-border" },
} as const;

interface BadgeProps {
  variant: "urgency" | "status" | "trade";
  value: string;
  className?: string;
}

export function Badge({ variant, value, className }: BadgeProps) {
  if (variant === "urgency") {
    const styles = URGENCY_STYLES[value as keyof typeof URGENCY_STYLES] ?? URGENCY_STYLES.medium;
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
          styles.bg, styles.text, styles.border,
          className
        )}
      >
        <span className={cn("h-1.5 w-1.5 rounded-full", styles.dot)} aria-hidden="true" />
        {formatEnum(value)}
      </span>
    );
  }

  if (variant === "status") {
    const styles = STATUS_STYLES[value as keyof typeof STATUS_STYLES] ?? STATUS_STYLES.open;
    return (
      <span
        role="status"
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
          styles.bg, styles.text, styles.border,
          className
        )}
      >
        <span className={cn("h-1.5 w-1.5 rounded-full", styles.dot)} aria-hidden="true" />
        {formatEnum(value)}
      </span>
    );
  }

  // trade variant
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-info-border bg-primary-fixed px-2.5 py-0.5 text-xs font-medium text-primary",
        className
      )}
    >
      {formatEnum(value)}
    </span>
  );
}
