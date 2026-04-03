"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { deleteTenantAction } from "@/app/(dashboard)/tenants/actions";
import { TenantForm } from "@/components/tenants/tenant-form";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { formatEnum, timeAgo } from "@/lib/utils";

type SerializedTenant = {
  id: string;
  propertyId: string;
  orgId: string;
  name: string;
  email: string | null;
  phone: string | null;
  unitNumber: string | null;
  leaseStart: string | null;
  leaseEnd: string | null;
  createdAt: string;
  updatedAt: string;
};

type SerializedProperty = {
  id: string;
  orgId: string;
  address: string;
  unitCount: number | null;
  type: "residential" | "commercial";
  accessInstructions: string | null;
  parkingInstructions: string | null;
  unitAccessNotes: string | null;
  specialInstructions: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
} | null;

type SerializedCase = {
  id: string;
  orgId: string;
  tenantId: string | null;
  propertyId: string | null;
  source: "email" | "sms";
  rawMessage: string;
  category: string | null;
  urgency: string | null;
  confidenceScore: number | null;
  status: string;
  spendingAuthorized: number | null;
  spendingApprovedBy: string | null;
  vendorId: string | null;
  createdAt: string;
  updatedAt: string;
  resolvedAt: string | null;
  closedAt: string | null;
  messages: {
    id: string;
    createdAt: string;
    updatedAt: string;
    [key: string]: unknown;
  }[];
};

type Property = {
  id: string;
  address: string;
};

// Mock payment history data
const paymentHistory = [
  {
    date: "Oct 01, 2023",
    description: "Monthly Rent - October",
    amount: "$3,200.00",
    status: "Paid",
    statusColor: "bg-primary/10 text-primary",
  },
  {
    date: "Sep 01, 2023",
    description: "Monthly Rent - September",
    amount: "$3,200.00",
    status: "Paid",
    statusColor: "bg-primary/10 text-primary",
  },
  {
    date: "Aug 03, 2023",
    description: "Monthly Rent - August",
    amount: "$3,200.00",
    status: "Late",
    statusColor: "bg-error/10 text-error",
  },
];

// Mock tenant documents for prototype
const MOCK_DOCS = [
  { name: "Signed Lease Agreement", type: "Lease", date: "Jan 15, 2023", icon: "description" },
  { name: "Move-In Inspection Report", type: "Inspection", date: "Jan 20, 2023", icon: "fact_check" },
  { name: "Government ID (Verified)", type: "Identity", date: "Jan 10, 2023", icon: "badge" },
];

export function TenantDetailClient({
  tenant,
  property,
  cases,
  properties,
}: {
  tenant: SerializedTenant;
  property: SerializedProperty;
  cases: SerializedCase[];
  properties: Property[];
}) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, startDeleteTransition] = useTransition();
  const [uploadedDocs, setUploadedDocs] = useState<string[]>([]);
  const [previewDoc, setPreviewDoc] = useState<string | null>(null);

  const tenantForForm = {
    ...tenant,
    leaseStart: tenant.leaseStart ? new Date(tenant.leaseStart) : null,
    leaseEnd: tenant.leaseEnd ? new Date(tenant.leaseEnd) : null,
  };

  const leaseEndFormatted = tenant.leaseEnd
    ? new Date(tenant.leaseEnd).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "N/A";

  const activeCases = cases.filter(
    (c) => !["resolved", "closed"].includes(c.status)
  );

  function handleDelete() {
    startDeleteTransition(async () => {
      await deleteTenantAction(tenant.id);
    });
  }

  return (
    <div className="p-10 max-w-7xl mx-auto space-y-12">
      {/* Hero Section: Asymmetric Editorial Style */}
      <section className="grid grid-cols-12 gap-8 items-end">
        <div className="col-span-12 lg:col-span-8 space-y-4">
          <Link
            href="/tenants"
            className="flex items-center gap-2 text-primary hover:text-primary/80 font-bold text-sm mb-6 transition-colors group"
          >
            <span className="material-symbols-outlined text-lg group-hover:-translate-x-1 transition-transform">
              arrow_back
            </span>
            <span className="group-hover:underline underline-offset-4 decoration-2">Back to Tenants</span>
          </Link>
          <div className="flex items-center gap-4 mb-2">
            <span className="bg-surface-container text-on-surface-variant px-4 py-1 rounded-full text-xs font-bold tracking-widest uppercase">
              Resident Status
            </span>
            <span className="flex items-center gap-1.5 text-primary font-bold text-sm">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              Active
            </span>
          </div>
          <h2 className="text-6xl font-extrabold tracking-tighter text-on-surface leading-none">
            {tenant.name}
          </h2>
          <p className="text-2xl font-light text-on-surface-variant font-['Plus_Jakarta_Sans']">
            {property?.address ?? "Unknown Property"} — Unit{" "}
            {tenant.unitNumber ?? "N/A"}
          </p>
        </div>
        <div className="col-span-12 lg:col-span-4 flex justify-end gap-3">
          <button
            onClick={() => setShowEditModal(true)}
            className="px-6 py-3 bg-surface-container-lowest text-on-surface rounded-lg font-bold shadow-sm flex items-center gap-2 hover:bg-surface-container-low transition-colors h-fit"
          >
            <span className="material-symbols-outlined text-sm">edit</span>
            Edit Tenant
          </button>
          <button
            onClick={() => setShowDeleteDialog(true)}
            className="px-4 py-3 bg-surface-container-lowest text-error rounded-lg font-bold shadow-sm flex items-center gap-2 hover:bg-error-container transition-colors h-fit"
          >
            <span className="material-symbols-outlined text-sm">delete</span>
          </button>
        </div>
      </section>

      {/* Quick Stats: Tonal Layering */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-surface-container-lowest p-6 rounded-xl border-l-4 border-primary">
          <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">
            Current Rent
          </p>
          <p className="text-3xl font-extrabold text-on-surface">
            $3,200
            <span className="text-sm font-medium text-on-surface-variant">/mo</span>
          </p>
        </div>
        <div className="bg-surface-container-low p-6 rounded-xl">
          <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">
            Lease End
          </p>
          <p className="text-3xl font-extrabold text-on-surface">
            {leaseEndFormatted}
          </p>
        </div>
        <div className="bg-surface-container-low p-6 rounded-xl">
          <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">
            Payment Status
          </p>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">
              check_circle
            </span>
            <p className="text-3xl font-extrabold text-on-surface">Paid</p>
          </div>
        </div>
        <div className="bg-surface-container-low p-6 rounded-xl">
          <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">
            Maintenance
          </p>
          <p className="text-3xl font-extrabold text-on-surface">
            {activeCases.length}{" "}
            <span className="text-sm font-medium text-on-surface-variant">
              Active
            </span>
          </p>
          <p className="text-xs text-on-surface-variant mt-1">
            {cases.length} total
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="space-y-8">
          {/* Lease Terms Card */}
          <div className="bg-surface-container-lowest p-8 rounded-2xl space-y-6">
            <div className="flex justify-between items-end">
              <h3 className="text-2xl font-bold tracking-tight">
                Lease Information
              </h3>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setPreviewDoc("Lease Agreement — " + tenant.name)}
                  className="group flex items-center gap-1.5 text-primary font-semibold text-sm"
                >
                  <span className="material-symbols-outlined text-base">description</span>
                  <span className="group-hover:underline underline-offset-4 decoration-2">View Lease</span>
                </button>
                <button
                  onClick={() => setPreviewDoc("Lease Agreement — " + tenant.name)}
                  className="group flex items-center gap-1.5 text-on-surface-variant font-semibold text-sm hover:text-primary transition-colors"
                >
                  <span className="material-symbols-outlined text-base">download</span>
                  <span className="group-hover:underline underline-offset-4 decoration-2">Download</span>
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-y-8 gap-x-12">
              <div>
                <p className="label-md text-[10px] uppercase font-bold text-on-surface-variant tracking-widest mb-1">
                  Security Deposit
                </p>
                <p className="text-xl font-semibold">$3,200.00</p>
              </div>
              <div>
                <p className="label-md text-[10px] uppercase font-bold text-on-surface-variant tracking-widest mb-1">
                  Lease Term
                </p>
                <p className="text-xl font-semibold">12 Months (Fixed)</p>
              </div>
              <div className="col-span-2">
                <p className="label-md text-[10px] uppercase font-bold text-on-surface-variant tracking-widest mb-2">
                  Included Utilities
                </p>
                <div className="flex gap-4">
                  <span className="bg-surface-container-high px-3 py-1 rounded text-xs font-medium">
                    High-speed Fiber
                  </span>
                  <span className="bg-surface-container-high px-3 py-1 rounded text-xs font-medium">
                    Water &amp; Trash
                  </span>
                  <span className="bg-surface-container-high px-3 py-1 rounded text-xs font-medium">
                    Gym Access
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment History Table (The Architectural Ledger) */}
          <div className="bg-surface-container-lowest overflow-hidden rounded-2xl">
            <div className="p-8 pb-4">
              <h3 className="text-2xl font-bold tracking-tight">
                Payment History
              </h3>
            </div>
            <table className="w-full text-left">
              <thead className="bg-surface-container-low text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                <tr>
                  <th className="px-8 py-4">Date</th>
                  <th className="px-8 py-4">Description</th>
                  <th className="px-8 py-4">Amount</th>
                  <th className="px-8 py-4">Status</th>
                  <th className="px-8 py-4 text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {paymentHistory.map((payment, i) => (
                  <tr
                    key={i}
                    className="group hover:bg-surface-container-low/50 transition-colors"
                  >
                    <td className="px-8 py-6 text-sm font-medium">
                      {payment.date}
                    </td>
                    <td className="px-8 py-6 text-sm text-on-surface-variant">
                      {payment.description}
                    </td>
                    <td className="px-8 py-6 text-sm font-bold">
                      {payment.amount}
                    </td>
                    <td className="px-8 py-6">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${payment.statusColor}`}
                      >
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button className="material-symbols-outlined text-on-surface-variant hover:text-primary">
                        download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Tenant Documents */}
          <div className="bg-surface-container-lowest p-8 rounded-2xl space-y-6">
            <div className="flex justify-between items-end">
              <h3 className="text-2xl font-bold tracking-tight">Documents</h3>
              <label className="group text-primary font-semibold text-sm cursor-pointer flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">upload_file</span>
                <span className="group-hover:underline underline-offset-4 decoration-2">Upload</span>
                <input type="file" className="hidden" onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setUploadedDocs((prev) => [...prev, file.name]);
                  e.target.value = "";
                }} />
              </label>
            </div>
            <div className="space-y-3">
              {MOCK_DOCS.map((doc) => (
                <button
                  key={doc.name}
                  onClick={() => setPreviewDoc(doc.name)}
                  className="w-full flex items-center justify-between p-4 bg-surface-container-low rounded-xl hover:bg-primary-fixed transition-colors text-left group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary-fixed flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined">{doc.icon}</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors">{doc.name}</p>
                      <p className="text-[10px] text-on-surface-variant uppercase">{doc.type} &middot; {doc.date}</p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-on-surface-variant text-sm opacity-0 group-hover:opacity-100 transition-opacity">open_in_new</span>
                </button>
              ))}
              {uploadedDocs.map((doc) => (
                <button
                  key={doc}
                  onClick={() => setPreviewDoc(doc)}
                  className="w-full flex items-center justify-between p-4 bg-surface-container-low rounded-xl hover:bg-primary-fixed transition-colors text-left group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary-fixed flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined">upload_file</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors">{doc}</p>
                      <p className="text-[10px] text-on-surface-variant uppercase">Uploaded &middot; Just now</p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-on-surface-variant text-sm opacity-0 group-hover:opacity-100 transition-opacity">open_in_new</span>
                </button>
              ))}
            </div>
          </div>

        {/* Active Requests */}
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold tracking-tight">
              Active Requests
            </h3>
            <button className="bg-surface-container-high p-2 rounded-lg hover:bg-surface-container-highest transition-colors">
              <span className="material-symbols-outlined text-sm">add</span>
            </button>
          </div>
          <div className="space-y-4">
            {/* Request Card 1 */}
            {activeCases.length > 0 ? (
              activeCases.map((c) => (
                <Link
                  key={c.id}
                  href={`/cases/${c.id}`}
                  className="block bg-surface-container-lowest p-6 rounded-2xl shadow-sm border-l-4 border-primary hover:shadow-md hover:border-primary/80 transition-all"
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                      {c.category ? formatEnum(c.category) : "General"}
                    </span>
                    <span className="bg-primary-fixed text-primary text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                      {formatEnum(c.status)}
                    </span>
                  </div>
                  <h4 className="font-bold text-lg mb-1">
                    {c.category ? formatEnum(c.category) : "Case"}
                  </h4>
                  <p className="text-sm text-on-surface-variant mb-4">
                    {c.rawMessage.length > 100
                      ? c.rawMessage.slice(0, 100) + "..."
                      : c.rawMessage}
                  </p>
                  <div className="flex items-center gap-2 pt-4 border-t border-outline-variant/10">
                    <span className="material-symbols-outlined text-on-surface-variant text-sm">
                      event
                    </span>
                    <span className="text-xs text-on-surface-variant">
                      Submitted {timeAgo(new Date(c.createdAt))}
                    </span>
                  </div>
                </Link>
              ))
            ) : (
              <>
                {/* Static fallback cards matching Stitch design */}
                <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border-l-4 border-primary">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                      Plumbing
                    </span>
                    <span className="bg-primary-fixed text-primary text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                      In Progress
                    </span>
                  </div>
                  <h4 className="font-bold text-lg mb-1">Clogged Sink</h4>
                  <p className="text-sm text-on-surface-variant mb-4">
                    Kitchen island sink draining slowly. Maintenance assigned:
                    Mike R.
                  </p>
                  <div className="flex items-center gap-2 pt-4 border-t border-outline-variant/10">
                    <span className="material-symbols-outlined text-on-surface-variant text-sm">
                      event
                    </span>
                    <span className="text-xs text-on-surface-variant">
                      Submitted 2 days ago
                    </span>
                  </div>
                </div>
                {/* Request Card 2 */}
                <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border-l-4 border-outline-variant">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                      Electrical
                    </span>
                    <span className="bg-surface-container-low text-on-surface-variant text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                      Scheduled
                    </span>
                  </div>
                  <h4 className="font-bold text-lg mb-1">Kitchen Light</h4>
                  <p className="text-sm text-on-surface-variant mb-4">
                    Under-cabinet LED strip flickering. Scheduled for Thursday
                    AM.
                  </p>
                  <div className="flex items-center gap-2 pt-4 border-t border-outline-variant/10">
                    <span className="material-symbols-outlined text-on-surface-variant text-sm">
                      calendar_today
                    </span>
                    <span className="text-xs text-on-surface-variant">
                      Oct 26, 10:00 AM
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>

      </div>

      {/* Sticky FAB: Contextual to Tenant Portal */}
      <div className="fixed bottom-10 right-10">
        <button
          onClick={() => setShowEditModal(true)}
          className="group flex items-center gap-2 bg-primary text-white p-4 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300"
        >
          <span
            className="material-symbols-outlined"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            chat
          </span>
          <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 font-bold px-0 group-hover:px-2">
            Message Manager
          </span>
        </button>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <TenantForm
          properties={properties}
          tenant={tenantForForm}
          onClose={() => setShowEditModal(false)}
        />
      )}

      {/* Document Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-on-surface/50" onClick={() => setPreviewDoc(null)} />
          <div className="relative bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-on-surface">{previewDoc}</h2>
              <button onClick={() => setPreviewDoc(null)} className="text-outline hover:text-on-surface transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="bg-surface-container-low p-6 rounded-lg min-h-[200px] flex items-center justify-center">
              <div className="text-center text-on-surface-variant">
                <span className="material-symbols-outlined text-4xl mb-3 block">description</span>
                <p className="text-sm font-medium">Document preview</p>
                <p className="text-xs mt-1">Full document viewer would render here</p>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button className="px-5 py-2.5 bg-surface-container-high text-on-surface rounded-lg font-bold text-sm hover:bg-surface-container-highest transition-all flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">download</span>
                Download
              </button>
              <button onClick={() => setPreviewDoc(null)} className="px-6 py-2.5 bg-primary text-on-primary rounded-lg font-bold text-sm shadow-lg hover:opacity-90 transition-all">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Delete Tenant"
        description={`Are you sure you want to delete ${tenant.name}? This action cannot be undone.`}
        confirmLabel="Delete"
        loading={isDeleting}
      />
    </div>
  );
}
