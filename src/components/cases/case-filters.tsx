"use client";

import { CASE_STATUSES, URGENCY_LEVELS } from "@/lib/constants";
import { formatEnum } from "@/lib/utils";
import type { Property } from "@/lib/db/schema";

type ViewMode = "table" | "kanban";

interface CaseFiltersProps {
  properties: Property[];
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  urgencyFilter: string;
  onUrgencyFilterChange: (value: string) => void;
  propertyFilter: string;
  onPropertyFilterChange: (value: string) => void;
  onClearFilters: () => void;
  onNewCase?: () => void;
}

export function CaseFilters({
  properties,
  viewMode,
  onViewModeChange,
  statusFilter,
  onStatusFilterChange,
  urgencyFilter,
  onUrgencyFilterChange,
  propertyFilter,
  onPropertyFilterChange,
  onClearFilters,
  onNewCase,
}: CaseFiltersProps) {
  const hasFilters = statusFilter || urgencyFilter || propertyFilter;

  return (
    <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/20 shadow-sm flex flex-wrap items-center gap-4">
      <div className="flex items-center gap-2">
        <label className="text-xs font-bold text-outline uppercase">Filters:</label>
        <select
          className="bg-surface-container-low border-outline-variant/20 rounded-lg text-sm px-3 py-1.5 focus:ring-primary focus:border-primary outline-none min-w-[120px]"
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value)}
        >
          <option value="">Status</option>
          <option value="__open__">All Open</option>
          {CASE_STATUSES.map((status) => (
            <option key={status} value={status}>
              {formatEnum(status)}
            </option>
          ))}
        </select>
        <select
          className="bg-surface-container-low border-outline-variant/20 rounded-lg text-sm px-3 py-1.5 focus:ring-primary focus:border-primary outline-none min-w-[120px]"
          value={urgencyFilter}
          onChange={(e) => onUrgencyFilterChange(e.target.value)}
        >
          <option value="">Urgency</option>
          {URGENCY_LEVELS.map((level) => (
            <option key={level} value={level}>
              {formatEnum(level)}
            </option>
          ))}
        </select>
        <select
          className="bg-surface-container-low border-outline-variant/20 rounded-lg text-sm px-3 py-1.5 focus:ring-primary focus:border-primary outline-none min-w-[140px]"
          value={propertyFilter}
          onChange={(e) => onPropertyFilterChange(e.target.value)}
        >
          <option value="">Property</option>
          {properties.map((p) => (
            <option key={p.id} value={p.id}>
              {p.address}
            </option>
          ))}
        </select>
      </div>
      {hasFilters && (
        <button
          className="text-primary text-sm font-medium hover:underline underline-offset-4 decoration-2 ml-auto"
          onClick={onClearFilters}
        >
          Clear filters
        </button>
      )}
      <div className={`flex items-center bg-surface-container-low p-1 rounded-lg ${hasFilters ? "mr-2" : "ml-auto mr-2"}`}>
        <button
          className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${
            viewMode === "table"
              ? "bg-surface-container-lowest text-primary shadow-sm"
              : "text-on-surface-variant hover:text-on-surface"
          }`}
          onClick={() => onViewModeChange("table")}
        >
          Table
        </button>
        <button
          className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${
            viewMode === "kanban"
              ? "bg-surface-container-lowest text-primary shadow-sm"
              : "text-on-surface-variant hover:text-on-surface"
          }`}
          onClick={() => onViewModeChange("kanban")}
        >
          Kanban
        </button>
      </div>
      <div className="h-8 w-px bg-surface-container"></div>
      <button
        onClick={onNewCase}
        className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 shadow-sm transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        New Case
      </button>
    </div>
  );
}
