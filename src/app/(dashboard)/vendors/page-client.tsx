"use client";

import { useState } from "react";
import Link from "next/link";
import type { vendors } from "@/lib/db/schema";
import { VendorTable } from "@/components/vendors/vendor-table";
import { VendorForm } from "@/components/vendors/vendor-form";
import { Modal } from "@/components/ui/modal";

type Vendor = typeof vendors.$inferSelect;

export function VendorsPageClient({ vendors }: { vendors: Vendor[] }) {
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-8 py-12">
      {/* Header Section */}
      <div className="flex justify-between items-end mb-12">
        <div className="text-left">
          <div className="inline-block px-3 py-1 rounded-full bg-primary-fixed text-primary text-xs font-bold mb-3 tracking-wide uppercase">
            Partnership Network
          </div>
          <h1 className="text-4xl font-extrabold text-on-surface tracking-tight mb-2">
            Vendors Roster
          </h1>
          <p className="text-on-surface-variant max-w-lg leading-relaxed">
            Centralized management for your preferred trade professionals and
            service providers across all property portfolios.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-primary text-on-primary px-8 py-4 rounded-lg font-bold flex items-center gap-2 shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined">add_circle</span>
          Add Vendor
        </button>
      </div>

      {/* Vendor Table */}
      <VendorTable vendors={vendors} />

      {/* Metrics Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1 */}
        <div className="bg-surface-container-lowest p-8 rounded-lg border border-outline-variant/10 flex flex-col justify-between group hover:border-primary/30 transition-all">
          <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 rounded-lg bg-primary-fixed flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined">engineering</span>
            </div>
            <span className="text-xs font-bold text-primary bg-primary-fixed px-2 py-1 rounded-[0.5rem]">
              +{vendors.length} total
            </span>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-on-surface mb-1">
              {vendors.length}
            </div>
            <div className="text-sm font-bold text-on-surface-variant uppercase tracking-widest">
              Total Vendors
            </div>
          </div>
        </div>
        {/* Card 2 */}
        <div className="bg-surface-container-lowest p-8 rounded-lg border border-outline-variant/10 flex flex-col justify-between group hover:border-primary/30 transition-all">
          <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 rounded-lg bg-primary-fixed flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined">verified</span>
            </div>
            <span className="text-xs font-bold text-on-surface-variant bg-primary-fixed px-2 py-1 rounded-[0.5rem]">
              Target 98%
            </span>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-on-surface mb-1">
              {vendors.length > 0
                ? (
                    (vendors.filter((v) => (v.preferenceScore ?? 0) >= 0.5)
                      .length /
                      vendors.length) *
                    100
                  ).toFixed(1)
                : "0.0"}
              %
            </div>
            <div className="text-sm font-bold text-on-surface-variant uppercase tracking-widest">
              Compliance Rate
            </div>
          </div>
        </div>
        {/* Card 3 */}
        <div className="bg-surface-container-lowest p-8 rounded-lg border border-outline-variant/10 flex flex-col justify-between group hover:border-primary/30 transition-all">
          <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined">
                pending_actions
              </span>
            </div>
            <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-[0.5rem]">
              {new Set(vendors.map((v) => v.trade)).size} Trades
            </span>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-on-surface mb-1">
              {new Set(vendors.map((v) => v.trade)).size}
            </div>
            <div className="text-sm font-bold text-on-surface-variant uppercase tracking-widest">
              Trade Categories
            </div>
          </div>
        </div>
      </div>

      {/* Promotion / Action Section */}
      <div className="mt-12 bg-primary rounded-lg p-10 flex items-center justify-between overflow-hidden relative">
        {/* Background decorative element */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/10 skew-x-[-15deg] translate-x-20" />
        <div className="relative z-10 max-w-2xl">
          <h3 className="text-on-primary text-2xl font-extrabold mb-4">
            Optimizing your vendor relationships?
          </h3>
          <p className="text-on-primary/80 text-base leading-relaxed">
            Unlock advanced analytics, automated insurance tracking, and tiered
            performance scoring for your entire network with our Premium Vendor
            Management module.
          </p>
        </div>
        <div className="relative z-10">
          <Link href="/settings" className="bg-surface-container-lowest text-primary px-8 py-4 rounded-lg font-bold shadow-xl hover:bg-surface-container-low transition-colors cursor-pointer inline-block">
            Configure Settings
          </Link>
        </div>
      </div>

      {/* Add Vendor Modal */}
      <Modal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add Vendor"
      >
        <VendorForm onSuccess={() => setShowAddModal(false)} />
      </Modal>
    </div>
  );
}
