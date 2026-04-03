"use client";

import { useState, useMemo } from "react";
import { TenantSearch } from "@/components/tenants/tenant-search";
import { TenantTable } from "@/components/tenants/tenant-table";
import { TenantForm } from "@/components/tenants/tenant-form";

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

export function TenantsPageClient({
  tenants,
  properties,
}: {
  tenants: Tenant[];
  properties: Property[];
}) {
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);

  const filtered = useMemo(() => {
    if (!search.trim()) return tenants;
    const q = search.toLowerCase();
    return tenants.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        (t.email && t.email.toLowerCase().includes(q)) ||
        (t.unitNumber && t.unitNumber.toLowerCase().includes(q)) ||
        (t.phone && t.phone.includes(q))
    );
  }, [tenants, search]);

  // Compute stats
  const totalTenants = tenants.length;
  const leasesByWindow = useMemo(() => {
    let d30 = 0, d60 = 0, d90 = 0;
    for (const t of tenants) {
      if (!t.leaseEnd) continue;
      const days = Math.ceil((t.leaseEnd.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      if (days > 0 && days <= 30) d30++;
      else if (days > 30 && days <= 60) d60++;
      else if (days > 60 && days <= 90) d90++;
    }
    return { d30, d60, d90, total: d30 + d60 + d90 };
  }, [tenants]);
  const activeCases = 0; // Placeholder -- would need case data

  return (
    <div className="pt-8 pb-12 px-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-on-surface tracking-tighter">
            Tenants
          </h2>
          <p className="text-on-surface-variant text-[15px] mt-1 font-medium">
            Your architectural ledger of occupants
          </p>
        </div>
        <button
          onClick={() => {
            setEditingTenant(null);
            setShowForm(true);
          }}
          className="bg-primary hover:opacity-90 text-on-primary font-bold py-2.5 px-6 rounded flex items-center gap-2 transition-all shadow-sm active:scale-95"
        >
          <span className="material-symbols-outlined text-[20px]">
            person_add
          </span>
          <span className="text-sm">+ Add Tenant</span>
        </button>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-surface-container-lowest p-5 rounded border border-outline-variant/20 flex flex-col">
          <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest mb-2">
            Total Tenants
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-on-surface tracking-tighter">
              {totalTenants}
            </span>
          </div>
        </div>
        <div className="bg-surface-container-lowest p-5 rounded border border-outline-variant/20 flex flex-col">
          <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest mb-2">
            Leases Expiring
          </span>
          <div className="flex items-center gap-3">
            <span className="text-3xl font-extrabold text-on-surface tracking-tighter">
              {leasesByWindow.total}
            </span>
            <div className="flex flex-col gap-0.5">
              {leasesByWindow.d30 > 0 && (
                <span className="text-[10px] font-bold text-red-700 bg-red-50 px-1.5 py-0.5 rounded flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500" />{leasesByWindow.d30} within 30d
                </span>
              )}
              {leasesByWindow.d60 > 0 && (
                <span className="text-[10px] font-bold text-orange-700 bg-orange-50 px-1.5 py-0.5 rounded flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />{leasesByWindow.d60} within 60d
                </span>
              )}
              {leasesByWindow.d90 > 0 && (
                <span className="text-[10px] font-bold text-yellow-700 bg-yellow-50 px-1.5 py-0.5 rounded flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" />{leasesByWindow.d90} within 90d
                </span>
              )}
              {leasesByWindow.total === 0 && (
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">All clear</span>
              )}
            </div>
          </div>
        </div>
        <div className="bg-surface-container-lowest p-5 rounded border border-outline-variant/20 flex flex-col">
          <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest mb-2">
            Occupancy
          </span>
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-extrabold text-on-surface tracking-tighter">
              {totalTenants > 0 ? "100%" : "0%"}
            </span>
            <div className="flex-1 h-1 bg-surface-container-low rounded-full overflow-hidden">
              <div
                className="h-full bg-primary"
                style={{ width: totalTenants > 0 ? "100%" : "0%" }}
              />
            </div>
          </div>
        </div>
        <div className="bg-surface-container-lowest p-5 rounded border border-outline-variant/20 flex flex-col">
          <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest mb-2">
            Active Cases
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-on-surface tracking-tighter">
              {activeCases}
            </span>
            <span className="text-[11px] text-primary font-bold bg-primary-fixed px-2 py-0.5 rounded">
              Pending
            </span>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <TenantSearch value={search} onChange={setSearch} />
      </div>

      {/* Table */}
      <TenantTable
        tenants={filtered}
        properties={properties}
        onEdit={(tenant) => {
          setEditingTenant(tenant);
          setShowForm(true);
        }}
      />

      {/* Add/Edit Modal */}
      {showForm && (
        <TenantForm
          properties={properties}
          tenant={editingTenant}
          onClose={() => {
            setShowForm(false);
            setEditingTenant(null);
          }}
        />
      )}
    </div>
  );
}
