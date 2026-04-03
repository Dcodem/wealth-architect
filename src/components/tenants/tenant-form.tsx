"use client";

import { useActionState, useEffect, useRef } from "react";
import { createTenantAction, updateTenantAction } from "@/app/(dashboard)/tenants/actions";

type Property = {
  id: string;
  address: string;
};

type Tenant = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  propertyId: string;
  unitNumber: string | null;
  leaseStart: Date | null;
  leaseEnd: Date | null;
};

type FormState = { success: boolean } | { error: Record<string, string[]> | string } | null;

function formatDateForInput(date: Date | null) {
  if (!date) return "";
  return date.toISOString().split("T")[0];
}

async function handleCreate(_prev: FormState, formData: FormData): Promise<FormState> {
  return createTenantAction(formData) as Promise<FormState>;
}

async function handleUpdate(_prev: FormState, formData: FormData): Promise<FormState> {
  const id = formData.get("id") as string;
  formData.delete("id");
  return updateTenantAction(id, formData) as Promise<FormState>;
}

export function TenantForm({
  properties,
  tenant,
  onClose,
}: {
  properties: Property[];
  tenant?: Tenant | null;
  onClose: () => void;
}) {
  const isEditing = !!tenant;
  const [state, formAction, isPending] = useActionState(
    isEditing ? handleUpdate : handleCreate,
    null
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state && "success" in state && state.success) {
      onClose();
    }
  }, [state, onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Modal */}
      <div className="relative bg-surface-container-lowest rounded-lg shadow-xl w-full max-w-lg mx-4 p-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-extrabold text-on-surface tracking-tight">
            {isEditing ? "Edit Tenant" : "Add Tenant"}
          </h3>
          <button
            onClick={onClose}
            className="text-outline hover:text-on-surface-variant p-1"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form ref={formRef} action={formAction} className="space-y-4">
          {isEditing && <input type="hidden" name="id" value={tenant.id} />}

          {/* Lease Upload to Auto-Populate */}
          {!isEditing && (
            <div className="bg-primary-fixed/40 border border-primary/10 rounded-xl p-4 mb-2">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-lg">upload_file</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-on-surface">Upload Lease Document</p>
                  <p className="text-[11px] text-on-surface-variant">Upload a lease to auto-populate tenant details</p>
                </div>
              </div>
              <label className="block cursor-pointer">
                <div className="border-2 border-dashed border-primary/20 rounded-lg p-3 text-center hover:border-primary/40 hover:bg-primary/5 transition-all">
                  <span className="text-xs font-medium text-primary">Click to upload PDF or image</span>
                </div>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="hidden"
                  onChange={() => {
                    // Prototype: in production this would parse the lease via AI
                  }}
                />
              </label>
            </div>
          )}

          {/* Name */}
          <div>
            <label className="block text-[11px] font-bold text-on-surface-variant uppercase tracking-widest mb-1.5">
              Name *
            </label>
            <input
              name="name"
              type="text"
              required
              defaultValue={tenant?.name ?? ""}
              className="w-full bg-surface-container-low border border-outline-variant/20 rounded py-2 px-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-outline"
              placeholder="Full name"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-[11px] font-bold text-on-surface-variant uppercase tracking-widest mb-1.5">
              Email
            </label>
            <input
              name="email"
              type="email"
              defaultValue={tenant?.email ?? ""}
              className="w-full bg-surface-container-low border border-outline-variant/20 rounded py-2 px-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-outline"
              placeholder="email@example.com"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-[11px] font-bold text-on-surface-variant uppercase tracking-widest mb-1.5">
              Phone
            </label>
            <input
              name="phone"
              type="tel"
              defaultValue={tenant?.phone ?? ""}
              className="w-full bg-surface-container-low border border-outline-variant/20 rounded py-2 px-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-outline"
              placeholder="555-0123"
            />
          </div>

          {/* Property */}
          <div>
            <label className="block text-[11px] font-bold text-on-surface-variant uppercase tracking-widest mb-1.5">
              Property *
            </label>
            <select
              name="propertyId"
              required
              defaultValue={tenant?.propertyId ?? ""}
              className="w-full bg-surface-container-low border border-outline-variant/20 rounded py-2 px-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            >
              <option value="">Select property...</option>
              {properties.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.address}
                </option>
              ))}
            </select>
          </div>

          {/* Unit Number */}
          <div>
            <label className="block text-[11px] font-bold text-on-surface-variant uppercase tracking-widest mb-1.5">
              Unit Number
            </label>
            <input
              name="unitNumber"
              type="text"
              defaultValue={tenant?.unitNumber ?? ""}
              className="w-full bg-surface-container-low border border-outline-variant/20 rounded py-2 px-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-outline"
              placeholder="e.g. 12B"
            />
          </div>

          {/* Lease Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-on-surface-variant uppercase tracking-widest mb-1.5">
                Lease Start
              </label>
              <input
                name="leaseStart"
                type="date"
                defaultValue={formatDateForInput(tenant?.leaseStart ?? null)}
                className="w-full bg-surface-container-low border border-outline-variant/20 rounded py-2 px-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-on-surface-variant uppercase tracking-widest mb-1.5">
                Lease End
              </label>
              <input
                name="leaseEnd"
                type="date"
                defaultValue={formatDateForInput(tenant?.leaseEnd ?? null)}
                className="w-full bg-surface-container-low border border-outline-variant/20 rounded py-2 px-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
          </div>

          {/* Error display */}
          {state && "error" in state && (
            <div className="text-sm text-error bg-error-container border border-error/20 rounded px-3 py-2">
              {typeof state.error === "string"
                ? state.error
                : "Please fix the errors above."}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 text-sm font-bold text-on-surface-variant bg-surface-container-lowest border border-outline-variant/20 rounded hover:bg-surface-container-low transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 bg-primary hover:opacity-90 text-on-primary font-bold py-2.5 px-4 rounded flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
            >
              {isPending ? (
                "Saving..."
              ) : isEditing ? (
                "Update Tenant"
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">
                    person_add
                  </span>
                  Add Tenant
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
