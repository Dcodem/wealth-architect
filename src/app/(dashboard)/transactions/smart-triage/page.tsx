"use client";

import AppLayout from "@/components/AppLayout";
import PageHeader from "@/components/PageHeader";
import { useState } from "react";
import { initialCards as defaultCards, type ReviewCard } from "@/lib/data/triage-cards";

const categories = [
  "Maintenance",
  "Hospitality",
  "Estate Staff",
  "Art & Antiques",
  "Insurance",
  "Capital Improvement",
  "Groundskeeping",
  "Estate Management",
  "Security",
  "Utilities",
];

const properties = [
  "Main St. Loft",
  "Oak Ridge Estate",
  "Downtown Plaza",
];

const tabs = ["All", "High Confidence", "Medium", "Low"];
const PER_PAGE = 3;

type DismissDirection = "right" | "left";

interface DismissingState {
  id: number;
  direction: DismissDirection;
}

interface ResolvedItem {
  card: ReviewCard;
  action: "accepted" | "skipped";
}

export default function TransactionReviewPage() {
  const [activeTab, setActiveTab] = useState("All");
  const [cards, setCards] = useState<ReviewCard[]>(defaultCards);
  const [resolved, setResolved] = useState<ResolvedItem[]>([]);
  const [dismissing, setDismissing] = useState<DismissingState | null>(null);
  const [activeId, setActiveId] = useState<number>(defaultCards[0].id);
  const [page, setPage] = useState(1);

  // Edit modal state (detail panel)
  const [editingCard, setEditingCard] = useState<ReviewCard | null>(null);
  const [editCategory, setEditCategory] = useState("");
  const [editProperty, setEditProperty] = useState("");

  const pendingCards = cards.filter(
    (c) => !resolved.find((r) => r.card.id === c.id)
  );

  const skippedCards = resolved
    .filter((r) => r.action === "skipped")
    .map((r) => r.card);

  const acceptedCards = resolved
    .filter((r) => r.action === "accepted")
    .map((r) => r.card);

  const filteredCards = pendingCards.filter((c) => {
    if (activeTab === "High Confidence") return c.confidence >= 85;
    if (activeTab === "Medium") return c.confidence >= 50 && c.confidence < 85;
    if (activeTab === "Low") return c.confidence < 50;
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filteredCards.length / PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const pageItems = filteredCards.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);

  const activeItem = pageItems.find((c) => c.id === activeId) ?? pageItems[0];

  const updateCard = (id: number, field: "suggestion" | "property", value: string) => {
    setCards((prev) => prev.map((c) => (c.id === id ? { ...c, [field]: value } : c)));
  };

  const handleAccept = (card: ReviewCard) => {
    setDismissing({ id: card.id, direction: "right" });
    setTimeout(() => {
      setResolved((prev) => [...prev, { card, action: "accepted" }]);
      setDismissing(null);
      const remaining = pendingCards.filter((p) => p.id !== card.id);
      if (remaining.length > 0) {
        setActiveId(remaining[0].id);
      }
    }, 300);
  };

  const handleSkip = (card: ReviewCard) => {
    setDismissing({ id: card.id, direction: "left" });
    setTimeout(() => {
      setResolved((prev) => [...prev, { card, action: "skipped" }]);
      setDismissing(null);
      const remaining = pendingCards.filter((p) => p.id !== card.id);
      if (remaining.length > 0) {
        setActiveId(remaining[0].id);
      }
    }, 300);
  };

  const handleUndo = (id: number) => {
    setResolved((prev) => prev.filter((r) => r.card.id !== id));
    setActiveId(id);
  };

  const handleReconsider = (card: ReviewCard) => {
    setResolved((prev) => prev.filter((r) => r.card.id !== card.id));
    setActiveId(card.id);
  };

  const openEditModal = (card: ReviewCard) => {
    setEditingCard(card);
    setEditCategory(card.suggestion);
    setEditProperty(card.property);
  };

  const closeEditModal = () => {
    setEditingCard(null);
    setEditCategory("");
    setEditProperty("");
  };

  const saveEdits = () => {
    if (!editingCard) return;
    setCards((prev) =>
      prev.map((c) =>
        c.id === editingCard.id
          ? { ...c, suggestion: editCategory, property: editProperty }
          : c
      )
    );
    closeEditModal();
  };

  const pendingCount = filteredCards.length - (dismissing ? 1 : 0);

  return (
    <AppLayout>
      <PageHeader
        title="Smart Triage"
        subtitle="AI-suggested categories and property assignments for review"
      />

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded-xl w-fit">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => { setActiveTab(t); setPage(1); }}
            className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === t
                ? "bg-white shadow-sm text-primary"
                : "text-on-surface-variant hover:bg-white/50 font-medium"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="flex gap-10 items-start">
        {/* LEFT: Review Queue */}
        <section className="flex-1 min-w-0 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-on-surface">Review Queue</h3>
            <span className="bg-primary-fixed text-on-primary-fixed-variant px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider">
              {pendingCount} Pending
            </span>
          </div>

          {filteredCards.length === 0 && pageItems.length === 0 && !dismissing && (
            <div className="text-center py-16 text-on-surface-variant">
              <span aria-hidden="true" className="material-symbols-outlined text-5xl mb-4 block opacity-30">
                task_alt
              </span>
              <p className="font-medium">All transactions reviewed!</p>
              <p className="text-sm mt-1 opacity-70">
                Check the resolved sections below for your decisions.
              </p>
            </div>
          )}

          {pageItems.map((c) => {
            const isDismissing = dismissing?.id === c.id;
            const direction = dismissing?.direction;
            const isActive = activeItem?.id === c.id && !isDismissing;

            return (
              <div
                key={c.id}
                onClick={() => !isDismissing && setActiveId(c.id)}
                className={`bg-surface-container-lowest rounded-2xl p-7 card-shadow cursor-pointer group transition-shadow ${
                  isActive
                    ? "border-l-4 border-primary ring-2 ring-primary/20 bg-primary/[0.02]"
                    : "opacity-70 hover:opacity-100 hover:ring-1 hover:ring-outline-variant"
                }`}
                style={{
                  transition:
                    "transform 300ms ease-in-out, opacity 300ms ease-in-out",
                  transform: isDismissing
                    ? direction === "right"
                      ? "translateX(120%)"
                      : "translateX(-120%)"
                    : "translateX(0)",
                  opacity: isDismissing ? 0 : 1,
                }}
              >
                {/* Top row: icon + info + amount */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center shrink-0">
                      <span aria-hidden="true" className="material-symbols-outlined text-primary text-xl">
                        {c.icon}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-on-surface">
                        {c.vendor}
                      </h4>
                      <span className="text-on-surface-variant text-sm font-medium">
                        {c.date}
                      </span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div
                      className="text-xl font-bold text-on-surface"
                      style={{ fontFamily: "'Manrope', sans-serif" }}
                    >
                      {c.amount}
                    </div>
                    <div className="text-[11px] text-on-surface-variant mt-0.5 font-semibold uppercase tracking-widest">
                      Amount
                    </div>
                  </div>
                </div>

                {/* AI Suggestion — inline editable category + property */}
                <div className="mt-5 bg-surface-container-low/40 rounded-xl p-4">
                  <div className="flex items-center gap-1.5 mb-3">
                    <span aria-hidden="true" className="material-symbols-outlined text-[14px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                    <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">AI Suggestion</span>
                    <div className={`flex items-center ${c.confBgClass} px-2 py-0.5 rounded-full ml-auto`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${c.confDotClass} mr-1`} />
                      <span className={`${c.confTextClass} text-[11px] font-bold`}>{c.confidence}%</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1 block">Category</label>
                      <div className="relative">
                        <select
                          aria-label="Category"
                          value={c.suggestion}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => { e.stopPropagation(); updateCard(c.id, "suggestion", e.target.value); }}
                          className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-lg py-2 pl-3 pr-8 text-[13px] font-bold text-on-surface appearance-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer transition-all"
                        >
                          {categories.map((cat) => (<option key={cat} value={cat}>{cat}</option>))}
                        </select>
                        <span aria-hidden="true" className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant text-[16px]">expand_more</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1 block">Property</label>
                      <div className="relative">
                        <select
                          aria-label="Property"
                          value={c.property}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => { e.stopPropagation(); updateCard(c.id, "property", e.target.value); }}
                          className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-lg py-2 pl-3 pr-8 text-[13px] font-bold text-on-surface appearance-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer transition-all"
                        >
                          {properties.map((prop) => (<option key={prop} value={prop}>{prop}</option>))}
                        </select>
                        <span aria-hidden="true" className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant text-[16px]">expand_more</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-2 mt-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSkip(c);
                    }}
                    className="px-5 py-2 rounded-full border border-outline-variant text-on-surface-variant font-bold text-xs hover:bg-error/10 hover:text-error hover:border-error/30 active:scale-95 transition-all"
                  >
                    Skip
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAccept(c);
                    }}
                    className="px-5 py-2 rounded-full bg-primary text-white font-bold text-xs shadow-md shadow-primary/20 hover:opacity-90 active:scale-95 transition-all"
                  >
                    Accept
                  </button>
                </div>
              </div>
            );
          })}

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

          {/* Skipped Items Section */}
          {skippedCards.length > 0 && (
            <div className="mt-10">
              <div className="flex items-center gap-2 mb-4">
                <span aria-hidden="true" className="material-symbols-outlined text-on-surface-variant text-xl">undo</span>
                <h2 className="text-base font-bold text-on-surface-variant uppercase tracking-wider">Skipped Items</h2>
                <span className="bg-surface-container-high text-on-surface-variant text-xs font-bold px-2.5 py-0.5 rounded-full">{skippedCards.length}</span>
              </div>
              <div className="space-y-3">
                {skippedCards.map((c) => (
                  <div key={c.id} className="bg-surface-container-low/60 rounded-xl p-5 flex items-center justify-between border border-dashed border-outline-variant">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center opacity-60">
                        <span aria-hidden="true" className="material-symbols-outlined text-on-surface-variant text-lg">{c.icon}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-semibold text-on-surface-variant">{c.vendor}</h4>
                          <span className="text-on-surface-variant/60 text-xs">{c.date}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="bg-surface-container px-2.5 py-0.5 rounded-full text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">{c.suggestion}</span>
                          <span className="text-on-surface-variant/40 text-[11px]">&middot;</span>
                          <span className="text-on-surface-variant/60 text-[11px]">{c.property}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-base font-bold text-on-surface-variant" style={{ fontFamily: "'Manrope', sans-serif" }}>{c.amount}</span>
                      <button
                        onClick={() => handleReconsider(c)}
                        className="px-4 py-2 rounded-full border-2 border-primary text-primary font-bold text-xs hover:bg-primary hover:text-white active:scale-95 transition-all"
                      >
                        Reconsider
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recently Reviewed Section */}
          {acceptedCards.length > 0 && (
            <div className="mt-10">
              <div className="flex items-center gap-2 mb-4">
                <span aria-hidden="true" className="material-symbols-outlined text-on-surface-variant text-xl">checklist</span>
                <h2 className="text-base font-bold text-on-surface-variant uppercase tracking-wider">Recently Reviewed</h2>
                <span className="bg-surface-container-high text-on-surface-variant text-xs font-bold px-2.5 py-0.5 rounded-full">{acceptedCards.length}</span>
              </div>
              <div className="space-y-3">
                {acceptedCards.map((c) => (
                  <div key={c.id} className="bg-surface-container-low/60 rounded-xl p-5 flex items-center justify-between border border-dashed border-outline-variant">
                    <div className="flex items-center gap-4">
                      <div className="w-9 h-9 rounded-lg bg-success-container text-on-success-container flex items-center justify-center">
                        <span aria-hidden="true" className="material-symbols-outlined text-[18px]">check_circle</span>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-on-surface-variant">{c.vendor}</h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs font-bold text-on-success-container uppercase tracking-tight">Accepted</span>
                          <span className="text-on-surface-variant/40 text-xs">&middot;</span>
                          <span className="text-on-surface-variant/60 text-xs">{c.suggestion}</span>
                          <span className="text-on-surface-variant/40 text-xs">&middot;</span>
                          <span className="text-on-surface-variant/60 text-xs">{c.property}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-5">
                      <span className="text-base font-bold text-on-surface-variant" style={{ fontFamily: "'Manrope', sans-serif" }}>{c.amount}</span>
                      <button
                        onClick={() => handleUndo(c.id)}
                        className="px-4 py-2 rounded-lg border border-outline-variant text-on-surface-variant font-bold text-xs hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all"
                      >
                        Undo
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </section>

        {/* RIGHT: Transaction Detail Panel */}
        {activeItem &&
          !resolved.find((r) => r.card.id === activeItem.id) && (
            <aside className="w-[400px] sticky top-24 shrink-0">
              <div className="bg-surface-container-lowest p-8 rounded-xl card-shadow ring-1 ring-outline-variant">
                {/* Header */}
                <div className="text-center mb-8 pb-8 border-b border-surface">
                  <div className="w-14 h-14 bg-primary-fixed text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <span aria-hidden="true" className="material-symbols-outlined text-2xl">
                      {activeItem.icon}
                    </span>
                  </div>
                  <h3
                    className="text-xl font-extrabold text-on-surface"
                    style={{ fontFamily: "'Manrope', sans-serif" }}
                  >
                    {activeItem.vendor}
                  </h3>
                  <p className="text-[13px] font-medium text-on-surface-variant mt-1">
                    {activeItem.ref}
                  </p>
                </div>

                <div className="space-y-6">
                  {/* Detail Grid */}
                  <div className="grid grid-cols-2 gap-y-5">
                    <div>
                      <p className="text-[11px] uppercase tracking-widest text-on-surface-variant font-bold mb-1">Date</p>
                      <p className="text-sm font-semibold text-on-surface">{activeItem.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[11px] uppercase tracking-widest text-on-surface-variant font-bold mb-1">Amount</p>
                      <p className="text-lg font-extrabold text-on-surface" style={{ fontFamily: "'Manrope', sans-serif" }}>{activeItem.amount}</p>
                    </div>
                    <div>
                      <p className="text-[11px] uppercase tracking-widest text-on-surface-variant font-bold mb-1">Source</p>
                      <p className="text-sm font-semibold text-on-surface">{activeItem.source}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[11px] uppercase tracking-widest text-on-surface-variant font-bold mb-1">Location</p>
                      <p className="text-sm font-semibold text-on-surface">{activeItem.location}</p>
                    </div>
                  </div>

                  {/* Property + Category Assignment */}
                  <div className="pt-5 border-t border-surface">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-[11px] uppercase tracking-widest text-on-surface-variant font-bold">AI Assignment</p>
                      <button
                        onClick={() => openEditModal(activeItem)}
                        className="text-[11px] font-bold text-primary hover:underline flex items-center gap-1"
                      >
                        <span aria-hidden="true" className="material-symbols-outlined text-[14px]">edit</span>
                        Edit
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-surface-container-low p-3 rounded-xl">
                        <p className="text-[11px] text-on-surface-variant font-bold uppercase tracking-widest mb-1">Property</p>
                        <p className="text-[13px] font-bold text-on-surface flex items-center gap-1">
                          <span aria-hidden="true" className="material-symbols-outlined text-[14px] text-primary">location_on</span>
                          {activeItem.property}
                        </p>
                      </div>
                      <div className="bg-surface-container-low p-3 rounded-xl">
                        <p className="text-[11px] text-on-surface-variant font-bold uppercase tracking-widest mb-1">Category</p>
                        <p className="text-[13px] font-bold text-on-surface flex items-center gap-1">
                          <span aria-hidden="true" className="material-symbols-outlined text-[14px] text-primary">label</span>
                          {activeItem.suggestion}
                        </p>
                      </div>
                    </div>
                    <p className="text-[11px] text-on-surface-variant mt-2 flex items-center gap-1">
                      <span aria-hidden="true" className="material-symbols-outlined text-[12px]">auto_awesome</span>
                      Inferred from vendor history, payment source, and estate records
                    </p>
                  </div>

                  {/* AI Recommendation */}
                  <div className="pt-5 border-t border-surface">
                    <p className="text-[11px] uppercase tracking-widest text-on-surface-variant font-bold mb-3">AI Recommendation</p>
                    <div className="bg-surface-container-low p-4 rounded-xl border-l-2 border-primary-fixed-dim">
                      <p className="text-[13px] leading-relaxed text-on-surface">{activeItem.recommendation}</p>
                    </div>
                  </div>

                  {/* Similar Past Transactions */}
                  <div>
                    <p className="text-[11px] uppercase tracking-widest text-on-surface-variant font-bold mb-3">Similar Past Transactions</p>
                    <div className="space-y-2">
                      {activeItem.similarTransactions.map((s, i) => (
                        <div key={i} className="flex justify-between items-center py-2 px-3 bg-surface-container-low rounded-lg">
                          <div>
                            <p className="text-[12px] font-bold text-on-surface">{s.vendor}</p>
                            <p className="text-[11px] text-on-surface-variant">{s.date}</p>
                          </div>
                          <span className="text-[12px] font-bold text-on-surface" style={{ fontFamily: "'Manrope', sans-serif" }}>{s.amount}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-5 space-y-3">
                    <button
                      onClick={() => handleAccept(activeItem)}
                      className="w-full py-3 rounded-xl font-bold transition-all shadow-lg flex items-center justify-center gap-2 bg-primary hover:bg-primary-container text-white shadow-primary-fixed"
                    >
                      <span aria-hidden="true" className="material-symbols-outlined text-[20px]">check_circle</span>
                      Accept Transaction
                    </button>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => openEditModal(activeItem)}
                        className="py-3 rounded-xl font-bold text-[13px] transition-all bg-white border border-outline-variant text-on-surface hover:bg-surface-container-low"
                      >
                        Modify
                      </button>
                      <button
                        onClick={() => handleSkip(activeItem)}
                        className="py-3 rounded-xl font-bold text-[13px] transition-all bg-white border border-error/20 text-error hover:bg-rose-50"
                      >
                        Skip
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Help text */}
              <div className="mt-4 px-4 text-center">
                <p className="text-[11px] text-on-surface-variant">
                  Powered by The Wealth Architect AI
                </p>
              </div>
            </aside>
          )}
      </div>

      {/* Edit Modal */}
      {editingCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={closeEditModal}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div
            className="relative bg-surface-container-lowest rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeEditModal}
              className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full bg-surface-container-low text-on-surface-variant hover:bg-error hover:text-white transition-all"
            >
              <span aria-hidden="true" className="material-symbols-outlined text-[18px]">close</span>
            </button>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <span aria-hidden="true" className="material-symbols-outlined text-primary text-xl">edit</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-on-surface">Modify Transaction</h3>
                <p className="text-sm text-on-surface-variant">{editingCard.vendor} &middot; {editingCard.amount}</p>
              </div>
            </div>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-on-surface-variant mb-2">Category</label>
                <select
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-3 text-on-surface font-semibold text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all cursor-pointer"
                >
                  {categories.map((cat) => (<option key={cat} value={cat}>{cat}</option>))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-on-surface-variant mb-2">Property</label>
                <select
                  value={editProperty}
                  onChange={(e) => setEditProperty(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-3 text-on-surface font-semibold text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all cursor-pointer"
                >
                  {properties.map((prop) => (<option key={prop} value={prop}>{prop}</option>))}
                </select>
                <p className="text-[11px] text-on-surface-variant mt-2 flex items-center gap-1">
                  <span aria-hidden="true" className="material-symbols-outlined text-[14px]">auto_awesome</span>
                  AI assigned based on vendor history and estate records
                </p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 mt-8">
              <button
                onClick={closeEditModal}
                className="px-5 py-2.5 rounded-full text-on-surface-variant font-semibold text-sm hover:bg-surface-container-low transition-all"
              >
                Cancel
              </button>
              <button
                onClick={saveEdits}
                className="px-6 py-2.5 rounded-full bg-primary text-white font-bold text-sm shadow-md shadow-primary/20 hover:opacity-90 active:scale-95 transition-all"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
