"use client";
import AppLayout from "@/components/AppLayout";
import PageHeader from "@/components/PageHeader";
import AnimatedTabs from "@/components/AnimatedTabs";
import AnimatedToggle from "@/components/AnimatedToggle";
import { usePathname } from "next/navigation";
import { useState } from "react";

const groups = [
  {
    label: "Transaction Alerts",
    bg: "",
    items: [
      { name: "New transaction detected", email: true, inApp: true },
      { name: "Large transaction alert (>$1,000)", email: true, inApp: true },
      { name: "Duplicate transaction warning", email: true, inApp: true },
    ],
  },
  {
    label: "Reports",
    bg: "bg-surface-container-low/30",
    items: [
      { name: "Monthly report ready", email: true, inApp: true },
      { name: "Export completed", email: false, inApp: false },
    ],
  },
  {
    label: "System",
    bg: "",
    items: [
      { name: "Bank sync errors", email: true, inApp: true },
      { name: "AI review suggestions ready", email: false, inApp: false },
    ],
  },
];

export default function NotificationsPage() {
  const pathname = usePathname();
  const [prefsSaved, setPrefsSaved] = useState(false);

  const handleSavePrefs = () => {
    setPrefsSaved(true);
    setTimeout(() => setPrefsSaved(false), 2000);
  };

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

      <div className="max-w-4xl space-y-8">
        {/* Notification Settings Table */}
        <div className="bg-surface-container-lowest rounded-xl card-shadow overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-[1fr_120px_120px] px-8 py-5 bg-surface-container-low text-[12px] font-bold text-on-surface-variant uppercase tracking-wider">
            <div>Setting Name</div>
            <div className="text-center">Email</div>
            <div className="text-center">In-App</div>
          </div>

          {/* Groups */}
          {groups.map((group) => (
            <div key={group.label} className={`px-8 py-6 ${group.bg}`}>
              <h3 className="font-headline text-sm font-bold text-primary mb-4">
                {group.label}
              </h3>
              <div className="space-y-6">
                {group.items.map((item) => (
                  <div
                    key={item.name}
                    className="grid grid-cols-[1fr_120px_120px] items-center"
                  >
                    <div className="text-sm font-medium text-on-surface">{item.name}</div>
                    <div className="flex justify-center">
                      <AnimatedToggle defaultOn={item.email} />
                    </div>
                    <div className="flex justify-center">
                      <AnimatedToggle defaultOn={item.inApp} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSavePrefs}
            aria-live="polite"
            className={`px-8 py-3 rounded-lg font-bold shadow-lg transition-all flex items-center gap-2 ${
              prefsSaved
                ? "bg-success-container0 text-white shadow-success/20"
                : "bg-gradient-to-br from-primary to-primary-container text-white hover:shadow-primary/20 hover:-translate-y-0.5 active:translate-y-0"
            }`}
          >
            <span aria-hidden="true" className="material-symbols-outlined text-[18px]">{prefsSaved ? "check" : "save"}</span>
            {prefsSaved ? "Saved!" : "Save Preferences"}
          </button>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-surface-container-high/50 rounded-xl flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-primary-fixed-dim flex items-center justify-center text-primary shrink-0">
              <span aria-hidden="true" className="material-symbols-outlined">security</span>
            </div>
            <div>
              <h4 className="font-bold text-sm text-on-surface mb-1">Privacy Focused</h4>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Notification content is encrypted and only visible to authorized accounts. Transaction details in emails can be masked for additional security.
              </p>
            </div>
          </div>
          <div className="p-6 bg-surface-container-high/50 rounded-xl flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-primary-fixed-dim flex items-center justify-center text-primary shrink-0">
              <span aria-hidden="true" className="material-symbols-outlined">bolt</span>
            </div>
            <div>
              <h4 className="font-bold text-sm text-on-surface mb-1">Real-time Delivery</h4>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                In-app notifications appear within 2 seconds of the event. Email alerts are dispatched via our priority enterprise network.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
