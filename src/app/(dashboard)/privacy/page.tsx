"use client";

import AppLayout from "@/components/AppLayout";
import PageHeader from "@/components/PageHeader";

const sections = [
  {
    title: "Information We Collect",
    icon: "database",
    content: [
      {
        subtitle: "Account Information",
        text: "When you create an account, we collect your name, email address, phone number, company name, and role. This information is used to personalize your experience and communicate with you about your account.",
      },
      {
        subtitle: "Financial Data",
        text: "We connect to your financial institutions through Plaid to import transaction data. This includes transaction amounts, dates, merchant names, and account identifiers. We use read-only access and never store your bank login credentials.",
      },
      {
        subtitle: "Property Information",
        text: "You may provide property details including addresses, unit counts, tenant information, and property documents. This data is used solely to power your portfolio management features.",
      },
      {
        subtitle: "Usage Data",
        text: "We collect anonymized usage data including pages visited, features used, and interaction patterns. This helps us improve the product and fix issues. We do not track individual user behavior for advertising purposes.",
      },
    ],
  },
  {
    title: "How We Use Your Data",
    icon: "settings",
    content: [
      {
        subtitle: "Core Product Functionality",
        text: "Your financial and property data powers the core features of The Wealth Architect, including transaction categorization, statement generation, export creation, and portfolio analytics.",
      },
      {
        subtitle: "AI Processing",
        text: "Our AI engine processes your transaction data to provide automatic categorization, duplicate detection, and anomaly flagging. AI processing occurs on our secure servers. We do not use your data to train models shared with other users.",
      },
      {
        subtitle: "Communications",
        text: "We use your email address to send account-related notifications, security alerts, and product updates. You can manage notification preferences in Settings > Notifications.",
      },
    ],
  },
  {
    title: "Data Security",
    icon: "shield",
    content: [
      {
        subtitle: "Encryption",
        text: "All data is encrypted at rest using AES-256 encryption and in transit using TLS 1.3. Database backups are encrypted with separate key management.",
      },
      {
        subtitle: "Infrastructure",
        text: "Our infrastructure is hosted on SOC 2 Type II compliant cloud providers. We maintain strict access controls, network segmentation, and continuous monitoring.",
      },
      {
        subtitle: "Access Controls",
        text: "Employee access to customer data is limited to authorized personnel on a need-to-know basis. All access is logged and audited regularly.",
      },
      {
        subtitle: "Third-Party Audits",
        text: "We conduct annual third-party security assessments and penetration tests. Our Plaid integration is certified under their security partnership program.",
      },
    ],
  },
  {
    title: "Data Sharing",
    icon: "share",
    content: [
      {
        subtitle: "We Do Not Sell Your Data",
        text: "We never sell, rent, or trade your personal or financial information to third parties for marketing or advertising purposes.",
      },
      {
        subtitle: "Service Providers",
        text: "We share data with trusted service providers who help us operate (e.g., Plaid for banking connections, cloud hosting providers). These providers are bound by strict data processing agreements.",
      },
      {
        subtitle: "Legal Requirements",
        text: "We may disclose data if required by law, regulation, legal process, or governmental request. We will notify you of such disclosures unless legally prohibited from doing so.",
      },
    ],
  },
  {
    title: "Your Rights",
    icon: "gavel",
    content: [
      {
        subtitle: "Access & Portability",
        text: "You can access all your data through the application at any time. You can export your complete transaction history, property data, and statements in standard formats (Excel, CSV).",
      },
      {
        subtitle: "Correction",
        text: "You can update your account information, correct transaction categorizations, and modify property details directly through the application.",
      },
      {
        subtitle: "Deletion",
        text: "You can request complete deletion of your account and all associated data by contacting support@wealtharchitect.com. Deletion is processed within 30 days, subject to legal retention requirements.",
      },
      {
        subtitle: "Data Retention",
        text: "We retain your data for as long as your account is active. After account deletion, we remove personal data within 30 days and anonymized analytics data within 90 days.",
      },
    ],
  },
  {
    title: "Cookies & Tracking",
    icon: "cookie",
    content: [
      {
        subtitle: "Essential Cookies",
        text: "We use essential cookies for authentication, session management, and security. These cannot be disabled as they are necessary for the application to function.",
      },
      {
        subtitle: "Analytics",
        text: "We use anonymized analytics to understand product usage patterns. We do not use third-party advertising trackers or cross-site tracking cookies.",
      },
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <AppLayout>
      <PageHeader
        title="Privacy Policy"
        subtitle="How The Wealth Architect handles your data"
      />

      <div className="max-w-3xl space-y-8">
        {/* Last Updated */}
        <div className="bg-surface-container-lowest rounded-xl p-5 border border-outline-variant/10 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-primary-fixed-dim flex items-center justify-center shrink-0">
            <span aria-hidden="true" className="material-symbols-outlined text-primary">
              update
            </span>
          </div>
          <div>
            <p className="text-sm font-bold text-on-surface">
              Last Updated: March 15, 2024
            </p>
            <p className="text-xs text-on-surface-variant mt-0.5">
              This policy applies to all users of The Wealth Architect by The
              Wealth Architect.
            </p>
          </div>
        </div>

        {/* Sections */}
        {sections.map((section) => (
          <div
            key={section.title}
            className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 overflow-hidden"
          >
            <div className="px-8 py-6 border-b border-outline-variant/10 flex items-center gap-3">
              <span
                aria-hidden="true"
                className="material-symbols-outlined text-primary"
              >
                {section.icon}
              </span>
              <h2 className="text-base font-bold text-on-surface">
                {section.title}
              </h2>
            </div>
            <div className="px-8 py-6 space-y-6">
              {section.content.map((item) => (
                <div key={item.subtitle}>
                  <h3 className="text-sm font-bold text-on-surface mb-1.5">
                    {item.subtitle}
                  </h3>
                  <p className="text-sm text-on-surface-variant leading-relaxed">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Contact */}
        <div className="bg-surface-container-lowest rounded-2xl p-8 border border-outline-variant/10 text-center">
          <h3 className="text-base font-bold text-on-surface mb-2">
            Questions About This Policy?
          </h3>
          <p className="text-sm text-on-surface-variant mb-4">
            Contact our privacy team for any questions or concerns.
          </p>
          <a
            href="mailto:privacy@wealtharchitect.com"
            className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline"
          >
            <span
              aria-hidden="true"
              className="material-symbols-outlined text-[18px]"
            >
              mail
            </span>
            privacy@wealtharchitect.com
          </a>
        </div>
      </div>
    </AppLayout>
  );
}
