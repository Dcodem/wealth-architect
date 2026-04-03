"use client";
import Link from "next/link";
import { useState, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const CATEGORIES = [
  "Capital Improvement", "Insurance", "Rental Income", "Utilities",
  "Office Supplies", "Contractor", "Maintenance", "Needs Review",
];

const PROPERTY_NAMES = ["Main St. Loft", "Oak Ridge Estate", "Downtown Plaza", "Unassigned"];

interface ReviewItem {
  id: string;
  description: string;
  amount: string;
  category: string;
  property: string;
}

const INITIAL_REVIEW_ITEMS: ReviewItem[] = [
  { id: "r1", description: "Stripe - Mktplace", amount: "-$1,102.55", category: "Office Supplies", property: "Downtown Plaza" },
  { id: "r2", description: "Unknown Wire Transfer", amount: "-$2,340.00", category: "Contractor", property: "Main St. Loft" },
  { id: "r3", description: "PayPal - Recurring", amount: "-$89.99", category: "Utilities", property: "Oak Ridge Estate" },
  { id: "r4", description: "ACH - PROP MGMT", amount: "-$450.00", category: "Maintenance", property: "Main St. Loft" },
  { id: "r5", description: "Square - Deposit Hold", amount: "+$1,800.00", category: "Rental Income", property: "Downtown Plaza" },
];

interface Property {
  name: string;
  location: string;
  units: string;
  type: string;
}

const INITIAL_PROPERTIES: Property[] = [
  { name: "Main St. Loft", location: "Downtown District", units: "6 units", type: "Residential" },
  { name: "Oak Ridge Estate", location: "North Highlands", units: "1 unit", type: "Residential" },
  { name: "Downtown Plaza", location: "Business District", units: "4 units", type: "Commercial" },
];

type ActivePanel = null | "properties" | "review";

export default function OnboardingStep4() {
  return (
    <Suspense fallback={null}>
      <OnboardingStep4Inner />
    </Suspense>
  );
}

function OnboardingStep4Inner() {
  const searchParams = useSearchParams();
  const isEmpty = searchParams.get("empty") === "1";

  const [activePanel, setActivePanel] = useState<ActivePanel>(null);
  const [confirmedProperties, setConfirmedProperties] = useState(false);
  const [reviewItems, setReviewItems] = useState<ReviewItem[]>(isEmpty ? [] : INITIAL_REVIEW_ITEMS);
  const [trainedItems, setTrainedItems] = useState<string[]>([]);
  const [skippedTraining, setSkippedTraining] = useState(false);
  const [properties, setProperties] = useState<Property[]>(isEmpty ? [] : INITIAL_PROPERTIES);
  const [showAddProperty, setShowAddProperty] = useState(false);
  const [newPropName, setNewPropName] = useState("");
  const [newPropLocation, setNewPropLocation] = useState("");
  const [newPropType, setNewPropType] = useState("Residential");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedDoc, setUploadedDoc] = useState<string | null>(null);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);

  const hasData = properties.length > 0 || reviewItems.length > 0;
  const reviewDone = skippedTraining || trainedItems.length === reviewItems.length;
  const allConfirmed = hasData ? (confirmedProperties && reviewDone) : true;
  const pendingReviewItems = reviewItems.filter((item) => !trainedItems.includes(item.id));
  const safeReviewIndex = Math.min(currentReviewIndex, Math.max(0, pendingReviewItems.length - 1));

  const togglePanel = (panel: ActivePanel) => {
    setActivePanel(activePanel === panel ? null : panel);
  };

  const handleConfirmProperties = () => {
    setConfirmedProperties(true);
    setActivePanel(null);
  };

  const handleUnconfirmProperties = () => {
    setConfirmedProperties(false);
    setActivePanel("properties");
  };

  const handleTrainItem = (id: string) => {
    setTrainedItems((prev) => [...prev, id]);
  };

  const handleTrainLater = () => {
    setSkippedTraining(true);
    setActivePanel(null);
  };

  const handleReviewUndo = () => {
    setSkippedTraining(false);
    setTrainedItems([]);
    setCurrentReviewIndex(0);
    setActivePanel("review");
  };

  const updateItemCategory = (id: string, category: string) => {
    setReviewItems((prev) => prev.map((item) => item.id === id ? { ...item, category } : item));
  };

  const updateItemProperty = (id: string, property: string) => {
    setReviewItems((prev) => prev.map((item) => item.id === id ? { ...item, property } : item));
  };

  const handleAddProperty = () => {
    if (!newPropName.trim()) return;
    setProperties((prev) => [...prev, {
      name: newPropName.trim(),
      location: newPropLocation.trim() || "Location TBD",
      units: "—",
      type: newPropType,
    }]);
    setNewPropName("");
    setNewPropLocation("");
    setNewPropType("Residential");
    setShowAddProperty(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedDoc(file.name);
      setTimeout(() => setUploadedDoc(null), 3000);
    }
  };

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col items-center px-4 py-12">
      <div className="w-full max-w-3xl">
        <div className="bg-surface-container-lowest rounded-xl shadow-[0_12px_32px_rgba(20,27,43,0.04)] overflow-visible relative border border-outline-variant/10">
          <div
            className="absolute top-0 left-0 w-64 h-64 -ml-32 -mt-32 rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(15, 118, 110, 0.1) 0%, rgba(15, 118, 110, 0) 70%)" }}
          />

          <div className="p-8 md:p-12 relative z-10">
            {/* Step Indicator */}
            <div className="flex items-center justify-center mb-6">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold bg-primary text-white">1</div>
                <div className="w-10 h-1 rounded-full bg-primary/40" />
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold bg-primary text-white">2</div>
                <div className="w-10 h-1 rounded-full bg-primary/40" />
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold bg-primary text-white">3</div>
                <div className="w-10 h-1 rounded-full bg-primary/40" />
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold bg-primary/40 text-primary">4</div>
              </div>
            </div>

            {/* Back + Logo */}
            <div className="flex items-center justify-between mb-8">
              <Link
                href="/onboarding/step-3"
                className="flex items-center gap-1 text-xs font-semibold text-on-surface-variant hover:text-primary transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                Back
              </Link>
              <span className="text-lg font-extrabold tracking-tight text-primary">
                The Wealth Architect
              </span>
              <div className="w-14" />
            </div>

            {/* Title */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary-fixed/30 rounded-full mb-5">
                <span aria-hidden="true" className="material-symbols-outlined text-primary text-sm">verified</span>
                <span className="text-xs font-bold text-primary uppercase tracking-widest">Final Step</span>
              </div>
              <h1 className="font-bold text-3xl text-on-surface tracking-tight mb-3">
                {hasData ? "Review & Confirm" : "Get Started"}
              </h1>
              <p className="text-on-surface-variant text-sm max-w-lg mx-auto">
                {hasData
                  ? "We\u2019ve finished analyzing your data. Confirm the details below to finalize your portfolio."
                  : "No documents have been uploaded yet. You can add them now or anytime from Settings."}
              </p>
            </div>

            {/* Upload doc toast */}
            <AnimatePresence>
              {uploadedDoc && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 bg-primary-container text-on-primary-container text-sm font-semibold rounded-xl shadow-lg shadow-primary/20"
                >
                  <span className="material-symbols-outlined text-[16px]">upload_file</span>
                  {uploadedDoc} queued for processing
                </motion.div>
              )}
            </AnimatePresence>
            <input ref={fileInputRef} type="file" accept=".pdf,.csv,.xlsx,.xls" className="hidden" onChange={handleFileUpload} />

            {hasData ? (
              <>
                {/* AI Summary */}
                <div className="flex items-start gap-4 p-5 bg-gradient-to-r from-primary-fixed/20 to-transparent rounded-xl border border-primary/10 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-primary-fixed-dim flex items-center justify-center shrink-0 mt-0.5">
                    <span aria-hidden="true" className="material-symbols-outlined text-primary text-[20px]">auto_awesome</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-on-surface mb-1">AI Analysis Summary</p>
                    <p className="text-xs text-on-surface-variant leading-relaxed">
                      We analyzed <strong className="text-on-surface">127 transactions</strong> across{" "}
                      <strong className="text-on-surface">{properties.length} properties</strong> and identified{" "}
                      <strong className="text-on-surface">8 expense categories</strong> to track.
                      88% were auto-categorized — {pendingReviewItems.length > 0
                        ? <>{pendingReviewItems.length} items need your review below.</>
                        : <>all items have been reviewed.</>
                      }
                    </p>
                  </div>
                </div>

                {/* Summary Cards — Properties + Review */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                  {/* Properties Card */}
                  <button
                    onClick={() => confirmedProperties ? handleUnconfirmProperties() : togglePanel("properties")}
                    className={`text-left p-5 rounded-xl border transition-all ${
                      confirmedProperties
                        ? "bg-success-container/50 border-success-border hover:border-success"
                        : activePanel === "properties"
                        ? "bg-primary-fixed/20 border-primary/30 shadow-md"
                        : "bg-surface-container-low border-outline-variant/10 hover:border-primary/20 hover:shadow-sm"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                        confirmedProperties ? "bg-success-container" : "bg-primary-fixed-dim"
                      }`}>
                        <span aria-hidden="true" className={`material-symbols-outlined text-[20px] ${
                          confirmedProperties ? "text-on-success-container" : "text-primary"
                        }`} style={confirmedProperties ? { fontVariationSettings: "'FILL' 1" } : undefined}>
                          {confirmedProperties ? "check_circle" : "domain"}
                        </span>
                      </div>
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${
                        confirmedProperties ? "text-on-success-container" : "text-primary"
                      }`}>
                        {confirmedProperties ? "Confirmed" : "Detected"}
                      </span>
                    </div>
                    <p className="text-base font-bold text-on-surface">{properties.length} Properties</p>
                    <p className="text-[11px] text-on-surface-variant mt-0.5">Residential &amp; Commercial</p>
                    {confirmedProperties && (
                      <p className="text-[10px] text-primary font-semibold mt-1">Click to edit</p>
                    )}
                  </button>

                  {/* Review Items Card */}
                  <button
                    onClick={() => reviewDone ? handleReviewUndo() : togglePanel("review")}
                    className={`text-left p-5 rounded-xl border transition-all ${
                      reviewDone
                        ? "bg-success-container/50 border-success-border hover:border-success"
                        : activePanel === "review"
                        ? "bg-amber-50/50 border-amber-300 shadow-md"
                        : "bg-surface-container-low border-outline-variant/10 hover:border-amber-200 hover:shadow-sm"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                        reviewDone ? "bg-success-container" : "bg-amber-100"
                      }`}>
                        <span aria-hidden="true" className={`material-symbols-outlined text-[20px] ${
                          reviewDone ? "text-on-success-container" : "text-amber-700"
                        }`} style={reviewDone ? { fontVariationSettings: "'FILL' 1" } : undefined}>
                          {reviewDone ? "check_circle" : "priority_high"}
                        </span>
                      </div>
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${
                        reviewDone ? "text-on-success-container" : "text-amber-700"
                      }`}>
                        {reviewDone ? "Done" : trainedItems.length > 0 ? `${trainedItems.length}/${reviewItems.length}` : "Needs Review"}
                      </span>
                    </div>
                    <p className="text-base font-bold text-on-surface">
                      {reviewDone ? "0" : reviewItems.length - trainedItems.length} Items
                    </p>
                    <p className="text-[11px] text-on-surface-variant mt-0.5">Uncategorized expenses</p>
                    {reviewDone && (
                      <p className="text-[10px] text-primary font-semibold mt-1">Click to re-review</p>
                    )}
                  </button>
                </div>

                {/* Expandable Panels */}
                <AnimatePresence mode="wait">
                  {/* Properties Panel */}
                  {activePanel === "properties" && (
                    <motion.div
                      key="properties"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-5 bg-surface-container-low rounded-xl border border-outline-variant/10 mb-6">
                        <div className="mb-4">
                          <h3 className="font-bold text-on-surface text-sm mb-0.5">Detected Properties</h3>
                          <p className="text-xs text-on-surface-variant mb-3">We detected {properties.length} properties from your accounts. Confirm, add missing ones, or upload more documents.</p>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setShowAddProperty(!showAddProperty)}
                              className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-primary hover:bg-primary/5 rounded-lg transition-colors border border-primary/20"
                            >
                              <span className="material-symbols-outlined text-[14px]">add</span>
                              Add Property
                            </button>
                            <button
                              onClick={() => fileInputRef.current?.click()}
                              className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-on-surface-variant hover:bg-surface-container-highest rounded-lg transition-colors border border-outline-variant/20"
                            >
                              <span className="material-symbols-outlined text-[14px]">upload_file</span>
                              Upload Document
                            </button>
                          </div>
                        </div>

                        <AnimatePresence>
                          {showAddProperty && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="mb-4 p-4 bg-primary-fixed/20 rounded-xl border border-primary-fixed/30">
                                <div className="grid grid-cols-2 gap-3 mb-3">
                                  <input autoFocus type="text" placeholder="Property name" value={newPropName} onChange={(e) => setNewPropName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleAddProperty()} className="bg-surface-container-highest border-none rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary/40" />
                                  <input type="text" placeholder="Location" value={newPropLocation} onChange={(e) => setNewPropLocation(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleAddProperty()} className="bg-surface-container-highest border-none rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary/40" />
                                </div>
                                <div className="flex items-center gap-2">
                                  <select value={newPropType} onChange={(e) => setNewPropType(e.target.value)} className="bg-surface-container-highest border-none rounded-lg px-3 py-2 text-xs font-semibold outline-none">
                                    <option>Residential</option>
                                    <option>Commercial</option>
                                    <option>Mixed-Use</option>
                                  </select>
                                  <div className="flex-1" />
                                  <button onClick={() => setShowAddProperty(false)} className="px-3 py-1.5 text-xs font-semibold text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-colors">Cancel</button>
                                  <button onClick={handleAddProperty} disabled={!newPropName.trim()} className="px-3 py-1.5 bg-primary text-white text-xs font-bold rounded-lg disabled:opacity-40 hover:bg-primary/90 transition-colors">Add</button>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        <div className="space-y-2 mb-4">
                          {properties.map((p) => (
                            <div key={p.name} className="flex items-center gap-3 p-3 bg-surface-container-lowest rounded-xl">
                              <div className="w-9 h-9 rounded-lg bg-surface-container-high flex items-center justify-center shrink-0">
                                <span aria-hidden="true" className="material-symbols-outlined text-on-surface-variant text-[18px]">domain</span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-on-surface">{p.name}</p>
                                <p className="text-[10px] text-on-surface-variant">{p.location} &middot; {p.units}</p>
                              </div>
                              <span className="px-2 py-0.5 bg-surface-container-high text-on-surface-variant text-[9px] font-bold rounded-full uppercase tracking-wider">{p.type}</span>
                              <span aria-hidden="true" className="material-symbols-outlined text-on-success-container text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                            </div>
                          ))}
                        </div>
                        <button onClick={handleConfirmProperties} className="w-full py-2.5 bg-gradient-to-br from-primary to-primary-container text-white font-bold rounded-xl text-sm shadow-lg shadow-primary/20 hover:scale-[1.01] transition-all">
                          Confirm {properties.length} Properties
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* Review Panel — Paginated */}
                  {activePanel === "review" && (
                    <motion.div
                      key="review"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-5 bg-surface-container-low rounded-xl border border-outline-variant/10 mb-6">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="font-bold text-on-surface text-sm mb-0.5">Train the AI</h3>
                            <p className="text-xs text-on-surface-variant">
                              Change the category or property, then accept. This trains the model.
                            </p>
                          </div>
                          <button onClick={handleTrainLater} className="px-3 py-1.5 border border-outline-variant/30 rounded-lg text-xs font-bold text-on-surface-variant hover:bg-surface-container-highest transition-colors shrink-0">
                            Train Later
                          </button>
                        </div>

                        {pendingReviewItems.length > 0 && (
                          <>
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-[11px] font-bold text-on-surface-variant">
                                Item {safeReviewIndex + 1} of {pendingReviewItems.length}
                              </span>
                              <div className="flex items-center gap-1">
                                {pendingReviewItems.map((_, i) => (
                                  <button
                                    key={i}
                                    onClick={() => setCurrentReviewIndex(i)}
                                    className={`h-2 rounded-full transition-all ${
                                      i === safeReviewIndex ? "bg-primary w-4" : "bg-surface-container-high hover:bg-on-surface-variant/30 w-2"
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>

                            <AnimatePresence mode="wait">
                              <motion.div
                                key={pendingReviewItems[safeReviewIndex].id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.2 }}
                                className="p-4 bg-surface-container-lowest rounded-xl border border-outline-variant/10"
                              >
                                <div className="flex items-center gap-3 mb-3">
                                  <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                                    <span aria-hidden="true" className="material-symbols-outlined text-amber-700 text-[16px]">help</span>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-on-surface truncate">{pendingReviewItems[safeReviewIndex].description}</p>
                                    <p className="text-[11px] text-on-surface-variant font-medium">{pendingReviewItems[safeReviewIndex].amount}</p>
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3 mb-3">
                                  <div>
                                    <label className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest mb-1 block">Category</label>
                                    <select
                                      value={pendingReviewItems[safeReviewIndex].category}
                                      onChange={(e) => updateItemCategory(pendingReviewItems[safeReviewIndex].id, e.target.value)}
                                      className="w-full bg-surface-container-high border border-outline-variant/20 rounded-lg px-3 py-2 text-xs font-semibold outline-none focus:ring-1 focus:ring-primary/40 focus:border-primary/30 cursor-pointer"
                                    >
                                      {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                  </div>
                                  <div>
                                    <label className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest mb-1 block">Property</label>
                                    <select
                                      value={pendingReviewItems[safeReviewIndex].property}
                                      onChange={(e) => updateItemProperty(pendingReviewItems[safeReviewIndex].id, e.target.value)}
                                      className="w-full bg-surface-container-high border border-outline-variant/20 rounded-lg px-3 py-2 text-xs font-semibold outline-none focus:ring-1 focus:ring-primary/40 focus:border-primary/30 cursor-pointer"
                                    >
                                      {PROPERTY_NAMES.map((p) => <option key={p} value={p}>{p}</option>)}
                                    </select>
                                  </div>
                                </div>
                                <button
                                  onClick={() => handleTrainItem(pendingReviewItems[safeReviewIndex].id)}
                                  className="w-full py-2 bg-gradient-to-br from-primary to-primary-container text-white text-xs font-bold rounded-lg shadow-sm shadow-primary/10 hover:scale-[1.01] transition-all flex items-center justify-center gap-1.5"
                                >
                                  <span className="material-symbols-outlined text-[14px]">check</span>
                                  Accept &amp; Train
                                </button>
                              </motion.div>
                            </AnimatePresence>

                            <div className="flex items-center justify-between mt-3">
                              <button
                                onClick={() => setCurrentReviewIndex(Math.max(0, safeReviewIndex - 1))}
                                disabled={safeReviewIndex === 0}
                                className="flex items-center gap-1 text-xs font-semibold text-on-surface-variant hover:text-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                              >
                                <span className="material-symbols-outlined text-[16px]">chevron_left</span>
                                Previous
                              </button>
                              <button
                                onClick={() => setCurrentReviewIndex(Math.min(pendingReviewItems.length - 1, safeReviewIndex + 1))}
                                disabled={safeReviewIndex >= pendingReviewItems.length - 1}
                                className="flex items-center gap-1 text-xs font-semibold text-on-surface-variant hover:text-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                              >
                                Next
                                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                              </button>
                            </div>

                            {trainedItems.length > 0 && (
                              <div className="mt-3 flex items-center gap-2">
                                <div className="flex-1 h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                                  <motion.div
                                    className="h-full bg-primary rounded-full"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(trainedItems.length / reviewItems.length) * 100}%` }}
                                  />
                                </div>
                                <span className="text-[10px] font-bold text-on-surface-variant">{trainedItems.length}/{reviewItems.length}</span>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Completion CTA */}
                <div className="flex flex-col items-center gap-3 pt-2">
                  {allConfirmed ? (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex flex-col items-center gap-3 w-full"
                    >
                      <div className="flex items-center gap-2 text-on-success-container">
                        <span aria-hidden="true" className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>task_alt</span>
                        <span className="text-sm font-bold">Everything looks good — you&apos;re all set!</span>
                      </div>
                      <Link
                        href="/"
                        className="w-full max-w-sm py-3 bg-gradient-to-br from-primary to-primary-container text-white font-bold rounded-xl text-sm shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all text-center"
                      >
                        Complete Onboarding
                      </Link>
                    </motion.div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <p className="text-xs text-on-surface-variant">Click each card to review and confirm</p>
                      <div className="flex items-center gap-3">
                        {confirmedProperties && (
                          <span className="flex items-center gap-1 text-[10px] font-bold text-on-success-container">
                            <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                            Properties
                          </span>
                        )}
                        {reviewDone && (
                          <span className="flex items-center gap-1 text-[10px] font-bold text-on-success-container">
                            <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                            Review
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              /* ===== EMPTY STATE — No documents uploaded ===== */
              <div className="text-center py-4">
                <div className="w-20 h-20 rounded-full bg-surface-container-high/50 flex items-center justify-center mx-auto mb-6">
                  <span aria-hidden="true" className="material-symbols-outlined text-on-surface-variant text-4xl">folder_open</span>
                </div>
                <h3 className="text-lg font-bold text-on-surface mb-2">No Data to Review</h3>
                <p className="text-sm text-on-surface-variant max-w-sm mx-auto mb-8">
                  You haven&apos;t uploaded any documents yet. You can connect bank accounts or upload files anytime from the Settings page.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-primary border border-primary/20 rounded-xl hover:bg-primary/5 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">upload_file</span>
                    Upload Documents
                  </button>
                  <Link
                    href="/settings/integrations"
                    className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-on-surface-variant border border-outline-variant/20 rounded-xl hover:bg-surface-container-high transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">account_balance</span>
                    Connect Bank Account
                  </Link>
                </div>

                <Link
                  href="/"
                  className="inline-block px-8 py-3 bg-gradient-to-br from-primary to-primary-container text-white font-bold rounded-xl text-sm shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all"
                >
                  Go to Dashboard
                </Link>
                <p className="text-[11px] text-on-surface-variant mt-3">
                  You can always upload documents later from Settings
                </p>
              </div>
            )}
          </div>

          <div className="h-1 w-full bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        </div>
      </div>

      {/* Background */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none overflow-hidden">
        <div className="absolute top-[10%] left-[5%] w-96 h-96 bg-primary/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[10%] right-[5%] w-[30rem] h-[30rem] bg-secondary/5 blur-[120px] rounded-full" />
      </div>
    </div>
  );
}
