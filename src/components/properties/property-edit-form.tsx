"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Property } from "@/lib/db/schema";

export function PropertyEditForm({ property }: { property: Property }) {
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    address: property.address,
    type: property.type,
    unitCount: property.unitCount ?? 1,
    purchasePrice: property.purchasePrice ?? "",
    currentValue: property.currentValue ?? "",
    monthlyRent: property.monthlyRent ?? "",
    ownershipPercentage: property.ownershipPercentage ?? 100,
    notes: property.notes ?? "",
    accessInstructions: property.accessInstructions ?? "",
    parkingInstructions: property.parkingInstructions ?? "",
    specialInstructions: property.specialInstructions ?? "",
  });

  function handleChange(field: string, value: string | number) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSave() {
    setSaved(true);
    setTimeout(() => {
      router.back();
    }, 1200);
  }

  return (
    <div className="min-h-screen pb-12">
      <section className="pt-8 px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-10">
            <div className="flex items-center gap-2 text-primary font-semibold text-xs uppercase tracking-widest mb-2">
              <span>Properties</span>
              <span className="material-symbols-outlined text-xs">chevron_right</span>
              <span>Edit</span>
            </div>
            <h1 className="text-4xl font-extrabold text-on-surface tracking-tight mb-2">
              Edit Property
            </h1>
            <p className="text-on-surface-variant">{property.address}</p>
          </div>

          {/* Success toast */}
          {saved && (
            <div className="mb-6 bg-success-container border border-success-border text-on-success-container rounded-lg px-4 py-3 flex items-center gap-2 text-sm font-medium animate-in">
              <span className="material-symbols-outlined text-on-success-container">check_circle</span>
              Property saved successfully. Redirecting...
            </div>
          )}

          <div className="space-y-8">
            {/* Property Details */}
            <div className="bg-surface-container-lowest rounded-xl p-8 shadow-sm border border-outline-variant/10">
              <h2 className="text-xl font-bold text-on-surface mb-6">Property Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">Street Address</label>
                  <input
                    value={form.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                    className="w-full bg-surface-container-low border-0 border-l-2 border-transparent focus:border-primary focus:ring-0 rounded-lg p-3 text-on-surface transition-all"
                    type="text"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">Property Type</label>
                  <select
                    value={form.type}
                    onChange={(e) => handleChange("type", e.target.value)}
                    className="w-full bg-surface-container-low border-0 border-l-2 border-transparent focus:border-primary focus:ring-0 rounded-lg p-3 text-on-surface transition-all"
                  >
                    <option value="residential">Residential</option>
                    <option value="commercial">Commercial</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">Number of Units</label>
                  <input
                    value={form.unitCount}
                    onChange={(e) => handleChange("unitCount", parseInt(e.target.value) || 1)}
                    className="w-full bg-surface-container-low border-0 border-l-2 border-transparent focus:border-primary focus:ring-0 rounded-lg p-3 text-on-surface transition-all"
                    type="number"
                    min={1}
                  />
                </div>
              </div>
            </div>

            {/* Financials */}
            <div className="bg-surface-container-lowest rounded-xl p-8 shadow-sm border border-outline-variant/10">
              <div className="flex items-center gap-2 mb-6">
                <span className="material-symbols-outlined text-primary text-lg">account_balance</span>
                <h2 className="text-xl font-bold text-on-surface">Financials</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">Purchase Price</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">$</span>
                    <input
                      value={form.purchasePrice}
                      onChange={(e) => handleChange("purchasePrice", parseInt(e.target.value) || "")}
                      className="w-full bg-surface-container-low border-0 border-l-2 border-transparent focus:border-primary focus:ring-0 rounded-lg p-3 pl-7 text-on-surface transition-all"
                      type="number"
                      placeholder="0"
                      min={0}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">Current Value</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">$</span>
                    <input
                      value={form.currentValue}
                      onChange={(e) => handleChange("currentValue", parseInt(e.target.value) || "")}
                      className="w-full bg-surface-container-low border-0 border-l-2 border-transparent focus:border-primary focus:ring-0 rounded-lg p-3 pl-7 text-on-surface transition-all"
                      type="number"
                      placeholder="0"
                      min={0}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">Monthly Rent</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">$</span>
                    <input
                      value={form.monthlyRent}
                      onChange={(e) => handleChange("monthlyRent", parseInt(e.target.value) || "")}
                      className="w-full bg-surface-container-low border-0 border-l-2 border-transparent focus:border-primary focus:ring-0 rounded-lg p-3 pl-7 text-on-surface transition-all"
                      type="number"
                      placeholder="0"
                      min={0}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">Ownership %</label>
                  <div className="relative">
                    <input
                      value={form.ownershipPercentage}
                      onChange={(e) => handleChange("ownershipPercentage", parseFloat(e.target.value) || 0)}
                      className="w-full bg-surface-container-low border-0 border-l-2 border-transparent focus:border-primary focus:ring-0 rounded-lg p-3 pr-8 text-on-surface transition-all"
                      type="number"
                      min={0}
                      max={100}
                      step={0.1}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Access & Instructions */}
            <div className="bg-surface-container-lowest rounded-xl p-8 shadow-sm border border-outline-variant/10">
              <h2 className="text-xl font-bold text-on-surface mb-6">Access & Instructions</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">Building Access Instructions</label>
                  <textarea
                    value={form.accessInstructions}
                    onChange={(e) => handleChange("accessInstructions", e.target.value)}
                    rows={3}
                    className="w-full bg-surface-container-low border-0 border-l-2 border-transparent focus:border-primary focus:ring-0 rounded-lg p-3 text-on-surface transition-all resize-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">Parking Instructions</label>
                  <textarea
                    value={form.parkingInstructions}
                    onChange={(e) => handleChange("parkingInstructions", e.target.value)}
                    rows={2}
                    className="w-full bg-surface-container-low border-0 border-l-2 border-transparent focus:border-primary focus:ring-0 rounded-lg p-3 text-on-surface transition-all resize-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">Special Instructions</label>
                  <textarea
                    value={form.specialInstructions}
                    onChange={(e) => handleChange("specialInstructions", e.target.value)}
                    rows={2}
                    className="w-full bg-surface-container-low border-0 border-l-2 border-transparent focus:border-primary focus:ring-0 rounded-lg p-3 text-on-surface transition-all resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="bg-surface-container-lowest rounded-xl p-8 shadow-sm border border-outline-variant/10">
              <h2 className="text-xl font-bold text-on-surface mb-6">Additional Notes</h2>
              <textarea
                value={form.notes}
                onChange={(e) => handleChange("notes", e.target.value)}
                rows={4}
                className="w-full bg-surface-container-low border-0 border-l-2 border-transparent focus:border-primary focus:ring-0 rounded-lg p-3 text-on-surface transition-all resize-none"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-4 pt-4">
              <button
                onClick={() => router.back()}
                className="px-8 py-3 bg-surface-container-high text-on-surface font-semibold rounded-lg hover:bg-surface-container-highest transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-10 py-3 bg-primary text-on-primary font-bold rounded-lg shadow-xl shadow-primary/10 active:scale-95 transition-all"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
