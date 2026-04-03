"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { SignOutButton } from "@/components/sign-out-button";
import { badgeCounts } from "@/lib/badge-counts";

interface NavItem {
  label: string;
  href: string;
  icon: string;
  badge?: number;
  badgeColor?: string;
  exact?: boolean;
}

interface NavSection {
  heading: string;
  module?: "ledger" | "operations";
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    heading: "Overview",
    items: [
      { label: "Dashboard", href: "/overview", icon: "dashboard", exact: true },
      { label: "Properties", href: "/properties", icon: "domain" },
    ],
  },
  {
    heading: "Ledger",
    module: "ledger",
    items: [
      { label: "Transactions", href: "/transactions", icon: "payments", badge: badgeCounts.needsReview, badgeColor: "bg-amber-500" },
      { label: "AI Hub", href: "/transactions/ai-review", icon: "psychology", exact: true },
      { label: "Smart Triage", href: "/transactions/smart-triage", icon: "auto_awesome", badge: badgeCounts.transactionReview },
      { label: "Duplicates", href: "/transactions/ai-review/duplicates", icon: "content_copy" },
      { label: "Large Transactions", href: "/transactions/ai-review/large-transactions", icon: "electric_bolt" },
    ],
  },
  {
    heading: "Operations",
    module: "operations",
    items: [
      { label: "Cases", href: "/cases", icon: "assignment" },
      { label: "Tenants", href: "/tenants", icon: "groups" },
      { label: "Vendors", href: "/vendors", icon: "engineering" },
    ],
  },
  {
    heading: "Reports",
    module: "ledger",
    items: [
      { label: "Statements", href: "/reports/statements", icon: "description" },
      { label: "Exports", href: "/reports/exports", icon: "download" },
    ],
  },
  {
    heading: "System",
    items: [
      { label: "Settings", href: "/settings", icon: "settings" },
    ],
  },
];

function isActiveRoute(pathname: string, href: string, exact?: boolean): boolean {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(href + "/");
}

interface SidebarNavProps {
  open?: boolean;
  onClose?: () => void;
}

export function SidebarNav({ open = false, onClose }: SidebarNavProps) {
  const pathname = usePathname();
  const asideRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<Element | null>(null);

  // Module feature flags
  const ledgerEnabled = process.env.NEXT_PUBLIC_MODULE_LEDGER !== "false";
  const operationsEnabled = process.env.NEXT_PUBLIC_MODULE_OPERATIONS !== "false";

  const visibleSections = navSections.filter((section) => {
    if (section.module === "ledger" && !ledgerEnabled) return false;
    if (section.module === "operations" && !operationsEnabled) return false;
    return true;
  });

  useEffect(() => {
    if (!open || !onClose) return;
    const isMobile = window.matchMedia("(max-width: 1023px)").matches;
    if (!isMobile) return;

    triggerRef.current = document.activeElement;
    const aside = asideRef.current;
    if (!aside) return;

    const sel = 'a[href], button, [tabindex]:not([tabindex="-1"])';
    const first = aside.querySelector<HTMLElement>(sel);
    first?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") { onClose(); return; }
      if (e.key !== "Tab") return;
      const all = aside.querySelectorAll<HTMLElement>(sel);
      if (!all.length) return;
      if (e.shiftKey && document.activeElement === all[0]) {
        e.preventDefault();
        all[all.length - 1].focus();
      } else if (!e.shiftKey && document.activeElement === all[all.length - 1]) {
        e.preventDefault();
        all[0].focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      if (triggerRef.current instanceof HTMLElement) triggerRef.current.focus();
    };
  }, [open, onClose]);

  return (
    <>
      {open && <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={onClose} />}
      <aside
        ref={asideRef}
        role={open ? "dialog" : undefined}
        aria-modal={open ? true : undefined}
        aria-label={open ? "Navigation menu" : undefined}
        className={`w-[220px] h-screen fixed left-0 top-0 overflow-y-auto bg-surface-container-low flex flex-col py-8 px-4 z-50 transition-transform duration-200 ease-out ${
          open ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden absolute top-4 right-4 p-1 rounded-lg hover:bg-surface-container-high text-on-surface-variant"
            aria-label="Close sidebar"
          >
            <span aria-hidden="true" className="material-symbols-outlined text-xl">close</span>
          </button>
        )}

        {/* Brand */}
        <div className="mb-10 px-2">
          <h1 className="text-xl font-bold tracking-tight text-on-surface">The Wealth Architect</h1>
          <p className="text-[11px] text-on-surface-variant uppercase tracking-widest mt-1">
            Luxury Real Estate Curator
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1">
          {visibleSections.map((section) => (
            <div key={section.heading}>
              <div className="pt-4 pb-2 px-3 text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
                {section.heading}
              </div>
              {section.items.map((item) => {
                const active = isActiveRoute(pathname, item.href, item.exact);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={`flex items-center gap-3 px-3 py-2 transition-colors ${
                      active
                        ? "text-primary font-bold border-r-2 border-primary hover:bg-surface-container-high/50"
                        : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/50"
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className="material-symbols-outlined text-[20px]"
                      style={active ? { fontVariationSettings: "'FILL' 1" } : undefined}
                    >
                      {item.icon}
                    </span>
                    <span className="text-sm font-medium flex-1">{item.label}</span>
                    {item.badge != null && item.badge > 0 && (
                      <span className={`min-w-[20px] h-5 flex items-center justify-center ${item.badgeColor || "bg-primary"} text-white text-[11px] font-bold rounded-full px-1.5`}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="mt-auto space-y-1 pt-6 border-t border-outline-variant">
          <Link
            href="/profile"
            onClick={onClose}
            className="flex items-center gap-3 px-3 py-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/50 transition-colors"
          >
            <span aria-hidden="true" className="material-symbols-outlined text-[20px]">person</span>
            <span className="text-sm font-medium">Profile</span>
          </Link>
          <Link
            href="/support"
            onClick={onClose}
            className="flex items-center gap-3 px-3 py-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/50 transition-colors"
          >
            <span aria-hidden="true" className="material-symbols-outlined text-[20px]">help</span>
            <span className="text-sm font-medium">Support</span>
          </Link>
          <SignOutButton className="flex items-center gap-3 px-3 py-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/50 transition-colors w-full">
            <span aria-hidden="true" className="material-symbols-outlined text-[20px]">logout</span>
            <span className="text-sm font-medium">Logout</span>
          </SignOutButton>
        </div>
      </aside>
    </>
  );
}
