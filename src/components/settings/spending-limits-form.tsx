"use client";

import { useActionState, useState } from "react";
import { updateSpendingLimitsAction } from "@/app/(dashboard)/settings/actions";

type ActionState = { success: boolean; error?: string } | null;

export function SpendingLimitsForm({
  spendingLimit,
  emergencySpendingLimit,
}: {
  spendingLimit: number;
  emergencySpendingLimit: number;
}) {
  const [defaultLimit, setDefaultLimit] = useState(
    (spendingLimit / 100).toFixed(2),
  );
  const [emergencyLimit, setEmergencyLimit] = useState(
    (emergencySpendingLimit / 100).toFixed(2),
  );

  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
    async (_prev, formData) => {
      // Convert dollars to cents before sending
      const dollars = Number(formData.get("spendingLimitDisplay"));
      const emergencyDollars = Number(formData.get("emergencySpendingLimitDisplay"));
      const fd = new FormData();
      fd.set("spendingLimit", String(Math.round(dollars * 100)));
      fd.set("emergencySpendingLimit", String(Math.round(emergencyDollars * 100)));
      return await updateSpendingLimitsAction(fd);
    },
    null,
  );

  return (
    <section className="bg-surface-container-lowest border border-outline-variant/20 shadow-sm">
      <form action={formAction}>
        <div className="p-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="material-symbols-outlined text-primary text-2xl">payments</span>
            <h2 className="text-xl font-bold text-on-surface tracking-tight">Spending Limits</h2>
          </div>
          <p className="text-sm text-on-surface-variant mb-10 leading-relaxed">Establish maximum budgets for autonomous agent spending on vendor services.</p>
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-sm font-bold text-on-surface uppercase tracking-widest">Default Limit</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-outline font-bold">$</span>
                <input
                  className="w-full pl-10 pr-4 py-3 bg-surface-container-low/50 border border-outline-variant/20 rounded focus:ring-1 focus:ring-primary focus:border-primary font-bold text-on-surface"
                  type="text"
                  name="spendingLimitDisplay"
                  value={defaultLimit}
                  onChange={(e) => setDefaultLimit(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-sm font-bold text-on-surface uppercase tracking-widest">Emergency Limit</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-outline font-bold">$</span>
                <input
                  className="w-full pl-10 pr-4 py-3 bg-surface-container-low/50 border border-outline-variant/20 rounded focus:ring-1 focus:ring-primary focus:border-primary font-bold text-on-surface"
                  type="text"
                  name="emergencySpendingLimitDisplay"
                  value={emergencyLimit}
                  onChange={(e) => setEmergencyLimit(e.target.value)}
                />
              </div>
            </div>
          </div>
          {state?.error && (
            <p className="mt-4 text-sm text-red-600 font-medium">{state.error}</p>
          )}
          {state?.success && (
            <p className="mt-4 text-sm text-emerald-600 font-medium">Saved successfully.</p>
          )}
        </div>
        <div className="bg-surface-container-low border-t border-outline-variant/20 px-8 py-4 flex justify-end">
          <button
            type="submit"
            disabled={isPending}
            className="bg-primary hover:opacity-90 text-on-primary px-8 py-2 rounded font-bold text-sm transition-all shadow-sm active:scale-[0.98] disabled:opacity-50"
          >
            {isPending ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </section>
  );
}
