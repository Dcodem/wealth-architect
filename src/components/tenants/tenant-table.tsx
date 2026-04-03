"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

type Tenant = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  propertyId: string;
  unitNumber: string | null;
  leaseStart: Date | null;
  leaseEnd: Date | null;
};

type Property = {
  id: string;
  address: string;
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const INITIAL_COLORS = [
  "bg-primary-fixed text-primary",
  "bg-amber-100 text-amber-700",
  "bg-emerald-100 text-emerald-700",
  "bg-violet-100 text-violet-700",
  "bg-rose-100 text-rose-700",
  "bg-sky-100 text-sky-700",
];

// Mock: some tenants are late on rent (by index for prototype)
const LATE_TENANT_INDICES = new Set([2, 5, 8, 11]);

function getLeaseStatusClasses(leaseEnd: Date | null) {
  if (!leaseEnd) {
    return "bg-surface-container-low text-outline border-outline-variant/30";
  }
  const now = new Date();
  const daysUntilEnd = Math.ceil(
    (leaseEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );
  if (daysUntilEnd < 0) {
    return "bg-error-container text-error border-error/20";
  }
  if (daysUntilEnd <= 30) {
    return "bg-red-50 text-red-700 border-red-200";
  }
  if (daysUntilEnd <= 60) {
    return "bg-orange-50 text-orange-700 border-orange-200";
  }
  if (daysUntilEnd <= 90) {
    return "bg-yellow-50 text-yellow-700 border-yellow-200";
  }
  return "bg-emerald-50 text-emerald-700 border-emerald-100";
}

function formatDate(date: Date | null) {
  if (!date) return "No lease";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function TenantTable({
  tenants,
  properties,
  onEdit,
}: {
  tenants: Tenant[];
  properties: Property[];
  onEdit?: (tenant: Tenant) => void;
}) {
  const propertyMap = new Map(properties.map((p) => [p.id, p.address]));
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showCreateCaseModal, setShowCreateCaseModal] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [caseNote, setCaseNote] = useState("");
  const [caseSent, setCaseSent] = useState(false);

  const totalPages = Math.max(1, Math.ceil(tenants.length / itemsPerPage));
  const paginatedTenants = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return tenants.slice(start, start + itemsPerPage);
  }, [tenants, currentPage, itemsPerPage]);

  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, tenants.length);

  function openCreateCaseModal(tenant: Tenant) {
    setSelectedTenant(tenant);
    setCaseNote("");
    setCaseSent(false);
    setShowCreateCaseModal(true);
  }

  function handleSubmitCase() {
    setCaseSent(true);
    setTimeout(() => {
      setShowCreateCaseModal(false);
      setCaseSent(false);
    }, 1500);
  }

  return (
    <>
      <div className="bg-surface-container-lowest rounded border border-outline-variant/20 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-primary-fixed border-b border-outline-variant/20">
                <th className="px-6 py-4 text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">
                  Name
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">
                  Contact
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">
                  Property
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">
                  Unit
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">
                  Lease End
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-on-surface-variant uppercase tracking-widest text-right">
                  Late on Rent
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {paginatedTenants.map((tenant, index) => {
                const globalIndex = (currentPage - 1) * itemsPerPage + index;
                const colorClass =
                  INITIAL_COLORS[globalIndex % INITIAL_COLORS.length];
                const isLate = LATE_TENANT_INDICES.has(globalIndex);
                return (
                  <tr
                    key={tenant.id}
                    className="group hover:bg-primary-fixed transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-5">
                      <Link
                        href={`/tenants/${tenant.id}`}
                        className="flex items-center gap-3"
                      >
                        <div
                          className={`w-8 h-8 rounded flex items-center justify-center font-bold text-xs ${colorClass}`}
                        >
                          {getInitials(tenant.name)}
                        </div>
                        <span className="text-sm font-bold text-on-surface tracking-tight">
                          {tenant.name}
                        </span>
                      </Link>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="text-[13px] text-on-surface-variant font-medium">
                          {tenant.email || "--"}
                        </span>
                        <span className="text-[11px] text-outline">
                          {tenant.phone || "--"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-[13px] text-on-surface-variant">
                        {propertyMap.get(tenant.propertyId) || "Unknown"}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-[13px] font-bold text-on-surface">
                        {tenant.unitNumber || "--"}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold border ${getLeaseStatusClasses(tenant.leaseEnd)}`}
                      >
                        {formatDate(tenant.leaseEnd)}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      {isLate ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openCreateCaseModal(tenant);
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-error/10 text-error border border-error/20 hover:bg-error/20 transition-colors"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-error"></span>
                          Late
                        </button>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          Paid
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
              {tenants.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-outline text-sm"
                  >
                    No tenants found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination footer */}
        <div className="px-6 py-4 border-t border-outline-variant/10 flex items-center justify-between bg-primary-fixed/30">
          <div className="flex items-center gap-3">
            <span className="text-[12px] font-medium text-on-surface-variant">
              Showing {startItem}–{endItem} of {tenants.length} tenant{tenants.length !== 1 ? "s" : ""}
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

      {/* Create Rent Collection Case Modal */}
      {showCreateCaseModal && selectedTenant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-on-surface/50" onClick={() => setShowCreateCaseModal(false)} />
          <div className="relative bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-on-surface">Create Rent Collection Case</h2>
                <p className="text-sm text-on-surface-variant mt-1">
                  Follow up on late rent for {selectedTenant.name}
                </p>
              </div>
              <button onClick={() => setShowCreateCaseModal(false)} className="text-outline hover:text-on-surface transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {caseSent ? (
              <div className="py-8 text-center">
                <span className="material-symbols-outlined text-4xl text-primary mb-3 block" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                <p className="text-lg font-bold text-on-surface">Case Created</p>
                <p className="text-sm text-on-surface-variant mt-1">A rent collection case has been created for {selectedTenant.name}.</p>
              </div>
            ) : (
              <>
                <div className="bg-error/5 border border-error/10 rounded-xl p-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-error/10 flex items-center justify-center">
                      <span className="material-symbols-outlined text-error">payments</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-on-surface">{selectedTenant.name}</p>
                      <p className="text-xs text-on-surface-variant">
                        {propertyMap.get(selectedTenant.propertyId) || "Unknown"} — Unit {selectedTenant.unitNumber || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest block mb-2">
                      Note (optional)
                    </label>
                    <textarea
                      value={caseNote}
                      onChange={(e) => setCaseNote(e.target.value)}
                      placeholder="Add any notes about this rent collection..."
                      rows={3}
                      className="w-full p-3 bg-surface-container-low rounded-lg border border-outline-variant/20 text-on-surface placeholder:text-on-surface-variant/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                    />
                  </div>
                </div>
                <div className="mt-6 flex justify-end gap-3">
                  <button
                    onClick={() => setShowCreateCaseModal(false)}
                    className="px-5 py-2.5 bg-surface-container-high text-on-surface rounded-lg font-bold text-sm hover:bg-surface-container-highest transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitCase}
                    className="px-6 py-2.5 bg-primary text-on-primary rounded-lg font-bold text-sm shadow-md hover:opacity-90 transition-all flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-sm">add_circle</span>
                    Create Case
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
