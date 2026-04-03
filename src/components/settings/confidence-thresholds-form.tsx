"use client";

import { useActionState, useState } from "react";
import { updateConfidenceThresholdsAction } from "@/app/(dashboard)/settings/actions";

type ActionState = { success: boolean; error?: string } | null;

export function ConfidenceThresholdsForm({
  defaults,
}: {
  defaults: { high: number; medium: number };
}) {
  const [high, setHigh] = useState(defaults.high);
  const [medium, setMedium] = useState(defaults.medium);

  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
    async (_prev, formData) => {
      return await updateConfidenceThresholdsAction(formData);
    },
    null,
  );

  return (
    <section className="bg-surface-container-lowest border border-outline-variant/20 shadow-sm">
      <form action={formAction}>
        <div className="p-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="material-symbols-outlined text-primary text-2xl">psychology</span>
            <h2 className="text-xl font-bold text-on-surface tracking-tight">Confidence Thresholds</h2>
          </div>
          <p className="text-sm text-on-surface-variant mb-10 leading-relaxed">Set the confidence score requirements for AI-driven case resolutions. Higher scores increase accuracy but may require more manual intervention.</p>
          <div className="space-y-10">
            <div>
              <div className="flex justify-between items-center mb-6">
                <label className="text-sm font-bold text-on-surface uppercase tracking-widest">High Confidence</label>
                <span className="px-4 py-1.5 bg-primary-fixed text-primary border border-primary/20 rounded text-sm font-bold">{high.toFixed(2)}</span>
              </div>
              <input
                className="w-full h-1.5 bg-surface-container-low rounded-full appearance-none cursor-pointer accent-primary"
                max="1"
                min="0"
                step="0.05"
                type="range"
                name="high"
                value={high}
                onChange={(e) => setHigh(Number(e.target.value))}
              />
              <div className="flex justify-between mt-3 text-[10px] text-outline font-bold uppercase tracking-widest">
                <span>Conservative</span>
                <span>Aggressive</span>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-6">
                <label className="text-sm font-bold text-on-surface uppercase tracking-widest">Medium Confidence</label>
                <span className="px-4 py-1.5 bg-surface-container-low text-on-surface border border-outline-variant/10 rounded text-sm font-bold">{medium.toFixed(2)}</span>
              </div>
              <input
                className="w-full h-1.5 bg-surface-container-low rounded-full appearance-none cursor-pointer accent-primary"
                max="1"
                min="0"
                step="0.05"
                type="range"
                name="medium"
                value={medium}
                onChange={(e) => setMedium(Number(e.target.value))}
              />
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
