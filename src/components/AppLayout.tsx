"use client";

/**
 * AppLayout — thin wrapper from the ELP codebase.
 * The actual sidebar + shell is handled by DashboardShell in the (dashboard) layout,
 * so this just provides consistent page-level max-width and padding.
 */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {children}
    </div>
  );
}
