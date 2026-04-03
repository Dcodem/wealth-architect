"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { Property, Case, Tenant } from "@/lib/db/schema";
import { formatEnum, timeAgo } from "@/lib/utils";

type Props = {
  property: Property;
  cases: Case[];
  tenants: Tenant[];
};

/* ------------------------------------------------------------------ */
/*  Mock resolution detail for prototype (would come from DB in prod) */
/* ------------------------------------------------------------------ */
const FEEDBACK_REASONS = [
  "Quick response and professional service. Very satisfied with the repair quality.",
  "Contractor arrived on time and fixed the issue in one visit. Great communication throughout.",
  "Took longer than expected to schedule, but the repair itself was done well.",
  "Good job overall but had to follow up twice before getting a status update.",
  "Excellent work! The contractor explained everything clearly and cleaned up after.",
  "Satisfactory resolution. Would have appreciated faster initial response.",
  "Very happy — problem was diagnosed and fixed the same day.",
  "The repair resolved the issue but the scheduling process was frustrating.",
];

function getMockResolutionDetail(c: Case) {
  const createdMs = new Date(c.createdAt).getTime();
  const hash = c.id.charCodeAt(0) + c.id.charCodeAt(1);
  const scheduledHours = (hash % 12) + 1;
  const arrivalHours = scheduledHours + (hash % 24) + 2;
  const completionHours = arrivalHours + (hash % 48) + 1;
  const cost = (hash * 17) % 2000 + 150;
  const satisfaction = Number(((hash % 20) / 10 + 3).toFixed(1));
  const feedback = FEEDBACK_REASONS[hash % FEEDBACK_REASONS.length];

  return {
    scheduledAt: new Date(createdMs + scheduledHours * 3600_000),
    arrivedAt: new Date(createdMs + arrivalHours * 3600_000),
    completedAt: c.resolvedAt ?? new Date(createdMs + completionHours * 3600_000),
    timeToSchedule: `${scheduledHours}h`,
    timeToArrive: `${arrivalHours - scheduledHours}h`,
    timeToFix: `${completionHours - arrivalHours}h`,
    totalResolution: `${completionHours}h`,
    cost,
    satisfaction,
    feedback,
  };
}

function getUrgencyColor(urgency: string | null) {
  switch (urgency) {
    case "critical": return "bg-error text-white";
    case "high": return "bg-amber-600 text-white";
    case "medium": return "bg-primary text-white";
    case "low": return "bg-outline text-white";
    default: return "bg-outline text-white";
  }
}

function getStatusBadge(status: string) {
  switch (status) {
    case "resolved":
    case "closed":
      return "bg-emerald-100 text-emerald-800";
    case "in_progress":
      return "bg-primary-fixed text-primary";
    case "waiting_on_vendor":
    case "waiting_on_tenant":
      return "bg-amber-100 text-amber-900";
    default:
      return "bg-surface-container-high text-on-surface-variant";
  }
}

function StarRating({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`material-symbols-outlined text-xs ${star <= Math.floor(value) ? "text-amber-500" : star - 0.5 <= value ? "text-amber-400" : "text-outline/30"}`}
          style={{ fontVariationSettings: "'FILL' 1", fontSize: "14px" }}
        >
          {star <= Math.floor(value) ? "star" : star - 0.5 <= value ? "star_half" : "star"}
        </span>
      ))}
      <span className="text-xs font-bold text-on-surface-variant ml-1">{value}</span>
    </div>
  );
}

type TimeFilter = "6m" | "12m" | "custom";

export function PropertyAnalyticsClient({ property, cases, tenants }: Props) {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("12m");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const [showCustomPicker, setShowCustomPicker] = useState(false);

  // Filter cases by time period
  const filteredCases = useMemo(() => {
    const now = new Date();
    let cutoff: Date;
    if (timeFilter === "6m") {
      cutoff = new Date(now.getFullYear(), now.getMonth() - 6, 1);
    } else if (timeFilter === "12m") {
      cutoff = new Date(now.getFullYear() - 1, now.getMonth(), 1);
    } else {
      cutoff = customFrom ? new Date(customFrom) : new Date(0);
      const end = customTo ? new Date(customTo) : now;
      return cases
        .filter((c) => new Date(c.createdAt) >= cutoff && new Date(c.createdAt) <= end)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    return cases
      .filter((c) => new Date(c.createdAt) >= cutoff)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [cases, timeFilter, customFrom, customTo]);

  // Group cases by month
  const groupedByMonth = useMemo(() => {
    const groups: { label: string; key: string; cases: Case[] }[] = [];
    const monthMap = new Map<string, Case[]>();
    for (const c of filteredCases) {
      const d = new Date(c.createdAt);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const label = d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
      if (!monthMap.has(key)) monthMap.set(key, []);
      monthMap.get(key)!.push(c);
    }
    for (const [key, casesInMonth] of monthMap) {
      const d = new Date(casesInMonth[0].createdAt);
      groups.push({
        key,
        label: d.toLocaleDateString("en-US", { month: "long", year: "numeric" }),
        cases: casesInMonth,
      });
    }
    return groups;
  }, [filteredCases]);

  // Top-level metrics
  const totalCases = filteredCases.length;
  const resolvedCases = filteredCases.filter((c) => ["resolved", "closed"].includes(c.status));
  const totalCost = filteredCases.reduce((sum, c) => {
    const hash = c.id.charCodeAt(0) + c.id.charCodeAt(1);
    return sum + ((hash * 17) % 2000 + 150);
  }, 0);
  const avgResolutionDays = resolvedCases.length > 0
    ? (resolvedCases.reduce((sum, c) => {
        const created = new Date(c.createdAt).getTime();
        const resolved = c.resolvedAt ? new Date(c.resolvedAt).getTime() : Date.now();
        return sum + (resolved - created) / (1000 * 60 * 60 * 24);
      }, 0) / resolvedCases.length).toFixed(1)
    : "—";

  // Find tenant name by ID
  const tenantMap = new Map(tenants.map((t) => [t.id, t]));

  return (
    <div className="min-h-screen pb-12">
      <div className="pt-8 px-8 max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-on-surface-variant mb-6 font-medium">
          <Link href="/properties" className="hover:text-primary transition-colors">Properties</Link>
          <span className="material-symbols-outlined text-base">chevron_right</span>
          <Link href={`/properties/${property.id}`} className="hover:text-primary transition-colors">{property.address}</Link>
          <span className="material-symbols-outlined text-base">chevron_right</span>
          <span className="text-primary font-bold">Analytics</span>
        </div>

        {/* Header + Time Filter */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <h1 className="text-4xl font-extrabold text-on-surface tracking-tight mb-2">Property Analytics</h1>
            <p className="text-on-surface-variant">{property.address}</p>
          </div>
          <div className="flex items-center gap-2 relative">
            <div className="bg-surface-container-lowest rounded-lg border border-outline-variant/20 flex overflow-hidden">
              <button
                onClick={() => { setTimeFilter("6m"); setShowCustomPicker(false); }}
                className={`px-4 py-2 text-sm font-bold transition-colors ${timeFilter === "6m" ? "bg-primary text-on-primary" : "text-on-surface-variant hover:bg-primary-fixed"}`}
              >
                6 Months
              </button>
              <button
                onClick={() => { setTimeFilter("12m"); setShowCustomPicker(false); }}
                className={`px-4 py-2 text-sm font-bold transition-colors ${timeFilter === "12m" ? "bg-primary text-on-primary" : "text-on-surface-variant hover:bg-primary-fixed"}`}
              >
                12 Months
              </button>
              <button
                onClick={() => { setTimeFilter("custom"); setShowCustomPicker(true); }}
                className={`px-4 py-2 text-sm font-bold transition-colors flex items-center gap-1 ${timeFilter === "custom" ? "bg-primary text-on-primary" : "text-on-surface-variant hover:bg-primary-fixed"}`}
              >
                <span className="material-symbols-outlined text-sm">calendar_month</span>
                Custom
              </button>
            </div>
            {showCustomPicker && (
              <div className="absolute top-full right-0 mt-2 bg-surface-container-lowest rounded-xl shadow-xl border border-outline-variant/20 p-4 z-20 min-w-[280px]">
                <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-3">Select Date Range</p>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-on-surface-variant">From</label>
                    <input
                      type="date"
                      value={customFrom}
                      onChange={(e) => setCustomFrom(e.target.value)}
                      className="mt-1 w-full px-3 py-2 bg-surface-container-low rounded-lg border border-outline-variant/20 text-sm text-on-surface"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-on-surface-variant">To</label>
                    <input
                      type="date"
                      value={customTo}
                      onChange={(e) => setCustomTo(e.target.value)}
                      className="mt-1 w-full px-3 py-2 bg-surface-container-low rounded-lg border border-outline-variant/20 text-sm text-on-surface"
                    />
                  </div>
                  <button
                    onClick={() => setShowCustomPicker(false)}
                    className="w-full py-2 bg-primary text-on-primary rounded-lg font-bold text-sm"
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Top Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/10">
            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-3">Total Cases</p>
            <p className="text-4xl font-extrabold text-on-surface">{totalCases}</p>
            <p className="text-xs text-on-surface-variant mt-1">{resolvedCases.length} resolved</p>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/10">
            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-3">Avg Resolution Time</p>
            <p className="text-4xl font-extrabold text-primary">{avgResolutionDays}<span className="text-xl font-bold ml-1">days</span></p>
            <p className="text-xs text-on-surface-variant mt-1">From open to resolved</p>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/10">
            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-3">Total Cost</p>
            <p className="text-4xl font-extrabold text-on-surface">${totalCost.toLocaleString()}</p>
            <p className="text-xs text-on-surface-variant mt-1">Maintenance spend</p>
          </div>
        </div>

        {/* Issue Timeline */}
        <div className="space-y-8">
          <h2 className="text-2xl font-bold text-on-surface">Issue Timeline</h2>

          {groupedByMonth.length === 0 && (
            <div className="bg-surface-container-lowest rounded-2xl p-12 text-center border border-outline-variant/10">
              <span className="material-symbols-outlined text-4xl text-outline mb-3">event_available</span>
              <p className="text-on-surface-variant font-medium">No cases in this time period.</p>
            </div>
          )}

          {groupedByMonth.map((group) => {
            const monthCost = group.cases.reduce(() => Math.floor(Math.random() * 2000) + 150, 0);
            return (
              <div key={group.key}>
                {/* Month Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-lg">calendar_today</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-on-surface">{group.label}</h3>
                    <p className="text-xs text-on-surface-variant">{group.cases.length} {group.cases.length === 1 ? "issue" : "issues"}</p>
                  </div>
                </div>

                {/* Issue Cards */}
                <div className="ml-5 border-l-2 border-outline-variant/20 pl-8 space-y-4 pb-4">
                  {group.cases.map((c) => {
                    const detail = getMockResolutionDetail(c);
                    const tenant = c.tenantId ? tenantMap.get(c.tenantId) : null;
                    const isResolved = ["resolved", "closed"].includes(c.status);

                    return (
                      <Link
                        key={c.id}
                        href={`/cases/${c.id}`}
                        className="block bg-surface-container-lowest rounded-xl border border-outline-variant/10 p-5 hover:border-primary/30 hover:shadow-md transition-all group"
                      >
                        {/* Top row: urgency, category, status, date */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${c.urgency === "critical" ? "bg-error" : c.urgency === "high" ? "bg-amber-600" : c.urgency === "medium" ? "bg-primary" : "bg-outline"}`} />
                            <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${getUrgencyColor(c.urgency)}`}>
                              {c.urgency ?? "Unknown"}
                            </span>
                            {c.category && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-surface-container-high text-on-surface-variant">
                                {formatEnum(c.category)}
                              </span>
                            )}
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${getStatusBadge(c.status)}`}>
                              {formatEnum(c.status)}
                            </span>
                          </div>
                          <span className="text-xs text-on-surface-variant">
                            {new Date(c.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          </span>
                        </div>

                        {/* Issue summary */}
                        <p className="text-sm font-semibold text-on-surface mb-1 group-hover:text-primary transition-colors line-clamp-2">
                          {c.rawMessage.length > 140 ? c.rawMessage.slice(0, 140) + "..." : c.rawMessage}
                        </p>
                        {tenant && (
                          <p className="text-xs text-on-surface-variant mb-3">
                            {tenant.name} &middot; Unit {tenant.unitNumber ?? "N/A"}
                          </p>
                        )}

                        {/* Resolution breakdown */}
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-3 pt-3 border-t border-outline-variant/10">
                          <div>
                            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Scheduled</p>
                            <p className="text-sm font-bold text-on-surface">{detail.timeToSchedule}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Contractor Arrival</p>
                            <p className="text-sm font-bold text-on-surface">{detail.timeToArrive}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Time to Fix</p>
                            <p className="text-sm font-bold text-on-surface">{detail.timeToFix}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Cost</p>
                            <p className="text-sm font-bold text-on-surface">${detail.cost.toLocaleString()}</p>
                          </div>
                          <div className="col-span-2 md:col-span-1">
                            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Satisfaction</p>
                            {isResolved ? (
                              <>
                                <StarRating value={detail.satisfaction} />
                                <p className="text-[11px] text-on-surface-variant mt-1 italic line-clamp-2">&ldquo;{detail.feedback}&rdquo;</p>
                              </>
                            ) : (
                              <p className="text-xs text-on-surface-variant italic">Pending</p>
                            )}
                          </div>
                        </div>

                        {/* Total resolution time bar */}
                        {isResolved && (
                          <div className="mt-3 flex items-center gap-2">
                            <span className="material-symbols-outlined text-xs text-emerald-600">check_circle</span>
                            <span className="text-xs font-bold text-emerald-700">Resolved in {detail.totalResolution}</span>
                            <div className="flex-1 h-1.5 bg-surface-container-high rounded-full overflow-hidden ml-2">
                              <div className="h-full bg-emerald-500 rounded-full" style={{ width: "100%" }} />
                            </div>
                          </div>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
