"use client";

import AppLayout from "@/components/AppLayout";
import PageHeader from "@/components/PageHeader";
import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { SkeletonPulse, TableSkeleton } from "@/components/LoadingSkeleton";
import { allTransactions, categoryOptions } from "@/lib/transactions";

const PAGE_SIZE_OPTIONS = [5, 10, 15, 20] as const;
const propertyOptions = ["All Properties", "Main St. Loft", "Oak Ridge Estate", "Downtown Plaza"];
const timePeriods = ["Last 30 Days", "Last 90 Days", "Year to Date", "2023", "All Time"];

const propertySlugMap: Record<string, string> = {
  "main-st-loft": "Main St. Loft",
  "oak-ridge": "Oak Ridge Estate",
  "downtown-plaza": "Downtown Plaza",
};

function TransactionsContent() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"All" | "Income" | "Expenses">("All");
  const [itemsPerPage, setItemsPerPage] = useState<number>(5);
  const [categoryFilter, setCategoryFilter] = useState<string>("All Categories");
  const [page, setPage] = useState(1);
  const [propertyFilter, setPropertyFilter] = useState("All Properties");
  const [timePeriod, setTimePeriod] = useState("Last 30 Days");
  const [selectedTransaction, setSelectedTransaction] = useState<typeof allTransactions[0] | null>(null);
  const [showRecategorize, setShowRecategorize] = useState(false);
  const [tempCategory, setTempCategory] = useState<{ label: string; catClass: string } | null>(null);
  const [alertDismissed, setAlertDismissed] = useState(false);
  const [txSortKey, setTxSortKey] = useState<"date" | "title" | "category" | "property" | "amount" | null>(null);
  const [txSortDir, setTxSortDir] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const slug = searchParams.get("property");
    if (slug && propertySlugMap[slug]) {
      setPropertyFilter(propertySlugMap[slug]);
    }
    const cat = searchParams.get("category");
    if (cat) {
      setCategoryFilter(cat);
    }
  }, [searchParams]);

  const hasActiveFilters = filter !== "All" || propertyFilter !== "All Properties" || timePeriod !== "Last 30 Days" || categoryFilter !== "All Categories";

  const resetAllFilters = () => {
    setFilter("All");
    setPropertyFilter("All Properties");
    setTimePeriod("Last 30 Days");
    setCategoryFilter("All Categories");
    setPage(1);
  };

  const filtered = allTransactions.filter((t) => {
    if (filter === "Income") return t.amount.startsWith("+");
    if (filter === "Expenses") return t.amount.startsWith("-");
    return true;
  }).filter((t) => {
    if (propertyFilter !== "All Properties") return t.property === propertyFilter;
    return true;
  }).filter((t) => {
    if (categoryFilter !== "All Categories") return t.category === categoryFilter;
    return true;
  });

  const handleTxSort = (key: "date" | "title" | "category" | "property" | "amount") => {
    if (txSortKey === key) {
      setTxSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setTxSortKey(key);
      setTxSortDir("desc");
    }
  };

  const sortedFiltered = txSortKey
    ? [...filtered].sort((a, b) => {
        let cmp = 0;
        switch (txSortKey) {
          case "date": cmp = new Date(a.date).getTime() - new Date(b.date).getTime(); break;
          case "title": cmp = a.title.localeCompare(b.title); break;
          case "category": cmp = a.category.localeCompare(b.category); break;
          case "property": cmp = a.property.localeCompare(b.property); break;
          case "amount": cmp = parseFloat(a.amount.replace(/[$,+]/g, "")) - parseFloat(b.amount.replace(/[$,+]/g, "")); break;
        }
        return txSortDir === "asc" ? cmp : -cmp;
      })
    : filtered;

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = sortedFiltered.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  const needsReview = allTransactions.filter((t) => t.highlight).length;

  if (loading) {
    return (
      <AppLayout>
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <SkeletonPulse className="w-48 h-8" />
              <SkeletonPulse className="w-36 h-4" />
            </div>
            <SkeletonPulse className="w-24 h-10 rounded-lg" />
          </div>
          <SkeletonPulse className="w-full h-12 rounded-xl" />
          <div className="flex items-center gap-3">
            <SkeletonPulse className="w-24 h-10 rounded-xl" />
            <SkeletonPulse className="w-16 h-8 rounded-full" />
            <SkeletonPulse className="w-16 h-8 rounded-full" />
            <SkeletonPulse className="w-20 h-8 rounded-full" />
          </div>
          <TableSkeleton rows={5} />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      {/* Page Header */}
      <PageHeader
        title="Transactions"
        subtitle="Last synced 12 minutes ago"
        actions={
          <Link href="/reports/exports" className="flex items-center gap-2 px-4 py-2 bg-white border border-outline-variant/30 rounded-lg text-sm font-medium text-on-surface hover:bg-surface-container-low transition-all shadow-sm">
            <span aria-hidden="true" className="material-symbols-outlined text-[18px]">download</span>
            Export
          </Link>
        }
      />

      {/* Alert Banner */}
      <AnimatePresence>
        {needsReview > 0 && !alertDismissed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ type: "spring", bounce: 0, duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="bg-amber-50 text-amber-800 p-4 rounded-xl flex items-center justify-between shadow-sm border border-amber-200/50">
              <div className="flex items-center gap-3">
                <span aria-hidden="true" className="material-symbols-outlined text-[20px]">warning</span>
                <span className="text-sm font-medium tracking-tight">
                  {needsReview} transaction{needsReview > 1 ? "s" : ""} need{needsReview === 1 ? "s" : ""} review — AI couldn&apos;t confidently categorize {needsReview === 1 ? "this item" : "these items"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href="/transactions/ai-review"
                  className="bg-white/80 hover:bg-white px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all shadow-sm"
                >
                  Review Now
                </Link>
                <button
                  onClick={() => setAlertDismissed(true)}
                  className="p-1 rounded-lg hover:bg-amber-100 transition-colors"
                  aria-label="Dismiss alert"
                >
                  <span aria-hidden="true" className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filters — single consolidated row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex gap-2">
            {(["All", "Income", "Expenses"] as const).map((f) => (
              <button
                key={f}
                onClick={() => { setFilter(f); setPage(1); }}
                className={`px-3 py-1.5 text-xs font-bold rounded-full transition-all ${
                  filter === f
                    ? "bg-primary/5 text-primary border border-primary/10"
                    : "text-on-surface-variant font-semibold hover:bg-surface-container-high cursor-pointer"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          {hasActiveFilters && (
            <>
              <div className="h-6 w-px bg-outline-variant/30" />
              <button
                onClick={resetAllFilters}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50 rounded-full transition-all"
              >
                <span aria-hidden="true" className="material-symbols-outlined text-[14px]">close</span>
                Reset All
              </button>
            </>
          )}
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {/* Date range picker */}
          <div className="relative">
            <select
              value={timePeriod}
              onChange={(e) => setTimePeriod(e.target.value)}
              aria-label="Date range"
              className="appearance-none bg-surface-container-lowest border border-outline-variant/20 rounded-xl px-4 py-2 pr-9 text-xs font-semibold focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer"
            >
              {timePeriods.map((tp) => (
                <option key={tp}>{tp}</option>
              ))}
            </select>
            <span aria-hidden="true" className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-outline text-[16px]">expand_more</span>
          </div>
          {/* Property filter */}
          <div className="relative">
            <select
              value={propertyFilter}
              onChange={(e) => { setPropertyFilter(e.target.value); setPage(1); }}
              aria-label="Property filter"
              className="appearance-none bg-surface-container-lowest border border-outline-variant/20 rounded-xl px-4 py-2 pr-9 text-xs font-semibold focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer"
            >
              {propertyOptions.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
            <span aria-hidden="true" className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-outline text-[16px]">expand_more</span>
          </div>
        </div>
      </div>

      {/* Transaction Table */}
      <div className="bg-surface-container-lowest rounded-2xl card-shadow overflow-hidden border border-outline-variant/10">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low/50">
              {([
                { key: "date" as const, label: "Date", align: "" },
                { key: "title" as const, label: "Description", align: "" },
                { key: "category" as const, label: "Category", align: "text-center" },
                { key: "property" as const, label: "Property", align: "" },
                { key: "amount" as const, label: "Amount", align: "text-right" },
              ]).map((col) => (
                <th
                  key={col.label}
                  className={`px-8 py-5 text-[11px] font-bold text-on-surface-variant uppercase tracking-widest ${col.align} ${col.key ? "cursor-pointer hover:text-primary transition-colors select-none" : ""}`}
                  onClick={() => col.key && handleTxSort(col.key)}
                >
                  <span className={`inline-flex items-center gap-1 ${col.align === "text-right" ? "justify-end w-full" : col.align === "text-center" ? "justify-center w-full" : ""}`}>
                    {col.label}
                    {txSortKey === col.key && (
                      <span aria-hidden="true" className="material-symbols-outlined text-[14px] text-primary">
                        {txSortDir === "asc" ? "arrow_upward" : "arrow_downward"}
                      </span>
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-surface">
            {paginated.map((t, i) => (
              <tr
                key={i}
                onClick={() => { setSelectedTransaction(t); setShowRecategorize(false); setTempCategory(null); }}
                className={`hover:bg-surface-container-low/50 transition-all cursor-pointer group ${
                  t.highlight ? "bg-amber-50/40 border-l-3 border-amber-400" : ""
                }`}
              >
                <td className="px-8 py-5 text-sm text-on-surface-variant font-medium">
                  {t.date}
                </td>
                <td className="px-8 py-5">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors">
                      {t.title}
                    </span>
                    <span className="text-[11px] text-on-surface-variant">
                      {t.subtitle}
                    </span>
                  </div>
                </td>
                <td className="px-8 py-5 text-center">
                  <span
                    className={`px-3 py-1 ${t.catClass} text-[11px] font-bold rounded-full uppercase tracking-wide inline-flex items-center gap-1.5`}
                  >
                    {t.icon ? (
                      <span aria-hidden="true" className="material-symbols-outlined text-[14px]">
                        {t.icon}
                      </span>
                    ) : (
                      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
                    )}
                    {t.category}
                  </span>
                </td>
                <td className="px-8 py-5 text-sm text-on-surface-variant font-medium">
                  {t.property}
                </td>
                <td
                  className={`px-8 py-5 text-right font-bold text-sm ${t.amountClass}`}
                  style={{ fontFamily: "'Manrope', sans-serif" }}
                >
                  {t.amount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="px-8 py-6 bg-surface-container-low/30 flex items-center justify-between border-t border-surface">
          <div className="flex items-center gap-4">
            <span className="text-xs font-medium text-on-surface-variant">
              Showing <span className="text-on-surface font-bold">{(page - 1) * itemsPerPage + 1}-{Math.min(page * itemsPerPage, filtered.length)}</span> of {filtered.length}
            </span>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-on-surface-variant">Show</span>
              <select
                aria-label="Transactions per page"
                value={itemsPerPage}
                onChange={(e) => { setItemsPerPage(Number(e.target.value)); setPage(1); }}
                className="bg-surface-container-lowest border border-outline-variant/20 rounded-lg px-2 py-1 text-xs font-bold text-on-surface appearance-none cursor-pointer focus:ring-2 focus:ring-primary/20 outline-none"
              >
                {PAGE_SIZE_OPTIONS.map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              aria-label="Previous page"
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="p-2 rounded-lg hover:bg-surface-container-high text-on-surface-variant transition-all disabled:opacity-30"
            >
              <span aria-hidden="true" className="material-symbols-outlined text-[20px]">chevron_left</span>
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                    page === p
                      ? "bg-primary text-white shadow-md shadow-primary/20"
                      : "text-on-surface hover:bg-surface-container-high"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
            <button
              aria-label="Next page"
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="p-2 rounded-lg hover:bg-surface-container-high text-on-surface-variant transition-all disabled:opacity-30"
            >
              <span aria-hidden="true" className="material-symbols-outlined text-[20px]">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      {/* Contextual Insight */}
      <div className="bg-gradient-to-br from-primary to-primary-container p-6 rounded-2xl shadow-xl shadow-primary/10 relative overflow-hidden group">
        <div className="absolute -right-4 -bottom-4 opacity-10 scale-150 group-hover:rotate-12 transition-transform duration-700">
          <span
            aria-hidden="true" className="material-symbols-outlined text-[140px] text-white"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            insights
          </span>
        </div>
        <div className="relative z-10 flex flex-col justify-between h-full">
          <div>
            <span className="text-[11px] font-bold text-white/60 tracking-widest uppercase">
              Smart Categorization
            </span>
            <h3 className="text-xl font-extrabold text-white mt-2 leading-tight">
              AI has automatically classified 92% of your transactions this month.
            </h3>
          </div>
          <div className="mt-8">
            <Link href="/transactions/ai-review" className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 px-4 py-2 rounded-lg text-xs font-bold text-white transition-all inline-block">
              Optimization Report
            </Link>
          </div>
        </div>
      </div>
      {/* Transaction Detail Modal */}
      {selectedTransaction && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={() => setSelectedTransaction(null)}
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div
            className="relative bg-surface-container-lowest rounded-2xl shadow-2xl p-8 w-full max-w-lg mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedTransaction(null)}
              className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full bg-surface-container-low text-on-surface-variant hover:bg-error hover:text-white transition-all"
            >
              <span aria-hidden="true" className="material-symbols-outlined text-[18px]">close</span>
            </button>

            <div className="flex items-center gap-4 mb-6">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${selectedTransaction.amount.startsWith("+") ? "bg-emerald-100" : "bg-surface-container-high"}`}>
                <span aria-hidden="true" className={`material-symbols-outlined text-xl ${selectedTransaction.amount.startsWith("+") ? "text-emerald-700" : "text-on-surface-variant"}`}>
                  {selectedTransaction.amount.startsWith("+") ? "arrow_downward" : "arrow_upward"}
                </span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-on-surface">{selectedTransaction.title}</h3>
                <p className="text-sm text-on-surface-variant">{selectedTransaction.subtitle}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-surface">
                <span className="text-sm text-on-surface-variant font-medium">Amount</span>
                <span className={`text-lg font-bold ${selectedTransaction.amountClass}`} style={{ fontFamily: "'Manrope', sans-serif" }}>
                  {selectedTransaction.amount}
                </span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-surface">
                <span className="text-sm text-on-surface-variant font-medium">Date</span>
                <span className="text-sm font-semibold text-on-surface">{selectedTransaction.date}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-surface">
                <span className="text-sm text-on-surface-variant font-medium">Category</span>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 ${tempCategory?.catClass ?? selectedTransaction.catClass} text-[11px] font-bold rounded-full uppercase tracking-wide`}>
                    {tempCategory?.label ?? selectedTransaction.category}
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

              {/* Inline Recategorize */}
              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${showRecategorize ? "max-h-[200px] opacity-100" : "max-h-0 opacity-0"}`}>
                <div className="pb-3 border-b border-surface">
                  <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Reassign Category</p>
                  <div className="flex flex-wrap gap-1.5">
                    {categoryOptions.map((opt) => {
                      const active = (tempCategory?.label ?? selectedTransaction.category) === opt.label;
                      return (
                        <button
                          key={opt.label}
                          onClick={() => { setTempCategory({ label: opt.label, catClass: opt.catClass }); setShowRecategorize(false); }}
                          className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${active ? "ring-2 ring-primary ring-offset-1 " + opt.catClass : opt.catClass + " hover:ring-1 hover:ring-primary/30"}`}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center py-3 border-b border-surface">
                <span className="text-sm text-on-surface-variant font-medium">Property</span>
                <span className="text-sm font-semibold text-on-surface">{selectedTransaction.property}</span>
              </div>
            </div>

            {selectedTransaction.highlight && !tempCategory && (
              <div className="mt-6 bg-amber-50 border border-amber-200/50 rounded-xl p-4 flex items-start gap-3">
                <span aria-hidden="true" className="material-symbols-outlined text-amber-600 text-xl">psychology</span>
                <div>
                  <p className="text-sm font-bold text-amber-800">Needs Review</p>
                  <p className="text-xs text-amber-700 mt-0.5">AI couldn&apos;t confidently categorize this transaction. Use the edit button above to assign a category.</p>
                </div>
              </div>
            )}

            {tempCategory && (
              <div className="mt-6 bg-emerald-50 border border-emerald-200/50 rounded-xl p-4 flex items-start gap-3">
                <span aria-hidden="true" className="material-symbols-outlined text-emerald-700 text-xl">check_circle</span>
                <div>
                  <p className="text-sm font-bold text-emerald-800">Recategorized</p>
                  <p className="text-xs text-emerald-700 mt-0.5">Changed to &quot;{tempCategory.label}&quot;. Save on the detail page to persist.</p>
                </div>
              </div>
            )}

            <div className="mt-8 flex justify-between items-center">
              <Link
                href={`/transactions/${selectedTransaction.id}`}
                className="flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
              >
                <span aria-hidden="true" className="material-symbols-outlined text-[16px]">open_in_new</span>
                View Full Details
              </Link>
              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedTransaction(null)}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold text-on-surface-variant hover:bg-surface-container-low transition-all"
                >
                  Close
                </button>
                {selectedTransaction.highlight && !tempCategory && (
                  <Link
                    href="/transactions/ai-review"
                    className="px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-bold shadow-md shadow-primary/20 hover:opacity-90 transition-all"
                  >
                    AI Review
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}

export default function TransactionsPage() {
  return (
    <Suspense>
      <TransactionsContent />
    </Suspense>
  );
}
