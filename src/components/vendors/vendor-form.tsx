"use client";

import { useActionState } from "react";
import { VENDOR_TRADES } from "@/lib/constants";
import { formatEnum } from "@/lib/utils";
import { createVendorAction } from "@/app/(dashboard)/vendors/actions";

interface VendorFormProps {
  onSuccess: () => void;
}

export function VendorForm({ onSuccess }: VendorFormProps) {
  const [state, formAction, isPending] = useActionState(
    async (_prev: unknown, formData: FormData) => {
      const result = await createVendorAction(formData);
      if (result.success) {
        onSuccess();
        return { error: null };
      }
      return result;
    },
    { error: null } as { error: Record<string, string[]> | null }
  );

  const errors = state?.error;

  return (
    <form action={formAction} className="space-y-4">
      {/* Name */}
      <div>
        <label
          htmlFor="vendor-name"
          className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1"
        >
          Vendor Name
        </label>
        <input
          id="vendor-name"
          name="name"
          type="text"
          required
          className="w-full bg-surface-container-lowest border-0 ring-1 ring-outline-variant/30 rounded-lg px-4 py-2.5 text-sm text-on-surface focus:ring-2 focus:ring-primary transition-all"
          placeholder="e.g. Swift Plumbing Inc."
        />
        {errors?.name && (
          <p className="text-xs text-error mt-1">{errors.name[0]}</p>
        )}
      </div>

      {/* Trade */}
      <div>
        <label
          htmlFor="vendor-trade"
          className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1"
        >
          Trade
        </label>
        <select
          id="vendor-trade"
          name="trade"
          required
          className="w-full bg-surface-container-lowest border-0 ring-1 ring-outline-variant/30 rounded-lg px-4 py-2.5 text-sm text-on-surface focus:ring-2 focus:ring-primary transition-all"
        >
          <option value="">Select trade...</option>
          {VENDOR_TRADES.map((trade) => (
            <option key={trade} value={trade}>
              {formatEnum(trade)}
            </option>
          ))}
        </select>
        {errors?.trade && (
          <p className="text-xs text-error mt-1">{errors.trade[0]}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label
          htmlFor="vendor-email"
          className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1"
        >
          Email
        </label>
        <input
          id="vendor-email"
          name="email"
          type="email"
          className="w-full bg-surface-container-lowest border-0 ring-1 ring-outline-variant/30 rounded-lg px-4 py-2.5 text-sm text-on-surface focus:ring-2 focus:ring-primary transition-all"
          placeholder="e.g. contact@vendor.com"
        />
        {errors?.email && (
          <p className="text-xs text-error mt-1">{errors.email[0]}</p>
        )}
      </div>

      {/* Phone */}
      <div>
        <label
          htmlFor="vendor-phone"
          className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1"
        >
          Phone
        </label>
        <input
          id="vendor-phone"
          name="phone"
          type="tel"
          className="w-full bg-surface-container-lowest border-0 ring-1 ring-outline-variant/30 rounded-lg px-4 py-2.5 text-sm text-on-surface focus:ring-2 focus:ring-primary transition-all"
          placeholder="e.g. +1 (555) 012-9844"
        />
      </div>

      {/* Rate Notes */}
      <div>
        <label
          htmlFor="vendor-rate"
          className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1"
        >
          Rate Notes
        </label>
        <input
          id="vendor-rate"
          name="rateNotes"
          type="text"
          className="w-full bg-surface-container-lowest border-0 ring-1 ring-outline-variant/30 rounded-lg px-4 py-2.5 text-sm text-on-surface focus:ring-2 focus:ring-primary transition-all"
          placeholder="e.g. $85/hr standard commercial"
        />
      </div>

      {/* Availability Notes */}
      <div>
        <label
          htmlFor="vendor-availability"
          className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1"
        >
          Availability Notes
        </label>
        <input
          id="vendor-availability"
          name="availabilityNotes"
          type="text"
          className="w-full bg-surface-container-lowest border-0 ring-1 ring-outline-variant/30 rounded-lg px-4 py-2.5 text-sm text-on-surface focus:ring-2 focus:ring-primary transition-all"
          placeholder="e.g. Mon-Fri 8am-6pm"
        />
      </div>

      {/* Preference Score */}
      <div>
        <label
          htmlFor="vendor-preference"
          className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1"
        >
          Preference Score (0-1)
        </label>
        <input
          id="vendor-preference"
          name="preferenceScore"
          type="number"
          min="0"
          max="1"
          step="0.1"
          defaultValue="0.5"
          className="w-full bg-surface-container-lowest border-0 ring-1 ring-outline-variant/30 rounded-lg px-4 py-2.5 text-sm text-on-surface focus:ring-2 focus:ring-primary transition-all"
        />
        {errors?.preferenceScore && (
          <p className="text-xs text-error mt-1">
            {errors.preferenceScore[0]}
          </p>
        )}
      </div>

      {/* Submit */}
      <div className="flex justify-end gap-3 pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="bg-primary text-on-primary px-6 py-3 rounded-lg font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
        >
          {isPending ? "Saving..." : "Save Vendor"}
        </button>
      </div>
    </form>
  );
}
