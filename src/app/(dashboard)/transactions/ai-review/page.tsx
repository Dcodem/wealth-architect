"use client";

import AppLayout from "@/components/AppLayout";
import PageHeader from "@/components/PageHeader";
import Link from "next/link";
import { badgeCounts } from "@/lib/badge-counts";

const tools = [
  {
    title: "Smart Triage",
    description: "AI-suggested categorizations for uncategorized transactions. Review, accept, or modify each suggestion with full context and confidence scores.",
    href: "/transactions/smart-triage",
    icon: "auto_awesome",
    iconBg: "bg-primary-fixed-dim",
    iconColor: "text-primary",
    stat: `${badgeCounts.transactionReview} pending`,
    statColor: "text-primary bg-primary-fixed",
  },
  {
    title: "Duplicate Detection",
    description: "AI scans for potential duplicate entries across your transaction history. Compare side-by-side, merge records, or mark as intentional.",
    href: "/transactions/ai-review/duplicates",
    icon: "content_copy",
    iconBg: "bg-orange-100",
    iconColor: "text-orange-600",
    stat: `${badgeCounts.duplicatePairs} pairs found`,
    statColor: "text-orange-700 bg-orange-50",
  },
  {
    title: "Large Transactions",
    description: "Transactions exceeding your review threshold are held for manual verification. Review receipts, flag for audit, or approve with one click.",
    href: "/transactions/ai-review/large-transactions",
    icon: "electric_bolt",
    iconBg: "bg-success-container",
    iconColor: "text-on-success-container",
    stat: `${badgeCounts.largeTransactions} to review`,
    statColor: "text-on-success-container bg-success-container",
  },
];

export default function AIToolsHubPage() {
  return (
    <AppLayout>
      <PageHeader
        title="AI Hub"
        subtitle="Intelligent transaction analysis powered by The Wealth Architect AI"

      />

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-surface-container-lowest rounded-xl p-5 card-shadow flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-primary-fixed-dim flex items-center justify-center">
            <span aria-hidden="true" className="material-symbols-outlined text-primary">analytics</span>
          </div>
          <div>
            <p className="text-2xl font-extrabold text-on-surface">{badgeCounts.transactionReview + badgeCounts.duplicatePairs + badgeCounts.largeTransactions}</p>
            <p className="text-[11px] text-on-surface-variant font-bold uppercase tracking-wider">Items to Review</p>
          </div>
        </div>
        <div className="bg-surface-container-lowest rounded-xl p-5 card-shadow flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-success-container flex items-center justify-center">
            <span aria-hidden="true" className="material-symbols-outlined text-on-success-container">check_circle</span>
          </div>
          <div>
            <p className="text-2xl font-extrabold text-on-surface">94%</p>
            <p className="text-[11px] text-on-surface-variant font-bold uppercase tracking-wider">Auto-Categorized</p>
          </div>
        </div>
        <div className="bg-surface-container-lowest rounded-xl p-5 card-shadow flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center">
            <span aria-hidden="true" className="material-symbols-outlined text-on-surface-variant">schedule</span>
          </div>
          <div>
            <p className="text-2xl font-extrabold text-on-surface">~2 min</p>
            <p className="text-[11px] text-on-surface-variant font-bold uppercase tracking-wider">Avg. Review Time</p>
          </div>
        </div>
      </div>

      {/* Tool Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="group bg-surface-container-lowest rounded-2xl p-8 card-shadow border border-outline-variant/10 hover:border-primary/20 hover:shadow-lg transition-all flex flex-col"
          >
            <div className="flex items-start justify-between mb-6">
              <div className={`w-12 h-12 rounded-xl ${tool.iconBg} flex items-center justify-center ${tool.iconColor}`}>
                <span aria-hidden="true" className="material-symbols-outlined text-2xl">{tool.icon}</span>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${tool.statColor}`}>
                {tool.stat}
              </span>
            </div>
            <h3 className="text-lg font-bold text-on-surface mb-2 group-hover:text-primary transition-colors">
              {tool.title}
            </h3>
            <p className="text-sm text-on-surface-variant leading-relaxed flex-1">
              {tool.description}
            </p>
            <div className="mt-6 flex items-center gap-2 text-sm font-bold text-primary">
              Open Tool
              <span aria-hidden="true" className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </div>
          </Link>
        ))}
      </div>

      {/* AI Status */}
      <div className="bg-gradient-to-br from-primary to-primary-container rounded-2xl p-8 text-white shadow-xl shadow-primary/10">
        <div className="flex items-start gap-6">
          <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center shrink-0">
            <span
              aria-hidden="true"
              className="material-symbols-outlined text-2xl"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              bolt
            </span>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-1">AI Engine Status</h3>
            <p className="text-sm text-white/80 leading-relaxed">
              The The Wealth Architect AI has processed 1,247 transactions this month with a 94% auto-categorization rate.
              The engine continuously learns from your manual corrections to improve future suggestions.
            </p>
            <div className="flex items-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                <span className="text-xs font-bold text-white/90 uppercase tracking-wider">System Healthy</span>
              </div>
              <span className="text-xs text-white/60">Last sync: 4 minutes ago</span>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
