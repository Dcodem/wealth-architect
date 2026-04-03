"use client";

import { useTransition, useState, useRef, useEffect } from "react";
import { assignVendorAction } from "@/app/(dashboard)/cases/actions";
import type { Vendor } from "@/lib/db/schema";

export function AssignVendorForm({
  caseId,
  allVendors,
  currentVendorId,
  mode,
}: {
  caseId: string;
  allVendors: Vendor[];
  currentVendorId: string | null;
  mode: "assign" | "edit";
}) {
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isOpen]);

  function handleAssign(vendorId: string) {
    startTransition(async () => {
      await assignVendorAction(caseId, vendorId);
      setIsOpen(false);
    });
  }

  if (mode === "edit") {
    return (
      <div ref={dropdownRef} className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-on-surface-variant hover:text-primary p-2 rounded-lg transition-colors bg-surface-container-lowest shadow-sm"
        >
          <span className="material-symbols-outlined text-xl">edit</span>
        </button>
        {isOpen && (
          <div className="absolute right-0 top-full mt-2 z-20 w-72 bg-surface-container-lowest rounded-lg shadow-xl border border-outline-variant/20 p-2 max-h-64 overflow-y-auto">
            {allVendors.map((v) => (
              <button
                key={v.id}
                onClick={() => handleAssign(v.id)}
                disabled={isPending || v.id === currentVendorId}
                className="w-full text-left px-4 py-3 rounded-lg hover:bg-primary-fixed transition-colors disabled:opacity-50 flex items-center gap-3"
              >
                <div className="w-8 h-8 bg-primary/10 text-primary rounded-md flex items-center justify-center font-bold text-xs">
                  {v.name
                    .split(" ")
                    .map((w) => w[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-bold text-on-surface">{v.name}</p>
                  <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">
                    {v.trade}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // mode === "assign"
  return (
    <div className="relative">
      <div className="relative group">
        <select
          defaultValue=""
          onChange={(e) => {
            if (e.target.value) handleAssign(e.target.value);
          }}
          disabled={isPending}
          className="w-full appearance-none bg-primary-fixed border-2 border-transparent rounded-lg px-5 py-4 text-sm font-bold focus:ring-0 focus:border-primary transition-all disabled:opacity-50"
        >
          <option value="" disabled>
            {isPending ? "Assigning..." : "Select a contractor..."}
          </option>
          {allVendors.map((v) => (
            <option key={v.id} value={v.id}>
              {v.name} ({v.trade})
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
