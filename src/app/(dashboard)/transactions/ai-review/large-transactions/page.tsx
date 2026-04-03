"use client";

import AppLayout from "@/components/AppLayout";
import PageHeader from "@/components/PageHeader";
import Link from "next/link";
import { useEffect, useState } from "react";
import { allTransactions } from "@/lib/data/large-transactions";

function parseAmount(s: string): number {
  return Number(s.replace(/[^0-9.]/g, "")) || 0;
}

type Resolution = "verified" | "flagged" | "unflagged" | "reverted" | "split" | "note_added" | "receipt_attached";

interface LogEntry {
  id: number;
  txIndex: number;
  resolution: Resolution;
  vendor: string;
  timestamp: string;
}

interface SplitLine {
  id: number;
  description: string;
  amount: string;
  category: string;
}

interface SplitRecord {
  txIndex: number;
  lines: SplitLine[];
}

const resolutionConfig: Record<Resolution, { label: string; icon: string; color: string; bgColor: string }> = {
  verified: {
    label: "Verified & Approved",
    icon: "check_circle",
    color: "text-emerald-700",
    bgColor: "bg-emerald-50",
  },
  flagged: {
    label: "Flagged for Review",
    icon: "flag",
    color: "text-orange-600",
    bgColor: "bg-orange-50",
  },
  unflagged: {
    label: "Unflagged",
    icon: "flag",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  reverted: {
    label: "Reverted",
    icon: "undo",
    color: "text-on-surface-variant",
    bgColor: "bg-surface-container-high",
  },
  split: {
    label: "Split Transaction",
    icon: "call_split",
    color: "text-violet-700",
    bgColor: "bg-violet-50",
  },
  note_added: {
    label: "Note Added",
    icon: "edit_note",
    color: "text-blue-700",
    bgColor: "bg-blue-50",
  },
  receipt_attached: {
    label: "Receipt Attached",
    icon: "attach_file",
    color: "text-teal-700",
    bgColor: "bg-teal-50",
  },
};

function getNow() {
  return new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

let logIdCounter = 0;

const PER_PAGE = 3;

export default function LargeTransactionsPage() {
  const [threshold, setThreshold] = useState(() => {
    if (typeof window !== "undefined") {
      return Number(localStorage.getItem("smartThreshold")) || 1000;
    }
    return 1000;
  });
  const [flagged, setFlagged] = useState<Record<number, boolean>>(
    () => Object.fromEntries(allTransactions.map((tx, i) => [i, tx.flagged]))
  );
  const [verified, setVerified] = useState<Record<number, boolean>>({});
  const [exporting, setExporting] = useState(false);
  const [exported, setExported] = useState(false);
  const [log, setLog] = useState<LogEntry[]>([]);
  const [page, setPage] = useState(1);
  const [actionsOpen, setActionsOpen] = useState<number | null>(null);
  const [splitModal, setSplitModal] = useState<number | null>(null);
  const [splitLines, setSplitLines] = useState<SplitLine[]>([]);
  const [splits, setSplits] = useState<Record<number, SplitRecord>>({});
  const [notes, setNotes] = useState<Record<number, string>>({});
  const [receipts, setReceipts] = useState<Record<number, string>>({});
  const [noteModal, setNoteModal] = useState<number | null>(null);
  const [noteText, setNoteText] = useState("");
  const [receiptModal, setReceiptModal] = useState<number | null>(null);
  const [receiptFile, setReceiptFile] = useState<string>("");
  let splitIdCounter = 0;

  // Re-read threshold from localStorage when the page gains focus (e.g. user changed it in Settings)
  useEffect(() => {
    const sync = () => setThreshold(Number(localStorage.getItem("smartThreshold")) || 1000);
    window.addEventListener("focus", sync);
    return () => window.removeEventListener("focus", sync);
  }, []);

  // Close actions dropdown on outside click
  useEffect(() => {
    if (actionsOpen === null) return;
    const close = () => setActionsOpen(null);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, [actionsOpen]);

  // Filter transactions by threshold, then filter out verified ones
  const thresholdFiltered = allTransactions.filter((tx) => parseAmount(tx.amount) >= threshold);
  const visibleTransactions = thresholdFiltered
    .map((tx) => ({ tx, i: allTransactions.indexOf(tx) }))
    .filter(({ i }) => !verified[i]);

  const totalPages = Math.max(1, Math.ceil(visibleTransactions.length / PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const pageItems = visibleTransactions.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);

  const addLogEntry = (txIndex: number, resolution: Resolution) => {
    setLog((prev) => [
      { id: ++logIdCounter, txIndex, resolution, vendor: allTransactions[txIndex].vendor, timestamp: getNow() },
      ...prev,
    ]);
  };

  const handleFlag = (i: number) => {
    const wasFlagged = flagged[i];
    setFlagged((prev) => ({ ...prev, [i]: !wasFlagged }));
    addLogEntry(i, wasFlagged ? "unflagged" : "flagged");
  };

  const handleVerify = (i: number) => {
    if (verified[i]) return;
    setVerified((prev) => ({ ...prev, [i]: true }));
    setFlagged((prev) => ({ ...prev, [i]: false }));
    addLogEntry(i, "verified");
  };

  const undoResolve = (txIndex: number) => {
    // Find the latest active entry for this transaction
    const latest = log.find((e) => e.txIndex === txIndex && e.resolution !== "reverted");
    if (!latest) return;

    if (latest.resolution === "verified") {
      setVerified((prev) => { const n = { ...prev }; delete n[txIndex]; return n; });
    } else if (latest.resolution === "flagged") {
      setFlagged((prev) => ({ ...prev, [txIndex]: false }));
    } else if (latest.resolution === "unflagged") {
      setFlagged((prev) => ({ ...prev, [txIndex]: true }));
    }
    addLogEntry(txIndex, "reverted");
  };

  const openSplit = (i: number) => {
    const tx = allTransactions[i];
    const total = parseAmount(tx.amount);
    setSplitLines([
      { id: ++splitIdCounter, description: "", amount: (total / 2).toFixed(2), category: tx.tags[0]?.label || "" },
      { id: ++splitIdCounter, description: "", amount: (total / 2).toFixed(2), category: tx.tags[0]?.label || "" },
    ]);
    setSplitModal(i);
    setActionsOpen(null);
  };

  const addSplitLine = () => {
    setSplitLines((prev) => [...prev, { id: ++splitIdCounter, description: "", amount: "0.00", category: "" }]);
  };

  const updateSplitLine = (id: number, field: keyof SplitLine, value: string) => {
    setSplitLines((prev) => prev.map((l) => (l.id === id ? { ...l, [field]: value } : l)));
  };

  const removeSplitLine = (id: number) => {
    setSplitLines((prev) => (prev.length <= 2 ? prev : prev.filter((l) => l.id !== id)));
  };

  const confirmSplit = () => {
    if (splitModal === null) return;
    setSplits((prev) => ({ ...prev, [splitModal]: { txIndex: splitModal, lines: splitLines } }));
    addLogEntry(splitModal, "split");
    setSplitModal(null);
    setSplitLines([]);
  };

  const openNote = (i: number) => {
    setNoteText(notes[i] || "");
    setNoteModal(i);
    setActionsOpen(null);
  };

  const confirmNote = () => {
    if (noteModal === null || !noteText.trim()) return;
    setNotes((prev) => ({ ...prev, [noteModal]: noteText.trim() }));
    addLogEntry(noteModal, "note_added");
    setNoteModal(null);
    setNoteText("");
  };

  const openReceipt = (i: number) => {
    setReceiptFile("");
    setReceiptModal(i);
    setActionsOpen(null);
  };

  const confirmReceipt = (fileName: string) => {
    if (receiptModal === null || !fileName) return;
    setReceipts((prev) => ({ ...prev, [receiptModal]: fileName }));
    addLogEntry(receiptModal, "receipt_attached");
    setReceiptModal(null);
    setReceiptFile("");
  };

  // Find the latest non-reverted entry for each transaction
  const latestPerTx: Record<number, number> = {};
  for (const entry of log) {
    if (entry.resolution !== "reverted" && !(entry.txIndex in latestPerTx)) {
      latestPerTx[entry.txIndex] = entry.id;
    }
  }

  const handleExport = () => {
    setExporting(true);
    setTimeout(() => { setExporting(false); setExported(true); }, 2000);
  };

  const verifiedCount = Object.keys(verified).length;
  const flaggedCount = Object.values(flagged).filter(Boolean).length;

  return (
    <AppLayout>
      <PageHeader
        title="Large Transactions"
        badge={`> $${threshold.toLocaleString()} THRESHOLD`}
      />

      <div className="flex gap-6">
        {/* Left Column: Transaction Cards */}
        <div className="flex-1 min-w-0 space-y-6">
          {visibleTransactions.length === 0 ? (
            <div className="bg-surface-container-lowest rounded-xl p-12 card-shadow text-center">
              <span aria-hidden="true" className="material-symbols-outlined text-[48px] text-emerald-400 block mb-3">task_alt</span>
              <h3 className="text-lg font-bold text-on-surface mb-1">All transactions reviewed</h3>
              <p className="text-sm text-on-surface-variant">Every transaction has been verified. Check the resolution log for your decisions.</p>
            </div>
          ) : (
            pageItems.map(({ tx, i }) => (
              <div
                key={i}
                className={`bg-surface-container-lowest rounded-xl p-6 card-shadow transition-colors duration-200 ${flagged[i] ? "border-l-4 border-orange-400" : ""}`}
              >
                {/* Top section */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-4">
                    <div className="w-14 h-14 bg-surface-container rounded-lg flex items-center justify-center">
                      <span aria-hidden="true" className="material-symbols-outlined text-primary text-[28px]">
                        {tx.icon}
                      </span>
                    </div>
                    <div>
                      <Link href={`/transactions/ai-review/large-transactions/${tx.slug}`} className="text-[16px] font-semibold text-on-surface hover:text-primary transition-colors">
                        {tx.vendor}
                      </Link>
                      <div className="text-[12px] text-on-surface-variant mt-0.5">{tx.date}</div>
                      <div className="flex gap-2 mt-2">
                        {tx.tags.map((tag, j) => (
                          <span key={j} className={`px-2 py-0.5 text-[11px] font-bold rounded ${tag.style}`}>
                            {tag.label}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[24px] font-extrabold text-on-surface tracking-tight">{tx.amount}</div>
                    <div className="text-[11px] text-on-surface-variant font-medium mt-1 uppercase tracking-widest">{tx.method}</div>
                  </div>
                </div>

                {/* View Details Link */}
                <Link
                  href={`/transactions/ai-review/large-transactions/${tx.slug}`}
                  className="mt-4 flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
                >
                  <span aria-hidden="true" className="material-symbols-outlined text-[14px]">open_in_new</span>
                  View Full Details
                </Link>

                {/* Split indicator */}
                {splits[i] && (
                  <div className="mt-4 px-4 py-3 bg-violet-50 rounded-lg border border-violet-200">
                    <div className="flex items-center gap-2 mb-2">
                      <span aria-hidden="true" className="material-symbols-outlined text-violet-700 text-[16px]">call_split</span>
                      <span className="text-[12px] font-bold text-violet-700 uppercase tracking-widest">Split into {splits[i].lines.length} items</span>
                    </div>
                    <div className="space-y-1">
                      {splits[i].lines.map((line) => (
                        <div key={line.id} className="flex justify-between text-[12px]">
                          <span className="text-on-surface-variant">{line.description || line.category || "Uncategorized"}</span>
                          <span className="font-bold text-on-surface">${Number(line.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Note indicator */}
                {notes[i] && (
                  <div className="mt-4 px-4 py-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2 mb-1">
                      <span aria-hidden="true" className="material-symbols-outlined text-blue-700 text-[16px]">edit_note</span>
                      <span className="text-[12px] font-bold text-blue-700 uppercase tracking-widest">Note</span>
                      <button onClick={() => openNote(i)} className="ml-auto text-[11px] font-bold text-blue-600 hover:underline">Edit</button>
                    </div>
                    <p className="text-[12px] text-on-surface-variant leading-relaxed">{notes[i]}</p>
                  </div>
                )}

                {/* User-attached receipt indicator */}
                {receipts[i] && (
                  <div className="mt-4 px-4 py-3 bg-teal-50 rounded-lg border border-teal-200">
                    <div className="flex items-center gap-2">
                      <span aria-hidden="true" className="material-symbols-outlined text-teal-700 text-[16px]">attach_file</span>
                      <span className="text-[12px] font-bold text-teal-700 uppercase tracking-widest">Attached</span>
                      <span className="text-[12px] text-on-surface-variant ml-1 truncate">{receipts[i]}</span>
                      <button onClick={() => openReceipt(i)} className="ml-auto text-[11px] font-bold text-teal-600 hover:underline shrink-0">Replace</button>
                    </div>
                  </div>
                )}

                {/* Bottom section */}
                <div className="flex items-end justify-between border-t border-surface pt-4 mt-4">
                  <div className="flex items-center gap-3">
                    {tx.hasReceipt ? (
                      <>
                        <div className="w-16 h-20 bg-surface-container-high rounded flex items-center justify-center text-outline-variant">
                          <span aria-hidden="true" className="material-symbols-outlined text-[32px]">receipt_long</span>
                        </div>
                        <div className="text-[12px] text-on-surface-variant italic max-w-[200px]">{tx.receiptNote}</div>
                      </>
                    ) : (
                      <>
                        <div className="w-16 h-20 bg-surface-container-high rounded flex items-center justify-center text-outline-variant">
                          <span aria-hidden="true" className="material-symbols-outlined text-[32px]">image_not_supported</span>
                        </div>
                        <div className="text-[12px] text-error font-medium flex items-center gap-1">
                          <span aria-hidden="true" className="material-symbols-outlined text-[16px]">warning</span>
                          Receipt missing
                        </div>
                      </>
                    )}
                  </div>
                  <div className="flex gap-3 items-center">
                    {/* Actions dropdown */}
                    <div className="relative">
                      <button
                        onClick={(e) => { e.stopPropagation(); setActionsOpen(actionsOpen === i ? null : i); }}
                        className="w-9 h-9 flex items-center justify-center rounded-lg text-on-surface-variant bg-surface-container-high hover:bg-surface-container-highest transition-colors"
                      >
                        <span aria-hidden="true" className="material-symbols-outlined text-[20px]">more_vert</span>
                      </button>
                      {actionsOpen === i && (
                        <div className="absolute right-0 bottom-full mb-2 w-52 bg-surface-container-lowest rounded-xl shadow-xl border border-outline-variant/10 py-1 z-20">
                          <button
                            onClick={() => openSplit(i)}
                            className="w-full px-4 py-2.5 text-left text-[13px] font-medium text-on-surface hover:bg-surface-container-low transition-colors flex items-center gap-3"
                          >
                            <span aria-hidden="true" className="material-symbols-outlined text-[18px] text-violet-600">call_split</span>
                            Split Transaction
                          </button>
                          <button
                            onClick={() => openReceipt(i)}
                            className="w-full px-4 py-2.5 text-left text-[13px] font-medium text-on-surface hover:bg-surface-container-low transition-colors flex items-center gap-3"
                          >
                            <span aria-hidden="true" className="material-symbols-outlined text-[18px] text-teal-600">attach_file</span>
                            {receipts[i] ? "Replace Receipt" : "Attach Receipt"}
                          </button>
                          <button
                            onClick={() => openNote(i)}
                            className="w-full px-4 py-2.5 text-left text-[13px] font-medium text-on-surface hover:bg-surface-container-low transition-colors flex items-center gap-3"
                          >
                            <span aria-hidden="true" className="material-symbols-outlined text-[18px] text-blue-600">edit_note</span>
                            {notes[i] ? "Edit Note" : "Add Note"}
                          </button>
                        </div>
                      )}
                    </div>
                    {flagged[i] ? (
                      <button
                        onClick={() => handleFlag(i)}
                        className="px-4 py-2 text-[13px] font-bold text-orange-600 bg-orange-50 rounded-lg transition-colors flex items-center gap-2"
                      >
                        <span aria-hidden="true" className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>flag</span>
                        Flagged for Review
                      </button>
                    ) : (
                      <button
                        onClick={() => handleFlag(i)}
                        className="px-4 py-2 text-[13px] font-bold text-on-surface-variant bg-surface-container-high rounded-lg hover:bg-orange-50 hover:text-orange-600 transition-colors flex items-center gap-2"
                      >
                        <span aria-hidden="true" className="material-symbols-outlined text-[18px]">flag</span>
                        Flag for Review
                      </button>
                    )}
                    <button
                      onClick={() => handleVerify(i)}
                      className="px-4 py-2 text-[13px] font-bold rounded-lg shadow-md transition-all flex items-center gap-2 text-white bg-emerald-600 shadow-emerald-200 hover:bg-emerald-700"
                    >
                      <span aria-hidden="true" className="material-symbols-outlined text-[18px]">check_circle</span>
                      Verify and Approve
                    </button>
                  </div>
                </div>
              </div>
            ))
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
                  <span className="px-2 py-0.5 bg-surface-container-high text-on-surface-variant text-[11px] font-bold rounded-full">
                    {log.length}
                  </span>
                )}
              </div>
              {log.length > 0 && (
                <span className="text-[11px] text-on-surface-variant">
                  {verifiedCount} verified &middot; {flaggedCount} flagged
                </span>
              )}
            </div>
            <div className="divide-y divide-outline-variant/5 max-h-[480px] overflow-y-auto">
              {log.length === 0 ? (
                <div className="px-6 py-10 text-center">
                  <span aria-hidden="true" className="material-symbols-outlined text-[32px] text-outline-variant/40 block mb-2">pending_actions</span>
                  <p className="text-sm text-on-surface-variant">No actions yet. Flag or verify transactions above to get started.</p>
                </div>
              ) : (
                log.map((entry) => {
                  const config = resolutionConfig[entry.resolution];
                  const isLatest = latestPerTx[entry.txIndex] === entry.id;
                  const canRevert = isLatest && entry.resolution !== "reverted";
                  return (
                    <div key={entry.id} className={`px-6 py-3.5 flex items-center gap-4 group ${entry.resolution === "reverted" ? "opacity-50" : ""}`}>
                      <div className={`w-8 h-8 rounded-lg ${config.bgColor} flex items-center justify-center shrink-0`}>
                        <span
                          aria-hidden="true"
                          className={`material-symbols-outlined text-[16px] ${config.color}`}
                          style={entry.resolution === "flagged" ? { fontVariationSettings: "'FILL' 1" } : undefined}
                        >
                          {config.icon}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-on-surface">
                          <span className="font-bold">{entry.vendor}</span>
                          {" — "}
                          <span className={`font-bold ${config.color}`}>{config.label}</span>
                        </p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-[11px] text-on-surface-variant">{entry.timestamp}</span>
                        {canRevert && (
                          <button
                            onClick={() => undoResolve(entry.txIndex)}
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
        </div>

        {/* Right Column: Statistics + Smart Thresholding */}
        <div className="w-[432px] shrink-0">
          <div className="sticky top-24 space-y-6 max-h-[calc(100vh-8rem)] overflow-y-auto pr-1">
            <div className="bg-surface-container-lowest rounded-xl p-8 card-shadow">
              <h2 className="text-[20px] font-bold text-on-surface mb-8">Statistics</h2>

              <div className="space-y-8">
                {/* Total Flagged */}
                <div>
                  <div className="text-[12px] text-on-surface-variant font-bold uppercase tracking-widest mb-1">Total Flagged</div>
                  <div className="text-[32px] font-extrabold text-on-surface leading-tight">$15,234.55</div>
                </div>

                {/* Average / Count */}
                <div className="flex justify-between items-center pb-6 border-b border-surface">
                  <div>
                    <div className="text-[12px] text-on-surface-variant font-bold uppercase tracking-widest mb-1">Average Size</div>
                    <div className="text-[20px] font-bold text-on-surface">$5,266.06</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[12px] text-on-surface-variant font-bold uppercase tracking-widest mb-1">Count</div>
                    <div className="text-[20px] font-bold text-on-surface">{thresholdFiltered.length}</div>
                  </div>
                </div>

                {/* Progress */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wide">Review Progress</span>
                    <span className="text-xs font-bold text-on-surface">{verifiedCount}/{thresholdFiltered.length}</span>
                  </div>
                  <div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: `${thresholdFiltered.length > 0 ? (verifiedCount / thresholdFiltered.length) * 100 : 0}%` }}
                    />
                  </div>
                </div>

                {/* Chart */}
                <div>
                  <div className="flex justify-between items-end mb-4">
                    <div className="text-[13px] font-bold text-on-surface">Monthly Comparison</div>
                    <div className="text-[11px] text-emerald-700 font-bold">+12% vs LY</div>
                  </div>
                  <div className="h-32 flex items-end gap-6 px-4">
                    <div className="flex-1 flex flex-col items-center gap-2">
                      <div className="w-full bg-surface-container-high rounded-t-lg transition-all hover:bg-surface-container-highest" style={{ height: "60%" }} />
                      <span className="text-[11px] font-bold text-on-surface-variant uppercase">Last Month</span>
                    </div>
                    <div className="flex-1 flex flex-col items-center gap-2">
                      <div className="w-full bg-primary rounded-t-lg shadow-lg shadow-primary/20 transition-all hover:opacity-90" style={{ height: "85%" }} />
                      <span className="text-[11px] font-bold text-primary uppercase">This Month</span>
                    </div>
                  </div>
                </div>

                {/* Export */}
                <div className="pt-6">
                  <button
                    onClick={handleExport}
                    disabled={exporting}
                    className={`w-full py-3.5 border-2 text-[14px] font-bold rounded-xl transition-colors flex items-center justify-center gap-2 ${
                      exported
                        ? "border-emerald-500 text-emerald-700 bg-emerald-50"
                        : exporting
                        ? "border-outline-variant text-on-surface-variant cursor-wait"
                        : "border-outline-variant text-on-surface hover:bg-surface-container-low"
                    }`}
                  >
                    <span aria-hidden="true" className={`material-symbols-outlined text-[20px] ${exporting ? "animate-spin" : ""}`}>
                      {exported ? "check_circle" : exporting ? "progress_activity" : "ios_share"}
                    </span>
                    {exported ? "Report Exported!" : exporting ? "Exporting..." : "Export Flagged Report"}
                  </button>
                </div>
              </div>
            </div>

            {/* Smart Thresholding */}
            <div className="p-6 bg-primary-fixed/30 rounded-xl border border-primary-fixed">
              <div className="flex gap-3">
                <span aria-hidden="true" className="material-symbols-outlined text-primary">info</span>
                <div>
                  <div className="text-[13px] font-bold text-on-surface mb-1">Smart Thresholding</div>
                  <p className="text-[12px] text-on-surface-variant leading-relaxed">
                    Transactions over ${`$${threshold.toLocaleString()}`} are automatically held for review based on your
                    &ldquo;High Stewardship&rdquo; security policy.
                  </p>
                  <Link
                    href="/settings#thresholds"
                    className="inline-flex items-center gap-1 text-[12px] font-bold text-primary mt-2 hover:underline"
                  >
                    <span aria-hidden="true" className="material-symbols-outlined text-[14px]">settings</span>
                    Change threshold in Settings
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Split Transaction Modal */}
      {splitModal !== null && (() => {
        const tx = allTransactions[splitModal];
        const total = parseAmount(tx.amount);
        const allocated = splitLines.reduce((sum, l) => sum + (Number(l.amount) || 0), 0);
        const remaining = total - allocated;
        const isBalanced = Math.abs(remaining) < 0.01;

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setSplitModal(null)}>
            <div className="bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-xl mx-4 overflow-hidden" onClick={(e) => e.stopPropagation()}>
              {/* Header */}
              <div className="px-6 py-5 border-b border-outline-variant/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center">
                      <span aria-hidden="true" className="material-symbols-outlined text-violet-700 text-[20px]">call_split</span>
                    </div>
                    <div>
                      <h3 className="text-[16px] font-bold text-on-surface">Split Transaction</h3>
                      <p className="text-[12px] text-on-surface-variant">{tx.vendor}</p>
                    </div>
                  </div>
                  <button onClick={() => setSplitModal(null)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container-high transition-colors">
                    <span aria-hidden="true" className="material-symbols-outlined text-on-surface-variant text-[20px]">close</span>
                  </button>
                </div>
              </div>

              {/* Original amount */}
              <div className="px-6 pt-5 pb-3 flex items-center justify-between">
                <span className="text-[12px] font-bold text-on-surface-variant uppercase tracking-widest">Original Amount</span>
                <span className="text-[20px] font-extrabold text-on-surface">{tx.amount}</span>
              </div>

              {/* Split lines */}
              <div className="px-6 space-y-3 max-h-[320px] overflow-y-auto">
                {splitLines.map((line, idx) => (
                  <div key={line.id} className="flex gap-3 items-start p-3 bg-surface-container-low/50 rounded-lg">
                    <div className="w-6 h-6 bg-violet-100 rounded text-violet-700 text-[11px] font-bold flex items-center justify-center shrink-0 mt-1">
                      {idx + 1}
                    </div>
                    <div className="flex-1 grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Description"
                        value={line.description}
                        onChange={(e) => updateSplitLine(line.id, "description", e.target.value)}
                        className="col-span-2 px-3 py-2 text-[13px] bg-surface-container-lowest border border-outline-variant/20 rounded-lg text-on-surface placeholder-outline focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                      <input
                        type="text"
                        placeholder="Category"
                        value={line.category}
                        onChange={(e) => updateSplitLine(line.id, "category", e.target.value)}
                        className="px-3 py-2 text-[13px] bg-surface-container-lowest border border-outline-variant/20 rounded-lg text-on-surface placeholder-outline focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[13px] font-bold">$</span>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={line.amount}
                          onChange={(e) => updateSplitLine(line.id, "amount", e.target.value)}
                          className="w-full pl-7 pr-3 py-2 text-[13px] bg-surface-container-lowest border border-outline-variant/20 rounded-lg text-on-surface font-bold text-right focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                      </div>
                    </div>
                    <button
                      onClick={() => removeSplitLine(line.id)}
                      disabled={splitLines.length <= 2}
                      className="w-7 h-7 flex items-center justify-center rounded-lg text-on-surface-variant hover:text-error hover:bg-error/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors mt-1 shrink-0"
                    >
                      <span aria-hidden="true" className="material-symbols-outlined text-[16px]">close</span>
                    </button>
                  </div>
                ))}
              </div>

              {/* Add line button */}
              <div className="px-6 pt-3">
                <button
                  onClick={addSplitLine}
                  className="w-full py-2 text-[12px] font-bold text-primary hover:bg-primary/5 rounded-lg transition-colors flex items-center justify-center gap-1"
                >
                  <span aria-hidden="true" className="material-symbols-outlined text-[16px]">add</span>
                  Add Line Item
                </button>
              </div>

              {/* Balance indicator */}
              <div className="px-6 py-4">
                <div className={`flex items-center justify-between px-4 py-3 rounded-lg ${isBalanced ? "bg-emerald-50" : "bg-orange-50"}`}>
                  <span className={`text-[12px] font-bold uppercase tracking-widest ${isBalanced ? "text-emerald-700" : "text-orange-600"}`}>
                    {isBalanced ? "Balanced" : "Remaining"}
                  </span>
                  <span className={`text-[16px] font-extrabold ${isBalanced ? "text-emerald-700" : "text-orange-600"}`}>
                    {isBalanced ? "$0.00" : `$${Math.abs(remaining).toFixed(2)}`}
                    {!isBalanced && remaining < 0 && " over"}
                  </span>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 pb-5 flex justify-end gap-3">
                <button
                  onClick={() => setSplitModal(null)}
                  className="px-5 py-2.5 text-[13px] font-bold text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmSplit}
                  disabled={!isBalanced || splitLines.some((l) => !l.amount || Number(l.amount) <= 0)}
                  className="px-5 py-2.5 text-[13px] font-bold text-white bg-violet-600 rounded-lg shadow-md shadow-violet-200 hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                >
                  <span aria-hidden="true" className="material-symbols-outlined text-[18px]">check</span>
                  Confirm Split
                </button>
              </div>
            </div>
          </div>
        );
      })()}
      {/* Add Note Modal */}
      {noteModal !== null && (() => {
        const tx = allTransactions[noteModal];
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setNoteModal(null)}>
            <div className="bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden" onClick={(e) => e.stopPropagation()}>
              <div className="px-6 py-5 border-b border-outline-variant/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span aria-hidden="true" className="material-symbols-outlined text-blue-700 text-[20px]">edit_note</span>
                    </div>
                    <div>
                      <h3 className="text-[16px] font-bold text-on-surface">{notes[noteModal] ? "Edit Note" : "Add Note"}</h3>
                      <p className="text-[12px] text-on-surface-variant">{tx.vendor}</p>
                    </div>
                  </div>
                  <button onClick={() => setNoteModal(null)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container-high transition-colors">
                    <span aria-hidden="true" className="material-symbols-outlined text-on-surface-variant text-[20px]">close</span>
                  </button>
                </div>
              </div>
              <div className="px-6 py-5">
                <textarea
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Add context, justification, or reviewer comments..."
                  rows={4}
                  className="w-full px-4 py-3 text-[13px] bg-surface-container-low/50 border border-outline-variant/20 rounded-lg text-on-surface placeholder-outline resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  autoFocus
                />
                <p className="text-[11px] text-on-surface-variant mt-2">This note will be visible in the resolution log and attached to the transaction record.</p>
              </div>
              <div className="px-6 pb-5 flex justify-end gap-3">
                <button
                  onClick={() => setNoteModal(null)}
                  className="px-5 py-2.5 text-[13px] font-bold text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmNote}
                  disabled={!noteText.trim()}
                  className="px-5 py-2.5 text-[13px] font-bold text-white bg-blue-600 rounded-lg shadow-md shadow-blue-200 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                >
                  <span aria-hidden="true" className="material-symbols-outlined text-[18px]">check</span>
                  {notes[noteModal] ? "Update Note" : "Save Note"}
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Attach Receipt Modal */}
      {receiptModal !== null && (() => {
        const tx = allTransactions[receiptModal];
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setReceiptModal(null)}>
            <div className="bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden" onClick={(e) => e.stopPropagation()}>
              <div className="px-6 py-5 border-b border-outline-variant/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                      <span aria-hidden="true" className="material-symbols-outlined text-teal-700 text-[20px]">attach_file</span>
                    </div>
                    <div>
                      <h3 className="text-[16px] font-bold text-on-surface">Attach Receipt</h3>
                      <p className="text-[12px] text-on-surface-variant">{tx.vendor} — {tx.amount}</p>
                    </div>
                  </div>
                  <button onClick={() => setReceiptModal(null)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container-high transition-colors">
                    <span aria-hidden="true" className="material-symbols-outlined text-on-surface-variant text-[20px]">close</span>
                  </button>
                </div>
              </div>
              <div className="px-6 py-6">
                {receiptFile ? (
                  <div className="flex items-center gap-4 p-4 bg-teal-50 rounded-lg border border-teal-200">
                    <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center shrink-0">
                      <span aria-hidden="true" className="material-symbols-outlined text-teal-700 text-[24px]">description</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-bold text-on-surface truncate">{receiptFile}</p>
                      <p className="text-[11px] text-on-surface-variant">Ready to attach</p>
                    </div>
                    <button
                      onClick={() => setReceiptFile("")}
                      className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-teal-100 transition-colors shrink-0"
                    >
                      <span aria-hidden="true" className="material-symbols-outlined text-on-surface-variant text-[18px]">close</span>
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center gap-3 p-8 border-2 border-dashed border-outline-variant/30 rounded-xl hover:border-teal-400 hover:bg-teal-50/30 transition-colors cursor-pointer">
                    <span aria-hidden="true" className="material-symbols-outlined text-[40px] text-outline-variant">cloud_upload</span>
                    <div className="text-center">
                      <p className="text-[13px] font-bold text-on-surface">Drop file here or click to browse</p>
                      <p className="text-[11px] text-on-surface-variant mt-1">PDF, PNG, JPG up to 10MB</p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf,.png,.jpg,.jpeg"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) setReceiptFile(file.name);
                      }}
                    />
                  </label>
                )}
              </div>
              <div className="px-6 pb-5 flex justify-end gap-3">
                <button
                  onClick={() => setReceiptModal(null)}
                  className="px-5 py-2.5 text-[13px] font-bold text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => confirmReceipt(receiptFile)}
                  disabled={!receiptFile}
                  className="px-5 py-2.5 text-[13px] font-bold text-white bg-teal-600 rounded-lg shadow-md shadow-teal-200 hover:bg-teal-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                >
                  <span aria-hidden="true" className="material-symbols-outlined text-[18px]">check</span>
                  Attach Receipt
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </AppLayout>
  );
}
