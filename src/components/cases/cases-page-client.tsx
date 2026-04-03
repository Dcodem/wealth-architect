"use client";

import { useState, useMemo } from "react";
import { StatsBar } from "@/components/cases/stats-bar";
import { CaseFilters } from "@/components/cases/case-filters";
import { CaseTable } from "@/components/cases/case-table";
import { CaseKanban } from "@/components/cases/case-kanban";
import { CaseCreateModal } from "@/components/cases/case-create-modal";
import type { Case, Property, Tenant, Vendor } from "@/lib/db/schema";

interface CasesPageClientProps {
  cases: Case[];
  properties: Property[];
  tenants: Tenant[];
  vendors: Vendor[];
}

export function CasesPageClient({ cases, properties, tenants, vendors }: CasesPageClientProps) {
  const [viewMode, setViewMode] = useState<"table" | "kanban">("table");
  const [statusFilter, setStatusFilter] = useState("");
  const [urgencyFilter, setUrgencyFilter] = useState("");
  const [propertyFilter, setPropertyFilter] = useState("");
  const [showNewCaseModal, setShowNewCaseModal] = useState(false);

  const OPEN_STATUSES = new Set(["open", "in_progress", "waiting_on_vendor", "waiting_on_tenant"]);

  const filteredCases = useMemo(() => {
    return cases.filter((c) => {
      if (statusFilter === "__open__") {
        if (!OPEN_STATUSES.has(c.status)) return false;
      } else if (statusFilter && c.status !== statusFilter) {
        return false;
      }
      if (urgencyFilter && c.urgency !== urgencyFilter) return false;
      if (propertyFilter && c.propertyId !== propertyFilter) return false;
      return true;
    });
  }, [cases, statusFilter, urgencyFilter, propertyFilter]);

  const openCount = cases.filter(
    (c) => !["resolved", "closed"].includes(c.status)
  ).length;

  const uniquePropertyIds = new Set(cases.map((c) => c.propertyId).filter(Boolean));

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-extrabold tracking-tight text-on-surface">Cases</h1>
        <p className="text-on-surface-variant text-sm">Monitor and manage maintenance cases across your property portfolio.</p>
      </div>

      {/* KPI Cards */}
      <StatsBar
        totalCases={cases.length}
        openCases={openCount}
        propertyCount={uniquePropertyIds.size}
        onOpenCasesClick={() => {
          if (statusFilter === "__open__") {
            setStatusFilter("");
          } else {
            setStatusFilter("__open__");
            setUrgencyFilter("");
            setPropertyFilter("");
          }
        }}
      />

      {/* Filter Bar */}
      <CaseFilters
        properties={properties}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        urgencyFilter={urgencyFilter}
        onUrgencyFilterChange={setUrgencyFilter}
        propertyFilter={propertyFilter}
        onPropertyFilterChange={setPropertyFilter}
        onClearFilters={() => {
          setStatusFilter("");
          setUrgencyFilter("");
          setPropertyFilter("");
        }}
        onNewCase={() => setShowNewCaseModal(true)}
      />

      {/* View */}
      {viewMode === "table" ? (
        <CaseTable cases={filteredCases} properties={properties} tenants={tenants} />
      ) : (
        <CaseKanban cases={filteredCases} properties={properties} tenants={tenants} />
      )}

      {/* New Case Modal */}
      {showNewCaseModal && (
        <CaseCreateModal
          properties={properties}
          vendors={vendors}
          onClose={() => setShowNewCaseModal(false)}
        />
      )}
    </div>
  );
}
