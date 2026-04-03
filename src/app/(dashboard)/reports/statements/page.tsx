"use client";
import React, { useState, useEffect, useRef } from "react";
import AppLayout from "@/components/AppLayout";
import PageHeader from "@/components/PageHeader";
import { SkeletonPulse, KPISkeletons, TableSkeleton } from "@/components/LoadingSkeleton";

const presetPeriods = [
  { label: "This Month", key: "this-month" },
  { label: "Last Month", key: "last-month" },
  { label: "This Quarter", key: "this-quarter" },
  { label: "Last Quarter", key: "last-quarter" },
  { label: "Year to Date", key: "ytd" },
  { label: "This Year", key: "this-year" },
  { label: "Last Year", key: "last-year" },
  { label: "Custom Range", key: "custom" },
];

const kpisByPeriod: Record<string, { revenue: string; revenueTrend: string; expenses: string; profit: string; cashFlow: string }> = {
  "this-month": { revenue: "$142,500", revenueTrend: "+4.2%", expenses: "($38,240.12)", profit: "($5,849.38)", cashFlow: "$98,410.50" },
  "last-month": { revenue: "$136,800", revenueTrend: "+2.8%", expenses: "($35,110.00)", profit: "($4,210.00)", cashFlow: "$97,480.00" },
  "this-quarter": { revenue: "$408,250", revenueTrend: "+3.6%", expenses: "($114,970.62)", profit: "($22,729.88)", cashFlow: "$270,549.50" },
  "last-quarter": { revenue: "$385,600", revenueTrend: "+1.9%", expenses: "($108,430.00)", profit: "($18,560.00)", cashFlow: "$258,610.00" },
  "ytd": { revenue: "$408,250", revenueTrend: "+3.6%", expenses: "($114,970.62)", profit: "($22,729.88)", cashFlow: "$270,549.50" },
  "this-year": { revenue: "$408,250", revenueTrend: "+3.6%", expenses: "($114,970.62)", profit: "($22,729.88)", cashFlow: "$270,549.50" },
  "last-year": { revenue: "$1,428,000", revenueTrend: "+8.4%", expenses: "($412,680.00)", profit: "($62,880.00)", cashFlow: "$952,440.00" },
  "custom": { revenue: "$142,500", revenueTrend: "+4.2%", expenses: "($38,240.12)", profit: "($5,849.38)", cashFlow: "$98,410.50" },
};

const periodLabels: Record<string, string> = {
  "this-month": "March 2024",
  "last-month": "February 2024",
  "this-quarter": "Q1 2024",
  "last-quarter": "Q4 2023",
  "ytd": "Jan 1 – Mar 31, 2024",
  "this-year": "2024",
  "last-year": "2023",
  "custom": "Custom Range",
};

const kpiMeta = [
  { icon: "payments", iconBg: "bg-primary-fixed-dim", iconColor: "text-primary", label: "Total Revenue", key: "revenue" as const, hasTrend: true },
  { icon: "account_balance_wallet", iconBg: "bg-orange-100", iconColor: "text-orange-600", label: "Total Expenses", key: "expenses" as const },
  { icon: "trending_up", iconBg: "bg-primary-fixed", iconColor: "text-primary", label: "Operating Profit", key: "profit" as const, note: "Pre-tax reconciliation" },
];

const properties = [
  {
    name: "Main St. Loft - Consolidated",
    type: "Mixed-Use Commercial",
    income: "$42,500.00",
    credits: "$1,200.00",
    creditsColor: "text-on-success-container",
    debits: "($8,450.00)",
    net: "$35,250.00",
    status: "Verified",
    statusColor: "bg-success-container text-on-success-container",
    expanded: true,
    subItems: [
      { name: "Residential Lease - Unit 4B", income: "$4,200.00", credits: "\u2014", debits: "\u2014", net: "$4,200.00" },
      { name: "HVAC Maintenance - Quarterly", income: "\u2014", credits: "\u2014", debits: "($1,850.00)", debitsColor: "text-error", net: "($1,850.00)" },
    ],
  },
  {
    name: "Oak Ridge Estate",
    type: "Luxury Residential",
    income: "$85,000.00",
    credits: "$0.00",
    creditsColor: "text-on-surface-variant",
    debits: "($22,400.00)",
    net: "$62,600.00",
    status: "Draft",
    statusColor: "bg-surface-container-high text-on-surface-variant",
    expanded: false,
    subItems: [
      { name: "Luxury Suite Lease - Master", income: "$65,000.00", credits: "\u2014", debits: "\u2014", net: "$65,000.00" },
      { name: "Pool & Grounds Maintenance", income: "\u2014", credits: "\u2014", debits: "($8,400.00)", debitsColor: "text-error", net: "($8,400.00)" },
      { name: "Property Insurance - Annual", income: "\u2014", credits: "\u2014", debits: "($14,000.00)", debitsColor: "text-error", net: "($14,000.00)" },
    ],
  },
  {
    name: "Downtown Plaza",
    type: "Retail Strip",
    income: "$15,000.00",
    credits: "$450.00",
    creditsColor: "text-on-success-container",
    debits: "($7,390.12)",
    net: "$8,059.88",
    status: "Verified",
    statusColor: "bg-success-container text-on-success-container",
    expanded: false,
    subItems: [
      { name: "Retail Lease - Ground Floor", income: "$12,000.00", credits: "$450.00", debits: "\u2014", net: "$12,450.00" },
      { name: "Common Area Maintenance", income: "\u2014", credits: "\u2014", debits: "($4,390.12)", debitsColor: "text-error", net: "($4,390.12)" },
    ],
  },
];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function CalendarPicker({ value, onChange, label }: { value: string; onChange: (v: string) => void; label: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const parsed = value ? new Date(value + "T00:00:00") : new Date();
  const [viewYear, setViewYear] = useState(parsed.getFullYear());
  const [viewMonth, setViewMonth] = useState(parsed.getMonth());

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const selectDate = (day: number) => {
    const m = String(viewMonth + 1).padStart(2, "0");
    const d = String(day).padStart(2, "0");
    onChange(`${viewYear}-${m}-${d}`);
    setOpen(false);
  };

  const formatDisplay = (v: string) => {
    if (!v) return label;
    const dt = new Date(v + "T00:00:00");
    return dt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-4 py-2.5 text-sm font-medium hover:bg-surface-container-low transition-colors min-w-[160px]"
      >
        <span aria-hidden="true" className="material-symbols-outlined text-on-surface-variant text-lg">calendar_today</span>
        <span className={value ? "text-on-surface" : "text-on-surface-variant"}>{formatDisplay(value)}</span>
      </button>
      {open && (
        <div className="absolute top-full mt-2 left-0 bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant/20 p-4 z-50 w-[300px]">
          <div className="flex items-center justify-between mb-3">
            <button onClick={() => { if (viewMonth === 0) { setViewMonth(11); setViewYear(viewYear - 1); } else setViewMonth(viewMonth - 1); }} className="p-1 hover:bg-surface-container-low rounded-lg">
              <span aria-hidden="true" className="material-symbols-outlined text-on-surface-variant">chevron_left</span>
            </button>
            <span className="text-sm font-bold text-on-surface">{monthNames[viewMonth]} {viewYear}</span>
            <button onClick={() => { if (viewMonth === 11) { setViewMonth(0); setViewYear(viewYear + 1); } else setViewMonth(viewMonth + 1); }} className="p-1 hover:bg-surface-container-low rounded-lg">
              <span aria-hidden="true" className="material-symbols-outlined text-on-surface-variant">chevron_right</span>
            </button>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
              <div key={d} className="text-[11px] font-bold text-on-surface-variant py-1">{d}</div>
            ))}
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const m = String(viewMonth + 1).padStart(2, "0");
              const d = String(day).padStart(2, "0");
              const dateStr = `${viewYear}-${m}-${d}`;
              const isSelected = dateStr === value;
              return (
                <button
                  key={day}
                  onClick={() => selectDate(day)}
                  className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                    isSelected
                      ? "bg-primary text-white font-bold"
                      : "hover:bg-surface-container-low text-on-surface"
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default function StatementsPage() {
  const [loading, setLoading] = useState(true);
  const [periodKey, setPeriodKey] = useState("this-month");
  const [customStart, setCustomStart] = useState("2024-01-01");
  const [customEnd, setCustomEnd] = useState("2024-03-31");
  const [showPeriodMenu, setShowPeriodMenu] = useState(false);
  const [propertyFilter, setPropertyFilter] = useState("Filter: All Properties");
  const [expandedRows, setExpandedRows] = useState<Set<string>>(
    () => new Set(properties.filter((p) => p.expanded).map((p) => p.name))
  );
  const [printState, setPrintState] = useState<"idle" | "loading" | "done">("idle");
  const [downloadState, setDownloadState] = useState<"idle" | "loading" | "done">("idle");
  const periodMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (periodMenuRef.current && !periodMenuRef.current.contains(e.target as Node)) setShowPeriodMenu(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const toggleRow = (name: string) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const periodData = kpisByPeriod[periodKey] || kpisByPeriod["this-month"];

  const currentPeriodLabel = periodKey === "custom"
    ? (() => {
        const fmt = (v: string) => {
          if (!v) return "...";
          const dt = new Date(v + "T00:00:00");
          return dt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
        };
        return `${fmt(customStart)} – ${fmt(customEnd)}`;
      })()
    : periodLabels[periodKey];

  const filteredProperties = properties.filter((p) => {
    if (propertyFilter === "Filter: All Properties") return true;
    return p.name.startsWith(propertyFilter);
  });

  if (loading) {
    return (
      <AppLayout>
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <SkeletonPulse className="w-48 h-8" />
              <SkeletonPulse className="w-64 h-4" />
            </div>
            <div className="flex gap-3">
              <SkeletonPulse className="w-48 h-10 rounded-xl" />
              <SkeletonPulse className="w-40 h-10 rounded-xl" />
            </div>
          </div>
          <KPISkeletons />
          <TableSkeleton rows={3} />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <PageHeader
        title="Statements"
        subtitle={`Consolidated report — ${currentPeriodLabel}`}
        breadcrumb={{ label: "Back to Reports", href: "/reports" }}
        actions={
          <div className="flex flex-wrap items-center gap-3">
            {/* Period Selector */}
            <div ref={periodMenuRef} className="relative">
              <button
                onClick={() => setShowPeriodMenu(!showPeriodMenu)}
                className="flex items-center gap-2 bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-4 py-2.5 text-sm font-medium hover:bg-surface-container-low transition-colors"
              >
                <span aria-hidden="true" className="material-symbols-outlined text-on-surface-variant text-lg">date_range</span>
                {presetPeriods.find((p) => p.key === periodKey)?.label || "Select Period"}
                <span aria-hidden="true" className="material-symbols-outlined text-on-surface-variant">expand_more</span>
              </button>
              {showPeriodMenu && (
                <div className="absolute top-full mt-2 right-0 bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant/20 overflow-hidden z-50 w-[220px]">
                  <div className="py-2">
                    {presetPeriods.map((preset) => (
                      <button
                        key={preset.key}
                        onClick={() => {
                          setPeriodKey(preset.key);
                          setShowPeriodMenu(false);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors ${
                          periodKey === preset.key
                            ? "bg-primary/5 text-primary font-bold"
                            : "text-on-surface hover:bg-surface-container-low"
                        }`}
                      >
                        {preset.key === "custom" ? (
                          <span aria-hidden="true" className="material-symbols-outlined text-lg">edit_calendar</span>
                        ) : (
                          <span aria-hidden="true" className={`material-symbols-outlined text-lg ${periodKey === preset.key ? "text-primary" : "text-on-surface-variant"}`}>
                            {periodKey === preset.key ? "radio_button_checked" : "radio_button_unchecked"}
                          </span>
                        )}
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {/* Custom Range Date Pickers — rendered outside the dropdown */}
            {periodKey === "custom" && !showPeriodMenu && (
              <>
                <CalendarPicker value={customStart} onChange={setCustomStart} label="Start date" />
                <span className="text-on-surface-variant text-sm font-medium">to</span>
                <CalendarPicker value={customEnd} onChange={setCustomEnd} label="End date" />
              </>
            )}
            {/* Property Filter */}
            <div className="relative">
              <select
                value={propertyFilter}
                onChange={(e) => setPropertyFilter(e.target.value)}
                aria-label="Property filter"
                className="appearance-none bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-4 py-2.5 pr-10 text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer"
              >
                <option>Filter: All Properties</option>
                <option>Main St. Loft</option>
                <option>Oak Ridge Estate</option>
                <option>Downtown Plaza</option>
              </select>
              <span aria-hidden="true" className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant">expand_more</span>
            </div>
          </div>
        }
      />

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiMeta.map((kpi) => (
          <div key={kpi.label} className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/10 flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div className={`w-10 h-10 rounded-xl ${kpi.iconBg} flex items-center justify-center ${kpi.iconColor}`}>
                <span aria-hidden="true" className="material-symbols-outlined">{kpi.icon}</span>
              </div>
              {kpi.hasTrend && (
                <span className={`text-[11px] font-bold px-2 py-1 rounded-full ${periodData.revenueTrend.startsWith("+") ? "text-on-success-container bg-success-container" : "text-red-600 bg-red-50"}`}>{periodData.revenueTrend}</span>
              )}
            </div>
            <div className="mt-auto">
              {kpi.note && <p className="text-[11px] text-on-surface-variant mb-1">{kpi.note}</p>}
              <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">{kpi.label}</p>
              <h2 className="text-2xl font-extrabold text-on-surface mt-1">{periodData[kpi.key]}</h2>
            </div>
          </div>
        ))}
        {/* Cash Flow Card */}
        <div className="bg-primary p-6 rounded-2xl shadow-xl shadow-primary/10 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary-container opacity-90" />
          <div className="relative z-10 flex flex-col justify-between h-full">
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                <span aria-hidden="true" className="material-symbols-outlined">account_balance</span>
              </div>
            </div>
            <div className="mt-auto">
              <p className="text-xs font-semibold text-white/70 uppercase tracking-wider">Net Cash/Flow</p>
              <h2 className="text-2xl font-extrabold text-white mt-1">{periodData.cashFlow}</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction Ledger */}
      <div className="bg-surface-container-lowest rounded-2xl shadow-sm overflow-hidden border border-outline-variant/10">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse table-fixed">
            <colgroup>
              <col className="w-[30%]" />
              <col className="w-[14%]" />
              <col className="w-[14%]" />
              <col className="w-[14%]" />
              <col className="w-[14%]" />
              <col className="w-[14%]" />
            </colgroup>
            <thead className="bg-surface-container-low/50 sticky top-0 z-10 backdrop-blur-md">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest border-b border-outline-variant/10">Asset &amp; Category</th>
                <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest border-b border-outline-variant/10 text-right">Income</th>
                <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest border-b border-outline-variant/10 text-right">Expense Credits</th>
                <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest border-b border-outline-variant/10 text-right">Expense Debits</th>
                <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest border-b border-outline-variant/10 text-right">Net Position</th>
                <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest border-b border-outline-variant/10">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/5">
              {filteredProperties.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <span aria-hidden="true" className="material-symbols-outlined text-[40px] text-outline-variant">search_off</span>
                      <p className="text-sm font-bold text-on-surface-variant">No properties match this filter</p>
                      <p className="text-xs text-on-surface-variant/60">Try selecting a different property or period</p>
                      <button onClick={() => setPropertyFilter("Filter: All Properties")} className="mt-2 text-xs font-bold text-primary hover:underline">
                        Clear Filter
                      </button>
                    </div>
                  </td>
                </tr>
              )}
              {filteredProperties.map((prop) => (
                <React.Fragment key={prop.name}>
                  <tr className="bg-surface-container-low/30 hover:bg-surface-container-low/50 transition-colors cursor-pointer" onClick={() => toggleRow(prop.name)}>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <span aria-hidden="true" className={`material-symbols-outlined transition-transform duration-200 ${expandedRows.has(prop.name) ? "text-primary rotate-0" : "text-on-surface-variant -rotate-90"}`}>
                          expand_more
                        </span>
                        <div>
                          <p className="text-sm font-extrabold text-on-surface">{prop.name}</p>
                          <p className="text-[11px] text-on-surface-variant font-medium">{prop.type}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right font-bold text-sm">{prop.income}</td>
                    <td className={`px-6 py-5 text-right font-bold text-sm ${prop.creditsColor || ""}`}>{prop.credits}</td>
                    <td className="px-6 py-5 text-right font-bold text-sm text-error">{prop.debits}</td>
                    <td className="px-6 py-5 text-right font-extrabold text-sm">{prop.net}</td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${prop.statusColor}`}>
                        {prop.status}
                      </span>
                    </td>
                  </tr>
                  {expandedRows.has(prop.name) && prop.subItems.map((sub) => (
                    <tr key={sub.name}>
                      <td className="pl-14 pr-6 py-4">
                        <p className="text-sm text-on-surface font-medium">{sub.name}</p>
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-medium">{sub.income}</td>
                      <td className="px-6 py-4 text-right text-sm text-on-surface-variant">{sub.credits}</td>
                      <td className={`px-6 py-4 text-right text-sm ${sub.debitsColor || "text-on-surface-variant"} font-medium`}>{sub.debits}</td>
                      <td className="px-6 py-4 text-right text-sm font-bold">{sub.net}</td>
                      <td className="px-6 py-4" />
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer Section */}
      <div className="flex flex-col md:flex-row items-center justify-between pt-10 border-t border-outline-variant/10">
        <div className="flex items-center gap-3 text-sm text-on-surface-variant font-medium">
          <span aria-hidden="true" className="material-symbols-outlined text-primary/60">history_edu</span>
          Statement generated Mar 24, 2024 &bull; 14:02 PM
        </div>
        <div className="flex items-center gap-4 mt-6 md:mt-0">
          <button
            onClick={() => { if (printState !== "idle") return; setPrintState("loading"); setTimeout(() => { setPrintState("done"); setTimeout(() => setPrintState("idle"), 2000); }, 1500); }}
            disabled={printState !== "idle"}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${printState === "done" ? "bg-success-container0 text-white" : printState === "loading" ? "border border-outline-variant text-on-surface-variant cursor-wait" : "border border-outline-variant text-on-surface hover:bg-surface-container-low"}`}
          >
            <span aria-hidden="true" className="material-symbols-outlined">{printState === "done" ? "check" : printState === "loading" ? "hourglass_top" : "print"}</span>
            {printState === "done" ? "Sent!" : printState === "loading" ? "Printing..." : "Print"}
          </button>
          <button
            onClick={() => { if (downloadState !== "idle") return; setDownloadState("loading"); setTimeout(() => { setDownloadState("done"); setTimeout(() => setDownloadState("idle"), 2000); }, 1500); }}
            disabled={downloadState !== "idle"}
            className={`flex items-center gap-2 px-8 py-2.5 rounded-xl text-sm font-bold shadow-lg transition-all ${downloadState === "done" ? "bg-success-container0 text-white shadow-success/20" : downloadState === "loading" ? "bg-primary/70 text-white shadow-primary/20 cursor-wait" : "bg-primary text-white shadow-primary/20 hover:opacity-90 active:scale-[0.98]"}`}
          >
            <span aria-hidden="true" className="material-symbols-outlined">{downloadState === "done" ? "check" : downloadState === "loading" ? "hourglass_top" : "download"}</span>
            {downloadState === "done" ? "Downloaded!" : downloadState === "loading" ? "Downloading..." : "Download PDF"}
          </button>
        </div>
      </div>
    </AppLayout>
  );
}
