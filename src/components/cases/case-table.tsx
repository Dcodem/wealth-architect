"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { formatEnum, timeAgo } from "@/lib/utils";
import type { Case, Property, Tenant } from "@/lib/db/schema";

const URGENCY_DOT: Record<string, string> = {
  critical: "bg-error",
  high: "bg-caution",
  medium: "bg-warning-dim",
  low: "bg-success-dim",
};

const CATEGORY_BADGE: Record<string, string> = {
  maintenance: "bg-info-container text-info",
  emergency: "bg-error-container text-on-error-container",
  lease_question: "bg-purple-container text-on-purple-container",
  noise_complaint: "bg-neutral-container text-on-neutral-container",
  payment: "bg-success-container text-on-success-container",
  general: "bg-surface-container-high text-on-surface-variant",
};

const STATUS_DOT: Record<string, string> = {
  open: "bg-info",
  in_progress: "bg-purple",
  waiting_on_vendor: "bg-caution",
  waiting_on_tenant: "bg-warning-dim",
  resolved: "bg-success-dim",
  closed: "bg-neutral",
};

const STATUS_TEXT: Record<string, string> = {
  open: "text-info",
  in_progress: "text-on-purple-container",
  waiting_on_vendor: "text-on-caution-container",
  waiting_on_tenant: "text-on-warning-container",
  resolved: "text-on-success-container",
  closed: "text-on-neutral-container",
};

const SOURCE_ICON: Record<string, React.ReactNode> = {
  sms: (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
  ),
  email: (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
      <polyline points="22,6 12,13 2,6"></polyline>
    </svg>
  ),
};

// Generate AI-like summary from raw message
function generateSummary(rawMessage: string, category: string | null, status: string): string {
  const cat = category ?? "general";
  const summaries: Record<string, (msg: string) => string> = {
    maintenance: (msg) => {
      if (msg.toLowerCase().includes("sink") || msg.toLowerCase().includes("leak")) return "Kitchen sink leak — water pooling under cabinet";
      if (msg.toLowerCase().includes("ac") || msg.toLowerCase().includes("hvac") || msg.toLowerCase().includes("air")) return "AC unit blowing warm air — needs HVAC service";
      if (msg.toLowerCase().includes("dishwasher")) return "Dishwasher malfunction — grinding noise, won't drain";
      if (msg.toLowerCase().includes("ant") || msg.toLowerCase().includes("pest")) return "Ant infestation in kitchen — recurring issue near baseboard";
      return msg.length > 60 ? msg.slice(0, 57) + "..." : msg;
    },
    emergency: (msg) => {
      if (msg.toLowerCase().includes("electrical") || msg.toLowerCase().includes("burning")) return "Electrical emergency — burning smell from outlet";
      if (msg.toLowerCase().includes("lock")) return "Tenant lockout — needs emergency locksmith";
      return msg.length > 60 ? msg.slice(0, 57) + "..." : msg;
    },
    lease_question: () => "Lease renewal inquiry — requesting terms for extension",
    noise_complaint: (msg) => {
      if (msg.toLowerCase().includes("construction")) return "Early-morning construction noise — violates quiet hours";
      return "Noise complaint — repeated late-night disturbances";
    },
    payment: () => "Payment issue — rent transfer rejected by bank",
    general: (msg) => msg.length > 60 ? msg.slice(0, 57) + "..." : msg,
  };
  return (summaries[cat] ?? summaries.general)(rawMessage);
}

interface CaseTableProps {
  cases: Case[];
  properties: Property[];
  tenants: Tenant[];
}

export function CaseTable({ cases, properties, tenants }: CaseTableProps) {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const totalPages = Math.max(1, Math.ceil(cases.length / itemsPerPage));
  const paginatedCases = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return cases.slice(start, start + itemsPerPage);
  }, [cases, currentPage, itemsPerPage]);

  // Reset to page 1 when items per page or data changes
  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  if (cases.length === 0) {
    return (
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 card-shadow overflow-hidden">
        <div className="px-6 py-16 text-center">
          <p className="text-on-surface-variant text-sm">No cases found.</p>
        </div>
      </div>
    );
  }

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, cases.length);

  return (
    <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 card-shadow overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-surface-container-low border-b border-outline-variant/30">
            <th className="px-6 py-4 text-xs font-bold text-outline uppercase tracking-wider w-32">Urgency</th>
            <th className="px-6 py-4 text-xs font-bold text-outline uppercase tracking-wider">Subject</th>
            <th className="px-6 py-4 text-xs font-bold text-outline uppercase tracking-wider w-40">Category</th>
            <th className="px-6 py-4 text-xs font-bold text-outline uppercase tracking-wider w-32">Source</th>
            <th className="px-6 py-4 text-xs font-bold text-outline uppercase tracking-wider w-44">Status</th>
            <th className="px-6 py-4 text-xs font-bold text-outline uppercase tracking-wider w-24">Time</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-outline-variant/30">
          {paginatedCases.map((c) => (
            <tr
              key={c.id}
              onClick={() => router.push(`/cases/${c.id}`)}
              className="hover:bg-primary-fixed/30 transition-colors cursor-pointer group"
            >
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${URGENCY_DOT[c.urgency ?? "low"]}`}></span>
                  <span className="text-sm font-medium text-on-surface">{formatEnum(c.urgency ?? "low")}</span>
                </div>
              </td>
              <td className="px-6 py-4">
                <p className="text-sm text-on-surface font-semibold truncate max-w-[300px]">
                  {generateSummary(c.rawMessage, c.category, c.status)}
                </p>
              </td>
              <td className="px-6 py-4">
                <span className={`${CATEGORY_BADGE[c.category ?? "general"]} text-[11px] font-bold px-2.5 py-1 rounded-full uppercase`}>
                  {formatEnum(c.category ?? "general")}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2 text-on-surface-variant">
                  {SOURCE_ICON[c.source] ?? SOURCE_ICON.email}
                  <span className="text-xs font-medium">{c.source.toUpperCase()}</span>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${STATUS_DOT[c.status]}`}></span>
                  <span className={`text-sm font-medium ${STATUS_TEXT[c.status]}`}>{formatEnum(c.status)}</span>
                </div>
              </td>
              <td className="px-6 py-4 text-xs text-outline font-medium">{timeAgo(c.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Pagination Footer */}
      <div className="px-6 py-4 bg-surface-container-low flex items-center justify-between border-t border-outline-variant/30">
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium text-on-surface-variant">
            Showing {startItem}–{endItem} of {cases.length} case{cases.length !== 1 ? "s" : ""}
          </span>
          <select
            value={itemsPerPage}
            onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
            className="text-xs bg-surface-container-lowest border border-outline-variant/20 rounded px-2 py-1 text-on-surface-variant focus:ring-1 focus:ring-primary"
          >
            <option value={5}>5 per page</option>
            <option value={10}>10 per page</option>
            <option value={25}>25 per page</option>
            <option value={50}>50 per page</option>
          </select>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-2.5 py-1 text-xs font-bold rounded hover:bg-surface-container-high transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-on-surface-variant"
          >
            <span className="material-symbols-outlined text-sm">chevron_left</span>
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-8 h-8 text-xs font-bold rounded transition-colors ${
                page === currentPage
                  ? "bg-primary text-on-primary"
                  : "text-on-surface-variant hover:bg-surface-container-high"
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-2.5 py-1 text-xs font-bold rounded hover:bg-surface-container-high transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-on-surface-variant"
          >
            <span className="material-symbols-outlined text-sm">chevron_right</span>
          </button>
        </div>
      </div>
    </div>
  );
}
