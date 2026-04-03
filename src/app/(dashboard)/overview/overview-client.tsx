"use client";

import { useMemo } from "react";
import Link from "next/link";
import { formatEnum, timeAgo } from "@/lib/utils";
import type { Case, Property, Tenant } from "@/lib/db/schema";

interface OverviewClientProps {
  cases: Case[];
  properties: Property[];
  tenants: Tenant[];
}

const URGENCY_DOT: Record<string, string> = {
  critical: "bg-error",
  high: "bg-caution",
  medium: "bg-warning-dim",
  low: "bg-success-dim",
};

// Mock: same late tenant indices as tenant-table
const LATE_TENANT_INDICES = new Set([2, 5, 8, 11]);

export function OverviewClient({ cases, properties, tenants }: OverviewClientProps) {
  const propertyMap = new Map(properties.map((p) => [p.id, p.address]));

  const openCases = useMemo(
    () => cases.filter((c) => !["resolved", "closed"].includes(c.status)),
    [cases]
  );

  const expiringLeases = useMemo(() => {
    const now = Date.now();
    return tenants
      .filter((t) => {
        if (!t.leaseEnd) return false;
        const days = Math.ceil((t.leaseEnd.getTime() - now) / (1000 * 60 * 60 * 24));
        return days > 0 && days <= 90;
      })
      .map((t) => ({
        ...t,
        daysLeft: Math.ceil((t.leaseEnd!.getTime() - now) / (1000 * 60 * 60 * 24)),
      }))
      .sort((a, b) => a.daysLeft - b.daysLeft);
  }, [tenants]);

  const sortedTenants = useMemo(
    () => [...tenants].sort((a, b) => a.name.localeCompare(b.name)),
    [tenants]
  );

  const lateOnRent = useMemo(
    () => sortedTenants.filter((_, i) => LATE_TENANT_INDICES.has(i)),
    [sortedTenants]
  );

  function getLeaseUrgencyColor(days: number) {
    if (days <= 30) return { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500", label: "Critical" };
    if (days <= 60) return { bg: "bg-orange-50", text: "text-orange-700", dot: "bg-orange-500", label: "Soon" };
    return { bg: "bg-yellow-50", text: "text-yellow-700", dot: "bg-yellow-500", label: "Upcoming" };
  }

  const totalActions = openCases.length + expiringLeases.length + lateOnRent.length;

  return (
    <div className="max-w-7xl mx-auto space-y-8 pt-8 pb-12 px-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tighter text-on-surface">Dashboard</h1>
        <p className="text-on-surface-variant text-[15px] mt-1 font-medium">
          Action items across your portfolio
        </p>
      </div>

      {/* Summary Strip */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/10 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-error/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-error">priority_high</span>
          </div>
          <div>
            <p className="text-2xl font-extrabold text-on-surface">{totalActions}</p>
            <p className="text-[11px] text-on-surface-variant font-bold uppercase tracking-wider">Action Items</p>
          </div>
        </div>
        <Link href="/cases" className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/10 flex items-center gap-4 hover:ring-2 hover:ring-orange-300 transition-all">
          <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
            <span className="material-symbols-outlined text-orange-600">assignment</span>
          </div>
          <div>
            <p className="text-2xl font-extrabold text-on-surface">{openCases.length}</p>
            <p className="text-[11px] text-on-surface-variant font-bold uppercase tracking-wider">Open Cases</p>
          </div>
        </Link>
        <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/10 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-yellow-100 flex items-center justify-center">
            <span className="material-symbols-outlined text-yellow-700">event_upcoming</span>
          </div>
          <div>
            <p className="text-2xl font-extrabold text-on-surface">{expiringLeases.length}</p>
            <p className="text-[11px] text-on-surface-variant font-bold uppercase tracking-wider">Lease Follow-ups</p>
          </div>
        </div>
        <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/10 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
            <span className="material-symbols-outlined text-red-600">payments</span>
          </div>
          <div>
            <p className="text-2xl font-extrabold text-on-surface">{lateOnRent.length}</p>
            <p className="text-[11px] text-on-surface-variant font-bold uppercase tracking-wider">Late on Rent</p>
          </div>
        </div>
      </div>

      {/* Open Cases Section */}
      <section className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 overflow-hidden">
        <div className="px-6 py-4 border-b border-outline-variant/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-orange-600">assignment</span>
            <h2 className="text-lg font-bold text-on-surface">Open Cases</h2>
            <span className="bg-orange-100 text-orange-700 text-[11px] font-bold px-2 py-0.5 rounded-full">{openCases.length}</span>
          </div>
          <Link href="/cases" className="text-sm font-semibold text-primary hover:underline underline-offset-4 decoration-2">
            View all cases
          </Link>
        </div>
        {openCases.length === 0 ? (
          <div className="px-6 py-8 text-center text-on-surface-variant text-sm">No open cases. All clear.</div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant/20">
                <th className="px-6 py-3 text-[11px] font-bold text-outline uppercase tracking-wider">Urgency</th>
                <th className="px-6 py-3 text-[11px] font-bold text-outline uppercase tracking-wider">Subject</th>
                <th className="px-6 py-3 text-[11px] font-bold text-outline uppercase tracking-wider">Property</th>
                <th className="px-6 py-3 text-[11px] font-bold text-outline uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-[11px] font-bold text-outline uppercase tracking-wider">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {openCases.slice(0, 5).map((c) => (
                <tr key={c.id} className="hover:bg-primary-fixed/30 transition-colors">
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${URGENCY_DOT[c.urgency ?? "low"]}`} />
                      <span className="text-sm font-medium">{formatEnum(c.urgency ?? "low")}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <Link href={`/cases/${c.id}`} className="text-sm font-semibold text-on-surface hover:text-primary truncate block max-w-[300px]">
                      {c.rawMessage.length > 60 ? c.rawMessage.slice(0, 57) + "..." : c.rawMessage}
                    </Link>
                  </td>
                  <td className="px-6 py-3 text-sm text-on-surface-variant">
                    {propertyMap.get(c.propertyId ?? "") ?? "—"}
                  </td>
                  <td className="px-6 py-3">
                    <span className="text-sm font-medium">{formatEnum(c.status)}</span>
                  </td>
                  <td className="px-6 py-3 text-xs text-outline">{timeAgo(c.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {openCases.length > 5 && (
          <div className="px-6 py-3 border-t border-outline-variant/10 text-center">
            <Link href="/cases" className="text-sm font-semibold text-primary hover:underline underline-offset-4 decoration-2">
              +{openCases.length - 5} more open cases
            </Link>
          </div>
        )}
      </section>

      {/* Lease Follow-ups Section */}
      <section className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 overflow-hidden">
        <div className="px-6 py-4 border-b border-outline-variant/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-yellow-700">event_upcoming</span>
            <h2 className="text-lg font-bold text-on-surface">Lease Renewals</h2>
            <span className="bg-yellow-100 text-yellow-700 text-[11px] font-bold px-2 py-0.5 rounded-full">{expiringLeases.length}</span>
          </div>
          <Link href="/tenants" className="text-sm font-semibold text-primary hover:underline underline-offset-4 decoration-2">
            View all tenants
          </Link>
        </div>
        {expiringLeases.length === 0 ? (
          <div className="px-6 py-8 text-center text-on-surface-variant text-sm">No leases expiring in the next 90 days.</div>
        ) : (
          <div className="divide-y divide-outline-variant/10">
            {expiringLeases.map((t) => {
              const colors = getLeaseUrgencyColor(t.daysLeft);
              return (
                <Link key={t.id} href={`/tenants/${t.id}`} className="flex items-center gap-4 px-6 py-4 hover:bg-primary-fixed/30 transition-colors">
                  <div className={`w-10 h-10 rounded-lg ${colors.bg} flex items-center justify-center`}>
                    <span className={`material-symbols-outlined ${colors.text} text-lg`}>calendar_today</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-on-surface">{t.name}</p>
                    <p className="text-xs text-on-surface-variant truncate">
                      {propertyMap.get(t.propertyId) ?? "Unknown"} — Unit {t.unitNumber ?? "N/A"}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-bold ${colors.bg} ${colors.text}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
                      {t.daysLeft}d left
                    </div>
                    <p className="text-[10px] text-on-surface-variant mt-0.5">
                      Expires {t.leaseEnd!.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* Late on Rent Section */}
      <section className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 overflow-hidden">
        <div className="px-6 py-4 border-b border-outline-variant/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-red-600">payments</span>
            <h2 className="text-lg font-bold text-on-surface">Late on Rent</h2>
            <span className="bg-red-100 text-red-700 text-[11px] font-bold px-2 py-0.5 rounded-full">{lateOnRent.length}</span>
          </div>
          <Link href="/tenants" className="text-sm font-semibold text-primary hover:underline underline-offset-4 decoration-2">
            View all tenants
          </Link>
        </div>
        {lateOnRent.length === 0 ? (
          <div className="px-6 py-8 text-center text-on-surface-variant text-sm">All tenants are current on rent.</div>
        ) : (
          <div className="divide-y divide-outline-variant/10">
            {lateOnRent.map((t) => (
              <Link key={t.id} href={`/tenants/${t.id}`} className="flex items-center gap-4 px-6 py-4 hover:bg-primary-fixed/30 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
                  <span className="material-symbols-outlined text-red-600 text-lg">warning</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-on-surface">{t.name}</p>
                  <p className="text-xs text-on-surface-variant truncate">
                    {propertyMap.get(t.propertyId) ?? "Unknown"} — Unit {t.unitNumber ?? "N/A"}
                  </p>
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-error/10 text-error border border-error/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-error" />
                  Late
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* The Wealth Architect Overview — moved from Profile */}
      <section className="bg-surface-container-lowest rounded-xl p-8 border-l-4 border-primary relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-20 -mt-20 blur-3xl" />
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-10">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-bold uppercase tracking-wider">AI System Active</div>
                <h2 className="text-2xl font-bold tracking-tight">The Wealth Architect Overview</h2>
              </div>
              <p className="text-on-surface-variant text-sm max-w-md italic">Autonomous property management assistant currently monitoring your active listings.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-surface-container-low p-5 rounded-lg border-l-2 border-primary-fixed-dim">
              <span className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant block mb-3">Status</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-lg font-bold">Active &amp; Learning</span>
              </div>
            </div>
            <div className="bg-surface-container-low p-5 rounded-lg border-l-2 border-primary-fixed-dim">
              <span className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant block mb-3">Confidence</span>
              <div className="flex items-end gap-1">
                <span className="text-3xl font-extrabold leading-none">94.8</span>
                <span className="text-sm font-bold text-on-surface-variant mb-0.5">%</span>
              </div>
            </div>
            <div className="bg-surface-container-low p-5 rounded-lg border-l-2 border-primary-fixed-dim">
              <span className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant block mb-3">Decision Speed</span>
              <div className="flex items-end gap-1">
                <span className="text-3xl font-extrabold leading-none">1.2</span>
                <span className="text-sm font-bold text-on-surface-variant mb-0.5">sec</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Performance Metrics — moved from Profile */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface-container-low p-8 rounded-xl flex flex-col justify-between h-48">
          <span className="material-symbols-outlined text-primary text-3xl">bolt</span>
          <div>
            <h3 className="text-4xl font-black tracking-tighter">1,284</h3>
            <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Cases Automated</p>
          </div>
        </div>
        <div className="bg-surface-container-low p-8 rounded-xl flex flex-col justify-between h-48">
          <span className="material-symbols-outlined text-primary text-3xl">schedule</span>
          <div>
            <h3 className="text-4xl font-black tracking-tighter">312<span className="text-xl font-medium">h</span></h3>
            <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Time Saved</p>
          </div>
        </div>
        <div className="bg-surface-container-low p-8 rounded-xl flex flex-col justify-between h-48">
          <div className="flex justify-between items-start">
            <span className="material-symbols-outlined text-primary text-3xl">sentiment_very_satisfied</span>
            <span className="bg-surface-container text-on-surface-variant text-[10px] px-2 py-0.5 rounded-full font-bold">+4%</span>
          </div>
          <div>
            <h3 className="text-4xl font-black tracking-tighter">4.9</h3>
            <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Tenant Satisfaction</p>
          </div>
        </div>
      </section>
    </div>
  );
}
