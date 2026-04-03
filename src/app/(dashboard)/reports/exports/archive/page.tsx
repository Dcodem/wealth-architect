"use client";
import AppLayout from "@/components/AppLayout";
import PageHeader from "@/components/PageHeader";
import { useState } from "react";

const allExports = [
  { id: 1, name: "FY 2022 Full Ledger", date: "Oct 12, 2023", size: "4.2 MB", format: "Excel", properties: "All Properties", dateRange: "Jan 1 – Dec 31, 2022", status: "Ready", statusColor: "text-on-success-container", dotColor: "bg-success-container0" },
  { id: 2, name: "Q3 Performance Summary", date: "Sep 01, 2023", size: "1.8 MB", format: "CSV", properties: "All Properties", dateRange: "Jul 1 – Sep 30, 2023", status: "Ready", statusColor: "text-on-success-container", dotColor: "bg-success-container0" },
  { id: 3, name: "Main St. Audit Log", date: "Aug 24, 2023", size: "12.1 MB", format: "Excel", properties: "Main St. Loft", dateRange: "Jan 1 – Aug 24, 2023", status: "Archiving", statusColor: "text-amber-600", dotColor: "bg-amber-500" },
  { id: 4, name: "Oak Ridge Tax Prep", date: "Jul 15, 2023", size: "3.6 MB", format: "Excel", properties: "Oak Ridge Estate", dateRange: "Jan 1 – Jun 30, 2023", status: "Ready", statusColor: "text-on-success-container", dotColor: "bg-success-container0" },
  { id: 5, name: "Downtown Plaza Q2", date: "Jul 02, 2023", size: "2.1 MB", format: "CSV", properties: "Downtown Plaza", dateRange: "Apr 1 – Jun 30, 2023", status: "Ready", statusColor: "text-on-success-container", dotColor: "bg-success-container0" },
  { id: 6, name: "FY 2021 Full Ledger", date: "Feb 18, 2023", size: "3.9 MB", format: "Excel", properties: "All Properties", dateRange: "Jan 1 – Dec 31, 2021", status: "Ready", statusColor: "text-on-success-container", dotColor: "bg-success-container0" },
  { id: 7, name: "Insurance Claim Backup", date: "Jan 05, 2023", size: "8.4 MB", format: "Excel", properties: "Oak Ridge Estate", dateRange: "Jun 1 – Dec 31, 2022", status: "Ready", statusColor: "text-on-success-container", dotColor: "bg-success-container0" },
  { id: 8, name: "Q4 Board Review", date: "Jan 03, 2023", size: "2.7 MB", format: "CSV", properties: "All Properties", dateRange: "Oct 1 – Dec 31, 2022", status: "Expired", statusColor: "text-on-surface-variant", dotColor: "bg-outline-variant" },
];

export default function ExportArchivePage() {
  const [downloads, setDownloads] = useState<Record<number, "idle" | "loading" | "done">>({});
  const [deleted, setDeleted] = useState<Set<number>>(new Set());
  const [filterFormat, setFilterFormat] = useState("All");

  const handleDownload = (id: number) => {
    if (downloads[id] && downloads[id] !== "idle") return;
    setDownloads((prev) => ({ ...prev, [id]: "loading" }));
    setTimeout(() => {
      setDownloads((prev) => ({ ...prev, [id]: "done" }));
      setTimeout(() => setDownloads((prev) => ({ ...prev, [id]: "idle" })), 2000);
    }, 1500);
  };

  const handleDelete = (id: number) => {
    setDeleted((prev) => new Set(prev).add(id));
  };

  const filtered = allExports
    .filter((e) => !deleted.has(e.id))
    .filter((e) => filterFormat === "All" || e.format === filterFormat);

  const totalSize = allExports.filter((e) => !deleted.has(e.id)).reduce((acc, e) => acc + parseFloat(e.size), 0);

  return (
    <AppLayout>
      <PageHeader
        title="Export Archive"
        subtitle={`${allExports.length - deleted.size} exports — ${totalSize.toFixed(1)} MB total`}
        breadcrumb={{ label: "Back to Exports", href: "/reports/exports" }}
        actions={
          <div className="flex items-center gap-3">
            <div className="relative">
              <select
                value={filterFormat}
                onChange={(e) => setFilterFormat(e.target.value)}
                aria-label="Filter by format"
                className="appearance-none bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-4 py-2.5 pr-10 text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer"
              >
                <option>All</option>
                <option>Excel</option>
                <option>CSV</option>
              </select>
              <span aria-hidden="true" className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant">expand_more</span>
            </div>
          </div>
        }
      />

      <div className="bg-surface-container-lowest rounded-2xl shadow-sm overflow-hidden border border-outline-variant/10">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-surface-container-low/50 sticky top-0 z-10 backdrop-blur-md">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest border-b border-outline-variant/10">Report</th>
                <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest border-b border-outline-variant/10">Properties</th>
                <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest border-b border-outline-variant/10">Date Range</th>
                <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest border-b border-outline-variant/10">Format</th>
                <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest border-b border-outline-variant/10">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest border-b border-outline-variant/10 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/5">
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <span aria-hidden="true" className="material-symbols-outlined text-[40px] text-outline-variant">folder_off</span>
                      <p className="text-sm font-bold text-on-surface-variant">No exports found</p>
                      <p className="text-xs text-on-surface-variant/60">Try changing the format filter</p>
                    </div>
                  </td>
                </tr>
              )}
              {filtered.map((exp) => {
                const dlState = downloads[exp.id] || "idle";
                return (
                  <tr key={exp.id} className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="px-6 py-5">
                      <div>
                        <p className="text-sm font-extrabold text-on-surface">{exp.name}</p>
                        <p className="text-[11px] text-on-surface-variant mt-0.5">{exp.date} — {exp.size}</p>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-sm text-on-surface">{exp.properties}</td>
                    <td className="px-6 py-5 text-sm text-on-surface-variant">{exp.dateRange}</td>
                    <td className="px-6 py-5">
                      <span className="px-2.5 py-1 bg-surface-container-highest rounded-lg text-[11px] font-bold text-on-surface-variant uppercase">{exp.format}</span>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`flex items-center gap-1.5 text-[11px] font-bold ${exp.statusColor}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${exp.dotColor}`} /> {exp.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {exp.status === "Ready" && (
                          <button
                            onClick={() => handleDownload(exp.id)}
                            disabled={dlState !== "idle"}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                              dlState === "done"
                                ? "bg-success-container0 text-white"
                                : dlState === "loading"
                                ? "bg-primary/10 text-primary cursor-wait"
                                : "bg-primary/5 text-primary hover:bg-primary/10"
                            }`}
                          >
                            <span aria-hidden="true" className="material-symbols-outlined text-[14px]">
                              {dlState === "done" ? "check" : dlState === "loading" ? "hourglass_top" : "download"}
                            </span>
                            {dlState === "done" ? "Done" : dlState === "loading" ? "..." : "Download"}
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(exp.id)}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold text-on-surface-variant hover:text-error hover:bg-error/5 transition-colors"
                        >
                          <span aria-hidden="true" className="material-symbols-outlined text-[14px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Storage Summary */}
      <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-outline-variant/10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-fixed-dim flex items-center justify-center">
              <span aria-hidden="true" className="material-symbols-outlined text-primary">cloud</span>
            </div>
            <div>
              <p className="text-sm font-bold text-on-surface">Archive Storage</p>
              <p className="text-[11px] text-on-surface-variant">{totalSize.toFixed(1)} MB of 250 GB used</p>
            </div>
          </div>
          <span className="text-[11px] font-bold text-on-success-container bg-success-container px-2.5 py-1 rounded-full">Healthy</span>
        </div>
        <div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full" style={{ width: `${(totalSize / 250000) * 100}%` }} />
        </div>
      </div>
    </AppLayout>
  );
}
