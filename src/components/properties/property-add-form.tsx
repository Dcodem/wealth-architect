"use client";

import { useActionState } from "react";
import Link from "next/link";
import { createPropertyAction } from "@/app/(dashboard)/properties/actions";

type FormState = { error?: string | null };

export function PropertyAddForm() {
  const [state, formAction, isPending] = useActionState(
    async (_prev: FormState, formData: FormData): Promise<FormState> => {
      const result = await createPropertyAction(formData);
      if ("error" in result) {
        return { error: result.error };
      }
      return {};
    },
    { error: null }
  );

  return (
    <div className="flex-1 overflow-y-auto p-8 lg:p-12">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-2 text-primary font-semibold text-xs uppercase tracking-widest mb-2">
            <span>Properties</span>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <span>New Property</span>
          </div>
          <h1 className="text-4xl font-extrabold text-on-surface tracking-tight mb-4">
            Add New Property
          </h1>
          <p className="text-on-surface-variant max-w-2xl leading-relaxed">
            Register a new property into your portfolio. Provide the address, type, and any access instructions for vendors and maintenance crews.
          </p>
        </div>

        <form action={formAction} className="space-y-12">
          {/* Section 1: Property Details */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:sticky lg:top-24">
              <h2 className="text-xl font-bold text-on-surface mb-1">Property Details</h2>
              <p className="text-sm text-on-surface-variant">Core address and classification information.</p>
            </div>
            <div className="lg:col-span-2 bg-surface-container-lowest rounded-xl p-8 shadow-sm border border-outline-variant/10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">
                    Street Address
                  </label>
                  <input
                    name="address"
                    required
                    className="w-full bg-surface-container-low border-0 border-l-2 border-transparent focus:border-primary focus:ring-0 rounded-lg p-3 text-on-surface transition-all"
                    placeholder="e.g. 123 Main Street, Toronto, ON"
                    type="text"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">
                    Property Type
                  </label>
                  <select
                    name="type"
                    required
                    className="w-full bg-surface-container-low border-0 border-l-2 border-transparent focus:border-primary focus:ring-0 rounded-lg p-3 text-on-surface transition-all"
                  >
                    <option value="residential">Residential</option>
                    <option value="commercial">Commercial</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">
                    Number of Units
                  </label>
                  <input
                    name="unitCount"
                    type="number"
                    min={1}
                    defaultValue={1}
                    className="w-full bg-surface-container-low border-0 border-l-2 border-transparent focus:border-primary focus:ring-0 rounded-lg p-3 text-on-surface transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Access & Instructions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start pt-8 border-t border-outline-variant/10">
            <div className="lg:sticky lg:top-24">
              <h2 className="text-xl font-bold text-on-surface mb-1">Access & Instructions</h2>
              <p className="text-sm text-on-surface-variant">Provide instructions for vendors, maintenance staff, and emergency access.</p>
            </div>
            <div className="lg:col-span-2 bg-surface-container-lowest rounded-xl p-8 shadow-sm border border-outline-variant/10">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">
                    Building Access Instructions
                  </label>
                  <textarea
                    name="accessInstructions"
                    rows={3}
                    className="w-full bg-surface-container-low border-0 border-l-2 border-transparent focus:border-primary focus:ring-0 rounded-lg p-3 text-on-surface transition-all resize-none"
                    placeholder="e.g. Lockbox code 4521, enter through side entrance"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">
                    Parking Instructions
                  </label>
                  <textarea
                    name="parkingInstructions"
                    rows={2}
                    className="w-full bg-surface-container-low border-0 border-l-2 border-transparent focus:border-primary focus:ring-0 rounded-lg p-3 text-on-surface transition-all resize-none"
                    placeholder="e.g. Park in visitor spots at the rear of the building"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">
                    Unit Access Notes
                  </label>
                  <textarea
                    name="unitAccessNotes"
                    rows={2}
                    className="w-full bg-surface-container-low border-0 border-l-2 border-transparent focus:border-primary focus:ring-0 rounded-lg p-3 text-on-surface transition-all resize-none"
                    placeholder="e.g. Master key in office, unit keys labelled by number"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">
                    Special Instructions
                  </label>
                  <textarea
                    name="specialInstructions"
                    rows={2}
                    className="w-full bg-surface-container-low border-0 border-l-2 border-transparent focus:border-primary focus:ring-0 rounded-lg p-3 text-on-surface transition-all resize-none"
                    placeholder="e.g. Alarm system, pet on premises, etc."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Notes */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start pt-8 border-t border-outline-variant/10">
            <div className="lg:sticky lg:top-24">
              <h2 className="text-xl font-bold text-on-surface mb-1">Additional Notes</h2>
              <p className="text-sm text-on-surface-variant">Any other details about this property.</p>
            </div>
            <div className="lg:col-span-2 bg-surface-container-lowest rounded-xl p-8 shadow-sm border border-outline-variant/10">
              <textarea
                name="notes"
                rows={4}
                className="w-full bg-surface-container-low border-0 border-l-2 border-transparent focus:border-primary focus:ring-0 rounded-lg p-3 text-on-surface transition-all resize-none"
                placeholder="General notes about the property..."
              />
            </div>
          </div>

          {/* Error Banner */}
          {state?.error && (
            <div className="bg-error-container text-on-error-container rounded-lg px-4 py-3 text-sm font-medium border border-error-border">
              {state.error}
            </div>
          )}

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-4 pt-8 mt-12 border-t border-outline-variant/20">
            <Link
              href="/properties"
              className="px-8 py-3 bg-surface-container-high text-on-surface font-semibold rounded-lg hover:bg-surface-container-highest transition-colors active:scale-95"
            >
              Cancel
            </Link>
            <button
              disabled={isPending}
              className="px-10 py-3 bg-primary text-on-primary font-bold rounded-lg shadow-xl shadow-primary/10 active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none"
              type="submit"
            >
              {isPending ? "Saving..." : "Add Property"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
