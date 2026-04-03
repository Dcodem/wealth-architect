"use client";

import Link from "next/link";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumb?: { label: string; href: string };
  actions?: React.ReactNode;
  badge?: string;
}

export default function PageHeader({ title, subtitle, breadcrumb, actions, badge }: PageHeaderProps) {
  return (
    <div className="mb-8">
      {breadcrumb && (
        <Link
          href={breadcrumb.href}
          className="inline-flex items-center gap-1 text-sm text-on-surface-variant hover:text-primary transition-colors mb-3"
        >
          <span aria-hidden="true" className="material-symbols-outlined text-[18px]">arrow_back</span>
          {breadcrumb.label}
        </Link>
      )}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-extrabold tracking-tighter text-on-surface">{title}</h1>
            {badge && (
              <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-warning-container text-on-surface">
                {badge}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-on-surface-variant text-[15px] mt-1 font-medium">{subtitle}</p>
          )}
        </div>
        {actions && <div className="shrink-0">{actions}</div>}
      </div>
    </div>
  );
}
