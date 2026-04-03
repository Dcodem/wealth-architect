"use client";

import type { CaseTimelineEntry } from "@/lib/db/schema";

const ICON_MAP: Record<string, string> = {
  case_created: "flag",
  status_change: "sync",
  vendor_assigned: "engineering",
  note: "description",
  sms_sent: "sms",
  email_sent: "mail",
  ai_triage: "psychology",
  inspection_scheduled: "event_available",
  default: "pending",
};

function getIcon(type: string) {
  return ICON_MAP[type] ?? ICON_MAP.default;
}

function formatTime(date: Date) {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function formatType(type: string) {
  return type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function getStageBadge(entry: CaseTimelineEntry): string | null {
  if (entry.type === "status_change" && entry.metadata) {
    const meta = entry.metadata as Record<string, unknown>;
    if (meta.newStatus) return String(meta.newStatus);
    if (meta.to) return String(meta.to);
  }
  if (entry.type === "case_created") return "open";
  if (entry.type === "vendor_assigned") return "in_progress";
  return null;
}

const STAGE_COLORS: Record<string, string> = {
  open: "bg-blue-100 text-blue-800",
  in_progress: "bg-amber-100 text-amber-800",
  waiting_on_vendor: "bg-orange-100 text-orange-800",
  waiting_on_tenant: "bg-purple-100 text-purple-800",
  resolved: "bg-emerald-100 text-emerald-800",
  closed: "bg-surface-container-high text-on-surface-variant",
};

export function CaseTimeline({
  timeline,
  caseId,
  caseStatus,
}: {
  timeline: CaseTimelineEntry[];
  caseId: string;
  caseStatus: string;
}) {
  return (
    <section className="bg-surface-container-lowest rounded-2xl p-10 shadow-sm border border-outline-variant/10">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h2 className="text-2xl font-extrabold text-on-surface tracking-tight">System of Record</h2>
          <p className="text-sm text-on-surface-variant font-medium mt-1">At-a-glance roll call of case interactions</p>
        </div>
        <span className="text-xs font-black text-primary uppercase tracking-widest bg-primary/5 px-4 py-2 rounded-full border border-primary/10">
          Audit Ready
        </span>
      </div>
      <div className="relative pl-6">
        {/* Vertical Line - centered on the icon column */}
        <div className="absolute left-[23px] top-4 bottom-4 w-px bg-gradient-to-b from-primary via-primary/30 to-outline-variant/20"></div>

        <div className="space-y-0">
          {timeline.map((entry, idx) => {
            const isFirst = idx === 0;
            const isLast = idx === timeline.length - 1;

            return (
              <div key={entry.id} className={`relative flex gap-6 ${!isLast ? "pb-8" : ""}`}>
                {/* Icon circle */}
                <div
                  className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm ring-[5px] ring-surface-container-lowest ${
                    isFirst
                      ? "bg-primary text-on-primary shadow-lg"
                      : isLast
                        ? "bg-primary text-on-primary shadow-md animate-pulse"
                        : "bg-surface-container-high text-primary"
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">{getIcon(entry.type)}</span>
                </div>
                {/* Content */}
                <div className="flex-grow pt-2 min-w-0">
                  <div className="flex justify-between items-start mb-1 gap-4">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className={`font-bold text-sm ${isLast ? "text-primary" : "text-on-surface"}`}>
                        {isLast ? `Current Stage: ${formatType(caseStatus)}` : formatType(entry.type)}
                      </h4>
                      {(() => {
                        const stage = getStageBadge(entry);
                        if (!stage) return null;
                        return (
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${STAGE_COLORS[stage] ?? "bg-surface-container-high text-on-surface-variant"}`}>
                            {formatType(stage)}
                          </span>
                        );
                      })()}
                    </div>
                    <span className={`text-[10px] font-black uppercase tracking-wider whitespace-nowrap ${
                      isLast ? "text-primary" : "text-on-surface-variant"
                    }`}>
                      {isLast ? "Now" : `${formatDate(entry.createdAt)} ${formatTime(entry.createdAt)}`}
                    </span>
                  </div>
                  <p className="text-sm text-on-surface-variant leading-relaxed">
                    {entry.details ?? "No details provided."}
                  </p>
                </div>
              </div>
            );
          })}

          {timeline.length === 0 && (
            <div className="relative flex gap-6">
              <div className="relative z-10 w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary shadow-md ring-[5px] ring-surface-container-lowest animate-pulse shrink-0">
                <span className="material-symbols-outlined text-[18px]">pending</span>
              </div>
              <div className="flex-grow pt-2">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-bold text-primary">No activity yet</h4>
                  <span className="text-[10px] font-black text-primary uppercase tracking-wider">Now</span>
                </div>
                <p className="text-sm text-on-surface-variant">This case has no timeline entries yet.</p>
              </div>
            </div>
          )}
        </div>
      </div>

    </section>
  );
}
