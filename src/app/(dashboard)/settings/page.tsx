import { getOrgId, getCurrentUser } from "@/lib/db/queries/helpers";
import { getOrganization } from "@/lib/db/queries/organizations";
import { ConfidenceThresholdsForm } from "@/components/settings/confidence-thresholds-form";
import { SpendingLimitsForm } from "@/components/settings/spending-limits-form";
import { UrgencyTimersForm } from "@/components/settings/urgency-timers-form";
import { NotificationPreferencesForm } from "@/components/settings/notification-preferences-form";
import { SettingsTabsClient } from "@/components/settings/settings-tabs-client";

export const metadata = { title: "Settings | The Wealth Architect" };

export default async function SettingsPage() {
  const orgId = await getOrgId();
  const [org, user] = await Promise.all([
    getOrganization(orgId),
    getCurrentUser(),
  ]);

  const confidenceThresholds = org?.confidenceThresholds ?? {
    high: 0.85,
    medium: 0.5,
  };

  const defaultUrgencyTimers = org?.defaultUrgencyTimers ?? {
    critical: { vendorResponse: 15, reminder: 30, nextVendor: 60, pmEscalation: 120 },
    high: { vendorResponse: 30, reminder: 60, nextVendor: 120, pmEscalation: 240 },
    medium: { vendorResponse: 60, reminder: 120, nextVendor: 240, pmEscalation: 480 },
    low: { vendorResponse: 120, reminder: 240, nextVendor: 480, pmEscalation: 1440 },
  };

  const notificationPrefs = user?.notificationPreferences ?? {
    urgentChannel: "sms" as const,
    quietHoursStart: "22:00",
    quietHoursEnd: "07:00",
    quietHoursTimezone: "America/Los_Angeles",
  };

  return (
    <div className="max-w-[800px] mx-auto py-12 px-8">
      {/* Page Header */}
      <div className="mb-12 border-b border-outline-variant/20 pb-8">
        <h1 className="text-4xl font-extrabold text-on-surface tracking-tight font-headline">Settings</h1>
        <p className="text-on-surface-variant mt-2 font-medium">Configure your AI agent&apos;s operational parameters</p>
      </div>
      <SettingsTabsClient
        aiSettingsContent={
          <>
            <ConfidenceThresholdsForm defaults={confidenceThresholds} />
            <SpendingLimitsForm
              spendingLimit={org?.spendingLimit ?? 50000}
              emergencySpendingLimit={org?.emergencySpendingLimit ?? 100000}
            />
            <UrgencyTimersForm defaults={defaultUrgencyTimers} />
            <NotificationPreferencesForm defaults={notificationPrefs} />
          </>
        }
      />
      <footer className="mt-20 text-center border-t border-outline-variant/20 pt-10">
        <p className="text-[10px] text-outline font-bold uppercase tracking-[0.3em]">The Wealth Architect AI Dashboard</p>
      </footer>
    </div>
  );
}
