"use client";

import NumberFlow, { type Format } from "@number-flow/react";
import InfoTooltip from "./InfoTooltip";

interface KPICardProps {
  label: string;
  value: string;
  numericValue?: number;
  format?: Format;
  icon: string;
  iconBg?: string;
  iconColor?: string;
  trend?: string;
  trendUp?: boolean;
  trendTooltip?: string;
  className?: string;
}

export default function KPICard({ label, value, numericValue, format, icon, iconBg = "bg-primary-fixed-dim", iconColor = "text-primary", trend, trendUp, trendTooltip, className = "" }: KPICardProps) {
  return (
    <div className={`bg-surface-container-lowest p-6 rounded-xl card-shadow ${className}`}>
      <div className="flex justify-between items-start mb-4">
        <div className={`p-2 ${iconBg} rounded-lg ${iconColor}`}>
          <span aria-hidden="true" className="material-symbols-outlined">{icon}</span>
        </div>
        {trend && (
          <InfoTooltip content={trendTooltip ?? "vs. previous period"}>
            <span className={`text-[11px] font-bold flex items-center gap-0.5 cursor-help ${trendUp ? "text-success-dim" : "text-error"}`}>
              <span aria-hidden="true" className="material-symbols-outlined text-[14px]">
                {trendUp ? "trending_up" : "trending_down"}
              </span>
              {trend}
            </span>
          </InfoTooltip>
        )}
      </div>
      <p className="text-on-surface-variant text-xs font-semibold uppercase tracking-wider">{label}</p>
      {numericValue !== undefined ? (
        <NumberFlow
          value={numericValue}
          className="text-2xl font-bold mt-1 tabular-nums block"
          format={format ?? { style: "currency", currency: "USD", maximumFractionDigits: 0 }}
        />
      ) : (
        <h3 className="text-2xl font-bold mt-1 tabular-nums">{value}</h3>
      )}
    </div>
  );
}
