import { notFound } from "next/navigation";
import { getOrgId } from "@/lib/db/queries/helpers";
import { getCaseWithTimeline } from "@/lib/db/queries/cases";
import { getTenant } from "@/lib/db/queries/tenants";
import { getVendor, listVendors } from "@/lib/db/queries/vendors";
import { getProperty } from "@/lib/db/queries/properties";
import { getMessagesByCase } from "@/lib/db/queries/messages";
import { CaseTimeline } from "@/components/cases/case-timeline";
import { CaseMessages } from "@/components/cases/case-messages";
import { CaseSidebar } from "@/components/cases/case-sidebar";
import { CaseIssueDescription } from "@/components/cases/case-issue-description";
import { AddNoteForm } from "@/components/cases/add-note-form";
import { formatEnum, timeAgo } from "@/lib/utils";
import Link from "next/link";

export default async function CaseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const orgId = await getOrgId();

  const result = await getCaseWithTimeline(id, orgId);
  if (!result) notFound();

  const { case: caseData, timeline } = result;

  const [tenant, vendor, property, messages, allVendors] = await Promise.all([
    caseData.tenantId ? getTenant(caseData.tenantId, orgId) : null,
    caseData.vendorId ? getVendor(caseData.vendorId, orgId) : null,
    caseData.propertyId ? getProperty(caseData.propertyId, orgId) : null,
    getMessagesByCase(id, orgId),
    listVendors(orgId),
  ]);

  const urgencyLabel = caseData.urgency
    ? formatEnum(caseData.urgency)
    : "Unknown";
  const statusLabel = caseData.status
    ? formatEnum(caseData.status)
    : "Open";
  const categoryLabel = caseData.category
    ? formatEnum(caseData.category)
    : "General";

  const isHighUrgency =
    caseData.urgency === "critical" || caseData.urgency === "high";

  return (
    <main className="pt-8 pb-24 px-12 max-w-[1600px] mx-auto min-h-screen">
      {/* Breadcrumb & Header */}
      <div className="mb-14">
        <div className="flex items-center gap-3 text-sm text-on-surface-variant mb-4 font-medium uppercase tracking-wider">
          <span className="material-symbols-outlined text-base">home</span>
          <Link
            href="/cases"
            className="hover:text-primary cursor-pointer transition-colors"
          >
            Cases
          </Link>
          <span className="material-symbols-outlined text-base">
            chevron_right
          </span>
          <span className="text-primary font-bold">
            Case #{caseData.id.slice(0, 8).toUpperCase()}
          </span>
        </div>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-5xl font-extrabold text-on-surface tracking-tight leading-[1.1]">
              {categoryLabel}: {property?.address ?? "Unknown Property"}
            </h1>
            <p className="text-xl text-on-surface-variant mt-3 font-medium opacity-80">
              Reported by {tenant?.name ?? "Unknown Tenant"}
              {tenant?.unitNumber ? ` \u2022 Unit ${tenant.unitNumber}` : ""}
              {" \u2022 "}
              {timeAgo(caseData.createdAt)}
            </p>
          </div>
          <div className="flex gap-4">
            <span className="px-6 py-3 bg-primary-fixed text-on-surface rounded-full text-sm font-bold flex items-center gap-3 shadow-sm border border-outline-variant/10">
              <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></span>
              Status: {statusLabel}
            </span>
            {isHighUrgency && (
              <span className="px-6 py-3 bg-error-container text-on-error-container rounded-full text-sm font-bold shadow-sm">
                Priority: {urgencyLabel}
              </span>
            )}
            {!isHighUrgency && caseData.urgency && (
              <span className="px-6 py-3 bg-primary-fixed text-on-surface-variant rounded-full text-sm font-bold shadow-sm">
                Priority: {urgencyLabel}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-12 gap-12">
        {/* Left Column */}
        <div className="col-span-12 lg:col-span-8 space-y-12">
          {/* Tenant Request Tile */}
          <section className="bg-surface-container-lowest rounded-full p-6 mb-8 shadow-sm border border-outline-variant/10 flex items-center gap-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-extrabold border-4 border-primary/10 shadow-sm">
                {(tenant?.name ?? "?")
                  .split(" ")
                  .map((w) => w[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
            </div>
            <div className="flex-grow">
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-2xl font-extrabold text-on-surface tracking-tight font-headline">
                  {tenant?.name ?? "Unknown Tenant"}
                </h2>
                <span className="px-3 py-1 bg-primary/5 text-primary text-[10px] font-black uppercase tracking-widest rounded-full border border-primary/10">
                  Primary Tenant
                </span>
              </div>
              <div className="flex items-center gap-4 text-on-surface-variant font-medium">
                {tenant?.unitNumber && (
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-lg text-primary">
                      apartment
                    </span>
                    <span className="text-sm tracking-tight">
                      Unit {tenant.unitNumber}
                    </span>
                  </div>
                )}
                {tenant?.unitNumber && (
                  <div className="w-1 h-1 bg-outline-variant rounded-full"></div>
                )}
                {tenant?.leaseStart && (
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-lg text-primary">
                      verified_user
                    </span>
                    <span className="text-sm tracking-tight">
                      Resident since{" "}
                      {new Date(tenant.leaseStart).getFullYear()}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              {tenant?.phone && (
                <a
                  href={`tel:${tenant.phone}`}
                  className="p-3 text-primary hover:bg-primary/5 rounded-full transition-all border border-primary/20"
                >
                  <span className="material-symbols-outlined">call</span>
                </a>
              )}
              {tenant?.email && (
                <a
                  href={`mailto:${tenant.email}`}
                  className="p-3 text-primary hover:bg-primary/5 rounded-full transition-all border border-primary/20"
                >
                  <span className="material-symbols-outlined">mail</span>
                </a>
              )}
            </div>
          </section>

          {/* Issue Description */}
          <CaseIssueDescription
            rawMessage={caseData.rawMessage}
            category={caseData.category}
            messages={messages.map((m) => ({
              id: m.id,
              body: m.body,
              direction: m.direction,
              fromAddress: m.fromAddress,
              messageType: m.messageType,
              createdAt: m.createdAt.toISOString(),
            }))}
            tenantName={tenant?.name ?? "Tenant"}
            status={caseData.status}
          />

          {/* Interaction Timeline */}
          <CaseTimeline
            timeline={timeline.filter((e) => e.type !== "note")}
            caseId={caseData.id}
            caseStatus={caseData.status}
          />

          {/* Property Manager Notes */}
          <section className="bg-surface-container-lowest rounded-2xl p-10 shadow-sm border border-outline-variant/10">
            <div className="mb-8">
              <h2 className="text-2xl font-extrabold text-on-surface tracking-tight">Property Manager Notes</h2>
              <p className="text-sm text-on-surface-variant font-medium mt-1">Internal notes visible only to your team</p>
            </div>
            <AddNoteForm
              caseId={caseData.id}
              caseStatus={caseData.status}
              existingNotes={timeline
                .filter((e) => e.type === "note")
                .map((e) => ({
                  id: e.id,
                  text: e.details ?? "",
                  author: (e.metadata as Record<string, unknown>)?.author as string ?? "Property Manager",
                  timestamp: e.createdAt.toISOString(),
                }))}
            />
          </section>

          {/* Communication Log */}
          <CaseMessages messages={messages} />
        </div>

        {/* Right Column */}
        <CaseSidebar
          caseData={caseData}
          vendor={vendor}
          property={property}
          allVendors={allVendors}
        />
      </div>
    </main>
  );
}
