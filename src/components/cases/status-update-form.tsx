"use client";

import { useTransition } from "react";
import { updateCaseStatusAction } from "@/app/(dashboard)/cases/actions";

const STATUS_OPTIONS = [
  { value: "open", label: "Open" },
  { value: "in_progress", label: "In Progress" },
  { value: "waiting_on_vendor", label: "Awaiting Vendor" },
  { value: "waiting_on_tenant", label: "Awaiting Tenant" },
  { value: "resolved", label: "Resolved" },
  { value: "closed", label: "Closed" },
];

export function StatusUpdateForm({
  caseId,
  currentStatus,
}: {
  caseId: string;
  currentStatus: string;
}) {
  const [isPending, startTransition] = useTransition();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newStatus = e.target.value;
    if (newStatus === currentStatus) return;

    startTransition(async () => {
      await updateCaseStatusAction(caseId, newStatus);
    });
  }

  return (
    <div className="space-y-3">
      <label className="text-xs font-black text-on-surface uppercase tracking-wider px-1">
        Adjust Status
      </label>
      <div className="relative group">
        <select
          value={currentStatus}
          onChange={handleChange}
          disabled={isPending}
          className="w-full appearance-none bg-primary-fixed border-2 border-transparent rounded-lg px-5 py-4 text-sm font-bold focus:ring-0 focus:border-primary transition-all disabled:opacity-50"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <span className="material-symbols-outlined absolute right-5 top-4 pointer-events-none text-on-surface-variant opacity-50">
          expand_more
        </span>
      </div>
    </div>
  );
}
