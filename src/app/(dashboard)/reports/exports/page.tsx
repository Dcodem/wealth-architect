"use client";
import AppLayout from "@/components/AppLayout";
import PageHeader from "@/components/PageHeader";
import Link from "next/link";
import { useState } from "react";

const completenessData = {
  overall: 94,
  properties: [
    { name: "Main St. Loft", pct: 97, transactions: 412, uncategorized: 3 },
    { name: "Oak Ridge Estate", pct: 100, transactions: 186, uncategorized: 0 },
    { name: "Downtown Plaza", pct: 85, transactions: 248, uncategorized: 8 },
  ],
  issues: [
    { icon: "category", label: "Uncategorized", count: 11, color: "text-amber-600 bg-amber-50", href: "/transactions/smart-triage" },
    { icon: "content_copy", label: "Possible duplicates", count: 3, color: "text-orange-600 bg-orange-50", href: "/transactions/ai-review/duplicates" },
    { icon: "electric_bolt", label: "Large unverified", count: 3, color: "text-red-600 bg-red-50", href: "/transactions/ai-review/large-transactions" },
  ],
};

const exportHistory = [
  { name: "FY 2022 Full Ledger", date: "Oct 12, 2023", size: "4.2 MB", format: "Excel", status: "Ready", statusColor: "text-emerald-700", dotColor: "bg-emerald-500" },
  { name: "Q3 Performance Summary", date: "Sep 01, 2023", size: "1.8 MB", format: "CSV", status: "Ready", statusColor: "text-emerald-700", dotColor: "bg-emerald-500" },
  { name: "Main St. Audit Log", date: "Aug 24, 2023", size: "12.1 MB", format: "Excel", status: "Archiving", statusColor: "text-amber-600", dotColor: "bg-amber-500" },
];

export default function ExportsPage() {
  const [format, setFormat] = useState("excel");
  const [dateRange, setDateRange] = useState("2023 Tax Year");
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);

  const handleGenerate = () => {
    setGenerating(true);
    setGenerated(false);
    setTimeout(() => {
      setGenerating(false);
      setGenerated(true);
    }, 3000);
  };

  return (
    <AppLayout>
      <PageHeader
        title="Export Reports"
        subtitle="Configure and generate detailed financial statements for your portfolio."
        breadcrumb={{ label: "Back to Reports", href: "/reports" }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Stepped Form Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-surface-container-lowest p-8 rounded-xl card-shadow space-y-10">
            {/* Step 1: Format */}
            <section>
              <h2 className="text-sm font-bold text-on-surface-variant uppercase tracking-widest mb-6 flex items-center gap-2">
                <span className="w-5 h-5 flex items-center justify-center rounded-full bg-primary text-[11px] text-white">1</span>
                Select Export Format
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <label
                  onClick={() => setFormat("excel")}
                  className={`relative flex flex-col items-center justify-center p-6 border-2 rounded-xl cursor-pointer transition-all ${
                    format === "excel" ? "border-primary bg-teal-50/20" : "border-transparent bg-surface-container-low hover:bg-surface-container-high"
                  }`}
                >
                  <span aria-hidden="true" className={`material-symbols-outlined text-[32px] mb-2 ${format === "excel" ? "text-teal-700" : "text-on-surface-variant"}`}>table_chart</span>
                  <span className="text-sm font-bold text-on-surface">Excel</span>
                  <span className="text-[11px] text-on-surface-variant">.xlsx file</span>
                  {format === "excel" && (
                    <div className="absolute top-2 right-2">
                      <span aria-hidden="true" className="material-symbols-outlined text-primary text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    </div>
                  )}
                </label>
                <label
                  onClick={() => setFormat("csv")}
                  className={`relative flex flex-col items-center justify-center p-6 border-2 rounded-xl cursor-pointer transition-all ${
                    format === "csv" ? "border-primary bg-teal-50/20" : "border-transparent bg-surface-container-low hover:bg-surface-container-high"
                  }`}
                >
                  <span aria-hidden="true" className={`material-symbols-outlined text-[32px] mb-2 ${format === "csv" ? "text-teal-700" : "text-on-surface-variant"}`}>description</span>
                  <span className="text-sm font-bold text-on-surface">CSV</span>
                  <span className="text-[11px] text-on-surface-variant">Raw data</span>
                  {format === "csv" && (
                    <div className="absolute top-2 right-2">
                      <span aria-hidden="true" className="material-symbols-outlined text-primary text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    </div>
                  )}
                </label>
              </div>
            </section>

            {/* Step 2: Date Range */}
            <section>
              <h2 className="text-sm font-bold text-on-surface-variant uppercase tracking-widest mb-6 flex items-center gap-2">
                <span className="w-5 h-5 flex items-center justify-center rounded-full bg-primary text-[11px] text-white">2</span>
                Date Range
              </h2>
              <div className="relative">
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  aria-label="Date range"
                  className="w-full bg-surface-container-low border-none rounded-xl py-3 pl-4 pr-10 text-sm font-medium focus:ring-2 focus:ring-teal-500/20 appearance-none"
                >
                  <option>2023 Tax Year</option>
                  <option>Q1 2024</option>
                  <option>Last 12 Months</option>
                  <option>Custom Range...</option>
                </select>
                <span aria-hidden="true" className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">expand_more</span>
              </div>
              {dateRange === "Custom Range..." && (
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-[11px] font-bold text-on-surface-variant uppercase tracking-widest mb-2">Start Date</label>
                    <input
                      type="date"
                      className="w-full bg-surface-container-low border-none rounded-xl py-3 pl-4 pr-10 text-sm font-medium focus:ring-2 focus:ring-teal-500/20"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-on-surface-variant uppercase tracking-widest mb-2">End Date</label>
                    <input
                      type="date"
                      className="w-full bg-surface-container-low border-none rounded-xl py-3 pl-4 pr-10 text-sm font-medium focus:ring-2 focus:ring-teal-500/20"
                    />
                  </div>
                </div>
              )}
            </section>

            {/* Step 3: Property Selection */}
            <section>
              <h2 className="text-sm font-bold text-on-surface-variant uppercase tracking-widest mb-6 flex items-center gap-2">
                <span className="w-5 h-5 flex items-center justify-center rounded-full bg-primary text-[11px] text-white">3</span>
                Property Selection
              </h2>
              <div className="grid grid-cols-2 gap-y-4">
                {["All Properties", "Main St. Loft", "Oak Ridge", "Downtown Plaza"].map((p, i) => (
                  <label key={p} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      defaultChecked={i === 0}
                      className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary/20 cursor-pointer"
                    />
                    <span className="text-sm font-medium text-on-surface">{p}</span>
                  </label>
                ))}
              </div>
            </section>

            {/* Step 4: Table Preferences */}
            <section>
              <h2 className="text-sm font-bold text-on-surface-variant uppercase tracking-widest mb-6 flex items-center gap-2">
                <span className="w-5 h-5 flex items-center justify-center rounded-full bg-primary text-[11px] text-white">4</span>
                Table Preferences
              </h2>
              <div className="space-y-4">
                {[
                  { label: "Include charts", desc: "Visualize trends in the Excel dashboard tab" },
                  { label: "Include notes", desc: "Add auditor comments to transaction lines" },
                  { label: "Separate sheets per property", desc: "Organize assets into individual workbook tabs" },
                ].map((pref) => (
                  <label key={pref.label} className="flex items-center gap-3 p-4 bg-surface-container-low rounded-xl cursor-pointer hover:bg-surface-container-high transition-all">
                    <input type="checkbox" className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary/20 cursor-pointer" />
                    <div className="flex flex-col">
                      <span className="text-sm font-bold">{pref.label}</span>
                      <span className="text-[11px] text-on-surface-variant">{pref.desc}</span>
                    </div>
                  </label>
                ))}
              </div>
            </section>

            {/* Footer of Form */}
            <footer className="pt-10 border-t border-surface space-y-6" aria-live="polite">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                  <span>Storage quota</span>
                  <span>84.2 GB of 250 GB used</span>
                </div>
                <div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: "33.68%" }} />
                </div>
              </div>
              {generated ? (
                <div className="w-full py-4 bg-emerald-500 text-white text-lg font-extrabold rounded-xl shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2">
                  <span aria-hidden="true" className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  Report Ready — Download Now
                </div>
              ) : (
                <button
                  onClick={handleGenerate}
                  disabled={generating}
                  className="w-full py-4 bg-primary text-white text-lg font-extrabold rounded-xl shadow-lg shadow-teal-500/20 hover:opacity-90 active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  {generating ? (
                    <>
                      <span aria-hidden="true" className="material-symbols-outlined text-[24px] animate-spin">progress_activity</span>
                      Generating Report...
                    </>
                  ) : (
                    "Generate 2023 Report"
                  )}
                </button>
              )}
            </footer>
          </div>
        </div>

        {/* Secondary Content Column */}
        <div className="space-y-8">
          {/* Data Completeness Meter */}
          <section>
            <h3 className="text-sm font-bold text-on-surface-variant uppercase tracking-widest mb-4">Data Completeness</h3>
            <div className="bg-surface-container-lowest rounded-xl card-shadow overflow-hidden">
              {/* Overall Score */}
              <div className="p-6 border-b border-outline-variant/10">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${completenessData.overall >= 80 ? "bg-emerald-100 text-emerald-700" : completenessData.overall >= 60 ? "bg-amber-100 text-amber-600" : "bg-red-100 text-red-600"}`}>
                      <span aria-hidden="true" className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                    </div>
                    <div>
                      <p className="text-2xl font-extrabold text-on-surface">{completenessData.overall}%</p>
                      <p className="text-[11px] text-on-surface-variant font-bold uppercase tracking-wider">Export Ready</p>
                    </div>
                  </div>
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${completenessData.overall >= 95 ? "text-emerald-700 bg-emerald-50" : completenessData.overall >= 80 ? "text-emerald-600 bg-emerald-50" : completenessData.overall >= 60 ? "text-amber-600 bg-amber-50" : "text-red-600 bg-red-50"}`}>
                    {completenessData.overall >= 95 ? "Clean" : completenessData.overall >= 80 ? "Almost Ready" : completenessData.overall >= 60 ? "Needs Review" : "Issues Found"}
                  </span>
                </div>
                <div className="w-full h-2.5 bg-surface-container-high rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${completenessData.overall >= 80 ? "bg-emerald-500" : completenessData.overall >= 60 ? "bg-amber-500" : "bg-red-500"}`}
                    style={{ width: `${completenessData.overall}%` }}
                  />
                </div>
              </div>

              {/* Per-Property Breakdown */}
              <div className="px-6 py-4 space-y-3">
                {completenessData.properties.map((prop) => (
                  <div key={prop.name} className="flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-on-surface truncate">{prop.name}</span>
                        <span className={`text-[11px] font-bold ${prop.pct === 100 ? "text-emerald-600" : prop.pct >= 90 ? "text-on-surface" : "text-amber-600"}`}>{prop.pct}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${prop.pct === 100 ? "bg-emerald-500" : prop.pct >= 90 ? "bg-primary" : "bg-amber-500"}`}
                          style={{ width: `${prop.pct}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-[10px] text-on-surface-variant">{prop.transactions} transactions</span>
                        {prop.uncategorized > 0 && (
                          <span className="text-[10px] text-amber-600 font-medium">{prop.uncategorized} uncategorized</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Issues to Resolve */}
              <div className="px-6 py-4 border-t border-outline-variant/10 space-y-2">
                <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-3">Resolve Before Export</p>
                {completenessData.issues.map((issue) => (
                  <Link
                    key={issue.label}
                    href={issue.href}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-surface-container-low transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <span aria-hidden="true" className={`material-symbols-outlined text-lg ${issue.color.split(" ")[0]}`}>{issue.icon}</span>
                      <span className="text-sm font-medium text-on-surface">{issue.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${issue.color}`}>{issue.count}</span>
                      <span aria-hidden="true" className="material-symbols-outlined text-[14px] text-on-surface-variant group-hover:text-primary transition-colors">arrow_forward</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          {/* Export History */}
          <section>
            <h3 className="text-sm font-bold text-on-surface-variant uppercase tracking-widest mb-4">Export History</h3>
            <div className="bg-surface-container-lowest rounded-xl card-shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-surface-container-low border-b border-surface-variant">
                    <tr>
                      <th className="px-4 py-3 text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">Report Name</th>
                      <th className="px-4 py-3 text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">Format</th>
                      <th className="px-4 py-3 text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface">
                    {exportHistory.map((item) => (
                      <tr key={item.name} className="hover:bg-surface-container-low transition-colors">
                        <td className="px-4 py-4">
                          <div className="text-xs font-bold text-on-surface">{item.name}</div>
                          <div className="text-[11px] text-on-surface-variant mt-0.5">{item.date} &bull; {item.size}</div>
                        </td>
                        <td className="px-4 py-4">
                          <span className="px-2 py-1 bg-surface-container-highest rounded text-[11px] font-bold text-on-surface-variant uppercase">{item.format}</span>
                        </td>
                        <td className="px-4 py-4">
                          <span className={`flex items-center gap-1 text-[11px] font-bold ${item.statusColor}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${item.dotColor}`} /> {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-4 bg-surface-container-low/50 text-center">
                <Link
                  href="/reports/exports/archive"
                  className="text-[11px] font-bold text-primary hover:underline transition-colors"
                >
                  View All Archive
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </AppLayout>
  );
}
