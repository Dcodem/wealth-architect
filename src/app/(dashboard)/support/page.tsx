"use client";

import { useState } from "react";

const FAQ_ITEMS = [
  {
    q: "How do I add a new property?",
    a: "Navigate to Properties from the sidebar and click 'Expand Portfolio'. You can upload property documents for automatic extraction, or fill in the details manually including address, type, unit count, and access instructions.",
  },
  {
    q: "How does AI case triage work?",
    a: "When a tenant submits a maintenance request, The Wealth Architect's AI analyzes the message to classify urgency, category, and required trade. It automatically assigns vendors based on your preferences and dispatches communications — all within seconds.",
  },
  {
    q: "How do I assign a vendor to a case?",
    a: "Open any case from the Cases page, then use the 'Assign Contractor' section in the right sidebar. Click the edit button to select from your registered vendors, or let the AI auto-assign based on trade match and availability.",
  },
  {
    q: "How do I generate reports?",
    a: "Visit any property's detail page and click 'View Full Analytics' for a comprehensive breakdown of cases, costs, resolution times, and tenant satisfaction over the past 12 months.",
  },
  {
    q: "How do I manage tenant communications?",
    a: "Each case has a built-in Communication Log with separate Tenant and Contractor threads. You can send messages, attach files, and toggle between AI-managed and manual conversation modes using the 'Take Over from AI' button.",
  },
  {
    q: "How do I set spending limits?",
    a: "Go to Settings from the sidebar. Under 'Spending Limits', you can set both standard and emergency spending caps. The AI will auto-approve work orders within these limits and escalate anything above them for your review.",
  },
];

const STEPS = [
  { icon: "domain", title: "Add your properties", desc: "Register your buildings with addresses, unit counts, and access instructions." },
  { icon: "groups", title: "Add tenants", desc: "Link tenants to their units with lease details and contact information." },
  { icon: "psychology", title: "Configure AI settings", desc: "Set confidence thresholds, spending limits, and notification preferences." },
  { icon: "assignment", title: "Start managing cases", desc: "Let The Wealth Architect handle incoming maintenance requests automatically." },
];

export default function SupportPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="max-w-4xl mx-auto py-12 px-8">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-extrabold text-on-surface tracking-tight mb-2">Help & Support</h1>
        <p className="text-on-surface-variant">Everything you need to get the most out of The Wealth Architect.</p>
      </div>

      {/* Getting Started */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-on-surface mb-6">Getting Started</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {STEPS.map((step, i) => (
            <div key={i} className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/10 flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary-fixed flex items-center justify-center text-primary shrink-0">
                <span className="material-symbols-outlined">{step.icon}</span>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-primary">Step {i + 1}</span>
                </div>
                <h3 className="text-sm font-bold text-on-surface mb-1">{step.title}</h3>
                <p className="text-xs text-on-surface-variant">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-on-surface mb-6">Frequently Asked Questions</h2>
        <div className="space-y-2">
          {FAQ_ITEMS.map((item, i) => (
            <div key={i} className="bg-surface-container-lowest rounded-xl border border-outline-variant/10 overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-primary-fixed/30 transition-colors"
              >
                <span className="text-sm font-bold text-on-surface">{item.q}</span>
                <span className={`material-symbols-outlined text-on-surface-variant transition-transform duration-200 ${openFaq === i ? "rotate-180" : ""}`}>
                  expand_more
                </span>
              </button>
              <div
                className="overflow-hidden transition-all duration-200"
                style={{ maxHeight: openFaq === i ? "200px" : "0px" }}
              >
                <p className="px-5 pb-5 text-sm text-on-surface-variant leading-relaxed">{item.a}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Support */}
      <section>
        <h2 className="text-2xl font-bold text-on-surface mb-6">Contact Support</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/10 text-center">
            <div className="w-12 h-12 rounded-full bg-primary-fixed flex items-center justify-center text-primary mx-auto mb-3">
              <span className="material-symbols-outlined">mail</span>
            </div>
            <h3 className="text-sm font-bold text-on-surface mb-1">Email</h3>
            <p className="text-xs text-on-surface-variant">support@wealtharchitect.com</p>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/10 text-center">
            <div className="w-12 h-12 rounded-full bg-primary-fixed flex items-center justify-center text-primary mx-auto mb-3">
              <span className="material-symbols-outlined">call</span>
            </div>
            <h3 className="text-sm font-bold text-on-surface mb-1">Phone</h3>
            <p className="text-xs text-on-surface-variant">(888) 555-PROP</p>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/10 text-center">
            <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant mx-auto mb-3">
              <span className="material-symbols-outlined">chat</span>
            </div>
            <h3 className="text-sm font-bold text-on-surface mb-1">Live Chat</h3>
            <p className="text-xs text-on-surface-variant">Coming Soon</p>
          </div>
        </div>
      </section>

      <footer className="mt-16 text-center border-t border-outline-variant/20 pt-8">
        <p className="text-[10px] text-outline font-bold uppercase tracking-[0.3em]">The Wealth Architect Support Center</p>
      </footer>
    </div>
  );
}
