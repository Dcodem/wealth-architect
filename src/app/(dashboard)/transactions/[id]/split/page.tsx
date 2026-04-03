"use client";

import { use, useState } from "react";
import AppLayout from "@/components/AppLayout";
import PageHeader from "@/components/PageHeader";
import Link from "next/link";
import { getTransactionById, categoryOptions, propertyNames } from "@/lib/transactions";

interface PropertyAllocation {
  property: string;
  value: string;
  category: string;
  note: string;
}

export default function SplitTransactionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const txn = getTransactionById(id);

  // Level 1: Split method
  const [splitMode, setSplitMode] = useState<"percentage" | "dollar">("percentage");

  // Level 2: Personal portion
  const [hasPersonal, setHasPersonal] = useState(false);
  const [personalValue, setPersonalValue] = useState("");
  const [personalNote, setPersonalNote] = useState("");

  // Level 3 & 4: Property allocations
  const [allocations, setAllocations] = useState<PropertyAllocation[]>([
    { property: txn?.property ?? "Main St. Loft", value: "", category: txn?.category ?? "Maintenance", note: "" },
  ]);

  const [saved, setSaved] = useState(false);

  if (!txn) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <span aria-hidden="true" className="material-symbols-outlined text-[48px] text-outline-variant">receipt_long</span>
          <h2 className="text-xl font-bold text-on-surface">Transaction not found</h2>
          <Link href="/transactions" className="mt-4 px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-bold shadow-md shadow-primary/20 hover:opacity-90 transition-all">
            Back to Transactions
          </Link>
        </div>
      </AppLayout>
    );
  }

  const totalAmount = Math.abs(parseFloat(txn.amount.replace(/[^0-9.-]/g, "")));
  const isPercent = splitMode === "percentage";
  const unit = isPercent ? "%" : "$";
  const cap = isPercent ? 100 : totalAmount;

  const personalNum = parseFloat(personalValue) || 0;
  const businessCap = hasPersonal ? cap - personalNum : cap;

  const allocatedBusiness = allocations.reduce((sum, a) => sum + (parseFloat(a.value) || 0), 0);
  const remaining = businessCap - allocatedBusiness;

  const isBalanced = Math.abs(remaining) < (isPercent ? 0.1 : 0.01);
  const personalValid = !hasPersonal || (personalNum > 0 && personalNum < cap);

  const toAmount = (val: number) => isPercent ? (val / 100) * totalAmount : val;

  const personalDollar = toAmount(personalNum);
  const businessDollar = totalAmount - (hasPersonal ? personalDollar : 0);

  const addProperty = () => {
    const used = allocations.map((a) => a.property);
    const available = propertyNames.filter((p) => !used.includes(p));
    setAllocations((prev) => [
      ...prev,
      { property: available[0] ?? propertyNames[0], value: "", category: "Maintenance", note: "" },
    ]);
  };

  const removeProperty = (index: number) => {
    if (allocations.length <= 1) return;
    setAllocations((prev) => prev.filter((_, i) => i !== index));
  };

  const updateAllocation = (index: number, field: keyof PropertyAllocation, value: string) => {
    setAllocations((prev) => prev.map((a, i) => (i === index ? { ...a, [field]: value } : a)));
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  // Auto-fill last allocation when only one remaining
  const handleAutoFill = (index: number) => {
    if (remaining > 0) {
      const current = parseFloat(allocations[index].value) || 0;
      updateAllocation(index, "value", (current + remaining).toFixed(isPercent ? 1 : 2));
    }
  };

  return (
    <AppLayout>
      <PageHeader
        title="Split Transaction"
        subtitle={`${txn.title} — ${txn.amount}`}
        breadcrumb={{ label: txn.title, href: `/transactions/${id}` }}
        actions={
          <div className="flex items-center gap-3">
            <Link
              href={`/transactions/${id}`}
              className="px-4 py-2.5 border border-outline-variant/20 rounded-xl text-sm font-semibold text-on-surface hover:bg-surface-container-low transition-all"
            >
              Cancel
            </Link>
            <button
              onClick={handleSave}
              disabled={!isBalanced || !personalValid}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold shadow-md transition-all ${
                saved
                  ? "bg-emerald-500 text-white shadow-emerald-500/20"
                  : isBalanced && personalValid
                  ? "bg-primary text-white shadow-primary/20 hover:opacity-90"
                  : "bg-outline-variant/30 text-on-surface-variant cursor-not-allowed shadow-none"
              }`}
            >
              <span aria-hidden="true" className="material-symbols-outlined text-[18px]">
                {saved ? "check" : "save"}
              </span>
              {saved ? "Saved!" : "Save Split"}
            </button>
          </div>
        }
      />

      <div className="max-w-4xl space-y-6">
        {/* Original Transaction Summary */}
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 p-6 flex items-center gap-6">
          <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center shrink-0">
            <span aria-hidden="true" className="material-symbols-outlined text-primary text-xl">receipt_long</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-on-surface">{txn.title}</p>
            <p className="text-xs text-on-surface-variant mt-0.5">
              {txn.date} &middot; {txn.property} &middot; {txn.bankAccount}
            </p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-2xl font-extrabold text-on-surface" style={{ fontFamily: "'Manrope', sans-serif" }}>
              {txn.amount}
            </p>
            <p className="text-[11px] text-on-surface-variant uppercase tracking-wider font-bold">Total Amount</p>
          </div>
        </div>

        {/* ─── LEVEL 1: Split Method ─── */}
        <section className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">1</div>
            <h3 className="text-sm font-bold text-on-surface uppercase tracking-wider">Split Method</h3>
          </div>
          <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded-xl w-fit">
            <button
              onClick={() => setSplitMode("percentage")}
              className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                isPercent ? "bg-white shadow-sm text-primary" : "text-on-surface-variant hover:bg-white/50"
              }`}
            >
              Percentage Split
            </button>
            <button
              onClick={() => setSplitMode("dollar")}
              className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                !isPercent ? "bg-white shadow-sm text-primary" : "text-on-surface-variant hover:bg-white/50"
              }`}
            >
              Dollar Split
            </button>
          </div>
          <p className="text-xs text-on-surface-variant mt-3">
            {isPercent
              ? "Allocate by percentage — dollar amounts are calculated automatically."
              : "Allocate by exact dollar amounts against the total."}
          </p>
        </section>

        {/* ─── LEVEL 2: Personal Portion ─── */}
        <section className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">2</div>
              <h3 className="text-sm font-bold text-on-surface uppercase tracking-wider">Personal Portion</h3>
            </div>
            <button
              onClick={() => { setHasPersonal(!hasPersonal); if (hasPersonal) setPersonalValue(""); }}
              className={`relative w-11 h-6 rounded-full transition-colors ${hasPersonal ? "bg-primary" : "bg-outline-variant/40"}`}
            >
              <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${hasPersonal ? "translate-x-[22px]" : "translate-x-0.5"}`} />
            </button>
          </div>

          {hasPersonal ? (
            <div className="space-y-4">
              <p className="text-xs text-on-surface-variant">
                Carve out the non-business portion first. The remainder will be allocated across properties.
              </p>
              <div className="flex items-end gap-4">
                <div className="flex-1 max-w-[200px] space-y-1.5">
                  <label className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wide">
                    Personal {isPercent ? "%" : "$"}
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step={isPercent ? "1" : "0.01"}
                      min="0"
                      max={cap}
                      value={personalValue}
                      onChange={(e) => setPersonalValue(e.target.value)}
                      placeholder="0"
                      className="w-full bg-surface-container-high border-none rounded-lg px-4 py-2.5 text-sm font-bold focus:bg-white focus:ring-1 focus:ring-primary/40 transition-all outline-none pr-10"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-on-surface-variant font-bold">{unit}</span>
                  </div>
                </div>
                <div className="flex-1 space-y-1.5">
                  <label className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wide">Note (optional)</label>
                  <input
                    type="text"
                    value={personalNote}
                    onChange={(e) => setPersonalNote(e.target.value)}
                    placeholder="e.g. Personal use portion"
                    className="w-full bg-surface-container-high border-none rounded-lg px-4 py-2.5 text-sm focus:bg-white focus:ring-1 focus:ring-primary/40 transition-all outline-none"
                  />
                </div>
              </div>
              {personalNum > 0 && (
                <div className="flex items-center gap-6 pt-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-outline-variant/60" />
                    <span className="text-xs text-on-surface-variant">
                      Personal: <strong className="text-on-surface">${personalDollar.toFixed(2)}</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-primary" />
                    <span className="text-xs text-on-surface-variant">
                      Business: <strong className="text-on-surface">${businessDollar.toFixed(2)}</strong>
                    </span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="text-xs text-on-surface-variant">
              100% business — all of <strong>{txn.amount}</strong> will be allocated across properties. Toggle on to carve out a personal portion.
            </p>
          )}
        </section>

        {/* ─── LEVEL 3 & 4: Property Allocation ─── */}
        <section className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">3</div>
              <h3 className="text-sm font-bold text-on-surface uppercase tracking-wider">Property Allocation</h3>
            </div>
            <span className="text-xs text-on-surface-variant font-semibold">
              {isPercent
                ? `${businessCap.toFixed(1)}% to allocate`
                : `$${businessCap.toFixed(2)} to allocate`}
            </span>
          </div>

          <div className="space-y-4">
            {allocations.map((alloc, index) => (
              <div
                key={index}
                className="bg-surface-container-low/40 rounded-xl p-5 space-y-4 relative group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
                    Property {index + 1}
                  </span>
                  {allocations.length > 1 && (
                    <button
                      onClick={() => removeProperty(index)}
                      className="w-7 h-7 flex items-center justify-center rounded-full text-on-surface-variant hover:bg-red-50 hover:text-red-600 transition-all opacity-0 group-hover:opacity-100"
                    >
                      <span aria-hidden="true" className="material-symbols-outlined text-[16px]">close</span>
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wide">Property</label>
                    <select
                      value={alloc.property}
                      onChange={(e) => updateAllocation(index, "property", e.target.value)}
                      className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-lg px-4 py-2.5 text-sm font-bold focus:ring-1 focus:ring-primary/40 transition-all outline-none appearance-none cursor-pointer"
                    >
                      {propertyNames.map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wide">Category</label>
                    <select
                      value={alloc.category}
                      onChange={(e) => updateAllocation(index, "category", e.target.value)}
                      className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-lg px-4 py-2.5 text-sm focus:ring-1 focus:ring-primary/40 transition-all outline-none appearance-none cursor-pointer"
                    >
                      {categoryOptions.map((opt) => (
                        <option key={opt.label} value={opt.label}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wide">
                      Amount ({unit})
                    </label>
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <input
                          type="number"
                          step={isPercent ? "1" : "0.01"}
                          min="0"
                          value={alloc.value}
                          onChange={(e) => updateAllocation(index, "value", e.target.value)}
                          placeholder="0"
                          className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-lg px-4 py-2.5 text-sm font-bold focus:ring-1 focus:ring-primary/40 transition-all outline-none pr-10"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-on-surface-variant font-bold">{unit}</span>
                      </div>
                      {remaining > 0.01 && (
                        <button
                          onClick={() => handleAutoFill(index)}
                          className="px-3 py-2.5 text-xs font-bold text-primary bg-primary/5 rounded-lg hover:bg-primary/10 transition-all whitespace-nowrap"
                        >
                          Fill rest
                        </button>
                      )}
                    </div>
                    {isPercent && alloc.value && (
                      <p className="text-[11px] text-on-surface-variant mt-1">
                        = ${((parseFloat(alloc.value) / 100) * totalAmount * (hasPersonal ? (businessCap / 100) : 1)).toFixed(2)}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wide">Note (optional)</label>
                    <input
                      type="text"
                      value={alloc.note}
                      onChange={(e) => updateAllocation(index, "note", e.target.value)}
                      placeholder="e.g. Lobby repairs"
                      className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-lg px-4 py-2.5 text-sm focus:ring-1 focus:ring-primary/40 transition-all outline-none"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {allocations.length < propertyNames.length && (
            <button
              onClick={addProperty}
              className="w-full mt-4 flex items-center justify-center gap-2 py-3 border-2 border-dashed border-outline-variant/30 rounded-xl text-sm font-bold text-on-surface-variant hover:border-primary/30 hover:text-primary transition-all"
            >
              <span aria-hidden="true" className="material-symbols-outlined text-[18px]">add</span>
              Add Another Property
            </button>
          )}
        </section>

        {/* ─── SUMMARY ─── */}
        <section className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 overflow-hidden">
          <div className="px-6 py-4 border-b border-outline-variant/10 flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">4</div>
            <h3 className="text-sm font-bold text-on-surface uppercase tracking-wider">Allocation Summary</h3>
          </div>

          <div className="p-6">
            {/* Visual bar */}
            <div className="w-full h-3 bg-surface-container-high rounded-full overflow-hidden flex mb-6">
              {hasPersonal && personalNum > 0 && (
                <div
                  className="h-full bg-outline-variant/50 transition-all duration-300"
                  style={{ width: `${(personalNum / cap) * 100}%` }}
                />
              )}
              {allocations.map((alloc, i) => {
                const val = parseFloat(alloc.value) || 0;
                const pct = (val / cap) * 100;
                const colors = ["bg-primary", "bg-teal-500", "bg-amber-500"];
                return (
                  <div
                    key={i}
                    className={`h-full ${colors[i % colors.length]} transition-all duration-300`}
                    style={{ width: `${pct}%` }}
                  />
                );
              })}
            </div>

            {/* Breakdown rows */}
            <div className="space-y-3">
              {hasPersonal && personalNum > 0 && (
                <div className="flex items-center justify-between py-3 px-4 bg-surface-container-low/40 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-outline-variant/50 shrink-0" />
                    <div>
                      <p className="text-sm font-bold text-on-surface">Personal</p>
                      {personalNote && <p className="text-[11px] text-on-surface-variant">{personalNote}</p>}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-extrabold text-on-surface" style={{ fontFamily: "'Manrope', sans-serif" }}>
                      ${personalDollar.toFixed(2)}
                    </p>
                    <p className="text-[11px] text-on-surface-variant">
                      {isPercent ? `${personalNum}%` : `of ${txn.amount}`}
                    </p>
                  </div>
                </div>
              )}

              {allocations.map((alloc, i) => {
                const val = parseFloat(alloc.value) || 0;
                const dollarVal = isPercent
                  ? (val / 100) * totalAmount * (hasPersonal ? (businessCap / 100) : 1)
                  : val;
                const colors = ["bg-primary", "bg-teal-500", "bg-amber-500"];
                return (
                  <div key={i} className="flex items-center justify-between py-3 px-4 bg-surface-container-low/40 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${colors[i % colors.length]} shrink-0`} />
                      <div>
                        <p className="text-sm font-bold text-on-surface">{alloc.property}</p>
                        <p className="text-[11px] text-on-surface-variant">{alloc.category}{alloc.note ? ` — ${alloc.note}` : ""}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-extrabold text-on-surface" style={{ fontFamily: "'Manrope', sans-serif" }}>
                        ${dollarVal.toFixed(2)}
                      </p>
                      <p className="text-[11px] text-on-surface-variant">
                        {isPercent ? `${val}%` : `of ${txn.amount}`}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Balance status */}
          <div className={`px-6 py-4 flex items-center justify-between ${
            isBalanced && personalValid
              ? "bg-emerald-50 border-t border-emerald-200/50"
              : "bg-amber-50 border-t border-amber-200/50"
          }`}>
            <div className="flex items-center gap-3">
              <span aria-hidden="true" className={`material-symbols-outlined ${isBalanced && personalValid ? "text-emerald-600" : "text-amber-600"}`}>
                {isBalanced && personalValid ? "check_circle" : "warning"}
              </span>
              <div>
                <p className={`text-sm font-bold ${isBalanced && personalValid ? "text-emerald-800" : "text-amber-800"}`}>
                  {isBalanced && personalValid
                    ? "Balanced — all amounts allocated"
                    : `${unit === "%" ? "" : "$"}${Math.abs(remaining).toFixed(isPercent ? 1 : 2)}${unit === "%" ? "%" : ""} remaining to allocate`}
                </p>
                <p className={`text-xs mt-0.5 ${isBalanced && personalValid ? "text-emerald-600" : "text-amber-600"}`}>
                  {isBalanced && personalValid
                    ? `${hasPersonal ? "Personal + " : ""}${allocations.length} propert${allocations.length === 1 ? "y" : "ies"} totaling ${txn.amount}`
                    : "Distribute the remaining amount to save"}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className={`text-lg font-extrabold ${isBalanced && personalValid ? "text-emerald-700" : "text-amber-700"}`} style={{ fontFamily: "'Manrope', sans-serif" }}>
                {isPercent
                  ? `${(personalNum + allocatedBusiness).toFixed(1)}%`
                  : `$${((hasPersonal ? personalNum : 0) + allocatedBusiness).toFixed(2)}`}
              </p>
              <p className={`text-[11px] uppercase tracking-wider font-bold ${isBalanced && personalValid ? "text-emerald-600" : "text-amber-600"}`}>
                of {isPercent ? "100%" : txn.amount}
              </p>
            </div>
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
