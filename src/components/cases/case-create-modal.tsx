"use client";

import { useState } from "react";
import type { Property, Vendor } from "@/lib/db/schema";

interface CaseCreateModalProps {
  properties: Property[];
  vendors: Vendor[];
  onClose: () => void;
}

export function CaseCreateModal({ properties, vendors, onClose }: CaseCreateModalProps) {
  const [urgency, setUrgency] = useState("medium");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => onClose(), 1500);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[5vh] p-4 overflow-y-auto">
      <div className="absolute inset-0 bg-on-surface/50" onClick={onClose} />
      <div className="relative bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-2xl p-8 mb-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-on-surface">Log New Case</h2>
            <p className="text-sm text-on-surface-variant mt-1">Record a new maintenance request</p>
          </div>
          <button onClick={onClose} className="text-outline hover:text-on-surface transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {submitted ? (
          <div className="py-12 text-center">
            <span className="material-symbols-outlined text-4xl text-primary mb-3 block" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            <p className="text-lg font-bold text-on-surface">Case Created</p>
            <p className="text-sm text-on-surface-variant mt-1">Your maintenance case has been logged successfully.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-on-surface">Title / Subject</label>
              <input
                name="rawMessage"
                required
                className="w-full px-4 py-3 bg-primary-fixed border-none rounded-xl focus:ring-2 focus:ring-primary transition-all"
                placeholder="e.g. Water leaking from kitchen ceiling"
                type="text"
              />
            </div>

            {/* Category + Priority row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-on-surface">Category</label>
                <select name="category" className="w-full px-4 py-3 bg-primary-fixed border-none rounded-xl focus:ring-2 focus:ring-primary appearance-none">
                  <option value="">Select Category</option>
                  <option value="maintenance">Plumbing</option>
                  <option value="noise_complaint">Electrical</option>
                  <option value="emergency">HVAC</option>
                  <option value="general">General</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-on-surface">Priority</label>
                <div className="flex gap-1.5">
                  {(["low", "medium", "high", "critical"] as const).map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setUrgency(level)}
                      className={`flex-1 py-2 px-2 rounded-full text-[11px] font-bold border-2 transition-all ${
                        urgency === level
                          ? level === "critical"
                            ? "border-error bg-error text-white"
                            : "border-primary bg-primary text-on-primary"
                          : level === "critical"
                            ? "border-error/30 text-error"
                            : "border-outline-variant/20 hover:border-primary/40"
                      }`}
                    >
                      {level === "critical" ? "Urgent" : level.charAt(0).toUpperCase() + level.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-on-surface">Description</label>
              <textarea
                name="description"
                className="w-full px-4 py-3 bg-primary-fixed border-none rounded-xl focus:ring-2 focus:ring-primary transition-all resize-none"
                placeholder="Describe the issue in detail..."
                rows={3}
              />
            </div>

            {/* Property + Unit row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-on-surface">Property</label>
                <select name="propertyId" className="w-full px-4 py-3 bg-primary-fixed border-none rounded-xl focus:ring-2 focus:ring-primary appearance-none">
                  <option value="">Select Property</option>
                  {properties.map((p) => (
                    <option key={p.id} value={p.id}>{p.address}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-on-surface">Unit Number</label>
                <input
                  name="unitNumber"
                  className="w-full px-4 py-3 bg-primary-fixed border-none rounded-xl focus:ring-2 focus:ring-primary transition-all"
                  placeholder="e.g. 402B"
                  type="text"
                />
              </div>
            </div>

            {/* Vendor */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-on-surface">Assign Vendor <span className="text-on-surface-variant font-normal">(optional)</span></label>
              <select name="vendorId" className="w-full px-4 py-3 bg-primary-fixed border-none rounded-xl focus:ring-2 focus:ring-primary appearance-none">
                <option value="">Auto-assign based on category</option>
                {vendors.map((v) => (
                  <option key={v.id} value={v.id}>{v.name}</option>
                ))}
              </select>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-outline-variant/20">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-lg font-bold text-on-surface-variant hover:bg-surface-container-high transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-8 py-2.5 bg-primary text-on-primary rounded-lg font-bold shadow-md hover:opacity-90 transition-all flex items-center gap-2 text-sm"
              >
                <span className="material-symbols-outlined text-sm">save</span>
                Submit Case
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
