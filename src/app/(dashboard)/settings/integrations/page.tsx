"use client";
import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import PageHeader from "@/components/PageHeader";
import AnimatedTabs from "@/components/AnimatedTabs";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function IntegrationsPage() {
  const pathname = usePathname();
  const [chaseDisconnected, setChaseDisconnected] = useState(false);
  const [wellsCancelled, setWellsCancelled] = useState(false);
  const [amexReconnecting, setAmexReconnecting] = useState<"idle" | "loading" | "done">("idle");
  const [vanguardDisconnected, setVanguardDisconnected] = useState(false);

  return (
    <AppLayout>
      <PageHeader
        title="Settings"
        subtitle="Manage your account and preferences"
      />
      <AnimatedTabs
        layoutId="settings-tabs"
        variant="underline"
        tabs={[
          { label: "Account", href: "/settings" },
          { label: "Categories", href: "/settings/categories" },
          { label: "Integrations", href: "/settings/integrations" },
          { label: "Notifications", href: "/settings/notifications" },
          { label: "Users", href: "/settings/users" },
        ]}
        activeValue={pathname}
      />

      {/* Bank Connections Section */}
      <section className="space-y-6 max-w-4xl">
        <h3 className="text-[20px] font-semibold text-on-surface">Bank Connections</h3>

        <div className="grid grid-cols-1 gap-6">
          {/* Chase Bank */}
          <div className="bg-surface-container-lowest p-6 rounded-xl card-shadow flex items-center justify-between group">
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                <span aria-hidden="true" className="material-symbols-outlined text-[28px]">account_balance</span>
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <span className="text-base font-semibold text-on-surface">Chase Bank</span>
                  <span className="px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100">
                    Connected
                  </span>
                </div>
                <p className="text-xs text-on-surface-variant mt-1">Synced 2 min ago</p>
              </div>
            </div>
            <button
              onClick={() => { setChaseDisconnected(true); setTimeout(() => setChaseDisconnected(false), 2000); }}
              aria-live="polite"
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
                chaseDisconnected ? "bg-surface-container-high text-on-surface-variant" : "text-error hover:bg-error-container/20"
              }`}
            >
              {chaseDisconnected && <span aria-hidden="true" className="material-symbols-outlined text-[14px]">check</span>}
              {chaseDisconnected ? "Disconnected" : "Disconnect"}
            </button>
          </div>

          {/* Wells Fargo */}
          <div className="bg-surface-container-lowest p-6 rounded-xl card-shadow flex items-center justify-between">
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-red-50 text-red-700">
                <span aria-hidden="true" className="material-symbols-outlined text-[28px]">account_balance</span>
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <span className="text-base font-semibold text-on-surface">Wells Fargo</span>
                  <span className="flex items-center gap-1.5 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 rounded-full border border-blue-100">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
                    Syncing
                  </span>
                </div>
                <p className="text-xs text-on-surface-variant mt-1 italic">In progress...</p>
              </div>
            </div>
            <button
              onClick={() => { setWellsCancelled(true); setTimeout(() => setWellsCancelled(false), 2000); }}
              aria-live="polite"
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
                wellsCancelled ? "bg-amber-50 text-amber-700" : "text-on-surface-variant hover:bg-surface-container-high"
              }`}
            >
              {wellsCancelled && <span aria-hidden="true" className="material-symbols-outlined text-[14px]">check</span>}
              {wellsCancelled ? "Cancelled" : "Cancel"}
            </button>
          </div>

          {/* American Express */}
          <div className="bg-surface-container-lowest p-6 rounded-xl card-shadow flex items-center justify-between border-l-4 border-error">
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-inverse-surface text-inverse-on-surface">
                <span aria-hidden="true" className="material-symbols-outlined text-[28px]">credit_card</span>
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <span className="text-base font-semibold text-on-surface">American Express</span>
                  <span className="px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider bg-red-50 text-red-700 rounded-full border border-red-100">
                    Error
                  </span>
                </div>
                <p className="text-xs text-on-surface-variant mt-1">Last sync 3 days ago</p>
              </div>
            </div>
            <button
              onClick={() => {
                if (amexReconnecting !== "idle") return;
                setAmexReconnecting("loading");
                setTimeout(() => { setAmexReconnecting("done"); setTimeout(() => setAmexReconnecting("idle"), 2000); }, 1500);
              }}
              aria-live="polite"
              className={`px-5 py-2 text-sm font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                amexReconnecting === "done" ? "bg-emerald-500 text-white border border-emerald-500"
                : amexReconnecting === "loading" ? "bg-primary/10 text-primary border border-primary/20 cursor-wait"
                : "text-primary hover:bg-primary/10 border border-primary/20"
              }`}
            >
              {amexReconnecting === "done" && <span aria-hidden="true" className="material-symbols-outlined text-[14px]">check</span>}
              {amexReconnecting === "loading" && <span aria-hidden="true" className="material-symbols-outlined text-[14px] animate-spin">sync</span>}
              {amexReconnecting === "done" ? "Connected!" : amexReconnecting === "loading" ? "Connecting..." : "Reconnect"}
            </button>
          </div>

          {/* Vanguard */}
          <div className="bg-surface-container-lowest p-6 rounded-xl card-shadow flex items-center justify-between">
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-primary-fixed-dim text-primary">
                <span aria-hidden="true" className="material-symbols-outlined text-[28px]">monitoring</span>
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <span className="text-base font-semibold text-on-surface">Vanguard</span>
                  <span className="px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100">
                    Connected
                  </span>
                </div>
                <p className="text-xs text-on-surface-variant mt-1">Synced 4 hours ago</p>
              </div>
            </div>
            <button
              onClick={() => { setVanguardDisconnected(true); setTimeout(() => setVanguardDisconnected(false), 2000); }}
              aria-live="polite"
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
                vanguardDisconnected ? "bg-surface-container-high text-on-surface-variant" : "text-error hover:bg-error-container/20"
              }`}
            >
              {vanguardDisconnected && <span aria-hidden="true" className="material-symbols-outlined text-[14px]">check</span>}
              {vanguardDisconnected ? "Disconnected" : "Disconnect"}
            </button>
          </div>

          {/* Add Bank Card */}
          <Link href="/settings/integrations/add-bank" className="group w-full border-2 border-dashed border-outline-variant hover:border-primary/50 hover:bg-primary-fixed/20 transition-all duration-300 p-8 rounded-xl flex flex-col items-center justify-center gap-2">
            <div className="w-10 h-10 rounded-full bg-surface-container-high group-hover:bg-primary group-hover:text-white transition-colors flex items-center justify-center">
              <span aria-hidden="true" className="material-symbols-outlined text-lg">add</span>
            </div>
            <span className="text-sm font-semibold text-on-surface-variant group-hover:text-primary transition-colors">
              + Add Bank Account
            </span>
          </Link>
        </div>
      </section>
    </AppLayout>
  );
}
