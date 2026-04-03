"use client";

import AppLayout from "@/components/AppLayout";
import PageHeader from "@/components/PageHeader";
import { useState } from "react";

const faqs = [
  {
    category: "Getting Started",
    questions: [
      {
        q: "How do I add a new property to my portfolio?",
        a: "Navigate to Properties from the sidebar, then click the \"Add Property\" button in the top right. Fill in the property details including name, address, type, and unit count. You can also add properties from Settings > Property Management.",
      },
      {
        q: "How do I connect my bank accounts?",
        a: "Go to Settings > Integrations and click \"Add Bank Connection.\" We use Plaid for secure bank linking. Once connected, transactions will automatically sync daily. You can also trigger a manual sync at any time.",
      },
      {
        q: "What file formats are supported for importing transactions?",
        a: "The Wealth Architect supports CSV, Excel (.xlsx), and OFX/QFX files for transaction imports. You can upload files from the Transactions page using the Import button.",
      },
    ],
  },
  {
    category: "Transactions",
    questions: [
      {
        q: "How does AI categorization work?",
        a: "Our AI engine analyzes vendor names, amounts, timing patterns, and your historical categorizations to automatically assign categories to new transactions. Transactions with high confidence (85%+) are auto-categorized, while lower confidence items are sent to Smart Triage for your review.",
      },
      {
        q: "What is Smart Triage?",
        a: "Smart Triage is our AI-powered review queue where you can quickly accept, modify, or skip categorization suggestions for transactions the AI isn't fully confident about. Each suggestion includes confidence scores, similar past transactions, and AI reasoning.",
      },
      {
        q: "How do I split a transaction across multiple categories or properties?",
        a: "Open the transaction detail page and click \"Split Transaction\" from the Quick Actions panel. You can divide the amount across multiple categories and properties with custom allocation percentages or fixed amounts.",
      },
      {
        q: "Can I undo a categorization?",
        a: "Yes. In Smart Triage, accepted items appear in the \"Recently Reviewed\" section with an Undo button. For any transaction, you can also open the detail page and use the Recategorize action to change the category at any time.",
      },
    ],
  },
  {
    category: "Reports & Exports",
    questions: [
      {
        q: "How do I generate a financial statement?",
        a: "Go to Reports > Statements from the sidebar. Select a preset time period (This Month, Last Quarter, Year to Date, etc.) or choose Custom Range to pick specific dates. The statement automatically generates with revenue, expenses, net profit, and cash flow breakdowns.",
      },
      {
        q: "What export formats are available?",
        a: "You can export reports in Excel (.xlsx) and CSV formats. Exports include property-specific and portfolio-wide data. All generated exports are saved in the Export Archive for future reference.",
      },
      {
        q: "What is the Data Completeness Meter?",
        a: "The Data Completeness Meter on the Exports page shows what percentage of your transactions are properly categorized and assigned to properties. A higher score means your exports will be more accurate. It links directly to tools that help resolve any gaps.",
      },
    ],
  },
  {
    category: "Properties",
    questions: [
      {
        q: "How are property-level financials calculated?",
        a: "Each transaction is assigned to a property. The Wealth Architect aggregates all income and expenses per property to calculate revenue, operating costs, net operating income, and yield metrics shown on each property's detail page.",
      },
      {
        q: "Can I manage multiple properties?",
        a: "Yes. There's no limit to the number of properties you can add. Each property gets its own detail page with unit management, financial summaries, and document storage. The dashboard provides a portfolio-wide overview across all properties.",
      },
    ],
  },
  {
    category: "Account & Security",
    questions: [
      {
        q: "How do I enable two-factor authentication?",
        a: "Go to Settings > Account and find the Security & Password section. Two-factor authentication can be enabled using an authenticator app or SMS verification. We strongly recommend enabling 2FA for all accounts.",
      },
      {
        q: "Can I add other users to my account?",
        a: "Yes. Admins can manage team members from Settings > User Management. You can invite users with different permission levels: Admin (full access), Manager (properties and transactions), Accountant (read-only with export), and Viewer (read-only).",
      },
      {
        q: "How is my financial data protected?",
        a: "All data is encrypted at rest (AES-256) and in transit (TLS 1.3). Bank connections use Plaid's secure infrastructure. We maintain SOC 2 Type II compliance and conduct regular third-party security audits. See our Privacy Policy for full details.",
      },
    ],
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const toggle = (key: string) => {
    setOpenIndex((prev) => (prev === key ? null : key));
  };

  const filteredFaqs = faqs
    .map((section) => ({
      ...section,
      questions: section.questions.filter(
        (q) =>
          q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.a.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((section) => section.questions.length > 0);

  return (
    <AppLayout>
      <PageHeader
        title="Frequently Asked Questions"
        subtitle="Find answers to common questions about The Wealth Architect"
        breadcrumb={{ label: "Help", href: "/help/getting-started" }}
      />

      {/* Search */}
      <div className="max-w-3xl">
        <div className="relative mb-8">
          <span
            aria-hidden="true"
            className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant"
          >
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions..."
            className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-xl pl-12 pr-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
          />
        </div>

        {filteredFaqs.length === 0 && (
          <div className="text-center py-16">
            <span
              aria-hidden="true"
              className="material-symbols-outlined text-[40px] text-outline-variant mb-3 block"
            >
              search_off
            </span>
            <p className="text-sm font-bold text-on-surface-variant">
              No results found
            </p>
            <p className="text-xs text-on-surface-variant/60 mt-1">
              Try different keywords
            </p>
          </div>
        )}

        <div className="space-y-8">
          {filteredFaqs.map((section) => (
            <div key={section.category}>
              <h2 className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-4 flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className="material-symbols-outlined text-primary text-[18px]"
                >
                  folder
                </span>
                {section.category}
              </h2>
              <div className="space-y-2">
                {section.questions.map((item, i) => {
                  const key = `${section.category}-${i}`;
                  const isOpen = openIndex === key;
                  return (
                    <div
                      key={key}
                      className="bg-surface-container-lowest rounded-xl border border-outline-variant/10 overflow-hidden"
                    >
                      <button
                        onClick={() => toggle(key)}
                        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-surface-container-low/50 transition-colors"
                      >
                        <span className="text-sm font-bold text-on-surface pr-4">
                          {item.q}
                        </span>
                        <span
                          aria-hidden="true"
                          className={`material-symbols-outlined text-on-surface-variant text-[20px] transition-transform shrink-0 ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        >
                          expand_more
                        </span>
                      </button>
                      <div
                        className={`overflow-hidden transition-all duration-200 ${
                          isOpen ? "max-h-[400px]" : "max-h-0"
                        }`}
                      >
                        <div className="px-6 pb-5">
                          <p className="text-sm text-on-surface-variant leading-relaxed">
                            {item.a}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Contact Support */}
        <div className="mt-10 bg-surface-container-lowest rounded-2xl p-8 border border-outline-variant/10 text-center">
          <span
            aria-hidden="true"
            className="material-symbols-outlined text-primary text-[32px] mb-3 block"
          >
            support_agent
          </span>
          <h3 className="text-base font-bold text-on-surface mb-2">
            Still have questions?
          </h3>
          <p className="text-sm text-on-surface-variant mb-4">
            Our support team is available Monday through Friday, 9am to 6pm ET.
          </p>
          <a
            href="mailto:support@wealtharchitect.com"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-bold shadow-md shadow-primary/20 hover:opacity-90 transition-all"
          >
            <span aria-hidden="true" className="material-symbols-outlined text-[18px]">
              support_agent
            </span>
            Contact Support
          </a>
        </div>
      </div>
    </AppLayout>
  );
}
