"use client";

import AppLayout from "@/components/AppLayout";
import PageHeader from "@/components/PageHeader";
import Link from "next/link";

const steps = [
  {
    number: "01",
    title: "Add Your Properties",
    description:
      "Start by adding the properties in your portfolio. Each property gets its own financial tracking, document storage, and analytics dashboard.",
    icon: "apartment",
    href: "/properties/add",
    linkLabel: "Add a Property",
    tips: [
      "Include accurate addresses for tax reporting",
      "Set up unit counts for multi-family properties",
      "Upload property photos for easy identification",
    ],
  },
  {
    number: "02",
    title: "Connect Your Bank Accounts",
    description:
      "Link your bank accounts to automatically import transactions. We use Plaid for secure, read-only access to your financial data.",
    icon: "account_balance",
    href: "/settings/integrations",
    linkLabel: "Go to Integrations",
    tips: [
      "Connect all accounts associated with your properties",
      "Transactions sync automatically every 24 hours",
      "You can also import CSV or Excel files manually",
    ],
  },
  {
    number: "03",
    title: "Review AI Categorizations",
    description:
      "Our AI engine automatically categorizes incoming transactions. Use Smart Triage to review items the AI isn't fully confident about.",
    icon: "auto_awesome",
    href: "/transactions/smart-triage",
    linkLabel: "Open Smart Triage",
    tips: [
      "High confidence items (85%+) are auto-categorized",
      "Review medium and low confidence items in Smart Triage",
      "The AI learns from your corrections over time",
    ],
  },
  {
    number: "04",
    title: "Generate Your First Statement",
    description:
      "Create financial statements for any time period. Choose from presets like monthly, quarterly, or year-to-date, or set a custom date range.",
    icon: "description",
    href: "/reports/statements",
    linkLabel: "View Statements",
    tips: [
      "Statements include revenue, expenses, and cash flow",
      "Export to Excel or CSV for your accountant",
      "The Data Completeness Meter shows export readiness",
    ],
  },
];

const features = [
  {
    icon: "psychology",
    title: "AI Hub",
    description:
      "Central dashboard for all AI-powered tools including Smart Triage, Duplicate Detection, and Large Transaction review.",
    href: "/transactions/ai-review",
  },
  {
    icon: "call_split",
    title: "Split Transactions",
    description:
      "Divide a single transaction across multiple categories or properties for accurate cost allocation.",
    href: "/transactions",
  },
  {
    icon: "download",
    title: "Export & Archive",
    description:
      "Generate portfolio-wide or property-specific exports. All exports are saved in the archive for future reference.",
    href: "/reports/exports",
  },
  {
    icon: "group",
    title: "Team Management",
    description:
      "Invite team members with role-based permissions. Assign Admin, Manager, Accountant, or Viewer access levels.",
    href: "/settings/users",
  },
  {
    icon: "security",
    title: "Security",
    description:
      "Two-factor authentication, AES-256 encryption at rest, and SOC 2 Type II compliance keep your data safe.",
    href: "/settings",
  },
  {
    icon: "notifications",
    title: "Notifications",
    description:
      "Configure alerts for new transactions, lease expirations, maintenance requests, and report availability.",
    href: "/settings/notifications",
  },
];

const shortcuts = [
  { keys: ["Cmd", "K"], description: "Open search" },
  { keys: ["Esc"], description: "Close dialogs" },
  { keys: ["Arrow", "Enter"], description: "Navigate search results" },
];

export default function GettingStartedPage() {
  return (
    <AppLayout>
      <PageHeader
        title="Getting Started"
        subtitle="Everything you need to set up and manage your real estate portfolio"
      />

      {/* Quick Links */}
      <div className="flex items-center gap-3 flex-wrap">
        <Link
          href="/help/faq"
          className="flex items-center gap-2 px-4 py-2 bg-surface-container-lowest border border-outline-variant/20 rounded-xl text-sm font-bold text-on-surface hover:border-primary/30 transition-all"
        >
          <span aria-hidden="true" className="material-symbols-outlined text-primary text-[18px]">
            help
          </span>
          FAQ
        </Link>
        <Link
          href="/privacy"
          className="flex items-center gap-2 px-4 py-2 bg-surface-container-lowest border border-outline-variant/20 rounded-xl text-sm font-bold text-on-surface hover:border-primary/30 transition-all"
        >
          <span aria-hidden="true" className="material-symbols-outlined text-primary text-[18px]">
            shield
          </span>
          Privacy Policy
        </Link>
        <a
          href="mailto:support@wealtharchitect.com"
          className="flex items-center gap-2 px-4 py-2 bg-surface-container-lowest border border-outline-variant/20 rounded-xl text-sm font-bold text-on-surface hover:border-primary/30 transition-all"
        >
          <span aria-hidden="true" className="material-symbols-outlined text-primary text-[18px]">
            support_agent
          </span>
          Contact Support
        </a>
      </div>

      {/* Setup Steps */}
      <div className="space-y-6">
        <h2 className="text-lg font-bold text-on-surface">Setup Guide</h2>
        <div className="space-y-4">
          {steps.map((step) => (
            <div
              key={step.number}
              className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 overflow-hidden"
            >
              <div className="p-8">
                <div className="flex items-start gap-6">
                  <div className="flex items-center gap-4 shrink-0">
                    <span className="text-3xl font-extrabold text-outline-variant/30">
                      {step.number}
                    </span>
                    <div className="w-12 h-12 rounded-xl bg-primary-fixed-dim flex items-center justify-center">
                      <span
                        aria-hidden="true"
                        className="material-symbols-outlined text-primary text-2xl"
                      >
                        {step.icon}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-on-surface mb-2">
                      {step.title}
                    </h3>
                    <p className="text-sm text-on-surface-variant leading-relaxed mb-4">
                      {step.description}
                    </p>
                    <ul className="space-y-2 mb-5">
                      {step.tips.map((tip) => (
                        <li
                          key={tip}
                          className="flex items-start gap-2 text-sm text-on-surface-variant"
                        >
                          <span
                            aria-hidden="true"
                            className="material-symbols-outlined text-on-success-container text-[16px] mt-0.5"
                          >
                            check_circle
                          </span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                    <Link
                      href={step.href}
                      className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline"
                    >
                      {step.linkLabel}
                      <span
                        aria-hidden="true"
                        className="material-symbols-outlined text-[16px]"
                      >
                        arrow_forward
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Feature Overview */}
      <div className="space-y-6">
        <h2 className="text-lg font-bold text-on-surface">Feature Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature) => (
            <Link
              key={feature.title}
              href={feature.href}
              className="group bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/10 hover:border-primary/20 hover:shadow-md transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-primary-fixed-dim flex items-center justify-center mb-4">
                <span
                  aria-hidden="true"
                  className="material-symbols-outlined text-primary"
                >
                  {feature.icon}
                </span>
              </div>
              <h3 className="text-sm font-bold text-on-surface mb-1 group-hover:text-primary transition-colors">
                {feature.title}
              </h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                {feature.description}
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/* Keyboard Shortcuts */}
      <div className="max-w-md">
        <h2 className="text-lg font-bold text-on-surface mb-4">
          Keyboard Shortcuts
        </h2>
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/10 divide-y divide-outline-variant/10">
          {shortcuts.map((s) => (
            <div
              key={s.description}
              className="flex items-center justify-between px-5 py-3"
            >
              <span className="text-sm text-on-surface-variant">
                {s.description}
              </span>
              <div className="flex items-center gap-1">
                {s.keys.map((k) => (
                  <kbd
                    key={k}
                    className="px-2 py-0.5 bg-surface-container-high rounded text-[11px] font-bold text-on-surface-variant"
                  >
                    {k}
                  </kbd>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Support CTA */}
      <div className="bg-gradient-to-br from-primary to-primary-container rounded-2xl p-8 text-white shadow-xl shadow-primary/10">
        <div className="flex items-start gap-6">
          <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center shrink-0">
            <span
              aria-hidden="true"
              className="material-symbols-outlined text-2xl"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              headset_mic
            </span>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-1">Need Help?</h3>
            <p className="text-sm text-white/80 leading-relaxed">
              Our support team is available Monday through Friday, 9am to 6pm
              ET. Reach us at{" "}
              <a
                href="mailto:support@wealtharchitect.com"
                className="underline font-bold text-white"
              >
                support@wealtharchitect.com
              </a>{" "}
              or check the{" "}
              <Link href="/help/faq" className="underline font-bold text-white">
                FAQ
              </Link>{" "}
              for quick answers.
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
