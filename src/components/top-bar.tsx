"use client";

import Link from "next/link";

interface TopBarProps {
  onMenuToggle?: () => void;
}

export function TopBar({ onMenuToggle }: TopBarProps) {
  return (
    <header className="fixed top-0 right-0 w-full lg:w-[calc(100%-220px)] h-16 z-30 bg-surface-container-lowest/80 backdrop-blur-xl flex items-center justify-between px-4 lg:px-8 shadow-sm">
      <div className="flex items-center gap-3">
        {onMenuToggle && (
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 -ml-1 rounded-lg hover:bg-surface-container-low text-on-surface-variant"
            aria-label="Open navigation"
          >
            <span aria-hidden="true" className="material-symbols-outlined">menu</span>
          </button>
        )}
        <div className="flex items-center gap-2 bg-surface-container-high rounded-lg pl-3 pr-2 py-1.5 text-sm w-48 sm:w-64">
          <span aria-hidden="true" className="material-symbols-outlined text-lg text-on-surface-variant">search</span>
          <span className="text-on-surface-variant text-sm flex-1 text-left">Search...</span>
        </div>
      </div>
      <div className="flex items-center gap-2 sm:gap-4">
        <div className="flex items-center gap-1 sm:gap-2 text-on-surface-variant">
          <button className="p-2 hover:bg-surface-container-low rounded-lg transition-colors relative" aria-label="Notifications">
            <span aria-hidden="true" className="material-symbols-outlined">notifications</span>
            <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
          </button>
          <Link href="/settings" className="p-2 hover:bg-surface-container-low rounded-lg transition-colors">
            <span aria-hidden="true" className="material-symbols-outlined">settings</span>
          </Link>
          <Link href="/profile" className="p-2 hover:bg-surface-container-low rounded-lg transition-colors">
            <span aria-hidden="true" className="material-symbols-outlined">account_circle</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
