"use client";

import { motion } from "framer-motion";
import Link from "next/link";

interface Tab {
  label: string;
  value?: string;
  href?: string;
}

interface AnimatedTabsProps {
  tabs: Tab[];
  activeValue: string;
  onChange?: (value: string) => void;
  layoutId: string;
  variant?: "underline" | "pill";
  className?: string;
}

export default function AnimatedTabs({
  tabs,
  activeValue,
  onChange,
  layoutId,
  variant = "underline",
  className = "",
}: AnimatedTabsProps) {
  if (variant === "pill") {
    return (
      <div className={`flex items-center gap-1 bg-surface-container-low rounded-xl p-1 w-fit ${className}`}>
        {tabs.map((tab) => {
          const value = tab.value ?? tab.label;
          const active = activeValue === value;
          return (
            <button
              key={value}
              onClick={() => onChange?.(value)}
              className="relative px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
            >
              {active && (
                <motion.div
                  layoutId={layoutId}
                  className="absolute inset-0 bg-surface-container-lowest rounded-lg shadow-sm"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                />
              )}
              <span className={`relative z-10 ${active ? "text-on-surface" : "text-on-surface-variant"}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className={`flex gap-8 border-b border-outline-variant/30 ${className}`}>
      {tabs.map((tab) => {
        const value = tab.value ?? tab.href ?? tab.label;
        const active = activeValue === value;
        const content = (
          <>
            <span className={`relative z-10 ${active ? "font-semibold text-primary" : "text-on-surface-variant hover:text-primary"}`}>
              {tab.label}
            </span>
            {active && (
              <motion.div
                layoutId={layoutId}
                className="absolute bottom-0 left-0 w-full h-[2px] bg-primary"
                transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
              />
            )}
          </>
        );

        if (tab.href) {
          return (
            <Link
              key={value}
              href={tab.href}
              className="pb-3 text-sm font-medium transition-colors relative"
            >
              {content}
            </Link>
          );
        }

        return (
          <button
            key={value}
            onClick={() => onChange?.(value)}
            className="pb-3 text-sm font-medium transition-colors relative"
          >
            {content}
          </button>
        );
      })}
    </div>
  );
}
