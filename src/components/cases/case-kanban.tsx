"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { formatEnum, timeAgo } from "@/lib/utils";
import type { Case, Property, Tenant } from "@/lib/db/schema";

const URGENCY_DOT: Record<string, string> = {
  critical: "bg-red-500",
  high: "bg-red-500",
  medium: "bg-amber-500",
  low: "bg-blue-500",
};

const URGENCY_BORDER: Record<string, string> = {
  critical: "border-red-500",
  high: "border-red-500",
  medium: "border-amber-500",
  low: "border-blue-500",
};

const CATEGORIES = ["emergency", "plumbing", "electrical", "hvac", "general", "structural"];

function statusToColumn(status: string): string {
  switch (status) {
    case "open": return "new";
    case "waiting_on_vendor":
    case "in_progress": return status;
    case "waiting_on_tenant": return "in_progress";
    case "resolved":
    case "closed": return "resolved";
    default: return "new";
  }
}

const COLUMNS = [
  { key: "new", label: "New Cases", dot: "bg-blue-600" },
  { key: "waiting_on_vendor", label: "Vendor Dispatched", dot: "bg-cyan-600" },
  { key: "in_progress", label: "In Progress", dot: "bg-amber-400" },
  { key: "resolved", label: "Resolved", dot: "bg-success-container0" },
] as const;

interface CaseKanbanProps {
  cases: Case[];
  properties: Property[];
  tenants: Tenant[];
}

export function CaseKanban({ cases, properties, tenants }: CaseKanbanProps) {
  const propertyMap = new Map(properties.map((p) => [p.id, p]));
  const tenantMap = new Map(tenants.map((t) => [t.id, t]));

  // Local state for column assignments and categories
  const [columnOverrides, setColumnOverrides] = useState<Record<string, string>>({});
  const [categoryOverrides, setCategoryOverrides] = useState<Record<string, string>>({});
  const [dragOverCol, setDragOverCol] = useState<string | null>(null);
  const [openCategoryDropdown, setOpenCategoryDropdown] = useState<string | null>(null);
  const draggedCaseId = useRef<string | null>(null);

  // Build columns from cases + overrides
  const columns: Record<string, Case[]> = { new: [], waiting_on_vendor: [], in_progress: [], resolved: [] };
  for (const c of cases) {
    const col = columnOverrides[c.id] ?? statusToColumn(c.status);
    columns[col]?.push(c);
  }

  function handleDragStart(caseId: string) {
    draggedCaseId.current = caseId;
  }

  function handleDragOver(e: React.DragEvent, colKey: string) {
    e.preventDefault();
    setDragOverCol(colKey);
  }

  function handleDragLeave() {
    setDragOverCol(null);
  }

  function handleDrop(colKey: string) {
    if (draggedCaseId.current) {
      setColumnOverrides((prev) => ({ ...prev, [draggedCaseId.current!]: colKey }));
    }
    draggedCaseId.current = null;
    setDragOverCol(null);
  }

  function handleCategoryChange(caseId: string, category: string) {
    setCategoryOverrides((prev) => ({ ...prev, [caseId]: category }));
    setOpenCategoryDropdown(null);
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-start">
      {COLUMNS.map((col) => {
        const colCases = columns[col.key] ?? [];
        const isResolved = col.key === "resolved";
        const isDragOver = dragOverCol === col.key;

        return (
          <div
            key={col.key}
            className={`flex flex-col gap-4 min-h-[200px] rounded-xl p-3 transition-all ${
              isDragOver ? "bg-primary/5 ring-2 ring-primary/30" : ""
            }`}
            onDragOver={(e) => handleDragOver(e, col.key)}
            onDragLeave={handleDragLeave}
            onDrop={() => handleDrop(col.key)}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between px-2 mb-2">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${col.dot}`}></span>
                <h3 className="font-bold text-sm tracking-tight text-on-surface-variant uppercase">{col.label}</h3>
              </div>
              <span className="text-xs font-bold text-outline bg-surface-container-low px-2 py-0.5 rounded-full">
                {colCases.length}
              </span>
            </div>

            {/* Cards */}
            {colCases.map((c) => {
              const property = c.propertyId ? propertyMap.get(c.propertyId) : null;
              const tenant = c.tenantId ? tenantMap.get(c.tenantId) : null;
              const displayCategory = categoryOverrides[c.id] ?? c.category ?? "general";

              return (
                <div
                  key={c.id}
                  draggable
                  onDragStart={() => handleDragStart(c.id)}
                  className="cursor-grab active:cursor-grabbing"
                >
                  <Link href={`/cases/${c.id}`} className="block">
                    <div
                      className={`bg-surface-container-lowest p-5 rounded-xl border-l-[3px] ${
                        isResolved
                          ? "border-outline-variant opacity-70"
                          : URGENCY_BORDER[c.urgency ?? "low"]
                      } flex flex-col gap-4 transition-all hover:translate-y-[-2px] hover:shadow-md`}
                    >
                      {/* Top row */}
                      <div className="flex justify-between items-start">
                        {isResolved ? (
                          <>
                            <div className={`w-3 h-3 rounded-full ${URGENCY_DOT[c.urgency ?? "low"]}`}></div>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-on-success-container">
                              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                              <polyline points="22 4 12 14.01 9 11.01"></polyline>
                            </svg>
                          </>
                        ) : (
                          <>
                            <div className={`w-3 h-3 rounded-full ${URGENCY_DOT[c.urgency ?? "low"]}`} title={`${formatEnum(c.urgency ?? "low")} Priority`}></div>
                            {c.confidenceScore != null && (
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                (c.urgency === "critical" || c.urgency === "high")
                                  ? "bg-red-50 text-red-700"
                                  : "bg-surface-container-low text-on-surface-variant"
                              }`}>
                                {Math.round(c.confidenceScore * 100)}% Confidence
                              </span>
                            )}
                          </>
                        )}
                      </div>

                      {/* Category badge */}
                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setOpenCategoryDropdown(openCategoryDropdown === c.id ? null : c.id);
                          }}
                          className="text-[10px] font-bold px-2 py-0.5 rounded bg-primary-fixed text-primary uppercase tracking-wider hover:bg-primary/10 transition-colors"
                        >
                          {formatEnum(displayCategory)}
                        </button>
                        {openCategoryDropdown === c.id && (
                          <div
                            className="absolute left-0 top-full mt-1 z-30 bg-surface-container-lowest rounded-lg shadow-xl border border-outline-variant/20 py-1 min-w-[140px]"
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                          >
                            {CATEGORIES.map((cat) => (
                              <button
                                key={cat}
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleCategoryChange(c.id, cat);
                                }}
                                className={`w-full text-left px-3 py-1.5 text-xs font-medium hover:bg-primary-fixed transition-colors capitalize ${
                                  displayCategory === cat ? "text-primary font-bold" : "text-on-surface"
                                }`}
                              >
                                {formatEnum(cat)}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Title & location */}
                      <div>
                        <h4 className="font-bold text-on-surface leading-snug mb-1 line-clamp-2">{c.rawMessage}</h4>
                        <p className="text-xs text-on-surface-variant font-medium">
                          {tenant?.unitNumber ? `Unit ${tenant.unitNumber}` : ""}
                          {tenant?.unitNumber && property ? " \u2022 " : ""}
                          {property?.address ?? ""}
                        </p>
                      </div>

                      {/* Footer */}
                      <div className="flex justify-between items-center pt-2 border-t border-outline-variant/10">
                        {tenant ? (
                          <div className="w-6 h-6 rounded-full bg-surface-container flex items-center justify-center text-[10px] font-bold text-on-surface-variant border-2 border-white">
                            {tenant.name.charAt(0).toUpperCase()}
                          </div>
                        ) : (
                          <div></div>
                        )}
                        <span className="text-[10px] text-outline font-medium italic">
                          {isResolved && c.resolvedAt
                            ? `Closed ${timeAgo(c.resolvedAt)}`
                            : timeAgo(c.createdAt)}
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}

            {colCases.length === 0 && (
              <div className={`bg-surface-container-lowest/50 p-5 rounded-xl border border-dashed border-outline-variant/20 text-center ${
                isDragOver ? "border-primary/50 bg-primary/5" : ""
              }`}>
                <p className="text-xs text-outline">{isDragOver ? "Drop here" : "No cases"}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
