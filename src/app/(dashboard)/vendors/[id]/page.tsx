import { notFound } from "next/navigation";
import { getOrgId } from "@/lib/db/queries/helpers";
import { getVendor } from "@/lib/db/queries/vendors";
import { db } from "@/lib/db";
import { cases } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { formatEnum, timeAgo } from "@/lib/utils";
import Link from "next/link";
import { VendorHistoryClient } from "@/components/vendors/vendor-history-client";

export default async function VendorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const orgId = await getOrgId();

  const vendor = await getVendor(id, orgId);
  if (!vendor) notFound();

  const vendorCases = await db
    .select()
    .from(cases)
    .where(and(eq(cases.vendorId, id), eq(cases.orgId, orgId)));

  const activeCases = vendorCases.filter(
    (c) => c.status === "open" || c.status === "in_progress" || c.status === "waiting_on_vendor" || c.status === "waiting_on_tenant"
  );
  const closedCases = vendorCases.filter(
    (c) => c.status === "resolved" || c.status === "closed"
  );

  const initials = vendor.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const partnerSince = new Date(vendor.createdAt).getFullYear();
  const score = vendor.preferenceScore ?? 0.5;
  const scoreDisplay = (score * 10).toFixed(1);

  return (
    <main className="pt-8 pb-24 px-12 max-w-[1600px] mx-auto min-h-screen">
      <div className="max-w-7xl mx-auto p-8">
        {/* Header Section: Profile & Actions */}
        <header className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
          <div className="flex items-center gap-8">
            <div className="relative group">
              <div className="w-32 h-32 rounded-xl overflow-hidden bg-surface-container-high ring-4 ring-white shadow-xl flex items-center justify-center">
                <span className="text-4xl font-extrabold text-primary">{initials}</span>
              </div>
              <div className="absolute -bottom-2 -right-2 bg-primary text-white p-1 rounded-full border-2 border-white">
                <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-3">
                <h1 className="text-4xl font-extrabold tracking-tighter text-on-surface">{vendor.name}</h1>
                <span className="bg-surface-container text-on-surface-variant px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider">Verified</span>
              </div>
              <p className="text-lg text-on-surface-variant font-medium">{formatEnum(vendor.trade)} Specialist</p>
              <div className="flex items-center gap-4 mt-2 text-sm text-outline">
                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">location_on</span> Greater Austin, TX — 25 mi radius</span>
                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">calendar_today</span> Partner since {partnerSince}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            {vendor.email && (
              <a href={`mailto:${vendor.email}`} className="px-6 py-2.5 bg-surface-container-high text-on-surface font-semibold text-sm rounded transition-colors hover:bg-surface-container-highest flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">mail</span>
                Message
              </a>
            )}
            <Link href={`/vendors/${vendor.id}/edit`} className="px-6 py-2.5 bg-primary text-on-primary font-semibold text-sm rounded shadow-md hover:opacity-90 transition-opacity flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">edit</span>
              Edit Profile
            </Link>
          </div>
        </header>

        {/* Bento Grid Metrics */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-surface-container-lowest p-6 rounded-xl border-l-4 border-primary shadow-sm flex flex-col justify-between">
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Avg Response</span>
            <div className="mt-4">
              <span className="text-4xl font-extrabold text-primary tracking-tighter">42m</span>
              <div className="text-xs text-on-surface-variant mt-1 flex items-center gap-1">
                <span className="material-symbols-outlined text-xs text-green-600">trending_down</span>
                12% faster than last month
              </div>
            </div>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm flex flex-col justify-between">
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Jobs Completed</span>
            <div className="mt-4">
              <span className="text-4xl font-extrabold text-on-surface tracking-tighter">{closedCases.length.toLocaleString()}</span>
              <div className="text-xs text-on-surface-variant mt-1">Across {new Set(vendorCases.map(c => c.propertyId).filter(Boolean)).size} properties</div>
            </div>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm flex flex-col justify-between">
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Compliance</span>
            <div className="mt-4">
              <span className="text-4xl font-extrabold text-on-surface tracking-tighter">100%</span>
              <div className="text-xs text-on-surface-variant mt-1 text-green-600 font-semibold uppercase tracking-tighter">Fully Insured</div>
            </div>
          </div>
          <div className="bg-primary p-6 rounded-xl shadow-lg flex flex-col justify-between text-white">
            <span className="text-xs font-bold text-white/80 uppercase tracking-widest">Partner Score</span>
            <div className="mt-4">
              <span className="text-4xl font-extrabold tracking-tighter">{scoreDisplay}</span>
              <div className="flex gap-0.5 mt-1">
                <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              </div>
            </div>
          </div>
        </section>

        {/* Main Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left Column: Active & History */}
          <div className="lg:col-span-2 space-y-8">
            {/* Active Jobs Section */}
            <div className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm">
              <div className="px-8 py-6 border-b border-outline-variant/10">
                <h2 className="text-xl font-bold text-on-surface font-headline tracking-tight">Active Assignments</h2>
              </div>
              <div className="divide-y divide-outline-variant/10">
                {activeCases.length === 0 && (
                  <div className="px-8 py-6 text-sm text-on-surface-variant">No active assignments.</div>
                )}
                {activeCases.map((c) => (
                  <div key={c.id} className="px-8 py-6 hover:bg-surface-container-low transition-colors group">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-primary uppercase tracking-wider mb-1">{formatEnum(c.status)}</span>
                        <h4 className="text-base font-bold text-on-surface">{c.category ? formatEnum(c.category) : "Case"}: #{c.id.slice(0, 8).toUpperCase()}</h4>
                      </div>
                      <span className="text-sm text-on-surface-variant font-medium">{timeAgo(c.createdAt)}</span>
                    </div>
                    <p className="text-sm text-on-surface-variant mb-4 line-clamp-2">{c.rawMessage}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex -space-x-2">
                        <div className="w-8 h-8 rounded-full border-2 border-white bg-primary flex items-center justify-center text-[10px] font-bold text-white">
                          {initials.charAt(0)}
                        </div>
                        <div className="w-8 h-8 rounded-full border-2 border-white bg-surface-container-low flex items-center justify-center text-[10px] font-bold text-on-surface-variant">
                          +{Math.max(1, activeCases.length - 1)}
                        </div>
                      </div>
                      <Link href={`/cases/${c.id}`} className="text-primary font-bold text-sm flex items-center gap-1 group">
                        <span className="group-hover:underline underline-offset-4 decoration-2">View Details</span> <span className="material-symbols-outlined text-base">chevron_right</span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Work History */}
            <VendorHistoryClient
              closedCases={closedCases.map((c) => ({
                id: c.id,
                category: c.category,
                rawMessage: c.rawMessage,
                status: c.status,
                spendingAuthorized: c.spendingAuthorized,
                resolvedAt: c.resolvedAt?.toISOString() ?? null,
                createdAt: c.createdAt.toISOString(),
              }))}
              initials={initials}
            />
          </div>

          {/* Right Column: Contact & Map Info */}
          <div className="space-y-8">
            {/* Contact & Map Info */}
            <div className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm">
              <div className="h-32 bg-surface-container relative">
                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-4xl text-primary/40">map</span>
                </div>
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="absolute bottom-4 left-4 bg-white px-3 py-1 rounded shadow-lg text-xs font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs text-primary">location_on</span>
                  Headquarters
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-start gap-4">
                  <span className="material-symbols-outlined text-on-surface-variant">location_on</span>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Service Area</div>
                    <div className="text-sm font-medium text-on-surface">Greater Austin, TX</div>
                    <div className="text-xs text-on-surface-variant">25 mile radius from downtown</div>
                  </div>
                </div>
                {vendor.phone && (
                  <div className="flex items-start gap-4">
                    <span className="material-symbols-outlined text-on-surface-variant">phone</span>
                    <div>
                      <div className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Phone</div>
                      <div className="text-sm font-medium text-on-surface">{vendor.phone}</div>
                    </div>
                  </div>
                )}
                {vendor.email && (
                  <div className="flex items-start gap-4">
                    <span className="material-symbols-outlined text-on-surface-variant">mail</span>
                    <div>
                      <div className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Email</div>
                      <div className="text-sm font-medium text-primary">{vendor.email}</div>
                    </div>
                  </div>
                )}
                {vendor.rateNotes && (
                  <div className="flex items-start gap-4">
                    <span className="material-symbols-outlined text-on-surface-variant">payments</span>
                    <div>
                      <div className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Rate Notes</div>
                      <div className="text-sm font-medium text-on-surface">{vendor.rateNotes}</div>
                    </div>
                  </div>
                )}
                {vendor.availabilityNotes && (
                  <div className="flex items-start gap-4">
                    <span className="material-symbols-outlined text-on-surface-variant">schedule</span>
                    <div>
                      <div className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Availability</div>
                      <div className="text-sm font-medium text-on-surface">{vendor.availabilityNotes}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
