"use client";

import { use, useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import AppLayout from "@/components/AppLayout";
import PageHeader from "@/components/PageHeader";
import { SkeletonPulse } from "@/components/LoadingSkeleton";
import Link from "next/link";
import { getTransactionById, categoryOptions } from "@/lib/transactions";

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function TransactionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const txn = getTransactionById(id);
  const router = useRouter();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(txn?.category ?? "");
  const [catClass, setCatClass] = useState(txn?.catClass ?? "");
  const [notes, setNotes] = useState("");
  const [showRecategorize, setShowRecategorize] = useState(false);
  const [saved, setSaved] = useState(false);

  // Receipt upload
  const [receipts, setReceipts] = useState<{ name: string; size: string }[]>([]);
  const [showReceiptZone, setShowReceiptZone] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Button end states
  const [duplicated, setDuplicated] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleted, setDeleted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleRecategorize = (label: string, cls: string) => {
    setCategory(label);
    setCatClass(cls);
    setShowRecategorize(false);
    setSaved(false);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files) return;
    const newReceipts = Array.from(files).map((f) => ({
      name: f.name,
      size: formatFileSize(f.size),
    }));
    setReceipts((prev) => [...prev, ...newReceipts]);
    setSaved(false);
  }, []);

  const handleDuplicate = () => {
    setDuplicated(true);
    setTimeout(() => setDuplicated(false), 2000);
  };

  const handleSplit = () => {
    router.push(`/transactions/${id}/split`);
  };

  const handleDelete = () => {
    setDeleted(true);
  };

  const removeReceipt = (index: number) => {
    setReceipts((prev) => prev.filter((_, i) => i !== index));
    setSaved(false);
  };

  if (!txn) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <span aria-hidden="true" className="material-symbols-outlined text-[48px] text-outline-variant">receipt_long</span>
          <h2 className="text-xl font-bold text-on-surface">Transaction not found</h2>
          <p className="text-sm text-on-surface-variant">The transaction you&apos;re looking for doesn&apos;t exist.</p>
          <Link href="/transactions" className="mt-4 px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-bold shadow-md shadow-primary/20 hover:opacity-90 transition-all">
            Back to Transactions
          </Link>
        </div>
      </AppLayout>
    );
  }

  if (deleted) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
            <span aria-hidden="true" className="material-symbols-outlined text-[32px] text-red-600">delete</span>
          </div>
          <h2 className="text-xl font-bold text-on-surface">Transaction Deleted</h2>
          <p className="text-sm text-on-surface-variant">&quot;{txn.title}&quot; has been removed.</p>
          <Link href="/transactions" className="mt-4 px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-bold shadow-md shadow-primary/20 hover:opacity-90 transition-all">
            Back to Transactions
          </Link>
        </div>
      </AppLayout>
    );
  }

  const isIncome = txn.amount.startsWith("+");

  if (loading) {
    return (
      <AppLayout>
        <div className="space-y-8">
          <div className="space-y-2">
            <SkeletonPulse className="w-32 h-4" />
            <SkeletonPulse className="w-56 h-8" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <SkeletonPulse className="w-full h-64 rounded-2xl" />
              <SkeletonPulse className="w-full h-40 rounded-2xl" />
            </div>
            <SkeletonPulse className="w-full h-72 rounded-2xl" />
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <PageHeader
        title={txn.title}
        subtitle={txn.subtitle}
        breadcrumb={{ label: "Transactions", href: "/transactions" }}
        actions={
          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              aria-live="polite"
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold shadow-md transition-all ${
                saved
                  ? "bg-emerald-500 text-white shadow-emerald-500/20"
                  : "bg-primary text-white shadow-primary/20 hover:opacity-90"
              }`}
            >
              <span aria-hidden="true" className="material-symbols-outlined text-[18px]">
                {saved ? "check" : "save"}
              </span>
              {saved ? "Saved" : "Save Changes"}
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Transaction Overview Card */}
          <div className="bg-surface-container-lowest rounded-2xl card-shadow border border-outline-variant/10 overflow-hidden">
            {/* Amount header */}
            <div className={`px-8 py-6 ${isIncome ? "bg-gradient-to-r from-emerald-50 to-emerald-100/50" : "bg-gradient-to-r from-surface-container-low to-surface-container-high/50"}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${isIncome ? "bg-emerald-100" : "bg-surface-container-high"}`}>
                    <span aria-hidden="true" className={`material-symbols-outlined text-2xl ${isIncome ? "text-emerald-700" : "text-on-surface-variant"}`}>
                      {isIncome ? "arrow_downward" : "arrow_upward"}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                      {isIncome ? "Money In" : "Money Out"}
                    </p>
                    <p className={`text-3xl font-extrabold mt-0.5 ${isIncome ? "text-emerald-700" : "text-on-surface"}`} style={{ fontFamily: "'Manrope', sans-serif" }}>
                      {txn.amount}
                    </p>
                  </div>
                </div>
                <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${isIncome ? "bg-emerald-100 text-emerald-700" : "bg-surface-container-high text-on-surface-variant"}`}>
                  {isIncome ? "Credit" : "Debit"}
                </span>
              </div>
            </div>

            {/* Detail rows */}
            <div className="px-8 py-6 space-y-0 divide-y divide-surface-variant">
              <div className="flex justify-between items-center py-4">
                <span className="text-sm text-on-surface-variant font-medium flex items-center gap-2">
                  <span aria-hidden="true" className="material-symbols-outlined text-[18px]">calendar_today</span>
                  Date
                </span>
                <span className="text-sm font-bold text-on-surface">{txn.date}</span>
              </div>

              <div className="flex justify-between items-center py-4">
                <span className="text-sm text-on-surface-variant font-medium flex items-center gap-2">
                  <span aria-hidden="true" className="material-symbols-outlined text-[18px]">apartment</span>
                  Property
                </span>
                <span className="text-sm font-bold text-on-surface">{txn.property}</span>
              </div>

              <div className="flex justify-between items-center py-4">
                <span className="text-sm text-on-surface-variant font-medium flex items-center gap-2">
                  <span aria-hidden="true" className="material-symbols-outlined text-[18px]">account_balance</span>
                  Bank Account
                </span>
                <span className="text-sm font-bold text-on-surface">{txn.bankAccount}</span>
              </div>

              <div className="flex justify-between items-center py-4">
                <span className="text-sm text-on-surface-variant font-medium flex items-center gap-2">
                  <span aria-hidden="true" className="material-symbols-outlined text-[18px]">label</span>
                  Category
                </span>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 ${catClass} text-[11px] font-bold rounded-full uppercase tracking-wide`}>
                    {category}
                  </span>
                  <button
                    onClick={() => setShowRecategorize(!showRecategorize)}
                    className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                  >
                    <span aria-hidden="true" className="material-symbols-outlined text-[14px]">edit</span>
                    Change
                  </button>
                </div>
              </div>

              {/* Recategorize dropdown */}
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  showRecategorize ? "max-h-[300px] opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="py-4">
                  <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-3">Select New Category</p>
                  <div className="flex flex-wrap gap-2">
                    {categoryOptions.map((opt) => (
                      <button
                        key={opt.label}
                        onClick={() => handleRecategorize(opt.label, opt.catClass)}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                          category === opt.label
                            ? "ring-2 ring-primary ring-offset-2 " + opt.catClass
                            : opt.catClass + " hover:ring-1 hover:ring-primary/30"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center py-4">
                <span className="text-sm text-on-surface-variant font-medium flex items-center gap-2">
                  <span aria-hidden="true" className="material-symbols-outlined text-[18px]">tag</span>
                  Reference
                </span>
                <span className="text-sm font-mono text-on-surface-variant">{txn.id.toUpperCase()}</span>
              </div>
            </div>
          </div>

          {/* Notes Section */}
          <div className="bg-surface-container-lowest rounded-2xl card-shadow border border-outline-variant/10 p-8">
            <h3 className="text-sm font-bold text-on-surface mb-4 flex items-center gap-2">
              <span aria-hidden="true" className="material-symbols-outlined text-[18px] text-on-surface-variant">sticky_note_2</span>
              Notes
            </h3>
            <textarea
              value={notes}
              onChange={(e) => { setNotes(e.target.value); setSaved(false); }}
              placeholder="Add notes about this transaction..."
              className="w-full h-28 bg-surface-container-low rounded-xl px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:ring-2 focus:ring-primary/20 outline-none resize-none"
            />
          </div>

          {/* Receipt Upload Section */}
          <div className="bg-surface-container-lowest rounded-2xl card-shadow border border-outline-variant/10 p-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-on-surface flex items-center gap-2">
                <span aria-hidden="true" className="material-symbols-outlined text-[18px] text-on-surface-variant">receipt</span>
                Receipts &amp; Attachments
                {receipts.length > 0 && (
                  <span className="px-2 py-0.5 bg-primary/10 text-primary text-[11px] font-bold rounded-full">{receipts.length}</span>
                )}
              </h3>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-primary hover:bg-primary/5 rounded-lg transition-all"
              >
                <span aria-hidden="true" className="material-symbols-outlined text-[16px]">add</span>
                Add File
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,.pdf"
              multiple
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />

            {/* Uploaded files list */}
            {receipts.length > 0 && (
              <div className="space-y-2 mb-4">
                {receipts.map((r, i) => (
                  <div key={i} className="flex items-center justify-between bg-surface-container-low rounded-xl px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <span aria-hidden="true" className="material-symbols-outlined text-primary text-[18px]">
                          {r.name.endsWith(".pdf") ? "picture_as_pdf" : "image"}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-on-surface truncate max-w-[240px]">{r.name}</p>
                        <p className="text-[11px] text-on-surface-variant">{r.size}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeReceipt(i)}
                      className="w-7 h-7 flex items-center justify-center rounded-full text-on-surface-variant hover:bg-red-50 hover:text-red-600 transition-all"
                    >
                      <span aria-hidden="true" className="material-symbols-outlined text-[16px]">close</span>
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Drag and drop zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFiles(e.dataTransfer.files); }}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl py-8 flex flex-col items-center gap-3 cursor-pointer transition-all ${
                isDragging
                  ? "border-primary bg-primary/5"
                  : "border-outline-variant hover:border-primary/30 hover:bg-surface-container-low/50"
              }`}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${isDragging ? "bg-primary/10" : "bg-surface-container-high"}`}>
                <span aria-hidden="true" className={`material-symbols-outlined text-2xl ${isDragging ? "text-primary" : "text-on-surface-variant"}`}>
                  cloud_upload
                </span>
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-on-surface">
                  {isDragging ? "Drop files here" : "Drag & drop receipts here"}
                </p>
                <p className="text-xs text-on-surface-variant mt-1">or click to browse — PNG, JPG, PDF up to 10MB</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-surface-container-lowest rounded-2xl card-shadow border border-outline-variant/10 p-6">
            <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button
                onClick={() => setShowRecategorize(true)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-on-surface hover:bg-surface-container-low transition-all"
              >
                <span aria-hidden="true" className="material-symbols-outlined text-[20px] text-primary">category</span>
                Recategorize
              </button>
              <button
                onClick={handleDuplicate}
                aria-live="polite"
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  duplicated
                    ? "bg-emerald-50 text-emerald-700"
                    : "text-on-surface hover:bg-surface-container-low"
                }`}
              >
                <span aria-hidden="true" className={`material-symbols-outlined text-[20px] ${duplicated ? "text-emerald-700" : "text-primary"}`}>
                  {duplicated ? "check_circle" : "content_copy"}
                </span>
                {duplicated ? "Duplicated!" : "Duplicate Entry"}
              </button>
              <button
                onClick={() => { setShowReceiptZone(true); fileInputRef.current?.click(); }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-on-surface hover:bg-surface-container-low transition-all"
              >
                <span aria-hidden="true" className="material-symbols-outlined text-[20px] text-primary">attach_file</span>
                Attach Receipt
                {receipts.length > 0 && (
                  <span className="ml-auto px-2 py-0.5 bg-primary/10 text-primary text-[11px] font-bold rounded-full">{receipts.length}</span>
                )}
              </button>
              <button
                onClick={handleSplit}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-on-surface hover:bg-surface-container-low transition-all"
              >
                <span aria-hidden="true" className="material-symbols-outlined text-[20px] text-primary">call_split</span>
                Split Transaction
              </button>
              <div className="border-t border-outline-variant/10 my-2" />

              {/* Delete with confirmation */}
              {!showDeleteConfirm ? (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 transition-all"
                >
                  <span aria-hidden="true" className="material-symbols-outlined text-[20px]">delete</span>
                  Delete Transaction
                </button>
              ) : (
                <div className="bg-red-50 border border-red-200/50 rounded-xl p-4 space-y-3">
                  <p className="text-xs font-bold text-red-800">Are you sure? This cannot be undone.</p>
                  <div className="flex gap-2">
                    <button
                      onClick={handleDelete}
                      className="flex-1 px-3 py-2 bg-red-600 text-white text-xs font-bold rounded-lg hover:bg-red-700 transition-all"
                    >
                      Yes, Delete
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="flex-1 px-3 py-2 bg-white text-red-600 border border-red-200 text-xs font-bold rounded-lg hover:bg-red-50 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* AI Insights */}
          {txn.highlight && (
            <div className="bg-amber-50 border border-amber-200/50 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <span aria-hidden="true" className="material-symbols-outlined text-amber-600">psychology</span>
                <h3 className="text-sm font-bold text-amber-800">AI Analysis</h3>
              </div>
              <p className="text-xs text-amber-700 leading-relaxed">
                This transaction couldn&apos;t be automatically categorized. The merchant &quot;{txn.title.split(" - ")[0]}&quot; doesn&apos;t match any known patterns. Consider assigning a category manually using the Recategorize action.
              </p>
              <Link
                href="/transactions/ai-review"
                className="mt-4 flex items-center gap-2 text-xs font-bold text-amber-800 hover:underline"
              >
                <span aria-hidden="true" className="material-symbols-outlined text-[14px]">open_in_new</span>
                View in AI Review
              </Link>
            </div>
          )}

          {/* Audit Trail */}
          <div className="bg-surface-container-lowest rounded-2xl card-shadow border border-outline-variant/10 p-6">
            <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-4">Audit Trail</h3>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-on-surface">Transaction imported</p>
                  <p className="text-[11px] text-on-surface-variant mt-0.5">{txn.date} via bank sync</p>
                </div>
              </div>
              {txn.highlight && (
                <div className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-on-surface">Flagged for review</p>
                    <p className="text-[11px] text-on-surface-variant mt-0.5">{txn.date} — AI confidence below threshold</p>
                  </div>
                </div>
              )}
              <div className="flex gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-on-surface">Auto-categorized</p>
                  <p className="text-[11px] text-on-surface-variant mt-0.5">{txn.date} — {txn.highlight ? "Low confidence" : "High confidence"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
