"use client";

import { useState } from "react";
import type { Case, Vendor, Property } from "@/lib/db/schema";
import { StatusUpdateForm } from "./status-update-form";
import { AssignVendorForm } from "./assign-vendor-form";
import { formatCurrency, formatEnum } from "@/lib/utils";

export function CaseSidebar({
  caseData,
  vendor,
  property,
  allVendors,
}: {
  caseData: Case;
  vendor: Vendor | null;
  property: Property | null;
  allVendors: Vendor[];
}) {
  const spendingAuthorized = caseData.spendingAuthorized ?? 0;
  const [showWorkOrder, setShowWorkOrder] = useState(false);

  const workOrderNumber = `WO-${caseData.id.slice(0, 6).toUpperCase()}-${Date.now().toString(36).toUpperCase().slice(-4)}`;

  return (
    <div className="col-span-12 lg:col-span-4 space-y-10">
      {/* Quick Actions Tile */}
      <div className="bg-surface-container-lowest rounded-2xl p-10 shadow-sm border border-outline-variant/10">
        <h3 className="text-xs font-black text-on-surface-variant uppercase tracking-[0.2em] mb-8">
          Case Controls
        </h3>
        <div className="space-y-8">
          <StatusUpdateForm caseId={caseData.id} currentStatus={caseData.status} />

          <div className="space-y-3">
            <label className="text-xs font-black text-on-surface uppercase tracking-wider px-1">
              Assign Contractor
            </label>
            {vendor ? (
              <div className="flex items-center gap-4 p-5 bg-primary-fixed rounded-lg border border-outline-variant/10 relative">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center font-black text-lg">
                  {vendor.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-grow">
                  <p className="text-sm font-black">{vendor.name}</p>
                  <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">
                    {vendor.trade ? vendor.trade.charAt(0).toUpperCase() + vendor.trade.slice(1) : "General"}{" "}
                    {vendor.preferenceScore ? `\u2022 \u2605 ${vendor.preferenceScore.toFixed(1)}` : ""}
                  </p>
                </div>
                <AssignVendorForm caseId={caseData.id} allVendors={allVendors} currentVendorId={vendor.id} mode="edit" />
              </div>
            ) : (
              <AssignVendorForm caseId={caseData.id} allVendors={allVendors} currentVendorId={null} mode="assign" />
            )}
          </div>

          <button
            onClick={() => setShowWorkOrder(true)}
            className="w-full py-5 border-2 border-outline-variant/20 text-on-surface rounded-lg font-black text-sm flex items-center justify-center gap-3 hover:bg-surface transition-all"
          >
            <span className="material-symbols-outlined">description</span>
            Generate Work Order
          </button>
        </div>
      </div>

      {/* Financial Ledger */}
      <div className="bg-primary-fixed rounded-2xl p-10 shadow-sm border border-outline-variant/10">
        <h3 className="text-xs font-black text-on-surface-variant uppercase tracking-[0.2em] mb-6">
          Estimated Costs
        </h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center text-sm font-medium">
            <span className="text-on-surface-variant">Service Call Fee</span>
            <span className="font-bold">$85.00</span>
          </div>
          <div className="flex justify-between items-center text-sm font-medium">
            <span className="text-on-surface-variant">Labor (Est.)</span>
            <span className="font-bold">$120.00</span>
          </div>
          <div className="flex justify-between items-center text-sm font-medium">
            <span className="text-on-surface-variant">Parts (Est.)</span>
            <span className="font-bold">$0.00</span>
          </div>
          <div className="h-[2px] bg-outline-variant/20 my-4"></div>
          <div className="flex justify-between items-center text-2xl">
            <span className="font-black text-on-surface tracking-tighter">Total Est.</span>
            <span className="font-black text-primary">$205.00</span>
          </div>
        </div>
        <div className="mt-8 p-4 bg-surface-container-lowest/50 rounded-lg border border-primary/10">
          <p className="text-[10px] text-on-surface-variant font-bold leading-relaxed uppercase tracking-wider">
            Pre-approved budget:{" "}
            <span className="text-primary font-black">
              {spendingAuthorized > 0 ? formatCurrency(spendingAuthorized) : "$500.00"}
            </span>
          </p>
          <div className="w-full h-1.5 bg-outline-variant/20 rounded-full mt-2 overflow-hidden">
            <div className="h-full bg-primary rounded-full" style={{ width: "41%" }}></div>
          </div>
        </div>
      </div>

      {/* Work Order Modal */}
      {showWorkOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-on-surface/50" onClick={() => setShowWorkOrder(false)} />
          <div className="relative bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-surface-container-lowest border-b border-outline-variant/20 p-6 flex items-center justify-between z-10">
              <div>
                <h2 className="text-xl font-extrabold text-on-surface">Work Order</h2>
                <p className="text-xs text-on-surface-variant font-bold uppercase tracking-wider mt-1">{workOrderNumber}</p>
              </div>
              <button onClick={() => setShowWorkOrder(false)} className="text-outline hover:text-on-surface transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-8 space-y-8">
              {/* Header Info */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Date Issued</p>
                  <p className="text-sm font-bold text-on-surface">{new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Priority</p>
                  <p className="text-sm font-bold text-on-surface">{formatEnum(caseData.urgency ?? "medium")}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Property</p>
                  <p className="text-sm font-bold text-on-surface">{property?.address ?? "N/A"}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Category</p>
                  <p className="text-sm font-bold text-on-surface">{formatEnum(caseData.category ?? "general")}</p>
                </div>
              </div>

              {/* Description */}
              <div>
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Description</p>
                <div className="bg-surface-container-low p-4 rounded-lg">
                  <p className="text-sm text-on-surface leading-relaxed">{caseData.rawMessage}</p>
                </div>
              </div>

              {/* Contractor */}
              <div>
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Assigned Contractor</p>
                {vendor ? (
                  <div className="bg-surface-container-low p-4 rounded-lg flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center font-bold text-sm">
                      {vendor.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-bold">{vendor.name}</p>
                      <p className="text-xs text-on-surface-variant">{vendor.phone ?? ""} {vendor.email ? `\u2022 ${vendor.email}` : ""}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-on-surface-variant italic">No contractor assigned</p>
                )}
              </div>

              {/* Cost Estimate */}
              <div>
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Estimated Costs</p>
                <div className="bg-surface-container-low p-4 rounded-lg space-y-2">
                  <div className="flex justify-between text-sm"><span>Service Call</span><span className="font-bold">$85.00</span></div>
                  <div className="flex justify-between text-sm"><span>Labor</span><span className="font-bold">$120.00</span></div>
                  <div className="flex justify-between text-sm"><span>Parts</span><span className="font-bold">$0.00</span></div>
                  <div className="border-t border-outline-variant/20 pt-2 flex justify-between text-lg font-black">
                    <span>Total</span><span className="text-primary">$205.00</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="sticky bottom-0 bg-surface-container-lowest border-t border-outline-variant/20 p-6 flex justify-end gap-3">
              <button
                onClick={() => setShowWorkOrder(false)}
                className="px-6 py-3 bg-surface-container-high text-on-surface rounded-lg font-bold text-sm hover:bg-surface-container-highest transition-colors flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-lg">download</span>
                Download PDF
              </button>
              <button
                onClick={() => setShowWorkOrder(false)}
                className="px-6 py-3 bg-primary text-on-primary rounded-lg font-bold text-sm shadow-lg hover:opacity-90 transition-all flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-lg">save</span>
                Save to Case
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
