"use client";

import AppLayout from "@/components/AppLayout";
import PageHeader from "@/components/PageHeader";
import { useState } from "react";
import { pairs, type TxnEntry } from "@/lib/data/duplicate-pairs";

type Resolution = "merged" | "removed-duplicate" | "not-duplicate" | "reverted";

interface LogEntry {
  id: number;
  pairIndex: number;
  resolution: Resolution;
  label: string;
  vendor: string;
  timestamp: string;
}

const resolutionConfig: Record<Resolution, { label: string; icon: string; color: string; bgColor: string; description: string }> = {
  merged: {
    label: "Merged",
    icon: "merge",
    color: "text-primary",
    bgColor: "bg-primary/10",
    description: "Combined into one transaction. Original archived for audit.",
  },
  "removed-duplicate": {
    label: "Duplicate Removed",
    icon: "delete_sweep",
    color: "text-red-600",
    bgColor: "bg-red-50",
    description: "Duplicate entry removed. Original transaction kept.",
  },
  "not-duplicate": {
    label: "Not a Duplicate",
    icon: "done_all",
    color: "text-on-success-container",
    bgColor: "bg-success-container",
    description: "Both transactions are legitimate. No changes made.",
  },
  reverted: {
    label: "Reverted",
    icon: "undo",
    color: "text-on-surface-variant",
    bgColor: "bg-surface-container-high",
    description: "Action was undone. Pair returned to unresolved.",
  },
};

const badgeStyles = {
  high: "bg-green-50 text-green-700",
  medium: "bg-orange-50 text-orange-700",
  low: "bg-surface-container-high text-on-surface-variant",
};

const confidenceLabels = { high: "High", medium: "Medium", low: "Low" };

function getNow() {
  return new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

let logIdCounter = 0;
const PER_PAGE = 2;

export default function DuplicatesPage() {
  const [resolutions, setResolutions] = useState<Record<number, Resolution>>({});
  const [log, setLog] = useState<LogEntry[]>([]);
  const [selectedTxn, setSelectedTxn] = useState<TxnEntry | null>(null);
  const [page, setPage] = useState(1);

  // Only show unresolved pairs
  const visiblePairs = pairs.map((p, i) => ({ pair: p, i })).filter(({ i }) => !resolutions[i]);
  const unresolvedCount = visiblePairs.length;

  const totalPages = Math.max(1, Math.ceil(visiblePairs.length / PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const pageItems = visiblePairs.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);

  const addLogEntry = (pairIndex: number, resolution: Resolution) => {
    setLog((prev) => [
      { id: ++logIdCounter, pairIndex, resolution, label: pairs[pairIndex].label, vendor: pairs[pairIndex].a.vendor, timestamp: getNow() },
      ...prev,
    ]);
  };

  const resolve = (index: number, resolution: Exclude<Resolution, "reverted">) => {
    setResolutions((prev) => ({ ...prev, [index]: resolution }));
    addLogEntry(index, resolution);
  };

  const undoResolve = (index: number) => {
    setResolutions((prev) => { const n = { ...prev }; delete n[index]; return n; });
    addLogEntry(index, "reverted");
  };

  const handleAutoMergeHigh = () => {
    pairs.forEach((p, i) => {
      if (p.level === "high" && !resolutions[i]) {
        resolve(i, "merged");
      }
    });
  };

  // Find latest non-reverted entry per pair for Revert button
  const latestPerPair: Record<number, number> = {};
  for (const entry of log) {
    if (entry.resolution !== "reverted" && !(entry.pairIndex in latestPerPair)) {
      latestPerPair[entry.pairIndex] = entry.id;
    }
  }

  return (
    <AppLayout>
      <PageHeader
        title="Potential Duplicates"
        subtitle={`${unresolvedCount} pair${unresolvedCount !== 1 ? "s" : ""} awaiting review`}
      />

      <div className="flex gap-6 items-start">
        {/* LEFT COLUMN: Duplicate Pairs */}
        <section className="flex-1 min-w-0 flex flex-col gap-8">
          {visiblePairs.length === 0 ? (
            <div className="bg-surface-container-lowest rounded-xl p-12 card-shadow text-center border border-outline-variant/10">
              <span aria-hidden="true" className="material-symbols-outlined text-[48px] text-success block mb-3">task_alt</span>
              <h3 className="text-lg font-bold text-on-surface mb-1">All pairs reviewed</h3>
              <p className="text-sm text-on-surface-variant">Every duplicate pair has been resolved. Check the resolution log for your decisions.</p>
            </div>
          ) : (
            pageItems.map(({ pair, i }) => {
              const vendorMatch = pair.a.vendor === pair.b.vendor;
              const amountMatch = pair.a.amount === pair.b.amount;
              const dateMatch = pair.a.date === pair.b.date;

              return (
                <div key={i} className="bg-surface-container-lowest rounded-xl card-shadow border border-outline-variant/20">
                  {/* Header */}
                  <div className="px-6 py-4 flex justify-between items-center border-b border-outline-variant/10">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-on-surface-variant tracking-wider uppercase">{pair.label}</span>
                      <span className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${badgeStyles[pair.level]}`}>
                        {pair.match}% &middot; {confidenceLabels[pair.level]}
                      </span>
                    </div>
                  </div>

                  {/* AI Reason */}
                  <div className="px-6 py-3 bg-surface-container-low/30 flex items-start gap-2">
                    <span aria-hidden="true" className="material-symbols-outlined text-[16px] text-primary mt-0.5">auto_awesome</span>
                    <p className="text-xs text-on-surface-variant leading-relaxed">{pair.reason}</p>
                  </div>

                  {/* Side-by-side cards */}
                  <div className="px-6 py-5">
                    <div className="grid grid-cols-2 gap-4">
                      {[pair.a, pair.b].map((t, j) => (
                        <button
                          key={j}
                          onClick={() => setSelectedTxn(t)}
                          className={`p-4 rounded-lg space-y-3 text-left transition-all ${
                            selectedTxn?.id === t.id
                              ? "bg-primary/5 ring-2 ring-primary/30"
                              : "bg-surface-container-low/40 hover:bg-surface-container-low hover:ring-1 hover:ring-outline-variant"
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <span className="text-[11px] font-bold text-on-surface-variant">{t.id}</span>
                            <span aria-hidden="true" className="material-symbols-outlined text-outline-variant text-[20px]">{t.icon}</span>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-0.5">Vendor</p>
                            <p className={`text-sm font-bold text-on-surface ${vendorMatch ? "bg-yellow-100/70 px-1 -mx-1 rounded" : ""}`}>{t.vendor}</p>
                          </div>
                          <div className="flex justify-between">
                            <div>
                              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-0.5">Date</p>
                              <p className={`text-sm font-bold text-on-surface ${dateMatch ? "bg-yellow-100/70 px-1 -mx-1 rounded" : ""}`}>{t.date}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-0.5">Amount</p>
                              <p className={`text-sm font-extrabold text-on-surface ${amountMatch ? "bg-yellow-100/70 px-1 -mx-1 rounded" : ""}`} style={{ fontFamily: "'Manrope', sans-serif" }}>{t.amount}</p>
                            </div>
                          </div>
                          <div className="flex justify-between">
                            <div>
                              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-0.5">Property</p>
                              <p className="text-xs font-bold text-on-surface">{t.property}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-0.5">Category</p>
                              <p className="text-xs font-bold text-on-surface">{t.category}</p>
                            </div>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-0.5">Account</p>
                            <p className="text-xs text-on-surface-variant">{t.bankAccount}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="px-6 py-4 border-t border-outline-variant/10">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => resolve(i, "not-duplicate")}
                        className="px-5 py-2.5 rounded-lg text-sm font-bold text-on-surface border border-outline-variant hover:bg-surface-container-low transition-colors flex items-center gap-2"
                      >
                        <span aria-hidden="true" className="material-symbols-outlined text-[16px]">done_all</span>
                        Not a Duplicate
                      </button>
                      <button
                        onClick={() => resolve(i, "merged")}
                        className="flex-1 px-5 py-2.5 rounded-lg text-sm font-bold text-white bg-primary shadow-sm hover:opacity-90 transition-all flex items-center justify-center gap-2"
                      >
                        <span aria-hidden="true" className="material-symbols-outlined text-[16px]">merge</span>
                        Merge Into One
                      </button>
                      <button
                        onClick={() => resolve(i, "removed-duplicate")}
                        className="px-5 py-2.5 rounded-lg text-sm font-bold text-red-600 border border-red-200/50 hover:bg-red-50 transition-colors flex items-center gap-2"
                      >
                        <span aria-hidden="true" className="material-symbols-outlined text-[16px]">delete_sweep</span>
                        Remove Duplicate
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-1 pt-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={safePage === 1}
                className="w-9 h-9 flex items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container-low disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <span aria-hidden="true" className="material-symbols-outlined text-[18px]">chevron_left</span>
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-bold transition-all ${
                    p === safePage
                      ? "bg-primary text-white shadow-md shadow-primary/20"
                      : "text-on-surface-variant hover:bg-surface-container-low"
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={safePage === totalPages}
                className="w-9 h-9 flex items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container-low disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <span aria-hidden="true" className="material-symbols-outlined text-[18px]">chevron_right</span>
              </button>
            </div>
          )}

          {/* Resolution Log */}
          <div className="bg-surface-container-lowest rounded-xl card-shadow border border-outline-variant/10">
            <div className="px-6 py-4 border-b border-outline-variant/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span aria-hidden="true" className="material-symbols-outlined text-on-surface-variant text-[20px]">history</span>
                <h3 className="text-sm font-bold text-on-surface">Resolution Log</h3>
                {log.length > 0 && (
                  <span className="px-2 py-0.5 bg-surface-container-high text-on-surface-variant text-[11px] font-bold rounded-full">{log.length}</span>
                )}
              </div>
              {log.length > 0 && (
                <span className="text-[11px] text-on-surface-variant">
                  {Object.keys(resolutions).length} of {pairs.length} resolved
                </span>
              )}
            </div>
            <div className="divide-y divide-outline-variant/5 max-h-[480px] overflow-y-auto">
              {log.length === 0 ? (
                <div className="px-6 py-10 text-center">
                  <span aria-hidden="true" className="material-symbols-outlined text-[32px] text-outline-variant/40 block mb-2">pending_actions</span>
                  <p className="text-sm text-on-surface-variant">No resolutions yet. Review the pairs above to get started.</p>
                </div>
              ) : (
                log.map((entry) => {
                  const config = resolutionConfig[entry.resolution];
                  const isLatest = latestPerPair[entry.pairIndex] === entry.id;
                  const canRevert = isLatest && entry.resolution !== "reverted";
                  return (
                    <div key={entry.id} className={`px-6 py-3.5 flex items-center gap-4 group ${entry.resolution === "reverted" ? "opacity-50" : ""}`}>
                      <div className={`w-8 h-8 rounded-lg ${config.bgColor} flex items-center justify-center shrink-0`}>
                        <span aria-hidden="true" className={`material-symbols-outlined text-[16px] ${config.color}`}>{config.icon}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-on-surface">
                          <span className="font-bold">{entry.label}</span>
                          {" — "}
                          <span className={`font-bold ${config.color}`}>{config.label}</span>
                        </p>
                        <p className="text-[11px] text-on-surface-variant truncate">{entry.vendor}</p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-[11px] text-on-surface-variant">{entry.timestamp}</span>
                        {canRevert && (
                          <button
                            onClick={() => undoResolve(entry.pairIndex)}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold text-on-surface-variant hover:text-red-600 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
                          >
                            <span aria-hidden="true" className="material-symbols-outlined text-[14px]">undo</span>
                            Revert
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </section>

        {/* RIGHT COLUMN: Summary */}
        <aside className="w-[380px] sticky top-24 shrink-0 space-y-6">
          <div className="bg-surface-container-lowest rounded-xl p-6 card-shadow border border-outline-variant/10">
            <h2 className="text-base font-bold text-on-surface mb-5">Detection Summary</h2>

            <div className="space-y-4 mb-6">
              {(["high", "medium", "low"] as const).map((level) => {
                const count = pairs.filter((p) => p.level === level).length;
                const resolvedCount = pairs.filter((p, i) => p.level === level && resolutions[i]).length;
                const dotColor = level === "high" ? "bg-green-500" : level === "medium" ? "bg-orange-400" : "bg-outline-variant";
                return (
                  <div key={level} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${dotColor}`} />
                      <span className="text-sm font-medium text-on-surface">{confidenceLabels[level]} confidence</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-on-surface">{count}</span>
                      {resolvedCount > 0 && (
                        <span className="text-[11px] text-on-success-container font-bold">({resolvedCount} done)</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Progress */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wide">Progress</span>
                <span className="text-xs font-bold text-on-surface">{Object.keys(resolutions).length}/{pairs.length}</span>
              </div>
              <div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width: `${(Object.keys(resolutions).length / pairs.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Auto-merge button */}
            {pairs.some((p, i) => p.level === "high" && !resolutions[i]) && (
              <button
                onClick={handleAutoMergeHigh}
                className="w-full py-3.5 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-sm"
              >
                <span aria-hidden="true" className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>auto_fix_high</span>
                Auto-Merge High Confidence
              </button>
            )}

            {Object.keys(resolutions).length === pairs.length && (
              <div className="bg-success-container border border-success-border/50 rounded-xl p-4 text-center">
                <span aria-hidden="true" className="material-symbols-outlined text-on-success-container text-[24px] block mb-1">task_alt</span>
                <p className="text-sm font-bold text-on-success-container">All pairs reviewed</p>
                <p className="text-xs text-on-success-container mt-0.5">Check the resolution log for your decisions.</p>
              </div>
            )}
          </div>

          {/* Tip */}
          <div className="bg-surface-container-lowest rounded-xl p-5 border border-outline-variant/10">
            <div className="flex items-start gap-3">
              <div className="p-1.5 bg-primary/5 rounded-lg shrink-0">
                <span aria-hidden="true" className="material-symbols-outlined text-primary text-[18px]">lightbulb</span>
              </div>
              <div>
                <h3 className="text-xs font-bold text-on-surface mb-1">How This Works</h3>
                <p className="text-[11px] text-on-surface-variant leading-relaxed">
                  <strong>Merge</strong> combines both entries into one transaction and archives the duplicate for audit.{" "}
                  <strong>Remove Duplicate</strong> deletes the second entry.{" "}
                  <strong>Not a Duplicate</strong> keeps both — they&apos;re separate legitimate transactions.
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Transaction Detail Drawer */}
      {selectedTxn && (
        <div className="fixed inset-0 z-50 flex justify-end" onClick={() => setSelectedTxn(null)}>
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
          <div
            className="relative w-full max-w-md bg-surface-container-lowest shadow-2xl overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
            style={{ animation: "slideInRight 0.25s ease-out" }}
          >
            <div className="sticky top-0 bg-surface-container-lowest z-10 px-8 py-6 border-b border-outline-variant/20">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">Transaction Details</span>
                <button onClick={() => setSelectedTxn(null)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container-high text-on-surface-variant transition-colors">
                  <span aria-hidden="true" className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center">
                  <span aria-hidden="true" className="material-symbols-outlined text-primary text-xl">{selectedTxn.icon || "receipt"}</span>
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-on-surface">{selectedTxn.vendor}</h3>
                  <p className="text-xs text-on-surface-variant font-medium">{selectedTxn.id}</p>
                </div>
              </div>
            </div>

            <div className="px-8 py-6 bg-surface-container-low/30">
              <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Amount</p>
              <p className="text-3xl font-extrabold text-on-surface mt-1" style={{ fontFamily: "'Manrope', sans-serif" }}>{selectedTxn.amount}</p>
            </div>

            <div className="px-8 py-6 space-y-0 divide-y divide-surface-variant">
              {[
                { icon: "calendar_today", label: "Date", value: selectedTxn.date },
                { icon: "apartment", label: "Property", value: selectedTxn.property },
                { icon: "credit_card", label: "Payment Method", value: selectedTxn.method },
                { icon: "account_balance", label: "Bank Account", value: selectedTxn.bankAccount },
                { icon: "label", label: "Category", value: selectedTxn.category, badge: true },
              ].map((row) => (
                <div key={row.label} className="flex justify-between items-center py-4">
                  <span className="text-sm text-on-surface-variant font-medium flex items-center gap-2">
                    <span aria-hidden="true" className="material-symbols-outlined text-[18px]">{row.icon}</span>
                    {row.label}
                  </span>
                  {row.badge ? (
                    <span className="px-3 py-1 bg-secondary-fixed-dim/30 text-on-secondary-container text-[11px] font-bold rounded-full uppercase tracking-wide">{row.value}</span>
                  ) : (
                    <span className="text-sm font-bold text-on-surface">{row.value}</span>
                  )}
                </div>
              ))}
            </div>

            <div className="px-8 py-6 border-t border-outline-variant/20">
              <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-3">Description</p>
              <div className="bg-surface-container-low p-4 rounded-xl border-l-2 border-primary/30">
                <p className="text-[13px] leading-relaxed text-on-surface">{selectedTxn.description}</p>
              </div>
            </div>

            <div className="px-8 py-6 border-t border-outline-variant/20">
              <button onClick={() => setSelectedTxn(null)} className="w-full py-3 rounded-xl font-bold text-sm border border-outline-variant text-on-surface hover:bg-surface-container-low transition-all">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </AppLayout>
  );
}
