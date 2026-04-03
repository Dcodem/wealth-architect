"use client";
import AppLayout from "@/components/AppLayout";
import PageHeader from "@/components/PageHeader";
import Link from "next/link";

const reportLinks = [
  {
    title: "Statements",
    desc: "Consolidated financial reports for any time period with line-item detail.",
    icon: "receipt_long",
    iconBg: "bg-emerald-50 text-emerald-700",
    href: "/reports/statements",
  },
  {
    title: "Exports",
    desc: "Configure and generate detailed financial statements for download.",
    icon: "file_export",
    iconBg: "bg-amber-50 text-amber-600",
    href: "/reports/exports",
  },
];

export default function ReportsPage() {
  return (
    <AppLayout>
      <PageHeader
        title="Reports"
        subtitle="Comprehensive financial analytics and performance tracking"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reportLinks.map((r) => (
          <Link
            key={r.title}
            href={r.href}
            className="group bg-surface-container-lowest p-6 rounded-xl card-shadow border border-transparent hover:border-primary/20 transition-all hover:-translate-y-1"
          >
            <div className={`w-12 h-12 rounded-xl ${r.iconBg} flex items-center justify-center mb-4`}>
              <span aria-hidden="true" className="material-symbols-outlined text-[24px]">{r.icon}</span>
            </div>
            <h3 className="text-base font-bold text-on-surface font-headline">{r.title}</h3>
            <p className="text-sm text-on-surface-variant mt-1 leading-relaxed">{r.desc}</p>
            <div className="mt-4 flex items-center gap-1 text-primary text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity">
              View Report
              <span aria-hidden="true" className="material-symbols-outlined text-sm">arrow_forward</span>
            </div>
          </Link>
        ))}
      </div>
    </AppLayout>
  );
}
