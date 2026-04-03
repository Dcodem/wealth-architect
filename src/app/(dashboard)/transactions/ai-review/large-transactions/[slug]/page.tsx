"use client";

import { use } from "react";
import AppLayout from "@/components/AppLayout";
import PageHeader from "@/components/PageHeader";
import Link from "next/link";

interface LargeTransaction {
  slug: string;
  vendor: string;
  date: string;
  amount: string;
  method: string;
  property: string;
  category: string;
  icon: string;
  hasReceipt: boolean;
  receiptNote: string;
  bankAccount: string;
  reference: string;
  description: string;
  relatedTransactions: { vendor: string; date: string; amount: string }[];
}

const transactions: LargeTransaction[] = [
  {
    slug: "precision-architectural",
    vendor: "Precision Architectural Studio",
    date: "Oct 24, 2023",
    amount: "$8,245.00",
    method: "Bank Transfer",
    property: "Bel Air Estate",
    category: "Renovation",
    icon: "architecture",
    hasReceipt: true,
    receiptNote: "\u201CPhase 2 design fees for the master suite expansion.\u201D",
    bankAccount: "Chase Platinum (***8842)",
    reference: "#LT-2023-001",
    description: "Architectural design consultation and blueprint preparation for the Phase 2 master suite expansion at the Bel Air Estate. Includes structural engineering review and permit-ready drawings.",
    relatedTransactions: [
      { vendor: "Precision Architectural Studio", date: "Sep 15, 2023", amount: "$6,500.00" },
      { vendor: "Precision Architectural Studio", date: "Aug 10, 2023", amount: "$4,200.00" },
      { vendor: "Sterling Construction Group", date: "Oct 20, 2023", amount: "$24,800.00" },
    ],
  },
  {
    slug: "eden-landscaping",
    vendor: "Eden Landscaping Group",
    date: "Oct 22, 2023",
    amount: "$4,500.00",
    method: "Amex Platinum",
    property: "Malibu Coastal",
    category: "Maintenance",
    icon: "park",
    hasReceipt: false,
    receiptNote: "",
    bankAccount: "Amex Platinum (***7724)",
    reference: "#LT-2023-002",
    description: "Quarterly grounds maintenance including drought-resistant garden installation, irrigation system servicing, and coastal erosion prevention measures at the Malibu Coastal property.",
    relatedTransactions: [
      { vendor: "Eden Landscaping Group", date: "Jul 20, 2023", amount: "$4,500.00" },
      { vendor: "Eden Landscaping Group", date: "Apr 18, 2023", amount: "$4,200.00" },
      { vendor: "Malibu Pool & Spa Co.", date: "Oct 15, 2023", amount: "$1,200.00" },
    ],
  },
  {
    slug: "city-power-grid",
    vendor: "City Power & Grid",
    date: "Oct 20, 2023",
    amount: "$2,489.55",
    method: "Auto-Pay",
    property: "Aspen Lodge",
    category: "Utilities",
    icon: "electric_bolt",
    hasReceipt: true,
    receiptNote: "\u201CHigh seasonal consumption due to pool heating.\u201D",
    bankAccount: "Wells Fargo (***3391)",
    reference: "#LT-2023-003",
    description: "Monthly utility billing for the Aspen Lodge property. Elevated usage attributed to pool heating system operation during the fall shoulder season. Usage is 34% above the 12-month rolling average.",
    relatedTransactions: [
      { vendor: "City Power & Grid", date: "Sep 20, 2023", amount: "$1,890.00" },
      { vendor: "City Power & Grid", date: "Aug 20, 2023", amount: "$1,645.00" },
      { vendor: "Aspen Water District", date: "Oct 18, 2023", amount: "$312.50" },
    ],
  },
];

function getTransaction(slug: string): LargeTransaction | undefined {
  return transactions.find((t) => t.slug === slug);
}

export default function LargeTransactionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const txn = getTransaction(slug);

  if (!txn) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <span aria-hidden="true" className="material-symbols-outlined text-[48px] text-outline-variant">search_off</span>
          <h2 className="text-xl font-bold text-on-surface">Transaction not found</h2>
          <p className="text-sm text-on-surface-variant">This large transaction doesn&apos;t exist.</p>
          <Link href="/transactions/ai-review/large-transactions" className="mt-4 px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-bold shadow-md shadow-primary/20 hover:opacity-90 transition-all">
            Back to Large Transactions
          </Link>
        </div>
      </AppLayout>
    );
  }

  const isExpense = !txn.amount.startsWith("+");

  return (
    <AppLayout>
      <PageHeader
        title={txn.vendor}
        subtitle={txn.reference}

        badge={`> $1,000 THRESHOLD`}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Amount Header */}
          <div className="bg-surface-container-lowest rounded-2xl card-shadow border border-outline-variant/10 overflow-hidden">
            <div className="px-8 py-6 bg-gradient-to-r from-surface-container-low to-surface-container-high/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-surface-container-high">
                    <span aria-hidden="true" className="material-symbols-outlined text-2xl text-on-surface-variant">
                      {txn.icon}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                      Large Transaction
                    </p>
                    <p className="text-3xl font-extrabold mt-0.5 text-on-surface" style={{ fontFamily: "'Manrope', sans-serif" }}>
                      {txn.amount}
                    </p>
                  </div>
                </div>
                <span className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-100 text-orange-700">
                  Flagged
                </span>
              </div>
            </div>

            {/* Detail Rows */}
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
                  Payment Method
                </span>
                <span className="text-sm font-bold text-on-surface">{txn.method}</span>
              </div>
              <div className="flex justify-between items-center py-4">
                <span className="text-sm text-on-surface-variant font-medium flex items-center gap-2">
                  <span aria-hidden="true" className="material-symbols-outlined text-[18px]">credit_card</span>
                  Bank Account
                </span>
                <span className="text-sm font-bold text-on-surface">{txn.bankAccount}</span>
              </div>
              <div className="flex justify-between items-center py-4">
                <span className="text-sm text-on-surface-variant font-medium flex items-center gap-2">
                  <span aria-hidden="true" className="material-symbols-outlined text-[18px]">label</span>
                  Category
                </span>
                <span className="px-3 py-1 bg-secondary-fixed-dim/30 text-on-secondary-container text-[11px] font-bold rounded-full uppercase tracking-wide">
                  {txn.category}
                </span>
              </div>
              <div className="flex justify-between items-center py-4">
                <span className="text-sm text-on-surface-variant font-medium flex items-center gap-2">
                  <span aria-hidden="true" className="material-symbols-outlined text-[18px]">tag</span>
                  Reference
                </span>
                <span className="text-sm font-mono text-on-surface-variant">{txn.reference}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-surface-container-lowest rounded-2xl card-shadow border border-outline-variant/10 p-8">
            <h3 className="text-sm font-bold text-on-surface mb-4 flex items-center gap-2">
              <span aria-hidden="true" className="material-symbols-outlined text-[18px] text-on-surface-variant">description</span>
              Transaction Details
            </h3>
            <p className="text-sm text-on-surface-variant leading-relaxed">{txn.description}</p>
          </div>

          {/* Receipt Section */}
          <div className="bg-surface-container-lowest rounded-2xl card-shadow border border-outline-variant/10 p-8">
            <h3 className="text-sm font-bold text-on-surface mb-4 flex items-center gap-2">
              <span aria-hidden="true" className="material-symbols-outlined text-[18px] text-on-surface-variant">receipt</span>
              Receipt &amp; Documentation
            </h3>
            {txn.hasReceipt ? (
              <div className="flex items-start gap-4 p-4 bg-surface-container-low rounded-xl">
                <div className="w-20 h-24 bg-surface-container-high rounded-lg flex items-center justify-center text-outline-variant shrink-0">
                  <span aria-hidden="true" className="material-symbols-outlined text-[36px]">receipt_long</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-on-surface mb-1">Receipt attached</p>
                  <p className="text-xs text-on-surface-variant italic leading-relaxed">{txn.receiptNote}</p>
                  <div className="flex items-center gap-3 mt-3">
                    <button className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
                      <span aria-hidden="true" className="material-symbols-outlined text-[14px]">visibility</span>
                      View Receipt
                    </button>
                    <button className="text-xs font-bold text-on-surface-variant hover:text-primary flex items-center gap-1">
                      <span aria-hidden="true" className="material-symbols-outlined text-[14px]">download</span>
                      Download
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4 p-4 bg-red-50 border border-red-200/50 rounded-xl">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center shrink-0">
                  <span aria-hidden="true" className="material-symbols-outlined text-red-600 text-xl">warning</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-red-800">Receipt missing</p>
                  <p className="text-xs text-red-600 mt-0.5">No documentation has been uploaded for this transaction. Upload a receipt for audit compliance.</p>
                  <button className="mt-2 text-xs font-bold text-red-700 hover:underline flex items-center gap-1">
                    <span aria-hidden="true" className="material-symbols-outlined text-[14px]">upload</span>
                    Upload Receipt
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-surface-container-lowest rounded-2xl card-shadow border border-outline-variant/10 p-6">
            <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-4">Actions</h3>
            <div className="space-y-2">
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-white bg-emerald-600 shadow-md shadow-emerald-200 hover:bg-emerald-700 transition-all">
                <span aria-hidden="true" className="material-symbols-outlined text-[20px]">check_circle</span>
                Verify &amp; Approve
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-orange-600 bg-orange-50 hover:bg-orange-100 transition-all">
                <span aria-hidden="true" className="material-symbols-outlined text-[20px]">flag</span>
                Flag for Review
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-on-surface hover:bg-surface-container-low transition-all">
                <span aria-hidden="true" className="material-symbols-outlined text-[20px] text-primary">category</span>
                Recategorize
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-on-surface hover:bg-surface-container-low transition-all">
                <span aria-hidden="true" className="material-symbols-outlined text-[20px] text-primary">ios_share</span>
                Export to PDF
              </button>
            </div>
          </div>

          {/* Related Transactions */}
          <div className="bg-surface-container-lowest rounded-2xl card-shadow border border-outline-variant/10 p-6">
            <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-4">Related Transactions</h3>
            <div className="space-y-2">
              {txn.relatedTransactions.map((r, i) => (
                <div key={i} className="flex justify-between items-center py-2.5 px-3 bg-surface-container-low rounded-lg">
                  <div>
                    <p className="text-[12px] font-bold text-on-surface">{r.vendor}</p>
                    <p className="text-[11px] text-on-surface-variant">{r.date}</p>
                  </div>
                  <span className="text-[12px] font-bold text-on-surface" style={{ fontFamily: "'Manrope', sans-serif" }}>
                    {r.amount}
                  </span>
                </div>
              ))}
            </div>
          </div>

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
              <div className="flex gap-3">
                <div className="w-2 h-2 rounded-full bg-orange-500 mt-1.5 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-on-surface">Flagged as large transaction</p>
                  <p className="text-[11px] text-on-surface-variant mt-0.5">{txn.date} — exceeds $1,000 threshold</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-2 h-2 rounded-full bg-surface-container-high mt-1.5 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-on-surface">Pending verification</p>
                  <p className="text-[11px] text-on-surface-variant mt-0.5">Awaiting manual review</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
