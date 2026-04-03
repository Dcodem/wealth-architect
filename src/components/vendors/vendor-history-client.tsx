"use client";

import { useState } from "react";
import Link from "next/link";
import { formatEnum, timeAgo } from "@/lib/utils";

type HistoryCase = {
  id: string;
  category: string | null;
  rawMessage: string;
  status: string;
  spendingAuthorized: number | null;
  resolvedAt: string | null;
  createdAt: string;
};

export function VendorHistoryClient({
  closedCases,
  initials,
}: {
  closedCases: HistoryCase[];
  initials: string;
}) {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? closedCases : closedCases.slice(0, 4);

  function handleExport() {
    const header = "Case ID,Category,Status,Cost,Resolved Date,Created Date\n";
    const rows = closedCases
      .map((c) => {
        const cost = c.spendingAuthorized
          ? `$${(c.spendingAuthorized / 100).toFixed(2)}`
          : "—";
        const resolved = c.resolvedAt
          ? new Date(c.resolvedAt).toLocaleDateString()
          : "—";
        const created = new Date(c.createdAt).toLocaleDateString();
        return `${c.id.slice(0, 8).toUpperCase()},${c.category ? formatEnum(c.category) : "General"},${formatEnum(c.status)},${cost},${resolved},${created}`;
      })
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `vendor-history-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <div className="flex justify-between items-end mb-6">
        <h2 className="text-xl font-bold text-on-surface font-headline tracking-tight">
          Recent History
        </h2>
        <button
          onClick={handleExport}
          className="text-sm font-bold text-primary hover:opacity-80 flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-sm">download</span>
          Export Logs
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {closedCases.length === 0 && (
          <div className="text-sm text-on-surface-variant col-span-2">
            No completed jobs yet.
          </div>
        )}
        {visible.map((c) => (
          <Link
            key={c.id}
            href={`/cases/${c.id}`}
            className="bg-surface-container-low p-6 rounded-xl hover:bg-surface-container-lowest hover:shadow-md transition-all border-l-2 border-transparent hover:border-primary group"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded bg-surface-container-lowest flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                <span className="material-symbols-outlined">plumbing</span>
              </div>
              <div>
                <div className="text-xs font-bold text-on-surface-variant uppercase">
                  {c.resolvedAt
                    ? new Date(c.resolvedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : timeAgo(new Date(c.createdAt))}
                </div>
                <div className="text-sm font-bold text-on-surface">
                  {c.category ? formatEnum(c.category) : "Case"}
                </div>
              </div>
            </div>
            <div className="text-xs text-on-surface-variant mb-4">
              Case #{c.id.slice(0, 8).toUpperCase()}
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="font-bold text-on-surface">
                {c.spendingAuthorized
                  ? `$${(c.spendingAuthorized / 100).toFixed(2)}`
                  : "—"}
              </span>
              <span className="text-green-600 font-bold flex items-center gap-1">
                <span
                  className="material-symbols-outlined text-xs"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  check_circle
                </span>
                Closed
              </span>
            </div>
          </Link>
        ))}
      </div>
      {closedCases.length > 4 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="w-full mt-6 py-3 border border-outline-variant text-on-surface-variant text-sm font-bold rounded-lg hover:bg-surface-container-low transition-colors"
        >
          {showAll
            ? "Show Less"
            : `Load More History (${closedCases.length - 4} more)`}
        </button>
      )}
    </div>
  );
}
