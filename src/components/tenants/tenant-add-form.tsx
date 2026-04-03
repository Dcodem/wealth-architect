"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createTenantAction } from "@/app/(dashboard)/tenants/actions";

type Property = { id: string; address: string };
type FormState = { success?: boolean; error?: Record<string, string[]> | null };

export function TenantAddForm({ properties }: { properties: Property[] }) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(
    async (_prev: FormState, formData: FormData): Promise<FormState> => {
      const result = await createTenantAction(formData);
      if ("success" in result && result.success) {
        return { success: true };
      }
      return result as FormState;
    },
    { error: null }
  );

  useEffect(() => {
    if (state?.success) {
      router.push("/tenants");
    }
  }, [state?.success, router]);

  const errors = state?.error;

  return (
    <div className="flex-1 overflow-y-auto p-8 lg:p-12">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="mb-12">
          <div className="flex items-center gap-2 text-primary font-semibold text-xs uppercase tracking-widest mb-2">
            <span>Tenants</span>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <span>Registration</span>
          </div>
          <h1 className="text-4xl font-extrabold text-on-surface tracking-tight mb-4">Add New Tenant</h1>
          <p className="text-on-surface-variant max-w-2xl leading-relaxed">Register a new tenant into the The Wealth Architect ecosystem. Assign them to a property and unit for streamlined communication and case management.</p>
        </div>
        {/* Form Canvas */}
        <form action={formAction} className="space-y-12">
          {/* Primary Upload Action Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:sticky lg:top-24">
              <h2 className="text-xl font-bold text-on-surface mb-1">Quick Registration</h2>
              <p className="text-sm text-on-surface-variant">Fast-track onboarding by uploading existing lease documentation.</p>
            </div>
            <div className="lg:col-span-2">
              <div className="border-2 border-dashed border-primary/30 rounded-xl p-10 text-center bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer group">
                <span className="material-symbols-outlined text-5xl text-primary mb-4 block group-hover:scale-110 transition-transform">cloud_upload</span>
                <h3 className="text-lg font-bold text-on-surface mb-2">Create Tenant by Uploading Lease or Document</h3>
                <p className="text-sm text-on-surface-variant mb-6">Our AI will automatically extract tenant details, lease dates, and contact information for you.</p>
                <button className="bg-primary text-on-primary px-8 py-2.5 rounded-lg font-bold text-sm shadow-lg shadow-primary/20 hover:shadow-xl transition-all" type="button">Browse Local Files</button>
                <p className="text-[10px] text-outline mt-4 uppercase tracking-widest font-semibold">Supported: PDF, JPG, PNG (Max 20MB)</p>
              </div>
            </div>
          </div>
          {/* Section 1: Personal Information */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start pt-8 border-t border-outline-variant/10">
            <div className="lg:sticky lg:top-24">
              <h2 className="text-xl font-bold text-on-surface mb-1">Personal Information</h2>
              <p className="text-sm text-on-surface-variant">Core identification and contact details for the tenant.</p>
            </div>
            <div className="lg:col-span-2 bg-surface-container-lowest rounded-xl p-8 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">Tenant Name</label>
                  <input name="name" className="w-full bg-surface-container-low border-0 border-l-2 border-transparent focus:border-primary focus:ring-0 rounded-lg p-3 text-on-surface transition-all" placeholder="e.g. John Smith" type="text" />
                  {errors?.name && <p className="text-xs text-error mt-1">{errors.name[0]}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">Phone Number</label>
                  <input name="phone" className="w-full bg-surface-container-low border-0 border-l-2 border-transparent focus:border-primary focus:ring-0 rounded-lg p-3 text-on-surface transition-all" placeholder="+1 (555) 000-0000" type="tel" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">Email Address</label>
                  <input name="email" className="w-full bg-surface-container-low border-0 border-l-2 border-transparent focus:border-primary focus:ring-0 rounded-lg p-3 text-on-surface transition-all" placeholder="tenant@email.com" type="email" />
                  {errors?.email && <p className="text-xs text-error mt-1">{errors.email[0]}</p>}
                </div>
              </div>
            </div>
          </div>
          {/* Section 2: Property Assignment */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div>
              <h2 className="text-xl font-bold text-on-surface mb-1">Property Assignment</h2>
              <p className="text-sm text-on-surface-variant">Assign the tenant to a property and specific unit.</p>
            </div>
            <div className="lg:col-span-2 bg-surface-container-lowest rounded-xl p-8 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">Property</label>
                  <select name="propertyId" className="w-full bg-surface-container-low border-0 border-l-2 border-transparent focus:border-primary focus:ring-0 rounded-lg p-3 text-on-surface transition-all">
                    <option value="">Select Property</option>
                    {properties.map((p) => (
                      <option key={p.id} value={p.id}>{p.address}</option>
                    ))}
                  </select>
                  {errors?.propertyId && <p className="text-xs text-error mt-1">{errors.propertyId[0]}</p>}
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">Unit Number</label>
                  <input name="unitNumber" className="w-full bg-surface-container-low border-0 border-l-2 border-transparent focus:border-primary focus:ring-0 rounded-lg p-3 text-on-surface transition-all" placeholder="e.g. 12B" type="text" />
                </div>
              </div>
            </div>
          </div>
          {/* Section 3: Lease Details */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div>
              <h2 className="text-xl font-bold text-on-surface mb-1">Lease Details</h2>
              <p className="text-sm text-on-surface-variant">Lease term and rental agreement dates.</p>
            </div>
            <div className="lg:col-span-2 bg-surface-container-lowest rounded-xl p-8 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">Lease Start Date</label>
                  <input name="leaseStart" className="w-full bg-surface-container-low border-0 border-l-2 border-transparent focus:border-primary focus:ring-0 rounded-lg p-3 text-on-surface transition-all" type="date" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">Lease End Date</label>
                  <input name="leaseEnd" className="w-full bg-surface-container-low border-0 border-l-2 border-transparent focus:border-primary focus:ring-0 rounded-lg p-3 text-on-surface transition-all" type="date" />
                </div>
              </div>
            </div>
          </div>
          {/* Section 4: Compliance & Documents */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div>
              <h2 className="text-xl font-bold text-on-surface mb-1">Compliance &amp; Documents</h2>
              <p className="text-sm text-on-surface-variant">Legal validation and documentation records.</p>
            </div>
            <div className="lg:col-span-2 bg-surface-container-lowest rounded-xl p-8 shadow-sm">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-surface-container-low rounded-lg">
                  <div className="col-span-2 flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase text-primary">Lease Agreement</span>
                    <span className="material-symbols-outlined text-green-600">verified_user</span>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-on-surface-variant mb-1">Document Reference</label>
                    <input className="w-full bg-surface-container-lowest border-0 border-l-2 border-transparent focus:border-primary focus:ring-0 rounded-lg p-2 text-sm" placeholder="LS-0012345" type="text" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-on-surface-variant mb-1">Upload Date</label>
                    <input className="w-full bg-surface-container-lowest border-0 border-l-2 border-transparent focus:border-primary focus:ring-0 rounded-lg p-2 text-sm" type="date" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-surface-container-low rounded-lg">
                  <div className="col-span-2 flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase text-primary">Renter&apos;s Insurance</span>
                    <span className="material-symbols-outlined text-outline">upload_file</span>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-on-surface-variant mb-1">Policy Number</label>
                    <input className="w-full bg-surface-container-lowest border-0 border-l-2 border-transparent focus:border-primary focus:ring-0 rounded-lg p-2 text-sm" placeholder="RI-998877" type="text" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-on-surface-variant mb-1">Expiration Date</label>
                    <input className="w-full bg-surface-container-lowest border-0 border-l-2 border-transparent focus:border-primary focus:ring-0 rounded-lg p-2 text-sm" type="date" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Error Banner */}
          {errors && (
            <div className="bg-error-container text-on-error-container rounded-lg px-4 py-3 text-sm font-medium">
              Please fix the errors above and try again.
            </div>
          )}

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-4 pt-8 mt-12 border-t border-outline-variant/20">
            <Link href="/tenants" className="px-8 py-3 bg-surface-container-high text-on-surface font-semibold rounded-lg hover:bg-surface-container-highest transition-colors active:scale-95">
              Cancel
            </Link>
            <button disabled={isPending} className="px-10 py-3 bg-primary text-on-primary font-bold rounded-lg shadow-xl shadow-primary/10 active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none" type="submit">
              {isPending ? "Saving..." : "Save Tenant"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
