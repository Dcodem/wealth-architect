import { cn } from "@/lib/utils";

interface ConfidenceGaugeProps {
  score: number; // 0-1
  className?: string;
}

export function ConfidenceGauge({ score, className }: ConfidenceGaugeProps) {
  const percentage = Math.round(score * 100);
  const fillColor =
    score >= 0.85
      ? "bg-green-500"
      : score >= 0.5
        ? "bg-amber-500"
        : "bg-red-500";

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="h-1.5 w-14 rounded-full bg-[rgba(0,0,0,0.06)] overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-500", fillColor)}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-xs tabular-nums text-outline font-medium">
        {percentage}%
      </span>
    </div>
  );
}
