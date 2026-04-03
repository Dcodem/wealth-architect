"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { updateVendorAction } from "@/app/(dashboard)/vendors/actions";
import { VENDOR_TRADES } from "@/lib/constants";
import { formatEnum } from "@/lib/utils";

type Vendor = {
  id: string;
  name: string;
  trade: string;
  email: string | null;
  phone: string | null;
  rateNotes: string | null;
  availabilityNotes: string | null;
  preferenceScore: number | null;
};

type FormState = { success?: boolean; error?: Record<string, string[]> | null };

export function VendorEditForm({ vendor }: { vendor: Vendor }) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(
    async (_prev: FormState, formData: FormData): Promise<FormState> => {
      const result = await updateVendorAction(vendor.id, formData);
      if ("success" in result && result.success) {
        return { success: true };
      }
      return result as FormState;
    },
    { error: null }
  );

  useEffect(() => {
    if (state?.success) {
      router.push(`/vendors/${vendor.id}`);
    }
  }, [state?.success, router, vendor.id]);

  const errors = state?.error;

  return (
    <div className="pt-8 pb-12 px-12">
      {/* Editorial Header */}
      <div className="flex justify-between items-end mb-12">
        <div>
          <span className="uppercase tracking-[0.2em] text-on-surface-variant font-bold text-[10px] mb-2 block">Vendor Management / Edit Profile</span>
          <h1 className="text-5xl font-extrabold tracking-tighter text-on-surface">{vendor.name}</h1>
        </div>
        <div className="flex gap-4">
          <Link href={`/vendors/${vendor.id}`} className="px-6 py-3 bg-surface-container-high text-on-surface font-bold text-sm rounded-lg hover:bg-surface-container-highest transition-colors">Cancel</Link>
          <button form="vendor-edit-form" disabled={isPending} className="px-8 py-3 bg-primary text-on-primary font-bold text-sm rounded-lg shadow-lg active:scale-95 transition-transform disabled:opacity-50 disabled:pointer-events-none" type="submit">
            {isPending ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
      <div className="grid grid-cols-12 gap-8">
        {/* Form Canvas */}
        <div className="col-span-8 space-y-12">
          <form id="vendor-edit-form" action={formAction}>
            {/* Section: General Information */}
            <section className="mb-12">
              <div className="flex items-center gap-4 mb-8">
                <h2 className="text-xl font-bold text-on-surface">General Information</h2>
                <div className="h-[1px] flex-1 bg-surface-container-high"></div>
              </div>
              <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                <div className="space-y-2 group">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Company Name</label>
                  <div className="bg-surface-container-low p-0.5 transition-all focus-within:bg-surface-container-highest focus-within:border-l-2 focus-within:border-primary">
                    <input name="name" className="w-full bg-transparent border-none focus:ring-0 py-3 px-4 font-medium" type="text" defaultValue={vendor.name} />
                  </div>
                  {errors?.name && <p className="text-xs text-error">{errors.name[0]}</p>}
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Trade Sector</label>
                  <div className="bg-surface-container-low p-0.5 transition-all focus-within:bg-surface-container-highest focus-within:border-l-2 focus-within:border-primary">
                    <select name="trade" className="w-full bg-transparent border-none focus:ring-0 py-3 px-4 font-medium appearance-none" defaultValue={vendor.trade}>
                      {VENDOR_TRADES.map((trade) => (
                        <option key={trade} value={trade}>{formatEnum(trade)}</option>
                      ))}
                    </select>
                  </div>
                  {errors?.trade && <p className="text-xs text-error">{errors.trade[0]}</p>}
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Tax ID / EIN</label>
                  <div className="bg-surface-container-low p-0.5 transition-all focus-within:bg-surface-container-highest focus-within:border-l-2 focus-within:border-primary">
                    <input className="w-full bg-transparent border-none focus:ring-0 py-3 px-4 font-medium" type="text" defaultValue="XX-XXX4492" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Website</label>
                  <div className="bg-surface-container-low p-0.5 transition-all focus-within:bg-surface-container-highest focus-within:border-l-2 focus-within:border-primary">
                    <input className="w-full bg-transparent border-none focus:ring-0 py-3 px-4 font-medium text-primary" type="url" placeholder="https://example.com" />
                  </div>
                </div>
                <div className="col-span-2 space-y-2">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Business Phone</label>
                  <div className="bg-surface-container-low p-0.5 transition-all focus-within:bg-surface-container-highest focus-within:border-l-2 focus-within:border-primary">
                    <input name="phone" className="w-full bg-transparent border-none focus:ring-0 py-3 px-4 font-medium" type="tel" defaultValue={vendor.phone ?? ""} />
                  </div>
                </div>
              </div>
            </section>
            {/* Section: Contact Details */}
            <section className="mb-12">
              <div className="flex items-center gap-4 mb-8">
                <h2 className="text-xl font-bold text-on-surface">Contact Details</h2>
                <div className="h-[1px] flex-1 bg-surface-container-high"></div>
              </div>
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Primary Contact Name</label>
                  <div className="bg-surface-container-low p-0.5 transition-all focus-within:bg-surface-container-highest focus-within:border-l-2 focus-within:border-primary">
                    <input className="w-full bg-transparent border-none focus:ring-0 py-3 px-4 font-medium" type="text" placeholder="Contact name" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Email Address</label>
                  <div className="bg-surface-container-low p-0.5 transition-all focus-within:bg-surface-container-highest focus-within:border-l-2 focus-within:border-primary">
                    <input name="email" className="w-full bg-transparent border-none focus:ring-0 py-3 px-4 font-medium" type="email" defaultValue={vendor.email ?? ""} />
                  </div>
                  {errors?.email && <p className="text-xs text-error">{errors.email[0]}</p>}
                </div>
              </div>
            </section>
            {/* Section: Service Area */}
            <section>
              <div className="flex items-center gap-4 mb-6">
                <h2 className="text-xl font-bold text-on-surface">Service Area</h2>
                <div className="h-[1px] flex-1 bg-surface-container-high"></div>
              </div>
              <div className="bg-surface-container-low p-6 rounded-lg space-y-6">
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-2 bg-surface-container text-on-surface-variant px-4 py-2 rounded-full text-xs font-bold uppercase tracking-tight">
                    Chicago, IL
                    <button type="button" className="material-symbols-outlined text-sm hover:text-error transition-colors">close</button>
                  </span>
                  <span className="inline-flex items-center gap-2 bg-surface-container text-on-surface-variant px-4 py-2 rounded-full text-xs font-bold uppercase tracking-tight">
                    North Suburbs
                    <button type="button" className="material-symbols-outlined text-sm hover:text-error transition-colors">close</button>
                  </span>
                  <span className="inline-flex items-center gap-2 bg-surface-container text-on-surface-variant px-4 py-2 rounded-full text-xs font-bold uppercase tracking-tight">
                    Evanston
                    <button type="button" className="material-symbols-outlined text-sm hover:text-error transition-colors">close</button>
                  </span>
                  <button type="button" className="inline-flex items-center gap-1 border border-dashed border-outline-variant text-on-surface-variant px-4 py-2 rounded-full text-xs font-bold hover:bg-surface-container-high transition-colors">
                    <span className="material-symbols-outlined text-sm">add</span> Add Region
                  </button>
                </div>
                <div className="relative h-64 w-full rounded-xl overflow-hidden grayscale contrast-125 opacity-80 bg-surface-container">
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-6xl text-primary/30">map</span>
                  </div>
                  <div className="absolute inset-0 bg-primary/10 mix-blend-multiply"></div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="h-12 w-12 bg-primary/20 rounded-full animate-pulse flex items-center justify-center">
                      <div className="h-4 w-4 bg-primary rounded-full ring-4 ring-white"></div>
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider shadow-sm">
                    Service Hub: Downtown Chicago
                  </div>
                </div>
              </div>
            </section>

            {/* Hidden fields for schema compliance */}
            <input type="hidden" name="rateNotes" value={vendor.rateNotes ?? ""} />
            <input type="hidden" name="availabilityNotes" value={vendor.availabilityNotes ?? ""} />
            <input type="hidden" name="preferenceScore" value={String(vendor.preferenceScore ?? 0.5)} />
          </form>
        </div>
        {/* Sidebar Info Rails */}
        <div className="col-span-4 space-y-8">
          {/* Compliance Card */}
          <div className="bg-surface-container-lowest p-8 border border-outline-variant/10 shadow-sm">
            <h3 className="font-bold text-lg mb-6">Compliance &amp; Insurance</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">General Liability</p>
                  <p className="text-sm font-medium">Expires: Oct 2024</p>
                </div>
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-tighter">Active</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Workers Comp</p>
                  <p className="text-sm font-medium">Expires: Dec 2024</p>
                </div>
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-tighter">Active</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Trade License</p>
                  <p className="text-sm font-medium text-error font-bold">Expires: In 3 Days</p>
                </div>
                <span className="bg-error/10 text-error px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-tighter">Urgent</span>
              </div>
            </div>
            <button type="button" className="w-full mt-8 flex items-center justify-center gap-2 py-3 bg-surface-container-high text-on-surface font-bold text-xs uppercase tracking-widest rounded hover:bg-surface-container-highest transition-colors">
              <span className="material-symbols-outlined text-sm">upload_file</span>
              Update Certificates
            </button>
          </div>
          {/* Modification History */}
          <div className="px-2">
            <h3 className="font-bold text-sm uppercase tracking-[0.15em] mb-6 text-on-surface-variant">Modification History</h3>
            <div className="relative space-y-8 before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-[2px] before:bg-surface-container-high">
              <div className="relative pl-8">
                <div className="absolute left-0 top-1.5 h-4 w-4 rounded-full bg-primary border-4 border-surface"></div>
                <p className="text-xs font-bold">Profile Details Updated</p>
                <p className="text-[10px] text-on-surface-variant">By Admin (Sarah K.) &bull; 2h ago</p>
              </div>
              <div className="relative pl-8">
                <div className="absolute left-0 top-1.5 h-4 w-4 rounded-full bg-surface-container-high border-4 border-surface"></div>
                <p className="text-xs font-medium text-on-surface-variant">Insurance Certificate Renewed</p>
                <p className="text-[10px] text-on-surface-variant">System Automated &bull; May 12, 2024</p>
              </div>
              <div className="relative pl-8">
                <div className="absolute left-0 top-1.5 h-4 w-4 rounded-full bg-surface-container-high border-4 border-surface"></div>
                <p className="text-xs font-medium text-on-surface-variant">Bank Account Changed</p>
                <p className="text-[10px] text-on-surface-variant">By Jonathan Miller &bull; Apr 28, 2024</p>
              </div>
            </div>
          </div>
          {/* Quick Actions */}
          <div className="bg-surface-container-low p-6 rounded-lg border-l-4 border-primary">
            <p className="text-xs italic text-on-surface-variant mb-4">&ldquo;High-priority vendor for North Suburbs expansion project.&rdquo;</p>
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full overflow-hidden bg-surface-container-high flex items-center justify-center">
                <span className="material-symbols-outlined text-sm text-on-surface-variant">person</span>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-tight">Assigned Manager</p>
                <p className="text-xs font-medium">David Chen</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {errors && (
        <div className="fixed bottom-6 right-6 bg-error-container text-on-error-container rounded-lg px-6 py-3 text-sm font-medium shadow-lg">
          Please fix the errors and try again.
        </div>
      )}
    </div>
  );
}
